import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TabButton from '../components/common/TabButton';

describe('TabButton', () => {
  it('renders children', () => {
    render(<TabButton>Tab label</TabButton>);
    expect(screen.getByText('Tab label')).toBeInTheDocument();
  });

  it('applies active class when active=true', () => {
    render(<TabButton active>Active Tab</TabButton>);
    const button = screen.getByRole('button', { name: /active tab/i });
    expect(button.className).toMatch(/tab-nav__tab--active/);
  });

  it('does not apply active class when active=false', () => {
    render(<TabButton>Inactive Tab</TabButton>);
    const button = screen.getByRole('button', { name: /inactive tab/i });
    expect(button.className).not.toMatch(/tab-nav__tab--active/);
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<TabButton onClick={handleClick}>Click me</TabButton>);
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
