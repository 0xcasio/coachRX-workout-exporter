"use client";

import { useEffect, useState } from "react";
import { useGymCost, GymCostStats } from "@/lib/gym-cost";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowRight, TrendingDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export function GymCostCard() {
    const { settings, loading, calculateStats } = useGymCost();
    const [stats, setStats] = useState<GymCostStats | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (settings) {
            calculateStats().then(setStats);
        }
    }, [settings, calculateStats]);

    if (loading) {
        return <Skeleton className="h-[180px] w-full rounded-xl" />;
    }

    if (!settings) {
        return (
            <Card className="border-2 border-primary bg-primary/10">
                <CardHeader className="pb-2 border-b-2 border-border">
                    <CardTitle className="text-lg font-bold uppercase flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" strokeWidth={2.5} />
                        Gym Cost Accountability
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4 font-mono uppercase">
                        Track how much each workout costs you. Set up your membership details to get started.
                    </p>
                    <Link href="/gym-cost">
                        <Button className="w-full sm:w-auto uppercase font-bold">
                            Setup Tracking <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-2 border-border relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <DollarSign className="w-24 h-24" />
            </div>
            <CardHeader className="pb-2 border-b-2 border-border">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold uppercase">Cost Per Workout</CardTitle>
                    <Link
                        href="/gym-cost"
                        className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 relative z-10 uppercase"
                    >
                        View Details <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    <div>
                        <div className="text-4xl font-bold font-mono">
                            ${stats?.costPerWorkout.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-mono uppercase">
                            {stats?.totalWorkouts} workouts this cycle
                        </p>
                    </div>

                    {stats && stats.potentialCostDrop > 0 && (
                        <div className="border-2 border-accent bg-accent/10 text-accent px-3 py-2 text-sm font-bold uppercase flex items-center gap-2">
                            <TrendingDown className="w-4 h-4" />
                            Next workout drops cost by ${stats.potentialCostDrop.toFixed(2)}
                        </div>
                    )}
                </div>

                {stats && (
                    <div className="mt-4 pt-4 border-t-2 border-border flex justify-between items-center text-sm">
                        <div className="text-muted-foreground font-mono uppercase">
                            Goal: <span className="font-bold text-foreground">${stats.goalCostPerWorkout.toFixed(2)}</span> / workout
                        </div>
                        <div className={stats.costPerWorkout <= stats.goalCostPerWorkout ? "text-accent font-bold uppercase" : "text-primary font-bold uppercase"}>
                            {stats.costPerWorkout <= stats.goalCostPerWorkout ? "Goal Met!" : `${(stats.costPerWorkout - stats.goalCostPerWorkout).toFixed(2)} to go`}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
