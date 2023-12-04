import express from 'express';
import movieController from '../controllers/movieController.js';

const router = express.Router();

router.get('/fetch-movies', movieController.getMovies);

export default router;