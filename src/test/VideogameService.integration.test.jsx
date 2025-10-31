import { describe, it, expect, vi, beforeEach } from 'vitest';
import videogameService from '../../src/api/services/VideogameService';
import VideogameRepository from '../../src/api/repositories/VideogameRepository';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('VideogameService integration', () => {
  it('getImageUrl genera la URL correcta para una imagen', () => {
    const url = videogameService.getImageUrl('abc123', 'cover_big');
    expect(url).toBe('https://images.igdb.com/igdb/image/upload/t_cover_big/abc123.jpg');
  });

  it('getImageUrl retorna null si no hay imageId', () => {
    const url = videogameService.getImageUrl(null);
    expect(url).toBeNull();
  });

  it('formatGame formatea correctamente un juego', () => {
    const game = {
      id: 1,
      name: 'Test Game',
      cover: { image_id: 'abc123' },
      screenshots: [{ image_id: 'xyz789' }],
      first_release_date: 1609459200,
      rating: 85,
      summary: 'Test summary'
    };
    const formatted = videogameService.formatGame(game);
    expect(formatted).toEqual(expect.objectContaining({
      id: 1,
      name: 'Test Game',
      poster_path: 'abc123',
      backdrop_path: 'xyz789',
      cover_url: expect.stringContaining('abc123'),
      vote_average: 8.5,
      overview: 'Test summary'
    }));
  });

  it('getPopularGames llama al repository y formatea resultados', async () => {
    const mockGames = [{ id: 1, name: 'Test Game', cover: { image_id: 'abc' } }];
    const spy = vi.spyOn(VideogameRepository, 'getPopularGames').mockResolvedValueOnce(mockGames);
    const result = await videogameService.getPopularGames(1);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    spy.mockRestore();
  });
});
