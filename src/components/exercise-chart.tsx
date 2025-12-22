"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ExerciseChartProps {
    data: {
        date: string
        weight: number
        notes?: string
    }[]
}

export function ExerciseChart({ data }: ExerciseChartProps) {
    // Sort data by date ascending for the chart
    const chartData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (chartData.length < 2) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Progress Chart</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Not enough data to chart progress yet.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Weight Progression</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return `${date.getMonth() + 1}/${date.getDate()}`;
                                }}
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                domain={['auto', 'auto']}
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
                                                <div className="font-bold text-muted-foreground mb-1">
                                                    {payload[0].payload.date}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold">
                                                        {payload[0].value} lbs
                                                    </span>
                                                    {payload[0].payload.notes && (
                                                        <span className="text-muted-foreground max-w-[200px]">
                                                            {payload[0].payload.notes}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="weight"
                                strokeWidth={2}
                                activeDot={{ r: 6 }}
                                className="stroke-primary"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
