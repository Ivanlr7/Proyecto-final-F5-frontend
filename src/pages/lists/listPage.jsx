
import React, { useEffect, useState } from 'react';
import ListService from '../../api/services/ListService';
import { useSelector } from 'react-redux';
import MediaCard from '../../components/MediaCard/MediaCard';
import { Link, useNavigate } from 'react-router-dom';
import './ListPage.css';
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
  const navigate = useNavigate();
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
      // Obtener detalles de los primeros 4 items de la nueva lista
      let detailedItems = [];
      if (res.data.items && res.data.items.length > 0) {
        const fetchers = res.data.items.slice(0, 4).map(async (item) => {
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
        detailedItems = await Promise.all(fetchers);
      }
      const newListWithDetails = { ...res.data, detailedItems };
      setLists(prev => [res.data, ...prev]);
      setListsWithDetails(prev => [newListWithDetails, ...prev]);
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
      <button className="list-page__create-btn" onClick={() => navigate('/listas/crear')}>
        Crear nueva lista
      </button>
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
