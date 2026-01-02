"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useWorkoutStorage } from "@/lib/storage";
import { Workout } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Search, Dumbbell, Plus } from "lucide-react";
import { WorkoutSkeleton } from "@/components/skeleton";

interface ExerciseInfo {
    name: string;
    sessionCount: number;
}

export default function WorkoutsPage() {
    const { getWorkouts } = useWorkoutStorage();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    const loadWorkouts = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getWorkouts();
            setWorkouts(data);
        } catch (error) {
            console.error("Error loading workouts:", error);
        } finally {
            setLoading(false);
        }
    }, [getWorkouts]);

    useEffect(() => {
        loadWorkouts();
    }, [loadWorkouts]);

    // Extract unique exercise names and count sessions
    const exerciseInfo = useMemo(() => {
        const exerciseMap = new Map<string, number>();
        
        workouts.forEach(workout => {
            workout.exercise_groups.forEach(group => {
                group.exercises.forEach(exercise => {
                    if (exercise.name?.trim()) {
                        const normalizedName = exercise.name.trim();
                        exerciseMap.set(normalizedName, (exerciseMap.get(normalizedName) || 0) + 1);
                    }
                });
            });
        });

        return Array.from(exerciseMap.entries())
            .map(([name, sessionCount]) => ({ name, sessionCount }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [workouts]);

    // Filter exercises by search query
    const filteredExercises = useMemo(() => {
        if (!searchQuery.trim()) {
            return exerciseInfo;
        }
        
        const query = searchQuery.toLowerCase();
        return exerciseInfo.filter(ex => 
            ex.name.toLowerCase().includes(query)
        );
    }, [exerciseInfo, searchQuery]);

    return (
        <>
            <main className="min-h-screen bg-background p-8 pb-20 md:pb-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">Exercises</h1>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Link href="/" className="w-full sm:w-auto">
                                <Button className="w-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Workout
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:max-w-md">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search exercises..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => <WorkoutSkeleton key={i} />)
                        ) : filteredExercises.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground border border-white/10 rounded-xl p-8 bg-card/40 backdrop-blur-sm">
                                {searchQuery.trim()
                                    ? "No exercises found matching your search."
                                    : "No exercises found."}
                            </div>
                        ) : (
                            filteredExercises.map((exercise) => (
                                <Link key={exercise.name} href={`/exercises/${encodeURIComponent(exercise.name)}`}>
                                    <Card className="hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all group cursor-pointer">
                                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 border-b border-white/10">
                                            <div className="space-y-2 min-w-0 flex-1">
                                                <CardTitle className="text-lg sm:text-xl break-words font-semibold">{exercise.name}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                                <Dumbbell className="w-4 h-4" />
                                                Found in {exercise.sessionCount} workout session{exercise.sessionCount !== 1 ? 's' : ''}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
