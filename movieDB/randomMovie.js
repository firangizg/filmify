//import dotenv, fetch, and postgres
import * as dotenv from "dotenv";
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
};

//returns a random integer from 0 to the max
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const randomBoolean = () => Math.random() >= 0.5;

//this function chooses one or two random genres and finds a movie in the database that matches the genre(s).
async function getMovie() {
    //array with all the possible genre numbers in the database
    const genreArray = [28,12,16,35,80,99,18,10751,14,36,27,10402,9648,10749,878,10770,53,10752,37]

    //randomly choose a position in the array
    const arrayPosition1 = getRandomInt(genreArray.length - 1);
    const arrayPosition2 = getRandomInt(genreArray.length - 1);

    //get the genre at the random position
    const genre1 = genreArray[arrayPosition1];
    const genre2 = genreArray[arrayPosition2];

    let query;

    if(randomBoolean()) {
        console.log(genre1);
        console.log(genre2);
        //choose a random movie that has the both genres
        query = pgp.as.format(`SELECT * FROM films WHERE ${genre1} = ANY(genre_ids) AND ${genre2} = ANY(genre_ids) ORDER BY random() limit 1`);
    } else {
        //choose a random movie that has just the first genre
        console.log(genre1);
        query = pgp.as.format(`SELECT * FROM films WHERE ${genre1} = ANY(genre_ids) ORDER BY random() limit 4`);
    }

    // create a Pool for the database connection and run the query
    const pool = new Pool(credentials);
    const result = await pool.query(query);
    //only print the movie details
    const movie = result.rows[0];
    console.log(movie);
    await pool.end();
}

getMovie();