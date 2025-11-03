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

  it('searchMovies rechaza búsqueda con query muy corto', async () => {
    const result = await movieService.searchMovies('a');
    expect(result.success).toBe(false);
    expect(result.error).toContain('al menos 2 caracteres');
  });

  it('getMovieDetails rechaza ID inválido', async () => {
    const result = await movieService.getMovieDetails(0);
    expect(result.success).toBe(false);
    expect(result.error).toContain('inválido');
  });

  it('getMoviesByCategory obtiene películas por categoría válida', async () => {
    const mockMovies = { results: [{ id: 1, title: 'Top Rated' }] };
    movieService.movieRepository.getMoviesByCategory = vi.fn().mockResolvedValueOnce({ success: true, data: mockMovies });
    const result = await movieService.getMoviesByCategory('top_rated', 1);
    expect(result.success).toBe(true);
  });

  it('getMoviesByCategory rechaza categoría inválida', async () => {
    const result = await movieService.getMoviesByCategory('invalid_category');
    expect(result.success).toBe(false);
    expect(result.error).toContain('inválida');
  });

  it('getMoviesWithFilters obtiene películas con filtros', async () => {
    const mockMovies = { results: [{ id: 1 }] };
    movieService.movieRepository.getMoviesWithFilters = vi.fn().mockResolvedValueOnce({ success: true, data: mockMovies });
    const result = await movieService.getMoviesWithFilters({ genres: [28], year: 2023 });
    expect(result.success).toBe(true);
  });

  it('getMoviesWithFilters rechaza página inválida', async () => {
    const result = await movieService.getMoviesWithFilters({ page: 9999 });
    expect(result.success).toBe(false);
  });

  it('getMovieGenres obtiene lista de géneros', async () => {
    const mockGenres = { genres: [{ id: 28, name: 'Acción' }] };
    movieService.movieRepository.getMovieGenres = vi.fn().mockResolvedValueOnce({ success: true, data: mockGenres });
    const result = await movieService.getMovieGenres();
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('processMovie añade URLs de imágenes', () => {
    const movie = {
      id: 1,
      title: 'Test',
      poster_path: '/test.jpg',
      backdrop_path: '/back.jpg',
      release_date: '2023-01-15',
      vote_average: 7.5
    };
    
    const processed = movieService.processMovie(movie);
    
    expect(processed.poster_url).toContain('w500');
    expect(processed.backdrop_url).toContain('w1280');
    expect(processed.release_year).toBe(2023);
    expect(processed.formatted_vote_average).toBe(7.5);
  });

  it('processMovie maneja película sin datos de imagen', () => {
    const movie = {
      id: 1,
      title: 'Test',
      poster_path: null,
      backdrop_path: null
    };
    
    const processed = movieService.processMovie(movie);
    
    expect(processed.poster_url).toBeNull();
    expect(processed.backdrop_url).toBeNull();
  });

  it('processMovieList procesa array de películas', () => {
    const movies = [
      { id: 1, title: 'Movie 1', poster_path: '/test.jpg' },
      { id: 2, title: 'Movie 2', poster_path: '/test2.jpg' }
    ];
    
    const processed = movieService.processMovieList(movies);
    
    expect(processed).toHaveLength(2);
    expect(processed[0].poster_url).toBeDefined();
  });

  it('processMovieList retorna array vacío para input inválido', () => {
    const processed = movieService.processMovieList(null);
    expect(processed).toEqual([]);
  });

  it('handleMovieServiceError maneja error 401', () => {
    const error = {
      response: {
        status: 401,
        data: {}
      }
    };
    
    const result = movieService.handleMovieServiceError(error);
    expect(result.code).toBe('UNAUTHORIZED');
  });

  it('handleMovieServiceError maneja error 404', () => {
    const error = {
      response: {
        status: 404,
        data: {}
      }
    };
    
    const result = movieService.handleMovieServiceError(error);
    expect(result.code).toBe('NOT_FOUND');
  });

  it('handleMovieServiceError maneja error 429', () => {
    const error = {
      response: {
        status: 429,
        data: {}
      }
    };
    
    const result = movieService.handleMovieServiceError(error);
    expect(result.code).toBe('RATE_LIMIT');
  });

  it('handleMovieServiceError maneja error 500+', () => {
    const error = {
      response: {
        status: 500,
        data: {}
      }
    };
    
    const result = movieService.handleMovieServiceError(error);
    expect(result.code).toBe('SERVER_ERROR');
  });

  it('handleMovieServiceError maneja error de conexión', () => {
    const error = {
      request: {}
    };
    
    const result = movieService.handleMovieServiceError(error);
    expect(result.code).toBe('CONNECTION_ERROR');
  });

  it('handleMovieServiceError maneja error desconocido', () => {
    const error = new Error('Unknown error');
    
    const result = movieService.handleMovieServiceError(error);
    expect(result.code).toBe('UNKNOWN_ERROR');
  });

  it('formatDate formatea fecha correctamente', () => {
    const formatted = movieService.formatDate('2023-12-25');
    expect(formatted).toBeTruthy();
  });

  it('formatDate maneja fecha inválida', () => {
    const formatted = movieService.formatDate('invalid-date');
    expect(formatted).toBe('Invalid Date');
  });
});
