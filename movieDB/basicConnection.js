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

// Connect with a connection pool.

async function poolDemo() {
    const pool = new Pool(credentials);
    const now = await pool.query("SELECT NOW()");
    await pool.end();

    return now;
}


// Use a self-calling function so we can use async / await.

(async () => {
    const poolResult = await poolDemo();
    console.log("Time with pool: " + poolResult.rows[0]["now"]);
})();