import movieController from '../controllers/movieController.js';
import movieService from '../services/movieService.js';
import fs from 'fs';
import request from 'supertest';
import express from 'express';
import jest from 'jest';

// Mock the movieService and fs modules
jest.mock('../services/movieService');
jest.mock('fs');

// Set up a basic express app for testing
const app = express();
app.get('/movies', movieController.getMovies);

describe('Movie Controller - getMovies', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should write movies to a file and return a success message', async () => {
    // Mock data to be returned by the movieService
    const mockMovies = [{ title: 'Movie 1' }, { title: 'Movie 2' }];
    movieService.fetchMovies.mockResolvedValue(mockMovies);

    // Mock fs functions
    fs.existsSync.mockReturnValue(false);
    fs.unlinkSync.mockReturnValue();
    fs.appendFileSync.mockReturnValue();

    // Make a request to the getMovies route
    const response = await request(app).get('/movies');

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual('Movies written to file successfully');
    expect(movieService.fetchMovies).toHaveBeenCalledTimes(1);
    expect(fs.existsSync).toHaveBeenCalledWith('movieList.txt');
    expect(fs.appendFileSync).toHaveBeenCalledTimes(mockMovies.length);

    // Ensure the movies are written to the file correctly
    mockMovies.forEach((movie, index) => {
      expect(fs.appendFileSync).toHaveBeenCalledWith(
        'movieList.txt',
        JSON.stringify(movie, null, 4) + '\n'
      );
    });
  });

  it('should handle errors gracefully', async () => {
    // Simulate an error thrown by the movieService
    movieService.fetchMovies.mockRejectedValue(new Error('Service failure'));

    // Make a request to the getMovies route
    const response = await request(app).get('/movies');

    // Assertions
    expect(response.statusCode).toBe(500);
    expect(response.text).toEqual('Failed to fetch movies');
    expect(movieService.fetchMovies).toHaveBeenCalledTimes(1);
  });
});
