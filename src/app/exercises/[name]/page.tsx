"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useWorkoutStorage } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, Dumbbell } from "lucide-react";
import { ExerciseChart } from "@/components/exercise-chart";
import { extractWeight } from "@/lib/utils";

import { ExerciseCardSkeleton } from "@/components/skeleton";

export default function ExerciseHistoryPage() {
    const params = useParams();
    const name = decodeURIComponent(params.name as string);
    const { getExerciseHistory } = useWorkoutStorage();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadHistory = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getExerciseHistory(name);
            setHistory(data);
        } catch (error) {
            console.error("Error loading history:", error);
        } finally {
            setLoading(false);
        }
    }, [name, getExerciseHistory]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    // Calculate max weight
    const maxWeight = history.reduce((max, entry) => {
        const weight = extractWeight(entry.notes || "");
        return weight ? Math.max(max, weight) : max;
    }, 0);

    const totalSessions = history.length;

    // Prepare chart data
    const chartData = history
        .map(entry => ({
            date: entry.date,
            weight: extractWeight(entry.notes || "") || 0
        }))
        .filter(d => d.weight > 0)
        .reverse();

    return (
        <>
            <main className="min-h-screen bg-background p-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="flex items-start gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl sm:text-2xl font-bold break-words">{name}</h1>
                            <div className="flex flex-wrap items-center text-muted-foreground gap-3 sm:gap-4 text-sm mt-1">
                                <span className="flex items-center gap-1">
                                    <Dumbbell className="w-4 h-4 shrink-0" />
                                    {totalSessions} Sessions
                                </span>
                                {maxWeight > 0 && (
                                    <span className="font-semibold text-primary">
                                        PR: {maxWeight} lbs
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            <div className="h-[300px] bg-muted rounded-lg animate-pulse" />
                            <ExerciseCardSkeleton />
                            <ExerciseCardSkeleton />
                        </div>
                    ) : (
                        <>
                            <ExerciseChart data={chartData} />

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">History</h2>
                                <div className="grid gap-4">
                                    {history.map((entry, idx) => (
                                        <Link key={idx} href={`/workouts/${entry.workoutId}`}>
                                            <Card className="hover:bg-muted/50 transition-all duration-200 hover:shadow-md cursor-pointer">
                                                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                                    <div className="space-y-1 min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Calendar className="w-3 h-3 shrink-0" />
                                                            {entry.date}
                                                        </div>
                                                        <div className="font-medium break-words">
                                                            {entry.sets} sets × {entry.reps}
                                                            {entry.tempo && <span className="text-muted-foreground ml-2">@{entry.tempo}</span>}
                                                        </div>
                                                    </div>
                                                    {entry.notes && (
                                                        <div className="bg-muted px-3 py-1.5 rounded-lg text-sm shrink-0">
                                                            {entry.notes}
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </>
    );
}
