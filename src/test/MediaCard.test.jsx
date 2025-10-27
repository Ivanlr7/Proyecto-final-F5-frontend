

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

  it('muestra el icono de fallback si no hay imagen', () => {
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
    // Check that at least one visible fallback icon exists
    const fallbackIcons = screen.getAllByText('🎬');
    const visibleIcon = fallbackIcons.find(
      (el) => el.parentElement.style.display !== 'none'
    );
    expect(visibleIcon).toBeInTheDocument();
  });
});