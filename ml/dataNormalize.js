//import the test JSON file and file writing
import sample from './testCharacteristicInput.json' assert { type: "json" };
// import * as fs from 'fs';

// let output = "";
// let characteristics = "";
let low_char_genres = [];
let less_low_char_genres = [];
let high_char_genres = [];
let less_high_char_genres = [];

//for each key in the file, assign the new normalized value
Object.entries(sample).forEach(([key, value]) => {
    if (key === "speechiness") {
        if (value < 0.1) {
            value = 1;
        } else if (value < 0.2) {
            value = 2;
        } else if (value < 0.33) {
            value = 3;
        } else if (value < 0.66) {
            value = 4;
            less_high_char_genres.push("Documentary", "History");
        } else {
            value = 5;
            high_char_genres.push("Documentary", "History");
        }
    } else if (key === "loudness") {
        if (value < -40) {
            value = 1;
            low_char_genres.push("Romance", "Family", "Mystery");
        } else if (value < -25) {
            value = 2;
            less_low_char_genres.push("Romance", "Family", "Mystery");
        } else if (value < -15) {
            value = 3;
        } else if (value < -5) {
            value = 4;
            less_high_char_genres.push("War", "Action", "Horror");
        } else {
            value = 5;
            high_char_genres.push("War", "Action", "Horror");
        }
    } else {
        if (value < 0.2) {
            value = 1;
            if (key === "tempo") {
                low_char_genres.push("Drama", "Romance")
            } else if (key === "acousticness") {
                low_char_genres.push("Action", "Adventure", "Thriller", "Sci-Fi");
            } else if (key === "danceability") {
                low_char_genres.push("Horror", "War", "Documentary", "Crime");
            } else if (key === "energy") {
                low_char_genres.push("Romance", "Drama", "Mystery");
            } else if (key === "valence") {
                low_char_genres.push("Horror", "War", "Drama", "Crime");
            }
        } else if (value < 0.4) {
            value = 2;
            if (key === "tempo") {
                less_low_char_genres.push("Drama", "Romance")
            } else if (key === "acousticness") {
                less_low_char_genres.push("Action", "Adventure", "Thriller", "Sci-Fi");
            } else if (key === "danceability") {
                less_low_char_genres.push("Horror", "War", "Documentary", "Crime");
            } else if (key === "energy") {
                less_low_char_genres.push("Romance", "Drama", "Mystery");
            } else if (key === "valence") {
                less_low_char_genres.push("Horror", "War", "Drama", "Crime");
            }
        } else if (value < 0.6) {
            value = 3;
        } else if (value < 0.8) {
            value = 4;
            if (key === "tempo") {
                less_high_char_genres.push("Musical", "Action", "Comedy", "Adventure")
            } else if (key === "acousticness") {
                less_high_char_genres.push("Romance", "History", "Family");
            } else if (key === "danceability") {
                less_high_char_genres.push("Musical", "Family", "Sci-Fi", "Fantasy");
            } else if (key === "energy") {
                less_high_char_genres.push("Adventure", "Action", "Thriller", "Sci-Fi", "Fantasy");
            } else if (key === "valence") {
                less_high_char_genres.push("Comedy", "Romance", "Family");
            }
        } else {
            value = 5;
            if (key === "tempo") {
                high_char_genres.push("Musical", "Action", "Comedy", "Adventure")
            } else if (key === "acousticness") {
                high_char_genres.push("Romance", "History", "Family");
            } else if (key === "danceability") {
                high_char_genres.push("Musical", "Family", "Sci-Fi", "Fantasy");
            } else if (key === "energy") {
                high_char_genres.push("Adventure", "Action", "Thriller", "Sci-Fi", "Fantasy");
            } else if (key === "valence") {
                high_char_genres.push("Comedy", "Romance", "Family");
            }
        }
    }
})

let genres = [];

genres.push(high_char_genres);
genres.push(low_char_genres);

if(high_char_genres.length === 0 && low_char_genres.length === 0) {
    genres.push(less_high_char_genres);
    genres.push(less_low_char_genres);
}

genres = genres.flat(1)

// console.log(genres);

let duplicates = genres.filter((item, index) => genres.indexOf(item) !== index);

// console.log(duplicates);

let final_genre;

if(duplicates.length !== 0) {
    final_genre = duplicates[Math.floor(Math.random()*duplicates.length)];
} else {
    final_genre = genres[Math.floor(Math.random()*genres.length)];
}

console.log(final_genre);

let genre_id;

if (final_genre === "Action") {
    genre_id = 28;
} else if (final_genre === "Adventure") {
    genre_id = 12;
} else if(final_genre === "Comedy") {
    genre_id = 35;
} else if(final_genre === "Crime") {
    genre_id = 80;
} else if(final_genre === "Documentary") {
    genre_id = 99;
} else if (final_genre === "Drama") {
    genre_id = 18;
} else if (final_genre === "Family") {
    genre_id = 10751;
} else if (final_genre === "Fantasy") {
    genre_id = 14;
} else if (final_genre === "History") {
    genre_id = 36;
} else if (final_genre === "Horror") {
    genre_id = 27;
} else if (final_genre === "Musical") {
    genre_id = 10402;
} else if (final_genre === "Mystery") {
    genre_id = 9648;
} else if (final_genre === "Romance") {
    genre_id = 10749;
} else if (final_genre === "Sci-Fi") {
    genre_id = 878;
} else if (final_genre === "Thriller") {
    genre_id = 53;
} else if (final_genre === "War") {
    genre_id = 10752;
}

console.log(genre_id);


//     //create the output for the title row
//     if(key === "liveness") {
//         output += key;
//         characteristics += value;
//     } else {
//         output += key + ",";
//         characteristics += value + ',';
//     }
// })

// //add the characteristics on the new line
// output += "\n" + characteristics;
//
// //print the output to a csv file that can be fed to the ML model
// fs.writeFile('single_test_data.csv', output, err => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log("Characteristics written to file")
//     }
// });