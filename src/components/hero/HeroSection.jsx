
import React from 'react';
import "./HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero-section">
      {/* Background pattern */}
      <div className="hero-section__background-pattern" />
      
      {/* Animated background elements */}
      <div className="hero-section__background-gradient">
        <div className="hero-section__background-blob hero-section__background-blob--blue" />
        <div className="hero-section__background-blob hero-section__background-blob--purple" />
      </div>

      <div className="hero-section__container">
        <h1 className="hero-section__title">
          Descubre y Comparte tus{" "}
          <span className="hero-section__title-gradient">
            Pasiones
          </span>
        </h1>
        
        <p className="hero-section__description">
          Explora un universo de películas, series, videojuegos y libros. ¡Tu próxima aventura te espera!
        </p>
        
        <button className="hero-section__cta">
          Explorar Reseñas
        </button>
      </div>
    </section>
  );
}