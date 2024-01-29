// Service to fetch movies from tMDB API
import fetch from 'node-fetch';
import config from '../config.js';
import logger from '../logger.js';

const movieService = {
    fetchMovies: async () => {
        let page = 1;
        const movies = [];
        do {
            try {
                // Get the movies from the api
                const response = await fetch(`${config.movieApiUrl}&page=${page}`, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${config.movieApiKey}`
                    }
                });
                // Parse the response
                const data = await response.json();
                // Add the movies to the array
                movies.push(...data.results);
                page++;
            } catch (error) {
                logger.error(`Error in fetchMovieData: ${error.message}`);
                throw error;
            }
        } while (page <= 500); // tMDB limit
        return movies;
    }
};

export default movieService;