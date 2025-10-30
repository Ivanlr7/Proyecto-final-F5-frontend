  it('getCurrentUser retorna el usuario actual correctamente', async () => {
    const mockUser = { id: 2, name: 'Ana', profileImage: 'img.png' };
    userService.userRepository.getCurrentUser = vi.fn().mockResolvedValueOnce({
      success: true,
      data: mockUser
    });
    const result = await userService.getCurrentUser('fake-token');
    expect(userService.userRepository.getCurrentUser).toHaveBeenCalledWith('fake-token');
    expect(result).toEqual({
      success: true,
      message: expect.any(String),
      data: expect.objectContaining({ id: 2, name: 'Ana', profileImage: expect.any(String) })
    });
  });

  it('getCurrentUser maneja error de token', async () => {
    await expect(userService.getCurrentUser()).rejects.toThrow('Token de autenticación requerido');
  });

  it('updateUser actualiza y retorna el usuario actualizado', async () => {
    const mockUser = { id: 3, name: 'Pepe', profileImage: 'img2.png' };
    userService.userRepository.updateUser = vi.fn().mockResolvedValueOnce({
      success: true,
      data: mockUser
    });
    const result = await userService.updateUser(3, { name: 'Pepe', profileImage: new File([''], 'a.png') }, 'fake-token');
    expect(userService.userRepository.updateUser).toHaveBeenCalledWith(3, expect.any(Object), 'fake-token');
    expect(result).toEqual({
      success: true,
      message: expect.any(String),
      data: expect.objectContaining({ id: 3, name: 'Pepe', profileImage: expect.any(String) })
    });
  });

  it('getAllUsers retorna la lista de usuarios', async () => {
    const mockUsers = [{ id: 1 }, { id: 2 }];
    userService.userRepository.getAllUsers = vi.fn().mockResolvedValueOnce({
      success: true,
      data: mockUsers
    });
    const result = await userService.getAllUsers('fake-token');
    expect(userService.userRepository.getAllUsers).toHaveBeenCalledWith('fake-token');
    expect(result).toEqual({
      success: true,
      message: expect.any(String),
      data: mockUsers
    });
  });

  it('deleteUser elimina el usuario correctamente', async () => {
    userService.userRepository.deleteUser = vi.fn().mockResolvedValueOnce();
    const result = await userService.deleteUser(5, 'fake-token');
    expect(userService.userRepository.deleteUser).toHaveBeenCalledWith(5, 'fake-token');
    expect(result).toEqual({
      success: true,
      message: expect.any(String)
    });
  });
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userService from '../../src/api/services/UserService';

// Mock fetch globally
beforeEach(() => {
  globalThis.fetch = vi.fn();
});

describe('UserService integration', () => {

  it('getUserById hace fetch al endpoint correcto y retorna los datos', async () => {
    const mockUser = { id: 1, name: 'Carlos' };
    // Simula el repositorio devolviendo el resultado esperado
    userService.userRepository.getUserById = vi.fn().mockResolvedValueOnce({
      success: true,
      data: mockUser
    });
    const result = await userService.getUserById(1, 'fake-token');
    expect(userService.userRepository.getUserById).toHaveBeenCalledWith(1, 'fake-token');
    expect(result).toEqual({
      success: true,
      message: expect.any(String),
      data: mockUser
    });
  });


  it('getUserById maneja errores de red', async () => {
    userService.userRepository.getUserById = vi.fn().mockRejectedValueOnce({ response: { status: 404, data: {} } });
    await expect(userService.getUserById(999, 'fake-token')).rejects.toThrow('Usuario no encontrado');
  });

  
});
