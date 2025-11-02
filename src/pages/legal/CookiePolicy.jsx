import React, { useState } from 'react';
import { Cookie, Settings, Check, X } from 'lucide-react';
import './CookiePolicy.css';

function CookiePolicy() {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    advertising: false
  });

  const handleToggle = (type) => {
    if (type !== 'necessary') {
      setCookiePreferences(prev => ({
        ...prev,
        [type]: !prev[type]
      }));
    }
  };

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    alert('Preferencias guardadas correctamente');
  };

  return (
    <div className="cookie-policy">
      <div className="cookie-policy__background">
        <div className="cookie-policy__background-blob cookie-policy__background-blob--blue"></div>
        <div className="cookie-policy__background-blob cookie-policy__background-blob--purple"></div>
      </div>

      <div className="cookie-policy__container">
        <div className="cookie-policy__header">
          <div className="cookie-policy__icon">
            <Cookie size={48} />
          </div>
          <h1 className="cookie-policy__title">Política de Cookies</h1>
          <p className="cookie-policy__subtitle">
            Información sobre el uso de cookies en ReviewVerso
          </p>
          <p className="cookie-policy__date">Última actualización: Noviembre 2025</p>
        </div>

        <div className="cookie-policy__content">
          <section className="cookie-policy__section">
            <div className="cookie-policy__section-header">
              <Cookie size={24} />
              <h2>¿Qué son las cookies?</h2>
            </div>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web almacenan en su dispositivo 
              cuando los visita. Se utilizan ampliamente para hacer que los sitios web funcionen de manera 
              más eficiente, así como para proporcionar información a los propietarios del sitio.
            </p>
          </section>

          <section className="cookie-policy__section">
            <div className="cookie-policy__section-header">
              <Settings size={24} />
              <h2>¿Cómo usamos las cookies?</h2>
            </div>
            <p>
              ReviewVerso utiliza cookies para mejorar la experiencia del usuario, analizar el tráfico 
              y personalizar el contenido. A continuación, detallamos los tipos de cookies que utilizamos:
            </p>
          </section>

          <section className="cookie-policy__section">
            <h3>Tipos de Cookies</h3>
            
            <div className="cookie-policy__cookie-type">
              <div className="cookie-policy__cookie-header">
                <h4>🔒 Cookies Necesarias</h4>
                <span className="cookie-policy__badge cookie-policy__badge--required">Obligatorias</span>
              </div>
              <p>
                Estas cookies son esenciales para el funcionamiento del sitio web y no pueden desactivarse. 
                Permiten la navegación básica y el acceso a áreas seguras.
              </p>
              <ul>
                <li><strong>authToken:</strong> Gestiona la sesión del usuario (duración: sesión)</li>
                <li><strong>XSRF-TOKEN:</strong> Prevención de ataques CSRF (duración: sesión)</li>
                <li><strong>cookieConsent:</strong> Almacena las preferencias de cookies (duración: 1 año)</li>
              </ul>
            </div>

            <div className="cookie-policy__cookie-type">
              <div className="cookie-policy__cookie-header">
                <h4>⚙️ Cookies Funcionales</h4>
                <span className="cookie-policy__badge cookie-policy__badge--optional">Opcionales</span>
              </div>
              <p>
                Estas cookies permiten que el sitio web recuerde las elecciones que hace (como su idioma 
                o región) y proporcionan características mejoradas y más personales.
              </p>
              <ul>
                <li><strong>userPreferences:</strong> Preferencias de visualización (duración: 1 año)</li>
                <li><strong>theme:</strong> Tema de color seleccionado (duración: 1 año)</li>
                <li><strong>reviewLikes:</strong> Likes dados a reseñas (duración: 1 año)</li>
              </ul>
            </div>

            <div className="cookie-policy__cookie-type">
              <div className="cookie-policy__cookie-header">
                <h4>📊 Cookies Analíticas</h4>
                <span className="cookie-policy__badge cookie-policy__badge--optional">Opcionales</span>
              </div>
              <p>
                Estas cookies nos permiten contar las visitas y fuentes de tráfico para medir y mejorar 
                el rendimiento de nuestro sitio.
              </p>
              <ul>
                <li><strong>_ga:</strong> Google Analytics - Identificador único (duración: 2 años)</li>
                <li><strong>_gid:</strong> Google Analytics - Identificador de sesión (duración: 24 horas)</li>
                <li><strong>_gat:</strong> Google Analytics - Limitación de solicitudes (duración: 1 minuto)</li>
              </ul>
            </div>

            <div className="cookie-policy__cookie-type">
              <div className="cookie-policy__cookie-header">
                <h4>🎯 Cookies de Publicidad</h4>
                <span className="cookie-policy__badge cookie-policy__badge--optional">Opcionales</span>
              </div>
              <p>
                Estas cookies se utilizan para mostrar anuncios relevantes basados en sus intereses. 
                También limitan el número de veces que ve un anuncio.
              </p>
              <ul>
                <li><strong>IDE:</strong> Google DoubleClick - Publicidad dirigida (duración: 1 año)</li>
                <li><strong>fr:</strong> Facebook - Publicidad personalizada (duración: 3 meses)</li>
              </ul>
            </div>
          </section>

          <section className="cookie-policy__section">
            <div className="cookie-policy__section-header">
              <Settings size={24} />
              <h2>Gestión de Cookies</h2>
            </div>
            <p>
              Puede gestionar sus preferencias de cookies utilizando el panel siguiente o configurando 
              su navegador para rechazar las cookies. Tenga en cuenta que deshabilitar las cookies 
              puede afectar la funcionalidad del sitio web.
            </p>

            <div className="cookie-policy__preferences">
              <h3>Sus Preferencias de Cookies</h3>
              
              <div className="cookie-policy__preference-item">
                <div className="cookie-policy__preference-info">
                  <h4>Cookies Necesarias</h4>
                  <p>Siempre activas - Requeridas para el funcionamiento del sitio</p>
                </div>
                <div className="cookie-policy__toggle cookie-policy__toggle--disabled">
                  <Check size={20} />
                </div>
              </div>

              <div className="cookie-policy__preference-item">
                <div className="cookie-policy__preference-info">
                  <h4>Cookies Funcionales</h4>
                  <p>Mejoran la funcionalidad y personalización</p>
                </div>
                <button 
                  className={`cookie-policy__toggle ${cookiePreferences.functional ? 'cookie-policy__toggle--active' : ''}`}
                  onClick={() => handleToggle('functional')}
                >
                  {cookiePreferences.functional ? <Check size={20} /> : <X size={20} />}
                </button>
              </div>

              <div className="cookie-policy__preference-item">
                <div className="cookie-policy__preference-info">
                  <h4>Cookies Analíticas</h4>
                  <p>Nos ayudan a mejorar el rendimiento del sitio</p>
                </div>
                <button 
                  className={`cookie-policy__toggle ${cookiePreferences.analytics ? 'cookie-policy__toggle--active' : ''}`}
                  onClick={() => handleToggle('analytics')}
                >
                  {cookiePreferences.analytics ? <Check size={20} /> : <X size={20} />}
                </button>
              </div>

              <div className="cookie-policy__preference-item">
                <div className="cookie-policy__preference-info">
                  <h4>Cookies de Publicidad</h4>
                  <p>Permiten mostrar anuncios relevantes</p>
                </div>
                <button 
                  className={`cookie-policy__toggle ${cookiePreferences.advertising ? 'cookie-policy__toggle--active' : ''}`}
                  onClick={() => handleToggle('advertising')}
                >
                  {cookiePreferences.advertising ? <Check size={20} /> : <X size={20} />}
                </button>
              </div>

              <button className="cookie-policy__save-btn" onClick={savePreferences}>
                Guardar Preferencias
              </button>
            </div>
          </section>

          <section className="cookie-policy__section">
            <div className="cookie-policy__section-header">
              <Settings size={24} />
              <h2>Cómo Controlar las Cookies en su Navegador</h2>
            </div>
            <p>
              La mayoría de los navegadores web permiten cierto control de las cookies a través de la 
              configuración del navegador:
            </p>
            <ul>
              <li>
                <strong>Google Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios
              </li>
              <li>
                <strong>Mozilla Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio
              </li>
              <li>
                <strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos de sitios web
              </li>
              <li>
                <strong>Microsoft Edge:</strong> Configuración → Cookies y permisos del sitio
              </li>
            </ul>
          </section>

          <section className="cookie-policy__section">
            <div className="cookie-policy__section-header">
              <Cookie size={24} />
              <h2>Cookies de Terceros</h2>
            </div>
            <p>
              ReviewVerso utiliza servicios de terceros que pueden establecer cookies en su dispositivo:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> Para análisis de tráfico y comportamiento</li>
              <li><strong>TMDB API:</strong> Para información de películas y series</li>
              <li><strong>IGDB API:</strong> Para información de videojuegos</li>
              <li><strong>OpenLibrary API:</strong> Para información de libros</li>
            </ul>
            <p>
              Estas empresas tienen sus propias políticas de privacidad y cookies, sobre las cuales 
              ReviewVerso no tiene control.
            </p>
          </section>

          <section className="cookie-policy__section">
            <div className="cookie-policy__section-header">
              <Settings size={24} />
              <h2>Actualización de la Política</h2>
            </div>
            <p>
              Podemos actualizar esta Política de Cookies ocasionalmente para reflejar cambios en las 
              cookies que utilizamos o por razones operativas, legales o regulatorias. Le recomendamos 
              que revise esta página regularmente.
            </p>
          </section>

          <section className="cookie-policy__section">
            <div className="cookie-policy__section-header">
              <Cookie size={24} />
              <h2>Contacto</h2>
            </div>
            <p>
              Si tiene preguntas sobre nuestra Política de Cookies, puede contactarnos en:
            </p>
            <ul>
              <li><strong>Email:</strong> privacy@reviewverso.com</li>
              <li><strong>Teléfono:</strong> +34 900 000 000</li>
            </ul>
          </section>
        </div>

        <div className="cookie-policy__footer">
          <p>
            Para más información sobre cómo tratamos sus datos personales, consulte nuestra 
            <a href="/politica-privacidad" className="cookie-policy__link"> Política de Privacidad</a> y 
            <a href="/aviso-legal" className="cookie-policy__link"> Aviso Legal</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CookiePolicy;
