import { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, onClear, isSearching, searchQuery, placeholder = 'Buscar películas por título...', asForm = true }) => {
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
      {asForm ? (
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={placeholder}
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
      ) : (
        <div className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="search-input"
              minLength={2}
            />
            <button onClick={handleSubmit} className="search-button" type="button">
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
        </div>
      )}
      {isSearching && searchQuery && (
        <p className="search-info">
          Mostrando resultados para: "<strong>{searchQuery}</strong>"
        </p>
      )}
    </div>
  );
};

export default SearchBar;