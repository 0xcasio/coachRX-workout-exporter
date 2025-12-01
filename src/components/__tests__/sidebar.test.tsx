import { render, screen } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
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
    it('renders correctly', () => {
        render(<Sidebar />);
        expect(screen.getByText('🏋️ CoachRX')).toBeDefined();
        // Dashboard and My Workouts appear twice (Desktop and Mobile)
        expect(screen.getAllByText('Dashboard')).toHaveLength(2);
        expect(screen.getAllByText('My Workouts')).toHaveLength(2);
    });

    it('displays user info when signed in', () => {
        render(<Sidebar />);
        expect(screen.getByText('Test User')).toBeDefined();
        expect(screen.getByText('test@example.com')).toBeDefined();
        expect(screen.getAllByTestId('user-button')).toHaveLength(2); // Desktop and Mobile
    });
});
