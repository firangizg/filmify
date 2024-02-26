// Controller for handling Spotify API requests
import SpotifyService from '../services/spotifyService.js';
import config from '../config.js'; 
import logger from '../logger.js';

// Controller for handling Spotify login
export const login = (req, res) => {
    const scopes = 'user-library-read user-read-recently-played user-top-read';
    const redirectUri = `${config.serverBaseUrl}/callback`;
    res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${config.spotifyClientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`);
};

// Controller for handling Spotify callback
export const callback = async (req, res) => {
    const code = req.query.code || null;

    try {
        const tokens = await SpotifyService.getTokens(code);
        const { access_token, refresh_token } = tokens;
        res.redirect(`${config.clientBaseUrl}/logged_in?access_token=${access_token}&refresh_token=${refresh_token}`);
    } catch (error) {
        logger.error('Error in Spotify callback', error);
        res.redirect(`${config.clientBaseUrl}/error`);
    }
};

// Controller for fetching top tracks
export const fetchTopTracks = async (req, res) => {
    try {
        const data = await SpotifyService.fetchTopTracks(req.query.access_token);
        res.json(data);
    } catch (error) {
        logger.error('Error fetching top tracks', error);
        res.status(500).json({ error: "Failed to fetch top tracks" });
    }
};

// Controller for fetching top artists
export const fetchTopArtists = async (req, res) => {
    try {
        const data = await SpotifyService.fetchTopArtists(req.query.access_token);
        res.json(data);
    } catch (error) {
        logger.error('Error fetching top artists', error);
        res.status(500).json({ error: "Failed to fetch top artists" });
    }
};

// Controller for fetching top genres
export const fetchTopGenres = async (req, res) => {
    try {
        const genreCounts = await SpotifyService.fetchTopGenres(req.query.access_token);
        const topGenres = Object.entries(genreCounts).sort(([, a], [, b]) => b - a).map(([genre]) => genre);
        res.json({ genres: topGenres });
    } catch (error) {
        logger.error('Error fetching top genres', error);
        res.status(500).json({ error: "Failed to fetch top genres" });
    }
};

// Controller for fetching top track features
export const fetchTrackFeatures = async (req, res) => {
    try {
        const features = await SpotifyService.fetchTrackFeatures(req.query.access_token);
        const averages = features.reduce((acc, feature) => ({
            tempo: acc.tempo + feature.tempo,
            danceability: acc.danceability + feature.danceability,
            acousticness: acc.acousticness + feature.acousticness,
            happiness: acc.happiness + feature.valence,
            energy: acc.energy + feature.energy,
            speechiness: acc.speechiness + feature.speechiness,
            loudness: acc.loudness + feature.loudness, 
            liveness: acc.liveness + feature.liveness  
        }), {
            tempo: 0,
            danceability: 0,
            acousticness: 0,
            happiness: 0,
            energy: 0,
            speechiness: 0,
            loudness: 0,
            liveness: 0
        });

        Object.keys(averages).forEach(key => averages[key] /= features.length);
        res.json(averages);
    } catch(error) {
        logger.error('Error fetching track features:', error);
        res.status(500).json({ error: "Failed to fetch track features and calculate averages" });
    }
};