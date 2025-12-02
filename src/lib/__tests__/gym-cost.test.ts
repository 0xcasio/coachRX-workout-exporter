import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useGymCost } from '../gym-cost';

// Mock Supabase
const mockSupabase = {
    from: vi.fn(() => ({
        select: vi.fn(() => ({
            eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: { gym_cost: 50, billing_day: 1, weekly_goal: 3 }, error: null }),
                gte: vi.fn(() => ({
                    lt: vi.fn().mockResolvedValue({ count: 5, error: null })
                }))
            })),
            gte: vi.fn(() => ({
                lt: vi.fn().mockResolvedValue({ count: 5, error: null })
            }))
        })),
        upsert: vi.fn(() => ({
            select: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: { gym_cost: 50, billing_day: 1, weekly_goal: 3 }, error: null })
            }))
        }))
    }))
};

vi.mock('../useSupabaseClient', () => ({
    useSupabaseClient: () => mockSupabase
}));

vi.mock('@clerk/nextjs', () => ({
    useUser: () => ({ user: { id: 'test-user' }, isSignedIn: true }),
    useAuth: () => ({ getToken: vi.fn().mockResolvedValue('test-token') })
}));

describe('useGymCost', () => {
    it('fetches settings on mount', async () => {
        const { result } = renderHook(() => useGymCost());

        await waitFor(() => {
            expect(result.current.settings).toEqual({ gym_cost: 50, billing_day: 1, weekly_goal: 3 });
        });
    });

    it('calculates stats correctly', async () => {
        const { result } = renderHook(() => useGymCost());

        await waitFor(() => {
            expect(result.current.settings).not.toBeNull();
        });

        const stats = await result.current.calculateStats();

        expect(stats).not.toBeNull();
        if (stats) {
            // 5 workouts, $50 cost => $10 per workout
            expect(stats.costPerWorkout).toBe(10);
            expect(stats.totalWorkouts).toBe(5);

            // Next workout: 6 total, $50 / 6 = $8.33
            // Drop: 10 - 8.33 = 1.67
            expect(stats.potentialCostDrop).toBeCloseTo(1.666, 2);
        }
    });

    it('updates settings with specific values', async () => {
        const { result } = renderHook(() => useGymCost());

        // Mock the upsert response
        const mockUpsert = vi.fn().mockResolvedValue({
            data: {
                gym_cost: 462.10,
                billing_day: 22,
                weekly_goal: 4,
                user_id: 'test-user'
            },
            error: null
        });

        // Update the mock to return this specific upsert function
        mockSupabase.from.mockImplementation(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } })
                }))
            })),
            upsert: vi.fn(() => ({
                select: vi.fn(() => ({
                    single: mockUpsert
                }))
            }))
        }));

        await act(async () => {
            await result.current.updateSettings({
                gym_cost: 462.10,
                billing_day: 22,
                weekly_goal: 4
            });
        });

        expect(mockUpsert).toHaveBeenCalled();

        await waitFor(() => {
            expect(result.current.settings).toEqual({
                gym_cost: 462.10,
                billing_day: 22,
                weekly_goal: 4,
                user_id: 'test-user'
            });
        });
    });
});
