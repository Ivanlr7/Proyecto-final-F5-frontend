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

  it('refreshUserProfile actualiza el usuario en localStorage', async () => {
    localStorage.setItem('reviewverso_token', 't');
    localStorage.setItem('reviewverso_user', '{"id":1}');
    vi.spyOn(authService, 'isTokenValid').mockReturnValue(true);
    const getCurrentUserMock = vi.spyOn(userService, 'getCurrentUser').mockResolvedValueOnce({ success: true, data: { name: 'Nuevo' } });
    const updated = await authService.refreshUserProfile();
    expect(localStorage.getItem('reviewverso_user')).toContain('Nuevo');
    expect(updated).toEqual(expect.objectContaining({ name: 'Nuevo' }));
    getCurrentUserMock.mockRestore();
  });
});
