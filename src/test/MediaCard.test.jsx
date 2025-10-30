

// ...existing code...

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MediaCard from '../components/MediaCard/MediaCard';


describe('MediaCard', () => {
  it('muestra el título y año de una película', () => {
    const item = {
      title: 'Matrix',
      release_year: 1999,
      poster_url: 'https://example.com/matrix.jpg',
      vote_average: 8.7
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="movie" />
      </MemoryRouter>
    );
    expect(screen.getByText('Matrix')).toBeInTheDocument();
    expect(screen.getByText('1999')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', item.poster_url);
  });

  it('muestra la imagen de fallback si no hay imagen', () => {
    const item = {
      title: 'Sin imagen',
      release_year: 2020,
      vote_average: 7.5
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="movie" />
      </MemoryRouter>
    );
    expect(screen.getByText('Sin imagen')).toBeInTheDocument();
    // Verifica que la imagen con alt 'Sin imagen' tenga el src de fallback
    const fallbackImg = screen.getByAltText('Sin imagen');
    expect(fallbackImg).toHaveAttribute('src',
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMGNpbmVtYSUyMGZpbG0lMjBkYXJrfGVufDF8fHx8MTc1OTc0NjE1NXww&ixlib=rb-4.1.0&q=80&w=1080'
    );
  });
});