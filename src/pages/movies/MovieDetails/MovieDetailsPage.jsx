import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock } from 'lucide-react';
import movieService from '../../../api/services/MovieService';
import './MovieDetailsPage.css';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await movieService.getMovieDetails(id);
        
        if (result.success && result.data) {
          setMovie(result.data);
        } else {
          setError(result.error || 'Error al cargar los detalles de la película');
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Error al cargar los detalles de la película');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate('/peliculas');
  };

  if (loading) {
    return (
      <div className="movie-details-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando detalles de la película...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-details-page">
        <div className="error-message">
          <p>❌ {error}</p>
          <button className="back-button" onClick={handleGoBack}>
            <ArrowLeft size={20} /> Volver
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details-page">
        <div className="error-message">
          <p>Película no encontrada</p>
          <button className="back-button" onClick={handleGoBack}>
            <ArrowLeft size={20} /> Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-details-page">
      <button className="back-button" onClick={handleGoBack}>
        <ArrowLeft size={20} /> Volver
      </button>
      
      <div className="movie-details-container">
        <div className="movie-poster-section">
          <img 
            src={movie.poster_url || movie.poster_path} 
            alt={movie.title}
            className="movie-poster"
          />
        </div>

        <div className="movie-info-section">
          <h1 className="movie-title">{movie.title}</h1>
          
          <div className="movie-meta-inline">
            <span className="meta-year">
              <Calendar size={16} />
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </span>
            <span className="meta-duration">
              <Clock size={16} />
              {movie.runtime ? `${movie.runtime} min` : 'N/A'}
            </span>
            <span className="meta-genres">
              {movie.genres && movie.genres.length > 0 ? (
                movie.genres.map(genre => genre.name).join(', ')
              ) : (
                'Sin género'
              )}
            </span>
          </div>

          <div className="rating-section">
            <div className="rating-stars">
              {[...Array(10)].map((_, index) => {
                const rating = movie.vote_average ? movie.vote_average : 0;
                const isFilled = index < Math.floor(rating);
                const isHalf = index === Math.floor(rating) && rating % 1 >= 0.5;
                
                return (
                  <Star 
                    key={index} 
                    size={20} 
                    className={`star ${isFilled ? 'filled' : ''} ${isHalf ? 'half' : ''}`}
                    fill={isFilled || isHalf ? 'currentColor' : 'none'}
                  />
                );
              })}
              <span className="rating-text">
                {movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'} / 10.0
              </span>
            </div>
          </div>

          <div className="movie-section">
            <h2 className="section-title">Sinopsis</h2>
            <p className="synopsis-text">
              {movie.overview || 'No hay sinopsis disponible.'}
            </p>
          </div>

          <div className="movie-details-info">
            <div className="info-row">
              <span className="info-label">Director:</span>
              <span className="info-value">
                {movie.credits?.crew?.find(person => person.job === 'Director')?.name || 'No disponible'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Reparto:</span>
              <span className="info-value">
                {movie.credits?.cast?.slice(0, 3).map(actor => actor.name).join(', ') || 'No disponible'}
              </span>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-primary">Escribir Reseña</button>
            <button className="btn-secondary">Agregar a Favoritos</button>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h2 className="reviews-title">Reseñas de Usuarios</h2>
          <span className="reviews-count">4 reseñas</span>
        </div>
        
        <div className="review-card">
          <div className="review-header">
            <div className="reviewer-info">
              <div className="reviewer-avatar">UP</div>
              <div className="reviewer-details">
                <span className="reviewer-name">Usuario Prueba</span>
                <span className="review-date">Hace 2 días</span>
              </div>
            </div>
            <div className="review-rating">
              {[...Array(5)].map((_, index) => (
                <Star key={index} size={16} className="star filled" fill="currentColor" />
              ))}
              <span className="review-rating-text">5.0</span>
            </div>
          </div>
          <h3 className="review-title">Una obra maestra del cine moderno</h3>
          <p className="review-content">
            Esta película supera todas las expectativas. La dirección es impecable, la cinematografía es absolutamente impresionante y las actuaciones son de primer nivel. Cada escena está...
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;