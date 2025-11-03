import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import UserPage from '../pages/user/UserPage';
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
        user: { idUser: 1, userName: 'testuser', email: 'test@example.com' },
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

describe('UserPage', () => {
  const mockUserData = {
    idUser: 1,
    userName: 'testuser',
    email: 'test@example.com',
    profileImage: null
  };

  beforeEach(() => {
    userService.getCurrentUser = vi.fn().mockResolvedValue({
      success: true,
      data: mockUserData
    });
    userService.deleteUser = vi.fn().mockResolvedValue({ success: true });
  });

  it('renderiza el título de perfil', async () => {
    renderWithProviders(<UserPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Mi Perfil/i)).toBeInTheDocument();
    });
  });

  it('muestra el subtítulo', async () => {
    renderWithProviders(<UserPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Gestiona tu información personal/i)).toBeInTheDocument();
    });
  });

  it('carga y muestra los datos del usuario', async () => {
    renderWithProviders(<UserPage />);
    
    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('muestra el botón de editar perfil', async () => {
    renderWithProviders(<UserPage />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Editar Perfil/i })).toBeInTheDocument();
    });
  });

  it('muestra los campos de nombre y email', async () => {
    renderWithProviders(<UserPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Nombre de Usuario/i)).toBeInTheDocument();
      expect(screen.getByText(/Correo Electrónico/i)).toBeInTheDocument();
    });
  });

  it('activa el modo edición al hacer clic en editar', async () => {
    renderWithProviders(<UserPage />);
    
    await waitFor(() => {
      const editButton = screen.getByRole('button', { name: /Editar Perfil/i });
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Guardar Cambios/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
    });
  });

  it('muestra inputs en modo edición', async () => {
    renderWithProviders(<UserPage />);
    
    await waitFor(() => {
      const editButton = screen.getByRole('button', { name: /Editar Perfil/i });
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(0);
    });
  });

  it('cancela la edición correctamente', async () => {
    renderWithProviders(<UserPage />);
    
    await waitFor(() => {
      const editButton = screen.getByRole('button', { name: /Editar Perfil/i });
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
      fireEvent.click(cancelButton);
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Editar Perfil/i })).toBeInTheDocument();
    });
  });

  it('muestra el botón de eliminar cuenta', async () => {
    renderWithProviders(<UserPage />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Eliminar cuenta/i })).toBeInTheDocument();
    });
  });

  it('muestra mensaje de carga cuando está cargando', () => {
    userService.getCurrentUser = vi.fn().mockImplementation(() => 
      new Promise(() => {})
    );
    
    renderWithProviders(<UserPage />);
    expect(screen.getByText(/Cargando perfil.../i)).toBeInTheDocument();
  });

  it('muestra el logo de ReviewVerso', async () => {
    renderWithProviders(<UserPage />);
    
    await waitFor(() => {
      expect(screen.getByText('R')).toBeInTheDocument();
    });
  });

  it('no muestra datos si no está autenticado', () => {
    renderWithProviders(<UserPage />, { isAuthenticated: false });
    
    expect(screen.getByText(/Debes iniciar sesión para ver tu perfil/i)).toBeInTheDocument();
  });

  it('llama a getCurrentUser con el token correcto', async () => {
    renderWithProviders(<UserPage />);
    
    await waitFor(() => {
      expect(userService.getCurrentUser).toHaveBeenCalledWith('mock-token');
    });
  });
});
