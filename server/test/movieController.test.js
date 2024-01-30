// Import required modules
import movieController from '../controllers/movieController.js';
import movieService from '../services/movieService.js';
import fs from 'fs';
import request from 'supertest';
import express from 'express';
import jest from 'jest';

// Mock the movieService and fs modules
jest.mock('../services/movieService');
jest.mock('fs');

// Initialize Express app and define route for testing
const app = express();
app.get('/movies', movieController.getMovies);

// Group tests for getMovies function in movieController
describe('Movie Controller - getMovies', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it('writes movies to a file and returns success message', async () => {
    const mockMovies = [{ title: 'Movie 1' }, { title: 'Movie 2' }];
    movieService.fetchMovies.mockResolvedValue(mockMovies); // Mock service response

    // Setup fs mock behaviors
    fs.existsSync.mockReturnValue(false);
    fs.appendFileSync.mockReturnValue();

    const response = await request(app).get('/movies'); // Test route

    // Check response and interactions with mocks
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Movies written to file successfully');
    expect(movieService.fetchMovies).toHaveBeenCalled();
    expect(fs.appendFileSync).toHaveBeenCalledTimes(mockMovies.length);

    // Verify each movie is written to the file
    mockMovies.forEach(movie => {
      expect(fs.appendFileSync).toHaveBeenCalledWith(
        'movieList.txt', JSON.stringify(movie, null, 4) + '\n'
      );
    });
  });

  it('handles service errors gracefully', async () => {
    movieService.fetchMovies.mockRejectedValue(new Error('Service failure')); // Simulate service error

    const response = await request(app).get('/movies'); // Test error handling

    // Validate error response
    expect(response.statusCode).toBe(500);
    expect(response.text).toBe('Failed to fetch movies');
    expect(movieService.fetchMovies).toHaveBeenCalled();
  });
});
