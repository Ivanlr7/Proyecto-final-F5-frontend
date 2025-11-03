import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../pages/register/RegisterPage';
import registerService from '../api/services/RegisterService';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});


vi.mock('../api/services/RegisterService', () => ({
  default: {
    registerUser: vi.fn(),
  },
}));


const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('RegisterPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
  });

  it('renderiza el formulario de registro correctamente', () => {
    renderWithRouter(<RegisterPage />);
    
    expect(screen.getByText(/Crear Cuenta/i)).toBeInTheDocument();
    expect(screen.getByText(/Únete a ReviewVerso y comienza a compartir tus reseñas/i)).toBeInTheDocument();
  });

  it('muestra el logo de ReviewVerso', () => {
    renderWithRouter(<RegisterPage />);
    
    const logo = screen.getByText('R');
    expect(logo).toBeInTheDocument();
  });

  it('muestra todos los campos del formulario', () => {
    renderWithRouter(<RegisterPage />);
    
    expect(screen.getByLabelText(/Nombre de Usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Contraseña$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar Contraseña/i)).toBeInTheDocument();
  });

  it('muestra la opción de subir foto de perfil', () => {
    renderWithRouter(<RegisterPage />);
    
    expect(screen.getByText(/Subir foto de perfil/i)).toBeInTheDocument();
  });

  it('permite escribir en el campo de nombre de usuario', () => {
    renderWithRouter(<RegisterPage />);
    
    const input = screen.getByPlaceholderText(/Tu nombre de usuario/i);
    fireEvent.change(input, { target: { value: 'testuser' } });
    
    expect(input.value).toBe('testuser');
  });

  it('permite escribir en el campo de email', () => {
    renderWithRouter(<RegisterPage />);
    
    const input = screen.getByPlaceholderText(/tu@email.com/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    expect(input.value).toBe('test@example.com');
  });

  it('permite escribir en el campo de contraseña', () => {
    renderWithRouter(<RegisterPage />);
    
    const inputs = screen.getAllByPlaceholderText(/••••••••/i);
    const passwordInput = inputs[0];
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  it('permite escribir en el campo de confirmar contraseña', () => {
    renderWithRouter(<RegisterPage />);
    
    const inputs = screen.getAllByPlaceholderText(/••••••••/i);
    const confirmPasswordInput = inputs[1];
    
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    expect(confirmPasswordInput.value).toBe('password123');
  });

  it('muestra error cuando el nombre de usuario está vacío al enviar', async () => {
    renderWithRouter(<RegisterPage />);
    
    const submitButton = screen.getByRole('button', { name: /Crear Cuenta/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/El nombre de usuario es obligatorio/i)).toBeInTheDocument();
    });
  });

  it('muestra error cuando el nombre de usuario es muy corto', async () => {
    renderWithRouter(<RegisterPage />);
    
    const input = screen.getByPlaceholderText(/Tu nombre de usuario/i);
    fireEvent.change(input, { target: { value: 'ab' } });
    
    const submitButton = screen.getByRole('button', { name: /Crear Cuenta/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/El nombre de usuario debe tener al menos 3 caracteres/i)).toBeInTheDocument();
    });
  });

  it('muestra error cuando el email no es válido', async () => {
    renderWithRouter(<RegisterPage />);
    
    const input = screen.getByPlaceholderText(/tu@email.com/i);
    fireEvent.change(input, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByRole('button', { name: /Crear Cuenta/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/El email no es válido/i)).toBeInTheDocument();
    });
  });

  it('muestra error cuando la contraseña es muy corta', async () => {
    renderWithRouter(<RegisterPage />);
    
    const inputs = screen.getAllByPlaceholderText(/••••••••/i);
    const passwordInput = inputs[0];
    
    fireEvent.change(passwordInput, { target: { value: '1234567' } });
    
    const submitButton = screen.getByRole('button', { name: /Crear Cuenta/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/La contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument();
    });
  });

  it('muestra error cuando las contraseñas no coinciden', async () => {
    renderWithRouter(<RegisterPage />);
    
    const inputs = screen.getAllByPlaceholderText(/••••••••/i);
    const passwordInput = inputs[0];
    const confirmPasswordInput = inputs[1];
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
    
    const submitButton = screen.getByRole('button', { name: /Crear Cuenta/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
    });
  });

  it('muestra mensaje de éxito cuando las contraseñas coinciden', () => {
    renderWithRouter(<RegisterPage />);
    
    const inputs = screen.getAllByPlaceholderText(/••••••••/i);
    const passwordInput = inputs[0];
    const confirmPasswordInput = inputs[1];
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    expect(screen.getByText(/Las contraseñas coinciden/i)).toBeInTheDocument();
  });

  it('alterna la visibilidad de la contraseña al hacer clic en el botón', () => {
    renderWithRouter(<RegisterPage />);
    
    const inputs = screen.getAllByPlaceholderText(/••••••••/i);
    const passwordInput = inputs[0];
    const toggleButton = passwordInput.nextSibling;
    
    expect(passwordInput.type).toBe('password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('alterna la visibilidad de confirmar contraseña al hacer clic en el botón', () => {
    renderWithRouter(<RegisterPage />);
    
    const inputs = screen.getAllByPlaceholderText(/••••••••/i);
    const confirmPasswordInput = inputs[1];
    const toggleButton = confirmPasswordInput.nextSibling;
    
    expect(confirmPasswordInput.type).toBe('password');
    
    fireEvent.click(toggleButton);
    expect(confirmPasswordInput.type).toBe('text');
    
    fireEvent.click(toggleButton);
    expect(confirmPasswordInput.type).toBe('password');
  });

  it('muestra el indicador de fortaleza de contraseña', () => {
    renderWithRouter(<RegisterPage />);
    
    const inputs = screen.getAllByPlaceholderText(/••••••••/i);
    const passwordInput = inputs[0];
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Verifica que aparezca algún indicador de fortaleza
    expect(screen.getByText(/Débil|Media|Buena|Fuerte/i)).toBeInTheDocument();
  });

  it('muestra el enlace para iniciar sesión', () => {
    renderWithRouter(<RegisterPage />);
    
    expect(screen.getByText(/¿Ya tienes cuenta?/i)).toBeInTheDocument();
    expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument();
  });

  it('muestra el botón de "Crear Cuenta"', () => {
    renderWithRouter(<RegisterPage />);
    
    const submitButton = screen.getByRole('button', { name: /Crear Cuenta/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('limpia los errores cuando el usuario empieza a escribir', async () => {
    renderWithRouter(<RegisterPage />);
    
    // Primero provocar un error
    const submitButton = screen.getByRole('button', { name: /Crear Cuenta/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/El nombre de usuario es obligatorio/i)).toBeInTheDocument();
    });
    
    // Ahora escribir en el campo
    const input = screen.getByPlaceholderText(/Tu nombre de usuario/i);
    fireEvent.change(input, { target: { value: 'testuser' } });
    
    // El error debería desaparecer
    expect(screen.queryByText(/El nombre de usuario es obligatorio/i)).not.toBeInTheDocument();
  });

  it('muestra estado de carga durante el envío', async () => {
    registerService.registerUser.mockImplementation(() => 
      new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    );
    
    renderWithRouter(<RegisterPage />);
    
    // Llenar el formulario con datos válidos
    const usernameInput = screen.getByPlaceholderText(/Tu nombre de usuario/i);
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i);
    const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });
    
    const submitButton = screen.getByRole('button', { name: /Crear Cuenta/i });
    fireEvent.click(submitButton);
    
    // Verificar que muestra "Registrando..."
    await waitFor(() => {
      expect(screen.getByText(/Registrando.../i)).toBeInTheDocument();
    });
  });

  it('maneja el cambio de imagen correctamente', () => {
    renderWithRouter(<RegisterPage />);
    
    const fileInput = screen.getByLabelText(/Subir foto de perfil/i);
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // El archivo debería estar en el input
    expect(fileInput.files[0]).toBe(file);
  });
});
