import { GoogleGenerativeAI } from "@google/generative-ai";
import { Workout } from "./types";

export const GEMINI_MODEL = "gemini-2.0-flash";

export const WORKOUT_EXTRACTION_PROMPT = `Analyze this CoachRX workout screenshot and extract ALL visible workout data.

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

export async function processImageWithGemini(
  apiKey: string,
  imageBase64: string
): Promise<Partial<Workout>> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  // Remove data URL prefix if present
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  const result = await model.generateContent([
    WORKOUT_EXTRACTION_PROMPT,
    {
      inlineData: {
        data: base64Data,
        mimeType: "image/png", // Assuming PNG for now, can be dynamic
      },
    },
  ]);

  const response = await result.response;
  const text = response.text();

  // Clean up markdown code blocks if present
  const jsonString = text.replace(/```json\n|\n```/g, "").trim();

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("Failed to parse workout data from image");
  }
}
