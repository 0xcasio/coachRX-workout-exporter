"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * BentoGrid Component
 * 
 * A flexible grid layout component inspired by the "Bento Box" design pattern.
 * This creates a visually appealing grid where items can span different sizes.
 * 
 * @param children - Grid items to display
 * @param className - Additional CSS classes
 */
interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * BentoCard Component
 * 
 * Individual card within the Bento Grid. Can span multiple columns/rows.
 * 
 * @param children - Content to display in the card
 * @param className - Additional CSS classes
 * @param span - Grid span configuration (e.g., "col-span-1 row-span-1" or "col-span-2")
 */
interface BentoCardProps {
  children: ReactNode;
  className?: string;
  span?: string; // e.g., "col-span-2", "row-span-2", "col-span-2 row-span-2"
}

export function BentoCard({ children, className, span }: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl",
        "bg-card/40 backdrop-blur-2xl",
        "border border-white/10",
        "hover:border-white/20 hover:bg-card/50",
        "transition-all duration-300 ease-out",
        "hover:shadow-2xl hover:shadow-black/20",
        span,
        className
      )}
    >
      {/* Content */}
      <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col">
        {children}
      </div>
      
      {/* macOS/iOS native shine effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
