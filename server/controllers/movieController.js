import movieService from '../services/movieService.js';
import fs from 'fs';

const movieController = {
    getMovies: async (req, res) => {
        try {
            const movies = await movieService.fetchMovies();
            const filePath = 'movieList.txt';
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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