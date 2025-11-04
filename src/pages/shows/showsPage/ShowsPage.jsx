import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import showService from '../../../api/services/ShowService';
import SearchBar from '../../../components/SearchBar/SearchBar';
import MediaCard from '../../../components/MediaCard/MediaCard';
import Pagination from '../../../components/common/Pagination';
import AdvancedFilterToggle from '../../../components/common/AdvancedFilterToggle';
import CategoryButton from '../../../components/common/CategoryButton';
import Spinner from '../../../components/common/Spinner';
import './ShowsPage.css';

export default function ShowsPage() {
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState('popular');
  
  // Estados para filtros
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [minRating, setMinRating] = useState('');
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [useFilters, setUseFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showGenresDropdown, setShowGenresDropdown] = useState(false);
  const [showProvidersDropdown, setShowProvidersDropdown] = useState(false);

  // Plataformas de streaming más populares en España
  const streamingProviders = [
    { id: 8, name: 'Netflix', logoPath: '/9A1JSVmSxsyaBK4SUFsYVqbAYfW.jpg' },
    { id: 119, name: 'Amazon Prime Video', logoPath: '/emthp39XA2YScoYL1p0sdbAH2WA.jpg' },
    { id: 337, name: 'Disney Plus', logoPath: '/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg' },
    { id: 384, name: 'HBO Max', logoPath: '/Ajqyt5aNxNGjmF9uOfxArGrdf3X.jpg' },
    { id: 350, name: 'Apple TV Plus', logoPath: '/6uhKBfmtzFqOcLousHwZuzcrScK.jpg' },
    { id: 531, name: 'Paramount Plus', logoPath: '/xbhHHa1YgtpwhC8lb1NQ3ACVcLd.jpg' },
    { id: 1899, name: 'Max', logoPath: '/zxrVdFjIjLqkfnwyghnfywTn3Lh.jpg' },
    { id: 2, name: 'Apple iTunes', logoPath: '/2E03IAZsX4ZaUqM7tXlctEPMGWS.jpg' }
  ];

  // Estados para búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Cargar géneros al montar el componente
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const result = await showService.getShowGenres();
        if (result.success) {
          setGenres(result.data);
        }
      } catch (error) {
        console.error('Error cargando géneros:', error);
      }
    };

    loadGenres();
  }, []);

  // Cargar series al montar el componente y cuando cambie la categoría o página
  useEffect(() => {
    const loadShows = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let result;

        if (isSearching && searchQuery) {
          // Búsqueda
          result = await showService.searchShows(searchQuery, currentPage);
        } else if (useFilters && (selectedGenres.length > 0 || selectedYear || minRating || selectedProviders.length > 0)) {
          // Filtros avanzados
          const filters = {
            genres: selectedGenres,
            first_air_date_year: selectedYear,
            vote_average_gte: minRating,
            watchProviders: selectedProviders.length > 0 ? selectedProviders : undefined,
            watchRegion: 'ES',
            sort_by: 'popularity.desc'
          };
          result = await showService.discoverShows(filters, currentPage);
        } else {
          // Categorías
          result = await showService.getShowsByCategory(category, currentPage);
        }
        
        if (result.success && result.data) {
          setShows(result.data.results || []);
          setTotalPages(Math.min(result.data.total_pages || 1, 500));
        } else {
          setError(result.error || 'Error al cargar las series');
          setShows([]);
        }
      } catch (err) {
        console.error('Error loading shows:', err);
        setError('Error al cargar las series');
        setShows([]);
      } finally {
        setLoading(false);
      }
    };

    loadShows();
  }, [category, currentPage, isSearching, searchQuery, useFilters, selectedGenres, selectedYear, minRating, selectedProviders]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
    setUseFilters(false);
    setIsSearching(false);
    setSearchQuery('');
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGenreToggle = (genreId) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        return prev.filter(id => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
    setCurrentPage(1);
    setUseFilters(true);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setCurrentPage(1);
    setUseFilters(true);
  };

  const handleRatingChange = (rating) => {
    setMinRating(rating);
    setCurrentPage(1);
    setUseFilters(true);
  };

  const handleProviderToggle = (providerId) => {
    setSelectedProviders(prev => {
      if (prev.includes(providerId)) {
        return prev.filter(id => id !== providerId);
      } else {
        return [...prev, providerId];
      }
    });
    setCurrentPage(1);
    setUseFilters(true);
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedYear('');
    setMinRating('');
    setSelectedProviders([]);
    setUseFilters(false);
    setCurrentPage(1);
  };

  // Funciones para búsqueda
  const handleSearch = (query) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      clearSearch();
      return;
    }
    setSearchQuery(trimmedQuery);
    setIsSearching(true);
    setCurrentPage(1);
    setUseFilters(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setCurrentPage(1);
  };

  const handleShowClick = (showId) => {
    navigate(`/series/${showId}`);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setCurrentPage(currentPage);
  };

  if (loading && shows.length === 0) {
    return (
      <div className="shows-page__loading">
        <Spinner size={48} />
        <p>Cargando series...</p>
      </div>
    );
  }

  return (
    <div className="shows-page">
      <div className="shows-page__container">
        {/* Header */}
        <div className="shows-page__header">
          <h1 className="shows-page__title">Series</h1>
          <p className="shows-page__subtitle">
            Descubre las mejores series de televisión desde TMDB
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar 
          onSearch={handleSearch}
          onClear={clearSearch}
          placeholder="Buscar series..."
        />

        {/* Search Results Info */}
        {isSearching && searchQuery && (
          <div className="shows-page__search-info">
            <p>Mostrando resultados para: <strong>"{searchQuery}"</strong></p>
            <button 
              className="shows-page__clear-search"
              onClick={clearSearch}
            >
              ✕ Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Categories */}
        <div className="shows-page__filters">
          <div className="shows-page__categories">
            <CategoryButton
              active={category === 'popular'}
              onClick={() => handleCategoryChange('popular')}
            >
              Populares
            </CategoryButton>
            <CategoryButton
              active={category === 'top_rated'}
              onClick={() => handleCategoryChange('top_rated')}
            >
              Mejor Valoradas
            </CategoryButton>
            <CategoryButton
              active={category === 'on_the_air'}
              onClick={() => handleCategoryChange('on_the_air')}
            >
              En Emisión
            </CategoryButton>
            <CategoryButton
              active={category === 'airing_today'}
              onClick={() => handleCategoryChange('airing_today')}
            >
              Hoy en TV
            </CategoryButton>
          </div>
        </div>

        {/* Advanced Filters Dropdown */}
        <div className="shows-page__advanced-toggle">
          <AdvancedFilterToggle open={showAdvancedFilters} onClick={() => setShowAdvancedFilters((prev) => !prev)} />
        </div>

        {showAdvancedFilters && (
          <div className="shows-page__advanced-filters">
            <h3 className="shows-page__filters-title">
              Filtros avanzados
              {useFilters && (
                <button 
                  className="shows-page__clear-filters"
                  onClick={clearFilters}
                >
                  Limpiar filtros
                </button>
              )}
            </h3>
            {/* All Filters in one row */}
            <div className="shows-page__dropdown-row">
              {/* Genres Filter */}
              <div className="shows-page__filter-section">
                <label className="shows-page__filter-label">Géneros</label>
                <div className="shows-page__genres-dropdown">
                  <button 
                    className="shows-page__genres-dropdown-btn"
                    onClick={() => setShowGenresDropdown(!showGenresDropdown)}
                  >
                    {selectedGenres.length > 0 
                      ? `${selectedGenres.length} seleccionado${selectedGenres.length > 1 ? 's' : ''}`
                      : 'Seleccionar géneros'}
                    <span className={`shows-page__dropdown-arrow ${showGenresDropdown ? 'open' : ''}`}>▼</span>
                  </button>
                  {showGenresDropdown && (
                    <div className="shows-page__genres-dropdown-content">
                      {genres.map((genre) => (
                        <button
                          key={genre.id}
                          className={`shows-page__genre-btn ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
                          onClick={() => handleGenreToggle(genre.id)}
                        >
                          {genre.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Platforms Filter */}
              <div className="shows-page__filter-section">
                <label className="shows-page__filter-label">Plataformas</label>
                <div className="shows-page__providers-dropdown">
                  <button 
                    className="shows-page__providers-dropdown-btn"
                    onClick={() => setShowProvidersDropdown(!showProvidersDropdown)}
                  >
                    {selectedProviders.length > 0 
                      ? `${selectedProviders.length} seleccionada${selectedProviders.length > 1 ? 's' : ''}`
                      : 'Seleccionar plataformas'}
                    <span className={`shows-page__dropdown-arrow ${showProvidersDropdown ? 'open' : ''}`}>▼</span>
                  </button>
                  {showProvidersDropdown && (
                    <div className="shows-page__providers-dropdown-content">
                      {streamingProviders.map((provider) => (
                        <button
                          key={provider.id}
                          className={`shows-page__provider-btn ${selectedProviders.includes(provider.id) ? 'active' : ''}`}
                          onClick={() => handleProviderToggle(provider.id)}
                        >
                          <img 
                            src={`https://image.tmdb.org/t/p/original${provider.logoPath}`}
                            alt={provider.name}
                            className="shows-page__provider-logo"
                          />
                          <span>{provider.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Year Filter */}
              <div className="shows-page__filter-section">
                <label className="shows-page__filter-label">Año</label>
                <div className="shows-page__select-wrapper">
                  <select 
                    className="shows-page__year-select"
                    value={selectedYear}
                    onChange={(e) => handleYearChange(e.target.value)}
                  >
                    <option value="">Todos los años</option>
                    {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <span className="shows-page__select-arrow">▼</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="shows-page__filter-section">
                <label className="shows-page__filter-label">Puntuación</label>
                <div className="shows-page__select-wrapper">
                  <select 
                    className="shows-page__rating-select"
                    value={minRating}
                    onChange={(e) => handleRatingChange(e.target.value)}
                  >
                    <option value="">Cualquier puntuación</option>
                    <option value="5">5+ ⭐</option>
                    <option value="6">6+ ⭐</option>
                    <option value="7">7+ ⭐</option>
                    <option value="8">8+ ⭐</option>
                    <option value="9">9+ ⭐</option>
                  </select>
                  <span className="shows-page__select-arrow">▼</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && shows.length === 0 && (
          <div className="shows-page__loading">
            <Spinner size={48} />
            <p>Cargando series...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="shows-page__error">
            <p>⚠️ {error}</p>
            <button 
              className="shows-page__retry-btn"
              onClick={handleRetry}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Shows Grid */}
        {!loading && !error && shows.length > 0 && (
          <>
            <div className="shows-page__grid">
              {shows.map((show) => (
                <MediaCard
                  key={show.id}
                  item={show}
                  type="series"
                  onClick={handleShowClick}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Empty State */}
        {!loading && !error && shows.length === 0 && (
          <div className="shows-page__empty">
            <p>No se encontraron series</p>
          </div>
        )}

      </div>
    </div>
  );
}