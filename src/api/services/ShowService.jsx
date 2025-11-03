import ShowRepository from "../repositories/ShowRepository";

class ShowService {
  constructor() {
    this.showRepository = new ShowRepository();
  }

  async getPopularShows(page = 1) {
    try {
      // Validar página
      if (page < 1 || page > 1000) {
        throw new Error('La página debe estar entre 1 y 1000');
      }

      const result = await this.showRepository.getPopularShows(page);
      
      if (result.success && result.data) {
        const processedShows = this.processShowList(result.data.results);
        
        return {
          success: true,
          message: 'Series populares obtenidas exitosamente',
          data: {
            ...result.data,
            results: processedShows
          }
        };
      } else {
        throw new Error('Respuesta inválida de la API de TMDB');
      }

    } catch (error) {
      console.error('Error en ShowService.getPopularShows:', error);
      return this.handleShowServiceError(error);
    }
  }

  async getShowDetails(showId) {
    try {
      if (!showId || showId <= 0) {
        throw new Error('ID de serie inválido');
      }

      const result = await this.showRepository.getShowDetails(showId);
      
      if (result.success && result.data) {
        const processedShow = this.processShow(result.data);
        
        return {
          success: true,
          message: 'Detalles de serie obtenidos exitosamente',
          data: processedShow
        };
      } else {
        throw new Error('Serie no encontrada');
      }

    } catch (error) {
      console.error('Error en ShowService.getShowDetails:', error);
      return this.handleShowServiceError(error);
    }
  }

  async searchShows(query, page = 1) {
    try {
      if (!query || query.trim().length < 2) {
        throw new Error('La búsqueda debe tener al menos 2 caracteres');
      }

      if (page < 1 || page > 1000) {
        throw new Error('La página debe estar entre 1 y 1000');
      }

      const result = await this.showRepository.searchShows(query.trim(), page);
      
      if (result.success && result.data) {
        const processedShows = this.processShowList(result.data.results);
        
        return {
          success: true,
          message: `Búsqueda de "${query}" realizada exitosamente`,
          data: {
            ...result.data,
            results: processedShows
          }
        };
      } else {
        throw new Error('Error en la búsqueda de series');
      }

    } catch (error) {
      console.error('Error en ShowService.searchShows:', error);
      return this.handleShowServiceError(error);
    }
  }

  async getShowsByCategory(category, page = 1) {
    try {
      const validCategories = ['airing_today', 'top_rated', 'on_the_air', 'popular'];
      
      if (!validCategories.includes(category)) {
        throw new Error(`Categoría inválida. Categorías válidas: ${validCategories.join(', ')}`);
      }

      if (page < 1 || page > 1000) {
        throw new Error('La página debe estar entre 1 y 1000');
      }

      const result = await this.showRepository.getShowsByCategory(category, page);
      
      if (result.success && result.data) {
        const processedShows = this.processShowList(result.data.results);
        
        return {
          success: true,
          message: `Series de categoría "${category}" obtenidas exitosamente`,
          data: {
            ...result.data,
            results: processedShows
          }
        };
      } else {
        throw new Error(`Error al obtener series de categoría ${category}`);
      }

    } catch (error) {
      console.error('Error en ShowService.getShowsByCategory:', error);
      return this.handleShowServiceError(error);
    }
  }

  async getShowGenres() {
    try {
      const result = await this.showRepository.getShowGenres();
      
      if (result.success && result.data) {
        return {
          success: true,
          message: 'Géneros de series obtenidos exitosamente',
          data: result.data.genres
        };
      } else {
        throw new Error('Error al obtener géneros de series');
      }

    } catch (error) {
      console.error('Error en ShowService.getShowGenres:', error);
      return this.handleShowServiceError(error);
    }
  }

  async discoverShows(filters = {}, page = 1) {
    try {
      if (page < 1 || page > 1000) {
        throw new Error('La página debe estar entre 1 y 1000');
      }

      const result = await this.showRepository.discoverShows(filters, page);
      
      if (result.success && result.data) {
        const processedShows = this.processShowList(result.data.results);
        
        return {
          success: true,
          message: 'Descubrimiento de series realizado exitosamente',
          data: {
            ...result.data,
            results: processedShows
          }
        };
      } else {
        throw new Error('Error en el descubrimiento de series');
      }

    } catch (error) {
      console.error('Error en ShowService.discoverShows:', error);
      return this.handleShowServiceError(error);
    }
  }

  // Procesar una lista de series
  processShowList(shows) {
    if (!Array.isArray(shows)) {
      return [];
    }

    return shows.map(show => this.processShow(show));
  }

  // Procesar una serie individual
  processShow(show) {
    if (!show || typeof show !== 'object') {
      return null;
    }

    // Formatear fecha de primera emisión
    let firstAirYear = null;
    if (show.first_air_date) {
      try {
        const year = new Date(show.first_air_date).getFullYear();
        // Validar que el año no es NaN
        if (!isNaN(year)) {
          firstAirYear = year;
        }
      } catch {
        console.warn('Error parseando fecha de primera emisión:', show.first_air_date);
      }
    }

    // Formatear rating a escala de 10
    let formattedVoteAverage = null;
    if (show.vote_average !== null && show.vote_average !== undefined) {
      formattedVoteAverage = parseFloat(show.vote_average).toFixed(1);
    }

    return {
      id: show.id,
      name: show.name || show.original_name,
      original_name: show.original_name,
      overview: show.overview || 'Sin descripción disponible',
      first_air_date: show.first_air_date,
      first_air_year: firstAirYear,
      last_air_date: show.last_air_date,
      number_of_episodes: show.number_of_episodes,
      number_of_seasons: show.number_of_seasons,
      status: show.status,
      vote_average: show.vote_average,
      vote_count: show.vote_count,
      formatted_vote_average: formattedVoteAverage,
      popularity: show.popularity,
      genre_ids: show.genre_ids || [],
      genres: show.genres || [],
      poster_path: show.poster_path,
      backdrop_path: show.backdrop_path,
      poster_url: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : null,
      backdrop_url: show.backdrop_path ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}` : null,
      origin_country: show.origin_country || [],
      original_language: show.original_language,
      adult: show.adult || false,
      // Campos adicionales para detalles
      created_by: show.created_by || [],
      episode_run_time: show.episode_run_time || [],
      homepage: show.homepage,
      in_production: show.in_production,
      languages: show.languages || [],
      networks: show.networks || [],
      production_companies: show.production_companies || [],
      production_countries: show.production_countries || [],
      seasons: show.seasons || [],
      spoken_languages: show.spoken_languages || [],
      tagline: show.tagline,
      type: show.type
    };
  }

  // Manejo de errores
  handleShowServiceError(error) {
    const errorMessage = error.message || 'Error desconocido en el servicio de series';
    
    return {
      success: false,
      error: errorMessage,
      message: errorMessage,
      data: null
    };
  }
}

// Crear instancia singleton
const showService = new ShowService();
export default showService;