import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegisterRepository from '../../src/api/repositories/RegisterRepository';
import axios from 'axios';

vi.mock('axios');

describe('RegisterRepository integration', () => {
  let registerRepository;
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
    registerRepository = new RegisterRepository();
  });

  it('register envía datos de usuario con FormData', async () => {
    const userData = {
      userName: 'newuser',
      email: 'new@example.com',
      password: 'password123'
    };

    const mockResponse = {
      status: 201,
      data: {
        id: 1,
        userName: userData.userName,
        email: userData.email
      }
    };

    mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

    const result = await registerRepository.register(userData, null);

    expect(mockAxiosInstance.post).toHaveBeenCalled();
    const callArgs = mockAxiosInstance.post.mock.calls[0];
    expect(callArgs[0]).toBe('/register');
    expect(callArgs[1]).toBeInstanceOf(FormData);
    expect(callArgs[2]).toEqual({
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    expect(result).toEqual({
      success: true,
      status: 201,
      data: mockResponse.data
    });
  });

  it('register envía datos con imagen de perfil', async () => {
    const userData = {
      userName: 'newuser',
      email: 'new@example.com',
      password: 'password123'
    };

    const mockFile = new File(['dummy content'], 'avatar.jpg', { type: 'image/jpeg' });

    const mockResponse = {
      status: 201,
      data: {
        id: 1,
        userName: userData.userName,
        email: userData.email,
        profileImagePath: 'avatar.jpg'
      }
    };

    mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

    const result = await registerRepository.register(userData, mockFile);

    expect(mockAxiosInstance.post).toHaveBeenCalled();
    const callArgs = mockAxiosInstance.post.mock.calls[0];
    expect(callArgs[0]).toBe('/register');
    expect(callArgs[1]).toBeInstanceOf(FormData);
    expect(result).toEqual({
      success: true,
      status: 201,
      data: mockResponse.data
    });
  });

  it('maneja errores de registro', async () => {
    const userData = {
      userName: 'existinguser',
      email: 'existing@example.com',
      password: 'password123'
    };

    const mockError = {
      response: {
        status: 409,
        data: { message: 'User already exists' }
      }
    };

    mockAxiosInstance.post.mockRejectedValueOnce(mockError);

    await expect(registerRepository.register(userData, null)).rejects.toEqual(mockError);
  });
});
