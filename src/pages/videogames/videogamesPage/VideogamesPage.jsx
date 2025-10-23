import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideogameService from '../../../api/services/VideogameService';
import MediaCard from '../../../components/MediaCard';
import SearchBar from '../../../components/SearchBar/SearchBar';
import { Filter, ChevronDown } from 'lucide-react';
import Spinner from '../../../components/common/Spinner';
import './VideogamesPage.css';

const VideogamesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videogames, setVideogames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeFilter, setActiveFilter] = useState('popular');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Advanced filters state
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const genres = [
    { id: '', name: 'Todos los géneros' },
    { id: 'action', name: 'Acción' },
    { id: 'adventure', name: 'Aventura' },
    { id: 'rpg', name: 'RPG' },
    { id: 'strategy', name: 'Estrategia' },
    { id: 'shooter', name: 'Disparos' },
    { id: 'sports', name: 'Deportes' },
    { id: 'racing', name: 'Carreras' },
    { id: 'fighting', name: 'Lucha' },
    { id: 'horror', name: 'Horror' },
    { id: 'puzzle', name: 'Puzzle' },
    { id: 'indie', name: 'Indie' }
  ];

  const platforms = [
    { id: '', name: 'Todas las plataformas' },
    { id: 'pc', name: 'PC' },
    { id: 'playstation', name: 'PlayStation' },
    { id: 'xbox', name: 'Xbox' },
    { id: 'nintendo', name: 'Nintendo Switch' },
    { id: 'mobile', name: 'Móvil' }
  ];

  const ratings = [
    { id: '', name: 'Todas las valoraciones' },
    { id: '9', name: '9+ ⭐' },
    { id: '8', name: '8+ ⭐' },
    { id: '7', name: '7+ ⭐' },
    { id: '6', name: '6+ ⭐' }
  ];

  const currentYear = new Date().getFullYear();
  const years = [
    { id: '', name: 'Todos los años' },
    { id: currentYear.toString(), name: currentYear.toString() },
    { id: (currentYear - 1).toString(), name: (currentYear - 1).toString() },
    { id: (currentYear - 2).toString(), name: (currentYear - 2).toString() },
    { id: '2020-2023', name: '2020-2023' },
    { id: '2010-2019', name: '2010-2019' }
  ];

  const fetchVideogames = useCallback(async (query = null) => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      
      if (query || (activeFilter === 'search' && searchQuery)) {
        data = await VideogameService.searchGames(query || searchQuery, currentPage);
      } else if (activeFilter === 'upcoming') {
        data = await VideogameService.getUpcomingGames(currentPage);
      } else if (activeFilter === 'recent') {
        data = await VideogameService.getRecentGames(currentPage);
      } else {
        data = await VideogameService.getPopularGames(currentPage);
      }
      

      if (selectedGenre || selectedPlatform || selectedRating || selectedYear) {
        data = data.filter(game => {
          let passes = true;
          
          if (selectedGenre) {
            passes = passes && game.genres?.some(g => 
              g.name.toLowerCase().includes(selectedGenre.toLowerCase())
            );
          }
          
          if (selectedPlatform) {
            passes = passes && game.platforms?.some(p => 
              p.name.toLowerCase().includes(selectedPlatform.toLowerCase())
            );
          }
          
          if (selectedRating) {
            passes = passes && game.vote_average >= parseFloat(selectedRating);
          }
          
          if (selectedYear) {
            const gameYear = game.release_year || new Date(game.release_date).getFullYear();
            if (selectedYear.includes('-')) {
              const [start, end] = selectedYear.split('-').map(Number);
              passes = passes && gameYear >= start && gameYear <= end;
            } else {
              passes = passes && gameYear === parseInt(selectedYear);
            }
          }
          
          return passes;
        });
      }
      
      setVideogames(data);
    } catch (err) {
      console.error('Error fetching videogames:', err);
      setError('Error al cargar los videojuegos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeFilter, searchQuery, selectedGenre, selectedPlatform, selectedRating, selectedYear]);

  useEffect(() => {
    fetchVideogames();
  }, [fetchVideogames]);

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchQuery(query);
      setActiveFilter('search');
    }
  }, [searchParams]);

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setSearchParams({ search: query });
    setActiveFilter('search');
    setCurrentPage(1);
    fetchVideogames(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
    setActiveFilter('popular');
    setCurrentPage(1);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    setSearchParams({});
    setSearchQuery('');
  };

  const handleClearAdvancedFilters = () => {
    setSelectedGenre('');
    setSelectedPlatform('');
    setSelectedRating('');
    setSelectedYear('');
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && videogames.length === 0) {
    return (
      <div className='videogames-page'>
                <div className='loading-spinner'>   
        <Spinner size={48} />
      </div>

   
        </div>


    
    );
  }

  if (error) {
    return (
      <div className="videogames-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => fetchVideogames()} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="videogames-page">
      <div className="videogames-page__container">
        {/* Header */}
        <div className="videogames-page__header">
          <h1 className="videogames-page__title">Videojuegos</h1>
        </div>

        {/* Search Bar */}
        <SearchBar 
          onSearch={handleSearchSubmit}
          onClear={handleClearSearch}
          isSearching={activeFilter === 'search'}
          searchQuery={searchQuery}
          placeholder="Buscar videojuegos por título..."
        />

        {/* Basic Filters */}
        <div className="videogames-page__filters">
          <div className="videogames-page__categories">
            <button
              className={`videogames-page__category-btn ${activeFilter === 'popular' ? 'active' : ''}`}
              onClick={() => handleFilterChange('popular')}
            >
              Populares
            </button>
            <button
              className={`videogames-page__category-btn ${activeFilter === 'recent' ? 'active' : ''}`}
              onClick={() => handleFilterChange('recent')}
            >
              Recientes
            </button>
            <button
              className={`videogames-page__category-btn ${activeFilter === 'upcoming' ? 'active' : ''}`}
              onClick={() => handleFilterChange('upcoming')}
            >
              Próximos
            </button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="videogames-page__advanced-toggle">
          <button 
            className="advanced-filter-toggle"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter size={20} />
            <span>Filtros Avanzados</span>
            <ChevronDown 
              size={20} 
              style={{ 
                transform: showAdvancedFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            />
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="videogames-page__advanced-filters">
            <div className="videogames-page__filters-title">
              <h3>Filtros Avanzados</h3>
              {(selectedGenre || selectedPlatform || selectedRating || selectedYear) && (
                <button 
                  className="videogames-page__clear-filters"
                  onClick={handleClearAdvancedFilters}
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            <div className="videogames-page__filters-grid">
              {/* Genre Filter */}
              <div className="filter-group">
                <label htmlFor="genre-filter">🎮 Género</label>
                <select 
                  id="genre-filter"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="filter-select"
                >
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platform Filter */}
              <div className="filter-group">
                <label htmlFor="platform-filter">🕹️ Plataforma</label>
                <select 
                  id="platform-filter"
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="filter-select"
                >
                  {platforms.map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="filter-group">
                <label htmlFor="rating-filter">⭐ Valoración</label>
                <select 
                  id="rating-filter"
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="filter-select"
                >
                  {ratings.map(rating => (
                    <option key={rating.id} value={rating.id}>
                      {rating.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="filter-group">
                <label htmlFor="year-filter">📅 Año</label>
                <select 
                  id="year-filter"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="filter-select"
                >
                  {years.map(year => (
                    <option key={year.id} value={year.id}>
                      {year.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Games Grid */}
        {loading ? (
          <div>
         
            <p>Cargando videojuegos...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => fetchVideogames()} className="retry-button">
              Reintentar
            </button>
          </div>
        ) : (
          <>
            <div className="videogames-page__grid">
              {videogames.map((videogame) => (
                <MediaCard key={videogame.id} item={videogame} type="videogame" />
              ))}
            </div>

            {videogames.length === 0 && (
              <div className="no-results">
                <p>No se encontraron videojuegos con los filtros seleccionados.</p>
              </div>
            )}

            {/* Pagination */}
            <div className="videogames-page__pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="videogames-page__pagination-btn"
              >
                ← Anterior
              </button>
              <span className="videogames-page__page-info">Página {currentPage}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={videogames.length < 20}
                className="videogames-page__pagination-btn"
              >
                Siguiente →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideogamesPage;
