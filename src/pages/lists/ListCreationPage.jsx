import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ListService from '../../api/services/ListService';
import MovieService from '../../api/services/MovieService';
import ShowService from '../../api/services/ShowService';
import BookService from '../../api/services/BookService';
import VideogameService from '../../api/services/VideogameService';
import SearchBar from '../../components/SearchBar/SearchBar';
import MediaCard from '../../components/MediaCard/MediaCard';
import './ListCreationPage.css';

const listService = new ListService();

const ListCreationPage = () => {
  const { token, user } = useSelector(state => state.auth);
  const [newList, setNewList] = useState({ name: '', description: '' });
  const [selectedType, setSelectedType] = useState('movie');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItems, setAddedItems] = useState([]);
  const navigate = useNavigate();

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
      navigate('/listas');
    } else {
      alert(res.error || 'Error al crear la lista');
    }
  };

  return (
    <div className="list-creation-page">
      <h1 className="list-creation-page__title">Crear nueva lista</h1>
      <form className="list-creation-page__form" onSubmit={handleCreateList}>
        <div className="list-creation-page__form-fields">
          <input
            className="list-creation-page__input"
            placeholder="Nombre de la lista"
            value={newList.name}
            onChange={e => setNewList(l => ({ ...l, name: e.target.value }))}
            required
          />
          <textarea
            className="list-creation-page__textarea"
            placeholder="Descripción"
            value={newList.description}
            onChange={e => setNewList(l => ({ ...l, description: e.target.value }))}
          />
        </div>
        <div className="list-creation-page__search-tabs">
          {Object.keys(typeLabels).map(type => (
            <button
              key={type}
              type="button"
              className={`list-creation-page__tab${selectedType === type ? ' list-creation-page__tab--active' : ''}`}
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
        <div className="list-creation-page__search-results">
          {searchResults.length > 0 && (
            <div className="list-creation-page__results-list">
              {searchResults.map(item => {
                const isAdded = addedItems.some(i => i.id === item.id && i.type === item.type);
                return (
                  <div key={item.id} className="list-creation-page__result-item">
                    <MediaCard item={item} type={item.type} className="media-card--mini" />
                    {isAdded ? (
                      <button className="list-creation-page__add-btn" type="button" onClick={() => handleRemoveItem(item)}>
                        Quitar
                      </button>
                    ) : (
                      <button className="list-creation-page__add-btn" type="button" onClick={() => handleAddItem(item)}>
                        Añadir
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="list-creation-page__added-items">
          <h4>Elementos añadidos ({addedItems.length})</h4>
          <div className="list-creation-page__added-list">
            {addedItems.map(item => (
              <div key={item.id + item.type} className="list-creation-page__added-item">
                <MediaCard item={item} type={item.type} className="media-card--mini" />
                <button className="list-creation-page__remove-btn" type="button" onClick={() => handleRemoveItem(item)}>
                  Quitar
                </button>
              </div>
            ))}
          </div>
        </div>
        <button className="list-creation-page__submit-btn" type="submit" disabled={!newList.name || addedItems.length === 0}>
          Guardar lista
        </button>
      </form>
    </div>
  );
};

export default ListCreationPage;
