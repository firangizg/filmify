// Movie routes
import express from 'express';
import movieController from '../controllers/movieController.js';

// Create router
const router = express.Router();

// Routes
router.get('/fetch-movies', movieController.getMovies);

router.get('/fetch-movies-from-db', movieController.getMoviesFromDB);

router.get('/fetch-genre', movieController.getGenre);

router.get('/fetch-artist-movies-from-db', movieController.getArtistMoviesFromDB);
export default router;