import { describe, it, expect, vi, beforeEach } from 'vitest';
import showService from '../../src/api/services/ShowService';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('ShowService integration', () => {
  describe('getPopularShows', () => {
    it('llama al repository y procesa resultados', async () => {
      const mockShows = { results: [{ id: 1, name: 'Test Show' }], page: 1 };
      showService.showRepository.getPopularShows = vi.fn().mockResolvedValueOnce({ success: true, data: mockShows });
      const result = await showService.getPopularShows(1);
      expect(showService.showRepository.getPopularShows).toHaveBeenCalledWith(1);
      expect(result.success).toBe(true);
      expect(result.data.results).toBeDefined();
    });

    it('lanza error si la página es menor a 1', async () => {
      const result = await showService.getPopularShows(0);
      expect(result.success).toBe(false);
      expect(result.error).toContain('página debe estar entre 1 y 1000');
    });

    it('lanza error si la página es mayor a 1000', async () => {
      const result = await showService.getPopularShows(1001);
      expect(result.success).toBe(false);
      expect(result.error).toContain('página debe estar entre 1 y 1000');
    });

    it('maneja error cuando el repository falla', async () => {
      showService.showRepository.getPopularShows = vi.fn().mockResolvedValueOnce({ success: false });
      const result = await showService.getPopularShows(1);
      expect(result.success).toBe(false);
    });
  });

  describe('getShowDetails', () => {
    it('llama al repository con id correcto', async () => {
      const mockShow = { id: 1, name: 'Test Show' };
      showService.showRepository.getShowDetails = vi.fn().mockResolvedValueOnce({ success: true, data: mockShow });
      const result = await showService.getShowDetails(1);
      expect(showService.showRepository.getShowDetails).toHaveBeenCalledWith(1);
      expect(result.success).toBe(true);
    });

    it('lanza error si el id es inválido (0)', async () => {
      const result = await showService.getShowDetails(0);
      expect(result.success).toBe(false);
      expect(result.error).toContain('ID de serie inválido');
    });

    it('lanza error si el id es negativo', async () => {
      const result = await showService.getShowDetails(-1);
      expect(result.success).toBe(false);
      expect(result.error).toContain('ID de serie inválido');
    });

    it('lanza error si el id es null', async () => {
      const result = await showService.getShowDetails(null);
      expect(result.success).toBe(false);
      expect(result.error).toContain('ID de serie inválido');
    });

    it('maneja error cuando el repository no encuentra la serie', async () => {
      showService.showRepository.getShowDetails = vi.fn().mockResolvedValueOnce({ success: false });
      const result = await showService.getShowDetails(1);
      expect(result.success).toBe(false);
    });
  });

  describe('searchShows', () => {
    it('llama al repository con query correcto', async () => {
      const mockShows = { results: [{ id: 1, name: 'Test Show' }] };
      showService.showRepository.searchShows = vi.fn().mockResolvedValueOnce({ success: true, data: mockShows });
      const result = await showService.searchShows('test', 1);
      expect(showService.showRepository.searchShows).toHaveBeenCalledWith('test', 1);
      expect(result.success).toBe(true);
    });

    it('trimea espacios en blanco del query', async () => {
      const mockShows = { results: [] };
      showService.showRepository.searchShows = vi.fn().mockResolvedValueOnce({ success: true, data: mockShows });
      const result = await showService.searchShows('  test  ', 1);
      expect(showService.showRepository.searchShows).toHaveBeenCalledWith('test', 1);
      expect(result.success).toBe(true);
    });

    it('lanza error si el query es vacío', async () => {
      const result = await showService.searchShows('', 1);
      expect(result.success).toBe(false);
      expect(result.error).toContain('debe tener al menos 2 caracteres');
    });

    it('lanza error si el query tiene menos de 2 caracteres', async () => {
      const result = await showService.searchShows('a', 1);
      expect(result.success).toBe(false);
      expect(result.error).toContain('debe tener al menos 2 caracteres');
    });

    it('lanza error si la página es inválida', async () => {
      const result = await showService.searchShows('test', 1001);
      expect(result.success).toBe(false);
      expect(result.error).toContain('página debe estar entre 1 y 1000');
    });

    it('maneja error cuando el repository falla', async () => {
      showService.showRepository.searchShows = vi.fn().mockResolvedValueOnce({ success: false });
      const result = await showService.searchShows('test', 1);
      expect(result.success).toBe(false);
    });
  });

  describe('getShowsByCategory', () => {
    it('obtiene series por categoría airing_today', async () => {
      const mockShows = { results: [{ id: 1, name: 'Show' }] };
      showService.showRepository.getShowsByCategory = vi.fn().mockResolvedValueOnce({ success: true, data: mockShows });
      const result = await showService.getShowsByCategory('airing_today', 1);
      expect(showService.showRepository.getShowsByCategory).toHaveBeenCalledWith('airing_today', 1);
      expect(result.success).toBe(true);
    });

    it('obtiene series por categoría top_rated', async () => {
      const mockShows = { results: [] };
      showService.showRepository.getShowsByCategory = vi.fn().mockResolvedValueOnce({ success: true, data: mockShows });
      const result = await showService.getShowsByCategory('top_rated', 1);
      expect(result.success).toBe(true);
    });

    it('obtiene series por categoría on_the_air', async () => {
      const mockShows = { results: [] };
      showService.showRepository.getShowsByCategory = vi.fn().mockResolvedValueOnce({ success: true, data: mockShows });
      const result = await showService.getShowsByCategory('on_the_air', 1);
      expect(result.success).toBe(true);
    });

    it('obtiene series por categoría popular', async () => {
      const mockShows = { results: [] };
      showService.showRepository.getShowsByCategory = vi.fn().mockResolvedValueOnce({ success: true, data: mockShows });
      const result = await showService.getShowsByCategory('popular', 1);
      expect(result.success).toBe(true);
    });

    it('lanza error si la categoría es inválida', async () => {
      const result = await showService.getShowsByCategory('invalid_category', 1);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Categoría inválida');
    });

    it('lanza error si la página es inválida', async () => {
      const result = await showService.getShowsByCategory('popular', 0);
      expect(result.success).toBe(false);
      expect(result.error).toContain('página debe estar entre 1 y 1000');
    });

    it('maneja error cuando el repository falla', async () => {
      showService.showRepository.getShowsByCategory = vi.fn().mockResolvedValueOnce({ success: false });
      const result = await showService.getShowsByCategory('popular', 1);
      expect(result.success).toBe(false);
    });
  });

  describe('getShowGenres', () => {
    it('obtiene los géneros correctamente', async () => {
      const mockGenres = { genres: [{ id: 1, name: 'Drama' }] };
      showService.showRepository.getShowGenres = vi.fn().mockResolvedValueOnce({ success: true, data: mockGenres });
      const result = await showService.getShowGenres();
      expect(showService.showRepository.getShowGenres).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockGenres.genres);
    });

    it('maneja error cuando el repository falla', async () => {
      showService.showRepository.getShowGenres = vi.fn().mockResolvedValueOnce({ success: false });
      const result = await showService.getShowGenres();
      expect(result.success).toBe(false);
    });
  });

  describe('discoverShows', () => {
    it('descubre series con filtros', async () => {
      const mockShows = { results: [{ id: 1, name: 'Show' }] };
      const filters = { with_genres: '18' };
      showService.showRepository.discoverShows = vi.fn().mockResolvedValueOnce({ success: true, data: mockShows });
      const result = await showService.discoverShows(filters, 1);
      expect(showService.showRepository.discoverShows).toHaveBeenCalledWith(filters, 1);
      expect(result.success).toBe(true);
    });

    it('descubre series sin filtros', async () => {
      const mockShows = { results: [] };
      showService.showRepository.discoverShows = vi.fn().mockResolvedValueOnce({ success: true, data: mockShows });
      const result = await showService.discoverShows({}, 1);
      expect(result.success).toBe(true);
    });

    it('lanza error si la página es inválida', async () => {
      const result = await showService.discoverShows({}, 1001);
      expect(result.success).toBe(false);
      expect(result.error).toContain('página debe estar entre 1 y 1000');
    });

    it('maneja error cuando el repository falla', async () => {
      showService.showRepository.discoverShows = vi.fn().mockResolvedValueOnce({ success: false });
      const result = await showService.discoverShows({}, 1);
      expect(result.success).toBe(false);
    });
  });

  describe('processShowList', () => {
    it('procesa una lista de series correctamente', () => {
      const shows = [
        { id: 1, name: 'Show 1', vote_average: 8.5 },
        { id: 2, name: 'Show 2', vote_average: 7.2 }
      ];
      const result = showService.processShowList(shows);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('retorna array vacío si no se pasa un array', () => {
      const result = showService.processShowList(null);
      expect(result).toEqual([]);
    });

    it('retorna array vacío para entrada indefinida', () => {
      const result = showService.processShowList(undefined);
      expect(result).toEqual([]);
    });

    it('retorna array vacío para string', () => {
      const result = showService.processShowList('not an array');
      expect(result).toEqual([]);
    });
  });

  describe('processShow', () => {
    it('procesa serie completa con todos los campos', () => {
      const show = {
        id: 1,
        name: 'Breaking Bad',
        original_name: 'Breaking Bad',
        overview: 'Gran serie',
        first_air_date: '2008-01-20',
        last_air_date: '2013-09-29',
        number_of_episodes: 62,
        number_of_seasons: 5,
        status: 'Ended',
        vote_average: 9.5,
        vote_count: 10000,
        popularity: 150.5,
        genre_ids: [18, 80],
        genres: [{ id: 18, name: 'Drama' }],
        poster_path: '/poster.jpg',
        backdrop_path: '/backdrop.jpg',
        origin_country: ['US'],
        original_language: 'en',
        adult: false
      };
      
      const result = showService.processShow(show);
      
      expect(result.id).toBe(1);
      expect(result.name).toBe('Breaking Bad');
      expect(result.first_air_year).toBe(2008);
      expect(result.formatted_vote_average).toBe('9.5');
      expect(result.poster_url).toBe('https://image.tmdb.org/t/p/w500/poster.jpg');
      expect(result.backdrop_url).toBe('https://image.tmdb.org/t/p/w1280/backdrop.jpg');
    });

    it('procesa serie sin poster ni backdrop', () => {
      const show = { id: 1, name: 'Show', poster_path: null, backdrop_path: null };
      const result = showService.processShow(show);
      expect(result.poster_url).toBeNull();
      expect(result.backdrop_url).toBeNull();
    });

    it('procesa serie sin fecha de emisión', () => {
      const show = { id: 1, name: 'Show', first_air_date: null };
      const result = showService.processShow(show);
      expect(result.first_air_year).toBeNull();
    });

    it('procesa serie con fecha de emisión inválida', () => {
      const show = { id: 1, name: 'Show', first_air_date: 'invalid-date' };
      const result = showService.processShow(show);
      expect(result.first_air_year).toBeNull();
    });

    it('procesa serie sin rating', () => {
      const show = { id: 1, name: 'Show', vote_average: null };
      const result = showService.processShow(show);
      expect(result.formatted_vote_average).toBeNull();
    });

    it('procesa serie con rating 0', () => {
      const show = { id: 1, name: 'Show', vote_average: 0 };
      const result = showService.processShow(show);
      expect(result.formatted_vote_average).toBe('0.0');
    });

    it('usa original_name si name no está disponible', () => {
      const show = { id: 1, original_name: 'Original Name' };
      const result = showService.processShow(show);
      expect(result.name).toBe('Original Name');
    });

    it('asigna descripción por defecto si no hay overview', () => {
      const show = { id: 1, name: 'Show', overview: null };
      const result = showService.processShow(show);
      expect(result.overview).toBe('Sin descripción disponible');
    });

    it('asigna arrays vacíos para campos opcionales', () => {
      const show = { id: 1, name: 'Show' };
      const result = showService.processShow(show);
      expect(result.genre_ids).toEqual([]);
      expect(result.genres).toEqual([]);
      expect(result.origin_country).toEqual([]);
      expect(result.created_by).toEqual([]);
      expect(result.episode_run_time).toEqual([]);
    });

    it('retorna null si la entrada es null', () => {
      const result = showService.processShow(null);
      expect(result).toBeNull();
    });

    it('retorna null si la entrada no es un objeto', () => {
      const result = showService.processShow('not an object');
      expect(result).toBeNull();
    });

    it('procesa campos adicionales de detalles', () => {
      const show = {
        id: 1,
        name: 'Show',
        created_by: [{ id: 1, name: 'Creator' }],
        networks: [{ id: 1, name: 'AMC' }],
        production_companies: [{ id: 1, name: 'Company' }],
        seasons: [{ season_number: 1 }],
        tagline: 'Great show',
        type: 'Scripted'
      };
      
      const result = showService.processShow(show);
      expect(result.created_by).toHaveLength(1);
      expect(result.networks).toHaveLength(1);
      expect(result.production_companies).toHaveLength(1);
      expect(result.seasons).toHaveLength(1);
      expect(result.tagline).toBe('Great show');
      expect(result.type).toBe('Scripted');
    });
  });

  describe('handleShowServiceError', () => {
    it('retorna estructura de error correcta', () => {
      const error = new Error('Test error');
      const result = showService.handleShowServiceError(error);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Test error');
      expect(result.message).toBe('Test error');
      expect(result.data).toBeNull();
    });

    it('maneja error sin mensaje', () => {
      const error = {};
      const result = showService.handleShowServiceError(error);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Error desconocido');
    });
  });
});
