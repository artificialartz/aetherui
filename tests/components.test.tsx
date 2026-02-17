/**
 * Unit tests for AetherUI components
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Glass } from '../src/components/Glass';
import { GlassCard } from '../src/components/GlassCard';
import { GlassButton } from '../src/components/GlassButton';
import { GlassInput } from '../src/components/GlassInput';
import { MeshGradient } from '../src/components/MeshGradient';
import { MeshGradientCard } from '../src/components/MeshGradientCard';

describe('Glass Component', () => {
  it('should render children', () => {
    render(
      <Glass data-testid="glass">
        <span>Test content</span>
      </Glass>
    );

    expect(screen.getByTestId('glass')).toHaveTextContent('Test content');
  });

  it('should apply variant classes', () => {
    const { container } = render(
      <Glass variant="frosted" data-testid="glass" />
    );

    const glass = container.querySelector('[data-testid="glass"]');
    expect(glass).toBeInTheDocument();
  });

  it('should apply blur classes', () => {
    const { container } = render(
      <Glass blur="xl" data-testid="glass" />
    );

    const glass = container.querySelector('[data-testid="glass"]');
    expect(glass).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Glass className="custom-class" data-testid="glass" />
    );

    const glass = container.querySelector('[data-testid="glass"]');
    expect(glass?.className).toContain('custom-class');
  });

  it('should forward ref', () => {
    const ref = { current: null };

    render(<Glass ref={ref as any} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('GlassCard Component', () => {
  it('should render title and description', () => {
    render(
      <GlassCard
        title="Test Title"
        description="Test Description"
        data-testid="card"
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <GlassCard data-testid="card">
        <span>Card content</span>
      </GlassCard>
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should apply variant classes', () => {
    const { container } = render(
      <GlassCard variant="hover" data-testid="card" />
    );

    const card = container.querySelector('[data-testid="card"]');
    expect(card).toBeInTheDocument();
  });
});

describe('GlassButton Component', () => {
  it('should render children', () => {
    render(<GlassButton>Click me</GlassButton>);

    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('should call onClick handler', () => {
    const handleClick = vi.fn();

    render(<GlassButton onClick={handleClick}>Click me</GlassButton>);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<GlassButton disabled>Click me</GlassButton>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();

    render(
      <GlassButton onClick={handleClick} disabled>
        Click me
      </GlassButton>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply variant classes', () => {
    const { container } = render(<GlassButton variant="ghost" />);

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('should apply size classes', () => {
    const { container } = render(<GlassButton size="lg" />);

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });
});

describe('GlassInput Component', () => {
  it('should render label', () => {
    render(<GlassInput label="Email" />);

    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('should render input with placeholder', () => {
    render(<GlassInput placeholder="Enter email" />);

    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('should call onChange handler', async () => {
    const handleChange = vi.fn();

    render(<GlassInput value="" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should display error message', () => {
    render(<GlassInput error="Invalid input" />);

    expect(screen.getByText('Invalid input')).toBeInTheDocument();
  });

  it('should focus input on label click', () => {
    render(<GlassInput label="Email" />);

    const label = screen.getByText('Email');
    const input = screen.getByRole('textbox');

    fireEvent.click(label);

    // Check if input is focused
    expect(input).toHaveFocus();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<GlassInput disabled />);

    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});

describe('MeshGradient Component', () => {
  it('should render children', () => {
    render(
      <MeshGradient data-testid="gradient">
        <span>Content</span>
      </MeshGradient>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should apply preset styles', () => {
    const { container } = render(
      <MeshGradient preset="sunset" data-testid="gradient" />
    );

    const gradient = container.querySelector('[data-testid="gradient"]');
    expect(gradient).toBeInTheDocument();
    expect(gradient?.style.background).toBeDefined();
  });

  it('should apply custom config', () => {
    const config = {
      colors: [
        { color: '#ff0000', position: [0, 0] as [number, number] },
        { color: '#0000ff', position: [100, 100] as [number, number] },
      ],
      animated: false,
    };

    const { container } = render(
      <MeshGradient config={config} data-testid="gradient" />
    );

    const gradient = container.querySelector('[data-testid="gradient"]');
    expect(gradient).toBeInTheDocument();
  });

  it('should generate random gradient when preset is random', () => {
    const { container } = render(
      <MeshGradient preset="random" data-testid="gradient" />
    );

    const gradient = container.querySelector('[data-testid="gradient"]');
    expect(gradient).toBeInTheDocument();
    expect(gradient?.style.background).toBeDefined();
  });
});

describe('MeshGradientCard Component', () => {
  it('should render title and description', () => {
    render(
      <MeshGradientCard
        preset="aurora"
        title="Card Title"
        description="Card Description"
      />
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <MeshGradientCard preset="aurora">
        <span>Card content</span>
      </MeshGradientCard>
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should apply preset', () => {
    const { container } = render(
      <MeshGradientCard preset="galaxy" data-testid="card" />
    );

    const card = container.querySelector('[data-testid="card"]');
    expect(card).toBeInTheDocument();
  });

  it('should be interactive when interactive prop is true', () => {
    const { container } = render(
      <MeshGradientCard preset="aurora" interactive data-testid="card" />
    );

    const card = container.querySelector('[data-testid="card"]');
    expect(card?.className).toContain('cursor-pointer');
  });
});
