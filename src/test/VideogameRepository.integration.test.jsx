import { describe, it, expect, vi, beforeEach } from 'vitest';
import videogameRepository from '../../src/api/repositories/VideogameRepository';

describe('VideogameRepository integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('getPopularGames obtiene juegos populares', async () => {
    const mockGames = [
      { id: 1, name: 'Test Game', rating: 85, cover: { image_id: 'abc' } }
    ];

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGames
    });

    const result = await videogameRepository.getPopularGames(1);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/igdb/v4/games'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Client-ID': expect.any(String),
          'Authorization': expect.stringContaining('Bearer')
        })
      })
    );
    expect(result).toEqual(mockGames);
  });

  it('searchGames busca juegos por query', async () => {
    const query = 'test game';
    const mockGames = [
      { id: 1, name: 'Test Game' }
    ];

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGames
    });

    const result = await videogameRepository.searchGames(query, 1);

    expect(globalThis.fetch).toHaveBeenCalled();
    const callArgs = globalThis.fetch.mock.calls[0];
    expect(callArgs[0]).toContain('/api/igdb/v4/games');
    expect(callArgs[1].body).toContain(`search "${query}"`);
    expect(result).toEqual(mockGames);
  });

  it('getGameById obtiene detalles de un juego', async () => {
    const gameId = 123;
    const mockGame = {
      id: gameId,
      name: 'Test Game',
      summary: 'Test summary'
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockGame]
    });

    const result = await videogameRepository.getGameById(gameId);

    expect(globalThis.fetch).toHaveBeenCalled();
    const callArgs = globalThis.fetch.mock.calls[0];
    expect(callArgs[0]).toContain('/api/igdb/v4/games');
    expect(callArgs[1].body).toContain(`where id = ${gameId}`);
    expect(result).toEqual(mockGame);
  });

  it('maneja errores de fetch', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    });

    await expect(videogameRepository.getPopularGames()).rejects.toThrow();
  });
});
