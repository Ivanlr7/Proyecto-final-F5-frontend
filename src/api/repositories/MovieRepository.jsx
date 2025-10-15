import axios from 'axios';

class MovieRepository {
  constructor() {
    this.baseURL = 'https://api.themoviedb.org/3';
    this.apiKey = import.meta.env.VITE_API_TMDB_KEY;
    
    // Crear instancia de axios con configuración base
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  // Obtener películas populares
  async getPopularMovies(page = 1) {
    try {
      const response = await this.client.get('/movie/popular', {
        params: {
          api_key: this.apiKey,
          language: 'es-ES',
          page: page
        }
      });

      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error('Error en MovieRepository.getPopularMovies:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 500
      };
    }
  }

  // Obtener detalles de una película específica
  async getMovieDetails(movieId) {
    try {
      const response = await this.client.get(`/movie/${movieId}`, {
        params: {
          api_key: this.apiKey,
          language: 'es-ES'
        }
      });

      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error('Error en MovieRepository.getMovieDetails:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 500
      };
    }
  }

  // Buscar películas
  async searchMovies(query, page = 1) {
    try {
      const response = await this.client.get('/search/movie', {
        params: {
          api_key: this.apiKey,
          language: 'es-ES',
          query: query,
          page: page
        }
      });

      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error('Error en MovieRepository.searchMovies:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 500
      };
    }
  }

  // Obtener películas por categoría (now_playing, top_rated, upcoming)
  async getMoviesByCategory(category, page = 1) {
    try {
      const response = await this.client.get(`/movie/${category}`, {
        params: {
          api_key: this.apiKey,
          language: 'es-ES',
          page: page
        }
      });

      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error('Error en MovieRepository.getMoviesByCategory:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 500
      };
    }
  }

  // Obtener películas con filtros avanzados usando /discover/movie
  async getMoviesWithFilters(filters = {}) {
    try {
      const params = {
        api_key: this.apiKey,
        language: 'es-ES',
        page: filters.page || 1,
        sort_by: filters.sortBy || 'popularity.desc'
      };

      // Añadir filtros opcionales
      if (filters.genres && filters.genres.length > 0) {
        params.with_genres = filters.genres.join(',');
      }
      
      if (filters.year) {
        params.primary_release_year = filters.year;
      }
      
      if (filters.minRating) {
        params['vote_average.gte'] = filters.minRating;
        params['vote_count.gte'] = filters.minVotes || 100; // Mínimo de votos para ser confiable
      }

      const response = await this.client.get('/discover/movie', { params });

      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error('Error en MovieRepository.getMoviesWithFilters:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 500
      };
    }
  }

  // Obtener géneros de películas
  async getMovieGenres() {
    try {
      const response = await this.client.get('/genre/movie/list', {
        params: {
          api_key: this.apiKey,
          language: 'es-ES'
        }
      });

      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error('Error en MovieRepository.getMovieGenres:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 500
      };
    }
  }

  // Helper para construir URL de imagen
  getImageUrl(path, size = 'w500') {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}

export default MovieRepository;