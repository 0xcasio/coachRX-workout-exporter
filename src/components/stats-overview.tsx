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
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                    <Flame className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{streak} Days</div>
                    <p className="text-xs text-muted-foreground">
                        Keep it up!
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
                    <Trophy className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{weeklyProgress} / {weeklyGoal}</div>
                    <p className="text-xs text-muted-foreground">
                        Workouts this week
                    </p>
                </CardContent>
            </Card>

            <Card className="col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Weekly Activity</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="h-[80px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis
                                dataKey="day"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{ background: 'var(--background)', border: '1px solid var(--border)' }}
                                cursor={{ fill: 'var(--muted)' }}
                            />
                            <Bar
                                dataKey="workouts"
                                fill="currentColor"
                                radius={[4, 4, 0, 0]}
                                className="fill-primary"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
