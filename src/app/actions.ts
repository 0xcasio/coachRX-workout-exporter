"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Workout, ExerciseMetadata } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const GEMINI_MODEL = "gemini-2.0-flash";

const WORKOUT_EXTRACTION_PROMPT = `Analyze this CoachRX workout screenshot and extract ALL visible workout data.

Return a valid JSON object with this EXACT structure:

{
  "title": "string (program name like 'Accumulation 1 - Week 8 of 8')",
  "date": "string (YYYY-MM-DD format, use today if not visible)",
  "exercise_groups": [
    {
      "group_id": "string (single letter: A, B, C, or D)",
      "exercises": [
        {
          "exercise_number": "string (e.g., 'A1', 'B2')",
          "name": "string (full exercise name)",
          "tempo": "string (e.g., '3111', '30X1')",
          "rep_range": "string (e.g., '10-12', '8-10')",
          "sets": number (integer),
          "rest_seconds": number (integer),
          "notes": "string (weight used, e.g., '50lbs 10 reps' or 'Free weight')"
        }
      ]
    }
  ]
}

CRITICAL REQUIREMENTS:
1. Return ONLY the JSON object - no markdown, no explanations
2. Capture ALL exercises visible in the screenshot
3. Maintain exact structure - do not add or remove fields
4. Use null for any field you cannot read
5. Exercise groups (A, B, C, D) are supersets - exercises with same letter are done together
6. Tempo notation starts with @ symbol (e.g., @3111)
7. Rep range is written as "min-max" (e.g., "10-12")
8. Rest is in seconds (convert "Rest 60"" to 60)
9. Notes field contains user's logged weight/reps from their last set

VALIDATION:
- exercise_number must match pattern: [A-D][1-9]
- tempo must be 4 characters (numbers or X)
- sets and rest_seconds must be positive integers
- If multiple exercise groups exist, return them all`;

const MUSCLE_INFO_PROMPT = (exerciseName: string) => `Analyze the exercise "${exerciseName}" and provide detailed muscle targeting information.

Return a valid JSON object with this EXACT structure:
{
  "primary_muscles": ["array of primary muscle groups"],
  "secondary_muscles": ["array of secondary muscle groups"],
  "exercise_type": "string (e.g., Compound, Isolation, Cardio, Mobility)",
  "benefits": ["array of benefits like Strength, Hypertrophy, Power, Endurance, Mobility"],
  "description": "brief 2-3 sentence description of the exercise and its primary benefits"
}

CRITICAL REQUIREMENTS:
1. Return ONLY the JSON object - no markdown, no explanations
2. Use proper anatomical muscle names (e.g., "Quadriceps", "Pectoralis Major", "Latissimus Dorsi", "Deltoids", "Biceps", "Triceps")
3. Be specific and accurate about muscle targeting
4. Include all major muscle groups involved
5. Primary muscles are those directly and primarily engaged
6. Secondary muscles are those that assist or stabilize during the movement
7. Exercise type should be one of: Compound, Isolation, Cardio, Mobility, or Flexibility
8. Benefits should include relevant training adaptations (e.g., Strength, Hypertrophy, Power, Endurance, Mobility, Stability)`;

