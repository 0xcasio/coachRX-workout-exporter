import { Workout } from './types'
import { useCallback } from 'react'
import { useSupabaseClient } from './useSupabaseClient'
import { useUser } from '@clerk/nextjs'

// ============================================================================
// CLOUD STORAGE (Supabase) - Authentication Required
// ============================================================================

export function useWorkoutStorage() {
    const supabase = useSupabaseClient()
    const { user, isSignedIn } = useUser()

    // Get all workouts for current user - REQUIRES AUTHENTICATION
    const getWorkouts = useCallback(async (): Promise<Workout[]> => {
        if (!isSignedIn) {
            return []
        }

        try {
            const { data, error } = await supabase
                .from('workouts')
                .select('*')
                .order('date', { ascending: false })

            if (error) throw error

            return data.map(row => ({
                id: row.id,
                title: row.title,
                date: row.date,
                exercise_groups: row.exercise_groups,
                sourceScreenshots: [],
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }))
        } catch (error) {
            console.error('Error fetching workouts from Supabase:', error)
            console.error('Error details:', JSON.stringify(error, null, 2))
            if (error instanceof Error) {
                console.error('Error message:', error.message)
                console.error('Error stack:', error.stack)
            }
            throw error
        }
    }, [isSignedIn, supabase])

    // Save a single workout - REQUIRES AUTHENTICATION
    const saveWorkout = useCallback(async (workout: Workout): Promise<Workout> => {
        if (!isSignedIn) {
            throw new Error('You must be signed in to save workouts')
        }

        try {
            const workoutData = {
                id: workout.id,
                user_id: user!.id,
                title: workout.title,
                date: workout.date,
                exercise_groups: workout.exercise_groups,
            }

            const { data, error } = await supabase
                .from('workouts')
                .upsert(workoutData)
                .select()
                .single()

            if (error) throw error

            return {
                id: data.id,
                title: data.title,
                date: data.date,
                exercise_groups: data.exercise_groups,
                sourceScreenshots: [],
                createdAt: data.created_at,
                updatedAt: data.updated_at,
            }
        } catch (error) {
            console.error('Error saving workout to Supabase:', error)
            console.error('Error details:', JSON.stringify(error, null, 2))
            if (error instanceof Error) {
                console.error('Error message:', error.message)
                console.error('Error stack:', error.stack)
            }
            throw error
        }
    }, [isSignedIn, supabase, user])

    // Delete a workout - REQUIRES AUTHENTICATION
    const deleteWorkout = useCallback(async (id: string): Promise<void> => {
        if (!isSignedIn) {
            throw new Error('You must be signed in to delete workouts')
        }

        try {
            const { error } = await supabase
                .from('workouts')
                .delete()
                .eq('id', id)

            if (error) throw error
        } catch (error) {
            console.error('Error deleting workout from Supabase:', error)
            throw error
        }
    }, [isSignedIn, supabase])

    // Get exercise history - REQUIRES AUTHENTICATION
    const getExerciseHistory = useCallback(async (exerciseName: string) => {
        if (!isSignedIn) {
            return []
        }

        try {
            const { data, error } = await supabase
                .from('workouts')
                .select('*')
                .order('date', { ascending: false })

            if (error) throw error

            const workouts = data.map(row => ({
                id: row.id,
                title: row.title,
                date: row.date,
                exercise_groups: row.exercise_groups,
                sourceScreenshots: [],
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            })) as Workout[]

            const history: any[] = [];
            const searchName = exerciseName.toLowerCase().trim();

            workouts.forEach(workout => {
                workout.exercise_groups.forEach(group => {
                    group.exercises.forEach(exercise => {
                        if (exercise.name.toLowerCase().trim() === searchName) {
                            history.push({
                                date: workout.date,
                                workoutId: workout.id,
                                weight: null,
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

            return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } catch (error) {
            console.error('Error fetching history:', error)
            return []
        }
    }, [isSignedIn, supabase])

    return {
        getWorkouts,
        saveWorkout,
        deleteWorkout,
        getExerciseHistory,
        isSignedIn: !!isSignedIn,
    }
}
