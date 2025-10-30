import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Avatar from '../components/common/Avatar';

describe('Avatar component', () => {
  it('renders initials when no image is provided', () => {
    render(<Avatar name="Carlos" />);
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('renders the image when image prop is provided (string)', () => {
    render(<Avatar image="https://fakeimg.pl/100x100/" name="Ana" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining('https://fakeimg.pl/100x100/'));
  });

  it('renders the correct initial for the name', () => {
    render(<Avatar name="Beatriz" />);
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('applies custom size', () => {
    render(<Avatar name="Dani" size={80} />);
    const avatar = screen.getByText('D').parentElement;
    expect(avatar).toHaveStyle('width: 80px');
    expect(avatar).toHaveStyle('height: 80px');
  });
});
