"use client";

import { useState } from "react";
import { useGymCost, GymCostSettings } from "@/lib/gym-cost";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SetupFormProps {
    onComplete?: () => void;
    initialSettings?: GymCostSettings | null;
}

export function SetupForm({ onComplete, initialSettings }: SetupFormProps) {
    const { updateSettings } = useGymCost();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        gym_cost: initialSettings?.gym_cost?.toString() || "",
        billing_day: initialSettings?.billing_day?.toString() || "1",
        weekly_goal: initialSettings?.weekly_goal?.toString() || "3"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateSettings({
                gym_cost: parseFloat(formData.gym_cost),
                billing_day: parseInt(formData.billing_day),
                weekly_goal: parseInt(formData.weekly_goal)
            });
            toast.success("Settings saved successfully!");
            onComplete?.();
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message :
                (error && typeof error === 'object' && 'details' in error) ? String(error.details) :
                    "Unknown error";
            toast.error(`Failed to save settings: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Gym Cost Setup</CardTitle>
                <CardDescription>
                    Enter your membership details to track your cost per workout.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="cost">Monthly Membership Cost ($)</Label>
                        <Input
                            id="cost"
                            type="number"
                            placeholder="50.00"
                            value={formData.gym_cost}
                            onChange={(e) => setFormData({ ...formData, gym_cost: e.target.value })}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="billing_day">Billing Day of Month</Label>
                        <Select
                            value={formData.billing_day}
                            onValueChange={(val) => setFormData({ ...formData, billing_day: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                    <SelectItem key={day} value={day.toString()}>
                                        {day}{
                                            (day % 10 === 1 && day !== 11) ? 'st' :
                                                (day % 10 === 2 && day !== 12) ? 'nd' :
                                                    (day % 10 === 3 && day !== 13) ? 'rd' : 'th'
                                        }
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="goal">Weekly Workout Goal</Label>
                        <Select
                            value={formData.weekly_goal}
                            onValueChange={(val) => setFormData({ ...formData, weekly_goal: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select goal" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => (
                                    <SelectItem key={day} value={day.toString()}>
                                        {day} {day === 1 ? 'day' : 'days'} / week
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Settings
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
