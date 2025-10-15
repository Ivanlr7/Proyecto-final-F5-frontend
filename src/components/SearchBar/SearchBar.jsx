import { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, onClear, isSearching, searchQuery }) => {
  const [inputValue, setInputValue] = useState(searchQuery || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (query.length >= 2) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onClear();
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Buscar películas por título..."
            className="search-input"
            minLength={2}
          />
          <button type="submit" className="search-button">
            🔍 Buscar
          </button>
          {isSearching && (
            <button 
              type="button" 
              onClick={handleClear}
              className="clear-search-button"
            >
              ✕ Limpiar
            </button>
          )}
        </div>
      </form>
      {isSearching && searchQuery && (
        <p className="search-info">
          Mostrando resultados para: "<strong>{searchQuery}</strong>"
        </p>
      )}
    </div>
  );
};

export default SearchBar;