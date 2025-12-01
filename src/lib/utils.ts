import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Workout } from "./types";
import { parseISO, isSameDay, subDays, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractWeight(notes: string | null): number | null {
  if (!notes) return null;

  // Try to find "Xlbs" or "X lbs" or just a number at the start
  // Regex for "50lbs", "50 lbs", "50.5lbs"
  const weightMatch = notes.match(/(\d+(\.\d+)?)\s*(lbs|lb|kg|kgs)/i);
  if (weightMatch) {
    return parseFloat(weightMatch[1]);
  }

  // Fallback: check if the note starts with a number followed by space or end of string
  // e.g. "50 10 reps" -> 50
  const numberStartMatch = notes.match(/^(\d+(\.\d+)?)/);
  if (numberStartMatch) {
    return parseFloat(numberStartMatch[1]);
  }

  return null;
}

export function calculateStreak(workouts: Workout[]): number {
  if (!workouts.length) return 0;

  // Sort by date descending
  const sortedWorkouts = [...workouts].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const today = new Date();
  const yesterday = subDays(today, 1);
  const lastWorkoutDate = parseISO(sortedWorkouts[0].date);

  // If last workout wasn't today or yesterday, streak is broken (or 0)
  if (!isSameDay(lastWorkoutDate, today) && !isSameDay(lastWorkoutDate, yesterday)) {
    // Check if it's strictly before yesterday
    if (lastWorkoutDate < yesterday) return 0;
  }

  // Get all unique dates sorted desc
  const sortedUniqueDates = Array.from(new Set(workouts.map(w => w.date)))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (sortedUniqueDates.length === 0) return 0;

  const mostRecent = parseISO(sortedUniqueDates[0]);

  // If most recent is older than yesterday, streak is 0
  if (!isSameDay(mostRecent, today) && !isSameDay(mostRecent, yesterday)) {
    return 0;
  }

  let currentStreak = 1;
  let prevDate = mostRecent;

  for (let i = 1; i < sortedUniqueDates.length; i++) {
    const thisDate = parseISO(sortedUniqueDates[i]);
    const expectedDate = subDays(prevDate, 1);

    if (isSameDay(thisDate, expectedDate)) {
      currentStreak++;
      prevDate = thisDate;
    } else {
      break;
    }
  }

  return currentStreak;
}

export function getWeeklyProgress(workouts: Workout[]): number {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
  const end = endOfWeek(today, { weekStartsOn: 1 });

  return workouts.filter(w =>
    isWithinInterval(parseISO(w.date), { start, end })
  ).length;
}
