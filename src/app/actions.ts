"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Workout } from "@/lib/types";

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

export async function processImageAction(imageBase64: string): Promise<{ success: boolean; data?: Partial<Workout>; error?: string }> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { success: false, error: "Server API key not configured" };
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
