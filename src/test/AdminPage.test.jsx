import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import AdminPage from '../pages/admin/AdminPage';
import authReducer from '../store/slices/authSlice';
import userService from '../api/services/UserService';

vi.mock('../api/services/UserService');

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        token: 'mock-token',
        user: { idUser: 1, userName: 'admin', email: 'admin@test.com' },
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

describe('AdminPage', () => {
  const mockUsers = [
    { idUser: 1, userName: 'user1', email: 'user1@test.com', profileImage: null },
    { idUser: 2, userName: 'user2', email: 'user2@test.com', profileImage: null },
    { idUser: 3, userName: 'admin', email: 'admin@test.com', profileImage: null }
  ];

  beforeEach(() => {
    userService.getAllUsers = vi.fn().mockResolvedValue({
      success: true,
      data: mockUsers
    });
    userService.updateUser = vi.fn().mockResolvedValue({
      success: true,
      data: { idUser: 1, userName: 'updated', email: 'updated@test.com' }
    });
    userService.deleteUser = vi.fn().mockResolvedValue({ success: true });
    userService.getImageUrl = vi.fn().mockReturnValue(null);
  });

  it('renderiza el título principal', () => {
    renderWithProviders(<AdminPage />);
    expect(screen.getByText(/Administración de Usuarios/i)).toBeInTheDocument();
  });

  it('muestra el subtítulo', () => {
    renderWithProviders(<AdminPage />);
    expect(screen.getByText(/Gestiona todos los usuarios de la plataforma/i)).toBeInTheDocument();
  });

  it('muestra el campo de búsqueda', () => {
    renderWithProviders(<AdminPage />);
    expect(screen.getByPlaceholderText(/Buscar por nombre o email.../i)).toBeInTheDocument();
  });

  it('carga y muestra los usuarios', async () => {
    renderWithProviders(<AdminPage />);
    
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
    });
  });

  it('muestra las estadísticas de usuarios', async () => {
    renderWithProviders(<AdminPage />);
    
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText(/Total Usuarios/i)).toBeInTheDocument();
    });
  });

  it('filtra usuarios por nombre', async () => {
    renderWithProviders(<AdminPage />);
    
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Buscar por nombre o email.../i);
    fireEvent.change(searchInput, { target: { value: 'user1' } });
    
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.queryByText('user2')).not.toBeInTheDocument();
  });

  it('filtra usuarios por email', async () => {
    renderWithProviders(<AdminPage />);
    
    await waitFor(() => {
      expect(screen.getByText('admin@test.com')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Buscar por nombre o email.../i);
    fireEvent.change(searchInput, { target: { value: 'admin@test.com' } });
    
    expect(screen.getByText('admin@test.com')).toBeInTheDocument();
  });

  it('muestra mensaje cuando no hay resultados de búsqueda', async () => {
    renderWithProviders(<AdminPage />);
    
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Buscar por nombre o email.../i);
    fireEvent.change(searchInput, { target: { value: 'noexiste' } });
    
    expect(screen.getByText(/No se encontraron usuarios/i)).toBeInTheDocument();
  });

  it('muestra la tabla con las columnas correctas', async () => {
    renderWithProviders(<AdminPage />);
    
    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Avatar')).toBeInTheDocument();
      expect(screen.getByText('Usuario')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Acciones')).toBeInTheDocument();
    });
  });

  it('muestra estado de carga', () => {
    userService.getAllUsers = vi.fn().mockImplementation(() => 
      new Promise(() => {})
    );
    
    renderWithProviders(<AdminPage />);
    expect(screen.getByText(/Cargando usuarios.../i)).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando falla la carga', async () => {
    userService.getAllUsers = vi.fn().mockResolvedValue({
      success: false,
      message: 'Error al cargar'
    });
    
    renderWithProviders(<AdminPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error al cargar/i)).toBeInTheDocument();
    });
  });

  it('llama a getAllUsers con el token correcto', async () => {
    renderWithProviders(<AdminPage />);
    
    await waitFor(() => {
      expect(userService.getAllUsers).toHaveBeenCalledWith('mock-token');
    });
  });
});