export async function processImageAction(imageBase64: string): Promise<{ success: boolean; data?: Partial<Workout>; error?: string }> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { success: false, error: "Server API key not configured" };
    }

    // Rate Limiting Check
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Authentication required" };
    }

    // Use Service Role to bypass RLS (avoids UUID casting issues with Clerk IDs)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const today = new Date().toISOString().split('T')[0];
    const { data: usageData, error: usageError } = await supabase
      .from('api_usage')
      .select('count')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();

    if (usageError) {
      console.error("Error checking usage:", usageError);
      // Fail open or closed? Closed is safer for billing.
      return { success: false, error: "Failed to check usage limits" };
    }

    const currentCount = usageData?.count || 0;
    if (currentCount >= 20) {
      return { success: false, error: "Daily limit reached (20 uploads/day). Please upgrade or wait until tomorrow." };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    let retries = 0;
    const maxRetries = 5; // Increased retries

    while (true) {
      try {
        const result = await model.generateContent([
          WORKOUT_EXTRACTION_PROMPT,
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg",
            },
          },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonString = text.replace(/```json\n|\n```/g, "").trim();

        const data = JSON.parse(jsonString);

        // Increment Usage Count
        await supabase.from('api_usage').upsert({
          user_id: userId,
          date: today,
          count: currentCount + 1
        }, { onConflict: 'user_id, date' });

        return { success: true, data };
      } catch (error: any) {
        if (error.status === 429 && retries < maxRetries) {
          retries++;
          // Increase delay significantly: 5s, 10s, 20s, 40s, 80s
          const delay = Math.pow(2, retries) * 2500;
          console.log(`Rate limited. Retrying in ${delay}ms... (Attempt ${retries}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        console.error("Gemini processing error details:", JSON.stringify(error, null, 2));
        throw error;
      }
    }
  } catch (error: any) {
    console.error("Gemini processing error:", error);
    const errorMessage = error.message || "Failed to process image";
    return { success: false, error: errorMessage.includes("429") ? "Rate limit exceeded. Please try again in a minute." : "Failed to process image." };
  }
}

export async function getExerciseMuscleInfo(exerciseName: string): Promise<ExerciseMetadata | null> {
  try {
    // Normalize exercise name (lowercase, trim)
    const normalizedName = exerciseName.toLowerCase().trim();
    
    if (!normalizedName) {
      return null;
    }

    // Use Service Role to bypass RLS for read/write operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if exercise metadata already exists in database
    const { data: existingData, error: fetchError } = await supabase
      .from('exercise_metadata')
      .select('*')
      .eq('exercise_name', normalizedName)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error("Error fetching exercise metadata:", fetchError);
      return null;
    }

    // If metadata exists, return it
    if (existingData) {
      return {
        id: existingData.id,
        exercise_name: existingData.exercise_name,
        primary_muscles: existingData.primary_muscles || [],
        secondary_muscles: existingData.secondary_muscles || [],
        exercise_type: existingData.exercise_type || undefined,
        benefits: existingData.benefits || [],
        description: existingData.description || undefined,
        created_at: existingData.created_at,
        updated_at: existingData.updated_at,
      };
    }

    // If not found, call Gemini API to get muscle information
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Gemini API key not configured");
      return null;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    try {
      const result = await model.generateContent([
        MUSCLE_INFO_PROMPT(exerciseName),
      ]);

      const response = await result.response;
      const text = response.text();

      // Clean up markdown code blocks if present
      const jsonString = text.replace(/```json\n|\n```|```/g, "").trim();

      const muscleData = JSON.parse(jsonString);

      // Validate required fields
      if (!muscleData.primary_muscles || !Array.isArray(muscleData.primary_muscles)) {
        console.error("Invalid response from Gemini: missing primary_muscles");
        return null;
      }

      // Prepare data for database insertion
      const metadataToInsert = {
        exercise_name: normalizedName,
        primary_muscles: muscleData.primary_muscles,
        secondary_muscles: muscleData.secondary_muscles || null,
        exercise_type: muscleData.exercise_type || null,
        benefits: muscleData.benefits || null,
        description: muscleData.description || null,
      };

      // Insert into database
      const { data: insertedData, error: insertError } = await supabase
        .from('exercise_metadata')
        .insert(metadataToInsert)
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting exercise metadata:", insertError);
        // Return the data even if insert fails, so user still gets the info
        return {
          id: '',
          exercise_name: normalizedName,
          primary_muscles: muscleData.primary_muscles,
          secondary_muscles: muscleData.secondary_muscles || [],
          exercise_type: muscleData.exercise_type || undefined,
          benefits: muscleData.benefits || [],
          description: muscleData.description || undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      // Return the inserted data
      return {
        id: insertedData.id,
        exercise_name: insertedData.exercise_name,
        primary_muscles: insertedData.primary_muscles || [],
        secondary_muscles: insertedData.secondary_muscles || [],
        exercise_type: insertedData.exercise_type || undefined,
        benefits: insertedData.benefits || [],
        description: insertedData.description || undefined,
        created_at: insertedData.created_at,
        updated_at: insertedData.updated_at,
      };
    } catch (error: any) {
      console.error("Error calling Gemini API for muscle info:", error);
      return null;
    }
  } catch (error: any) {
    console.error("Error in getExerciseMuscleInfo:", error);
    return null;
  }
}
