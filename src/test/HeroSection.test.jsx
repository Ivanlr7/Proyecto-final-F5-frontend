import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HeroSection from '../components/hero/HeroSection';

describe('HeroSection', () => {
  it('renderiza el título, la descripción y el botón', () => {
    render(<HeroSection />);
    expect(
      screen.getByText(/Descubre y Comparte tus/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Explora un universo de películas, series, videojuegos y libros/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Explorar Reseñas/i })
    ).toBeInTheDocument();
  });

  it('aplica las clases principales de la sección', () => {
    const { container } = render(<HeroSection />);
    expect(container.querySelector('section.hero-section')).toBeInTheDocument();
    expect(container.querySelector('.hero-section__title-gradient')).toBeInTheDocument();
    expect(container.querySelector('.hero-section__cta')).toBeInTheDocument();
  });
});
