import React from 'react'
import './HomePage.css'
import HeroSection from '../../components/hero/HeroSection';
import CategoryCard from '../../components/categoryCard/CategoryCard';
import ReviewHomeCard from '../../components/review/ReviewHomeCard';


// Componente ReviewCard
function ReviewCard({ title, description, imageUrl, rating, category, categoryColor }) {
  return (
    <div className="review-card">
      <div className="review-card__image">
        <img src={imageUrl} alt={title} />
      </div>
      <div className="review-card__content">
        <span className={`review-card__category ${categoryColor}`}>{category}</span>
        <h3 className="review-card__title">{title}</h3>
        <p className="review-card__description">{description}</p>
        <div className="review-card__rating">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const categories = [
    {
      title: "Películas",
      description: "Reseñas de los últimos estrenos y clásicos del cine",
      imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMGNpbmVtYSUyMGZpbG0lMjBkYXJrfGVufDF8fHx8MTc1OTc0NjE1NXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Series",
      description: "Análisis de series populares y nuevos lanzamientos",
      imageUrl: "https://images.unsplash.com/photo-1607110654203-d5665bd64105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0diUyMHNlcmllcyUyMHRlbGV2aXNpb24lMjBzaG93fGVufDF8fHx8MTc1OTc0NjE1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Videojuegos",
      description: "Opiniones sobre los videojuegos más jugados",
      imageUrl: "https://images.unsplash.com/photo-1655976796204-308e6f3deaa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjB2aWRlb2dhbWVzJTIwY29udHJvbGxlcnxlbnwxfHx8fDE3NTk3NDYxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Libros",
      description: "Reseñas de bestsellers y otros libros literarios",
      imageUrl: "https://images.unsplash.com/photo-1582203914689-d5cc1850fcb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMHJlYWRpbmclMjBsaWJyYXJ5fGVufDF8fHx8MTc1OTY1MTMxM3ww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  const featuredReviews = [
    {
      title: "El Legado Oculto",
      description: "Una película de misterio que te mantendrá al borde de tu asiento",
      imageUrl: "https://images.unsplash.com/photo-1742274317501-57e147afc0c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJ5JTIwYWR2ZW50dXJlJTIwYm9va3xlbnwxfHx8fDE3NTk3NDYxNTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4,
      category: "PELÍCULA",
      categoryColor: "bg-blue-500/20 text-blue-400"
    },
    {
      title: "Sombras del Pasado",
      description: "Una serie llena de misterio y elementos envolventes",
      imageUrl: "https://images.unsplash.com/photo-1695143302413-425685b8f590?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMHN1bnNldCUyMG5hdHVyZXxlbnwxfHx8fDE3NTk3NDYxNTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 5,
      category: "SERIE",
      categoryColor: "bg-green-500/20 text-green-400"
    },
    {
      title: "Mundo Virtual",
      description: "Un videojuego innovador que lleva la narrativa a otro nivel",
      imageUrl: "https://images.unsplash.com/photo-1603459404909-2ce99c16ab54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwcmVhbGl0eSUyMGZ1dHVyZXxlbnwxfHx8fDE3NTk3NDYxNjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 5,
      category: "VIDEOJUEGO",
      categoryColor: "bg-purple-500/20 text-purple-400"
    },
    {
      title: "El Enigma de la Noche",
      description: "Un libro que te hará dudar de lo que crees saber del mundo",
      imageUrl: "https://images.unsplash.com/photo-1599840676930-e6f403ca41bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodCUyMG15c3RlcnklMjBkYXJrfGVufDF8fHx8MTc1OTc0NjE2MHww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 5,
      category: "LIBRO",
      categoryColor: "bg-orange-500/20 text-orange-400"
    }
  ];

  return (
    <div className="home">
      
      <HeroSection />
    <section className="categories-section">
        <div className="categories-section__container">
          <h2 className="categories-section__title">Categorías</h2>
          <div className="categories-section__grid">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.title}
                description={category.description}
                imageUrl={category.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

  {/* Featured Reviews Section */}
      <section className="featured-section">
        <div className="featured-section__container">
          <h2 className="featured-section__title">Reseñas Destacadas</h2>
          <div className="featured-section__grid">
            {featuredReviews.map((review, index) => (
              <ReviewHomeCard
                key={index}
                title={review.title}
                description={review.description}
                imageUrl={review.imageUrl}
                rating={review.rating}
                category={review.category}
                categoryColor={review.categoryColor}
              />
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
