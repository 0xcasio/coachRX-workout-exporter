"use client";

import { useEffect, useState } from "react";
import { useGymCost, GymCostStats } from "@/lib/gym-cost";
import { SetupForm } from "@/components/gym-cost/setup-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, DollarSign, Calendar, TrendingDown, Target } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function GymCostPage() {
    const { settings, loading, calculateStats, fetchSettings } = useGymCost();
    const [stats, setStats] = useState<GymCostStats | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (settings) {
            calculateStats().then(setStats);
        }
    }, [settings, calculateStats]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!settings || isEditing) {
        return (
            <main className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-semibold">Gym Cost Accountability</h1>
                        {isEditing && (
                            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                        )}
                    </div>
                    <SetupForm
                        initialSettings={settings}
                        onComplete={async () => {
                            setIsEditing(false);
                            // Refresh settings from database
                            await fetchSettings();
                            // Recalculate stats with new settings
                            const newStats = await calculateStats();
                            if (newStats) {
                                setStats(newStats);
                            }
                        }}
                    />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Gym Cost Accountability</h1>
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit Settings
                    </Button>
                </div>

                <div className="space-y-8">
                    {/* Section 1: Projected Targets */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold tracking-tight">Projected Targets</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Monthly Membership</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        ${settings.gym_cost.toFixed(2)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Total monthly cost
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Target Cost / Workout</CardTitle>
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        ${stats?.goalCostPerWorkout.toFixed(2)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Based on {settings.weekly_goal} days/week goal
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Section 2: Current Performance */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold tracking-tight">Current Performance</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Current Cost / Workout</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        ${stats?.costPerWorkout.toFixed(2)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {stats?.costPerWorkout && stats.goalCostPerWorkout && stats.costPerWorkout <= stats.goalCostPerWorkout
                                            ? "Goal Met! 🎉"
                                            : `$${((stats?.costPerWorkout || 0) - (stats?.goalCostPerWorkout || 0)).toFixed(2)} over target`}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Next Workout Value</CardTitle>
                                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        -${stats?.potentialCostDrop.toFixed(2)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Savings if you workout today
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Workouts Completed</CardTitle>
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stats?.totalWorkouts}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Target: {stats?.projectedWorkouts} for this cycle
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Billing Cycle</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stats?.daysRemaining} Days
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Ends {stats ? format(stats.billingCycleEnd, 'MMM do') : '-'}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
