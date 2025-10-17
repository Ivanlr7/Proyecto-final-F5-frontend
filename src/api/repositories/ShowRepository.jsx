class ShowRepository {
  constructor() {
    this.baseUrl = 'https://api.themoviedb.org/3';
    this.apiKey = import.meta.env.VITE_API_TMDB_KEY;
    
    if (!this.apiKey) {
      console.error('VITE_TMDB_API_KEY no está configurada en las variables de entorno');
    }
  }

  // Método base para hacer peticiones
  async makeRequest(endpoint, params = {}) {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      
      // Agregar API key y parámetros
      url.searchParams.append('api_key', this.apiKey);
      url.searchParams.append('language', 'es-ES');
      
      // Agregar parámetros adicionales
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          url.searchParams.append(key, value);
        }
      });

      console.log('Show API Request:', url.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data,
        message: 'Petición exitosa'
      };

    } catch (error) {
      console.error('Error en ShowRepository.makeRequest:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  // Obtener series populares
  async getPopularShows(page = 1) {
    return await this.makeRequest('/tv/popular', { page });
  }

  // Obtener detalles de una serie
  async getShowDetails(showId) {
    return await this.makeRequest(`/tv/${showId}`, {
      append_to_response: 'credits,videos,recommendations,similar'
    });
  }

  // Buscar series
  async searchShows(query, page = 1) {
    return await this.makeRequest('/search/tv', { 
      query: encodeURIComponent(query),
      page 
    });
  }

  // Obtener series por categoría
  async getShowsByCategory(category, page = 1) {
    const categoryMap = {
      'airing_today': '/tv/airing_today',
      'on_the_air': '/tv/on_the_air',
      'top_rated': '/tv/top_rated',
      'popular': '/tv/popular'
    };

    const endpoint = categoryMap[category];
    
    if (!endpoint) {
      return {
        success: false,
        error: `Categoría de series no válida: ${category}`,
        data: null
      };
    }

    return await this.makeRequest(endpoint, { page });
  }

  // Obtener géneros de series
  async getShowGenres() {
    return await this.makeRequest('/genre/tv/list');
  }

  // Descubrir series con filtros
  async discoverShows(filters = {}, page = 1) {
    const params = { page };

    // Mapear filtros
    if (filters.genres && filters.genres.length > 0) {
      params.with_genres = filters.genres.join(',');
    }

    if (filters.first_air_date_year) {
      params.first_air_date_year = filters.first_air_date_year;
    }

    if (filters.vote_average_gte) {
      params.vote_average_gte = filters.vote_average_gte;
    }

    if (filters.sort_by) {
      params.sort_by = filters.sort_by;
    } else {
      params.sort_by = 'popularity.desc';
    }

    // Filtros adicionales específicos para series
    if (filters.with_networks) {
      params.with_networks = filters.with_networks;
    }

    if (filters.with_origin_country) {
      params.with_origin_country = filters.with_origin_country;
    }

    if (filters.with_original_language) {
      params.with_original_language = filters.with_original_language;
    }

    if (filters.air_date_gte) {
      params.air_date_gte = filters.air_date_gte;
    }

    if (filters.air_date_lte) {
      params.air_date_lte = filters.air_date_lte;
    }

    return await this.makeRequest('/discover/tv', params);
  }

  // Obtener créditos de una serie
  async getShowCredits(showId) {
    return await this.makeRequest(`/tv/${showId}/credits`);
  }

  // Obtener videos/trailers de una serie
  async getShowVideos(showId) {
    return await this.makeRequest(`/tv/${showId}/videos`);
  }

  // Obtener series similares
  async getSimilarShows(showId, page = 1) {
    return await this.makeRequest(`/tv/${showId}/similar`, { page });
  }

  // Obtener recomendaciones de series
  async getShowRecommendations(showId, page = 1) {
    return await this.makeRequest(`/tv/${showId}/recommendations`, { page });
  }

  // Obtener detalles de una temporada
  async getSeasonDetails(showId, seasonNumber) {
    return await this.makeRequest(`/tv/${showId}/season/${seasonNumber}`);
  }

  // Obtener detalles de un episodio
  async getEpisodeDetails(showId, seasonNumber, episodeNumber) {
    return await this.makeRequest(`/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}`);
  }
}

export default ShowRepository;