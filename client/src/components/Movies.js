// This file contains the code for the Recommendations component.
import React, { Component } from 'react';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';

//Component for displaying the movies recommended
class Movies extends Component {
    state = {
        spotify_artist: [],
        spotify_characteristics: [],
        movies: [],
        artMovies: [],
        art_name: "",
        // genre_id_1: 0,
        // genre_1: "",
        // genre_id_2: 0,
        // genre_2: "",
        // genre_id_3: 0,
        // genre_3: "",
        // genre_id_4: 0,
        // genre_4: "",
        genre: "",
        genre_id: "",
        genres: [],
        genre_ids: [],
    };

    //function for getting the average track characteristics from spotify
    async grabChars() {
        //getting access token
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');

        // Fetch the characteristics
        try {
            const spotify_response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/track-features?access_token=${accessToken}`);
            const spotify_data = await spotify_response.json();
            this.setState({spotify_characteristics: spotify_data});
        } catch (error) {
            console.error("Failed to fetch characteristics", error);
        }
    }

    //function for getting the top artist from spotify
    async grabArtist() {
        //getting the access token
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');

        // Fetch the artist
        try {
            const spotify_responseArt = await fetch(`${process.env.REACT_APP_API_BASE_URL}/top-artists?access_token=${accessToken}`);
            const spotify_dataArt = await spotify_responseArt.json();
            this.setState({spotify_artist: spotify_dataArt.items[0]});
            this.setState({art_name: spotify_dataArt.items[0].name})
            console.log(this.state.art_name);
        } catch (error) {
            console.error("Failed to fetch artist", error);
        }
    }

    //function to generate recommended genre
    async getGenre () {
        //grabbing characteristics
        const characteristics = this.state.spotify_characteristics;
        //this array will hold the genres for characteristics of scale "1"
        let low_char_genres = [];
        //this array will hold the genres for characteristics of scale "2"
        let less_low_char_genres = [];
        //this array will hold the genres for characteristics of scale "5"
        let high_char_genres = [];
        //this array will hold the genres for characteristics of sclae "4"
        let less_high_char_genres = [];

        //looping through characteristics
        Object.entries(characteristics).forEach(([key, value]) => {
            if (key === "speechiness") {
                //"documentary" and "history" correspond to high speechiness
                if (value < 0.66 && value >= 0.33) {
                    less_high_char_genres.push("Documentary", "History");
                } else if (value >= 0.66) {
                    high_char_genres.push("Documentary", "History");
                }
            } else if (key === "loudness") {
                //"romance", "family", & "mystery" correspond to low loudness
                //"war", "action", & "horror" correspond to high loudness
                if (value < -40) {
                    low_char_genres.push("Romance", "Family", "Mystery");
                } else if (value < -25 && value >= -40) {
                    less_low_char_genres.push("Romance", "Family", "Mystery");
                } else if (value < -5 && value >= -15) {
                    less_high_char_genres.push("War", "Action", "Horror");
                } else if (value >= -5) {
                    high_char_genres.push("War", "Action", "Horror");
                }
            } else {
                if (value < 0.2) {
                    if (key === "tempo") {
                        //"drama" & "romance" correspond to low tempo
                        low_char_genres.push("Drama", "Romance")
                    } else if (key === "acousticness") {
                        //"action", "adventure", "thriller", & "scifi" correspond to low acousticness
                        low_char_genres.push("Action", "Adventure", "Thriller", "Sci-Fi");
                    } else if (key === "danceability") {
                        //"horror", "war", "documentary", & "crime" correspond to low danceability
                        low_char_genres.push("Horror", "War", "Documentary", "Crime");
                    } else if (key === "energy") {
                        //"romance", "drama", & "mystery" correspond to low energy
                        low_char_genres.push("Romance", "Drama", "Mystery");
                    } else if (key === "valence") {
                        //"horror", "war", "drama", and "crime" correspond to low valence
                        low_char_genres.push("Horror", "War", "Drama", "Crime");
                    }
                } else if (value < 0.4) {
                    if (key === "tempo") {
                        //"drama" & "romance" correspond to low tempo
                        less_low_char_genres.push("Drama", "Romance")
                    } else if (key === "acousticness") {
                        //"action", "adventure", "thriller", & "scifi" correspond to low acousticness
                        less_low_char_genres.push("Action", "Adventure", "Thriller", "Sci-Fi");
                    } else if (key === "danceability") {
                        //"horror", "war", "documentary", & "crime" correspond to low danceability
                        less_low_char_genres.push("Horror", "War", "Documentary", "Crime");
                    } else if (key === "energy") {
                        //"romance", "drama", & "mystery" correspond to low energy
                        less_low_char_genres.push("Romance", "Drama", "Mystery");
                    } else if (key === "valence") {
                        //"horror", "war", "drama", and "crime" correspond to low valence
                        less_low_char_genres.push("Horror", "War", "Drama", "Crime");
                    }
                } else if (value < 0.8 && value >= 0.6) {
                    if (key === "tempo") {
                        //"musical", "action", "comedy", & "adventure" correspond to high tempo
                        less_high_char_genres.push("Musical", "Action", "Comedy", "Adventure")
                    } else if (key === "acousticness") {
                        //"romance", "history", & "family" correspond to high acousticness
                        less_high_char_genres.push("Romance", "History", "Family");
                    } else if (key === "danceability") {
                        //"musical", "family", "scifi", & "fantasy" correspond to high danceability
                        less_high_char_genres.push("Musical", "Family", "Sci-Fi", "Fantasy");
                    } else if (key === "energy") {
                        //"adventure", "action", "thriller", "scifi", & "fantasy" correspond to high energy
                        less_high_char_genres.push("Adventure", "Action", "Thriller", "Sci-Fi", "Fantasy");
                    } else if (key === "valence") {
                        //"comedy", "romance", & "family" correspond to high valence
                        less_high_char_genres.push("Comedy", "Romance", "Family");
                    }
                } else if (value >= 0.8) {
                    if (key === "tempo") {
                        //"musical", "action", "comedy", & "adventure" correspond to high tempo
                        high_char_genres.push("Musical", "Action", "Comedy", "Adventure")
                    } else if (key === "acousticness") {
                        //"romance", "history", & "family" correspond to high acousticness
                        high_char_genres.push("Romance", "History", "Family");
                    } else if (key === "danceability") {
                        //"musical", "family", "scifi", & "fantasy" correspond to high danceability
                        high_char_genres.push("Musical", "Family", "Sci-Fi", "Fantasy");
                    } else if (key === "energy") {
                        //"adventure", "action", "thriller", "scifi", & "fantasy" correspond to high energy
                        high_char_genres.push("Adventure", "Action", "Thriller", "Sci-Fi", "Fantasy");
                    } else if (key === "valence") {
                        //"comedy", "romance", & "family" correspond to high valence
                        high_char_genres.push("Comedy", "Romance", "Family");
                    }
                }
            }
        })

        let genres = [];

        genres.push(high_char_genres);
        genres.push(low_char_genres);

        //if we don't have any characteristics of scale "1" or "5", we use the genres corresponding to "2" & "4"
        if (high_char_genres.length === 0 && low_char_genres.length === 0) {
            genres.push(less_high_char_genres);
            genres.push(less_low_char_genres);
        }

        genres = genres.flat(1)

        //grab any duplicate genres
        let duplicates = genres.filter((item, index) => genres.indexOf(item) !== index);

        let final_genre_1;
        let final_genre_2;
        let final_genre_3;
        let final_genre_4;
        let final_genres = [];

        //if we have duplicates, pick a random one to be the final genre
        if (duplicates.length !== 0) {
            final_genre_3 = duplicates[Math.floor(Math.random() * duplicates.length)];
            final_genre_4 = duplicates[Math.floor(Math.random() * duplicates.length)];
            // final_genres.push(final_genre_3);
            // final_genres.push(final_genre_4);
        } else { //otherwise, just pick a random generated genre
            final_genre_3 = genres[Math.floor(Math.random() * genres.length)];
            final_genre_4 = genres[Math.floor(Math.random() * duplicates.length)];
            // final_genres.push(final_genre_3);
            // final_genres.push(final_genre_4);
        }

        final_genre_1 = genres[Math.floor(Math.random() * genres.length)];
        final_genre_2 = genres[Math.floor(Math.random() * genres.length)];

        final_genres.push(final_genre_1);
        final_genres.push(final_genre_2);
        final_genres.push(final_genre_3);
        final_genres.push(final_genre_4);
        console.log(final_genres);

        // this.setState({genre_1: final_genre_1});
        // this.setState({genre_2: final_genre_2});
        // this.setState({genre_3: final_genre_3});
        // this.setState({genre_4: final_genre_4});
        this.setState({genres: final_genres});

        //assigning the final genre to its genre id so we can query the database
        let genre_id_1 = this.setGenreID(final_genre_1);
        let genre_id_2 = this.setGenreID(final_genre_2);
        let genre_id_3 = this.setGenreID(final_genre_3);
        let genre_id_4 = this.setGenreID(final_genre_4);

        // console.log(genre_id);

        let genre_ids = [];

        genre_ids.push(genre_id_1);
        genre_ids.push(genre_id_2);
        genre_ids.push(genre_id_3);
        genre_ids.push(genre_id_4);

        console.log(genre_ids);
        this.setState({genre_ids: genre_ids});

        // this.setState({genre_id_1: genre_id_1});
        // this.setState({genre_id_2: genre_id_2});
        // this.setState({genre_id_3: genre_id_3});
        // this.setState({genre_id_4: genre_id_4});

        return genre_ids;
    }

    setGenreID(final_genre) {
        let genre_id;
        if (final_genre === "Action") {
            genre_id = 28;
        } else if (final_genre === "Adventure") {
            genre_id = 12;
        } else if (final_genre === "Comedy") {
            genre_id = 35;
        } else if (final_genre === "Crime") {
            genre_id = 80;
        } else if (final_genre === "Documentary") {
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
        return genre_id;
    }

    //function to get the top artist
    async getArtist(){
        const artist = this.state.art_name;
        return artist;
    }

    // Function to generate new recommendations
    async generateNewRecommendations() {
        try {
            await this.grabChars();  // Refresh characteristics
            await this.grabArtist(); // Refresh top artist
            await this.getGenre(); // Get new genre
            const genre_ids = this.state.genre_ids;
            const genres = this.state.genres;
            const artist_name = await this.getArtist(); // Get top artist name

            // Fetch new movies based on the updated genre and artist
            const movie_responseArt = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-artist-movies-from-db?artist_band=${artist_name}`);
            const movie_dataArt = await movie_responseArt.json();
            console.log("artist");
            console.log(movie_dataArt);

            let movie_array = [];

            let genre_1 = genre_ids[0];
            console.log(genre_1);
            const movie_response_1 = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?genre_id=${genre_1}`);
            let movie_data_1 = await movie_response_1.json();
            console.log(movie_data_1);
            movie_data_1.movies[0].reason = `Because your generated movie genre is ${genres[0]}`;
            movie_array.push(movie_data_1.movies[0]);
            console.log(movie_array);

            let genre_2 = genre_ids[1];
            const movie_response_2 = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?genre_id=${genre_2}`);
            let movie_data_2 = await movie_response_2.json();
            movie_data_2.movies[0].reason = `Because your generated movie genre is ${genres[1]}`;
            movie_array.push(movie_data_2.movies[0]);

