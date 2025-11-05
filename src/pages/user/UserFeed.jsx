import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './UserFeed.css';
import ReviewHomeCard from '../../components/review/ReviewHomeCard';
import ReviewService from '../../api/services/ReviewService';
import ListService from '../../api/services/ListService';
import MovieService from '../../api/services/MovieService';
import ShowService from '../../api/services/ShowService';
import BookService from '../../api/services/BookService';
import VideogameService from '../../api/services/VideogameService';
import Spinner from '../../components/common/Spinner';
import Avatar from '../../components/common/Avatar';
import EditButton from '../../components/common/EditButton';
import DeleteButton from '../../components/common/DeleteButton';
import Modal from '../../components/common/Modal';

const reviewService = new ReviewService();
const listService = new ListService();

const UserFeed = () => {
  const { user, token, isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const [userReviews, setUserReviews] = useState([]);
  const [userLists, setUserLists] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingLists, setLoadingLists] = useState(true);

  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'alert',
    title: '',
    message: '',
    onConfirm: null
  });

  // Función para mostrar modal
  const showModalMessage = (type, title, message, onConfirm = null) => {
    setModalConfig({ type, title, message, onConfirm });
    setShowModal(true);
  };

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Cargar reviews del usuario
  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!user || !token) return;
      
      try {
        setLoadingReviews(true);

        const result = await reviewService.getAllReviews();
        
        if (result.success && Array.isArray(result.data)) {
          // Filtrar solo las reviews del usuario actual
          const currentUserId = user.userId || user.id;
          const filteredReviews = result.data.filter(
            review => String(review.userId || review.idUser) === String(currentUserId)
          );

          // Enriquecer con datos de contenido
          const enrichedReviews = await Promise.all(
            filteredReviews.map(async (review) => {
              try {
                let contentData = null;
                const contentType = review.contentType?.toUpperCase();
                const contentId = review.contentId;

                if (!contentId || !contentType) return review;

                if (contentType === 'MOVIE') {
                  const movieResult = await MovieService.getMovieDetails(contentId);
                  if (movieResult?.data) {
                    contentData = {
                      contentTitle: movieResult.data.title,
                      contentImageUrl: movieResult.data.backdrop_path 
                        ? `https://image.tmdb.org/t/p/w1280${movieResult.data.backdrop_path}`
                        : (movieResult.data.poster_path 
                          ? `https://image.tmdb.org/t/p/w500${movieResult.data.poster_path}`
                          : '')
                    };
                  }
                } else if (contentType === 'SHOW' || contentType === 'SERIES') {
                  const showResult = await ShowService.getShowDetails(contentId);
                  if (showResult?.data) {
                    contentData = {
                      contentTitle: showResult.data.name,
                      contentImageUrl: showResult.data.backdrop_path 
                        ? `https://image.tmdb.org/t/p/w1280${showResult.data.backdrop_path}`
                        : (showResult.data.poster_path 
                          ? `https://image.tmdb.org/t/p/w500${showResult.data.poster_path}`
                          : '')
                    };
                  }
                } else if (contentType === 'GAME' || contentType === 'VIDEOGAME') {
                  const gameResult = await VideogameService.getGameById(contentId);
                  if (gameResult) {
                    contentData = {
                      contentTitle: gameResult.name || 'Videojuego',
                      contentImageUrl: gameResult.backdrop_url || gameResult.screenshot_url || gameResult.cover_url || ''
                    };
                  }
                } else if (contentType === 'BOOK') {
                  const bookResult = await BookService.getBookById(contentId);
                  if (bookResult) {
                    contentData = {
                      contentTitle: bookResult.title || 'Libro',
                      contentImageUrl: bookResult.backdrop_url || bookResult.cover_url || ''
                    };
                  }
                }

                return contentData ? { ...review, ...contentData } : review;
              } catch (error) {
                console.error('Error enriqueciendo review:', error);
                return review;
              }
            })
          );

          setUserReviews(enrichedReviews);
        }
      } catch (error) {
        console.error('Error cargando reviews del usuario:', error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchUserReviews();
  }, [user, token]);

  // Carga las listas del usuario autenticado
  useEffect(() => {
    const fetchUserLists = async () => {
      if (!user || !token) return;

      try {
        setLoadingLists(true);
        const res = await listService.getAllLists();
        
        if (res.success) {
          // Filtra solo las listas del usuario actual
          const currentUserId = user.userId || user.id;
          const filteredLists = res.data.filter(
            list => String(list.userId || list.idUser) === String(currentUserId)
          );

          const listsDetails = await Promise.all(filteredLists.map(async (list) => {
            if (list.items && list.items.length > 0) {
              const fetchers = list.items.slice(0, 4).map(async (item) => {
                const type = (item.contentType || '').toLowerCase();
                const contentId = item.contentId;
                try {
                  if (type === 'movie') {
                    const r = await MovieService.getMovieDetails(contentId);
                    return { ...r.data, type: 'movie' };
                  } else if (type === 'series') {
                    const r = await ShowService.getShowDetails(contentId);
                    return { ...r.data, type: 'series' };
                  } else if (type === 'book') {
                    const r = await BookService.getBookById ? await BookService.getBookById(contentId) : null;
                    return r ? { ...r, type: 'book' } : { id: contentId, type: 'book' };
                  } else if (type === 'game' || type === 'videogame') {
                    const r = await VideogameService.getGameById(contentId);
                    return { ...r, type: 'videogame' };
                  } else {
                    return { id: contentId, type };
                  }
                } catch {
                  return { id: contentId, type };
                }
              });
              const details = await Promise.all(fetchers);
              return { ...list, detailedItems: details };
            } else {
              return { ...list, detailedItems: [] };
            }
          }));
          
          setUserLists(listsDetails);
        }
      } catch (error) {
        console.error('Error cargando listas del usuario:', error);
      } finally {
        setLoadingLists(false);
      }
    };

    fetchUserLists();
  }, [user, token]);

  const handleEditList = (list) => {
    navigate('/listas/crear', { state: { editingList: list } });
  };

  const handleDeleteList = async (listId) => {
    showModalMessage(
      'confirm',
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar esta lista? Esta acción no se puede deshacer.',
      async () => {
        const res = await listService.deleteList(listId, token);
        if (res.success) {
          setUserLists(prev => prev.filter(list => (list.idList || list.id) !== listId));
          showModalMessage('alert', 'Éxito', 'Lista eliminada correctamente');
        } else {
          showModalMessage('error', 'Error', res.error || 'Error al eliminar la lista');
        }
      }
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="user-feed">
      <div className="user-feed__container">
        <h1 className="user-feed__title">Mi Actividad</h1>

        {/* Sección de Reviews */}
        <section className="user-feed__section">
          <h2 className="user-feed__section-title">Mis Reseñas</h2>
          
          {loadingReviews ? (
            <div className="user-feed__loading">
              <Spinner size={60} />
            </div>
          ) : userReviews.length === 0 ? (
            <div className="user-feed__empty">
              <p>Aún no has creado ninguna reseña</p>
              <p className="user-feed__empty-subtitle">Explora contenido y comparte tu opinión</p>
            </div>
          ) : (
            <div className="user-feed__reviews-grid">
              {userReviews.map((review) => (
                <ReviewHomeCard
                  key={review.idReview}
                  review={review}
                />
              ))}
            </div>
          )}
        </section>

        {/* Sección de Listas */}
        <section className="user-feed__section">
          <h2 className="user-feed__section-title">Mis Listas</h2>

          {loadingLists ? (
            <div className="user-feed__loading">
              <Spinner size={60} />
            </div>
          ) : userLists.length === 0 ? (
            <div className="user-feed__empty">
              <p>Aún no has creado ninguna lista</p>
              <p className="user-feed__empty-subtitle">Organiza tu contenido favorito en listas personalizadas</p>
            </div>
          ) : (
            <div className="user-feed__lists-grid">
              {userLists.map(list => (
                <div key={list.id} className="list-card">
                  <div className="list-card__covers">
                    {(list.detailedItems && list.detailedItems.length > 0 ? list.detailedItems : [null, null, null, null]).slice(0, 4).map((item, idx) => (
                      <div key={idx} className="list-card__cover" style={{ zIndex: 10 - idx }}>
                        {item ? (
                          <div className="list-card__cover-img-wrapper">
                            <img
                              src={item.poster_url || item.cover_url || item.backdrop_url || item.screenshot_url || item.image || item.img || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?fit=crop&w=400&q=80'}
                              alt={item.title || item.name || ''}
                              className="list-card__cover-img"
                            />
                          </div>
                        ) : (
                          <div className="list-card__placeholder">?</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <h3 className="list-card__name">
                    <Link to={`/listas/${list.idList || list.id}`}>{list.title || list.name}</Link>
                  </h3>
                  <div className="list-card__author">
                    <Avatar
                      image={list.userProfileImageUrl}
                      name={list.userName || user?.userName || 'U'}
                      size={28}
                      className="list-card__avatar"
                    />
                    <span className="list-card__author-label">Creada por <b>{list.userName || user?.userName || 'Usuario'}</b></span>
                  </div>
                  
                  <div className="list-card__actions">
                    <EditButton onClick={() => handleEditList(list)} />
                    <DeleteButton onClick={() => handleDeleteList(list.idList || list.id)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          if (modalConfig.onConfirm) {
            modalConfig.onConfirm();
          }
          setShowModal(false);
        }}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.type === 'confirm' ? 'Confirmar' : 'Aceptar'}
        cancelText="Cancelar"
      />
    </div>
  );
};

export default UserFeed;
