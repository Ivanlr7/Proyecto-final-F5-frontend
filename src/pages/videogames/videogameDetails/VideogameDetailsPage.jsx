import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import VideogameService from '../../../api/services/VideogameService';
import MediaCard from '../../../components/MediaCard';
import { Star, Calendar, Clock, User, MessageSquare, Gamepad2 } from 'lucide-react';
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
      <div className="videogame-details-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando detalles del videojuego...</p>
        </div>
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

  // backdrop_url y poster_url ya vienen formateados desde el Service
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
      <div className="videogame-details__tabs">
        <button 
          className={`videogame-details__tab ${activeTab === 'detalles' ? 'active' : ''}`}
          onClick={() => setActiveTab('detalles')}
        >
          DETALLES
        </button>
        <button 
          className={`videogame-details__tab ${activeTab === 'resenas' ? 'active' : ''}`}
          onClick={() => setActiveTab('resenas')}
        >
          RESEÑAS
        </button>
        <button 
          className={`videogame-details__tab ${activeTab === 'sugerencias' ? 'active' : ''}`}
          onClick={() => setActiveTab('sugerencias')}
        >
          SUGERENCIAS
        </button>
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
            {/* Write Review Section */}
            <section className="videogame-details__section">
              <div className="videogame-details__review-actions">
                <button className="videogame-details__write-review-btn">
                  <MessageSquare size={20} />
                  Escribir Reseña
                </button>
                <button className="videogame-details__add-favorites-btn">
                  <Star size={20} />
                  Agregar a Favoritos
                </button>
              </div>
            </section>

            {/* Reviews Section */}
            <section className="videogame-details__section">
              <h2 className="videogame-details__section-title">
                Reseñas de Usuarios
                <span className="videogame-details__reviews-count">4 reseñas</span>
              </h2>
              
              <div className="videogame-details__reviews">
                {/* Sample Review 1 */}
                <div className="videogame-details__review">
                  <div className="videogame-details__review-header">
                    <div className="videogame-details__reviewer">
                      <div className="videogame-details__reviewer-avatar">
                        <User size={24} />
                      </div>
                      <div className="videogame-details__reviewer-info">
                        <h4>Usuario Prueba</h4>
                        <span>Hace 2 días</span>
                      </div>
                    </div>
                    <div className="videogame-details__review-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={16} 
                          fill="currentColor" 
                          className="star-filled"
                        />
                      ))}
                      <span>5.0</span>
                    </div>
                  </div>
                  <h3 className="videogame-details__review-title">Una obra maestra</h3>
                  <p className="videogame-details__review-content">
                    Este juego supera todas las expectativas. La jugabilidad es impecable, los gráficos son absolutamente impresionantes y la historia es de primer nivel. Cada momento está...
                  </p>
                </div>

                {/* Sample Review 2 */}
                <div className="videogame-details__review">
                  <div className="videogame-details__review-header">
                    <div className="videogame-details__reviewer">
                      <div className="videogame-details__reviewer-avatar">
                        <User size={24} />
                      </div>
                      <div className="videogame-details__reviewer-info">
                        <h4>Gamer123</h4>
                        <span>Hace 1 semana</span>
                      </div>
                    </div>
                    <div className="videogame-details__review-rating">
                      {[1, 2, 3, 4].map((star) => (
                        <Star 
                          key={star} 
                          size={16} 
                          fill="currentColor" 
                          className="star-filled"
                        />
                      ))}
                      <Star size={16} className="star-empty" />
                      <span>4.0</span>
                    </div>
                  </div>
                  <h3 className="videogame-details__review-title">Excelente juego con algunos altibajos</h3>
                  <p className="videogame-details__review-content">
                    Un juego muy sólido en general. Los personajes están bien desarrollados y la jugabilidad es interesante, aunque hay algunas mecánicas que se sienten un poco lentas...
                  </p>
                </div>

                {/* Sample Review 3 */}
                <div className="videogame-details__review">
                  <div className="videogame-details__review-header">
                    <div className="videogame-details__reviewer">
                      <div className="videogame-details__reviewer-avatar">
                        <User size={24} />
                      </div>
                      <div className="videogame-details__reviewer-info">
                        <h4>GameAdicto</h4>
                        <span>Hace 2 semanas</span>
                      </div>
                    </div>
                    <div className="videogame-details__review-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={16} 
                          fill="currentColor" 
                          className="star-filled"
                        />
                      ))}
                      <span>5.0</span>
                    </div>
                  </div>
                  <h3 className="videogame-details__review-title">Absolutamente increíble</h3>
                  <p className="videogame-details__review-content">
                    No puedo decir lo suficiente sobre este juego. Desde el primer minuto me tuvo enganchado. La calidad de producción es espectacular...
                  </p>
                </div>
              </div>
            </section>
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
