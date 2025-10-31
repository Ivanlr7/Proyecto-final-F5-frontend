import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthRepository from '../../src/api/repositories/AuthRepository';
import axios from 'axios';

vi.mock('axios');

describe('AuthRepository integration', () => {
  let authRepository;
  let mockAxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockAxiosInstance = {
      post: vi.fn(),
      interceptors: {
        response: {
          use: vi.fn()
        }
      }
    };

    axios.create.mockReturnValue(mockAxiosInstance);
    authRepository = new AuthRepository();
  });

  it('login envía los datos correctos al endpoint', async () => {
    const loginData = {
      identifier: 'test@example.com',
      password: 'password123'
    };
    
    const mockResponse = {
      status: 200,
      data: {
        token: 'mock-jwt-token',
        user: { id: 1, email: 'test@example.com' }
      }
    };

    mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

    const result = await authRepository.login(loginData);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', {
      identifier: loginData.identifier,
      password: loginData.password
    });
    expect(result).toEqual({
      success: true,
      status: 200,
      data: mockResponse.data
    });
  });

  it('logout envía el token correcto en el header', async () => {
    const token = 'mock-jwt-token';
    const mockResponse = {
      status: 200,
      data: { message: 'Logout successful' }
    };

    mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

    const result = await authRepository.logout(token);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    expect(result).toEqual({
      success: true,
      status: 200,
      data: mockResponse.data
    });
  });

  it('login maneja errores de autenticación', async () => {
    const loginData = {
      identifier: 'wrong@example.com',
      password: 'wrongpass'
    };

    const mockError = {
      response: {
        status: 401,
        data: { message: 'Invalid credentials' }
      }
    };

    mockAxiosInstance.post.mockRejectedValueOnce(mockError);

    await expect(authRepository.login(loginData)).rejects.toEqual(mockError);
  });
});
