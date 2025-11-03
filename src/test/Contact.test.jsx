import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Contact from '../pages/contact/Contact';

describe('Contact', () => {
  it('renderiza el título y subtítulo correctamente', () => {
    render(<Contact />);
    
    expect(screen.getByText(/Contáctanos/i)).toBeInTheDocument();
    expect(screen.getByText(/¿Tienes alguna pregunta, sugerencia o necesitas ayuda?/i)).toBeInTheDocument();
  });

  it('muestra las tarjetas de información de contacto', () => {
    render(<Contact />);
    
    expect(screen.getByText(/contacto@reviewverso.com/i)).toBeInTheDocument();
    expect(screen.getByText(/support@reviewverso.com/i)).toBeInTheDocument();
    expect(screen.getByText(/@reviewverso/i)).toBeInTheDocument();
    expect(screen.getByText(/24-48 horas/i)).toBeInTheDocument();
  });

  it('muestra el formulario de contacto con todos los campos', () => {
    render(<Contact />);
    
    expect(screen.getByLabelText(/Nombre Completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Asunto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mensaje/i)).toBeInTheDocument();
  });

  it('permite escribir en todos los campos del formulario', () => {
    render(<Contact />);
    
    const nameInput = screen.getByPlaceholderText(/Tu nombre/i);
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i);
    const subjectInput = screen.getByPlaceholderText(/¿En qué podemos ayudarte?/i);
    const messageInput = screen.getByPlaceholderText(/Escribe tu mensaje aquí.../i);
    
    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Consulta general' } });
    fireEvent.change(messageInput, { target: { value: 'Este es un mensaje de prueba' } });
    
    expect(nameInput.value).toBe('Juan Pérez');
    expect(emailInput.value).toBe('juan@example.com');
    expect(subjectInput.value).toBe('Consulta general');
    expect(messageInput.value).toBe('Este es un mensaje de prueba');
  });

  it('muestra mensaje de éxito al enviar el formulario', async () => {
    render(<Contact />);
    
    const nameInput = screen.getByPlaceholderText(/Tu nombre/i);
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i);
    const subjectInput = screen.getByPlaceholderText(/¿En qué podemos ayudarte?/i);
    const messageInput = screen.getByPlaceholderText(/Escribe tu mensaje aquí.../i);
    const submitButton = screen.getByRole('button', { name: /Enviar Mensaje/i });
    
    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Consulta' } });
    fireEvent.change(messageInput, { target: { value: 'Mensaje de prueba' } });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/¡Mensaje Enviado!/i)).toBeInTheDocument();
      expect(screen.getByText(/Gracias por contactarnos. Te responderemos pronto./i)).toBeInTheDocument();
    });
  });

  it('limpia el formulario después de mostrar el mensaje de éxito', async () => {
    vi.useFakeTimers();
    render(<Contact />);
    
    const nameInput = screen.getByPlaceholderText(/Tu nombre/i);
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i);
    const subjectInput = screen.getByPlaceholderText(/¿En qué podemos ayudarte?/i);
    const messageInput = screen.getByPlaceholderText(/Escribe tu mensaje aquí.../i);
    const submitButton = screen.getByRole('button', { name: /Enviar Mensaje/i });
    
    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Consulta' } });
    fireEvent.change(messageInput, { target: { value: 'Mensaje' } });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/¡Mensaje Enviado!/i)).toBeInTheDocument();
    });
    

    vi.advanceTimersByTime(3000);
    
    await waitFor(() => {
      const newNameInput = screen.getByPlaceholderText(/Tu nombre/i);
      expect(newNameInput.value).toBe('');
    });
    
    vi.useRealTimers();
  });

  it('muestra la sección de preguntas frecuentes', () => {
    render(<Contact />);
    
    expect(screen.getByText(/Preguntas Frecuentes/i)).toBeInTheDocument();
    expect(screen.getByText(/¿Cómo puedo reportar contenido inapropiado?/i)).toBeInTheDocument();
    expect(screen.getByText(/¿Cómo elimino mi cuenta?/i)).toBeInTheDocument();
    expect(screen.getByText(/¿Puedo sugerir nuevas funcionalidades?/i)).toBeInTheDocument();
    expect(screen.getByText(/¿Cómo puedo colaborar con ReviewVerso?/i)).toBeInTheDocument();
  });

  it('muestra el botón de enviar mensaje', () => {
    render(<Contact />);
    
    const submitButton = screen.getByRole('button', { name: /Enviar Mensaje/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('todos los campos del formulario son requeridos', () => {
    render(<Contact />);
    
    const nameInput = screen.getByPlaceholderText(/Tu nombre/i);
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i);
    const subjectInput = screen.getByPlaceholderText(/¿En qué podemos ayudarte?/i);
    const messageInput = screen.getByPlaceholderText(/Escribe tu mensaje aquí.../i);
    
    expect(nameInput).toBeRequired();
    expect(emailInput).toBeRequired();
    expect(subjectInput).toBeRequired();
    expect(messageInput).toBeRequired();
  });

  it('el campo de email tiene el tipo correcto', () => {
    render(<Contact />);
    
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i);
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('el campo de mensaje es un textarea', () => {
    render(<Contact />);
    
    const messageInput = screen.getByPlaceholderText(/Escribe tu mensaje aquí.../i);
    expect(messageInput.tagName).toBe('TEXTAREA');
  });
});
