// Controller for the movie service
import movieService from '../services/movieService.js';
import fs from 'fs';

const movieController = {
    getMovies: async (req, res) => {
        const filePath = 'movieList.txt';

        // Function to handle file write operation
        const writeMoviesToFile = (movies) => {
            // Delete the file if it exists
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

            // Write the movies to the file
            movies.forEach((movie, index) => {
                fs.appendFileSync(filePath, JSON.stringify(movie, null, 4) + '\n');
                logger.info(`Writing movie #${index + 1}`);
            });
        };

        // Fetch movies from the service
        try {
            const movies = await movieService.fetchMovies();
            writeMoviesToFile(movies); // Use the internal function to handle file operations
            res.send('Movies written to file successfully');
        } catch (error) {
            logger.error(`Error in getMovies: ${error}`);
            res.status(500).send('Failed to fetch movies');
        }
    }
};

export default movieController;
