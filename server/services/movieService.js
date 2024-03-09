// Service to fetch movies from tMDB API
import fetch from 'node-fetch';
import config from '../config.js';
import logger from '../logger.js';
import pgp from 'pg-promise';
import pkg from "pg";
const {Pool} = pkg;

const credentials = {
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
};

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
    },
    fetchMoviesFromDB: async (genre_id) => {
        try {
            const query = pgp.as.format(`SELECT * FROM movies WHERE ${genre_id} = ANY(genre_ids) ORDER BY random() limit 4`);
            // create a Pool for the database connection and run the query
            const pool = new Pool(credentials);
            const result = await pool.query(query);
            //only print the movie details
            const movie = result.rows;
            await pool.end();
            return movie;
        } catch (error) {
            logger.error(`Error in fetchMoviesFromDB: ${error.message}`);
            throw error;
        }
    }
};

export default movieService;