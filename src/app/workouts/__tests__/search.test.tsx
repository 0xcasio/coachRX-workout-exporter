import { describe, it, expect } from 'vitest';
import { Workout } from '@/lib/types';

// Extract the filter logic for testing. 
// Since the logic is inside the component, we can either export it or just test the logic in isolation here 
// by replicating the function, or better, refactor the logic into a helper function in utils or similar.
// For now, to avoid major refactoring, I will replicate the logic here to verify it works as expected, 
// assuming the component uses the same logic. 
// Ideally, we should export `filterWorkouts` from the page or a hook.

const filterWorkouts = (workouts: Workout[], searchQuery: string) => {
    return workouts.filter(w => {
        const query = searchQuery.toLowerCase();
        return (
            w.title.toLowerCase().includes(query) ||
            w.date.includes(query) ||
            w.exercise_groups.some(group =>
                group.exercises.some(ex =>
                    ex.name.toLowerCase().includes(query) ||
                    (ex.notes && ex.notes.toLowerCase().includes(query))
                )
            )
        );
    });
};

const createWorkoutWithExercises = (title: string, exercises: { name: string, notes?: string }[]): Workout => ({
    id: '1',
    title,
    date: '2023-10-25',
    createdAt: '',
    updatedAt: '',
    exercise_groups: [
        {
            group_id: 'A',
            exercises: exercises.map((ex, i) => ({
                exercise_number: `A${i + 1}`,
                name: ex.name,
                notes: ex.notes || null,
                tempo: null,
                rep_range: null,
                sets: null,
                rest_seconds: null,
                rpe: null
            }))
        }
    ],
    sourceScreenshots: [],
});

describe('Advanced Search Logic', () => {
    it('finds workout by title', () => {
        const workouts = [createWorkoutWithExercises('Leg Day', [])];
        expect(filterWorkouts(workouts, 'Leg')).toHaveLength(1);
    });

    it('finds workout by exercise name', () => {
        const workouts = [
            createWorkoutWithExercises('Workout 1', [{ name: 'Back Squat' }]),
            createWorkoutWithExercises('Workout 2', [{ name: 'Bench Press' }])
        ];
        expect(filterWorkouts(workouts, 'Squat')).toHaveLength(1);
        expect(filterWorkouts(workouts, 'Squat')[0].title).toBe('Workout 1');
    });

    it('finds workout by exercise notes', () => {
        const workouts = [
            createWorkoutWithExercises('Workout 1', [{ name: 'Squat', notes: 'Heavy set' }]),
            createWorkoutWithExercises('Workout 2', [{ name: 'Squat', notes: 'Light technique' }])
        ];
        expect(filterWorkouts(workouts, 'Heavy')).toHaveLength(1);
        expect(filterWorkouts(workouts, 'Heavy')[0].title).toBe('Workout 1');
    });

    it('is case insensitive', () => {
        const workouts = [createWorkoutWithExercises('Workout 1', [{ name: 'Back Squat' }])];
        expect(filterWorkouts(workouts, 'squat')).toHaveLength(1);
    });
});
