import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import HomePage from '../pages/home/HomePage';
import authReducer from '../store/slices/authSlice';
import movieService from '../api/services/MovieService';
import showService from '../api/services/ShowService';

vi.mock('../api/services/MovieService');
vi.mock('../api/services/ShowService');

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

const renderWithProviders = (component) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </Provider>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    movieService.getPopularMovies = vi.fn().mockResolvedValue({
      data: {
        results: [
          { id: 1, title: 'Movie 1', poster_path: '/path1.jpg' },
          { id: 2, title: 'Movie 2', poster_path: '/path2.jpg' }
        ]
      }
    });

    showService.getPopularShows = vi.fn().mockResolvedValue({
      data: {
        results: [
          { id: 1, name: 'Show 1', poster_path: '/path1.jpg' },
          { id: 2, name: 'Show 2', poster_path: '/path2.jpg' }
        ]
      }
    });
  });

  it('renderiza la sección hero', () => {
    renderWithProviders(<HomePage />);
    expect(document.querySelector('.home')).toBeInTheDocument();
  });

  it('muestra el título de contenido popular', async () => {
    renderWithProviders(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText(/Contenido Popular/i)).toBeInTheDocument();
    });
  });

  it('muestra el título de categorías', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Categorías/i)).toBeInTheDocument();
  });

  it('muestra las 4 categorías principales', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Películas/i)).toBeInTheDocument();
    expect(screen.getByText(/Series/i)).toBeInTheDocument();
    expect(screen.getByText(/Videojuegos/i)).toBeInTheDocument();
    expect(screen.getByText(/Libros/i)).toBeInTheDocument();
  });

  it('muestra descripciones de categorías', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Reseñas de los últimos estrenos y clásicos del cine/i)).toBeInTheDocument();
    expect(screen.getByText(/Análisis de series populares y nuevos lanzamientos/i)).toBeInTheDocument();
    expect(screen.getByText(/Opiniones sobre los videojuegos más jugados/i)).toBeInTheDocument();
    expect(screen.getByText(/Reseñas de bestsellers y otros libros literarios/i)).toBeInTheDocument();
  });

  it('muestra el título de reseñas destacadas', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Reseñas Destacadas/i)).toBeInTheDocument();
  });

  it('muestra las reseñas destacadas', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/El Legado Oculto/i)).toBeInTheDocument();
    expect(screen.getByText(/Sombras del Pasado/i)).toBeInTheDocument();
    expect(screen.getByText(/Mundo Virtual/i)).toBeInTheDocument();
    expect(screen.getByText(/El Enigma de la Noche/i)).toBeInTheDocument();
  });

  it('llama a los servicios para obtener contenido popular', async () => {
    renderWithProviders(<HomePage />);
    
    await waitFor(() => {
      expect(movieService.getPopularMovies).toHaveBeenCalled();
      expect(showService.getPopularShows).toHaveBeenCalled();
    });
  });

  it('renderiza la estructura principal correctamente', () => {
    renderWithProviders(<HomePage />);
    
    expect(document.querySelector('.home')).toBeInTheDocument();
    expect(document.querySelector('.slider-section')).toBeInTheDocument();
    expect(document.querySelector('.categories-section')).toBeInTheDocument();
    expect(document.querySelector('.featured-section')).toBeInTheDocument();
  });
});
