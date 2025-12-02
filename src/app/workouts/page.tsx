"use client";

import { useState, useEffect, useCallback } from "react";
import { useWorkoutStorage } from "@/lib/storage";
import { Workout } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Search, Calendar as CalendarIcon, Dumbbell, Trash2, Plus, List } from "lucide-react";
import { WorkoutSkeleton } from "@/components/skeleton";
import { WorkoutCalendar } from "@/components/workout-calendar";
import { format, parseISO, isSameDay, subDays, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { DateRange } from "react-day-picker";

export default function WorkoutsPage() {
    const { getWorkouts, deleteWorkout, isSignedIn } = useWorkoutStorage();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined);

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

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Prevent navigation
        if (confirm("Are you sure you want to delete this workout?")) {
            await deleteWorkout(id);
            loadWorkouts();
        }
    };

    const filteredWorkouts = workouts.filter(w => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            w.title.toLowerCase().includes(query) ||
            w.date.includes(query) ||
            w.exercise_groups.some(group =>
                group.exercises.some(ex =>
                    ex.name.toLowerCase().includes(query) ||
                    (ex.notes && ex.notes.toLowerCase().includes(query))
                )
            );

        if (viewMode === 'calendar' && selectedRange?.from) {
            const workoutDate = parseISO(w.date);
            // If 'to' is undefined, treat as single day selection
            const end = selectedRange.to || selectedRange.from;

            return matchesSearch && isWithinInterval(workoutDate, { start: selectedRange.from, end });
        }

        return matchesSearch;
    });

    const selectRange = (rangeType: 'week' | 'month' | 'lastMonth') => {
        const today = new Date();
        if (rangeType === 'week') {
            setSelectedRange({ from: subDays(today, 6), to: today });
        } else if (rangeType === 'month') {
            setSelectedRange({ from: startOfMonth(today), to: endOfMonth(today) });
        } else if (rangeType === 'lastMonth') {
            const lastMonth = subDays(startOfMonth(today), 1);
            setSelectedRange({ from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) });
        }
    };

    return (
        <>
            <main className="min-h-screen bg-background p-8 pb-20 md:pb-8">
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
                                placeholder="Search workouts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex items-center bg-muted p-1 rounded-lg shrink-0">
                            <Button
                                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className="gap-2"
                            >
                                <List className="w-4 h-4" />
                                List
                            </Button>
                            <Button
                                variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('calendar')}
                                className="gap-2"
                            >
                                <CalendarIcon className="w-4 h-4" />
                                Calendar
                            </Button>
                        </div>
                    </div>

                    {viewMode === 'calendar' && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-2 flex-wrap justify-center">
                                <Button variant="outline" size="sm" onClick={() => selectRange('week')}>Last 7 Days</Button>
                                <Button variant="outline" size="sm" onClick={() => selectRange('month')}>This Month</Button>
                                <Button variant="outline" size="sm" onClick={() => selectRange('lastMonth')}>Last Month</Button>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedRange(undefined)}>Clear</Button>
                            </div>
                            <WorkoutCalendar
                                workouts={workouts}
                                selectedRange={selectedRange}
                                onSelectRange={setSelectedRange}
                                className="w-full max-w-md"
                            />
                        </div>
                    )}

                    <div className="grid gap-4">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => <WorkoutSkeleton key={i} />)
                        ) : filteredWorkouts.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                {viewMode === 'calendar' && selectedRange?.from
                                    ? `No workouts found in selected range`
                                    : "No workouts found matching your search."}
                            </div>
                        ) : (
                            <>
                                {viewMode === 'calendar' && selectedRange?.from && (
                                    <h3 className="text-lg font-semibold mt-4">
                                        Workouts from {format(selectedRange.from, 'MMM d')}
                                        {selectedRange.to ? ` to ${format(selectedRange.to, 'MMM d')}` : ''}
                                    </h3>
                                )}
                                {filteredWorkouts.map((workout) => (
                                    <Link key={workout.id} href={`/workouts/${workout.id}`}>
                                        <Card className="hover:bg-muted/50 transition-all duration-200 hover:shadow-md group cursor-pointer">
                                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                                <div className="space-y-1 min-w-0 flex-1">
                                                    <CardTitle className="text-lg sm:text-xl break-words">{workout.title}</CardTitle>
                                                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                        <CalendarIcon className="w-4 h-4 shrink-0" />
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
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
