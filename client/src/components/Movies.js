// This file contains the code for the Recommendations component.
import React, { Component } from 'react';
import '../App.css';

//Component for displaying the movies recommended
class Movies extends Component {
    state = {
        spotify_characteristics: [],
        movies: [],
        genre_id: 0,
        genre: "",
    };
    async grabChars() {
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
    async getGenre ()  {
        const characteristics = this.state.spotify_characteristics;
        let low_char_genres = [];
        let less_low_char_genres = [];
        let high_char_genres = [];
        let less_high_char_genres = [];

        Object.entries(characteristics).forEach(([key, value]) => {
            if (key === "speechiness") {
                if (value < 0.66 && value >= 0.33) {
                    less_high_char_genres.push("Documentary", "History");
                } else if (value >= 0.66) {
                    high_char_genres.push("Documentary", "History");
                }
            } else if (key === "loudness") {
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
                } else if (value < 0.8 && value >= 0.6) {
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
                } else if (value >= 0.8) {
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

        let duplicates = genres.filter((item, index) => genres.indexOf(item) !== index);

        let final_genre;

        if(duplicates.length !== 0) {
            final_genre = duplicates[Math.floor(Math.random()*duplicates.length)];
        } else {
            final_genre = genres[Math.floor(Math.random()*genres.length)];
        }

        this.setState({genre: final_genre});

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
        this.setState({genre_id: genre_id});
        return genre_id;
    }
    async componentDidMount() {
        try {
            await this.grabChars();
            const genre_num = await this.getGenre();
            const movie_response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?genre_id=${genre_num}`);
            const movie_data = await movie_response.json();
            this.setState({movies: movie_data.movies});
            console.log(movie_data.movies);
        } catch (error) {
            console.error("Failed to fetch characteristics, genre, and movies", error);
        }
    }

    async getDBMovies () {
        const genre_id = this.getGenre();
        const movie_response = await  fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?genre_id=${genre_id}`);
        const movie_data = await movie_response.json();
        this.setState({movies: movie_data});
        // return movie_data;
    }
    render() {
        // const movies = this.getDBMovies();
        const movies = this.state.movies;
        const genre = this.state.genre;

        return (
            <div id="Recommendations">
                <h2>Recommendations</h2>
                <div className="movie-recommendation-container">
                    {/*<h4>Your suggested genre is: {this.state.genre}</h4>*/}
                     {/*For every sample movie display its poster, title, and reasoning*/}
                    {movies?.map((item, index) => (
                        <div className="movie-recommendation" key={index}>
                            <div className="reason">
                                <p>Because your generated movie genre is {genre}</p>
                            </div>
                            <br/>
                            <img className="movie-poster" src={"https://image.tmdb.org/t/p/original" + item.poster_path} alt="movie poster"></img>
                                <h4>{item.title}</h4>
                                <p>{"Rating: " + item.certification}</p>
                        </div>
                    ))}

                </div>
            </div>
        )
    }
}

export default Movies;