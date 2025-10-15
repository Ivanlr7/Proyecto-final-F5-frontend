import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import movieService from '../../../api/services/MovieService';
import SearchBar from '../../../components/SearchBar/SearchBar';
import './MoviesPage.css';

export default function MoviesPage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
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
  const [useFilters, setUseFilters] = useState(false);

  // Estados para búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Cargar géneros al montar el componente
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const result = await movieService.getMovieGenres();
        if (result.success) {
          setGenres(result.data);
        }
      } catch (error) {
        console.error('Error cargando géneros:', error);
      }
    };

    loadGenres();
  }, []);

  // Cargar películas al montar el componente y cuando cambie la categoría o página
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let result;
        
        if (isSearching && searchQuery) {

          result = await movieService.searchMovies(searchQuery, currentPage);
        } else if (useFilters) {
          // Filtros avanzados
          const filters = {
            page: currentPage,
            genres: selectedGenres.length > 0 ? selectedGenres : undefined,
            year: selectedYear || undefined,
            minRating: minRating ? parseFloat(minRating) : undefined,
            sortBy: 'popularity.desc'
          };
          result = await movieService.getMoviesWithFilters(filters);
        } else {
          // Usar categorías tradicionales
          if (category === 'popular') {
            result = await movieService.getPopularMovies(currentPage);
          } else {
            result = await movieService.getMoviesByCategory(category, currentPage);
          }
        }
        
        if (result.success) {
          setMovies(result.data.results);
          setTotalPages(result.data.total_pages);
          console.log('✅ Películas cargadas:', result.data);
        } else {
          setError(result.error || 'Error al cargar películas');
          console.error('❌ Error:', result);
        }
      } catch (error) {
        setError('Error de conexión');
        console.error('❌ Error de conexión:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [category, currentPage, useFilters, selectedGenres, selectedYear, minRating, isSearching, searchQuery]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
    setUseFilters(false); 
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

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedYear('');
    setMinRating('');
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

  const handleMovieClick = (movieId) => {
    navigate(`/peliculas/${movieId}`);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setCurrentPage(currentPage);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatRating = (rating) => {
    return rating ? `${rating}/10` : 'N/A';
  };

  return (
    <div className="movies-page">
      <div className="movies-page__container">
        {/* Header */}
        <div className="movies-page__header">
          <h1 className="movies-page__title">Películas</h1>
          <p className="movies-page__subtitle">
            Descubre las mejores películas desde TMDB
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar 
          onSearch={handleSearch}
          onClear={clearSearch}
          isSearching={isSearching}
          searchQuery={searchQuery}
        />

        {/* Category Filter */}
        <div className="movies-page__filters">
          <div className="movies-page__categories">
            <button 
              className={`movies-page__category-btn ${!useFilters && category === 'popular' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('popular')}
            >
              Populares
            </button>
            <button 
              className={`movies-page__category-btn ${!useFilters && category === 'top_rated' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('top_rated')}
            >
              Mejor Valoradas
            </button>
            <button 
              className={`movies-page__category-btn ${!useFilters && category === 'now_playing' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('now_playing')}
            >
              En Cines
            </button>
            <button 
              className={`movies-page__category-btn ${!useFilters && category === 'upcoming' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('upcoming')}
            >
              Próximos Estrenos
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="movies-page__advanced-filters">
          <h3 className="movies-page__filters-title">
            Filtros Avanzados
            {useFilters && (
              <button 
                className="movies-page__clear-filters"
                onClick={clearFilters}
              >
                Limpiar Filtros
              </button>
            )}
          </h3>
          
          {/* Genres Filter */}
          <div className="movies-page__filter-section">
            <label className="movies-page__filter-label">Géneros:</label>
            <div className="movies-page__genres">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  className={`movies-page__genre-btn ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
                  onClick={() => handleGenreToggle(genre.id)}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* Year Filter */}
          <div className="movies-page__filter-section">
            <label className="movies-page__filter-label">Año:</label>
            <select 
              className="movies-page__year-select"
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="">Todos los años</option>
              {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="movies-page__filter-section">
            <label className="movies-page__filter-label">Puntuación mínima:</label>
            <select 
              className="movies-page__rating-select"
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
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="movies-page__loading">
            <div className="loading-spinner"></div>
            <p>Cargando películas...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="movies-page__error">
            <p>❌ {error}</p>
            <button 
              className="movies-page__retry-btn"
              onClick={handleRetry}
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && !error && movies.length > 0 && (
          <>
            <div className="movies-page__grid">
              {movies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="movie-card"
                  onClick={() => handleMovieClick(movie.id)}
                >
                  <div className="movie-card__image-container">
                    {movie.poster_url ? (
                      <img 
                        src={movie.poster_url} 
                        alt={movie.title}
                        className="movie-card__image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="movie-card__image-fallback"
                      style={{ display: movie.poster_url ? 'none' : 'flex' }}
                    >
                      <span>🎬</span>
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="movie-card__rating">
                      ⭐ {formatRating(movie.formatted_vote_average)}
                    </div>

                    <div className="movie-card__overlay">
                      <div className="movie-card__info">
                        <h3 className="movie-card__title">{movie.title}</h3>
                        <p className="movie-card__year">{movie.release_year}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="movies-page__pagination">
              <button 
                className="movies-page__page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Anterior
              </button>
              
              <span className="movies-page__page-info">
                Página {currentPage} de {totalPages}
              </span>
              
              <button 
                className="movies-page__page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente →
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && (
          <div className="movies-page__empty">
            <p>No se encontraron películas</p>
          </div>
        )}

      </div>
    </div>
  );
}