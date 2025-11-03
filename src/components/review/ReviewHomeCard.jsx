import { Star, User, Calendar } from "lucide-react";
import { ImageWithFallback } from "../common/ImageWithFallback";
import Avatar from "../common/Avatar";
import { useNavigate } from "react-router-dom";
import "./ReviewHomeCard.css";


export default function ReviewHomeCard({ 

  title, 
  description, 
  imageUrl, 
  rating, 
  category,

  review,
  onClick
}) {
  const navigate = useNavigate();


  const displayData = review ? {
    title: review.contentTitle || review.title || review.movieTitle || review.seriesTitle || review.gameTitle || review.bookTitle || 'Sin título',
    description: review.reviewText || review.description || review.text || '',
    reviewTitle: review.reviewTitle || 'Sin título de reseña',
    imageUrl: review.contentImageUrl || review.imageUrl || review.posterPath || review.image || '',
    rating: review.rating || 0,
    category: review.contentType || review.category || review.type || '',
    userName: review.userName || review.username || review.user?.userName || 'Usuario',
    userImage: review.userProfileImageUrl || review.profileImage || review.user?.profileImage || null,
    createdAt: review.createdAt || review.created_at || null,
    contentId: review.contentId || review.id,
    contentType: review.contentType || review.type,
    apiSource: review.apiSource || 'TMDB'
  } : {
    title,
    description,
    reviewTitle: null,
    imageUrl,
    rating,
    category,
    userName: null,
    userImage: null,
    createdAt: null,
    contentId: null,
    contentType: null,
    apiSource: null
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`review-card__star ${
          i < rating ? "review-card__star--filled" : "review-card__star--empty"
        }`}
      />
    ));
  };

  const getCategoryClass = () => {
    const cat = displayData.category?.toUpperCase();
    if (cat === "PELÍCULA" || cat === "MOVIE") return "review-card__category--movie";
    if (cat === "SERIE" || cat === "SHOW" || cat === "SERIES") return "review-card__category--series";
    if (cat === "VIDEOJUEGO" || cat === "GAME") return "review-card__category--game";
    if (cat === "LIBRO" || cat === "BOOK") return "review-card__category--book";
    return "";
  };

  const getCategoryDisplay = () => {
    const cat = displayData.category?.toUpperCase();
    if (cat === "MOVIE") return "PELÍCULA";
    if (cat === "SHOW" || cat === "SERIES") return "SERIE";
    if (cat === "GAME") return "VIDEOJUEGO";
    if (cat === "BOOK") return "LIBRO";
    return displayData.category;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
  };

  const handleClick = () => {
    if (onClick) {
      onClick(review || displayData);
    } else if (displayData.contentType && displayData.contentId) {
    
      const typeMap = {
        'MOVIE': 'peliculas',
        'SHOW': 'series',
        'SERIES': 'series',
        'GAME': 'videojuegos',
        'VIDEOGAME': 'videojuegos',
        'BOOK': 'libros'
      };
      const path = typeMap[displayData.contentType.toUpperCase()];
      if (path) {
        navigate(`/${path}/${displayData.contentId}`);
      }
    }
  };


  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div 
      className={`review-card ${displayData.contentId ? 'review-card--clickable' : ''}`}
      onClick={handleClick}
    >
      <div className="review-card__wrapper">
        <div className="review-card__image-container">
          <ImageWithFallback
            src={displayData.imageUrl}
            alt={displayData.title}
            className="review-card__image"
          />
          <div className="review-card__gradient" />
        </div>
        
        <div className="review-card__content">
          <div className="review-card__header">
            <span className={`review-card__category ${getCategoryClass()}`}>
              {getCategoryDisplay()}
            </span>
            <div className="review-card__rating">
              {renderStars(displayData.rating)}
            </div>
          </div>
          
          <h3 className="review-card__title">{displayData.title}</h3>
          <p className="review-card__description">
            {review ? (displayData.reviewTitle ? `"${displayData.reviewTitle}"` : truncateText(displayData.description, 150)) : displayData.description}
          </p>

          {/* Mostrar info de usuario solo si es una review real */}
          {displayData.userName && (
            <div className="review-card__user-info">
              <div className="review-card__user">
                <Avatar
                  image={displayData.userImage}
                  name={displayData.userName}
                  size={32}
                />
                <span className="review-card__username">{displayData.userName}</span>
              </div>
              {displayData.createdAt && (
                <div className="review-card__date">
                  <Calendar size={14} />
                  <span>{formatDate(displayData.createdAt)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}