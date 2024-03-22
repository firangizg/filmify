// This file contains the code for the Recommendations component.
import React, { Component } from 'react';
import '../App.css';

//Component for displaying the movies recommended
class Movies extends Component {
    state = {
        spotify_artist: [],
        spotify_characteristics: [],
        movies: [],
        artMovies: [],
        art_name: "",
        genre_id: 0,
        genre: "",
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

        let final_genre;

        //if we have duplicates, pick a random one to be the final genre
        if (duplicates.length !== 0) {
            final_genre = duplicates[Math.floor(Math.random() * duplicates.length)];
        } else { //otherwise, just pick a random generated genre
            final_genre = genres[Math.floor(Math.random() * genres.length)];
        }

        this.setState({genre: final_genre});

        let genre_id;

        //assigning the final genre to its genre id so we can query the database
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
        console.log(genre_id);
        this.setState({genre_id: genre_id});
        return genre_id;
    }

    //function to get the top artist
    async getArtist(){
        const artist = this.state.art_name;
        return artist;
    }

    async componentDidMount() {
        try {
            await this.grabChars();
            await this.grabArtist();
            const genre_num = await this.getGenre();
            const artist_name = await this.getArtist();

            //grab top artist movie from database
            const movie_responseArt = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-artist-movies-from-db?artist_band=${artist_name}`);
            const movie_dataArt = await movie_responseArt.json();

            //grab rest of the movies from database with the generated genre
            const movie_response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?genre_id=${genre_num}`);
            let movie_data = await movie_response.json();

            //add reasoning to recommendation for each movie
            movie_data.movies.map((item, index) => {
                item.reason = `Because your generated movie genre is ${this.state.genre}`
            });

           //if we have a movie for the top artist, overwrite the first movie in the array
            if(movie_dataArt.movies.length !== 0) {
                movie_data.movies[0] = movie_dataArt.movies[0];
                movie_data.movies[0].reason = `Because your Top Artist is ${artist_name}`;
            }
            this.setState({movies: movie_data.movies});
            this.setState({artMovies: movie_dataArt.movies});
            console.log(movie_data.movies);
            console.log(movie_dataArt.movies[0]);
        } catch (error) {
            console.log("failed to fetch artist", error);
            console.log(this.state.art_name);
            console.error("Failed to fetch characteristics, genre, and movies", error);
        }
    }

    render() {
        const movies = this.state.movies;
        return (
            <div id="Recommendations">
                <h2>Recommendations</h2>
                <div className="movie-recommendation-container">
                    {/*For every sample movie display its poster, title, and reasoning*/}
                    {movies?.map((item, index) => (
                        <div className="movie-recommendation" key={index}>
                            <div className="reason">
                                <p>{item.reason}</p>
                            </div>
                            <br/>
                            <img className="movie-poster" src={"https://image.tmdb.org/t/p/original" + item.poster_path} alt="movie poster"></img>
                                <h4>{item.title}</h4>
                                <p>{"Rating: " + item.certification}</p>
                        </div>
                    ))}
                </div>
                <div className="warning">
                    <p>Users under the age of 17 should only watch rated R movies with parental permission.</p>
                </div>
            </div>
        )
    }
}

export default Movies;