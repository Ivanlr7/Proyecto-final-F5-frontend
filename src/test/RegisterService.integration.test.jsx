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
});
