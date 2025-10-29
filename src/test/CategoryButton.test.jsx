import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CategoryButton from '../components/common/CategoryButton';

describe('CategoryButton', () => {
  it('renderiza el texto correctamente', () => {
    render(<CategoryButton>Populares</CategoryButton>);
    expect(screen.getByText('Populares')).toBeInTheDocument();
  });

  it('llama a onClick cuando se hace click', () => {
    const handleClick = vi.fn();
    render(<CategoryButton onClick={handleClick}>Click me</CategoryButton>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('aplica la clase active cuando active=true', () => {
    render(<CategoryButton active>Activo</CategoryButton>);
    expect(screen.getByText('Activo').className).toMatch(/active/);
  });

  it('no aplica la clase active cuando active=false', () => {
    render(<CategoryButton>Inactivo</CategoryButton>);
    expect(screen.getByText('Inactivo').className).not.toMatch(/active/);
  });
});
