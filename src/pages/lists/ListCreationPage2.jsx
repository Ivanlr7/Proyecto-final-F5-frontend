import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ListService from '../../api/services/ListService';
import MovieService from '../../api/services/MovieService';
import ShowService from '../../api/services/ShowService';
import BookService from '../../api/services/BookService';
import VideogameService from '../../api/services/VideogameService';
import MediaCard from '../../components/MediaCard/MediaCard';
import './ListCreationPage2.css';

const listService = new ListService();

const CreateListPage = () => {
  const { token, user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('movie');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [searching, setSearching] = useState(false);

  const services = {
    movie: MovieService,
    series: ShowService,
    book: BookService,
    videogame: VideogameService,
  };

  const typeLabels = {
    movie: 'Películas',
    series: 'Series',
    book: 'Libros',
    videogame: 'Videojuegos',
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    let results = [];
    try {
      if (contentType === 'movie') {
        const res = await services.movie.searchMovies(searchQuery);
        results = res?.data?.results || [];
        results = results.map(r => ({ ...r, type: 'movie' }));
      } else if (contentType === 'series') {
        const res = await services.series.searchShows(searchQuery);
        results = res?.data?.results || [];
        results = results.map(r => ({ ...r, type: 'series' }));
      } else if (contentType === 'book') {
        results = await services.book.searchBooks(searchQuery);
        results = results.map(r => ({ ...r, type: 'book' }));
      } else if (contentType === 'videogame') {
        results = await services.videogame.searchGames(searchQuery);
        results = results.map(r => ({ ...r, type: 'videogame' }));
      }
    } catch (e) {
      console.error('Error en búsqueda:', e);
      results = [];
    }
    setSearchResults(results);
    setSearching(false);
  };

  const handleAddItem = (item) => {
    if (!addedItems.some(i => i.id === item.id && i.type === item.type)) {
      setAddedItems([...addedItems, item]);
    }
  };

  const handleRemoveItem = (item) => {
    setAddedItems(addedItems.filter(i => !(i.id === item.id && i.type === item.type)));
  };

  const isItemAdded = (item) => {
    return addedItems.some(i => i.id === item.id && i.type === item.type);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Por favor, ingresa un título para la lista');
      return;
    }
    if (addedItems.length === 0) {
      alert('Por favor, agrega al menos un elemento a la lista');
      return;
    }
    if (!user) {
      alert('Debes iniciar sesión para crear una lista');
      return;
    }
    
    const typeMap = {
      movie: 'MOVIE',
      series: 'SERIES',
      book: 'BOOK',
      videogame: 'GAME',
      game: 'GAME',
    };

    function inferApiSource(type) {
      if (type === 'movie' || type === 'series') return 'TMDB';
      if (type === 'book') return 'OPENLIBRARY';
      if (type === 'videogame' || type === 'game') return 'IGDB';
      return '';
    }

    const items = addedItems.map(i => ({
      contentType: typeMap[i.type] || '',
      contentId: String(i.id),
      apiSource: i.apiSource || inferApiSource(i.type)
    }));

    const res = await listService.createList({
      title,
      description,
      userId: user.userId,
      items,
    }, token);

    if (res.success) {
      alert('Lista creada exitosamente');
      navigate('/listas');
    } else {
      alert(res.error || 'Error al crear la lista');
    }
  };

  const handleCancel = () => {
    if (title || description || addedItems.length > 0) {
      if (window.confirm('¿Estás seguro de que quieres cancelar? Se perderán todos los cambios.')) {
        navigate('/listas');
      }
    } else {
      navigate('/listas');
    }
  };

  return (
    <div className="create-list-page">
      {/* Animated Background */}
      <div className="create-list-page__background">
        <div className="create-list-page__background-blob create-list-page__background-blob--blue"></div>
        <div className="create-list-page__background-blob create-list-page__background-blob--purple"></div>
      </div>

      <div className="create-list-page__container">
        <div className="create-list-page__header">
          <h1 className="create-list-page__title">Crear Nueva Lista</h1>
          <p className="create-list-page__subtitle">
            Crea tu propia colección de películas, series, libros o videojuegos
          </p>
        </div>

        <div className="create-list-page__content">
          {/* Información de la lista */}
          <div className="create-list-page__info-section">
            <div className="create-list-page__form-group">
              <label className="create-list-page__label">
                Título de la lista *
              </label>
              <input
                type="text"
                className="create-list-page__input"
                placeholder="Ej: Mis películas favoritas de ciencia ficción"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="create-list-page__form-group">
              <label className="create-list-page__label">
                Descripción (opcional)
              </label>
              <textarea
                className="create-list-page__textarea"
                placeholder="Describe tu lista..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Items añadidos */}
            {addedItems.length > 0 && (
              <div className="create-list-page__added-section">
                <h3 className="create-list-page__section-title">
                  Elementos en la lista ({addedItems.length})
                </h3>
                <div className="create-list-page__added-grid">
                  {addedItems.map((item) => (
                    <div key={`${item.id}-${item.type}`} className="create-list-page__item-wrapper">
                      <MediaCard 
                        item={item} 
                        type={item.type}
                      />
                      <button
                        className="create-list-page__remove-btn"
                        onClick={() => handleRemoveItem(item)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buscador de contenido */}
          <div className="create-list-page__search-section">
            <h3 className="create-list-page__section-title">Buscar contenido</h3>
            
            <div className="create-list-page__content-type">
              <label className="create-list-page__label">Tipo de contenido</label>
              <div className="create-list-page__type-buttons">
                <button
                  type="button"
                  className={`create-list-page__type-btn ${contentType === 'movie' ? 'create-list-page__type-btn--active' : ''}`}
                  onClick={() => {
                    setContentType('movie');
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                >
                  Películas
                </button>
                <button
                  type="button"
                  className={`create-list-page__type-btn ${contentType === 'series' ? 'create-list-page__type-btn--active' : ''}`}
                  onClick={() => {
                    setContentType('series');
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                >
                  Series
                </button>
                <button
                  type="button"
                  className={`create-list-page__type-btn ${contentType === 'videogame' ? 'create-list-page__type-btn--active' : ''}`}
                  onClick={() => {
                    setContentType('videogame');
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                >
                  Videojuegos
                </button>
                <button
                  type="button"
                  className={`create-list-page__type-btn ${contentType === 'book' ? 'create-list-page__type-btn--active' : ''}`}
                  onClick={() => {
                    setContentType('book');
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                >
                  Libros
                </button>
              </div>
            </div>

            <form onSubmit={handleSearch} className="create-list-page__search-form">
              <input
                type="text"
                className="create-list-page__search-input"
                placeholder={`Buscar ${typeLabels[contentType]?.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="create-list-page__search-btn" disabled={searching}>
                {searching ? 'Buscando...' : 'Buscar'}
              </button>
            </form>

            {/* Resultados de búsqueda */}
            {searchResults.length > 0 && (
              <div className="create-list-page__results">
                <h4 className="create-list-page__results-title">
                  Resultados ({searchResults.length})
                </h4>
                <div className="create-list-page__results-grid">
                  {searchResults.map((item) => (
                    <div key={`${item.id}-${item.type}`} className="create-list-page__result-item">
                      <MediaCard 
                        item={item} 
                        type={item.type}
                      />
                      <button
                        className={`create-list-page__result-btn ${isItemAdded(item) ? 'create-list-page__result-btn--remove' : ''}`}
                        onClick={() => {
                          if (isItemAdded(item)) {
                            handleRemoveItem(item);
                          } else {
                            handleAddItem(item);
                          }
                        }}
                      >
                        {isItemAdded(item) ? 'Quitar' : 'Añadir'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchQuery && searchResults.length === 0 && !searching && (
              <div className="create-list-page__no-results">
                <p>No se encontraron resultados para "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="create-list-page__actions">
          <button 
            className="create-list-page__btn create-list-page__btn--cancel"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button 
            className="create-list-page__btn create-list-page__btn--save"
            onClick={handleSave}
          >
            Guardar Lista
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateListPage;
