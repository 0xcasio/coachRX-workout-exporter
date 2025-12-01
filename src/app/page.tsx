"use client";

import { useState, useEffect, useCallback } from "react";
import { UploadZone } from "@/components/upload-zone";
import { DatePicker } from "@/components/date-picker";
import { processImageAction } from "@/app/actions";
import { Workout, ExerciseGroup } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowRight, Dumbbell, Calendar } from "lucide-react";
import { format } from "date-fns";

import { Header } from "@/components/Header";
import { useWorkoutStorage } from "@/lib/storage";
import { StatsOverview } from "@/components/stats-overview";

export default function Home() {
  const { saveWorkout, getWorkouts, isSignedIn } = useWorkoutStorage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [shouldMerge, setShouldMerge] = useState(true);

  const loadRecentWorkouts = useCallback(async () => {
    const workouts = await getWorkouts();
    setAllWorkouts(workouts);
    setRecentWorkouts(workouts.slice(0, 3));
  }, [getWorkouts]);

  useEffect(() => {
    loadRecentWorkouts();
  }, [loadRecentWorkouts]);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max width 1000px (sufficient for text reading)
          const MAX_WIDTH = 1000;
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG 0.8 quality
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (files: File[]) => {
    setIsProcessing(true);
    setProgress(0);

    let completed = 0;
    const total = files.length;
    const processedWorkouts: Workout[] = [];

    for (const file of files) {
      try {
        // Resize and compress client-side
        const base64 = await resizeImage(file);

        const result = await processImageAction(base64);

        if (result.success && result.data) {
          const partialWorkout = result.data;

          // Enhance with ID and metadata
          const workout: Workout = {
            id: crypto.randomUUID(),
            title: partialWorkout.title || "Untitled Workout",
            date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : (partialWorkout.date || new Date().toISOString().split('T')[0]),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            exercise_groups: partialWorkout.exercise_groups || [],
            sourceScreenshots: [base64],
            metadata: {
              processingTimeMs: 0,
              geminiModelVersion: "gemini-2.0-flash",
              userEdited: false
            }
          };

          processedWorkouts.push(workout);
        } else {
          console.error(`Error processing ${file.name}: `, result.error);
        }

        // Add 2s delay between requests to respect rate limit
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`Error processing ${file.name}: `, error);
      }

      completed++;
      setProgress((completed / total) * 100);
    }

    // Merge logic
    if (shouldMerge && processedWorkouts.length > 0) {
      // Use the first workout as the base
      const baseWorkout = processedWorkouts[0];

      // Combine exercise groups from all workouts
      const allGroups: ExerciseGroup[] = [];
      const allScreenshots: string[] = [];

      processedWorkouts.forEach(w => {
        allScreenshots.push(...w.sourceScreenshots);
        w.exercise_groups.forEach(group => {
          // Check if group already exists in our merged list
          const existingGroup = allGroups.find(g => g.group_id === group.group_id);
          if (existingGroup) {
            // Append exercises to existing group, avoiding duplicates
            group.exercises.forEach(newEx => {
              const isDuplicate = existingGroup.exercises.some(existingEx =>
                existingEx.exercise_number === newEx.exercise_number &&
                existingEx.name === newEx.name
              );

              if (!isDuplicate) {
                existingGroup.exercises.push(newEx);
              }
            });
          } else {
            // Add new group
            allGroups.push(JSON.parse(JSON.stringify(group))); // Deep copy
          }
        });
      });

      // Sort groups by ID (A, B, C...)
      allGroups.sort((a, b) => a.group_id.localeCompare(b.group_id));

      // Update base workout
      baseWorkout.exercise_groups = allGroups;
      baseWorkout.sourceScreenshots = allScreenshots;

      // Save only the merged workout
      await saveWorkout(baseWorkout); // Modified: Used saveWorkout from hook
    } else {
      // Save individually
      for (const w of processedWorkouts) { // Modified: Changed to for...of loop to await
        await saveWorkout(w); // Modified: Used saveWorkout from hook
      }
    }

    setIsProcessing(false);
    loadRecentWorkouts();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">CoachRX Data Liberation</h1>
            <p className="text-xl text-muted-foreground">
              Own your CoachRX data, no need to ask your coach for it.
            </p>
          </header>

          {allWorkouts.length > 0 && (
            <section>
              <StatsOverview workouts={allWorkouts} />
            </section>
          )}

          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-4">
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <Label>Workout Date</Label>
                  <DatePicker date={selectedDate} setDate={setSelectedDate} />
                </div>

                <div className="flex items-center space-x-2 sm:pt-6">
                  <Checkbox
                    id="merge"
                    checked={shouldMerge}
                    onCheckedChange={(c) => setShouldMerge(!!c)}
                  />
                  <Label htmlFor="merge" className="cursor-pointer text-sm">
                    Merge all uploads into one session
                  </Label>
                </div>
              </div>
            </div>

            <UploadZone
              onUpload={handleUpload}
              isProcessing={isProcessing}
              progress={progress}
            />

            {isProcessing && (
              <div className="text-center text-sm text-muted-foreground">
                Processing screenshots... This may take a few moments.
              </div>
            )}
          </div>

          {recentWorkouts.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Recent Workouts</h2>
                <Link href="/workouts">
                  <Button variant="ghost" className="gap-2">
                    View All <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {recentWorkouts.map((workout) => (
                  <Link key={workout.id} href={`/workouts/${workout.id}`}>
                    <Card className="hover:bg-muted/50 transition-all duration-200 hover:shadow-md cursor-pointer h-full">
                      <CardHeader className="space-y-1">
                        <CardTitle className="text-base line-clamp-1">
                          {workout.title}
                        </CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                          <Calendar className="w-3 h-3" />
                          {workout.date}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm">
                          <Dumbbell className="w-4 h-4" />
                          {workout.exercise_groups.reduce((acc, g) => acc + g.exercises.length, 0)} Exercises
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
