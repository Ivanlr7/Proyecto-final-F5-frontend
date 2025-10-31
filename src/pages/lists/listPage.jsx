
import React, { useEffect, useState } from 'react';
import ListService from '../../api/services/ListService';
import { useSelector } from 'react-redux';
import MediaCard from '../../components/MediaCard/MediaCard';
import { Link } from 'react-router-dom';
import './listPage.css';
import Avatar from '../../components/common/Avatar';
import SearchBar from '../../components/SearchBar/SearchBar';
import MovieService from '../../api/services/MovieService';
import ShowService from '../../api/services/ShowService';
import BookService from '../../api/services/BookService';
import VideogameService from '../../api/services/VideogameService';

const listService = new ListService();

const AVATAR_PLACEHOLDER = 'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=';

const ListPage = () => {
  const { token, user } = useSelector(state => state.auth);
  const [lists, setLists] = useState([]);
  const [listsWithDetails, setListsWithDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newList, setNewList] = useState({ name: '', description: '' });
  const [selectedType, setSelectedType] = useState('movie');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItems, setAddedItems] = useState([]);
  // Servicios para búsqueda
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

  const handleSearch = async (query) => {
    setSearching(true);
    setSearchQuery(query);
    let results = [];
    try {
      if (selectedType === 'movie') {
        const res = await services.movie.searchMovies(query);
        results = res?.data?.results || [];
        results = results.map(r => ({ ...r, type: 'movie' }));
      } else if (selectedType === 'series') {
        const res = await services.series.searchShows(query);
        results = res?.data?.results || [];
        results = results.map(r => ({ ...r, type: 'series' }));
      } else if (selectedType === 'book') {
        results = await services.book.searchBooks(query);
        results = results.map(r => ({ ...r, type: 'book' }));
      } else if (selectedType === 'videogame') {
        results = await services.videogame.searchGames(query);
        results = results.map(r => ({ ...r, type: 'videogame' }));
      }
    } catch (e) {
      results = [];
    }
    setSearchResults(results);
    setSearching(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearching(false);
  };

  const handleAddItem = (item) => {
    if (!addedItems.some(i => i.id === item.id && i.type === item.type)) {
      setAddedItems(prev => [...prev, item]);
    }
  };

  const handleRemoveItem = (item) => {
    setAddedItems(prev => prev.filter(i => !(i.id === item.id && i.type === item.type)));
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Debes iniciar sesión para crear una lista');
      return;
    }
    // Enviar los IDs y tipos de los elementos añadidos
    // Mapear los items al formato esperado por el backend
    const typeMap = {
      movie: 'MOVIE',
      series: 'SERIES',
      book: 'BOOK',
      videogame: 'GAME',
      game: 'GAME',
    };
    const items = addedItems.map(i => ({
      contentType: typeMap[i.type] || '',
      contentId: String(i.id),
      apiSource: i.apiSource || inferApiSource(i.type)
    }));

    function inferApiSource(type) {
      if (type === 'movie' || type === 'series') return 'TMDB';
      if (type === 'book') return 'OPENLIBRARY';
      if (type === 'videogame' || type === 'game') return 'IGDB';
      return '';
    }

    const res = await listService.createList({
      title: newList.name,
      description: newList.description,
      userId: user.userId,
      items,
    }, token);
    if (res.success) {
      setLists(prev => [res.data, ...prev]);
      setShowCreate(false);
      setNewList({ name: '', description: '' });
      setAddedItems([]);
      setSearchResults([]);
      setSearchQuery('');
    } else {
      alert(res.error || 'Error al crear la lista');
    }
  };

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      setError(null);
      const res = await listService.getAllLists();
      if (res.success) {
        setLists(res.data);
        // Para cada lista, obtener detalles de los primeros 4 items
        const listsDetails = await Promise.all(res.data.map(async (list) => {
          if (list.items && list.items.length > 0) {
            const fetchers = list.items.slice(0, 4).map(async (item) => {
              const type = (item.contentType || '').toLowerCase();
              const contentId = item.contentId;
              try {
                if (type === 'movie') {
                  const r = await MovieService.getMovieDetails(contentId);
                  return { ...r.data, type: 'movie' };
                } else if (type === 'series') {
                  const r = await ShowService.getShowDetails(contentId);
                  return { ...r.data, type: 'series' };
                } else if (type === 'book') {
                  const r = await BookService.getBookById ? await BookService.getBookById(contentId) : null;
                  return r ? { ...r, type: 'book' } : { id: contentId, type: 'book' };
                } else if (type === 'game' || type === 'videogame') {
                  const r = await VideogameService.getGameById(contentId);
                  return { ...r, type: 'videogame' };
                } else {
                  return { id: contentId, type };
                }
              } catch {
                return { id: contentId, type };
              }
            });
            const details = await Promise.all(fetchers);
            return { ...list, detailedItems: details };
          } else {
            return { ...list, detailedItems: [] };
          }
        }));
        setListsWithDetails(listsDetails);
      } else setError(res.error);
      setLoading(false);
    };
    fetchLists();
  }, []);

  return (
    <div className="list-page">
      <h1 className="list-page__title">Listas</h1>
      <button className="list-page__create-btn" onClick={() => setShowCreate(v => !v)}>
        {showCreate ? 'Cancelar' : 'Crear nueva lista'}
      </button>
      {showCreate && (
        <form className="list-page__form" onSubmit={handleCreateList}>
          <div className="list-page__form-fields">
            <input
              className="list-page__input"
              placeholder="Nombre de la lista"
              value={newList.name}
              onChange={e => setNewList(l => ({ ...l, name: e.target.value }))}
              required
            />
            <textarea
              className="list-page__textarea"
              placeholder="Descripción"
              value={newList.description}
              onChange={e => setNewList(l => ({ ...l, description: e.target.value }))}
            />
          </div>
          <div className="list-page__search-tabs">
            {Object.keys(typeLabels).map(type => (
              <button
                key={type}
                type="button"
                className={`list-page__tab${selectedType === type ? ' list-page__tab--active' : ''}`}
                onClick={() => { setSelectedType(type); setSearchResults([]); setSearchQuery(''); }}
              >
                {typeLabels[type]}
              </button>
            ))}
          </div>
          <SearchBar
            onSearch={handleSearch}
            onClear={handleClearSearch}
            isSearching={searching}
            searchQuery={searchQuery}
            placeholder={`Buscar ${typeLabels[selectedType]?.toLowerCase()}...`}
            asForm={false}
          />
          <div className="list-page__search-results">
            {searchResults.length > 0 && (
              <div className="list-page__results-list">
                {searchResults.map(item => (
                  <div key={item.id} className="list-page__result-item">
                    <MediaCard item={item} type={item.type} className="media-card--mini" />
                    <button className="list-page__add-btn" type="button" onClick={() => handleAddItem(item)} disabled={addedItems.some(i => i.id === item.id && i.type === item.type)}>
                      Añadir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="list-page__added-items">
            <h4>Elementos añadidos ({addedItems.length})</h4>
            <div className="list-page__added-list">
              {addedItems.map(item => (
                <div key={item.id + item.type} className="list-page__added-item">
                  <MediaCard item={item} type={item.type} className="media-card--mini" />
                  <button className="list-page__remove-btn" type="button" onClick={() => handleRemoveItem(item)}>
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button className="list-page__submit-btn" type="submit" disabled={!newList.name || addedItems.length === 0}>
            Guardar lista
          </button>
        </form>
      )}
      {loading ? <p>Cargando...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
        <div className="list-page__lists">
          {listsWithDetails.map(list => (
            <div key={list.id} className="list-card">
              <div className="list-card__covers">
                {(list.detailedItems && list.detailedItems.length > 0 ? list.detailedItems : [null, null, null, null]).slice(0, 4).map((item, idx) => (
                  <div key={idx} className="list-card__cover" style={{ zIndex: 10 - idx }}>
                    {item ? (
                      <div className="list-card__cover-img-wrapper">
                        <img
                          src={item.poster_url || item.cover_url || item.backdrop_url || item.screenshot_url || item.image || item.img || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?fit=crop&w=400&q=80'}
                          alt={item.title || item.name || ''}
                          className="list-card__cover-img"
                        />
            
                      </div>
                    ) : (
                      <div className="list-card__placeholder">?</div>
                    )}
                  </div>
                ))}
              </div>
              <h3 className="list-card__name">
                <Link to={`/listas/${list.idList || list.id}`}>{list.title || list.name}</Link>
              </h3>
              <div className="list-card__author">
                <Avatar
                  image={list.userProfileImageUrl}
                  name={list.userName || 'U'}
                  size={28}
                  className="list-card__avatar"
                />
                <span className="list-card__author-label">Creada por <b>{list.userName || 'Usuario'}</b></span>
              </div>
    
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListPage;
