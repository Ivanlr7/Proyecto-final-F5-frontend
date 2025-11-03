import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ListPage from '../pages/lists/listPage';
import authReducer from '../store/slices/authSlice';
import ListService from '../api/services/ListService';

vi.mock('../api/services/ListService');
vi.mock('../api/services/MovieService');
vi.mock('../api/services/ShowService');
vi.mock('../api/services/BookService');
vi.mock('../api/services/VideogameService');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        token: 'mock-token',
        isAuthenticated: true,
        ...initialState,
      },
    },
  });
};

const renderWithProviders = (component, initialState = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </Provider>
  );
};

describe('ListPage', () => {
  const mockLists = [
    {
      id: 1,
      idList: 1,
      title: 'Mis películas favoritas',
      userName: 'usuario1',
      items: []
    },
    {
      id: 2,
      idList: 2,
      title: 'Series para ver',
      userName: 'usuario2',
      items: []
    }
  ];

  beforeEach(() => {
    ListService.prototype.getAllLists = vi.fn().mockResolvedValue({
      success: true,
      data: mockLists
    });
  });

  it('renderiza el título de listas', () => {
    renderWithProviders(<ListPage />);
    expect(screen.getByText(/Listas/i)).toBeInTheDocument();
  });

  it('muestra el botón de crear nueva lista', () => {
    renderWithProviders(<ListPage />);
    expect(screen.getByRole('button', { name: /Crear nueva lista/i })).toBeInTheDocument();
  });

  it('muestra spinner mientras carga', () => {
    ListService.prototype.getAllLists = vi.fn().mockImplementation(() => 
      new Promise(() => {})
    );
    
    renderWithProviders(<ListPage />);
    expect(document.querySelector('.spinner2')).toBeInTheDocument();
  });

  it('carga y muestra las listas', async () => {
    renderWithProviders(<ListPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Mis películas favoritas')).toBeInTheDocument();
      expect(screen.getByText('Series para ver')).toBeInTheDocument();
    });
  });

  it('muestra el nombre del creador de la lista', async () => {
    renderWithProviders(<ListPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/usuario1/i)).toBeInTheDocument();
      expect(screen.getByText(/usuario2/i)).toBeInTheDocument();
    });
  });

  it('navega a crear lista cuando el usuario está autenticado', async () => {
    renderWithProviders(<ListPage />);
    
    const createButton = screen.getByRole('button', { name: /Crear nueva lista/i });
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/listas/crear');
    });
  });

  it('muestra modal si intenta crear lista sin autenticación', () => {
    renderWithProviders(<ListPage />, { isAuthenticated: false, token: null });
    
    const createButton = screen.getByRole('button', { name: /Crear nueva lista/i });
    fireEvent.click(createButton);
    
    expect(screen.getByText(/Debes iniciar sesión para crear una lista/i)).toBeInTheDocument();
  });

  it('muestra error cuando falla la carga', async () => {
    ListService.prototype.getAllLists = vi.fn().mockResolvedValue({
      success: false,
      error: 'Error al cargar listas'
    });
    
    renderWithProviders(<ListPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error al cargar listas/i)).toBeInTheDocument();
    });
  });

  it('los enlaces de lista apuntan a la URL correcta', async () => {
    renderWithProviders(<ListPage />);
    
    await waitFor(() => {
      const link = screen.getByText('Mis películas favoritas').closest('a');
      expect(link).toHaveAttribute('href', '/listas/1');
    });
  });
});
