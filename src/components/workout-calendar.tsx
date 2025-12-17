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
        <div className={cn("p-4 border border-white/10 rounded-2xl bg-card/40 backdrop-blur-xl text-card-foreground", className)}>
            <DayPicker
                mode="range"
                selected={selectedRange}
                onSelect={onSelectRange}
                modifiers={modifiers}
                modifiersClassNames={{
                    hasWorkout: "bg-primary/30 border border-primary/50 font-semibold text-primary rounded-lg",
                }}
                classNames={{
                    months: "",
                    month: "",
                    caption: "font-semibold text-sm",
                    head_cell: "font-medium text-xs",
                    cell: "border border-transparent hover:border-white/10 rounded-lg",
                    day: "border border-transparent hover:border-primary/30 font-medium rounded-lg",
                    day_selected: "bg-primary text-primary-foreground border-primary rounded-lg",
                    day_range_start: "bg-primary text-primary-foreground border-primary rounded-l-lg",
                    day_range_end: "bg-primary text-primary-foreground border-primary rounded-r-lg",
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
