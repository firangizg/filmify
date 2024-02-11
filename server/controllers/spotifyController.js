// Controller for handling Spotify login, HTTP requests and responses
import axios from 'axios';
import config from '../config.js'; 

// Controller for handling Spotify login
export const login = (req, res) => {
    const scopes = 'user-library-read user-read-recently-played user-top-read';
    const redirectUri = `${config.serverBaseUrl}/callback`;
    res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${config.spotifyClientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`);
};

// Controller for handling Spotify callback
export const callback  = async (req, res) => {
    const code = req.query.code || null;

    try {
        const params = new URLSearchParams();
        params.append('code', code);
        params.append('redirect_uri', `${config.serverBaseUrl}/callback`);
        params.append('grant_type', 'authorization_code');

        const response = await axios.post('https://accounts.spotify.com/api/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${config.spotifyClientId}:${config.spotifyClientSecret}`).toString('base64')
            }
        });

        const { access_token, refresh_token } = response.data;
        // Redirect to client with tokens
        res.redirect(`${config.clientBaseUrl}/logged_in?access_token=${access_token}&refresh_token=${refresh_token}`);
    } catch (error) {
        console.error('Error in Spotify callback', error);
        res.redirect(`${config.clientBaseUrl}/error`);
    }
};

// Controller for fetching top tracks
export const fetchTopTracks = async (req, res) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: {
                'Authorization': `Bearer ${req.query.access_token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        // Check if the error is due to an expired token
        if (error.response && error.response.status === 401) {
            // Token expired, redirect to session expired page
            res.redirect(`${config.clientBaseUrl}/expired`);
        } else {
            console.error('Error fetching top tracks', error);
            res.status(500).json({ error: "Failed to fetch top tracks" });
        }
    }
};

// Controller for fetching top artists
export const fetchTopArtists = async (req, res) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: {
                'Authorization': `Bearer ${req.query.access_token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token expired, redirect to session expired page
            res.redirect(`${config.clientBaseUrl}/expired`);
        } else {
            console.error('Error fetching top artists', error);
            res.status(500).json({ error: "Failed to fetch top artists" });
        }
    }
};

// Controller for fetching top genres
export const fetchTopGenres = async (req, res) => {
    try {
        const { data } = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: {
                'Authorization': 'Bearer ' + req.query.access_token
            }
        });

        const genreCounts = {};
        for (let artist of data.items) {
            for (let genre of artist.genres) {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            }
        }

        const topGenres = Object.entries(genreCounts).sort(([,a], [,b]) => b - a).map(([genre]) => genre);
        res.json({ genres: topGenres });

    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token expired, redirect to session expired page
            res.redirect(`${config.clientBaseUrl}/expired`);
        } else {
            console.error('Error fetching top genres', error);
            res.status(500).json({ error: "Failed to fetch top genres" });
        }
    }
};

// Controller for fetching track features
export const fetchTrackFeatures = async (req, res) => {
    try {
        // Fetch top 20 tracks
        const { data } = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=20', {
            headers: {
                'Authorization': 'Bearer ' + req.query.access_token
            }
        });
  
        // Extract track IDs from top tracks
        const trackIds = data.items.map(track => track.id);
  
        // Fetch audio features for these tracks
        const audioFeaturesResponse = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`, {
            headers: {
                'Authorization': 'Bearer ' + req.query.access_token
            }
        });
  
        const features = audioFeaturesResponse.data.audio_features;
  
        // Calculate averages
        const totalFeatures = features.reduce((acc, feature) => ({
            tempo: acc.tempo + feature.tempo,
            danceability: acc.danceability + feature.danceability,
            acousticness: acc.acousticness + feature.acousticness,
            happiness: acc.happiness + feature.valence,
            energy: acc.energy + feature.energy,
            speechiness: acc.speechiness + feature.speechiness,
            loudness: acc.loudness + feature.loudness, // added
            liveness: acc.liveness + feature.liveness  // added
        }), {
            tempo: 0,
            danceability: 0,
            acousticness: 0,
            happiness: 0,
            energy: 0,
            speechiness: 0,
            loudness: 0,  // initialized
            liveness: 0   // initialized
        });
  
        const averages = {
            tempo: totalFeatures.tempo / features.length,
            danceability: totalFeatures.danceability / features.length,
            acousticness: totalFeatures.acousticness / features.length,
            happiness: totalFeatures.happiness / features.length,
            energy: totalFeatures.energy / features.length,
            speechiness: totalFeatures.speechiness / features.length,
            loudness: totalFeatures.loudness / features.length,  // calculated average
            liveness: totalFeatures.liveness / features.length   // calculated average
        };
  
        res.json(averages);
  
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token expired, redirect to session expired page
            res.redirect(`${config.clientBaseUrl}/expired`);
        } else {
            console.error('Error fetching track features:', error.response ? error.response.data : error.message);
            res.status(500).json({ error: "Failed to fetch track features and calculate averages" });
        }
    }
};
