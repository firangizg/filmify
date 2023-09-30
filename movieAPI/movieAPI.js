//import dotenv, fetch, and filesystem
import * as dotenv from "dotenv";
import('node-fetch');
import * as fs from "fs";

//congifure dotenv for use
dotenv.config();

//this function goes through all the pages the API has for the movie query and writes a list of those movies to the movieList.txt file
async function getPages() {
    //if the file already exists delete it
    if (fs.existsSync('movieList.txt')) fs.unlinkSync('movieList.txt');
    /* the url to the request url which includes all the parameters we are searching against
    * we don't want any adult films or anything that is not really a movie
    * the movies should be available in English, people in the US should be able to watch them, and they should have a rating of above 4 stars */
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&vote_average.gte=4&watch_region=United%20States&with_runtime.gte=40&page=`;
    //the headers and authorization needed to make the request -- for now the API_KEY is in an env file
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.API_KEY}`
        }
    };
    //start at the first page
    let page = 1;
    // creates empty array where the movie objects will be stored
    let movies = [];
    //counts what movie the program is on
    let counter = 0;
    do {
        // try catch to catch any errors in the async api call
        try {
            // use node-fetch to make api call
            const resp = await fetch(`${url}${page}`, options);
            const data = await resp.json();
            data.results.forEach(movie => {
                // destructure the movie object
                const { title, genre_ids, id, original_language, original_title,
                overview, popularity, poster_path, release_date, vote_average,
                vote_count} = movie;
                //add the movie to the array
                movies.push({title, genre_ids, id, original_language, original_title,
                    overview, popularity, poster_path, release_date, vote_average,
                    vote_count});
                //write to console what movie the program is on
                counter++;
                console.log(`writing movie #${counter}`)
            });
            // increment the page with 1 on each loop
            page++;
        } catch (err) {
            //print that something went wrong
            console.error(`Oops, something is wrong ${err}`);
        }
        // keep running until there's no next page -- tMDB only allows 500 pages
    } while (page <= 500);
    // for each movie in the array of movies, stringify the movie and append it to the movieList.txt file
    movies.map((movie) => {
        fs.appendFileSync('movieList.txt', JSON.stringify(movie, null, 4));
        fs.appendFileSync('movieList.txt', "\n");
    });
}

getPages();