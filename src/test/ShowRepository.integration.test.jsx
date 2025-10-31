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
});
