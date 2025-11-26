export function WorkoutSkeleton() {
    return (
        <div className="rounded-lg border bg-card p-6 space-y-4 animate-pulse">
            <div className="space-y-2">
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
    )
}

export function ExerciseCardSkeleton() {
    return (
        <div className="rounded-lg border bg-card animate-pulse">
            <div className="flex">
                <div className="w-16 bg-muted"></div>
                <div className="flex-1 p-4 space-y-3">
                    <div className="h-5 bg-muted rounded w-2/3"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="space-y-2">
                                <div className="h-3 bg-muted rounded w-16"></div>
                                <div className="h-4 bg-muted rounded w-12"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
