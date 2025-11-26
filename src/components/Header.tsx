import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export function Header() {
    return (
        <header className="border-b bg-background">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                    🏋️ CoachRX Exporter
                </Link>

                <nav className="flex items-center gap-6">
                    <Link href="/workouts" className="text-sm font-medium hover:underline underline-offset-4">
                        My Workouts
                    </Link>

                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium transition-colors">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </nav>
            </div>
        </header>
    )
}
