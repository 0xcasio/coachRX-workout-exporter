"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

/**
 * ThemeToggle Component
 * 
 * A brutalist theme toggle button that switches between dark and light modes.
 * 
 * @param className - Additional CSS classes
 * @param variant - Button variant (defaults to "outline")
 * @param size - Button size (defaults to "default")
 */
interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ThemeToggle({
  className,
  variant = "outline",
  size = "default",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={cn("uppercase font-bold", className)}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-4 h-4" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </Button>
  );
}
