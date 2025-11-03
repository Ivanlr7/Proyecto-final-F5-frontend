import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LegalNotice from '../pages/legal/LegalNotice';

describe('LegalNotice', () => {
  const renderWithRouter = (component) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it('renderiza el título principal', () => {
    renderWithRouter(<LegalNotice />);
    
    expect(screen.getByText(/Aviso Legal/i)).toBeInTheDocument();
    expect(screen.getByText(/Información legal sobre ReviewVerso/i)).toBeInTheDocument();
  });

  it('muestra la fecha de última actualización', () => {
    renderWithRouter(<LegalNotice />);
    
    expect(screen.getByText(/Última actualización: Noviembre 2025/i)).toBeInTheDocument();
  });

  it('muestra la sección de información general', () => {
    renderWithRouter(<LegalNotice />);
    
    expect(screen.getByText(/1. Información General/i)).toBeInTheDocument();
    expect(screen.getByText(/ReviewVerso S.L./i)).toBeInTheDocument();
    expect(screen.getByText(/B-12345678/i)).toBeInTheDocument();
    expect(screen.getByText(/legal@reviewverso.com/i)).toBeInTheDocument();
  });

  it('muestra la sección de objeto', () => {
    renderWithRouter(<LegalNotice />);
    
    expect(screen.getByText(/2. Objeto/i)).toBeInTheDocument();
    expect(screen.getByText(/ReviewVerso es una plataforma digital/i)).toBeInTheDocument();
  });

  it('muestra la sección de condiciones de uso', () => {
    renderWithRouter(<LegalNotice />);
    
    expect(screen.getByText(/3. Condiciones de Uso/i)).toBeInTheDocument();
    expect(screen.getByText(/3.1 Acceso y Registro/i)).toBeInTheDocument();
    expect(screen.getByText(/3.2 Responsabilidad del Usuario/i)).toBeInTheDocument();
    expect(screen.getByText(/3.3 Contenido Generado por Usuarios/i)).toBeInTheDocument();
  });

  it('muestra la sección de propiedad intelectual', () => {
    renderWithRouter(<LegalNotice />);
    
    expect(screen.getByText(/4. Propiedad Intelectual/i)).toBeInTheDocument();
  });

  it('muestra la sección de protección de datos', () => {
    renderWithRouter(<LegalNotice />);
    
    expect(screen.getByText(/5. Protección de Datos/i)).toBeInTheDocument();
    expect(screen.getByText(/RGPD/i)).toBeInTheDocument();
  });

  it('muestra la sección de exclusión de garantías', () => {
    renderWithRouter(<LegalNotice />);
    
    expect(screen.getByText(/6. Exclusión de Garantías y Responsabilidad/i)).toBeInTheDocument();
  });

  it('muestra la sección de enlaces a terceros', () => {
    renderWithRouter(<LegalNotice />);
    
    expect(screen.getByText(/7. Enlaces a Terceros/i)).toBeInTheDocument();
    expect(screen.getByText(/TMDB/i)).toBeInTheDocument();
    expect(screen.getByText(/IGDB/i)).toBeInTheDocument();
    expect(screen.getByText(/OpenLibrary/i)).toBeInTheDocument();
  });

  it('muestra la sección de modificaciones', () => {
    renderWithRouter(<LegalNotice />);
    
    expect(screen.getByText(/8. Modificaciones/i)).toBeInTheDocument();
  });

  it('muestra la sección de legislación aplicable', () => {
    renderWithRouter(<LegalNotice />);
    
    expect(screen.getByText(/9. Legislación Aplicable y Jurisdicción/i)).toBeInTheDocument();
    expect(screen.getByText(/legislación española/i)).toBeInTheDocument();
  });

  it('muestra la sección de contacto', () => {
    renderWithRouter(<LegalNotice />);
    
    expect(screen.getByText(/10. Contacto/i)).toBeInTheDocument();
  });

  it('muestra información de contacto completa', () => {
    renderWithRouter(<LegalNotice />);
    
    expect(screen.getAllByText(/legal@reviewverso.com/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/\+34 900 000 000/i)).toBeInTheDocument();
    expect(screen.getByText(/Calle Ejemplo, 123, 28001 Madrid, España/i)).toBeInTheDocument();
  });

  it('muestra enlaces a otras políticas en el footer', () => {
    renderWithRouter(<LegalNotice />);
    
    const privacyLinks = screen.getAllByText(/Política de Privacidad/i);
    const cookieLinks = screen.getAllByText(/Política de Cookies/i);
    
    expect(privacyLinks.length).toBeGreaterThan(0);
    expect(cookieLinks.length).toBeGreaterThan(0);
  });

  it('los enlaces a políticas tienen href correctos', () => {
    renderWithRouter(<LegalNotice />);
    
    const links = screen.getAllByRole('link');
    const privacyLinks = links.filter(link => link.href.includes('/politica-privacidad'));
    const cookieLinks = links.filter(link => link.href.includes('/politica-cookies'));
    
    expect(privacyLinks.length).toBeGreaterThan(0);
    expect(cookieLinks.length).toBeGreaterThan(0);
  });

  it('muestra las responsabilidades del usuario', () => {
    renderWithRouter(<LegalNotice />);
    
    expect(screen.getByText(/Utilizar la plataforma de manera lícita/i)).toBeInTheDocument();
    expect(screen.getByText(/No publicar contenido ofensivo/i)).toBeInTheDocument();
    expect(screen.getByText(/Mantener la confidencialidad de sus credenciales/i)).toBeInTheDocument();
  });

  it('muestra información sobre contenido generado por usuarios', () => {
    renderWithRouter(<LegalNotice />);
    
    expect(screen.getByText(/Los usuarios son responsables del contenido que publican/i)).toBeInTheDocument();
  });

  it('menciona el domicilio social', () => {
    renderWithRouter(<LegalNotice />);
    
    expect(screen.getByText(/Calle Ejemplo, 123, 28001 Madrid, España/i)).toBeInTheDocument();
  });
});
