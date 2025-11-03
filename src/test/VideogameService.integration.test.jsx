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

  it('getImageUrl usa tamaño por defecto si no se especifica', () => {
    const url = videogameService.getImageUrl('abc123');
    expect(url).toBe('https://images.igdb.com/igdb/image/upload/t_cover_big/abc123.jpg');
  });

  it('formatGame formatea correctamente un juego completo', () => {
    const game = {
      id: 1,
      name: 'Test Game',
      cover: { image_id: 'abc123' },
      screenshots: [{ image_id: 'xyz789' }],
      first_release_date: 1609459200,
      rating: 85,
      summary: 'Test summary',
      genres: [{ id: 1 }, { id: 2 }]
    };
    const formatted = videogameService.formatGame(game);
    expect(formatted).toEqual(expect.objectContaining({
      id: 1,
      name: 'Test Game',
      poster_path: 'abc123',
      backdrop_path: 'xyz789',
      cover_url: expect.stringContaining('abc123'),
      screenshot_url: expect.stringContaining('xyz789'),
      vote_average: 8.5,
      overview: 'Test summary',
      genre_ids: [1, 2],
      formatted_vote_average: '8.5',
      release_year: 2021
    }));
  });

  it('formatGame maneja juego sin cover', () => {
    const game = {
      id: 1,
      name: 'Test Game',
      artworks: [{ image_id: 'art123' }],
      summary: 'Test'
    };
    const formatted = videogameService.formatGame(game);
    expect(formatted.poster_path).toBeNull();
    expect(formatted.backdrop_path).toBe('art123');
    expect(formatted.backdrop_url).toContain('art123');
  });

  it('formatGame maneja juego sin screenshots pero con artworks', () => {
    const game = {
      id: 1,
      name: 'Test Game',
      cover: { image_id: 'cov123' },
      artworks: [{ image_id: 'art456' }]
    };
    const formatted = videogameService.formatGame(game);
    expect(formatted.backdrop_path).toBe('art456');
  });

  it('formatGame maneja juego sin fecha de lanzamiento', () => {
    const game = {
      id: 1,
      name: 'Test Game'
    };
    const formatted = videogameService.formatGame(game);
    expect(formatted.release_date).toBeNull();
    expect(formatted.release_year).toBeNull();
  });

  it('formatGame maneja juego sin rating', () => {
    const game = {
      id: 1,
      name: 'Test Game'
    };
    const formatted = videogameService.formatGame(game);
    expect(formatted.vote_average).toBeNull();
    expect(formatted.formatted_vote_average).toBeNull();
  });

  it('getPopularGames llama al repository y formatea resultados', async () => {
    const mockGames = [{ id: 1, name: 'Test Game', cover: { image_id: 'abc' } }];
    const spy = vi.spyOn(VideogameRepository, 'getPopularGames').mockResolvedValueOnce(mockGames);
    const result = await videogameService.getPopularGames(1);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('cover_url');
    spy.mockRestore();
  });

  it('searchGames llama al repository y formatea resultados', async () => {
    const mockGames = [
      { id: 1, name: 'Search Result', cover: { image_id: 'search123' } }
    ];
    const spy = vi.spyOn(VideogameRepository, 'searchGames').mockResolvedValueOnce(mockGames);
    const result = await videogameService.searchGames('test', 1);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(spy).toHaveBeenCalledWith('test', 1);
    spy.mockRestore();
  });

  it('getGameById retorna juego detallado formateado', async () => {
    const mockGame = {
      id: 1,
      name: 'Detailed Game',
      cover: { image_id: 'det123' },
      involved_companies: [
        { developer: true, company: { name: 'Dev Studio' } },
        { publisher: true, company: { name: 'Publisher Co' } }
      ],
      screenshots: [{ image_id: 'screen1' }],
      videos: [{ video_id: 'vid1' }],
      artworks: [{ image_id: 'art1' }],
      platforms: [{ id: 1, name: 'PC' }],
      player_perspectives: [{ id: 1 }],
      game_modes: [{ id: 1 }],
      themes: [{ id: 1 }],
      websites: [{ url: 'http://example.com' }],
      similar_games: [{ id: 2 }],
      release_dates: [{ date: 1609459200 }],
      age_ratings: [{ rating: 3 }],
      storyline: 'Epic story',
      aggregated_rating: 90,
      aggregated_rating_count: 100,
      rating_count: 50
    };
    const spy = vi.spyOn(VideogameRepository, 'getGameById').mockResolvedValueOnce(mockGame);
    const result = await videogameService.getGameById(1);
    
    expect(result).toBeDefined();
    expect(result.developers).toEqual(['Dev Studio']);
    expect(result.publishers).toEqual(['Publisher Co']);
    expect(result.screenshots).toHaveLength(1);
    expect(result.artworks).toHaveLength(1);
    expect(result.storyline).toBe('Epic story');
    expect(result.aggregated_rating).toBe(90);
    spy.mockRestore();
  });

  it('getGameById retorna null si no se encuentra el juego', async () => {
    const spy = vi.spyOn(VideogameRepository, 'getGameById').mockResolvedValueOnce(null);
    const result = await videogameService.getGameById(999);
    expect(result).toBeNull();
    spy.mockRestore();
  });

  it('getGameById maneja juego sin involved_companies', async () => {
    const mockGame = {
      id: 1,
      name: 'Simple Game',
      cover: { image_id: 'simple123' }
    };
    const spy = vi.spyOn(VideogameRepository, 'getGameById').mockResolvedValueOnce(mockGame);
    const result = await videogameService.getGameById(1);
    
    expect(result.developers).toEqual([]);
    expect(result.publishers).toEqual([]);
    expect(result.screenshots).toEqual([]);
    expect(result.artworks).toEqual([]);
    spy.mockRestore();
  });

  it('getSimilarGames llama al repository y formatea resultados', async () => {
    const mockGames = [
      { id: 2, name: 'Similar Game', cover: { image_id: 'sim123' } }
    ];
    const spy = vi.spyOn(VideogameRepository, 'getSimilarGames').mockResolvedValueOnce(mockGames);
    const result = await videogameService.getSimilarGames(1, 1);
    
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(spy).toHaveBeenCalledWith(1, 1);
    spy.mockRestore();
  });

  it('getGamesByGenre llama al repository y formatea resultados', async () => {
    const mockGames = [
      { id: 3, name: 'Genre Game', cover: { image_id: 'genre123' } }
    ];
    const spy = vi.spyOn(VideogameRepository, 'getGamesByGenre').mockResolvedValueOnce(mockGames);
    const result = await videogameService.getGamesByGenre(5, 1);
    
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(spy).toHaveBeenCalledWith(5, 1);
    spy.mockRestore();
  });

  it('getUpcomingGames llama al repository y formatea resultados', async () => {
    const mockGames = [
      { id: 4, name: 'Upcoming Game', cover: { image_id: 'upcoming123' } }
    ];
    const spy = vi.spyOn(VideogameRepository, 'getUpcomingGames').mockResolvedValueOnce(mockGames);
    const result = await videogameService.getUpcomingGames(1);
    
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(spy).toHaveBeenCalledWith(1);
    spy.mockRestore();
  });

  it('getRecentGames llama al repository y formatea resultados', async () => {
    const mockGames = [
      { id: 5, name: 'Recent Game', cover: { image_id: 'recent123' } }
    ];
    const spy = vi.spyOn(VideogameRepository, 'getRecentGames').mockResolvedValueOnce(mockGames);
    const result = await videogameService.getRecentGames(1);
    
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(spy).toHaveBeenCalledWith(1);
    spy.mockRestore();
  });
});
