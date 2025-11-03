

import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import MediaCard from '../components/MediaCard/MediaCard';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

describe('MediaCard', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });
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
    const fallbackImg = screen.getByAltText('Sin imagen');
    expect(fallbackImg).toHaveAttribute('src',
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMGNpbmVtYSUyMGZpbG0lMjBkYXJrfGVufDF8fHx8MTc1OTc0NjE1NXww&ixlib=rb-4.1.0&q=80&w=1080'
    );
  });

  it('muestra rating badge para películas con vote_average', () => {
    const item = {
      title: 'Movie with Rating',
      release_year: 2020,
      vote_average: 8.5
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="movie" />
      </MemoryRouter>
    );
    expect(screen.getByText(/8.5/)).toBeInTheDocument();
  });

  it('formatea rating correctamente desde string', () => {
    const item = {
      title: 'String Rating',
      release_year: 2020,
      vote_average: '7.89'
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="movie" />
      </MemoryRouter>
    );
    expect(screen.getByText(/7.9/)).toBeInTheDocument();
  });

  it('muestra N/A para rating inválido', () => {
    const item = {
      title: 'Invalid Rating',
      release_year: 2020,
      vote_average: 'invalid'
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="movie" />
      </MemoryRouter>
    );
    expect(screen.getByText(/N\/A/)).toBeInTheDocument();
  });

  it('renderiza series correctamente con name y backdrop_url', () => {
    const item = {
      id: 1,
      name: 'Breaking Bad',
      first_air_date: '2008-01-20',
      backdrop_url: 'https://example.com/backdrop.jpg',
      vote_average: 9.5
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="series" />
      </MemoryRouter>
    );
    expect(screen.getAllByText('Breaking Bad')[0]).toBeInTheDocument();
    expect(screen.getByText('2008')).toBeInTheDocument();
    expect(screen.getByAltText('Breaking Bad')).toHaveAttribute('src', item.backdrop_url);
  });

  it('renderiza series con poster_url si no hay backdrop', () => {
    const item = {
      id: 1,
      name: 'Test Series',
      poster_url: 'https://example.com/poster.jpg',
      vote_average: 8.0
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="series" />
      </MemoryRouter>
    );
    expect(screen.getByAltText('Test Series')).toHaveAttribute('src', item.poster_url);
  });

  it('renderiza series con fallback si no hay imágenes', () => {
    const item = {
      id: 1,
      name: 'Series Sin Imagen',
      vote_average: 7.0
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="series" />
      </MemoryRouter>
    );
    const img = screen.getByAltText('Series Sin Imagen');
    expect(img).toHaveAttribute('src', expect.stringContaining('unsplash'));
  });

  it('renderiza videojuego correctamente', () => {
    const item = {
      id: 1,
      name: 'The Witcher 3',
      cover_url: 'https://example.com/cover.jpg',
      release_date: '2015-05-19',
      vote_average: 9.0
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="videogame" />
      </MemoryRouter>
    );
    expect(screen.getAllByText('The Witcher 3')[0]).toBeInTheDocument();
    expect(screen.getByText('2015')).toBeInTheDocument();
    expect(screen.getByAltText('The Witcher 3')).toHaveAttribute('src', item.cover_url);
  });

  it('renderiza videojuego con screenshot_url si no hay cover', () => {
    const item = {
      id: 1,
      name: 'Game Test',
      screenshot_url: 'https://example.com/screenshot.jpg',
      vote_average: 8.0
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="videogame" />
      </MemoryRouter>
    );
    expect(screen.getByAltText('Game Test')).toHaveAttribute('src', item.screenshot_url);
  });

  it('renderiza tipo game correctamente', () => {
    const item = {
      id: 1,
      name: 'Test Game',
      cover_url: 'https://example.com/cover.jpg',
      vote_average: 7.5
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="game" />
      </MemoryRouter>
    );
    expect(screen.getByText('Test Game')).toBeInTheDocument();
  });

  it('usa fallback de videogame para tipo game sin imagen', () => {
    const item = {
      id: 1,
      name: 'Game Without Image',
      vote_average: 7.0
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="game" />
      </MemoryRouter>
    );
    const img = screen.getByAltText('Game Without Image');
    expect(img.src).toContain('655976796204');
  });

  it('renderiza libro correctamente', () => {
    const item = {
      id: 1,
      title: '1984',
      cover_url: 'https://example.com/book.jpg',
      first_publish_year: 1949,
      vote_average: 9.0
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="book" />
      </MemoryRouter>
    );
    expect(screen.getAllByText('1984')[0]).toBeInTheDocument();
    expect(screen.getByText('1949')).toBeInTheDocument();
  });

  it('muestra rating badge para libros solo si vote_average está definido', () => {
    const item = {
      id: 1,
      title: 'Book with Rating',
      vote_average: 8.5,
      first_publish_year: 2020
    };

    const { container } = render(
      <MemoryRouter>
        <MediaCard item={item} type="book" />
      </MemoryRouter>
    );
    const ratingBadge = container.querySelector('.media-card__rating');
    expect(ratingBadge).toBeInTheDocument();
    expect(ratingBadge.textContent).toContain('8.5');
  });

  it('no muestra rating badge para libros sin vote_average', () => {
    const item = {
      id: 1,
      title: 'Book without Rating',
      first_publish_year: 2020
    };

    const { container } = render(
      <MemoryRouter>
        <MediaCard item={item} type="book" />
      </MemoryRouter>
    );
    const ratingBadge = container.querySelector('.media-card__rating');
    expect(ratingBadge).not.toBeInTheDocument();
  });

  it('navega correctamente al hacer click con navigate', () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);
    
    const item = {
      id: 123,
      title: 'Test Movie',
      release_year: 2020,
      vote_average: 8.0
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="movie" />
      </MemoryRouter>
    );

    const card = screen.getByAltText('Test Movie').closest('.media-card');
    fireEvent.click(card);
    expect(mockNavigate).toHaveBeenCalledWith('/peliculas/123');
  });

  it('llama onClick personalizado si se proporciona', () => {
    const mockOnClick = vi.fn();
    const item = {
      id: 123,
      title: 'Test Movie',
      release_year: 2020,
      vote_average: 8.0
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="movie" onClick={mockOnClick} />
      </MemoryRouter>
    );

    const card = screen.getByAltText('Test Movie').closest('.media-card');
    fireEvent.click(card);
    expect(mockOnClick).toHaveBeenCalledWith(123);
  });

  it('aplica className personalizado', () => {
    const item = {
      id: 1,
      title: 'Test',
      vote_average: 8.0
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="movie" className="custom-class" />
      </MemoryRouter>
    );

    const card = screen.getByAltText('Test').closest('.media-card');
    expect(card).toHaveClass('custom-class');
  });

  it('maneja error en carga de imagen', () => {
    const item = {
      id: 1,
      title: 'Image Error Test',
      poster_url: 'https://invalid-url.com/image.jpg',
      vote_average: 8.0
    };

    render(
      <MemoryRouter>
        <MediaCard item={item} type="movie" />
      </MemoryRouter>
    );

    const img = screen.getByAltText('Image Error Test');
    fireEvent.error(img);
    
    expect(img).toHaveAttribute('src', expect.stringContaining('unsplash'));
  });

  it('usa formatted_vote_average si está disponible', () => {
    const item = {
      id: 1,
      title: 'Formatted Rating',
      vote_average: 8.888,
      formatted_vote_average: 8.9,
      release_year: 2020
    };

    const { container } = render(
      <MemoryRouter>
        <MediaCard item={item} type="movie" />
      </MemoryRouter>
    );
    const ratingBadge = container.querySelector('.media-card__rating');
    expect(ratingBadge.textContent).toContain('8.9');
  });

  it('retorna rutas correctas para cada tipo', () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    const types = [
      { type: 'movie', path: '/peliculas/1' },
      { type: 'series', path: '/series/1' },
      { type: 'game', path: '/juegos/1' },
      { type: 'videogame', path: '/videojuegos/1' },
      { type: 'book', path: '/libros/1' }
    ];

    types.forEach(({ type, path }) => {
      mockNavigate.mockClear();
      const item = { id: 1, title: 'Test', name: 'Test', vote_average: 8.0 };
      
      const { unmount } = render(
        <MemoryRouter>
          <MediaCard item={item} type={type} />
        </MemoryRouter>
      );

      const card = screen.getByAltText('Test').closest('.media-card');
      fireEvent.click(card);
      expect(mockNavigate).toHaveBeenCalledWith(path);
      unmount();
    });
  });
});