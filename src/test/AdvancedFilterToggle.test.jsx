import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import AdvancedFilterToggle from '../components/common/AdvancedFilterToggle';

describe('AdvancedFilterToggle', () => {
  afterEach(() => {
    cleanup();
  });
  it('muestra el texto por defecto', () => {
    render(<AdvancedFilterToggle open={false} onClick={() => {}} />);

    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'span' && /filtros avanzados/i.test(content);
    })).toBeInTheDocument();
  });

  it('llama a onClick cuando se hace click', () => {
    const handleClick = vi.fn();
    render(<AdvancedFilterToggle open={false} onClick={handleClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
