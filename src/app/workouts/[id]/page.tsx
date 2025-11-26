"use client";

import { useState, useEffect, use } from "react";
import { storage } from "@/lib/storage";
import { Workout } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, RotateCcw, Download } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [workout, setWorkout] = useState<Workout | null>(null);

    // Unwrap params using use() hook as per Next.js 15+ patterns or await it
    // Since this is a client component, we need to handle the promise
    const [id, setId] = useState<string>("");

    useEffect(() => {
        params.then(p => {
            setId(p.id);
            const workouts = storage.getWorkouts();
            const found = workouts.find(w => w.id === p.id);
            if (found) {
                setWorkout(found);
            } else {
                router.push('/workouts');
            }
        });
    }, [params, router]);

    if (!workout) return null;

    const handleExportJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workout, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `workout-${workout.date}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <main className="min-h-screen bg-background p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/workouts">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">{workout.title}</h1>
                            <div className="flex items-center text-muted-foreground gap-2 text-sm mt-1">
                                <Calendar className="w-4 h-4" />
                                {workout.date}
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleExportJson}>
                        <Download className="w-4 h-4 mr-2" />
                        Export JSON
                    </Button>
                </div>

                <div className="space-y-6">
                    {workout.exercise_groups.map((group) => (
                        <div key={group.group_id} className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-lg px-3 py-1">
                                    Group {group.group_id}
                                </Badge>
                            </div>

                            <div className="grid gap-4">
                                {group.exercises.map((exercise, idx) => (
                                    <Card key={idx} className="overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col sm:flex-row">
                                                <div className="bg-muted/30 p-4 flex items-center justify-center sm:w-16 border-b sm:border-b-0 sm:border-r">
                                                    <span className="font-mono font-bold text-muted-foreground">
                                                        {exercise.exercise_number}
                                                    </span>
                                                </div>
                                                <div className="p-4 flex-1 space-y-3">
                                                    <div className="flex justify-between items-start">
                                                        <Link href={`/exercises/${encodeURIComponent(exercise.name)}`} className="hover:underline decoration-primary underline-offset-4">
                                                            <h3 className="font-semibold text-lg">{exercise.name}</h3>
                                                        </Link>
                                                    </div>

                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                                        <div className="space-y-1">
                                                            <span className="text-muted-foreground text-xs uppercase tracking-wider">Tempo</span>
                                                            <div className="font-mono">{exercise.tempo || "-"}</div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <span className="text-muted-foreground text-xs uppercase tracking-wider">Sets</span>
                                                            <div className="font-mono">{exercise.sets || "-"}</div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <span className="text-muted-foreground text-xs uppercase tracking-wider">Reps</span>
                                                            <div className="font-mono">{exercise.rep_range || "-"}</div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <span className="text-muted-foreground text-xs uppercase tracking-wider">Rest</span>
                                                            <div className="flex items-center gap-1 font-mono">
                                                                <Clock className="w-3 h-3" />
                                                                {exercise.rest_seconds ? `${exercise.rest_seconds}s` : "-"}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {exercise.notes && (
                                                        <div className="bg-muted/50 p-3 rounded-md text-sm mt-2">
                                                            <span className="font-semibold text-xs uppercase text-muted-foreground block mb-1">
                                                                Notes / Weight
                                                            </span>
                                                            {exercise.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
