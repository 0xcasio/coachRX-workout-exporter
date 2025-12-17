"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * FeatureCard Component
 * 
 * A premium feature card component designed for showcasing app features.
 * Includes icon, title, description, and optional action elements.
 * 
 * @param icon - Lucide icon component
 * @param title - Feature title
 * @param description - Feature description
 * @param children - Optional additional content (e.g., buttons, badges)
 * @param className - Additional CSS classes
 */
interface FeatureCardProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  children,
  className,
}: FeatureCardProps) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Icon - Brutalist style */}
      {Icon && (
        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 border-2 border-primary bg-primary text-primary-foreground">
          <Icon className="w-6 h-6" strokeWidth={2.5} />
        </div>
      )}

      {/* Title - Bold, uppercase, technical */}
      <h3 className="text-xl lg:text-2xl font-bold uppercase tracking-tight mb-3 text-foreground">
        {title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground text-sm lg:text-base leading-snug flex-1">
        {description}
      </p>

      {/* Additional content (buttons, badges, etc.) */}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
