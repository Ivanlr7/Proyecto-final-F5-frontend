import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './Slider.css';


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
      .catch(() => {
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
        slidesPerView={3}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          600: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 25,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        modules={[Pagination, Autoplay]}
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
