// //import dotenv, fetch, and postgres
// import * as dotenv from "dotenv";
// import pgp from 'pg-promise';
// import pkg from "pg";
// const {Pool} = pkg;
// // import node:os;
// // //import the test JSON file and file writing
// // import sample from './testCharacteristicInput.json' assert { type: "json" };
// // import * as fs from 'fs';
//
// export async function normalizeAndRandom(characteristic_json) {
//
//     dotenv.config();
//
//     const credentials = {
//         user: process.env.DB_USER,
//         host: process.env.HOST,
//         database: process.env.DATABASE,
//         password: process.env.PASSWORD,
//         port: process.env.PORT,
//     };
//
//
//     let low_char_genres = [];
//     let less_low_char_genres = [];
//     let high_char_genres = [];
//     let less_high_char_genres = [];
//
//     Object.entries(characteristic_json).forEach(([key, value]) => {
//         if (key === "speechiness") {
//             if (value < 0.66 && value >= 0.33) {
//                 less_high_char_genres.push("Documentary", "History");
//             } else if (value >= 0.66) {
//                 value = 5;
//                 high_char_genres.push("Documentary", "History");
//             }
//         } else if (key === "loudness") {
//             if (value < -40) {
//                 low_char_genres.push("Romance", "Family", "Mystery");
//             } else if (value < -25) {
//                 less_low_char_genres.push("Romance", "Family", "Mystery");
//             } else if (value < -5 && value >= -15) {
//                 less_high_char_genres.push("War", "Action", "Horror");
//             } else if (value >= -5) {
//                 high_char_genres.push("War", "Action", "Horror");
//             }
//         } else {
//             if (value < 0.2) {
//                 if (key === "tempo") {
//                     low_char_genres.push("Drama", "Romance")
//                 } else if (key === "acousticness") {
//                     low_char_genres.push("Action", "Adventure", "Thriller", "Sci-Fi");
//                 } else if (key === "danceability") {
//                     low_char_genres.push("Horror", "War", "Documentary", "Crime");
//                 } else if (key === "energy") {
//                     low_char_genres.push("Romance", "Drama", "Mystery");
//                 } else if (key === "valence") {
//                     low_char_genres.push("Horror", "War", "Drama", "Crime");
//                 }
//             } else if (value < 0.4) {
//                 value = 2;
//                 if (key === "tempo") {
//                     less_low_char_genres.push("Drama", "Romance")
//                 } else if (key === "acousticness") {
//                     less_low_char_genres.push("Action", "Adventure", "Thriller", "Sci-Fi");
//                 } else if (key === "danceability") {
//                     less_low_char_genres.push("Horror", "War", "Documentary", "Crime");
//                 } else if (key === "energy") {
//                     less_low_char_genres.push("Romance", "Drama", "Mystery");
//                 } else if (key === "valence") {
//                     less_low_char_genres.push("Horror", "War", "Drama", "Crime");
//                 }
//             } else if (value < 0.8 && value >= 0.6) {
//                 if (key === "tempo") {
//                     less_high_char_genres.push("Musical", "Action", "Comedy", "Adventure")
//                 } else if (key === "acousticness") {
//                     less_high_char_genres.push("Romance", "History", "Family");
//                 } else if (key === "danceability") {
//                     less_high_char_genres.push("Musical", "Family", "Sci-Fi", "Fantasy");
//                 } else if (key === "energy") {
//                     less_high_char_genres.push("Adventure", "Action", "Thriller", "Sci-Fi", "Fantasy");
//                 } else if (key === "valence") {
//                     less_high_char_genres.push("Comedy", "Romance", "Family");
//                 }
//             } else if (value >= 0.8) {
//                 value = 5;
//                 if (key === "tempo") {
//                     high_char_genres.push("Musical", "Action", "Comedy", "Adventure")
//                 } else if (key === "acousticness") {
//                     high_char_genres.push("Romance", "History", "Family");
//                 } else if (key === "danceability") {
//                     high_char_genres.push("Musical", "Family", "Sci-Fi", "Fantasy");
//                 } else if (key === "energy") {
//                     high_char_genres.push("Adventure", "Action", "Thriller", "Sci-Fi", "Fantasy");
//                 } else if (key === "valence") {
//                     high_char_genres.push("Comedy", "Romance", "Family");
//                 }
//             }
//         }
//     })
//
//     let genres = [];
//
//     genres.push(high_char_genres);
//     genres.push(low_char_genres);
//
//     if(high_char_genres.length === 0 && low_char_genres.length === 0) {
//         genres.push(less_high_char_genres);
//         genres.push(less_low_char_genres);
//     }
//
//     genres = genres.flat(1)
//
//     let duplicates = genres.filter((item, index) => genres.indexOf(item) !== index);
//
//     let final_genre;
//
//     if(duplicates.length !== 0) {
//         final_genre = duplicates[Math.floor(Math.random()*duplicates.length)];
//     } else {
//         final_genre = genres[Math.floor(Math.random()*genres.length)];
//     }
//
//     let genre_num;
//
//     if (final_genre === "Action") {
//         genre_num = 28;
//     } else if (final_genre === "Adventure") {
//         genre_num = 12;
//     } else if(final_genre === "Comedy") {
//         genre_num = 35;
//     } else if(final_genre === "Crime") {
//         genre_num = 80;
//     } else if(final_genre === "Documentary") {
//         genre_num = 99;
//     } else if (final_genre === "Drama") {
//         genre_num = 18;
//     } else if (final_genre === "Family") {
//         genre_num = 10751;
//     } else if (final_genre === "Fantasy") {
//         genre_num = 14;
//     } else if (final_genre === "History") {
//         genre_num = 36;
//     } else if (final_genre === "Horror") {
//         genre_num = 27;
//     } else if (final_genre === "Musical") {
//         genre_num = 10402;
//     } else if (final_genre === "Mystery") {
//         genre_num = 9648;
//     } else if (final_genre === "Romance") {
//         genre_num = 10749;
//     } else if (final_genre === "Sci-Fi") {
//         genre_num = 878;
//     } else if (final_genre === "Thriller") {
//         genre_num = 53;
//     } else {
//         genre_num = 10752;
//     }
//
//     let query;
//
//     query = pgp.as.format(`SELECT * FROM movies WHERE ${genre_num} = ANY(genre_ids) ORDER BY random() limit 4`);
//     // query = pgp.as.format(`SELECT * FROM movies ORDER BY random() limit 4`);
//
//
//     // create a Pool for the database connection and run the query
//     const pool = new Pool(credentials);
//     const result = await pool.query(query);
//     //only print the movie details
//     const movie1 = result.rows[0];
//     const movie2 = result.rows[1];
//     const movie3 = result.rows[2];
//     const movie4 = result.rows[3];
//     const movies = { movie1, movie2, movie3, movie4 }
//     console.log(movies);
//     await pool.end();
//     return movies;
//
//
// }
//
// // normalizeAndRandom("./sample.json")