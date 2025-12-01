"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Home, Dumbbell, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useUser();

    const links = [
        { href: "/", label: "Dashboard", icon: Home },
        { href: "/workouts", label: "My Workouts", icon: Dumbbell },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-card h-screen sticky top-0">
                <div className="p-6 border-b">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
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
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <SignedIn>
                        <div className="flex items-center gap-3 px-2">
                            <UserButton afterSignOutUrl="/" />
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-medium truncate">
                                    {user?.fullName || user?.username || "User"}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                    {user?.primaryEmailAddress?.emailAddress}
                                </span>
                            </div>
                        </div>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors">
                                <User className="w-4 h-4" />
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50 pb-safe">
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
                        <span className="text-[10px] font-medium">My Workouts</span>
                    </Link>

                    {/* Upload CTA - Column 3 (Center) */}
                    <Link
                        href="/upload"
                        className="flex flex-col items-center justify-end h-full pb-1"
                    >
                        <div className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:bg-primary/90 transition-colors -mt-8">
                            <Plus className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] font-medium text-primary mt-1">Upload</span>
                    </Link>

                    {/* Empty spacer - Column 4 */}
                    <div className="h-full"></div>

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
