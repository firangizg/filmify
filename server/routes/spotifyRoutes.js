// Routes for Spotify API
import express from 'express';
import { login, callback, fetchTopTracks, fetchTopArtists, fetchTopGenres, fetchTrackFeatures } from '../controllers/spotifyController.js';

const router = express.Router();

// Route for Spotify login
router.get('/login', login);

// Route for handling the callback from Spotify
router.get('/callback', callback);

// Route for fetching top tracks
router.get('/top-tracks', fetchTopTracks);

// Route for fetching top artists
router.get('/top-artists', fetchTopArtists);

// Route for fetching top genres
router.get('/top-genres', fetchTopGenres);

// Route for fetching track features
router.get('/track-features', fetchTrackFeatures);

export default router;