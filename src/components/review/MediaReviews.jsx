import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ReviewModal from './ReviewModal';
import ReviewService from '../../api/services/ReviewService';
import { Star, User, MessageSquare, ThumbsUp } from 'lucide-react';
import './MediaReviews.css';

const MediaReviews = ({ contentType, contentId, apiSource = 'TMDB' }) => {
  const reviewService = new ReviewService();
  const { isAuthenticated, token } = useSelector(state => state.auth);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const res = await reviewService.getReviewsByContent(contentType, contentId);
        if (res.success && Array.isArray(res.data)) {
          console.log('Reviews recibidas:', res.data);
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
    if (contentType && contentId) fetchReviews();
  }, [contentType, contentId]);

  // Estado de expansión para cada review (por id)
  const [expandedReviews, setExpandedReviews] = useState({});
  const [likeLoading, setLikeLoading] = useState({});
  // Estado de likes y contador, persistente en localStorage
  const userId = useSelector(state => state.auth?.user?.id || state.auth?.user?.email || state.auth?.user?.username || 'anon');
  const storageKey = `reviewLikes_${userId}`;
  const [liked, setLiked] = useState(() => {
    if (!userId || userId === 'anon') return {};
    try {
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  });
  const [likeCount, setLikeCount] = useState({});

  // Inicializar likeCount desde reviews, pero mantener liked desde localStorage
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const likeCountObj = {};
      reviews.forEach(r => {
        likeCountObj[r.idReview] = r.likeCount || 0;
      });
      setLikeCount(likeCountObj);
    }
  }, [reviews]);

  // Guarda liked en localStorage cada vez que cambie (por usuario)
  useEffect(() => {
    if (!userId || userId === 'anon') return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(liked));
    } catch {}
  }, [liked, storageKey, userId]);

  // Al cambiar de usuario, cargar likes de ese usuario
  useEffect(() => {
    if (!userId || userId === 'anon') {
      setLiked({});
      return;
    }
    try {
      const data = localStorage.getItem(storageKey);
      setLiked(data ? JSON.parse(data) : {});
    } catch {
      setLiked({});
    }
  }, [userId, storageKey]);

  const handleToggleExpand = (id) => {
    setExpandedReviews(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLike = async (idReview) => {
    if (!isAuthenticated || !token) {
      alert('Debes iniciar sesión para dar like');
      return;
    }
    setLikeLoading(prev => ({ ...prev, [idReview]: true }));
    if (!liked[idReview]) {

      setLiked(prev => ({ ...prev, [idReview]: true }));
      setLikeCount(prev => ({ ...prev, [idReview]: (prev[idReview] || 0) + 1 }));
      const res = await reviewService.likeReview(idReview, token);
      if (!res.success) {

        setLiked(prev => ({ ...prev, [idReview]: false }));
        setLikeCount(prev => ({ ...prev, [idReview]: Math.max(0, (prev[idReview] || 1) - 1) }));
        alert(res.error || 'Error al dar like');
      }
    } else {
  
      setLiked(prev => ({ ...prev, [idReview]: false }));
      setLikeCount(prev => ({ ...prev, [idReview]: Math.max(0, (prev[idReview] || 1) - 1) }));
      const res = await reviewService.unlikeReview(idReview, token);
      if (!res.success) {
    
        setLiked(prev => ({ ...prev, [idReview]: true }));
        setLikeCount(prev => ({ ...prev, [idReview]: (prev[idReview] || 0) + 1 }));
        alert(res.error || 'Error al quitar like');
      }
    }
    setLikeLoading(prev => ({ ...prev, [idReview]: false }));
  };

  // Clase dinámica según tipo de contenido
  const typeClass = {
    MOVIE: 'media-reviews--movie',
    SERIES: 'media-reviews--show',
    GAME: 'media-reviews--videogame',
    BOOK: 'media-reviews--book'
  }[contentType] || '';

  return (
    <div className={`media-reviews ${typeClass}`}>
      {/* Write Review Section */}
      <section className="media-reviews__section">
        <div className="media-reviews__review-actions">
          <button className="media-reviews__write-review-btn" onClick={() => setShowReviewModal(true)}>
            <MessageSquare size={20} />
            Escribir Reseña
          </button>
          <ReviewModal
            open={showReviewModal}
            onClose={() => setShowReviewModal(false)}
            onSubmit={async (data) => {
              if (!isAuthenticated || !token) {
                alert('Debes iniciar sesión para escribir una reseña');
                setShowReviewModal(false);
                return;
              }
              const reviewRequest = {
                contentType,
                contentId,
                apiSource,
                reviewTitle: data.title,
                reviewText: data.body,
                rating: data.rating
              };
              const res = await reviewService.createReview(reviewRequest, token);
              if (res.success) {
                setReviews(prev => [res.data, ...prev]);
                setShowReviewModal(false);
              } else {
                alert(res.error || 'Error al enviar la reseña');
              }
            }}
          />
        </div>
      </section>

      {/* Reviews Section */}
      <section className="media-reviews__section">
        <h2 className="media-reviews__section-title">
          Reseñas de Usuarios
          <span className="media-reviews__reviews-count">{reviews.length} reseñas</span>
        </h2>
        {reviewsLoading ? (
          <div>Cargando reseñas...</div>
        ) : reviewsError ? (
          <div style={{color: 'red'}}>{reviewsError}</div>
        ) : (
          <div className="media-reviews__reviews">
            {reviews.length === 0 ? (
              <div>No hay reseñas para este contenido.</div>
            ) : (
              reviews.map((review) => {
                const maxLength = 200;
                const isLong = review.reviewText && review.reviewText.length > maxLength;
                const expanded = !!expandedReviews[review.idReview];
                const displayText = expanded || !isLong
                  ? review.reviewText
                  : review.reviewText.slice(0, maxLength) + '...';

                const profileImgUrl = review.userProfileImageUrl || review.profileImage || null;
                const userInitial = (review.userName || review.username || 'U').charAt(0).toUpperCase();

                return (
                  <div className="media-reviews__review" key={review.idReview}>
                    <div className="media-reviews__review-header">
                      <div className="media-reviews__reviewer">
                        <div className="media-reviews__reviewer-avatar">
                          {profileImgUrl && (
                            <img
                              src={profileImgUrl}
                              alt={review.userName || 'Usuario'}
                              className="media-reviews__reviewer-img"
                              onError={e => {
                                e.target.style.display = 'none';
                                if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                              }}
                              style={{ display: profileImgUrl ? 'block' : 'none' }}
                            />
                          )}
                          <div
                            className="media-reviews__avatar-initials"
                            style={{ display: profileImgUrl ? 'none' : 'flex' }}
                          >
                            {userInitial.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="media-reviews__reviewer-info">
                          <h4>{review.userName || 'Usuario'}</h4>
                          <span>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</span>
                        </div>
                      </div>
                      <div className="media-reviews__review-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={16} 
                            fill={star <= review.rating ? '#fbbf24' : '#64748b'} 
                            className="star-filled"
                          />
                        ))}
                      </div>
                    </div>
                    <h3 className="media-reviews__review-title">{review.reviewTitle}</h3>
                    <p className="media-reviews__review-content">{displayText}</p>
                    <div className="media-reviews__actions-row">
                      <button
                        className={`media-reviews__like-btn${liked[review.idReview] ? ' liked' : ''}`}
                        onClick={() => handleLike(review.idReview)}
                        disabled={likeLoading[review.idReview]}
                        aria-label={liked[review.idReview] ? 'Quitar like' : 'Dar like'}
                      >
                        <ThumbsUp size={18}
                          fill={liked[review.idReview] ? 'currentColor' : 'none'}
                          color={liked[review.idReview] ? 'currentColor' : '#64748b'}
                        />
                      </button>
                      <span style={{ color: '#7dd3fc', fontSize: '1rem' }}>{likeCount[review.idReview] || 0}</span>
                      {isLong && (
                        <button
                          className="media-reviews__read-more-btn"
                          onClick={() => handleToggleExpand(review.idReview)}
                          style={{ marginLeft: '1rem' }}
                        >
                          {expanded ? 'Leer menos' : 'Leer más'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default MediaReviews;
