import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BentoGrid, BentoCard } from '../bento-grid';

describe('BentoGrid', () => {
  it('renders children correctly', () => {
    render(
      <BentoGrid>
        <div>Test Content</div>
      </BentoGrid>
    );
    expect(screen.getByText('Test Content')).toBeDefined();
  });

  it('applies correct grid classes', () => {
    const { container } = render(
      <BentoGrid>
        <div>Content</div>
      </BentoGrid>
    );
    
    const grid = container.firstChild as HTMLElement;
    expect(grid?.className).toContain('grid');
    expect(grid?.className).toContain('grid-cols-1');
    expect(grid?.className).toContain('md:grid-cols-2');
    expect(grid?.className).toContain('lg:grid-cols-3');
  });

  it('accepts custom className', () => {
    const { container } = render(
      <BentoGrid className="custom-class">
        <div>Content</div>
      </BentoGrid>
    );
    
    const grid = container.firstChild as HTMLElement;
    expect(grid?.className).toContain('custom-class');
  });
});

describe('BentoCard', () => {
  it('renders children correctly', () => {
    render(
      <BentoCard>
        <div>Card Content</div>
      </BentoCard>
    );
    expect(screen.getByText('Card Content')).toBeDefined();
  });

  it('applies span classes when provided', () => {
    const { container } = render(
      <BentoCard span="col-span-2 row-span-2">
        <div>Content</div>
      </BentoCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card?.className).toContain('col-span-2');
    expect(card?.className).toContain('row-span-2');
  });

  it('has hover effects', () => {
    const { container } = render(
      <BentoCard>
        <div>Content</div>
      </BentoCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card?.className).toContain('group');
    expect(card?.className).toContain('hover:border-white/20');
    expect(card?.className).toContain('backdrop-blur-2xl');
  });

  it('accepts custom className', () => {
    const { container } = render(
      <BentoCard className="custom-card">
        <div>Content</div>
      </BentoCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card?.className).toContain('custom-card');
  });
});
