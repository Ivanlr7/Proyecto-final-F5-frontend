import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../components/footer/Footer';


describe('Footer', () => {
  it('muestra el nombre de la marca', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/ReviewVerso/i).length).toBeGreaterThan(0);
  });

  it('muestra los enlaces de navegación', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/Contacto/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Aviso Legal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Política de Cookies/i).length).toBeGreaterThan(0);
  });

  it('muestra el año actual', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    const year = new Date().getFullYear();
    const yearElements = screen.getAllByText(new RegExp(`${year}`));
    expect(yearElements.length).toBeGreaterThan(0);
  });
});
