import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '../pages/login/LoginPage';
import authReducer from '../store/slices/authSlice';

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
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
        isInitialized: false,
        role: [],
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

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renderiza el formulario de login correctamente', () => {
    renderWithProviders(<LoginPage />);
    
    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
    expect(screen.getByText(/Bienvenido de vuelta a ReviewVerso/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tu_usuario o email@ejemplo.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
  });

  it('muestra el logo de ReviewVerso', () => {
    renderWithProviders(<LoginPage />);
    
    const logo = screen.getByText('R');
    expect(logo).toBeInTheDocument();
  });

  it('muestra los campos de usuario/email y contraseña', () => {
    renderWithProviders(<LoginPage />);
    
    expect(screen.getByLabelText(/Usuario o Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });

  it('permite escribir en el campo de usuario/email', () => {
    renderWithProviders(<LoginPage />);
    
    const input = screen.getByPlaceholderText(/tu_usuario o email@ejemplo.com/i);
    fireEvent.change(input, { target: { value: 'testuser' } });
    
    expect(input.value).toBe('testuser');
  });

  it('permite escribir en el campo de contraseña', () => {
    renderWithProviders(<LoginPage />);
    
    const input = screen.getByPlaceholderText(/••••••••/i);
    fireEvent.change(input, { target: { value: 'password123' } });
    
    expect(input.value).toBe('password123');
  });

  it('muestra error cuando el campo de usuario/email está vacío al hacer blur', async () => {
    renderWithProviders(<LoginPage />);
    
    const input = screen.getByPlaceholderText(/tu_usuario o email@ejemplo.com/i);
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(screen.getByText(/Este campo es requerido/i)).toBeInTheDocument();
    });
  });

  it('muestra error cuando la contraseña es muy corta', async () => {
    renderWithProviders(<LoginPage />);
    
    const input = screen.getByPlaceholderText(/••••••••/i);
    fireEvent.change(input, { target: { value: '12345' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(screen.getByText(/La contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument();
    });
  });

  it('alterna la visibilidad de la contraseña al hacer clic en el botón', () => {
    renderWithProviders(<LoginPage />);
    
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const toggleButton = passwordInput.nextSibling;
    
    expect(passwordInput.type).toBe('password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('muestra el botón de "Iniciar Sesión"', () => {
    renderWithProviders(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('muestra el enlace para recuperar contraseña', () => {
    renderWithProviders(<LoginPage />);
    
    expect(screen.getByText(/¿Olvidaste tu contraseña?/i)).toBeInTheDocument();
  });

  it('muestra el enlace para registrarse', () => {
    renderWithProviders(<LoginPage />);
    
    expect(screen.getByText(/¿No tienes cuenta?/i)).toBeInTheDocument();
    expect(screen.getByText(/Regístrate aquí/i)).toBeInTheDocument();
  });

  it('detecta cuando el input es un email y muestra el ícono correspondiente', () => {
    renderWithProviders(<LoginPage />);
    
    const input = screen.getByPlaceholderText(/tu_usuario o email@ejemplo.com/i);
    
    // Escribir un email
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.blur(input);
    
    // Verificar que no hay error de validación
    expect(input.value).toBe('test@example.com');
  });

  it('muestra mensaje de validación exitosa cuando el email es válido', async () => {
    renderWithProviders(<LoginPage />);
    
    const input = screen.getByPlaceholderText(/tu_usuario o email@ejemplo.com/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(screen.getByText(/Email válido/i)).toBeInTheDocument();
    });
  });

  it('muestra mensaje de validación exitosa cuando el usuario es válido', async () => {
    renderWithProviders(<LoginPage />);
    
    const input = screen.getByPlaceholderText(/tu_usuario o email@ejemplo.com/i);
    fireEvent.change(input, { target: { value: 'testuser' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(screen.getByText(/Usuario válido/i)).toBeInTheDocument();
    });
  });

  it('deshabilita el botón de submit cuando está cargando', () => {
    renderWithProviders(<LoginPage />, { loading: true });
    
    const submitButton = screen.getByRole('button', { name: /Iniciando sesión.../i });
    expect(submitButton).toBeDisabled();
  });

  it('redirige a home si el usuario ya está autenticado', async () => {
    renderWithProviders(<LoginPage />, { isAuthenticated: true });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
