import { Workout } from "./types";

const STORAGE_KEY = "coachrx_workouts";

export const storage = {
    getWorkouts: (): Workout[] => {
        if (typeof window === "undefined") return [];
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    saveWorkout: (workout: Workout) => {
        const workouts = storage.getWorkouts();
        // Check if workout already exists (by ID) and update, or add new
        const index = workouts.findIndex((w) => w.id === workout.id);
        if (index >= 0) {
            workouts[index] = workout;
        } else {
            workouts.unshift(workout); // Add to beginning
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
    },

    deleteWorkout: (id: string) => {
        const workouts = storage.getWorkouts();
        const filtered = workouts.filter((w) => w.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },

    clearAll: () => {
        localStorage.removeItem(STORAGE_KEY);
    },

    importData: (jsonData: string) => {
        try {
            const workouts = JSON.parse(jsonData);
            if (Array.isArray(workouts)) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    },

    getExerciseHistory: (exerciseName: string): { date: string; workoutId: string; weight: number | null; sets: number | null; reps: string | null; notes: string | null }[] => {
        const workouts = storage.getWorkouts();
        const history: any[] = [];

        // Normalize search name
        const searchName = exerciseName.toLowerCase().trim();

        workouts.forEach(workout => {
            workout.exercise_groups.forEach(group => {
                group.exercises.forEach(exercise => {
                    if (exercise.name.toLowerCase().trim() === searchName) {
                        history.push({
                            date: workout.date,
                            workoutId: workout.id,
                            weight: null, // Will be calculated in UI or here? Let's keep raw data here mostly
                            sets: exercise.sets,
                            reps: exercise.rep_range,
                            notes: exercise.notes,
                            tempo: exercise.tempo,
                            rest: exercise.rest_seconds
                        });
                    }
                });
            });
        });

        // Sort by date descending
        return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    cleanupDuplicates: () => {
        const workouts = storage.getWorkouts();
        let cleanedCount = 0;

        workouts.forEach(workout => {
            workout.exercise_groups.forEach(group => {
                const uniqueExercises: any[] = [];
                const seen = new Set();

                group.exercises.forEach(ex => {
                    const key = `${ex.exercise_number}-${ex.name}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        uniqueExercises.push(ex);
                    } else {
                        cleanedCount++;
                    }
                });

                group.exercises = uniqueExercises;
            });
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
        return cleanedCount;
    }
};

