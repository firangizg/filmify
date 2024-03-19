import fetch from 'node-fetch';
import config from '../config.js';
import logger from '../logger.js';
import pgp from 'pg-promise';
import pkg from "pg";
const {Pool} = pkg;

const credentials = {
    user: config.user,
    host: config.host,
    database: config.database,
    password: config.password,
    port: 5432,
};

const artistService = {
    fetchArtistMovies: async () => {
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
                logger.error(`Error in fetchArtistMovieData: ${error.message}`);
                throw error;
            }
        } while (page <= 500); // tMDB limit
        return movies;
    },
    fetchArtist: async (characteristics) => {
        try {
            let low_char_genres = [];
            let less_low_char_genres = [];
            let high_char_genres = [];
            let less_high_char_genres = [];

            Object.entries(characteristics).forEach(([key, value]) => {
                if (key === "speechiness") {
                    if (value < 0.66 && value >= 0.33) {
                        less_high_char_genres.push("Documentary", "History");
                    }
                }
            })
            let genres = [];

            genres.push(high_char_genres);
            genres.push(low_char_genres);

            if(high_char_genres.length === 0 && low_char_genres.length === 0) {
                genres.push(less_high_char_genres);
                genres.push(less_low_char_genres);
            }

            genres = genres.flat(1)





        } catch (error) {
            logger.error(`Error in fetchGenre: ${error.message}`);
            throw error;
        }
    },
    fetchArtistMoviesFromDB: async (genre_id) => {
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
            logger.error(`Error in fetchArtistMoviesFromDB: ${error.message}`);
            throw error;
        }
    }
};

export default artistService;