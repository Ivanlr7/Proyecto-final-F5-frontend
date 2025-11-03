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

  it('getPopularGames calcula offset correctamente para página 2', async () => {
    const mockGames = [{ id: 1, name: 'Test Game' }];
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGames
    });

    await videogameRepository.getPopularGames(2);
    
    const callArgs = globalThis.fetch.mock.calls[0];
    expect(callArgs[1].body).toContain('offset 20');
  });

  it('searchGames calcula offset correctamente para página 3', async () => {
    const mockGames = [{ id: 1, name: 'Test Game' }];
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGames
    });

    await videogameRepository.searchGames('test', 3);
    
    const callArgs = globalThis.fetch.mock.calls[0];
    expect(callArgs[1].body).toContain('offset 40');
  });

  it('getSimilarGames obtiene juegos similares', async () => {
    const gameId = 123;
    const similarIds = [1, 2, 3];
    
    // Primera llamada para obtener IDs de juegos similares
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: gameId, similar_games: similarIds }]
    });
    
    // Segunda llamada para obtener detalles de juegos similares
    const mockSimilarGames = [
      { id: 1, name: 'Similar Game 1' },
      { id: 2, name: 'Similar Game 2' }
    ];
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSimilarGames
    });

    const result = await videogameRepository.getSimilarGames(gameId, 1);
    
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual(mockSimilarGames);
  });

  it('getSimilarGames retorna array vacío si no hay juegos similares', async () => {
    const gameId = 123;
    
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: gameId, similar_games: [] }]
    });

    const result = await videogameRepository.getSimilarGames(gameId, 1);
    
    expect(result).toEqual([]);
  });

  it('getSimilarGames retorna array vacío si no existe similar_games', async () => {
    const gameId = 123;
    
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: gameId }]
    });

    const result = await videogameRepository.getSimilarGames(gameId, 1);
    
    expect(result).toEqual([]);
  });

  it('getSimilarGames maneja paginación correctamente', async () => {
    const gameId = 123;
    const similarIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: gameId, similar_games: similarIds }]
    });
    
    const mockSimilarGames = [{ id: 11, name: 'Similar Game 11' }];
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSimilarGames
    });

    await videogameRepository.getSimilarGames(gameId, 2);
    
    const callArgs = globalThis.fetch.mock.calls[1];
    expect(callArgs[1].body).toContain('11,12');
  });

  it('getGamesByGenre obtiene juegos por género', async () => {
    const genreId = 4;
    const mockGames = [
      { id: 1, name: 'RPG Game', genres: [{ name: 'RPG' }] }
    ];

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGames
    });

    const result = await videogameRepository.getGamesByGenre(genreId, 1);
    
    const callArgs = globalThis.fetch.mock.calls[0];
    expect(callArgs[1].body).toContain(`where genres = (${genreId})`);
    expect(result).toEqual(mockGames);
  });

  it('getUpcomingGames obtiene juegos próximos', async () => {
    const mockGames = [
      { id: 1, name: 'Upcoming Game', first_release_date: 9999999999 }
    ];

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGames
    });

    const result = await videogameRepository.getUpcomingGames(1);
    
    const callArgs = globalThis.fetch.mock.calls[0];
    expect(callArgs[1].body).toContain('where first_release_date >');
    expect(callArgs[1].body).toContain('sort hypes desc');
    expect(result).toEqual(mockGames);
  });

  it('getRecentGames obtiene juegos recientes', async () => {
    const mockGames = [
      { id: 1, name: 'Recent Game', first_release_date: 1700000000 }
    ];

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGames
    });

    const result = await videogameRepository.getRecentGames(1);
    
    const callArgs = globalThis.fetch.mock.calls[0];
    expect(callArgs[1].body).toContain('where first_release_date <');
    expect(callArgs[1].body).toContain('first_release_date >');
    expect(result).toEqual(mockGames);
  });

  it('makeRequest incluye headers correctos', async () => {
    const mockGames = [{ id: 1, name: 'Test Game' }];
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGames
    });

    await videogameRepository.getPopularGames(1);
    
    const callArgs = globalThis.fetch.mock.calls[0];
    expect(callArgs[1].headers).toEqual({
      'Client-ID': expect.any(String),
      'Authorization': expect.stringContaining('Bearer'),
      'Accept': 'application/json',
      'Content-Type': 'text/plain'
    });
  });

  it('makeRequest maneja error de red', async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(videogameRepository.getPopularGames()).rejects.toThrow('Network error');
  });
});
