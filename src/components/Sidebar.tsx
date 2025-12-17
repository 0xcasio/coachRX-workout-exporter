"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Home, Dumbbell, User, Plus, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useUser();

    const links = [
        { href: "/", label: "Dashboard", icon: Home },
        { href: "/workouts", label: "My Workouts", icon: Dumbbell },
        { href: "/gym-cost", label: "Gym Cost", icon: DollarSign },
    ];

    return (
        <>
            {/* Desktop Sidebar - Only show when signed in */}
            <SignedIn>
                <aside className="hidden md:flex flex-col w-64 border-r-2 border-border bg-card h-screen sticky top-0">
                    <div className="p-6 border-b-2 border-border">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl uppercase">
                            <span>🏋️ CoachRX</span>
                        </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 border-2 transition-all",
                                        isActive
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "border-transparent hover:border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-bold uppercase text-sm">{link.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t-2 border-border space-y-3">
                        {/* Theme Toggle */}
                        <div className="w-full">
                            <ThemeToggle variant="outline" size="sm" className="w-full" />
                        </div>
                        
                        <div className="flex items-center gap-3 px-2">
                            <UserButton afterSignOutUrl="/" />
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-bold uppercase truncate">
                                    {user?.fullName || user?.username || "User"}
                                </span>
                                <span className="text-xs text-muted-foreground truncate font-mono">
                                    {user?.primaryEmailAddress?.emailAddress}
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>
            </SignedIn>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t-2 border-border z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <div className="relative grid grid-cols-5 h-16 items-center">
                    {/* Dashboard - Column 1 */}
                    <Link
                        href="/"
                        className={cn(
                            "flex flex-col items-center gap-1 justify-center h-full",
                            pathname === "/"
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Home className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Dashboard</span>
                    </Link>

                    {/* My Workouts - Column 2 */}
                    <Link
                        href="/workouts"
                        className={cn(
                            "flex flex-col items-center gap-1 justify-center h-full",
                            pathname === "/workouts"
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Dumbbell className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Workouts</span>
                    </Link>

                    {/* Upload CTA - Column 3 (Center) */}
                    <Link
                        href="/upload"
                        className="flex flex-col items-center justify-end h-full pb-1"
                    >
                        <div className="bg-primary text-primary-foreground border-2 border-primary p-4 hover:shadow-[4px_4px_0_0_rgb(var(--foreground))] transition-all -mt-8">
                            <Plus className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] font-bold uppercase text-primary mt-1">Upload</span>
                    </Link>

                    {/* Gym Cost - Column 4 */}
                    <Link
                        href="/gym-cost"
                        className={cn(
                            "flex flex-col items-center gap-1 justify-center h-full",
                            pathname === "/gym-cost"
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <DollarSign className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Cost</span>
                    </Link>

                    {/* User Profile - Column 5 */}
                    <div className="flex flex-col items-center gap-1 justify-center h-full">
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="flex flex-col items-center gap-1 text-muted-foreground">
                                    <User className="w-6 h-6" />
                                    <span className="text-[10px] font-medium">Sign In</span>
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </nav>
        </>
    );
}
