import { describe, it, expect, vi, beforeEach } from 'vitest';
import userService from '../../src/api/services/UserService';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('UserService integration', () => {
  it('getUserById obtiene usuario correctamente', async () => {
    const mockUser = { id: 1, name: 'Carlos' };
    userService.userRepository.getUserById = vi.fn().mockResolvedValueOnce({
      success: true,
      data: mockUser
    });
    const result = await userService.getUserById(1, 'fake-token');
    expect(userService.userRepository.getUserById).toHaveBeenCalledWith(1, 'fake-token');
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockUser);
  });

  it('getUserById maneja errores de red', async () => {
    userService.userRepository.getUserById = vi.fn().mockRejectedValueOnce({ 
      response: { status: 404, data: {} } 
    });
    await expect(userService.getUserById(999, 'fake-token')).rejects.toThrow('Usuario no encontrado');
  });

  it('getCurrentUser retorna usuario actual', async () => {
    const mockUser = { id: 2, name: 'Ana', profileImage: 'img.png' };
    userService.userRepository.getCurrentUser = vi.fn().mockResolvedValueOnce({
      success: true,
      data: mockUser
    });
    const result = await userService.getCurrentUser('fake-token');
    expect(result.success).toBe(true);
    expect(result.data.profileImage).toContain('img.png');
  });

  it('getCurrentUser maneja error de token', async () => {
    await expect(userService.getCurrentUser()).rejects.toThrow('Token de autenticación requerido');
  });

  it('getCurrentUser maneja error 401', async () => {
    userService.userRepository.getCurrentUser = vi.fn().mockRejectedValueOnce({
      response: { status: 401, data: {} }
    });
    await expect(userService.getCurrentUser('fake-token')).rejects.toThrow('No autorizado');
  });

  it('getCurrentUser maneja error 403', async () => {
    userService.userRepository.getCurrentUser = vi.fn().mockRejectedValueOnce({
      response: { status: 403, data: {} }
    });
    await expect(userService.getCurrentUser('fake-token')).rejects.toThrow('Acceso denegado');
  });

  it('getCurrentUser maneja error 500', async () => {
    userService.userRepository.getCurrentUser = vi.fn().mockRejectedValueOnce({
      response: { status: 500, data: {} }
    });
    await expect(userService.getCurrentUser('fake-token')).rejects.toThrow('Error interno');
  });

  it('getCurrentUser maneja error sin response', async () => {
    userService.userRepository.getCurrentUser = vi.fn().mockRejectedValueOnce({
      request: {}
    });
    await expect(userService.getCurrentUser('fake-token')).rejects.toThrow('Error de conexión');
  });

  it('updateUser actualiza usuario correctamente', async () => {
    const mockUser = { id: 3, name: 'Pepe', profileImage: 'img2.png' };
    userService.userRepository.updateUser = vi.fn().mockResolvedValueOnce({
      success: true,
      data: mockUser
    });
    const result = await userService.updateUser(3, { name: 'Pepe', profileImage: new File([''], 'a.png') }, 'fake-token');
    expect(result.success).toBe(true);
  });

  it('updateUser rechaza ID inválido', async () => {
    await expect(userService.updateUser(0, {}, 'token')).rejects.toThrow('ID de usuario inválido');
  });

  it('updateUser rechaza email inválido', async () => {
    await expect(userService.updateUser(1, { email: 'invalid' }, 'token')).rejects.toThrow('Email inválido');
  });

  it('updateUser rechaza nombre de usuario corto', async () => {
    await expect(userService.updateUser(1, { userName: 'ab' }, 'token')).rejects.toThrow('al menos 3 caracteres');
  });

  it('getAllUsers retorna lista de usuarios', async () => {
    const mockUsers = [{ id: 1 }, { id: 2 }];
    userService.userRepository.getAllUsers = vi.fn().mockResolvedValueOnce({
      success: true,
      data: mockUsers
    });
    const result = await userService.getAllUsers('fake-token');
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
  });

  it('deleteUser elimina usuario correctamente', async () => {
    userService.userRepository.deleteUser = vi.fn().mockResolvedValueOnce();
    const result = await userService.deleteUser(5, 'fake-token');
    expect(result.success).toBe(true);
  });

  it('getImageUrl retorna URL completa para imagen relativa', () => {
    const url = userService.getImageUrl('test.jpg');
    expect(url).toContain('localhost:8080');
    expect(url).toContain('test.jpg');
  });

  it('getImageUrl retorna imagen si ya es URL completa', () => {
    const httpUrl = 'http://example.com/image.jpg';
    expect(userService.getImageUrl(httpUrl)).toBe(httpUrl);
  });

  it('getImageUrl retorna imagen si es data URL', () => {
    const dataUrl = 'data:image/png;base64,abc123';
    expect(userService.getImageUrl(dataUrl)).toBe(dataUrl);
  });

  it('getImageUrl retorna null si no hay imagen', () => {
    expect(userService.getImageUrl(null)).toBeNull();
  });

  it('handleUserServiceError maneja error 409', async () => {
    userService.userRepository.deleteUser = vi.fn().mockRejectedValueOnce({
      response: { status: 409, data: {} }
    });
    await expect(userService.deleteUser(1, 'token')).rejects.toThrow('Conflicto');
  });

  it('validateUserData rechaza datos inválidos', () => {
    expect(() => userService.validateUserData(null)).toThrow('Datos de usuario inválidos');
  });

  it('isValidEmail valida emails correctamente', () => {
    expect(userService.isValidEmail('test@example.com')).toBe(true);
    expect(userService.isValidEmail('invalid')).toBe(false);
  });
});

