import { Star } from "lucide-react";
import { ImageWithFallback } from "../common/ImageWithFallback";
import "./ReviewHomeCard.css";


export default function ReviewHomeCard({ title, description, imageUrl, rating, category, categoryColor }) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`review-card__star ${
          i < rating ? "review-card__star--filled" : "review-card__star--empty"
        }`}
      />
    ));
  };


  const getCategoryClass = () => {
    if (category === "PELÍCULA") return "review-card__category--movie";
    if (category === "SERIE") return "review-card__category--series";
    if (category === "VIDEOJUEGO") return "review-card__category--game";
    if (category === "LIBRO") return "review-card__category--book";
    return "";
  };

  return (
    <div className="review-card">
      <div className="review-card__wrapper">
        <div className="review-card__image-container">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="review-card__image"
          />
          <div className="review-card__gradient" />
        </div>
        
        <div className="review-card__content">
          <div className="review-card__header">
            <span className={`review-card__category ${getCategoryClass()}`}>
              {category}
            </span>
            <div className="review-card__rating">
              {renderStars(rating)}
            </div>
          </div>
          
          <h3 className="review-card__title">{title}</h3>
          <p className="review-card__description">{description}</p>
        </div>
      </div>
    </div>
  );
}