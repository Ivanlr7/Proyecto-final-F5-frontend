import MovieRepository from "../repositories/MovieRepository";

class MovieService {
  constructor() {
    this.movieRepository = new MovieRepository();
  }


  async getPopularMovies(page = 1) {
    try {
      // Validar página
      if (page < 1 || page > 1000) {
        throw new Error('La página debe estar entre 1 y 1000');
      }

      const result = await this.movieRepository.getPopularMovies(page);
      
      if (result.success && result.data) {

        const processedMovies = this.processMovieList(result.data.results);
        
        return {
          success: true,
          message: 'Películas populares obtenidas exitosamente',
          data: {
            ...result.data,
            results: processedMovies
          }
        };
      } else {
        throw new Error('Respuesta inválida de la API de TMDB');
      }

    } catch (error) {
      console.error('Error en MovieService.getPopularMovies:', error);
      return this.handleMovieServiceError(error);
    }
  }


  async getMovieDetails(movieId) {
    try {

      if (!movieId || movieId <= 0) {
        throw new Error('ID de película inválido');
      }

      const result = await this.movieRepository.getMovieDetails(movieId);
      
      if (result.success && result.data) {

        const processedMovie = this.processMovie(result.data);
        
        return {
          success: true,
          message: 'Detalles de película obtenidos exitosamente',
          data: processedMovie
        };
      } else {
        throw new Error('Película no encontrada');
      }

    } catch (error) {
      console.error('Error en MovieService.getMovieDetails:', error);
      return this.handleMovieServiceError(error);
    }
  }


  async searchMovies(query, page = 1) {
    try {

      if (!query || query.trim().length < 2) {
        throw new Error('La búsqueda debe tener al menos 2 caracteres');
      }


      if (page < 1 || page > 1000) {
        throw new Error('La página debe estar entre 1 y 1000');
      }

      const result = await this.movieRepository.searchMovies(query.trim(), page);
      
      if (result.success && result.data) {
        const processedMovies = this.processMovieList(result.data.results);
        
        return {
          success: true,
          message: `Búsqueda de "${query}" realizada exitosamente`,
          data: {
            ...result.data,
            results: processedMovies
          }
        };
      } else {
        throw new Error('Error en la búsqueda de películas');
      }

    } catch (error) {
      console.error('Error en MovieService.searchMovies:', error);
      return this.handleMovieServiceError(error);
    }
  }


  async getMoviesByCategory(category, page = 1) {
    try {
      const validCategories = ['now_playing', 'top_rated', 'upcoming', 'popular'];
      
      if (!validCategories.includes(category)) {
        throw new Error(`Categoría inválida. Categorías válidas: ${validCategories.join(', ')}`);
      }

      if (page < 1 || page > 1000) {
        throw new Error('La página debe estar entre 1 y 1000');
      }

      const result = await this.movieRepository.getMoviesByCategory(category, page);
      
      if (result.success && result.data) {
        const processedMovies = this.processMovieList(result.data.results);
        
        return {
          success: true,
          message: `Películas de categoría "${category}" obtenidas exitosamente`,
          data: {
            ...result.data,
            results: processedMovies
          }
        };
      } else {
        throw new Error('Error al obtener películas por categoría');
      }

    } catch (error) {
      console.error('Error en MovieService.getMoviesByCategory:', error);
      return this.handleMovieServiceError(error);
    }
  }


  async getMoviesWithFilters(filters = {}) {
    try {
  
      if (filters.page && (filters.page < 1 || filters.page > 1000)) {
        throw new Error('La página debe estar entre 1 y 1000');
      }

      const result = await this.movieRepository.getMoviesWithFilters(filters);
      
      if (result.success && result.data) {
        const processedMovies = this.processMovieList(result.data.results);
        
        return {
          success: true,
          message: 'Películas filtradas obtenidas exitosamente',
          data: {
            ...result.data,
            results: processedMovies
          }
        };
      } else {
        throw new Error('Error al obtener películas filtradas');
      }

    } catch (error) {
      console.error('Error en MovieService.getMoviesWithFilters:', error);
      return this.handleMovieServiceError(error);
    }
  }


  async getMovieGenres() {
    try {
      const result = await this.movieRepository.getMovieGenres();
      
      if (result.success && result.data) {
        return {
          success: true,
          message: 'Géneros obtenidos exitosamente',
          data: result.data.genres
        };
      } else {
        throw new Error('Error al obtener géneros');
      }

    } catch (error) {
      console.error('Error en MovieService.getMovieGenres:', error);
      return this.handleMovieServiceError(error);
    }
  }


  processMovieList(movies) {
    if (!Array.isArray(movies)) return [];
    
    return movies.map(movie => this.processMovie(movie));
  }


  processMovie(movie) {
    if (!movie) return null;

    return {
      ...movie,

      poster_url: this.movieRepository.getImageUrl(movie.poster_path, 'w500'),
      backdrop_url: this.movieRepository.getImageUrl(movie.backdrop_path, 'w1280'),
      poster_small: this.movieRepository.getImageUrl(movie.poster_path, 'w342'),
      poster_large: this.movieRepository.getImageUrl(movie.poster_path, 'w780'),

      formatted_release_date: movie.release_date ? this.formatDate(movie.release_date) : null,

      release_year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,

      formatted_vote_average: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 0
    };
  }


  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }


  handleMovieServiceError(error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.status_message || error.response.data;
      
      if (status === 401) {
        return {
          success: false,
          error: 'API key inválida o no autorizada',
          code: 'UNAUTHORIZED'
        };
      } else if (status === 404) {
        return {
          success: false,
          error: 'Recurso no encontrado',
          code: 'NOT_FOUND'
        };
      } else if (status === 429) {
        return {
          success: false,
          error: 'Límite de solicitudes excedido. Intenta más tarde',
          code: 'RATE_LIMIT'
        };
      } else if (status >= 500) {
        return {
          success: false,
          error: 'Error interno del servidor de TMDB',
          code: 'SERVER_ERROR'
        };
      } else {
        return {
          success: false,
          error: typeof message === 'string' ? message : 'Error al obtener datos de películas',
          code: 'API_ERROR'
        };
      }
    } else if (error.request) {
      return {
        success: false,
        error: 'Error de conexión con la API de TMDB',
        code: 'CONNECTION_ERROR'
      };
    } else {
      return {
        success: false,
        error: error.message || 'Error desconocido',
        code: 'UNKNOWN_ERROR'
      };
    }
  }
}


const movieService = new MovieService();
export default movieService;