// Handles specific interactions with the Spotify API
import axios from 'axios';
import config from '../config.js';

// Service for interacting with the Spotify API
class SpotifyService {
    // Get tokens from Spotify API
    static async getTokens(code) {
        const params = new URLSearchParams();
        params.append('code', code);
        params.append('redirect_uri', `${config.serverBaseUrl}/callback`);
        params.append('grant_type', 'authorization_code');

        try {
            const response = await axios.post('https://accounts.spotify.com/api/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${config.spotifyClientId}:${config.spotifyClientSecret}`).toString('base64')
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error getting tokens from Spotify API');
        }
    }
    // Fetch top tracks from Spotify API
    static async fetchTopTracks(accessToken) {
        try {
            const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error fetching top tracks from Spotify API');
        }
    }

    // Fetch top artists from Spotify API
    static async fetchTopArtists(accessToken) {
        try {
            const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error fetching top artists from Spotify API');
        }
    }

    // Fetch top genres from Spotify API
    static async fetchTopGenres(accessToken) {
        try {
            const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            });

            const genreCounts = {};
            for (let artist of response.data.items) {
            for (let genre of artist.genres) {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            }
            }

            return genreCounts;
        } catch (error) {
            console.error('Error fetching top genres in service:', error);
            throw new Error('Failed to fetch top genres');
        }
    }

    // Fetch audio features for top tracks from Spotify API
    static async fetchTrackFeatures(accessToken) {
        try {
            const topTracksData = await this.fetchTopTracks(accessToken);
            const trackIds = topTracksData.items.map(track => track.id);
            const audioFeaturesResponse = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return audioFeaturesResponse.data.audio_features;
        } catch (error) {
            throw new Error('Error fetching track features from Spotify API');
        }
    }
}

export default SpotifyService;