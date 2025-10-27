import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import './Slider.css';

/**
 * Slider component for displaying any type of media content (movies, shows, books, etc.)
 * @param {function} fetchItems - async function to fetch items (should return an array)
 * @param {function} renderItem - function to render a single item (receives item as argument)
 * @param {string} [title] - Optional title for the slider
 */
const Slider = ({ fetchItems, renderItem, title }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchItems()
      .then(data => {
        if (mounted) {
          setItems(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError('Error al cargar los datos');
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [fetchItems]);

  if (loading) return <div className="slider__loading">Cargando...</div>;
  if (error) return <div className="slider__error">{error}</div>;
  if (!items.length) return <div className="slider__empty">No hay contenido disponible.</div>;

  return (
    <div className="slider__container">
      {title && <h2 className="slider__title">{title}</h2>}
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'3'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="slider__swiper"
      >
        {items.map((item, idx) => (
          <SwiperSlide key={item.id || idx} className="slider__slide">
            {renderItem(item)}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
