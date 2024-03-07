//import dotenv, fetch, and postgres
import * as dotenv from "dotenv";
import('node-fetch');
import pgp from 'pg-promise';
import pkg from "pg";
const {Pool} = pkg;


//configure dotenv for use
dotenv.config();

//get database credentials from .env file
const credentials = {
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    ssl: process.env.SSL
};

//this function goes through all the pages the API has for the movie query and inserts all the movies into the local database
async function getPages(certification) {
    /* the url to the request url which includes all the parameters we are searching against
    * we don't want any adult films or anything that is not really a movie
    * the movies should be available in English, people in the US should be able to watch them, and they should have a rating of above 4 stars */
    const url = `https://api.themoviedb.org/3/discover/movie?certification_country=US&certification=`+ certification +`&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&vote_average.gte=4&vote_count.gte=100&watch_region=United%20States&with_runtime.gte=40&page=`;
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
    let done = false;
    do {
        // try catch to catch any errors in the async api call
        try {
            // use node-fetch to make api call
            const resp = await fetch(`${url}${page}`, options);
            const data = await resp.json();
            if(data.last_page === page) {
                done = true;
            }
            data.results.forEach(movie => {
                // destructure the movie object
                let { title, genre_ids, id, original_language, original_title,
                    overview, popularity, poster_path, release_date, vote_average,
                    vote_count} = movie;

                //replace ' with '' so that any apostrophes in titles or descriptions don't break SQL syntax

                const re = /'/gi;

                title = title.replace(re,"''");
                original_title = original_title.replace(re,"''");
                overview = overview.replace(re,"''");

                //add the movie to the array
                movies.push({title, genre_ids, id, original_language, original_title,
                    overview, popularity, poster_path, release_date, vote_average,
                    vote_count, certification});
                //write to console what movie the program is on
                counter++;
                console.log(`writing movie #${counter}`)
            });

            if (page % 50 === 0)
            {
                console.log("Adding some movies to database");
                //turn the array into a string
                movies = JSON.stringify(movies)

                //use json_populate_recordset to add whole array into the database
                // it automatically matches the key value pairs in the json to the proper columns in the database
                const query = pgp.as.format(`INSERT INTO movies SELECT * FROM json_populate_recordset(null::movies,'${movies}') 
                                               ON CONFLICT (id) DO UPDATE SET popularity = EXCLUDED.popularity, 
                                               vote_average = EXCLUDED.vote_average, vote_count = EXCLUDED.vote_count`);

                // create a Pool for the database connection and run the query
                const pool = new Pool(credentials);
                const now = await pool.query(query);
                await pool.end();
                //clear array
                movies = [];
            }
            console.log (`finished page ${page}`);

            // increment the page with 1 on each loop
            page++;
        } catch (err) {
            //print that something went wrong
            console.error(`Oops, something is wrong ${err}`);
            break;
        }
        // keep running until there's no next page -- tMDB only allows 500 pages
    } while (page <= 500 && !done);
}

async function fillDatabase(){
    await getPages("G");
    await getPages("PG");
    await getPages("PG-13");
    await getPages("R");
}

await fillDatabase();