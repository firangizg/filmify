const { Pool, Client } = require("pg");
const dotenv = require('dotenv');

dotenv.config();

//get database credentials from .env file
const credentials = {
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
};

// Connect to the database with a connection pool.
async function poolDemo() {
    const pool = new Pool(credentials);
    //nothing in the table for now so we will get the time to show connection
    const now = await pool.query("SELECT NOW()");
    await pool.end();

    return now;
}

// Connect to the database with a client.
async function clientDemo() {
    const client = new Client(credentials);
    await client.connect();
    //nothing in the table for now so we will get the time to show connection
    const now = await client.query("SELECT NOW()");
    await client.end();

    return now;
}

// Use a self-calling function, so we can use async / await.
(async () => {
    //print the results of both
    const poolResult = await poolDemo();
    console.log("Time with pool: " + poolResult.rows[0]["now"]);

    const clientResult = await clientDemo();
    console.log("Time with client: " + clientResult.rows[0]["now"]);
})();