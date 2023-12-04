import fetch from 'node-fetch';
import config from '../config.js';

const movieService = {
    fetchMovies: async () => {
        let page = 1;
        const movies = [];
        do {
            try {
                const response = await fetch(`${config.movieApiUrl}&page=${page}`, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${config.movieApiKey}`
                    }
                });
                const data = await response.json();
                movies.push(...data.results);
                page++;
            } catch (error) {
                console.error(`Error fetching movies: ${error}`);
                break;
            }
        } while (page <= 500); // tMDB limit
        return movies;
    }
};

export default movieService;