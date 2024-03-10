// Controller for the movie routes
import movieService from '../services/movieService.js';
import fs from 'fs';
// import {as} from "pg-promise";
import logger from "../logger.js";
import spotifyService from "../services/spotifyService.js";

const movieController = {
    // Fetches the movies from the movieService and writes them to a file
    getMovies: async (req, res) => {
        try {
            // Fetch the movies
            const movies = await movieService.fetchMovies();
            const filePath = 'movieList.txt';
            // Delete the file if it exists
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            // Write the movies to the file
            movies.forEach((movie, index) => {
                fs.appendFileSync(filePath, JSON.stringify(movie, null, 4) + '\n');
                logger.info(`Writing movie #${index + 1}`);
            });
            res.send('Movies written to file successfully');
        } catch (error) {
            logger.error(`Error in getMovies: ${error}`);
            res.status(500).send('Failed to fetch movies');
        }
    },
    getGenre: async (req, res) => {
        try {
            const genre = await movieService.fetchGenre(req.query.spotify_characteristics);
            res.json({final_genre: genre});
        } catch (error) {
            logger.error(`Error in getGenre: ${error}`);
            res.status(500).send('Failed to fetch genre');
        }
    },
    getMoviesFromDB: async (req, res) => {
        try {

            // Fetch the movies from the database and prints them to file
            const movies = await movieService.fetchMoviesFromDB(req.query.genre_id);
            res.json({ movies: movies });
        } catch (error) {
            logger.error(`Error in getMoviesFromDB: ${error}`);
            res.status(500).send('Failed to fetch movies');
        }
    }
};
export default movieController;