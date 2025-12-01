"use client";

import { DayPicker, DateRange } from "react-day-picker";
import { Workout } from "@/lib/types";
import { parseISO, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

interface WorkoutCalendarProps {
    workouts: Workout[];
    selectedRange: DateRange | undefined;
    onSelectRange: (range: DateRange | undefined) => void;
    className?: string;
}

export function WorkoutCalendar({
    workouts,
    selectedRange,
    onSelectRange,
    className,
}: WorkoutCalendarProps) {
    // Create a set of days that have workouts for quick lookup
    const workoutDays = workouts.map((workout) => parseISO(workout.date));

    const modifiers = {
        hasWorkout: workoutDays,
    };

    return (
        <div className={cn("p-4 border rounded-lg bg-card text-card-foreground shadow-sm", className)}>
            <DayPicker
                mode="range"
                selected={selectedRange}
                onSelect={onSelectRange}
                modifiers={modifiers}
                modifiersClassNames={{
                    hasWorkout: "bg-primary/10 font-bold text-primary",
                }}
                styles={{
                    head_cell: {
                        width: "40px",
                    },
                    cell: {
                        width: "40px",
                    },
                    day: {
                        width: "40px",
                        height: "40px",
                    },
                }}
            />
        </div>
    );
}
