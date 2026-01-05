"use client";

import { ExerciseMetadata } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Target, Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseMuscleInfoProps {
  metadata: ExerciseMetadata;
  className?: string;
}

export function ExerciseMuscleInfo({ metadata, className }: ExerciseMuscleInfoProps) {
  return (
    <Card className={cn("border-white/10 bg-card/40 backdrop-blur-sm", className)}>
      <CardContent className="pt-6 space-y-6">
        {/* Exercise Description */}
        {metadata.description && (
          <div className="space-y-2 pb-4 border-b border-white/10">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {metadata.description}
            </p>
          </div>
        )}

        {/* Primary Muscles */}
        {metadata.primary_muscles && metadata.primary_muscles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Activity className="w-4 h-4" />
              Primary Muscles
            </div>
            <div className="flex flex-wrap gap-2">
              {metadata.primary_muscles.map((muscle, idx) => (
                <Badge
                  key={idx}
                  variant="default"
                  className="text-sm px-3 py-1.5 bg-primary/30 text-primary border-primary/50"
                >
                  {muscle}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Secondary Muscles */}
        {metadata.secondary_muscles && metadata.secondary_muscles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Target className="w-4 h-4" />
              Secondary Muscles
            </div>
            <div className="flex flex-wrap gap-2">
              {metadata.secondary_muscles.map((muscle, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-sm px-3 py-1.5"
                >
                  {muscle}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Exercise Type */}
        {metadata.exercise_type && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Zap className="w-4 h-4" />
              Exercise Type
            </div>
            <Badge variant="outline" className="text-sm px-3 py-1.5">
              {metadata.exercise_type}
            </Badge>
          </div>
        )}

        {/* Benefits */}
        {metadata.benefits && metadata.benefits.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              Benefits
            </div>
            <div className="flex flex-wrap gap-2">
              {metadata.benefits.map((benefit, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-sm px-3 py-1.5 border-white/10"
                >
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
