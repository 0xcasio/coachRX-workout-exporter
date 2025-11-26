"use client";

import { useState, useEffect, useCallback } from "react";
import { storage } from "@/lib/storage";
import { Workout } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Search, Calendar, Dumbbell, Trash2, Plus } from "lucide-react";

export default function WorkoutsPage() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const loadWorkouts = useCallback(() => {
        setWorkouts(storage.getWorkouts());
    }, []);

    useEffect(() => {
        loadWorkouts();
    }, [loadWorkouts]);

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Prevent navigation
        if (confirm("Are you sure you want to delete this workout?")) {
            storage.deleteWorkout(id);
            loadWorkouts();
        }
    };

    const handleCleanup = () => {
        const count = storage.cleanupDuplicates();
        alert(`Cleaned up ${count} duplicate exercises!`);
        loadWorkouts();
    };

    const filteredWorkouts = workouts.filter(w =>
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.date.includes(searchQuery)
    );

    return (
        <main className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-bold">Workout Library</h1>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button variant="outline" onClick={handleCleanup} className="w-full sm:w-auto">
                            Cleanup Duplicates
                        </Button>
                        <Link href="/" className="w-full sm:w-auto">
                            <Button className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                New Workout
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search workouts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <div className="grid gap-4">
                    {filteredWorkouts.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No workouts found. Go back home to upload some!
                        </div>
                    ) : (
                        filteredWorkouts.map((workout) => (
                            <Link key={workout.id} href={`/workouts/${workout.id}`}>
                                <Card className="hover:bg-muted/50 transition-all duration-200 hover:shadow-md group cursor-pointer">
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                        <div className="space-y-1 min-w-0 flex-1">
                                            <CardTitle className="text-lg sm:text-xl break-words">{workout.title}</CardTitle>
                                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                <Calendar className="w-4 h-4 shrink-0" />
                                                {workout.date}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                                            onClick={(e) => handleDelete(e, workout.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Dumbbell className="w-4 h-4" />
                                            {workout.exercise_groups.reduce((acc, g) => acc + g.exercises.length, 0)} Exercises
                                            <span className="mx-2">•</span>
                                            {workout.exercise_groups.length} Groups
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
