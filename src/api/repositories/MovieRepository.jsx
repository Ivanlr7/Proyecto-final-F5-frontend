import axios from 'axios';

class MovieRepository {
  constructor() {
    this.baseURL = 'https://api.themoviedb.org/3';
    this.apiKey = import.meta.env.VITE_API_TMDB_KEY;

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }


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

  async getMovieDetails(movieId) {
    try {
      const response = await this.client.get(`/movie/${movieId}`, {
        params: {
          api_key: this.apiKey,
          language: 'es-ES',
          append_to_response: 'credits'
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

  // Categoría general
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

  // Filtros avanzados 
  async getMoviesWithFilters(filters = {}) {
    try {
      const params = {
        api_key: this.apiKey,
        language: 'es-ES',
        page: filters.page || 1,
        sort_by: filters.sortBy || 'popularity.desc'
      };


      if (filters.genres && filters.genres.length > 0) {
        params.with_genres = filters.genres.join(',');
      }
      
      if (filters.year) {
        params.primary_release_year = filters.year;
      }
      
      if (filters.minRating) {
        params['vote_average.gte'] = filters.minRating;
        params['vote_count.gte'] = filters.minVotes || 100; 
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


  getImageUrl(path, size = 'w500') {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  // Obtener películas similares
  async getSimilarMovies(movieId, page = 1) {
    try {
      const response = await this.client.get(`/movie/${movieId}/similar`, {
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
      console.error('Error en MovieRepository.getSimilarMovies:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 500
      };
    }
  }

  // Obtener recomendaciones de películas
  async getMovieRecommendations(movieId, page = 1) {
    try {
      const response = await this.client.get(`/movie/${movieId}/recommendations`, {
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
      console.error('Error en MovieRepository.getMovieRecommendations:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 500
      };
    }
  }
}

export default MovieRepository;