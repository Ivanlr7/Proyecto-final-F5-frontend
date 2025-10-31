import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserRepository from '../../src/api/repositories/UserRepository';
import axios from 'axios';

vi.mock('axios');

describe('UserRepository integration', () => {
  let userRepository;
  let mockAxiosInstance;
  const mockToken = 'mock-jwt-token';

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockAxiosInstance = {
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        response: {
          use: vi.fn()
        }
      }
    };

    axios.create.mockReturnValue(mockAxiosInstance);
    userRepository = new UserRepository();
  });

  it('getCurrentUser obtiene el usuario autenticado', async () => {
    const mockUser = {
      id: 1,
      userName: 'testuser',
      email: 'test@example.com'
    };

    const mockResponse = {
      status: 200,
      data: mockUser
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await userRepository.getCurrentUser(mockToken);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/me', {
      headers: {
        Authorization: `Bearer ${mockToken}`
      }
    });
    expect(result).toEqual({
      success: true,
      status: 200,
      data: mockUser
    });
  });

  it('getUserById obtiene un usuario por ID', async () => {
    const userId = 1;
    const mockUser = {
      id: userId,
      userName: 'testuser',
      email: 'test@example.com'
    };

    const mockResponse = {
      status: 200,
      data: mockUser
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await userRepository.getUserById(userId, mockToken);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${mockToken}`
      }
    });
    expect(result).toEqual({
      success: true,
      status: 200,
      data: mockUser
    });
  });

  it('getAllUsers obtiene todos los usuarios', async () => {
    const mockUsers = [
      { id: 1, userName: 'user1' },
      { id: 2, userName: 'user2' }
    ];

    const mockResponse = {
      status: 200,
      data: mockUsers
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await userRepository.getAllUsers(mockToken);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users', {
      headers: {
        Authorization: `Bearer ${mockToken}`
      }
    });
    expect(result).toEqual({
      success: true,
      status: 200,
      data: mockUsers
    });
  });

  it('updateUser actualiza los datos del usuario con FormData', async () => {
    const userId = 1;
    const userData = {
      userName: 'updateduser',
      email: 'updated@example.com'
    };

    const mockResponse = {
      status: 200,
      data: { ...userData, id: userId }
    };

    mockAxiosInstance.put.mockResolvedValueOnce(mockResponse);

    const result = await userRepository.updateUser(userId, userData, mockToken);

    expect(mockAxiosInstance.put).toHaveBeenCalled();
    const callArgs = mockAxiosInstance.put.mock.calls[0];
    expect(callArgs[0]).toBe(`/users/${userId}`);
    expect(callArgs[1]).toBeInstanceOf(FormData);
    expect(callArgs[2]).toEqual({
      headers: {
        Authorization: `Bearer ${mockToken}`
      }
    });
    expect(result).toEqual({
      success: true,
      status: 200,
      data: mockResponse.data
    });
  });

  it('deleteUser elimina un usuario', async () => {
    const userId = 1;
    const mockResponse = {
      status: 204,
      data: null
    };

    mockAxiosInstance.delete.mockResolvedValueOnce(mockResponse);

    const result = await userRepository.deleteUser(userId, mockToken);

    expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${mockToken}`
      }
    });
    expect(result).toEqual({
      success: true,
      status: 204,
      data: null
    });
  });

  it('maneja errores al obtener el usuario actual', async () => {
    const mockError = {
      response: {
        status: 401,
        data: { message: 'Unauthorized' }
      }
    };

    mockAxiosInstance.get.mockRejectedValueOnce(mockError);

    await expect(userRepository.getCurrentUser(mockToken)).rejects.toEqual(mockError);
  });
});
