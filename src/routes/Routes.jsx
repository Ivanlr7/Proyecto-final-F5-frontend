import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home/HomePage';
import About from '../pages/about/About';
import Contact from '../pages/contact/Contact';
import RegisterPage from '../pages/register/RegisterPage';
import LoginPage from '../pages/login/LoginPage';
import UserPage from '../pages/user/UserPage';
import MoviesPage from '../pages/movies/moviesPage/MoviesPage';
import MovieDetailsPage from '../pages/movies/MovieDetails/MovieDetailsPage';
import ShowsPage from '../pages/shows/showsPage/ShowsPage';
import ShowDetailsPage from '../pages/shows/ShowDetails/ShowDetailsPage';
import VideogamesPage from '../pages/videogames/videogamesPage/VideogamesPage';
import VideogameDetailsPage from '../pages/videogames/videogameDetails/VideogameDetailsPage';
import BooksPage from '../pages/books/booksPage/BooksPage';
import BookDetailsPage from '../pages/books/BookDetails/BookDetailsPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/me" element={<UserPage />} />
    <Route path="/peliculas" element={<MoviesPage />} />
    <Route path="/peliculas/:id" element={<MovieDetailsPage />} />
    <Route path="/series" element={<ShowsPage />} />
    <Route path="/series/:id" element={<ShowDetailsPage />} />
    <Route path="/videojuegos" element={<VideogamesPage />} />
    <Route path="/videojuegos/:id" element={<VideogameDetailsPage />} />
    <Route path="/libros" element={<BooksPage />} />
    <Route path="/libros/:id" element={<BookDetailsPage />} />
  </Routes>
);

export default AppRoutes;
