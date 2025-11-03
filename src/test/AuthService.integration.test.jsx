import { describe, it, expect, vi, beforeEach } from 'vitest';
import authService from '../../src/api/services/AuthService';
import userService from '../../src/api/services/UserService';

// Limpia localStorage y mocks antes de cada test
beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('AuthService integration', () => {
  it('login guarda token y usuario correctamente', async () => {
    const fakeToken = 'header.payload.signature';
    const fakeUser = { id: 1, name: 'Test' };
    authService.authRepository.login = vi.fn().mockResolvedValueOnce({
      success: true,
      data: { token: fakeToken }
    });
    // Mock de decodeTokenPayload y getCurrentUser
    vi.spyOn(authService, 'decodeTokenPayload').mockReturnValueOnce({ id: 1, name: 'Test' });
    const userServiceBackup = authService.userService;
    authService.userService = { getCurrentUser: vi.fn().mockResolvedValueOnce({ success: true, data: fakeUser }) };
    const result = await authService.login({ identifier: 'a', password: 'b' });
    expect(authService.authRepository.login).toHaveBeenCalled();
    expect(localStorage.getItem('reviewverso_token')).toBe(fakeToken);
    expect(localStorage.getItem('reviewverso_user')).toContain('Test');
    expect(result).toEqual(expect.objectContaining({ success: true, token: fakeToken, user: expect.any(Object) }));
    authService.userService = userServiceBackup;
  });

  it('login lanza error con datos inválidos', async () => {
    await expect(authService.login({ identifier: '', password: '' })).rejects.toThrow();
  });

  it('logout limpia el token y usuario', async () => {
    localStorage.setItem('reviewverso_token', 't');
    localStorage.setItem('reviewverso_user', '{"id":1}');
    authService.authRepository.logout = vi.fn().mockResolvedValueOnce();
    const result = await authService.logout();
    expect(localStorage.getItem('reviewverso_token')).toBeNull();
    expect(localStorage.getItem('reviewverso_user')).toBeNull();
    expect(result).toEqual(expect.objectContaining({ success: true }));
  });

  it('isAuthenticated retorna true si el token es válido', () => {
    localStorage.setItem('reviewverso_token', 't');
    vi.spyOn(authService, 'isTokenValid').mockReturnValueOnce(true);
    expect(authService.isAuthenticated()).toBe(true);
  });

  it('isAuthenticated retorna false si no hay token', () => {
    // No hay token en localStorage
    const result = authService.isAuthenticated();
    expect(result === false || result === null).toBe(true);
  });

  it('login maneja error 401 (credenciales inválidas)', async () => {
    authService.authRepository.login = vi.fn().mockRejectedValueOnce({
      response: { status: 401, data: { message: 'Credenciales inválidas' } }
    });
    await expect(authService.login({ identifier: 'test', password: 'wrong' }))
      .rejects.toThrow('Credenciales inválidas');
  });

  it('login maneja error 400 (datos inválidos)', async () => {
    authService.authRepository.login = vi.fn().mockRejectedValueOnce({
      response: { status: 400, data: 'Bad request' }
    });
    await expect(authService.login({ identifier: 'test', password: 'pass' }))
      .rejects.toThrow('Datos de login inválidos');
  });

  it('login maneja error 500 (error del servidor)', async () => {
    authService.authRepository.login = vi.fn().mockRejectedValueOnce({
      response: { status: 500, data: {} }
    });
    await expect(authService.login({ identifier: 'test', password: 'pass' }))
      .rejects.toThrow('Error interno del servidor');
  });

  it('login maneja error de conexión', async () => {
    authService.authRepository.login = vi.fn().mockRejectedValueOnce({
      request: {}
    });
    await expect(authService.login({ identifier: 'test', password: 'pass' }))
      .rejects.toThrow('Error de conexión con el servidor');
  });

  it('login maneja respuesta inválida del servidor', async () => {
    authService.authRepository.login = vi.fn().mockResolvedValueOnce({
      success: false,
      data: {}
    });
    await expect(authService.login({ identifier: 'test', password: 'pass' }))
      .rejects.toThrow();
  });

  it('validateLoginData rechaza identifier vacío', () => {
    expect(() => authService.validateLoginData({ identifier: '', password: 'pass' }))
      .toThrow('El email o nombre de usuario es requerido');
  });

  it('validateLoginData rechaza password vacío', () => {
    expect(() => authService.validateLoginData({ identifier: 'user', password: '' }))
      .toThrow('La contraseña es requerida');
  });

  it('setToken y getToken funcionan correctamente', () => {
    authService.setToken('test-token');
    expect(authService.getToken()).toBe('test-token');
  });

  it('setUser y getUser funcionan correctamente', () => {
    const user = { id: 1, name: 'Test User' };
    authService.setUser(user);
    const retrieved = authService.getUser();
    expect(retrieved).toEqual(user);
  });

  it('getUser retorna null si no hay usuario guardado', () => {
    expect(authService.getUser()).toBeNull();
  });

  it('clearAuthData limpia token y usuario', () => {
    authService.setToken('token');
    authService.setUser({ id: 1 });
    authService.clearAuthData();
    expect(authService.getToken()).toBeNull();
    expect(authService.getUser()).toBeNull();
  });

  it('decodeTokenPayload decodifica token correctamente', () => {
    // Token JWT válido de ejemplo (header.payload.signature)
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0In0.signature';
    const decoded = authService.decodeTokenPayload(validToken);
    expect(decoded).toHaveProperty('id');
    expect(decoded.id).toBe(1);
  });

  it('decodeTokenPayload retorna null para token inválido', () => {
    const invalidToken = 'invalid.token';
    const decoded = authService.decodeTokenPayload(invalidToken);
    expect(decoded).toBeNull();
  });

  it('isTokenValid retorna true para token válido no expirado', () => {
    // Token con expiración en el futuro
    const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hora en el futuro
    vi.spyOn(authService, 'decodeTokenPayload').mockReturnValueOnce({ exp: futureExp });
    expect(authService.isTokenValid('token')).toBe(true);
  });

  it('isTokenValid retorna false para token expirado', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hora en el pasado
    vi.spyOn(authService, 'decodeTokenPayload').mockReturnValueOnce({ exp: pastExp });
    expect(authService.isTokenValid('token')).toBe(false);
  });

  it('isTokenValid retorna false para token sin exp', () => {
    vi.spyOn(authService, 'decodeTokenPayload').mockReturnValueOnce({});
    expect(authService.isTokenValid('token')).toBe(false);
  });

  it('isTokenValid retorna false si decodeTokenPayload falla', () => {
    vi.spyOn(authService, 'decodeTokenPayload').mockReturnValueOnce(null);
    expect(authService.isTokenValid('token')).toBe(false);
  });

  it('getTokenExpiration retorna fecha de expiración correcta', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    vi.spyOn(authService, 'decodeTokenPayload').mockReturnValueOnce({ exp: futureExp });
    const expDate = authService.getTokenExpiration('token');
    expect(expDate).toBeInstanceOf(Date);
    expect(expDate.getTime()).toBe(futureExp * 1000);
  });

  it('getTokenExpiration retorna null para token sin exp', () => {
    vi.spyOn(authService, 'decodeTokenPayload').mockReturnValueOnce({});
    expect(authService.getTokenExpiration('token')).toBeNull();
  });

  it('logout maneja error al invalidar token en servidor', async () => {
    localStorage.setItem('reviewverso_token', 'token');
    authService.authRepository.logout = vi.fn().mockRejectedValueOnce(new Error('Server error'));
    const result = await authService.logout();
    expect(result.success).toBe(true);
    expect(authService.getToken()).toBeNull();
  });

  it('refreshUserProfile actualiza el perfil del usuario', async () => {
    const token = 'valid-token';
    const currentUser = { id: 1, username: 'test' };
    const updatedData = { id: 1, username: 'test', email: 'test@example.com' };
    
    authService.setToken(token);
    authService.setUser(currentUser);
    
    vi.spyOn(authService, 'isTokenValid').mockReturnValueOnce(true);
    vi.spyOn(userService, 'getCurrentUser').mockResolvedValueOnce({
      success: true,
      data: updatedData
    });
    
    const result = await authService.refreshUserProfile();
    expect(result).toEqual(expect.objectContaining(updatedData));
    expect(authService.getUser()).toEqual(expect.objectContaining(updatedData));
  });

  it('refreshUserProfile lanza error si no hay token válido', async () => {
    vi.spyOn(authService, 'isTokenValid').mockReturnValueOnce(false);
    await expect(authService.refreshUserProfile()).rejects.toThrow('No hay token válido');
  });

  it('refreshUserProfile lanza error si getCurrentUser falla', async () => {
    const token = 'valid-token';
    authService.setToken(token);
    
    vi.spyOn(authService, 'isTokenValid').mockReturnValueOnce(true);
    vi.spyOn(userService, 'getCurrentUser').mockResolvedValueOnce({
      success: false
    });
    
    await expect(authService.refreshUserProfile()).rejects.toThrow();
  });
});
