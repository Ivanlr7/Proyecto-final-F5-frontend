import { describe, it, expect, vi, beforeEach } from 'vitest';
import registerService from '../../src/api/services/RegisterService';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('RegisterService integration', () => {
  it('registerUser valida y llama al repository con datos correctos', async () => {
    const formData = {
      userName: 'testuser',
      email: 'test@test.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      profileImage: null
    };
    registerService.registerRepository.register = vi.fn().mockResolvedValueOnce({ success: true, data: { id: 1 } });
    const result = await registerService.registerUser(formData);
    expect(registerService.registerRepository.register).toHaveBeenCalledWith(
      expect.objectContaining({ userName: 'testuser', email: 'test@test.com', password: 'Password123!' }),
      null
    );
    expect(result).toEqual({ success: true, data: { id: 1 } });
  });

  it('registerUser lanza error si el nombre de usuario es muy corto', async () => {
    const formData = {
      userName: 'ab',
      email: 'test@test.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };
    await expect(registerService.registerUser(formData)).rejects.toThrow('El nombre de usuario debe tener al menos 3 caracteres');
  });

  it('registerUser maneja errores de red', async () => {
    const formData = {
      userName: 'testuser',
      email: 'test@test.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };
    registerService.registerRepository.register = vi.fn().mockRejectedValueOnce({ request: {} });
    await expect(registerService.registerUser(formData)).rejects.toThrow('Error de conexión con el servidor');
  });

  it('validateUserData rechaza email inválido', () => {
    const userData = {
      userName: 'testuser',
      email: 'invalid-email',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };
    expect(() => registerService.validateUserData(userData))
      .toThrow('El email no es válido');
  });

  it('validateUserData rechaza contraseña corta', () => {
    const userData = {
      userName: 'testuser',
      email: 'test@test.com',
      password: 'short',
      confirmPassword: 'short'
    };
    expect(() => registerService.validateUserData(userData))
      .toThrow('La contraseña debe tener al menos 8 caracteres');
  });

  it('validateUserData rechaza contraseñas que no coinciden', () => {
    const userData = {
      userName: 'testuser',
      email: 'test@test.com',
      password: 'Password123!',
      confirmPassword: 'DifferentPass123!'
    };
    expect(() => registerService.validateUserData(userData))
      .toThrow('Las contraseñas no coinciden');
  });

  it('validateUserData rechaza tipo de imagen inválido', () => {
    const userData = {
      userName: 'testuser',
      email: 'test@test.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      profileImage: { type: 'application/pdf', size: 1000 }
    };
    expect(() => registerService.validateUserData(userData))
      .toThrow('La imagen debe ser JPG, PNG o WebP');
  });

  it('validateUserData rechaza imagen muy grande', () => {
    const userData = {
      userName: 'testuser',
      email: 'test@test.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      profileImage: { type: 'image/jpeg', size: 6 * 1024 * 1024 } // 6MB
    };
    expect(() => registerService.validateUserData(userData))
      .toThrow('La imagen no puede superar los 5MB');
  });

  it('validateUserData acepta imagen válida', () => {
    const userData = {
      userName: 'testuser',
      email: 'test@test.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      profileImage: { type: 'image/jpeg', size: 2 * 1024 * 1024 } // 2MB
    };
    expect(() => registerService.validateUserData(userData)).not.toThrow();
  });

  it('validateUserData acepta datos sin imagen', () => {
    const userData = {
      userName: 'testuser',
      email: 'test@test.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };
    expect(() => registerService.validateUserData(userData)).not.toThrow();
  });

  it('registerUser maneja error de respuesta del servidor', async () => {
    const formData = {
      userName: 'testuser',
      email: 'test@test.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };
    registerService.registerRepository.register = vi.fn().mockRejectedValueOnce({
      response: { status: 409, data: { message: 'Usuario ya existe' } }
    });
    await expect(registerService.registerUser(formData))
      .rejects.toThrow('Usuario ya existe');
  });

  it('registerUser maneja error de respuesta sin mensaje específico', async () => {
    const formData = {
      userName: 'testuser',
      email: 'test@test.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };
    registerService.registerRepository.register = vi.fn().mockRejectedValueOnce({
      response: { status: 500, data: {} }
    });
    await expect(registerService.registerUser(formData))
      .rejects.toThrow('Error al registrar usuario');
  });

  it('validateUserData acepta diferentes tipos de imagen válidos', () => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    
    validTypes.forEach(type => {
      const userData = {
        userName: 'testuser',
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        profileImage: { type, size: 1000 }
      };
      expect(() => registerService.validateUserData(userData)).not.toThrow();
    });
  });
});
