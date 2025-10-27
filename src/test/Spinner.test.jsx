
import React from 'react';
import { render } from '@testing-library/react';
import Spinner from '../components/common/Spinner';
import { describe, it, expect } from 'vitest';

describe('Spinner', () => {
  it('renders without crashing', () => {
    const { container } = render(<Spinner />);
  expect(container.querySelector('.spinner2')).toBeInTheDocument();
  });

  it('applies custom size if provided', () => {
    const { container } = render(<Spinner size={60} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '60');
    expect(svg).toHaveAttribute('height', '60');
  });
});
