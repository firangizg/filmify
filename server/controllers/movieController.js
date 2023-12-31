// Controller for the movie routes
import movieService from '../services/movieService.js';
import fs from 'fs';

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
                console.log(`Writing movie #${index + 1}`);
            });
            res.send('Movies written to file successfully');
        } catch (error) {
            console.error(`Error in getMovies: ${error}`);
            res.status(500).send('Failed to fetch movies');
        }
    }
};
export default movieController;