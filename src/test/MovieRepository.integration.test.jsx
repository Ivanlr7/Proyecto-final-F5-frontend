import { describe, it, expect, vi, beforeEach } from 'vitest';
import MovieRepository from '../../src/api/repositories/MovieRepository';
import axios from 'axios';

vi.mock('axios');

describe('MovieRepository integration', () => {
  let movieRepository;
  let mockAxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockAxiosInstance = {
      get: vi.fn()
    };

    axios.create.mockReturnValue(mockAxiosInstance);
    movieRepository = new MovieRepository();
  });

  it('getPopularMovies obtiene películas populares', async () => {
    const mockResponse = {
      status: 200,
      data: {
        results: [
          { id: 1, title: 'Test Movie', vote_average: 8.5 }
        ]
      }
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await movieRepository.getPopularMovies(1);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/movie/popular', {
      params: {
        api_key: expect.any(String),
        language: 'es-ES',
        page: 1
      }
    });
    expect(result).toEqual({
      success: true,
      data: mockResponse.data,
      status: 200
    });
  });

  it('getMovieDetails obtiene detalles de una película', async () => {
    const movieId = 123;
    const mockResponse = {
      status: 200,
      data: {
        id: movieId,
        title: 'Test Movie',
        overview: 'Test overview'
      }
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await movieRepository.getMovieDetails(movieId);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/movie/${movieId}`, {
      params: {
        api_key: expect.any(String),
        language: 'es-ES',
        append_to_response: 'credits'
      }
    });
    expect(result).toEqual({
      success: true,
      data: mockResponse.data,
      status: 200
    });
  });

  it('maneja errores al obtener películas populares', async () => {
    const mockError = {
      response: {
        status: 401,
        data: { message: 'Invalid API key' }
      }
    };

    mockAxiosInstance.get.mockRejectedValueOnce(mockError);

    const result = await movieRepository.getPopularMovies();

    expect(result).toEqual({
      success: false,
      error: mockError.response.data,
      status: 401
    });
  });

  it('searchMovies busca películas por query', async () => {
    const mockResponse = {
      status: 200,
      data: {
        results: [
          { id: 1, title: 'Test Movie' }
        ]
      }
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await movieRepository.searchMovies('test movie', 1);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search/movie', {
      params: {
        api_key: expect.any(String),
        language: 'es-ES',
        query: 'test movie',
        page: 1
      }
    });
    expect(result.success).toBe(true);
  });

  it('getMoviesByCategory obtiene películas por categoría', async () => {
    const mockResponse = {
      status: 200,
      data: {
        results: [{ id: 1, title: 'Top Rated Movie' }]
      }
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await movieRepository.getMoviesByCategory('top_rated', 1);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/movie/top_rated', {
      params: {
        api_key: expect.any(String),
        language: 'es-ES',
        page: 1
      }
    });
    expect(result.success).toBe(true);
  });

  it('getMoviesWithFilters obtiene películas con filtros básicos', async () => {
    const mockResponse = {
      status: 200,
      data: { results: [] }
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await movieRepository.getMoviesWithFilters({
      page: 1,
      sortBy: 'popularity.desc'
    });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/discover/movie', {
      params: {
        api_key: expect.any(String),
        language: 'es-ES',
        page: 1,
        sort_by: 'popularity.desc'
      }
    });
    expect(result.success).toBe(true);
  });

  it('getMoviesWithFilters obtiene películas con filtros avanzados', async () => {
    const mockResponse = {
      status: 200,
      data: { results: [] }
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await movieRepository.getMoviesWithFilters({
      genres: [28, 12],
      year: 2023,
      minRating: 7.5,
      minVotes: 200
    });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/discover/movie', {
      params: expect.objectContaining({
        with_genres: '28,12',
        primary_release_year: 2023,
        'vote_average.gte': 7.5,
        'vote_count.gte': 200
      })
    });
    expect(result.success).toBe(true);
  });

  it('getMovieGenres obtiene lista de géneros', async () => {
    const mockResponse = {
      status: 200,
      data: {
        genres: [
          { id: 28, name: 'Acción' },
          { id: 12, name: 'Aventura' }
        ]
      }
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await movieRepository.getMovieGenres();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/genre/movie/list', {
      params: {
        api_key: expect.any(String),
        language: 'es-ES'
      }
    });
    expect(result.success).toBe(true);
  });

  it('getImageUrl retorna URL de imagen correcta', () => {
    const path = '/test-image.jpg';
    const url = movieRepository.getImageUrl(path, 'w500');
    
    expect(url).toBe('https://image.tmdb.org/t/p/w500/test-image.jpg');
  });

  it('getImageUrl retorna null si no hay path', () => {
    const url = movieRepository.getImageUrl(null);
    
    expect(url).toBeNull();
  });

  it('getSimilarMovies obtiene películas similares', async () => {
    const mockResponse = {
      status: 200,
      data: {
        results: [{ id: 2, title: 'Similar Movie' }]
      }
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await movieRepository.getSimilarMovies(123, 1);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/movie/123/similar', {
      params: {
        api_key: expect.any(String),
        language: 'es-ES',
        page: 1
      }
    });
    expect(result.success).toBe(true);
  });

  it('getMovieRecommendations obtiene recomendaciones', async () => {
    const mockResponse = {
      status: 200,
      data: {
        results: [{ id: 3, title: 'Recommended Movie' }]
      }
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await movieRepository.getMovieRecommendations(123, 1);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/movie/123/recommendations', {
      params: {
        api_key: expect.any(String),
        language: 'es-ES',
        page: 1
      }
    });
    expect(result.success).toBe(true);
  });

  it('maneja errores en searchMovies', async () => {
    const mockError = {
      response: {
        status: 500,
        data: { message: 'Server error' }
      }
    };

    mockAxiosInstance.get.mockRejectedValueOnce(mockError);

    const result = await movieRepository.searchMovies('test');

    expect(result.success).toBe(false);
    expect(result.status).toBe(500);
  });

  it('maneja errores sin response en getMoviesWithFilters', async () => {
    const mockError = new Error('Network error');

    mockAxiosInstance.get.mockRejectedValueOnce(mockError);

    const result = await movieRepository.getMoviesWithFilters({});

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
    expect(result.status).toBe(500);
  });
});
