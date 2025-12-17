"use client";

import { Workout } from "@/lib/types";
import { calculateStreak, getWeeklyProgress } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Trophy, Activity } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, parseISO, isSameDay } from "date-fns";

interface StatsOverviewProps {
    workouts: Workout[];
}

export function StatsOverview({ workouts }: StatsOverviewProps) {
    const streak = calculateStreak(workouts);
    const weeklyProgress = getWeeklyProgress(workouts);
    const weeklyGoal = 3; // Hardcoded goal for now

    // Prepare chart data
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });

    const chartData = days.map(day => {
        const count = workouts.filter(w => isSameDay(parseISO(w.date), day)).length;
        return {
            day: format(day, "EEE"), // Mon, Tue, etc.
            workouts: count,
        };
    });

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-border">
                    <CardTitle className="text-xs font-bold uppercase tracking-wide">Current Streak</CardTitle>
                    <Flame className="h-4 w-4 text-primary" strokeWidth={2.5} />
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="text-3xl font-bold font-mono">{streak}</div>
                    <p className="text-xs text-muted-foreground uppercase font-mono mt-1">
                        Days
                    </p>
                </CardContent>
            </Card>

            <Card className="border-2 border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-border">
                    <CardTitle className="text-xs font-bold uppercase tracking-wide">Weekly Goal</CardTitle>
                    <Trophy className="h-4 w-4 text-primary" strokeWidth={2.5} />
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="text-3xl font-bold font-mono">{weeklyProgress} / {weeklyGoal}</div>
                    <p className="text-xs text-muted-foreground uppercase font-mono mt-1">
                        This Week
                    </p>
                </CardContent>
            </Card>

            <Card className="col-span-2 border-2 border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-border">
                    <CardTitle className="text-xs font-bold uppercase tracking-wide">Weekly Activity</CardTitle>
                    <Activity className="h-4 w-4 text-primary" strokeWidth={2.5} />
                </CardHeader>
                <CardContent className="h-[100px] pt-4 min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart data={chartData}>
                            <XAxis
                                dataKey="day"
                                stroke="var(--foreground)"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                className="font-mono uppercase"
                            />
                            <Tooltip
                                contentStyle={{ 
                                    background: 'var(--card)', 
                                    border: '2px solid var(--border)',
                                    borderRadius: '0',
                                    fontFamily: 'var(--font-mono)',
                                    textTransform: 'uppercase',
                                }}
                                cursor={{ fill: 'var(--muted)' }}
                            />
                            <Bar
                                dataKey="workouts"
                                fill="var(--primary)"
                                radius={0}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
