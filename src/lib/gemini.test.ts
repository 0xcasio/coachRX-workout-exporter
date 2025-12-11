import { describe, it, expect } from 'vitest';
import { processImageWithGemini } from './gemini';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

describe('Gemini Integration', () => {
    it('should process a real workout image', async () => {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('Skipping Gemini integration test: No GEMINI_API_KEY found');
            return;
        }

        const imagePath = path.join(__dirname, '__fixtures__/test-workout.png');
        if (!fs.existsSync(imagePath)) {
            console.warn('Skipping Gemini integration test: No fixture image found at', imagePath);
            return;
        }

        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');

        console.log('Sending request to Gemini...');
        try {
            const result = await processImageWithGemini(apiKey, base64Image);

            console.log('Gemini response received.');
            expect(result).toBeDefined();
            expect(result.exercise_groups).toBeDefined();
            expect(Array.isArray(result.exercise_groups)).toBe(true);

            if (result.exercise_groups && result.exercise_groups.length > 0) {
                console.log(`Found ${result.exercise_groups.length} exercise groups.`);
                const firstGroup = result.exercise_groups[0];
                console.log(`First group ID: ${firstGroup.group_id}`);
                console.log(`First group exercises: ${firstGroup.exercises.length}`);
                if (firstGroup.exercises.length > 0) {
                    console.log(`First exercise: ${firstGroup.exercises[0].name}`);
                }
            } else {
                console.warn('Gemini returned no exercise groups (might be expected depending on image).');
            }

        } catch (error) {
            console.error('Gemini test failed:', error);
            throw error;
        }
    }, 45000); // 45s timeout
});