            let genre_3 = genre_ids[2];
            const movie_response_3 = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?genre_id=${genre_3}`);
            let movie_data_3 = await movie_response_3.json();
            movie_data_3.movies[0].reason = `Because your generated movie genre is ${genres[2]}`;
            movie_array.push(movie_data_3.movies[0]);

            let genre_4 = genre_ids[3];
            const movie_response_4 = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?genre_id=${genre_4}`);
            let movie_data_4 = await movie_response_4.json();
            movie_data_4.movies[0].reason = `Because your generated movie genre is ${genres[3]}`;
            movie_array.push(movie_data_4.movies[0]);

            // If we have a movie for the top artist, overwrite the first movie in the array and provide a special reason
            console.log(movie_dataArt.movies);
            if (movie_dataArt.movies.length !== 0) {
                movie_array[0] = movie_dataArt.movies[0];
                movie_array[0].reason = `Because your Top Artist is ${artist_name}`;
            }

            // Update state with new movies
            this.setState({movies: movie_array, artMovies: movie_dataArt});
        } catch (error) {
            console.error("Failed to fetch new recommendations", error);
        }
    }

    constructor(props) {
        super(props);
        // Bind the new method
        this.generateNewRecommendations = this.generateNewRecommendations.bind(this);
    }

    async componentDidMount() {
        try {
            await this.grabChars();  // Refresh characteristics
            await this.grabArtist(); // Refresh top artist
            await this.getGenre(); // Get new genre
            const genre_ids = this.state.genre_ids;
            const genres = this.state.genres;
            // const artist_name = await this.getArtist(); // Get top artist name
            const artist_name = "Ed Sheeran";

            // Fetch new movies based on the updated genre and artist
            const movie_responseArt = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-artist-movies-from-db?artist_band=${artist_name}`);
            const movie_dataArt = await movie_responseArt.json();
            console.log("artist");
            console.log(movie_dataArt);

            let movie_array = [];

            let genre_1 = genre_ids[0];
            console.log(genre_1);
            const movie_response_1 = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?genre_id=${genre_1}`);
            let movie_data_1 = await movie_response_1.json();
            console.log(movie_data_1);
            movie_data_1.movies[0].reason = `Because your generated movie genre is ${genres[0]}`;
            movie_array.push(movie_data_1.movies[0]);
            console.log(movie_array);

            let genre_2 = genre_ids[1];
            const movie_response_2 = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?genre_id=${genre_2}`);
            let movie_data_2 = await movie_response_2.json();
            movie_data_2.movies[0].reason = `Because your generated movie genre is ${genres[1]}`;
            movie_array.push(movie_data_2.movies[0]);

            let genre_3 = genre_ids[2];
            const movie_response_3 = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?genre_id=${genre_3}`);
            let movie_data_3 = await movie_response_3.json();
            movie_data_3.movies[0].reason = `Because your generated movie genre is ${genres[2]}`;
            movie_array.push(movie_data_3.movies[0]);

            let genre_4 = genre_ids[3];
            const movie_response_4 = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?genre_id=${genre_4}`);
            let movie_data_4 = await movie_response_4.json();
            movie_data_4.movies[0].reason = `Because your generated movie genre is ${genres[3]}`;
            movie_array.push(movie_data_4.movies[0]);

            // If we have a movie for the top artist, overwrite the first movie in the array and provide a special reason
            console.log(movie_dataArt.movies);
            if (movie_dataArt.movies.length !== 0) {
                movie_array[0] = movie_dataArt.movies[0];
                movie_array[0].reason = `Because your Top Artist is ${artist_name}`;
            }

            // Update state with new movies
            this.setState({movies: movie_array, artMovies: movie_dataArt});
        } catch (error) {
            console.error("Failed to fetch new recommendations", error);
        }
    }

    render() {
        const movies = this.state.movies;
        return (
            <div id="Recommendations">
                <header>
                    <h2>Recommendations</h2>
                    <button onClick={this.generateNewRecommendations} className="new-recommendations-btn"> <FontAwesomeIcon icon={faShuffle} /> New Recommendations</button>
                    {/*<p><i> &emsp; &emsp; Hover over the poster for the synopsis of the movie.</i></p>*/}
                    <br/>
                </header>
                <div className="movie-recommendation-container">
                    {/*For every sample movie display its poster, title, and reasoning*/}
                    {movies?.map((item, index) => (
                        // <p>poop</p>
                        <div className="movie-recommendation" key={index}>
                            <div className="reason">
                                <p>{item.reason}</p>
                            </div>
                            <br/>
                            <div className="hover-container">
                                <img className="movie-poster" src={"https://image.tmdb.org/t/p/original" + item.poster_path} alt="movie poster"></img>
                                <div className="overlay">
                                    <div className="hover-text">({item.release_date?.substring(0, 4)}) {item.overview}</div>
                                </div>
                            </div>
                                <h4>{item.title}</h4>
                                <p>{"Rating: " + item.certification}</p>
                        </div>
                    ))}
                </div>
                {/* Adding warning to prevent underage users from watching rated R movies */}
                <div className="warning">
                    <p>Users under the age of 17 should only watch rated R movies with parental permission.</p>
                </div>
            </div>
        )
    }
}

export default Movies;