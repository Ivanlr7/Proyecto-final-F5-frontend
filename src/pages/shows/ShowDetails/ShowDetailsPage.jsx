import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock, Tv, User, MessageSquare } from 'lucide-react';
import showService from '../../../api/services/ShowService';
import './ShowDetailsPage.css';
import MediaCard from '../../../components/MediaCard/MediaCard';
import MediaReviews from '../../../components/review/MediaReviews';
import Spinner from '../../../components/common/Spinner';

const ShowDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('detalles');
  const [suggestedShows, setSuggestedShows] = useState([]);
  const [suggestedLoading, setSuggestedLoading] = useState(false);
  const [suggestedError, setSuggestedError] = useState(null);

  // Cargar sugerencias al cambiar a la pestaña
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (activeTab !== 'sugerencias' || !id) return;
      setSuggestedLoading(true);
      setSuggestedError(null);
      try {
        // Obtener similares y recomendaciones en paralelo
        const [similarRes, recRes] = await Promise.all([
          showService.showRepository.getSimilarShows(id, 1),
          showService.showRepository.getShowRecommendations(id, 1)
        ]);
        let results = [];
        if (similarRes.success && Array.isArray(similarRes.data.results)) {
          results = results.concat(showService.processShowList(similarRes.data.results));
        }
        if (recRes.success && Array.isArray(recRes.data.results)) {
          // Evitar duplicados por id
          const recFiltered = showService.processShowList(recRes.data.results).filter(r => !results.some(s => s.id === r.id));
          results = results.concat(recFiltered);
        }
        setSuggestedShows(results);
      } catch (err) {
        setSuggestedError('Error al cargar sugerencias');
      } finally {
        setSuggestedLoading(false);
      }
    };
    fetchSuggestions();
  }, [activeTab, id]);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await showService.getShowDetails(id);
        
        if (result.success && result.data) {
          setShow(result.data);
        } else {
          setError(result.error || 'Error al cargar los detalles de la serie');
        }
      } catch (err) {
        console.error('Error fetching show details:', err);
        setError('Error al cargar los detalles de la serie');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShowDetails();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate('/series');
  };

  if (loading) {
    return (
      <div className="shows-page__loading">
        <Spinner size={48} />
        <p>Cargando detalles de la serie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="show-details-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleGoBack} className="back-button">
            Volver a Series
          </button>
        </div>
        {activeTab === 'sugerencias' && (
          <div className="show-details__tab-content">
            <section className="show-details__section">
              <h2 className="show-details__section-title">Sugerencias</h2>
              {suggestedLoading && <p>Cargando sugerencias...</p>}
              {suggestedError && <p className="error-message">{suggestedError}</p>}
              {!suggestedLoading && !suggestedError && suggestedShows.length === 0 && (
                <p>No hay sugerencias disponibles para esta serie.</p>
              )}
              <div className="show-details__suggested-list" style={{display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'flex-start'}}>
                {suggestedShows.map((item) => (
                  <MediaCard key={item.id} item={item} type="series" className="suggested-card" />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    );
  }

  if (!show) {
    return (
      <div className="show-details-page">
        <div className="error-container">
          <h2>Serie no encontrada</h2>
          <p>No se pudo encontrar la información de esta serie.</p>
          <button onClick={handleGoBack} className="back-button">
            Volver a Series
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="show-details-page">
      {/* Header with back button */}

      {/* Hero Section */}
      <div 
        className="show-details__hero"
        style={{
          backgroundImage: show.backdrop_url ? `url(${show.backdrop_url})` : 'none'
        }}
      >
        <div className="show-details__hero-overlay">
          <div className="show-details__hero-content">
            <div className="show-details__poster-container">
              {show.poster_url ? (
                <img 
                  src={show.poster_url} 
                  alt={show.name}
                  className="show-details__poster"
                />
              ) : (
                <div className="show-details__poster-fallback">
                  <Tv size={80} />
                </div>
              )}
            </div>
            
            <div className="show-details__info">
              <h1 className="show-details__title">{show.name}</h1>
              {show.original_name && show.original_name !== show.name && (
                <p className="show-details__original-title">"{show.original_name}"</p>
              )}
              
              <div className="show-details__meta">
                {show.first_air_year && (
                  <div className="show-details__meta-item">
                    <Calendar size={16} />
                    <span>{show.first_air_year}</span>
                  </div>
                )}
                
                {show.number_of_seasons && (
                  <div className="show-details__meta-item">
                    <Tv size={16} />
                    <span>{show.number_of_seasons} temporada{show.number_of_seasons !== 1 ? 's' : ''}</span>
                  </div>
                )}

                {show.number_of_episodes && (
                  <div className="show-details__meta-item">
                    <Clock size={16} />
                    <span>{show.number_of_episodes} episodios</span>
                  </div>
                )}
                
                {show.vote_average && (
                  <div className="show-details__rating">
                    <Star size={16} fill="currentColor" />
                    <span>{show.formatted_vote_average || show.vote_average.toFixed(1)}/10</span>
                  </div>
                )}
              </div>

              {show.genres && show.genres.length > 0 && (
                <div className="show-details__genres">
                  {show.genres.map((genre) => (
                    <span key={genre.id} className="show-details__genre">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {show.tagline && (
                <p className="show-details__tagline">"{show.tagline}"</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="show-details__tabs">
        <button 
          className={`show-details__tab ${activeTab === 'detalles' ? 'active' : ''}`}
          onClick={() => setActiveTab('detalles')}
        >
          DETALLES
        </button>
        <button 
          className={`show-details__tab ${activeTab === 'resenas' ? 'active' : ''}`}
          onClick={() => setActiveTab('resenas')}
        >
          RESEÑAS
        </button>
        <button 
          className={`show-details__tab ${activeTab === 'sugerencias' ? 'active' : ''}`}
          onClick={() => setActiveTab('sugerencias')}
        >
          SUGERENCIAS
        </button>
      </div>

      {/* Content */}
      <div className="show-details__content">
        {activeTab === 'detalles' && (
          <div className="show-details__tab-content">
            {/* Synopsis */}
            {show.overview && (
              <section className="show-details__section">
                <h2 className="show-details__section-title">Sinopsis</h2>
                <p className="show-details__overview">{show.overview}</p>
              </section>
            )}

            {/* Additional Information */}
            <section className="show-details__section">
              <h2 className="show-details__section-title">Información Adicional</h2>
              <div className="show-details__info-grid">
                {show.status && (
                  <div className="show-details__info-item">
                    <strong>Estado:</strong>
                    <span>{show.status}</span>
                  </div>
                )}
                
                {show.first_air_date && (
                  <div className="show-details__info-item">
                    <strong>Fecha de estreno:</strong>
                    <span>{new Date(show.first_air_date).toLocaleDateString('es-ES')}</span>
                  </div>
                )}

                {show.last_air_date && (
                  <div className="show-details__info-item">
                    <strong>Último episodio:</strong>
                    <span>{new Date(show.last_air_date).toLocaleDateString('es-ES')}</span>
                  </div>
                )}

                {show.networks && show.networks.length > 0 && (
                  <div className="show-details__info-item">
                    <strong>Cadenas:</strong>
                    <span>{show.networks.map(network => network.name).join(', ')}</span>
                  </div>
                )}

                {show.origin_country && show.origin_country.length > 0 && (
                  <div className="show-details__info-item">
                    <strong>País de origen:</strong>
                    <span>{show.origin_country.join(', ')}</span>
                  </div>
                )}

                {show.original_language && (
                  <div className="show-details__info-item">
                    <strong>Idioma original:</strong>
                    <span>{show.original_language.toUpperCase()}</span>
                  </div>
                )}

                {show.episode_run_time && show.episode_run_time.length > 0 && (
                  <div className="show-details__info-item">
                    <strong>Duración por episodio:</strong>
                    <span>{show.episode_run_time.join(', ')} min</span>
                  </div>
                )}

                {show.vote_count && (
                  <div className="show-details__info-item">
                    <strong>Número de votos:</strong>
                    <span>{show.vote_count.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Created By */}
            {show.created_by && show.created_by.length > 0 && (
              <section className="show-details__section">
                <h2 className="show-details__section-title">Creadores</h2>
                <div className="show-details__creators">
                  {show.created_by.map((creator, index) => (
                    <div key={index} className="show-details__creator">
                      {creator.profile_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w200${creator.profile_path}`}
                          alt={creator.name}
                          className="show-details__creator-photo"
                        />
                      ) : (
                        <div className="show-details__creator-photo-fallback">
                          {creator.name.charAt(0)}
                        </div>
                      )}
                      <div className="show-details__creator-info">
                        <h3>{creator.name}</h3>
                        <p>Creador</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Production Companies */}
            {show.production_companies && show.production_companies.length > 0 && (
              <section className="show-details__section">
                <h2 className="show-details__section-title">Productoras</h2>
                <div className="show-details__companies">
                  {show.production_companies.map((company) => (
                    <div key={company.id} className="show-details__company">
                      {company.logo_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                          alt={company.name}
                          className="show-details__company-logo"
                        />
                      ) : (
                        <div className="show-details__company-name">
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
          <div className="show-details__tab-content">
{/*       
            <section className="show-details__section">
              <div className="show-details__review-actions">
                <button className="show-details__write-review-btn">
                  <MessageSquare size={20} />
                  Escribir Reseña
                </button>
                <button className="show-details__add-favorites-btn">
                  <Star size={20} />
                  Agregar a Favoritos
                </button>
              </div>
            </section>

            <section className="show-details__section">
       
              
              <div className="show-details__reviews">
               
              </div>
            </section> */}
            <MediaReviews contentType="SERIES" contentId={id} apiSource="TMDB" />
          </div>
        )}

        {activeTab === 'sugerencias' && (
          <div className="show-details__tab-content">
            <section className="show-details__section">
              <h2 className="show-details__section-title">Sugerencias</h2>
              {suggestedLoading && <p>Cargando sugerencias...</p>}
              {suggestedError && <p className="error-message">{suggestedError}</p>}
              {!suggestedLoading && !suggestedError && suggestedShows.length === 0 && (
                <p>No hay sugerencias disponibles para esta serie.</p>
              )}
              <div className="show-details__suggested-list" style={{display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'flex-start'}}>
                {suggestedShows.map((item) => (
                  <MediaCard key={item.id} item={item} type="series" className="suggested-card" />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowDetailsPage;