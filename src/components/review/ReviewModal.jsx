
import React, { useState } from 'react';
import './ReviewModal.css';

const StarRating = ({ rating, setRating }) => (
  <div className="review-modal__stars">
    {[1,2,3,4,5].map(star => (
      <span
        key={star}
        className={`review-modal__star${star <= rating ? ' review-modal__star--active' : ''}`}
        onClick={() => setRating(star)}
      >
        ★
      </span>
    ))}
  </div>
);

const ReviewModal = ({ open, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  if (!open) return null;

  return (
    <div className="review-modal-backdrop">
      <div className="review-modal">
        <button
          onClick={onClose}
          className="review-modal__close"
          aria-label="Cerrar"
        >×</button>
        <h2 className="review-modal__title">Escribir Reseña</h2>
        <label className="review-modal__label">Valoración:</label>
        <StarRating rating={rating} setRating={setRating} />
        <label className="review-modal__label review-modal__label--mt">Título:</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="review-modal__input"
          placeholder="Título de la reseña"
        />
        <label className="review-modal__label">Cuerpo de la reseña:</label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          className="review-modal__textarea"
          placeholder="Escribe tu reseña..."
        />
        <button
          onClick={() => onSubmit({ rating, title, body })}
          className="review-modal__button"
        >Enviar reseña</button>
      </div>
    </div>
  );
};

export default ReviewModal;
