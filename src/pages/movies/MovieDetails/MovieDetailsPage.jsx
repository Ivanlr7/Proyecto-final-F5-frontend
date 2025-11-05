import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ReviewService from '../../../api/services/ReviewService';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock, Film, User, MessageSquare } from 'lucide-react';
import movieService from '../../../api/services/MovieService';
import MediaCard from '../../../components/MediaCard/MediaCard';
import MediaReviews from '../../../components/review/MediaReviews';
import Spinner from '../../../components/common/Spinner';
import TabButton from '../../../components/common/TabButton';
import './MovieDetailsPage.css';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const reviewService = new ReviewService();
  const { isAuthenticated, token } = useSelector(state => state.auth);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('detalles');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [suggestedMovies, setSuggestedMovies] = useState([]);
  const [suggestedLoading, setSuggestedLoading] = useState(false);
  const [suggestedError, setSuggestedError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

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


  useEffect(() => {
    const fetchSuggestions = async () => {
      if (activeTab !== 'sugerencias' || !id) return;
      setSuggestedLoading(true);
      setSuggestedError(null);
      try {
      
        const [similarRes, recRes] = await Promise.all([
          movieService.movieRepository.getSimilarMovies(id, 1),
          movieService.movieRepository.getMovieRecommendations(id, 1)
        ]);
        let results = [];
        if (similarRes.success && Array.isArray(similarRes.data.results)) {
          results = results.concat(movieService.processMovieList(similarRes.data.results));
        }
        if (recRes.success && Array.isArray(recRes.data.results)) {
   
          const recFiltered = movieService.processMovieList(recRes.data.results).filter(r => !results.some(s => s.id === r.id));
          results = results.concat(recFiltered);
        }
        setSuggestedMovies(results);
      } catch (err) {
        setSuggestedError('Error al cargar sugerencias');
      } finally {
        setSuggestedLoading(false);
      }
    };
    fetchSuggestions();
  }, [activeTab, id]);


  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const res = await reviewService.getReviewsByContent('MOVIE', id);
        if (res.success && Array.isArray(res.data)) {
          setReviews(res.data);
        } else {
          setReviewsError(res.error || 'Error al cargar reseñas');
        }
      } catch (err) {
        setReviewsError('Error al cargar reseñas');
      } finally {
        setReviewsLoading(false);
      }
    };
    if (id && activeTab === 'resenas') fetchReviews();
  }, [id, activeTab]);

  const handleGoBack = () => {
    navigate('/peliculas');
  };

  if (loading) {
    return (
      <div className="movies-page__loading">
        <Spinner size={48} />
        <p>Cargando detalles de la película...</p>
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
      {/* Hero Section */}
      <div 
        className="movie-details__hero"
        style={{
          backgroundImage: movie.backdrop_path ? `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})` : 'none'
        }}
      >
        <div className="movie-details__hero-overlay">
          <div className="movie-details__hero-content">
            <div className="movie-details__poster-container">
              {movie.poster_url || movie.poster_path ? (
                <img 
                  src={movie.poster_url || `https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title}
                  className="movie-details__poster"
                />
              ) : (
                <div className="movie-details__poster-fallback">
                  <Film size={80} />
                </div>
              )}
            </div>
            
            <div className="movie-details__info">
              <h1 className="movie-details__title">{movie.title}</h1>
              {movie.original_title && movie.original_title !== movie.title && (
                <p className="movie-details__original-title">"{movie.original_title}"</p>
              )}
              
              <div className="movie-details__meta">
                {movie.release_date && (
                  <div className="movie-details__meta-item">
                    <Calendar size={16} />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                )}
                
                {movie.runtime && (
                  <div className="movie-details__meta-item">
                    <Clock size={16} />
                    <span>{movie.runtime} min</span>
                  </div>
                )}
                
                {movie.vote_average && (
                  <div className="movie-details__rating">
                    <Star size={16} fill="currentColor" />
                    <span>{movie.vote_average.toFixed(1)}/10</span>
                  </div>
                )}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="movie-details__genres">
                  {movie.genres.map((genre) => (
                    <span key={genre.id} className="movie-details__genre">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {movie.tagline && (
                <p className="movie-details__tagline">"{movie.tagline}"</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="movie-details__tabs" style={{ marginTop: '2rem' }}>
        <TabButton active={activeTab === 'detalles'} onClick={() => setActiveTab('detalles')}>
          DETALLES
        </TabButton>
        <TabButton active={activeTab === 'resenas'} onClick={() => setActiveTab('resenas')}>
          RESEÑAS
        </TabButton>
        <TabButton active={activeTab === 'sugerencias'} onClick={() => setActiveTab('sugerencias')}>
          SUGERENCIAS
        </TabButton>
      </div>


      {/* Content */}
      <div className="movie-details__content">
        {activeTab === 'detalles' && (
          <div className="movie-details__tab-content">
            {/* Synopsis */}
            {movie.overview && (
              <section className="movie-details__section">
                <h2 className="movie-details__section-title">Sinopsis</h2>
                <p className="movie-details__overview">{movie.overview}</p>
              </section>
            )}

            {/* Director and Cast */}
            <section className="movie-details__section">
              <h2 className="movie-details__section-title">Director y Reparto</h2>
              <div className="movie-details__info-grid">
                {movie.credits?.crew?.find(person => person.job === 'Director') && (
                  <div className="movie-details__info-item">
                    <strong>Director:</strong>
                    <span>{movie.credits.crew.find(person => person.job === 'Director').name}</span>
                  </div>
                )}
                
                {movie.credits?.cast && movie.credits.cast.length > 0 && (
                  <div className="movie-details__info-item">
                    <strong>Reparto principal:</strong>
                    <span>{movie.credits.cast.slice(0, 5).map(actor => actor.name).join(', ')}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Additional Information */}
            <section className="movie-details__section">
              <h2 className="movie-details__section-title">Información Adicional</h2>
              <div className="movie-details__info-grid">
                {movie.status && (
                  <div className="movie-details__info-item">
                    <strong>Estado:</strong>
                    <span>{movie.status}</span>
                  </div>
                )}
                
                {movie.release_date && (
                  <div className="movie-details__info-item">
                    <strong>Fecha de estreno:</strong>
                    <span>{new Date(movie.release_date).toLocaleDateString('es-ES')}</span>
                  </div>
                )}

                {movie.budget && movie.budget > 0 && (
                  <div className="movie-details__info-item">
                    <strong>Presupuesto:</strong>
                    <span>${movie.budget.toLocaleString()}</span>
                  </div>
                )}

                {movie.revenue && movie.revenue > 0 && (
                  <div className="movie-details__info-item">
                    <strong>Recaudación:</strong>
                    <span>${movie.revenue.toLocaleString()}</span>
                  </div>
                )}

                {movie.original_language && (
                  <div className="movie-details__info-item">
                    <strong>Idioma original:</strong>
                    <span>{movie.original_language.toUpperCase()}</span>
                  </div>
                )}

                {movie.vote_count && (
                  <div className="movie-details__info-item">
                    <strong>Número de votos:</strong>
                    <span>{movie.vote_count.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Production Companies */}
            {movie.production_companies && movie.production_companies.length > 0 && (
              <section className="movie-details__section">
                <h2 className="movie-details__section-title">Productoras</h2>
                <div className="movie-details__companies">
                  {movie.production_companies.map((company) => (
                    <div key={company.id} className="movie-details__company">
                      {company.logo_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                          alt={company.name}
                          className="movie-details__company-logo"
                        />
                      ) : (
                        <div className="movie-details__company-name">
                          {company.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'resenas' && (
          <div className="movie-details__tab-content">

            <MediaReviews contentType="MOVIE" contentId={id} apiSource="TMDB" />
          </div>
        )}

        {activeTab === 'sugerencias' && (
          <div className="movie-details__tab-content">
            <section className="movie-details__section">
              <h2 className="movie-details__section-title">Sugerencias</h2>
              {suggestedLoading && <p>Cargando sugerencias...</p>}
              {suggestedError && <p className="error-message">{suggestedError}</p>}
              {!suggestedLoading && !suggestedError && suggestedMovies.length === 0 && (
                <p>No hay sugerencias disponibles para esta película.</p>
              )}
              <div className="movie-details__suggested-list">
                {suggestedMovies.map((item) => (
                  <MediaCard key={item.id} item={item} type="movie" className="suggested-card" />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;