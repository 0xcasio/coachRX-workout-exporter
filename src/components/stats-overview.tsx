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
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-white/10">
                    <CardTitle className="text-xs font-medium">Current Streak</CardTitle>
                    <Flame className="h-4 w-4 text-primary" strokeWidth={2} />
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="text-3xl font-semibold">{streak}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Days
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-white/10">
                    <CardTitle className="text-xs font-medium">Weekly Goal</CardTitle>
                    <Trophy className="h-4 w-4 text-primary" strokeWidth={2} />
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="text-3xl font-semibold">{weeklyProgress} / {weeklyGoal}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        This Week
                    </p>
                </CardContent>
            </Card>

            <Card className="col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-white/10">
                    <CardTitle className="text-xs font-medium">Weekly Activity</CardTitle>
                    <Activity className="h-4 w-4 text-primary" strokeWidth={2} />
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
                            />
                            <Tooltip
                                contentStyle={{ 
                                    background: 'var(--card)', 
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                }}
                                cursor={{ fill: 'var(--muted)' }}
                            />
                            <Bar
                                dataKey="workouts"
                                fill="var(--primary)"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
