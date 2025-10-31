import { describe, it, expect, vi, beforeEach } from 'vitest';
import movieService from '../../src/api/services/MovieService';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('MovieService integration', () => {
  it('getPopularMovies llama al repository y procesa resultados', async () => {
    const mockMovies = { results: [{ id: 1, title: 'Test Movie' }], page: 1 };
    movieService.movieRepository.getPopularMovies = vi.fn().mockResolvedValueOnce({ success: true, data: mockMovies });
    const result = await movieService.getPopularMovies(1);
    expect(movieService.movieRepository.getPopularMovies).toHaveBeenCalledWith(1);
    expect(result.success).toBe(true);
    expect(result.data.results).toBeDefined();
  });

  it('getPopularMovies lanza error si la página es inválida', async () => {
    const result = await movieService.getPopularMovies(1001);
    expect(result.success).toBe(false);
  });

  it('getMovieDetails llama al repository con id correcto', async () => {
    const mockMovie = { id: 1, title: 'Test Movie' };
    movieService.movieRepository.getMovieDetails = vi.fn().mockResolvedValueOnce({ success: true, data: mockMovie });
    const result = await movieService.getMovieDetails(1);
    expect(movieService.movieRepository.getMovieDetails).toHaveBeenCalledWith(1);
    expect(result.success).toBe(true);
  });

  it('searchMovies llama al repository con query correcto', async () => {
    const mockMovies = { results: [{ id: 1, title: 'Test Movie' }] };
    movieService.movieRepository.searchMovies = vi.fn().mockResolvedValueOnce({ success: true, data: mockMovies });
    const result = await movieService.searchMovies('test', 1);
    expect(movieService.movieRepository.searchMovies).toHaveBeenCalledWith('test', 1);
    expect(result.success).toBe(true);
  });
});
