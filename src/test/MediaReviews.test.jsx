import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MediaReviews from '../components/review/MediaReviews';

const mockStore = configureStore([]);

const defaultState = {
  auth: {
    isAuthenticated: true,
    token: 'fake-token',
    user: { id: 'user1', username: 'testuser' }
  }
};

const reviewsMock = [
  {
    idReview: 'r1',
    userName: 'Usuario1',
    reviewTitle: 'Título 1',
    reviewText: 'Texto corto',
    rating: 4,
    likeCount: 2,
    createdAt: '2023-10-27T12:00:00Z',
    userProfileImageUrl: '',
  },
  {
    idReview: 'r2',
    userName: 'Usuario2',
    reviewTitle: 'Título 2',
    reviewText: 'Texto largo '.repeat(30),
    rating: 5,
    likeCount: 0,
    createdAt: '2023-10-26T12:00:00Z',
    userProfileImageUrl: '',
  }
];

vi.mock('../api/services/ReviewService', () => {
  return {
    default: class {
      getReviewsByContent = vi.fn().mockResolvedValue({ success: true, data: reviewsMock });
      likeReview = vi.fn().mockResolvedValue({ success: true });
      unlikeReview = vi.fn().mockResolvedValue({ success: true });
      createReview = vi.fn().mockResolvedValue({ success: true, data: reviewsMock[0] });
    }
  };
});

describe('MediaReviews', () => {
  it('muestra las reseñas y el botón leer más', async () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <MediaReviews contentType="MOVIE" contentId="123" />
      </Provider>
    );
    const titulos1 = await screen.findAllByText((content) => content.includes('Título 1'));
    const titulos2 = await screen.findAllByText((content) => content.includes('Título 2'));
    console.log('Titulos encontrados:', titulos1.length, titulos2.length);
    expect(titulos1.length).toBeGreaterThan(0);
    expect(titulos2.length).toBeGreaterThan(0);

    const leerMasBtns = await screen.findAllByText((content) => content.includes('Leer más'));
    expect(leerMasBtns.length).toBeGreaterThan(0);
    fireEvent.click(leerMasBtns[0]);
    const leerMenosBtns = await screen.findAllByText((content) => content.includes('Leer menos'));
    expect(leerMenosBtns.length).toBeGreaterThan(0);
  });

  it('muestra el contador de likes y permite dar like', async () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <MediaReviews contentType="MOVIE" contentId="123" />
      </Provider>
    );
    const likes2 = await screen.findAllByText((content) => content.trim() === '2');
    console.log('Likes encontrados:', likes2.length);
    expect(likes2.length).toBeGreaterThan(0);
    const likeButtons = screen.getAllByLabelText(/like/i);
    fireEvent.click(likeButtons[0]);
    const likes3 = await screen.findAllByText((content) => content.trim() === '3');
    expect(likes3.length).toBeGreaterThan(0);
  });

  it('abre y cierra el modal de escribir reseña', async () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <MediaReviews contentType="MOVIE" contentId="123" />
      </Provider>
    );
    const writeReviewButtons = screen.queryAllByText((content) => content.includes('Escribir Reseña'));
    fireEvent.click(writeReviewButtons[0]);
    await waitFor(() => {
      expect(screen.queryAllByText((content) => content.includes('Enviar reseña')).length).toBeGreaterThan(0);
    });
    fireEvent.click(screen.getByLabelText('Cerrar'));
    await waitFor(() => {
      expect(screen.queryAllByText((content) => content.includes('Enviar reseña')).length).toBe(0);
    });
  });
});
