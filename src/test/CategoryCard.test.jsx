
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import CategoryCard from '../components/categoryCard/CategoryCard';

describe('CategoryCard', () => {
  it('renderiza el título, la descripción y la imagen', () => {
    render(
      <BrowserRouter>
        <CategoryCard
          title="Libros"
          description="Explora nuestra colección de libros."
          imageUrl="/test-image.jpg"
        />
      </BrowserRouter>
    );
    expect(screen.getByText('Libros')).toBeInTheDocument();
    expect(screen.getByText('Explora nuestra colección de libros.')).toBeInTheDocument();
    const img = screen.getByAltText('Libros');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-image.jpg');
  });

  it('aplica la clase extra si se pasa className', () => {
    const { container } = render(
      <BrowserRouter>
        <CategoryCard
          title="Películas"
          description="Descubre películas populares."
          imageUrl="/peliculas.jpg"
          className="extra-class"
        />
      </BrowserRouter>
    );
    const categoryCard = container.querySelector('.category-card');
    expect(categoryCard).toHaveClass('category-card');
    expect(categoryCard).toHaveClass('extra-class');
  });
});
