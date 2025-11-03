import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CookiePolicy from '../pages/legal/CookiePolicy';

describe('CookiePolicy', () => {
  beforeEach(() => {

    localStorage.clear();

    vi.clearAllMocks();
  });

  const renderWithRouter = (component) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it('renderiza el título principal', () => {
    renderWithRouter(<CookiePolicy />);
    
    expect(screen.getByText(/Política de Cookies/i)).toBeInTheDocument();
    expect(screen.getByText(/Información sobre el uso de cookies en ReviewVerso/i)).toBeInTheDocument();
  });

  it('muestra la fecha de última actualización', () => {
    renderWithRouter(<CookiePolicy />);
    
    expect(screen.getByText(/Última actualización: Noviembre 2025/i)).toBeInTheDocument();
  });

  it('muestra la explicación de qué son las cookies', () => {
    renderWithRouter(<CookiePolicy />);
    
    expect(screen.getByText(/¿Qué son las cookies?/i)).toBeInTheDocument();
    expect(screen.getByText(/pequeños archivos de texto/i)).toBeInTheDocument();
  });

  it('muestra la sección de cómo se usan las cookies', () => {
    renderWithRouter(<CookiePolicy />);
    
    expect(screen.getByText(/¿Cómo usamos las cookies?/i)).toBeInTheDocument();
  });

  it('muestra todos los tipos de cookies', () => {
    renderWithRouter(<CookiePolicy />);
    
    expect(screen.getByText(/🔒 Cookies Necesarias/i)).toBeInTheDocument();
    expect(screen.getByText(/⚙️ Cookies Funcionales/i)).toBeInTheDocument();
    expect(screen.getByText(/📊 Cookies Analíticas/i)).toBeInTheDocument();
    expect(screen.getByText(/🎯 Cookies de Publicidad/i)).toBeInTheDocument();
  });

  it('muestra las cookies necesarias como obligatorias', () => {
    renderWithRouter(<CookiePolicy />);
    
    expect(screen.getByText(/Obligatorias/i)).toBeInTheDocument();
  });

  it('muestra las cookies opcionales', () => {
    renderWithRouter(<CookiePolicy />);
    
    const optionalBadges = screen.getAllByText(/Opcionales/i);
    expect(optionalBadges.length).toBe(3); // Funcionales, Analíticas, Publicidad
  });

  it('muestra ejemplos específicos de cookies necesarias', () => {
    renderWithRouter(<CookiePolicy />);
    
    expect(screen.getByText(/authToken:/i)).toBeInTheDocument();
    expect(screen.getByText(/XSRF-TOKEN:/i)).toBeInTheDocument();
    expect(screen.getByText(/cookieConsent:/i)).toBeInTheDocument();
  });

  it('muestra ejemplos de cookies funcionales', () => {
    renderWithRouter(<CookiePolicy />);
    
    expect(screen.getByText(/userPreferences:/i)).toBeInTheDocument();
    expect(screen.getByText(/theme:/i)).toBeInTheDocument();
  });

  it('muestra ejemplos de cookies analíticas (Google Analytics)', () => {
    renderWithRouter(<CookiePolicy />);
    
    expect(screen.getByText(/_ga:/i)).toBeInTheDocument();
    expect(screen.getByText(/_gid:/i)).toBeInTheDocument();
  });

  it('muestra el panel de gestión de cookies', () => {
    renderWithRouter(<CookiePolicy />);
    
    expect(screen.getByText(/Gestión de Cookies/i)).toBeInTheDocument();
    expect(screen.getByText(/Sus Preferencias de Cookies/i)).toBeInTheDocument();
  });

  it('las cookies necesarias no se pueden desactivar', () => {
    renderWithRouter(<CookiePolicy />);
    
    expect(screen.getByText(/Siempre activas - Requeridas para el funcionamiento del sitio/i)).toBeInTheDocument();
  });

  it('permite activar/desactivar cookies funcionales', () => {
    renderWithRouter(<CookiePolicy />);
    
    const functionalToggle = screen.getAllByRole('button').find(btn => 
      btn.closest('.cookie-policy__preference-item')?.textContent.includes('Cookies Funcionales')
    );
    
    expect(functionalToggle).toBeInTheDocument();
    
    // Debería poder hacer clic
    fireEvent.click(functionalToggle);
  });

  it('permite activar/desactivar cookies analíticas', () => {
    renderWithRouter(<CookiePolicy />);
    
    const analyticsToggle = screen.getAllByRole('button').find(btn => 
      btn.closest('.cookie-policy__preference-item')?.textContent.includes('Cookies Analíticas')
    );
    
    expect(analyticsToggle).toBeInTheDocument();
    fireEvent.click(analyticsToggle);
  });

  it('permite activar/desactivar cookies de publicidad', () => {
    renderWithRouter(<CookiePolicy />);
    
    const advertisingToggle = screen.getAllByRole('button').find(btn => 
      btn.closest('.cookie-policy__preference-item')?.textContent.includes('Cookies de Publicidad')
    );
    
    expect(advertisingToggle).toBeInTheDocument();
    fireEvent.click(advertisingToggle);
  });

  it('muestra el botón de guardar preferencias', () => {
    renderWithRouter(<CookiePolicy />);
    
    const saveButton = screen.getByText(/Guardar Preferencias/i);
    expect(saveButton).toBeInTheDocument();
  });

  it('guarda las preferencias en localStorage al hacer clic en guardar', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    renderWithRouter(<CookiePolicy />);
    
    const saveButton = screen.getByText(/Guardar Preferencias/i);
    fireEvent.click(saveButton);
    
    expect(localStorage.getItem('cookiePreferences')).toBeTruthy();
    expect(alertMock).toHaveBeenCalledWith('Preferencias guardadas correctamente');
    
    alertMock.mockRestore();
  });

  it('muestra instrucciones para diferentes navegadores', () => {
    renderWithRouter(<CookiePolicy />);
    
    expect(screen.getByText(/Google Chrome:/i)).toBeInTheDocument();
    expect(screen.getByText(/Mozilla Firefox:/i)).toBeInTheDocument();
    expect(screen.getByText(/Safari:/i)).toBeInTheDocument();
    expect(screen.getByText(/Microsoft Edge:/i)).toBeInTheDocument();
  });

  it('muestra la sección de cookies de terceros', () => {
    renderWithRouter(<CookiePolicy />);
    
    expect(screen.getByText(/Cookies de Terceros/i)).toBeInTheDocument();
    expect(screen.getByText(/Google Analytics:/i)).toBeInTheDocument();
    expect(screen.getByText(/TMDB API:/i)).toBeInTheDocument();
    expect(screen.getByText(/IGDB API:/i)).toBeInTheDocument();
    expect(screen.getByText(/OpenLibrary API:/i)).toBeInTheDocument();
  });

  it('muestra la sección de actualización de la política', () => {
    renderWithRouter(<CookiePolicy />);
    
    expect(screen.getByText(/Actualización de la Política/i)).toBeInTheDocument();
  });

  it('muestra la sección de contacto', () => {
    renderWithRouter(<CookiePolicy />);
    
    expect(screen.getByText(/privacy@reviewverso.com/i)).toBeInTheDocument();
    expect(screen.getByText(/\+34 900 000 000/i)).toBeInTheDocument();
  });

  it('muestra enlaces a otras políticas en el footer', () => {
    renderWithRouter(<CookiePolicy />);
    
    const privacyLinks = screen.getAllByText(/Política de Privacidad/i);
    const legalLinks = screen.getAllByText(/Aviso Legal/i);
    
    expect(privacyLinks.length).toBeGreaterThan(0);
    expect(legalLinks.length).toBeGreaterThan(0);
  });

  it('los enlaces tienen href correctos', () => {
    renderWithRouter(<CookiePolicy />);
    
    const links = screen.getAllByRole('link');
    const privacyLinks = links.filter(link => link.href.includes('/politica-privacidad'));
    const legalLinks = links.filter(link => link.href.includes('/aviso-legal'));
    
    expect(privacyLinks.length).toBeGreaterThan(0);
    expect(legalLinks.length).toBeGreaterThan(0);
  });

  it('cambia el estado del toggle al hacer clic', () => {
    renderWithRouter(<CookiePolicy />);
    
    const functionalToggle = screen.getAllByRole('button').find(btn => 
      btn.closest('.cookie-policy__preference-item')?.textContent.includes('Cookies Funcionales')
    );
    
    // Verificar estado inicial
    expect(functionalToggle).toHaveClass('cookie-policy__toggle');
    
    // Hacer clic para activar
    fireEvent.click(functionalToggle);
    
    // Verificar que cambió el estado (debería tener la clase active)
    expect(functionalToggle).toHaveClass('cookie-policy__toggle--active');
  });

  it('muestra información sobre duración de cookies', () => {
    renderWithRouter(<CookiePolicy />);
    
    expect(screen.getByText(/duración: sesión/i)).toBeInTheDocument();
    expect(screen.getByText(/duración: 1 año/i)).toBeInTheDocument();
  });
});
