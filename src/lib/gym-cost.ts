import { useCallback, useEffect, useState } from 'react';
import { useSupabaseClient } from './useSupabaseClient';
import { useUser } from '@clerk/nextjs';
import { startOfMonth, differenceInCalendarDays, isAfter, addMonths, setDate } from 'date-fns';

export interface GymCostSettings {
    user_id: string;
    gym_cost: number;
    billing_day: number;
    weekly_goal: number;
}

export interface GymCostStats {
    costPerWorkout: number;
    totalWorkouts: number;
    potentialCostDrop: number; // How much it drops if you do one more
    billingCycleStart: Date;
    billingCycleEnd: Date;
    daysRemaining: number;
    isOnTrack: boolean;
    projectedWorkouts: number;
    goalCostPerWorkout: number;
}

export function useGymCost() {
    const supabase = useSupabaseClient();
    const { user, isSignedIn } = useUser();
    const [settings, setSettings] = useState<GymCostSettings | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSettings = useCallback(async () => {
        if (!isSignedIn || !user) return;

        try {
            const { data, error } = await supabase
                .from('user_settings')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
                console.error('Error fetching settings:', error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                console.error('Error details:', error.details);
            }

            if (data) {
                setSettings(data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }, [isSignedIn, user, supabase]);

    const updateSettings = useCallback(async (newSettings: Partial<GymCostSettings>) => {
        if (!isSignedIn || !user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('user_settings')
            .upsert({
                user_id: user.id,
                ...settings,
                ...newSettings,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        setSettings(data);
        return data;
    }, [isSignedIn, user, settings, supabase]);

    // Calculate stats based on workouts and settings
    const calculateStats = useCallback(async (): Promise<GymCostStats | null> => {
        if (!settings || !isSignedIn || !user) return null;

        // Determine billing cycle
        const today = new Date();
        let start = setDate(startOfMonth(today), settings.billing_day);

        // If billing day is in the future for this month, cycle started last month
        if (isAfter(start, today)) {
            start = addMonths(start, -1);
        }

        const end = addMonths(start, 1);

        // Fetch workouts in this cycle
        const { count, error } = await supabase
            .from('workouts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('date', start.toISOString())
            .lt('date', end.toISOString());

        if (error) {
            console.error('Error counting workouts:', error);
            return null;
        }

        const totalWorkouts = count || 0;
        const costPerWorkout = totalWorkouts > 0
            ? settings.gym_cost / totalWorkouts
            : settings.gym_cost; // If 0 workouts, cost is full price (or infinite? typically show full price)

        const nextCostPerWorkout = settings.gym_cost / (totalWorkouts + 1);
        const potentialCostDrop = costPerWorkout - nextCostPerWorkout;

        // Projected Goal Calculation
        const daysInCycle = differenceInCalendarDays(end, start);
        const projectedWorkouts = Math.round((settings.weekly_goal / 7) * daysInCycle);
        const goalCostPerWorkout = settings.gym_cost / projectedWorkouts;

        // On track calculation (simple linear projection)
        const daysPassed = differenceInCalendarDays(today, start);
        const expectedWorkoutsSoFar = (settings.weekly_goal / 7) * daysPassed;
        const isOnTrack = totalWorkouts >= expectedWorkoutsSoFar;

        return {
            costPerWorkout,
            totalWorkouts,
            potentialCostDrop,
            billingCycleStart: start,
            billingCycleEnd: end,
            daysRemaining: differenceInCalendarDays(end, today),
            isOnTrack,
            projectedWorkouts,
            goalCostPerWorkout
        };
    }, [settings, isSignedIn, user, supabase]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return {
        settings,
        loading,
        updateSettings,
        calculateStats,
        fetchSettings // Export this so we can manually refresh
    };
}
