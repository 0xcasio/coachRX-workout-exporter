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
        <div className={cn("p-4 border-2 border-border bg-card text-card-foreground", className)}>
            <DayPicker
                mode="range"
                selected={selectedRange}
                onSelect={onSelectRange}
                modifiers={modifiers}
                modifiersClassNames={{
                    hasWorkout: "bg-primary border-2 border-primary font-bold text-primary-foreground",
                }}
                classNames={{
                    months: "font-mono",
                    month: "uppercase",
                    caption: "font-bold uppercase text-sm",
                    head_cell: "font-bold uppercase text-xs",
                    cell: "border-2 border-transparent hover:border-border",
                    day: "border-2 border-transparent hover:border-primary font-bold",
                    day_selected: "bg-primary text-primary-foreground border-primary",
                    day_range_start: "bg-primary text-primary-foreground border-primary",
                    day_range_end: "bg-primary text-primary-foreground border-primary",
                }}
                styles={{
                    head_cell: {
                        width: "40px",
                        border: "none",
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
