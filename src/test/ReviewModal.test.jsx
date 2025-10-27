import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReviewModal from '../components/review/ReviewModal';

describe('ReviewModal', () => {
  it('no renderiza nada si open es false', () => {
    render(<ReviewModal open={false} onClose={() => {}} onSubmit={() => {}} />);
    expect(screen.queryByText('Escribir Reseña')).not.toBeInTheDocument();
  });

  it('renderiza correctamente cuando open es true', () => {
    render(<ReviewModal open={true} onClose={() => {}} onSubmit={() => {}} />);
    expect(screen.getByText('Escribir Reseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Cerrar')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Título de la reseña')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escribe tu reseña...')).toBeInTheDocument();
    expect(screen.getByText('Enviar reseña')).toBeInTheDocument();
  });

  it('llama a onClose al hacer click en cerrar', () => {
    const onClose = vi.fn();
    const { container } = render(<ReviewModal open={true} onClose={onClose} onSubmit={() => {}} />);
    fireEvent.click(container.querySelector('button[aria-label="Cerrar"]'));
    expect(onClose).toHaveBeenCalled();
  });

  it('llama a onSubmit con los datos correctos', () => {
    const onSubmit = vi.fn();
    const { container } = render(<ReviewModal open={true} onClose={() => {}} onSubmit={onSubmit} />);
    // Seleccionar 4 estrellas
    fireEvent.click(container.querySelectorAll('.review-modal__star')[3]);
    // Escribir título
    fireEvent.change(container.querySelector('input[placeholder="Título de la reseña"]'), { target: { value: 'Mi título' } });
    // Escribir cuerpo
    fireEvent.change(container.querySelector('textarea[placeholder="Escribe tu reseña..."]'), { target: { value: 'Mi reseña' } });
    // Enviar
    fireEvent.click(container.querySelector('button.review-modal__button'));
    expect(onSubmit).toHaveBeenCalledWith({ rating: 4, title: 'Mi título', body: 'Mi reseña' });
  });
});
