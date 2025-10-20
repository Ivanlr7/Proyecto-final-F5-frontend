import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ReviewModal from '../ReviewModal';
import ReviewService from '../../api/services/ReviewService';
import { Star, User, MessageSquare } from 'lucide-react';
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

  const handleToggleExpand = (id) => {
    setExpandedReviews(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
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
                console.log('Review data:', review);
                const maxLength = 200;
                const isLong = review.reviewText && review.reviewText.length > maxLength;
                const expanded = !!expandedReviews[review.idReview];
                const displayText = expanded || !isLong
                  ? review.reviewText
                  : review.reviewText.slice(0, maxLength) + '...';
         
                const profileImgUrl = review.userProfileImageUrl || review.profileImage || null;
                return (
                  <div className="media-reviews__review" key={review.idReview}>
                    <div className="media-reviews__review-header">
                      <div className="media-reviews__reviewer">
                        <div className="media-reviews__reviewer-avatar">
                          {profileImgUrl ? (
                            <img
                              src={profileImgUrl}
                              alt={review.userName || 'Usuario'}
                              className="media-reviews__reviewer-img"
                              onError={e => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
                            />
                          ) : (
                            <User size={24} />
                          )}
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
                    {isLong && (
                      <button
                        className="media-reviews__read-more-btn"
                        onClick={() => handleToggleExpand(review.idReview)}
                        style={{ marginTop: 4 }}
                      >
                        {expanded ? 'Leer menos' : 'Leer más'}
                      </button>
                    )}
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
