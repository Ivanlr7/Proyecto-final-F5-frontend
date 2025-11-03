import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../pages/notFound/NotFound';

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('NotFound', () => {
  const renderWithRouter = (component) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renderiza el número 404', () => {
    renderWithRouter(<NotFound />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renderiza el título principal', () => {
    renderWithRouter(<NotFound />);
    
    expect(screen.getByText(/Página no encontrada/i)).toBeInTheDocument();
  });

  it('renderiza el subtítulo con referencia a ReviewVerso', () => {
    renderWithRouter(<NotFound />);
    
    expect(screen.getByText(/¿Te has perdido por el ReviewVerso?/i)).toBeInTheDocument();
  });

  it('renderiza el mensaje descriptivo', () => {
    renderWithRouter(<NotFound />);
    
    expect(screen.getByText(/Lo sentimos, la página que estás buscando no existe/i)).toBeInTheDocument();
  });

  it('muestra el botón "Volver atrás"', () => {
    renderWithRouter(<NotFound />);
    
    const backButton = screen.getByRole('button', { name: /Volver atrás/i });
    expect(backButton).toBeInTheDocument();
  });

  it('muestra el enlace "Ir al inicio"', () => {
    renderWithRouter(<NotFound />);
    
    const homeLink = screen.getByRole('link', { name: /Ir al inicio/i });
    expect(homeLink).toBeInTheDocument();
  });

  it('el enlace "Ir al inicio" apunta a la raíz', () => {
    renderWithRouter(<NotFound />);
    
    const homeLink = screen.getByRole('link', { name: /Ir al inicio/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('ejecuta navigate(-1) al hacer clic en "Volver atrás"', () => {
    renderWithRouter(<NotFound />);
    
    const backButton = screen.getByRole('button', { name: /Volver atrás/i });
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('muestra el ícono de FileQuestion', () => {
    renderWithRouter(<NotFound />);
    
    // Verificar que existe el contenedor del ícono
    const iconContainer = document.querySelector('.not-found__icon');
    expect(iconContainer).toBeInTheDocument();
  });

  it('tiene la clase correcta para el contenedor principal', () => {
    renderWithRouter(<NotFound />);
    
    const container = document.querySelector('.not-found');
    expect(container).toBeInTheDocument();
  });

  it('el botón "Volver atrás" tiene la clase secondary', () => {
    renderWithRouter(<NotFound />);
    
    const backButton = screen.getByRole('button', { name: /Volver atrás/i });
    expect(backButton).toHaveClass('not-found__btn--secondary');
  });

  it('el enlace "Ir al inicio" tiene la clase primary', () => {
    renderWithRouter(<NotFound />);
    
    const homeLink = screen.getByRole('link', { name: /Ir al inicio/i });
    expect(homeLink).toHaveClass('not-found__btn--primary');
  });

  it('ambos botones están dentro del contenedor de acciones', () => {
    renderWithRouter(<NotFound />);
    
    const actionsContainer = document.querySelector('.not-found__actions');
    expect(actionsContainer).toBeInTheDocument();
    
    const backButton = screen.getByRole('button', { name: /Volver atrás/i });
    const homeLink = screen.getByRole('link', { name: /Ir al inicio/i });
    
    expect(actionsContainer).toContainElement(backButton);
    expect(actionsContainer).toContainElement(homeLink);
  });

  it('el número 404 tiene la clase correcta', () => {
    renderWithRouter(<NotFound />);
    
    const number = screen.getByText('404');
    expect(number).toHaveClass('not-found__number');
  });

  it('renderiza correctamente el contenido principal', () => {
    renderWithRouter(<NotFound />);
    
    const content = document.querySelector('.not-found__content');
    expect(content).toBeInTheDocument();
  });

  it('muestra iconos en los botones', () => {
    renderWithRouter(<NotFound />);
    
    // Los iconos de lucide-react se renderizan como SVG
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });
});
