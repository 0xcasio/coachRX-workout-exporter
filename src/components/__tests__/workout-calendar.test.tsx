import { render, screen, fireEvent } from '@testing-library/react';
import { WorkoutCalendar } from '../workout-calendar';
import { Workout } from '@/lib/types';
import { describe, it, expect, vi } from 'vitest';
import { DateRange } from 'react-day-picker';

// Mock workouts data
const mockWorkouts: Workout[] = [
    {
        id: '1',
        title: 'Workout 1',
        date: '2023-10-25',
        createdAt: '2023-10-25T10:00:00Z',
        updatedAt: '2023-10-25T10:00:00Z',
        exercise_groups: [],
        sourceScreenshots: [],
    },
    {
        id: '2',
        title: 'Workout 2',
        date: '2023-10-27',
        createdAt: '2023-10-27T10:00:00Z',
        updatedAt: '2023-10-27T10:00:00Z',
        exercise_groups: [],
        sourceScreenshots: [],
    },
];

describe('WorkoutCalendar', () => {
    it('renders correctly', () => {
        render(
            <WorkoutCalendar
                workouts={mockWorkouts}
                selectedRange={undefined}
                onSelectRange={() => { }}
            />
        );
        // Check if calendar is rendered (DayPicker usually renders a table)
        expect(screen.getByRole('grid')).toBeDefined();
    });

    it('calls onSelectRange when a date range is selected', () => {
        const handleSelectRange = vi.fn();
        render(
            <WorkoutCalendar
                workouts={mockWorkouts}
                selectedRange={undefined}
                onSelectRange={handleSelectRange}
            />
        );

        const grid = screen.getByRole('grid');
        const dayButtons = grid.querySelectorAll('button.rdp-day');

        if (dayButtons.length > 1) {
            // Click first date
            fireEvent.click(dayButtons[10]);
            expect(handleSelectRange).toHaveBeenCalled();

            // Click second date to complete range
            fireEvent.click(dayButtons[15]);
            expect(handleSelectRange).toHaveBeenCalledTimes(2);
        } else {
            // Fallback
            const day10 = screen.getByText('10', { selector: 'button' });
            fireEvent.click(day10);
            expect(handleSelectRange).toHaveBeenCalled();
        }
    });
});
