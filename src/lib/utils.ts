import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
