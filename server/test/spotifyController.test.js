// Import dependencies
import axios from 'axios';
import httpMocks from 'node-mocks-http';
import { login, callback, fetchTopTracks, fetchTopArtists, fetchTopGenres, fetchTrackFeatures } from '../controllers/spotifyController';
import config from '../config';

// Mock axios and config to isolate the controller functions
jest.mock('axios');
jest.mock('../config', () => ({
  serverBaseUrl: 'http://localhost:3000',
  clientBaseUrl: 'http://localhost:3001',
  spotifyClientId: 'client_id',
  spotifyClientSecret: 'client_secret'
}));

// Utility function to set up mock request and response objects
const setupMocks = () => {
  const req = httpMocks.createRequest();
  const res = httpMocks.createResponse();
  return { req, res };
};

// Define test suite for Spotify Controller functions
describe('Spotify Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  // Test login functionality
  describe('login', () => {
    it('redirects to Spotify auth with correct parameters', () => {
      const { req, res } = setupMocks();
      login(req, res);
      const redirectUrl = res._getRedirectUrl();
      expect(redirectUrl).toContain('https://accounts.spotify.com/authorize');
      expect(redirectUrl).toContain(`client_id=${config.spotifyClientId}`);
    });
  });

  // Test callback functionality
  describe('callback', () => {
    it.each([
      ['successful callback', 'access_token', `${config.clientBaseUrl}?access_token=access_token`, null],
      ['failed callback', null, `${config.clientBaseUrl}/error`, new Error('Spotify API error')]
    ])('%s', async (_, accessToken, expectedRedirect, mockError) => {
      const { req, res } = setupMocks();
      req.query.code = 'testcode';
      if (mockError) {
        axios.post.mockRejectedValue(mockError);
      } else {
        axios.post.mockResolvedValue({ data: { access_token: accessToken } });
      }

      await callback(req, res);
      expect(res._getRedirectUrl()).toEqual(expectedRedirect);
    });
  });

  // Test fetching top tracks functionality
  describe('fetchTopTracks', () => {
    it('handles response and errors', async () => {
      const { req, res } = setupMocks();
      req.query.access_token = 'access_token';

      // Mock success and failure cases
      const mockSuccessResponse = { data: { items: ['track1', 'track2'] } };
      const mockErrorResponse = new Error('Failed to fetch');
      axios.get.mockResolvedValueOnce(mockSuccessResponse).mockRejectedValueOnce(mockErrorResponse);

      // Test success case
      await fetchTopTracks(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toEqual(mockSuccessResponse);

      // Test failure case
      await fetchTopTracks(req, res);
      expect(res._getStatusCode()).toBe(500);
      expect(res._getData()).toContain('Failed to fetch top tracks');
    });
  });

  // Consolidated tests for similar functionality (fetchTopArtists and fetchTopGenres)
  describe.each([
    ['fetchTopArtists', fetchTopArtists, 'artists'],
    ['fetchTopGenres', fetchTopGenres, 'genres']
  ])('%s', (desc, func, dataType) => {
    it(`returns top ${dataType} on success`, async () => {
      const { req, res } = setupMocks();
      req.query.access_token = 'access_token';
      const mockData = { data: { items: [`${dataType}1`, `${dataType}2`] } };
      axios.get.mockResolvedValue(mockData);

      await func(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toEqual(mockData);
    });

    it(`returns error on failure`, async () => {
      const { req, res } = setupMocks();
      req.query.access_token = 'access_token';
      axios.get.mockRejectedValue(new Error(`Failed to fetch ${dataType}`));

      await func(req, res);
      expect(res._getStatusCode()).toBe(500);
      expect(res._getData()).toContain(`Failed to fetch top ${dataType}`);
    });
  });

  // Test fetching track features functionality
  describe('fetchTrackFeatures', () => {
    it('returns track features averages on success', async () => {
      const { req, res } = setupMocks();
      req.query.access_token = 'access_token';
      const mockTracksData = { data: { items: [{ id: 'track1' }, { id: 'track2' }] } };
      const mockFeaturesData = { data: { audio_features: [{ danceability: 0.8, energy: 0.6 }, { danceability: 0.7, energy: 0.7 }] } };
      axios.get.mockResolvedValueOnce(mockTracksData).mockResolvedValueOnce(mockFeaturesData);

      await fetchTrackFeatures(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toEqual(expect.objectContaining({
        danceability: expect.any(Number),
        energy: expect.any(Number)
      }));
    });

    it('returns error on failure', async () => {
      const { req, res } = setupMocks();
      req.query.access_token = 'access_token';
      axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

      await fetchTrackFeatures(req, res);
      expect(res._getStatusCode()).toBe(500);
      expect(res._getData()).toContain('Failed to fetch track features');
    });
  });
});
