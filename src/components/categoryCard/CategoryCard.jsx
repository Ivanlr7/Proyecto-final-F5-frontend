
import React from 'react';
import { ImageWithFallback } from '../common/ImageWithFallback';
import './CategoryCard.css';


export default function CategoryCard({ title, description, imageUrl, className = "" }) {
  return (
    <div className={`category-card ${className}`}>
      <div className="category-card__wrapper">
        <div className="category-card__image-container">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="category-card__image"
          />
          <div className="category-card__gradient" />
        </div>
        
        <div className="category-card__content">
          <h3 className="category-card__title">{title}</h3>
          <p className="category-card__description">{description}</p>
        </div>
      </div>
    </div>
  );
}