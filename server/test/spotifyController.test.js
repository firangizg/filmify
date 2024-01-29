// spotifyController.test.js

import axios from 'axios';
import httpMocks from 'node-mocks-http';
import { login, callback, fetchTopTracks, fetchTopArtists, fetchTopGenres, fetchTrackFeatures } from '../controllers/spotifyController';
import config from '../config';

jest.mock('axios');
jest.mock('../config', () => ({
  serverBaseUrl: 'http://localhost:3000',
  clientBaseUrl: 'http://localhost:3001',
  spotifyClientId: 'client_id',
  spotifyClientSecret: 'client_secret'
}));

const setupMocks = () => {
  const req = httpMocks.createRequest();
  const res = httpMocks.createResponse();
  return { req, res };
};

describe('Spotify Controller', () => {
  describe('login', () => {
    it('redirects to Spotify auth with correct parameters', () => {
      const { req, res } = setupMocks();
      login(req, res);
      const redirectUrl = res._getRedirectUrl();
      expect(redirectUrl).toContain('https://accounts.spotify.com/authorize');
      expect(redirectUrl).toContain(`client_id=${config.spotifyClientId}`);
      expect(redirectUrl).toContain('response_type=code');
    });
  });

  describe('callback', () => {
    it('handles Spotify callback successfully', async () => {
      const { req, res } = setupMocks();
      req.query.code = 'testcode';
      axios.post.mockResolvedValue({
        data: { access_token: 'access_token', refresh_token: 'refresh_token' }
      });

      await callback(req, res);
      expect(res._getRedirectUrl()).toContain(config.clientBaseUrl);
      expect(res._getRedirectUrl()).toContain('access_token=access_token');
    });

    it('redirects to error page on failure', async () => {
      const { req, res } = setupMocks();
      req.query.code = 'testcode';
      axios.post.mockRejectedValue(new Error('Spotify API error'));

      await callback(req, res);
      expect(res._getRedirectUrl()).toEqual(`${config.clientBaseUrl}/error`);
    });
  });

  describe('fetchTopTracks', () => {
    it('returns top tracks on success', async () => {
      const { req, res } = setupMocks();
      req.query.access_token = 'access_token';
      axios.get.mockResolvedValue({ data: { items: ['track1', 'track2'] } });

      await fetchTopTracks(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toEqual({ items: ['track1', 'track2'] });
    });

    it('returns error on failure', async () => {
      const { req, res } = setupMocks();
      req.query.access_token = 'access_token';
      axios.get.mockRejectedValue(new Error('Failed to fetch'));

      await fetchTopTracks(req, res);
      expect(res._getStatusCode()).toBe(500);
      expect(res._getData()).toContain('Failed to fetch top tracks');
    });
  });

  describe('fetchTopArtists', () => {
    it('returns top artists on success', async () => {
      const { req, res } = setupMocks();
      req.query.access_token = 'access_token';
      axios.get.mockResolvedValue({ data: { items: ['artist1', 'artist2'] } });
  
      await fetchTopArtists(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toEqual({ items: ['artist1', 'artist2'] });
    });
  
    it('returns error on failure', async () => {
      const { req, res } = setupMocks();
      req.query.access_token = 'access_token';
      axios.get.mockRejectedValue(new Error('Failed to fetch'));
  
      await fetchTopArtists(req, res);
      expect(res._getStatusCode()).toBe(500);
      expect(res._getData()).toContain('Failed to fetch top artists');
    });
  });
  
  describe('fetchTopGenres', () => {
    it('returns top genres on success', async () => {
      const { req, res } = setupMocks();
      req.query.access_token = 'access_token';
      const mockArtistsData = {
        data: {
          items: [
            { genres: ['genre1', 'genre2'] },
            { genres: ['genre2', 'genre3'] }
          ]
        }
      };
      axios.get.mockResolvedValue(mockArtistsData);
  
      await fetchTopGenres(req, res);
      expect(res._getStatusCode()).toBe(200);
      // The response should include 'genre2' as the top genre since it appears twice
      expect(res._getData()).toEqual(expect.objectContaining({ genres: expect.arrayContaining(['genre2']) }));
    });
  
    it('returns error on failure', async () => {
      const { req, res } = setupMocks();
      req.query.access_token = 'access_token';
      axios.get.mockRejectedValue(new Error('Failed to fetch'));
  
      await fetchTopGenres(req, res);
      expect(res._getStatusCode()).toBe(500);
      expect(res._getData()).toContain('Failed to fetch top genres');
    });
  });
  
  describe('fetchTrackFeatures', () => {
    it('returns track features averages on success', async () => {
      const { req, res } = setupMocks();
      req.query.access_token = 'access_token';
      const mockTracksData = { data: { items: [{ id: 'track1' }, { id: 'track2' }] } };
      const mockFeaturesData = {
        data: {
          audio_features: [
            { danceability: 0.8, energy: 0.6 },
            { danceability: 0.7, energy: 0.7 }
          ]
        }
      };
      axios.get.mockResolvedValueOnce(mockTracksData).mockResolvedValueOnce(mockFeaturesData);
  
      await fetchTrackFeatures(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toEqual(expect.objectContaining({
        danceability: expect.any(Number),
        energy: expect.any(Number)
      }));
    });
  
    it('returns error on failure to fetch tracks', async () => {
      const { req, res } = setupMocks();
      req.query.access_token = 'access_token';
      axios.get.mockRejectedValueOnce(new Error('Failed to fetch tracks'));
  
      await fetchTrackFeatures(req, res);
      expect(res._getStatusCode()).toBe(500);
      expect(res._getData()).toContain('Failed to fetch track features and calculate averages');
    });
  
    it('returns error on failure to fetch features', async () => {
      const { req, res } = setupMocks();
      req.query.access_token = 'access_token';
      const mockTracksData = { data: { items: [{ id: 'track1' }] } };
      axios.get.mockResolvedValueOnce(mockTracksData).mockRejectedValueOnce(new Error('Failed to fetch features'));
  
      await fetchTrackFeatures(req, res);
      expect(res._getStatusCode()).toBe(500);
      expect(res._getData()).toContain('Failed to fetch track features and calculate averages');
    });
  });
});
