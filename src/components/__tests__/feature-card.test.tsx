import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeatureCard } from '../feature-card';
import { Sparkles } from 'lucide-react';

describe('FeatureCard', () => {
  it('renders title and description', () => {
    render(
      <FeatureCard
        title="Test Feature"
        description="This is a test description"
      />
    );
    
    expect(screen.getByText('Test Feature')).toBeDefined();
    expect(screen.getByText('This is a test description')).toBeDefined();
  });

  it('renders icon when provided', () => {
    render(
      <FeatureCard
        icon={Sparkles}
        title="Test Feature"
        description="Test description"
      />
    );
    
    // Icon should be rendered (lucide icons render as SVGs)
    const iconContainer = screen.getByText('Test Feature').closest('div')?.parentElement;
    expect(iconContainer?.querySelector('svg')).toBeDefined();
  });

  it('does not render icon when not provided', () => {
    const { container } = render(
      <FeatureCard
        title="Test Feature"
        description="Test description"
      />
    );
    
    // Should not have icon container
    const iconContainer = container.querySelector('.w-12.h-12');
    expect(iconContainer).toBeNull();
  });

  it('renders children when provided', () => {
    render(
      <FeatureCard
        title="Test Feature"
        description="Test description"
      >
        <button>Action Button</button>
      </FeatureCard>
    );
    
    expect(screen.getByText('Action Button')).toBeDefined();
  });

  it('applies semibold styling to title', () => {
    render(
      <FeatureCard
        title="Test Feature"
        description="Test description"
      />
    );
    
    const title = screen.getByText('Test Feature');
    expect(title.className).toContain('font-semibold');
  });

  it('accepts custom className', () => {
    const { container } = render(
      <FeatureCard
        title="Test Feature"
        description="Test description"
        className="custom-class"
      />
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card?.className).toContain('custom-class');
  });
});
