import React from 'react';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
import { ThemeProvider } from '../theme-provider';
import { describe, it, expect, vi } from 'vitest';

// Mock Clerk hooks
vi.mock('@clerk/nextjs', () => ({
    useUser: () => ({
        user: {
            fullName: 'Test User',
            primaryEmailAddress: { emailAddress: 'test@example.com' },
            imageUrl: 'https://example.com/avatar.png'
        },
        isSignedIn: true
    }),
    usePathname: () => '/',
    UserButton: () => <div data-testid="user-button">User Button</div>,
    SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SignedOut: () => null,
    SignInButton: () => <button>Sign In</button>,
}));

vi.mock('next/navigation', () => ({
    usePathname: () => '/',
}));

describe('Sidebar', () => {
    const renderWithTheme = (component: React.ReactElement) => {
        return render(<ThemeProvider>{component}</ThemeProvider>);
    };

    it('renders correctly', () => {
        renderWithTheme(<Sidebar />);
        expect(screen.getByText('🏋️ CoachRX')).toBeDefined();
        // Dashboard appears twice (Desktop and Mobile)
        expect(screen.getAllByText('Dashboard')).toHaveLength(2);
        // "My Workouts" appears on desktop, "Workouts" on mobile
        expect(screen.getByText('My Workouts')).toBeDefined();
        expect(screen.getByText('Workouts')).toBeDefined();
    });

    it('displays user info when signed in', () => {
        renderWithTheme(<Sidebar />);
        expect(screen.getByText('Test User')).toBeDefined();
        expect(screen.getByText('test@example.com')).toBeDefined();
        expect(screen.getAllByTestId('user-button')).toHaveLength(2); // Desktop and Mobile
    });
});
