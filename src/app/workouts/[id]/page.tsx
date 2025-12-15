"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useWorkoutStorage } from "@/lib/storage";
import { Workout } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft, Calendar, Download, Share2, Edit, Save, X } from "lucide-react";

import { WorkoutSkeleton } from "@/components/skeleton";

export default function WorkoutDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { getWorkouts, saveWorkout } = useWorkoutStorage();
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedWorkout, setEditedWorkout] = useState<Workout | null>(null);

    const loadWorkout = useCallback(async () => {
        try {
            setLoading(true);
            const workouts = await getWorkouts();
            const found = workouts.find((w) => w.id === id);
            setWorkout(found || null);
            setEditedWorkout(found || null);
        } catch (error) {
            console.error("Error loading workout:", error);
        } finally {
            setLoading(false);
        }
    }, [id, getWorkouts]);

    useEffect(() => {
        loadWorkout();
    }, [loadWorkout]);

    const handleSave = async () => {
        if (!editedWorkout) return;
        try {
            await saveWorkout(editedWorkout);
            setWorkout(editedWorkout);
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving workout:", error);
        }
    };

    const handleCancel = () => {
        setEditedWorkout(workout);
        setIsEditing(false);
    };

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
            <main className="min-h-screen bg-background p-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            <Link href="/workouts">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div className="flex-1">
                                {isEditing && editedWorkout ? (
                                    <>
                                        <Input
                                            value={editedWorkout.title}
                                            onChange={(e) => setEditedWorkout({ ...editedWorkout, title: e.target.value })}
                                            className="text-3xl font-bold h-auto border-0 px-0 focus-visible:ring-0"
                                        />
                                        <Input
                                            type="date"
                                            value={editedWorkout.date}
                                            onChange={(e) => setEditedWorkout({ ...editedWorkout, date: e.target.value })}
                                            className="mt-1 w-auto text-muted-foreground border-0 px-0 focus-visible:ring-0"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <h1 className="text-3xl font-bold">{workout.title}</h1>
                                        <div className="flex items-center text-muted-foreground gap-2 mt-1">
                                            <Calendar className="w-4 h-4" />
                                            {workout.date}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <Button variant="outline" size="icon" onClick={handleCancel}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" onClick={handleSave}>
                                        <Save className="w-4 h-4" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" size="icon" onClick={handleExport}>
                                        <Download className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                </>
                            )}
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
                                            <div className="flex justify-between items-start gap-3">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md shrink-0">
                                                        {group.group_id}{exIdx + 1}
                                                    </span>
                                                    {isEditing && editedWorkout ? (
                                                        <Input
                                                            value={editedWorkout.exercise_groups[idx].exercises[exIdx].name}
                                                            onChange={(e) => {
                                                                const updated = { ...editedWorkout };
                                                                updated.exercise_groups[idx].exercises[exIdx].name = e.target.value;
                                                                setEditedWorkout(updated);
                                                            }}
                                                            className="font-medium text-lg h-auto border-0 px-2 focus-visible:ring-1"
                                                        />
                                                    ) : (
                                                        <Link href={`/exercises/${encodeURIComponent(exercise.name || 'unknown')}`} className="hover:underline">
                                                            <h3 className="font-medium text-lg">{exercise.name || 'Unknown Exercise'}</h3>
                                                        </Link>
                                                    )}
                                                </div>
                                                {isEditing && editedWorkout ? (
                                                    <Input
                                                        value={editedWorkout.exercise_groups[idx].exercises[exIdx].tempo || ""}
                                                        onChange={(e) => {
                                                            const updated = { ...editedWorkout };
                                                            updated.exercise_groups[idx].exercises[exIdx].tempo = e.target.value;
                                                            setEditedWorkout(updated);
                                                        }}
                                                        placeholder="Tempo"
                                                        className="text-sm font-mono w-24 h-8"
                                                    />
                                                ) : (
                                                    <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                                        {exercise.tempo}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Sets</span>
                                                    {isEditing && editedWorkout ? (
                                                        <Input
                                                            type="number"
                                                            value={editedWorkout.exercise_groups[idx].exercises[exIdx].sets || ""}
                                                            onChange={(e) => {
                                                                const updated = { ...editedWorkout };
                                                                updated.exercise_groups[idx].exercises[exIdx].sets = parseInt(e.target.value) || null;
                                                                setEditedWorkout(updated);
                                                            }}
                                                            className="h-8 mt-1"
                                                        />
                                                    ) : (
                                                        <span className="font-medium">{exercise.sets}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Reps</span>
                                                    {isEditing && editedWorkout ? (
                                                        <Input
                                                            value={editedWorkout.exercise_groups[idx].exercises[exIdx].rep_range || ""}
                                                            onChange={(e) => {
                                                                const updated = { ...editedWorkout };
                                                                updated.exercise_groups[idx].exercises[exIdx].rep_range = e.target.value;
                                                                setEditedWorkout(updated);
                                                            }}
                                                            placeholder="e.g., 10-12"
                                                            className="h-8 mt-1"
                                                        />
                                                    ) : (
                                                        <span className="font-medium">{exercise.rep_range}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Rest</span>
                                                    {isEditing && editedWorkout ? (
                                                        <Input
                                                            type="number"
                                                            value={editedWorkout.exercise_groups[idx].exercises[exIdx].rest_seconds || ""}
                                                            onChange={(e) => {
                                                                const updated = { ...editedWorkout };
                                                                updated.exercise_groups[idx].exercises[exIdx].rest_seconds = parseInt(e.target.value) || null;
                                                                setEditedWorkout(updated);
                                                            }}
                                                            className="h-8 mt-1"
                                                        />
                                                    ) : (
                                                        <span className="font-medium">{exercise.rest_seconds}s</span>
                                                    )}
                                                </div>
                                                {exercise.rpe && (
                                                    <div>
                                                        <span className="text-muted-foreground block text-xs uppercase tracking-wider">RPE</span>
                                                        <span className="font-medium">{exercise.rpe}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {(exercise.notes || isEditing) && (
                                                <div className="bg-muted/50 p-3 rounded-md text-sm">
                                                    <span className="font-semibold text-xs uppercase tracking-wider block mb-1 text-muted-foreground">Notes / Weight</span>
                                                    {isEditing && editedWorkout ? (
                                                        <Textarea
                                                            value={editedWorkout.exercise_groups[idx].exercises[exIdx].notes || ""}
                                                            onChange={(e) => {
                                                                const updated = { ...editedWorkout };
                                                                updated.exercise_groups[idx].exercises[exIdx].notes = e.target.value;
                                                                setEditedWorkout(updated);
                                                            }}
                                                            placeholder="Add notes or weight..."
                                                            className="min-h-[60px] mt-1"
                                                        />
                                                    ) : (
                                                        exercise.notes
                                                    )}
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
