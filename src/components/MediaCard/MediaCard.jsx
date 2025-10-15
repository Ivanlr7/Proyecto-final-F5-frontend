import { useNavigate } from 'react-router-dom';
import './MediaCard.css';

export default function MediaCard({ 
  item, 
  type = 'movie', // 'movie', 'series', 'game'
  onClick,
  className = ''
}) {
  const navigate = useNavigate();

  // Formatear rating a una escala de 10
  const formatRating = (rating) => {
    if (!rating) return 'N/A';
    const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return isNaN(numericRating) ? 'N/A' : numericRating.toFixed(1);
  };

  // Obtener la imagen según el tipo de media
  const getImageUrl = () => {
    switch (type) {
      case 'movie':
        return item.poster_url;
      case 'series':
        return item.poster_url || item.backdrop_url;
      case 'game':
        return item.cover_url || item.screenshot_url;
      default:
        return item.poster_url;
    }
  };

  // Obtener el título según el tipo de media
  const getTitle = () => {
    switch (type) {
      case 'movie':
        return item.title;
      case 'series':
        return item.name || item.title;
      case 'game':
        return item.name || item.title;
      default:
        return item.title;
    }
  };

  // Obtener el año/fecha según el tipo de media
  const getYear = () => {
    switch (type) {
      case 'movie':
        return item.release_year;
      case 'series':
        return item.first_air_date ? new Date(item.first_air_date).getFullYear() : item.release_year;
      case 'game':
        return item.release_date ? new Date(item.release_date).getFullYear() : item.release_year;
      default:
        return item.release_year;
    }
  };

  // Obtener la ruta de navegación según el tipo
  const getNavigationPath = () => {
    switch (type) {
      case 'movie':
        return `/peliculas/${item.id}`;
      case 'series':
        return `/series/${item.id}`;
      case 'game':
        return `/juegos/${item.id}`;
      default:
        return `/peliculas/${item.id}`;
    }
  };

  // Obtener el icono de fallback según el tipo
  const getFallbackIcon = () => {
    switch (type) {
      case 'movie':
        return '🎬';
      case 'series':
        return '📺';
      case 'game':
        return '🎮';
      default:
        return '🎬';
    }
  };

  // Manejar el click
  const handleClick = () => {
    if (onClick) {
      onClick(item.id);
    } else {
      navigate(getNavigationPath());
    }
  };

  return (
    <div 
      className={`media-card ${className}`}
      onClick={handleClick}
    >
      <div className="media-card__image-container">
        {getImageUrl() ? (
          <img 
            src={getImageUrl()} 
            alt={getTitle()}
            className="media-card__image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div 
          className="media-card__image-fallback"
          style={{ display: getImageUrl() ? 'none' : 'flex' }}
        >
          <span>{getFallbackIcon()}</span>
        </div>
        
        {/* Rating Badge */}
        {item.vote_average && (
          <div className="media-card__rating">
            ⭐ {formatRating(item.formatted_vote_average || item.vote_average)}
          </div>
        )}

        <div className="media-card__overlay">
          <div className="media-card__info">
            <h3 className="media-card__title">{getTitle()}</h3>
            <p className="media-card__year">{getYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}