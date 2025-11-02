import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="contact">
      <div className="contact__background">
        <div className="contact__background-blob contact__background-blob--blue"></div>
        <div className="contact__background-blob contact__background-blob--purple"></div>
      </div>

      <div className="contact__container">
        <div className="contact__header">
          <h1 className="contact__title">Contáctanos</h1>
          <p className="contact__subtitle">
            ¿Tienes alguna pregunta, sugerencia o necesitas ayuda? Estamos aquí para ayudarte
          </p>
        </div>

        <div className="contact__content">
          <div className="contact__info">
            <div className="contact__info-card">
              <div className="contact__info-icon">
                <Mail size={32} />
              </div>
              <h3>Email</h3>
              <p>contacto@reviewverso.com</p>
              <p className="contact__info-secondary">support@reviewverso.com</p>
            </div>

            <div className="contact__info-card">
              <div className="contact__info-icon">
                <MessageSquare size={32} />
              </div>
              <h3>Redes Sociales</h3>
              <p>@reviewverso</p>
              <p className="contact__info-secondary">Síguenos en todas las plataformas</p>
            </div>

            <div className="contact__info-card">
              <div className="contact__info-icon">
                <CheckCircle size={32} />
              </div>
              <h3>Tiempo de Respuesta</h3>
              <p>24-48 horas</p>
              <p className="contact__info-secondary">De lunes a viernes</p>
            </div>
          </div>

          <div className="contact__form-section">
            {isSubmitted ? (
              <div className="contact__success">
                <CheckCircle size={64} />
                <h2>¡Mensaje Enviado!</h2>
                <p>Gracias por contactarnos. Te responderemos pronto.</p>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit}>
                <div className="contact__form-group">
                  <label htmlFor="name">Nombre Completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div className="contact__form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div className="contact__form-group">
                  <label htmlFor="subject">Asunto *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="¿En qué podemos ayudarte?"
                    required
                  />
                </div>

                <div className="contact__form-group">
                  <label htmlFor="message">Mensaje *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aquí..."
                    rows="6"
                    required
                  />
                </div>

                <button type="submit" className="contact__submit-btn">
                  <Send size={20} />
                  Enviar Mensaje
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="contact__faq">
          <h2>Preguntas Frecuentes</h2>
          <div className="contact__faq-grid">
            <div className="contact__faq-item">
              <h3>¿Cómo puedo reportar contenido inapropiado?</h3>
              <p>Puedes reportar cualquier contenido inapropiado contactándonos directamente o a través del formulario de contacto con el asunto "Reporte de contenido".</p>
            </div>
            <div className="contact__faq-item">
              <h3>¿Cómo elimino mi cuenta?</h3>
              <p>Puedes eliminar tu cuenta desde tu área personal, en la sección de configuración. Ten en cuenta que esta acción es irreversible.</p>
            </div>
            <div className="contact__faq-item">
              <h3>¿Puedo sugerir nuevas funcionalidades?</h3>
              <p>¡Por supuesto! Nos encanta escuchar las ideas de nuestra comunidad. Envíanos tus sugerencias a través del formulario de contacto.</p>
            </div>
            <div className="contact__faq-item">
              <h3>¿Cómo puedo colaborar con ReviewVerso?</h3>
              <p>Si estás interesado en colaborar con nosotros, envíanos un email a colaboraciones@reviewverso.com con tu propuesta.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;