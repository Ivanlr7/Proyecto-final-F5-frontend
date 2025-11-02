import React from 'react';
import { Shield, Scale, FileText } from 'lucide-react';
import './LegalNotice.css';

function LegalNotice() {
  return (
    <div className="legal">
      <div className="legal__background">
        <div className="legal__background-blob legal__background-blob--blue"></div>
        <div className="legal__background-blob legal__background-blob--purple"></div>
      </div>

      <div className="legal__container">
        <div className="legal__header">
          <div className="legal__icon">
            <Scale size={48} />
          </div>
          <h1 className="legal__title">Aviso Legal</h1>
          <p className="legal__subtitle">Información legal sobre ReviewVerso</p>
          <p className="legal__date">Última actualización: Noviembre 2025</p>
        </div>

        <div className="legal__content">
          <section className="legal__section">
            <div className="legal__section-header">
              <FileText size={24} />
              <h2>1. Información General</h2>
            </div>
            <p>
              En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad 
              de la Información y de Comercio Electrónico, se informa a los usuarios de los datos identificativos 
              de ReviewVerso:
            </p>
            <ul>
              <li><strong>Denominación social:</strong> ReviewVerso S.L.</li>
              <li><strong>NIF:</strong> B-12345678</li>
              <li><strong>Domicilio social:</strong> Calle Ejemplo, 123, 28001 Madrid, España</li>
              <li><strong>Correo electrónico:</strong> legal@reviewverso.com</li>
              <li><strong>Teléfono:</strong> +34 900 000 000</li>
            </ul>
          </section>

          <section className="legal__section">
            <div className="legal__section-header">
              <Shield size={24} />
              <h2>2. Objeto</h2>
            </div>
            <p>
              ReviewVerso es una plataforma digital que permite a los usuarios crear, compartir y descubrir 
              reseñas sobre contenido de entretenimiento, incluyendo películas, series, videojuegos y libros.
            </p>
            <p>
              El acceso y uso de este sitio web implica la aceptación expresa y sin reservas de todos los 
              términos del presente Aviso Legal.
            </p>
          </section>

          <section className="legal__section">
            <div className="legal__section-header">
              <FileText size={24} />
              <h2>3. Condiciones de Uso</h2>
            </div>
            <h3>3.1 Acceso y Registro</h3>
            <p>
              El acceso a ReviewVerso es gratuito. Para acceder a ciertas funcionalidades (como escribir reseñas 
              o crear listas), es necesario registrarse proporcionando información veraz y completa.
            </p>
            <h3>3.2 Responsabilidad del Usuario</h3>
            <p>El usuario se compromete a:</p>
            <ul>
              <li>Utilizar la plataforma de manera lícita y conforme a la normativa vigente</li>
              <li>No publicar contenido ofensivo, difamatorio o que infrinja derechos de terceros</li>
              <li>No realizar actividades que puedan dañar, inutilizar o deteriorar el servicio</li>
              <li>Mantener la confidencialidad de sus credenciales de acceso</li>
              <li>Respetar los derechos de propiedad intelectual</li>
            </ul>
            <h3>3.3 Contenido Generado por Usuarios</h3>
            <p>
              Los usuarios son responsables del contenido que publican. ReviewVerso se reserva el derecho de 
              eliminar cualquier contenido que considere inapropiado sin previo aviso.
            </p>
          </section>

          <section className="legal__section">
            <div className="legal__section-header">
              <Shield size={24} />
              <h2>4. Propiedad Intelectual</h2>
            </div>
            <p>
              Todos los contenidos del sitio web, incluyendo pero no limitándose a textos, fotografías, 
              gráficos, imágenes, iconos, tecnología, software, así como su diseño gráfico y códigos fuente, 
              constituyen una obra cuya propiedad pertenece a ReviewVerso.
            </p>
            <p>
              El contenido generado por los usuarios (reseñas, listas) permanece bajo la propiedad de sus 
              creadores, pero al publicarlo otorgan a ReviewVerso una licencia mundial, no exclusiva, 
              transferible y libre de regalías para usar, reproducir y distribuir dicho contenido en el 
              contexto de la plataforma.
            </p>
          </section>

          <section className="legal__section">
            <div className="legal__section-header">
              <FileText size={24} />
              <h2>5. Protección de Datos</h2>
            </div>
            <p>
              ReviewVerso cumple con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 
              3/2018 de Protección de Datos Personales y garantía de los derechos digitales.
            </p>
            <p>
              Los datos personales proporcionados por los usuarios serán tratados conforme a nuestra 
              <a href="/politica-privacidad" className="legal__link"> Política de Privacidad</a>.
            </p>
          </section>

          <section className="legal__section">
            <div className="legal__section-header">
              <Scale size={24} />
              <h2>6. Exclusión de Garantías y Responsabilidad</h2>
            </div>
            <p>
              ReviewVerso no se hace responsable de:
            </p>
            <ul>
              <li>La veracidad, exactitud o actualización del contenido generado por usuarios</li>
              <li>Los daños y perjuicios derivados del uso incorrecto de la plataforma</li>
              <li>Fallos técnicos o interrupciones temporales del servicio</li>
              <li>El contenido de sitios web de terceros enlazados desde la plataforma</li>
            </ul>
            <p>
              El servicio se proporciona "tal cual" sin garantías de ningún tipo, expresas o implícitas.
            </p>
          </section>

          <section className="legal__section">
            <div className="legal__section-header">
              <FileText size={24} />
              <h2>7. Enlaces a Terceros</h2>
            </div>
            <p>
              ReviewVerso puede contener enlaces a sitios web de terceros (TMDB, IGDB, OpenLibrary). 
              No nos hacemos responsables del contenido, políticas de privacidad o prácticas de estos 
              sitios externos.
            </p>
          </section>

          <section className="legal__section">
            <div className="legal__section-header">
              <Shield size={24} />
              <h2>8. Modificaciones</h2>
            </div>
            <p>
              ReviewVerso se reserva el derecho de modificar el presente Aviso Legal en cualquier momento. 
              Los cambios entrarán en vigor desde su publicación en el sitio web.
            </p>
          </section>

          <section className="legal__section">
            <div className="legal__section-header">
              <Scale size={24} />
              <h2>9. Legislación Aplicable y Jurisdicción</h2>
            </div>
            <p>
              El presente Aviso Legal se rige por la legislación española. Para la resolución de cualquier 
              controversia, las partes se someten a los Juzgados y Tribunales de Madrid, renunciando 
              expresamente a cualquier otro fuero que pudiera corresponderles.
            </p>
          </section>

          <section className="legal__section">
            <div className="legal__section-header">
              <FileText size={24} />
              <h2>10. Contacto</h2>
            </div>
            <p>
              Para cualquier consulta relacionada con este Aviso Legal, puede contactarnos en:
            </p>
            <ul>
              <li><strong>Email:</strong> legal@reviewverso.com</li>
              <li><strong>Dirección:</strong> Calle Ejemplo, 123, 28001 Madrid, España</li>
              <li><strong>Teléfono:</strong> +34 900 000 000</li>
            </ul>
          </section>
        </div>

        <div className="legal__footer">
          <p>
            Al utilizar ReviewVerso, usted acepta los términos establecidos en este Aviso Legal y en nuestra 
            <a href="/politica-privacidad" className="legal__link"> Política de Privacidad</a> y 
            <a href="/politica-cookies" className="legal__link"> Política de Cookies</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LegalNotice;
