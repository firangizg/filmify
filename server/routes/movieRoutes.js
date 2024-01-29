// Movie routes
import express from 'express';
import movieController from '../controllers/movieController.js';

// Create router
const router = express.Router();

// Routes
router.get('/fetch-movies', movieController.getMovies);

export default router;