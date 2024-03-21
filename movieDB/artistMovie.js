//import dotenv, fetch, and postgres
import * as dotenv from "dotenv";
import pgp from 'pg-promise';
import pkg from "pg";
const {Pool} = pkg;

export async function getArtistMovie(characteristic_json) {
    dotenv.config();

    const credentials = {
        user: process.env.DB_USER,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.PORT,
    };
    let art_band;
    Object.entries(characteristic_json).forEach(([key,value]) => {
        if(key === "top"){
            art_band = value;
        }
    })

    let query;
//create the database query to select top artist movie
    query = pgp.as.format(`SELECT * FROM artisttable WHERE ${art_band} = ANY(artist_band) ORDER BY random() limit 1`);

//creates a pool for the db connection and runs the query
    const pool = new Pool(credentials);
    const result = await pool.query(query2);

    const movieArt = result.rows[0];
    console.log(movieArt);
    await pool.end();
    return movieArt;
}