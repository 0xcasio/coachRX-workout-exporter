"use client";

import { useState } from "react";
import { UploadZone } from "@/components/upload-zone";
import { DatePicker } from "@/components/date-picker";
import { processImageAction } from "@/app/actions";
import { Workout, ExerciseGroup } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useWorkoutStorage } from "@/lib/storage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UploadPage() {
    const { saveWorkout } = useWorkoutStorage();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [shouldMerge, setShouldMerge] = useState(true);

    const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    const MAX_WIDTH = 1000;
                    if (width > MAX_WIDTH) {
                        height = (height * MAX_WIDTH) / width;
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

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
                const base64 = await resizeImage(file);
                const result = await processImageAction(base64);

                if (result.success && result.data) {
                    const partialWorkout = result.data;

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
                    toast.error(`Failed to process ${file.name}`);
                }

                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                console.error(`Error processing ${file.name}: `, error);
                toast.error(`Error processing ${file.name}`);
            }

            completed++;
            setProgress((completed / total) * 100);
        }

        if (shouldMerge && processedWorkouts.length > 0) {
            const baseWorkout = processedWorkouts[0];
            const allGroups: ExerciseGroup[] = [];
            const allScreenshots: string[] = [];

            processedWorkouts.forEach(w => {
                allScreenshots.push(...w.sourceScreenshots);
                w.exercise_groups.forEach(group => {
                    const existingGroup = allGroups.find(g => g.group_id === group.group_id);
                    if (existingGroup) {
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
                        allGroups.push(JSON.parse(JSON.stringify(group)));
                    }
                });
            });

            allGroups.sort((a, b) => a.group_id.localeCompare(b.group_id));
            baseWorkout.exercise_groups = allGroups;
            baseWorkout.sourceScreenshots = allScreenshots;

            await saveWorkout(baseWorkout);
            toast.success("Workout uploaded successfully!");
            router.push(`/workouts/${baseWorkout.id}`);

        } else if (processedWorkouts.length > 0) {
            for (const w of processedWorkouts) {
                await saveWorkout(w);
            }

            toast.success(`${processedWorkouts.length} workouts uploaded successfully!`);
            if (processedWorkouts.length === 1) {
                router.push(`/workouts/${processedWorkouts[0].id}`);
            } else {
                router.push('/workouts');
            }
        }

        setIsProcessing(false);
    };

    return (
        <main className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <header className="text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Upload Workout</h1>
                    <p className="text-base md:text-lg text-muted-foreground">
                        Take screenshots of your CoachRX workout and upload them here
                    </p>
                </header>

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
            </div>
        </main>
    );
}
