import { describe, it, expect } from 'vitest';
import { calculateStreak, getWeeklyProgress } from '../utils';
import { Workout } from '../types';
import { subDays, format } from 'date-fns';

const createWorkout = (date: string): Workout => ({
    id: '1',
    title: 'Test',
    date,
    createdAt: '',
    updatedAt: '',
    exercise_groups: [],
    sourceScreenshots: [],
});

describe('calculateStreak', () => {
    it('returns 0 for empty workouts', () => {
        expect(calculateStreak([])).toBe(0);
    });

    it('returns 1 for a single workout today', () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const workouts = [createWorkout(today)];
        expect(calculateStreak(workouts)).toBe(1);
    });

    it('returns 1 for a single workout yesterday', () => {
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
        const workouts = [createWorkout(yesterday)];
        expect(calculateStreak(workouts)).toBe(1);
    });

    it('returns 0 if last workout was 2 days ago', () => {
        const twoDaysAgo = format(subDays(new Date(), 2), 'yyyy-MM-dd');
        const workouts = [createWorkout(twoDaysAgo)];
        expect(calculateStreak(workouts)).toBe(0);
    });

    it('calculates streak correctly for consecutive days', () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
        const twoDaysAgo = format(subDays(new Date(), 2), 'yyyy-MM-dd');

        const workouts = [
            createWorkout(today),
            createWorkout(yesterday),
            createWorkout(twoDaysAgo)
        ];
        expect(calculateStreak(workouts)).toBe(3);
    });

    it('handles duplicate dates correctly', () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const workouts = [
            createWorkout(today),
            createWorkout(today)
        ];
        expect(calculateStreak(workouts)).toBe(1);
    });
});

describe('getWeeklyProgress', () => {
    it('counts workouts in current week', () => {
        // This test is slightly tricky because "current week" changes.
        // We'll assume the function uses startOfWeek(new Date(), { weekStartsOn: 1 })
        // We can mock the date or just add a workout for today.
        const today = format(new Date(), 'yyyy-MM-dd');
        const workouts = [createWorkout(today)];
        expect(getWeeklyProgress(workouts)).toBe(1);
    });
});
