import React, { useState } from 'react';

const StarRating = ({ rating, setRating }) => (
  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
    {[1,2,3,4,5].map(star => (
      <span
        key={star}
        style={{
          fontSize: '2rem',
          cursor: 'pointer',
          color: star <= rating ? '#fbbf24' : '#64748b',
        }}
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(15,23,42,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        background: '#1e293b',
        borderRadius: 16,
        padding: 32,
        minWidth: 350,
        maxWidth: 500,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        color: '#fff',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}
          aria-label="Cerrar"
        >×</button>
        <h2 style={{ marginBottom: 16 }}>Escribir Reseña</h2>
        <label style={{ display: 'block', marginBottom: 8 }}>Valoración:</label>
        <StarRating rating={rating} setRating={setRating} />
        <label style={{ display: 'block', margin: '16px 0 8px' }}>Título:</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #334155', marginBottom: 16, fontSize: 16 }}
          placeholder="Título de la reseña"
        />
        <label style={{ display: 'block', marginBottom: 8 }}>Cuerpo de la reseña:</label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          style={{ width: '100%', minHeight: 120, padding: 8, borderRadius: 8, border: '1px solid #334155', marginBottom: 24, fontSize: 16, background: '#0f172a', color: '#fff' }}
          placeholder="Escribe tu reseña..."
        />
        <button
          onClick={() => onSubmit({ rating, title, body })}
          style={{ background: '#a78bfa', color: '#fff', padding: '12px 32px', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
        >Enviar reseña</button>
      </div>
    </div>
  );
};

export default ReviewModal;
