import { describe, it, expect, vi, beforeEach } from 'vitest';
import ShowRepository from '../../src/api/repositories/ShowRepository';

describe('ShowRepository integration', () => {
  let showRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
    showRepository = new ShowRepository();
  });

  it('getPopularShows obtiene series populares', async () => {
    const mockResponse = {
      results: [
        { id: 1, name: 'Test Show', vote_average: 8.5 }
      ]
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await showRepository.getPopularShows(1);

    expect(globalThis.fetch).toHaveBeenCalled();
    const callArgs = globalThis.fetch.mock.calls[0][0];
    expect(callArgs).toContain('/tv/popular');
    expect(callArgs).toContain('page=1');
    expect(result).toEqual({
      success: true,
      data: mockResponse,
      message: 'Petición exitosa'
    });
  });

  it('getShowDetails obtiene detalles de una serie', async () => {
    const showId = 123;
    const mockResponse = {
      id: showId,
      name: 'Test Show',
      overview: 'Test overview'
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await showRepository.getShowDetails(showId);

    expect(globalThis.fetch).toHaveBeenCalled();
    const callArgs = globalThis.fetch.mock.calls[0][0];
    expect(callArgs).toContain(`/tv/${showId}`);
    expect(result).toEqual({
      success: true,
      data: mockResponse,
      message: 'Petición exitosa'
    });
  });

  it('searchShows busca series por query', async () => {
    const query = 'test show';
    const mockResponse = {
      results: [
        { id: 1, name: 'Test Show' }
      ]
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await showRepository.searchShows(query, 1);

    expect(globalThis.fetch).toHaveBeenCalled();
    const callArgs = globalThis.fetch.mock.calls[0][0];
    expect(callArgs).toContain('/search/tv');
    expect(callArgs).toContain('query=test');
    expect(result).toEqual({
      success: true,
      data: mockResponse,
      message: 'Petición exitosa'
    });
  });

  it('maneja errores al obtener series populares', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    });

    const result = await showRepository.getPopularShows();

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining('HTTP Error'),
      data: null
    });
  });

  it('getShowsByCategory obtiene series por categoría airing_today', async () => {
    const mockResponse = { results: [] };
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await showRepository.getShowsByCategory('airing_today', 1);
    
    expect(result.success).toBe(true);
    expect(globalThis.fetch.mock.calls[0][0]).toContain('/tv/airing_today');
  });

  it('getShowsByCategory obtiene series por categoría on_the_air', async () => {
    const mockResponse = { results: [] };
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await showRepository.getShowsByCategory('on_the_air', 1);
    
    expect(result.success).toBe(true);
  });

  it('getShowsByCategory obtiene series por categoría top_rated', async () => {
    const mockResponse = { results: [] };
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await showRepository.getShowsByCategory('top_rated', 1);
    
    expect(result.success).toBe(true);
  });

  it('getShowsByCategory retorna error para categoría inválida', async () => {
    const result = await showRepository.getShowsByCategory('invalid', 1);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('no válida');
  });

  it('getShowGenres obtiene lista de géneros', async () => {
    const mockResponse = { genres: [{ id: 1, name: 'Drama' }] };
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await showRepository.getShowGenres();
    
    expect(result.success).toBe(true);
    expect(result.data.genres).toBeDefined();
  });

  it('discoverShows descubre series con filtros completos', async () => {
    const mockResponse = { results: [] };
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const filters = {
      genres: [18, 80],
      first_air_date_year: 2020,
      vote_average_gte: 7.5,
      with_networks: '213',
      with_origin_country: 'US',
      with_original_language: 'en',
      air_date_gte: '2020-01-01',
      air_date_lte: '2020-12-31',
      sort_by: 'vote_average.desc'
    };
    const result = await showRepository.discoverShows(filters, 1);
    
    expect(result.success).toBe(true);
  });

  it('discoverShows usa sort_by por defecto', async () => {
    const mockResponse = { results: [] };
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await showRepository.discoverShows({}, 1);
    const callUrl = globalThis.fetch.mock.calls[0][0];
    
    expect(result.success).toBe(true);
    expect(callUrl).toContain('sort_by=popularity.desc');
  });

  it('getShowCredits obtiene créditos de una serie', async () => {
    const mockResponse = { cast: [], crew: [] };
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await showRepository.getShowCredits(123);
    
    expect(result.success).toBe(true);
    expect(globalThis.fetch.mock.calls[0][0]).toContain('/tv/123/credits');
  });

  it('getShowVideos obtiene videos de una serie', async () => {
    const mockResponse = { results: [] };
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await showRepository.getShowVideos(123);
    
    expect(result.success).toBe(true);
    expect(globalThis.fetch.mock.calls[0][0]).toContain('/tv/123/videos');
  });

  it('getSimilarShows obtiene series similares', async () => {
    const mockResponse = { results: [] };
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await showRepository.getSimilarShows(123, 1);
    
    expect(result.success).toBe(true);
    expect(globalThis.fetch.mock.calls[0][0]).toContain('/tv/123/similar');
  });

  it('getShowRecommendations obtiene recomendaciones', async () => {
    const mockResponse = { results: [] };
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await showRepository.getShowRecommendations(123, 1);
    
    expect(result.success).toBe(true);
    expect(globalThis.fetch.mock.calls[0][0]).toContain('/tv/123/recommendations');
  });

  it('getSeasonDetails obtiene detalles de una temporada', async () => {
    const mockResponse = { season_number: 1, episodes: [] };
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await showRepository.getSeasonDetails(123, 1);
    
    expect(result.success).toBe(true);
    expect(globalThis.fetch.mock.calls[0][0]).toContain('/tv/123/season/1');
  });

  it('getEpisodeDetails obtiene detalles de un episodio', async () => {
    const mockResponse = { episode_number: 1, name: 'Pilot' };
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await showRepository.getEpisodeDetails(123, 1, 1);
    
    expect(result.success).toBe(true);
    expect(globalThis.fetch.mock.calls[0][0]).toContain('/tv/123/season/1/episode/1');
  });

  it('makeRequest maneja error de red', async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await showRepository.getPopularShows(1);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Network error');
  });

  it('makeRequest omite parámetros null, undefined o vacíos', async () => {
    const mockResponse = { results: [] };
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const filters = {
      genres: [18],
      first_air_date_year: null,
      vote_average_gte: undefined,
      sort_by: ''
    };
    const result = await showRepository.discoverShows(filters, 1);
    
    const callUrl = globalThis.fetch.mock.calls[0][0];
    expect(result.success).toBe(true);
    expect(callUrl).toContain('with_genres=18');
    expect(callUrl).not.toContain('first_air_date_year');
  });
});
