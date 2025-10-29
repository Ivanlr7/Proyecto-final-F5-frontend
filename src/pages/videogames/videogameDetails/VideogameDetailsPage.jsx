import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import VideogameService from '../../../api/services/VideogameService';
import MediaCard from '../../../components/MediaCard';
import MediaReviews from '../../../components/review/MediaReviews';
import { Star, Calendar, Clock, User, MessageSquare, Gamepad2 } from 'lucide-react';
import TabButton from '../../../components/common/TabButton';
import Spinner from '../../../components/common/Spinner';
import './VideogameDetailsPage.css';

const VideogameDetailsPage = () => {
  const { id } = useParams();
  const [videogame, setVideogame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('detalles');
  const [suggestedVideogames, setSuggestedVideogames] = useState([]);
  const [suggestedLoading, setSuggestedLoading] = useState(false);
  const [suggestedError, setSuggestedError] = useState(null);

  const fetchVideogameDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await VideogameService.getGameById(id);
      setVideogame(data);
    } catch (err) {
      console.error('Error fetching videogame details:', err);
      setError('Error al cargar los detalles del videojuego.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchSuggestedVideogames = useCallback(async () => {
    try {
      setSuggestedLoading(true);
      setSuggestedError(null);
      const data = await VideogameService.getSimilarGames(id);
      setSuggestedVideogames(data);
    } catch (err) {
      console.error('Error fetching suggested videogames:', err);
      setSuggestedError('Error al cargar las sugerencias.');
    } finally {
      setSuggestedLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVideogameDetails();
  }, [fetchVideogameDetails]);

  useEffect(() => {
    if (activeTab === 'sugerencias' && videogame) {
      fetchSuggestedVideogames();
    }
  }, [activeTab, videogame, fetchSuggestedVideogames]);

  if (loading) {
    return (
      <div className="videogames-page__loading">
        <Spinner size={48} />
        <p>Cargando detalles del videojuego...</p>
      </div>
    );
  }

  if (error || !videogame) {
    return (
      <div className="videogame-details-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'No se pudo cargar el videojuego.'}</p>
          <button onClick={() => window.history.back()} className="back-button">
            Volver
          </button>
        </div>
      </div>
    );
  }

 
  const backdropUrl = videogame.backdrop_url || 
    (videogame.backdrop_path ? VideogameService.getImageUrl(videogame.backdrop_path, '1080p') : null);

  const posterUrl = videogame.poster_url || 
    (videogame.poster_path ? VideogameService.getImageUrl(videogame.poster_path, 'cover_big') : null);

  return (
    <div className="videogame-details-page">
      {/* Hero Section */}
      <div 
        className="videogame-details__hero"
        style={{
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none'
        }}
      >
        <div className="videogame-details__hero-overlay">
          <div className="videogame-details__hero-content">
            <div className="videogame-details__poster-container">
              {posterUrl ? (
                <img 
                  src={posterUrl} 
                  alt={videogame.name}
                  className="videogame-details__poster"
                />
              ) : (
                <div className="videogame-details__poster-fallback">
                  <Gamepad2 size={80} />
                </div>
              )}
            </div>

            <div className="videogame-details__info">
              <h1 className="videogame-details__title">{videogame.name}</h1>
              
              {videogame.original_title && videogame.original_title !== videogame.name && (
                <p className="videogame-details__original-title">"{videogame.original_title}"</p>
              )}

              <div className="videogame-details__meta">
                {videogame.release_date && (
                  <div className="videogame-details__meta-item">
                    <Calendar size={16} />
                    <span>{new Date(videogame.release_date).getFullYear()}</span>
                  </div>
                )}
                
                {videogame.vote_average && (
                  <div className="videogame-details__rating">
                    <Star size={16} fill="currentColor" />
                    <span>{videogame.formatted_vote_average || videogame.vote_average.toFixed(1)}/10</span>
                  </div>
                )}
              </div>

              {videogame.genres && videogame.genres.length > 0 && (
                <div className="videogame-details__genres">
                  {videogame.genres.map((genre) => (
                    <span key={genre.id} className="videogame-details__genre">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {videogame.tagline && (
                <p className="videogame-details__tagline">"{videogame.tagline}"</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="videogame-details__tabs" style={{ marginTop: '2rem' }}>
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
      <div className="videogame-details__content">
        {activeTab === 'detalles' && (
          <div className="videogame-details__tab-content">
            {/* Synopsis */}
            {videogame.overview && (
              <section className="videogame-details__section">
                <h2 className="videogame-details__section-title">Sinopsis</h2>
                <p className="videogame-details__overview">{videogame.overview}</p>
              </section>
            )}

            {/* Developers and Publishers */}
            {(videogame.developers?.length > 0 || videogame.publishers?.length > 0) && (
              <section className="videogame-details__section">
                <h2 className="videogame-details__section-title">Desarrolladores y Editores</h2>
                <div className="videogame-details__info-grid">
                  {videogame.developers?.length > 0 && (
                    <div className="videogame-details__info-item">
                      <strong>Desarrolladores:</strong>
                      <span>{videogame.developers.join(', ')}</span>
                    </div>
                  )}
                  
                  {videogame.publishers?.length > 0 && (
                    <div className="videogame-details__info-item">
                      <strong>Editores:</strong>
                      <span>{videogame.publishers.join(', ')}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Additional Information */}
            <section className="videogame-details__section">
              <h2 className="videogame-details__section-title">Información Adicional</h2>
              <div className="videogame-details__info-grid">
                {videogame.release_date && (
                  <div className="videogame-details__info-item">
                    <strong>Fecha de lanzamiento:</strong>
                    <span>{new Date(videogame.release_date).toLocaleDateString('es-ES')}</span>
                  </div>
                )}

                {videogame.platforms && videogame.platforms.length > 0 && (
                  <div className="videogame-details__info-item">
                    <strong>Plataformas:</strong>
                    <span>{videogame.platforms.map(p => p.name).join(', ')}</span>
                  </div>
                )}

                {videogame.game_modes && videogame.game_modes.length > 0 && (
                  <div className="videogame-details__info-item">
                    <strong>Modos de juego:</strong>
                    <span>{videogame.game_modes.map(m => m.name).join(', ')}</span>
                  </div>
                )}

                {videogame.player_perspectives && videogame.player_perspectives.length > 0 && (
                  <div className="videogame-details__info-item">
                    <strong>Perspectivas:</strong>
                    <span>{videogame.player_perspectives.map(p => p.name).join(', ')}</span>
                  </div>
                )}

                {videogame.rating_count && (
                  <div className="videogame-details__info-item">
                    <strong>Número de votos:</strong>
                    <span>{videogame.rating_count.toLocaleString()}</span>
                  </div>
                )}

                {videogame.aggregated_rating && (
                  <div className="videogame-details__info-item">
                    <strong>Puntuación de críticos:</strong>
                    <span>{(videogame.aggregated_rating / 10).toFixed(1)}/10</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'resenas' && (
          <div className="videogame-details__tab-content">
           <MediaReviews contentType="GAME" contentId={id} apiSource="IGDB" />
          </div>
        )}

        {activeTab === 'sugerencias' && (
          <div className="videogame-details__tab-content">
            <section className="videogame-details__section">
              <h2 className="videogame-details__section-title">Sugerencias</h2>
              {suggestedLoading && <p>Cargando sugerencias...</p>}
              {suggestedError && <p className="error-message">{suggestedError}</p>}
              {!suggestedLoading && !suggestedError && suggestedVideogames.length === 0 && (
                <p>No hay sugerencias disponibles para este videojuego.</p>
              )}
              <div className="videogame-details__suggested-list" style={{display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'flex-start'}}>
                {suggestedVideogames.map((item) => (
                  <MediaCard key={item.id} item={item} type="videogame" className="suggested-card" />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideogameDetailsPage;
