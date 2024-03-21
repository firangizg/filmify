// This file contains the code for the Recommendations component.
import React, { Component } from 'react';
import '../App.css';

//Component for displaying the movies recommended
class Movies extends Component {
    state = {
        spotify_artist: [],
        movies: [],
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
        const characteristics = this.state.spotify_artist;

        Object.entries(characteristics).forEach(([key, value]) => {
            if (key === "speechiness") {
                if (value < 0.66 && value >= 0.33) {
                    less_high_char_genres.push("Documentary", "History");
                } else if (value >= 0.66) {
                    high_char_genres.push("Documentary", "History");
                }
            }
        })
        let genres = [];


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

        let artistBand;

        artistBand = "";


        console.log(artistBand);
        this.setState({genre_id: genre_id});
        return genre_id;
    }
    async componentDidMount() {
        try {
            await this.grabChars();
            const artist_band= await this.getGenre();
            const movie_response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?artist_band=${artist_band}`);
            const movie_data = await movie_response.json();
            this.setState({movies: movie_data.movies});
            console.log(movie_data.movies);
        } catch (error) {
            console.error("Failed to fetch characteristics, genre, and movies", error);
        }
    }

    async getDBMovies () {
        const artist_band = this.getArtistGenre();
        const movie_response = await  fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?artist_band=${artist_band}`);
        const movie_data = await movie_response.json();
        this.setState({movies: movie_data});
        // return movie_data;
    }
    render() {
        // const movies = this.getDBMovies();
        const movies = this.state.movies;

        return (
            <div id="Recommendations">
                <h2>Recommendations</h2>
                <div className="movie-recommendation-container">
                    {/*<h4>Your suggested genre is: {this.state.genre}</h4>*/}
                    {/*For every sample movie display its poster, title, and reasoning*/}
                    {movies?.map((item, index) => (
                        <div className="movie-recommendation" key={index}>
                            <img className="movie-poster" src={"https://image.tmdb.org/t/p/original" + item.poster_path} alt="movie poster"></img>
                            <h4>{item.title}</h4>
                        </div>
                    ))}

                </div>
            </div>
        )
    }
}

export default Movies;