import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '../page';
import { ThemeProvider } from '@/components/theme-provider';

// Mock Clerk components
vi.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-in">{children}</div>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-out">{children}</div>,
  useUser: () => ({
    user: null,
    isSignedIn: false,
  }),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock storage hook
vi.mock('@/lib/storage', () => ({
  useWorkoutStorage: () => ({
    saveWorkout: vi.fn(),
    getWorkouts: vi.fn(() => Promise.resolve([])),
    isSignedIn: false,
  }),
}));

// Mock other components
vi.mock('@/components/landing-page', () => ({
  LandingPage: () => <div data-testid="landing-page">Landing Page</div>,
}));

vi.mock('@/components/gym-cost/dashboard-card', () => ({
  GymCostCard: () => <div>Gym Cost Card</div>,
}));

vi.mock('@/components/stats-overview', () => ({
  StatsOverview: () => <div>Stats Overview</div>,
}));

vi.mock('@/components/upload-zone', () => ({
  UploadZone: () => <div>Upload Zone</div>,
}));

vi.mock('@/components/date-picker', () => ({
  DatePicker: () => <div>Date Picker</div>,
}));

describe('Home Page', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('renders landing page for signed-out users', () => {
    renderWithTheme(<Home />);
    expect(screen.getByTestId('signed-out')).toBeDefined();
    expect(screen.getByTestId('landing-page')).toBeDefined();
  });

  it('renders dashboard for signed-in users', () => {
    // Mock SignedIn to show children
    vi.doMock('@clerk/nextjs', () => ({
      SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
      SignedOut: () => null,
      useUser: () => ({
        user: { id: '123' },
        isSignedIn: true,
      }),
    }));

    renderWithTheme(<Home />);
    // Dashboard should render (we can check for dashboard-specific content)
    expect(screen.getByText(/Dashboard/i)).toBeDefined();
  });
});