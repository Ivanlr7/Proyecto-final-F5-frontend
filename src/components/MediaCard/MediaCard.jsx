import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MediaCard.css';

export default function MediaCard({ 
  item, 
  type = 'movie', 
  onClick,
  className = ''
}) {
  const navigate = useNavigate();


  const formatRating = (rating) => {
    if (rating === null || rating === undefined) return 'N/A';
    const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return isNaN(numericRating) ? 'N/A' : numericRating.toFixed(1);
  };

  // Imagenes por defecto para cada tipo
  const defaultImages = {
    movie: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMGNpbmVtYSUyMGZpbG0lMjBkYXJrfGVufDF8fHx8MTc1OTc0NjE1NXww&ixlib=rb-4.1.0&q=80&w=1080",
    series: "https://images.unsplash.com/photo-1607110654203-d5665bd64105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0diUyMHNlcmllcyUyMHRlbGV2aXNpb24lMjBzaG93fGVufDF8fHx8MTc1OTc0NjE1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    videogame: "https://images.unsplash.com/photo-1655976796204-308e6f3deaa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjB2aWRlb2dhbWVzJTIwY29udHJvbGxlcnxlbnwxfHx8fDE3NTk3NDYxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    book: "https://images.unsplash.com/photo-1582203914689-d5cc1850fcb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMHJlYWRpbmclMjBsaWJyYXJ5fGVufDF8fHx8MTc1OTY1MTMxM3ww&ixlib=rb-4.1.0&q=80&w=1080"
  };

  const getImageUrl = () => {
    let url = null;
    switch (type) {
      case 'movie':
        url = item.poster_url;
        break;
      case 'series':
        url = item.poster_url || item.backdrop_url;
        break;
      case 'game':
        url = item.cover_url || item.screenshot_url;
        break;
      case 'videogame':
        url = item.cover_url || item.screenshot_url;
        break;
      case 'book':
        url = item.cover_url || item.poster_url;
        break;
      default:
        url = item.poster_url;
    }
    // Si no hay url, usar la imagen por defecto
    if (!url) {
      if (type === 'game') return defaultImages.videogame;
      return defaultImages[type] || defaultImages.movie;
    }
    return url;
  };


  const getTitle = () => {
    switch (type) {
      case 'movie':
        return item.title;
      case 'series':
        return item.name || item.title;
      case 'game':
        return item.name || item.title;
      case 'videogame':
        return item.name || item.title;
      case 'book':
        return item.title || item.name;
      default:
        return item.title;
    }
  };


  const getYear = () => {
    switch (type) {
      case 'movie':
        return item.release_year;
      case 'series':
        return item.first_air_date ? new Date(item.first_air_date).getFullYear() : item.release_year;
      case 'game':
        return item.release_date ? new Date(item.release_date).getFullYear() : item.release_year;
      case 'videogame':
        return item.release_date ? new Date(item.release_date).getFullYear() : item.release_year;
      case 'book':
        return item.first_publish_year || item.release_year;
      default:
        return item.release_year;
    }
  };


  const getNavigationPath = () => {
    switch (type) {
      case 'movie':
        return `/peliculas/${item.id}`;
      case 'series':
        return `/series/${item.id}`;
      case 'game':
        return `/juegos/${item.id}`;
      case 'videogame':
        return `/videojuegos/${item.id}`;
      case 'book':
        return `/libros/${item.id}`;
      default:
        return `/peliculas/${item.id}`;
    }
  };


  const getFallbackIcon = () => {
    switch (type) {
      case 'movie':
        return '🎬';
      case 'series':
        return '📺';
      case 'game':
        return '🎮';
      case 'videogame':
        return '🎮';
      case 'book':
        return '📚';
      default:
        return '🎬';
    }
  };


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
        <img 
          src={getImageUrl()} 
          alt={getTitle()}
          className="media-card__image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImages[type] || defaultImages.movie;
          }}
        />
        
        {/* Rating Badge */}
        {(type === 'book' ? (item.vote_average !== undefined && item.vote_average !== null) : !!item.vote_average) && (
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
