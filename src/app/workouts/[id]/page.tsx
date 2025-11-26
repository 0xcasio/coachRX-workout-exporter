"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useWorkoutStorage } from "@/lib/storage";
import { Workout } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, Download, Share2 } from "lucide-react";
import { Header } from "@/components/Header";
import { WorkoutSkeleton } from "@/components/skeleton";

export default function WorkoutDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { getWorkouts } = useWorkoutStorage();
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [loading, setLoading] = useState(true);

    const loadWorkout = useCallback(async () => {
        try {
            setLoading(true);
            const workouts = await getWorkouts();
            const found = workouts.find((w) => w.id === id);
            setWorkout(found || null);
        } catch (error) {
            console.error("Error loading workout:", error);
        } finally {
            setLoading(false);
        }
    }, [id, getWorkouts]);

    useEffect(() => {
        loadWorkout();
    }, [loadWorkout]);

    const handleExport = () => {
        if (!workout) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workout, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `workout-${workout.date}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-background p-8">
                    <div className="max-w-3xl mx-auto">
                        <WorkoutSkeleton />
                    </div>
                </main>
            </>
        );
    }

    if (!workout) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-background p-8 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-bold">Workout Not Found</h1>
                        <Link href="/workouts">
                            <Button>Back to Library</Button>
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background p-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/workouts">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold">{workout.title}</h1>
                                <div className="flex items-center text-muted-foreground gap-2 mt-1">
                                    <Calendar className="w-4 h-4" />
                                    {workout.date}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={handleExport}>
                                <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Exercise Groups */}
                    <div className="space-y-6">
                        {workout.exercise_groups.map((group, idx) => (
                            <Card key={idx}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-semibold text-primary">
                                        {group.group_id}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {group.exercises.map((exercise, exIdx) => (
                                        <div key={exIdx} className="space-y-3 pb-4 last:pb-0 border-b last:border-0">
                                            <div className="flex justify-between items-start">
                                                <Link href={`/exercises/${encodeURIComponent(exercise.name)}`} className="hover:underline">
                                                    <h3 className="font-medium text-lg">{exercise.name}</h3>
                                                </Link>
                                                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                                    {exercise.tempo}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Sets</span>
                                                    <span className="font-medium">{exercise.sets}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Reps</span>
                                                    <span className="font-medium">{exercise.rep_range}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Rest</span>
                                                    <span className="font-medium">{exercise.rest_seconds}s</span>
                                                </div>
                                                {exercise.rpe && (
                                                    <div>
                                                        <span className="text-muted-foreground block text-xs uppercase tracking-wider">RPE</span>
                                                        <span className="font-medium">{exercise.rpe}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {exercise.notes && (
                                                <div className="bg-muted/50 p-3 rounded-md text-sm">
                                                    <span className="font-semibold text-xs uppercase tracking-wider block mb-1 text-muted-foreground">Notes / Weight</span>
                                                    {exercise.notes}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
