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
});
