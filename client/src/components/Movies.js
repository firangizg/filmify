// This file contains the code for the Recommendations component.
import React, { Component } from 'react';
import '../App.css';

import sample from './sample.json'

//Component for displaying the movies recommended
class Movies extends Component {
    state = {
        // spotify_charactertistics: [],
        movies: [],
    };
    async componentDidMount() {
        const { accessToken } = this.props;
        // Fetch the characteristics
        try {
            const final_chars = [];
            const spotify_response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/track-features?access_token=${accessToken}`);
            const spotify_data = await spotify_response.json();
            // Transform the data into the required format
            const characteristics = Object.keys(spotify_data).map(key => {
                const characteristic_name = key.charAt(0).toUpperCase() + key.slice(1); // Convert to capital case
                const characteristic_score = spotify_data[key].toFixed(2) // Round to 2 decimal places
                final_chars.push({ characteristic_name, characteristic_score })
            }).filter(Boolean);

            const genre_response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-genre?characteristics=${final_chars}`);
            const genre_id = await genre_response.json();

            const movie_response = await  fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?genre_id=${genre_id}`);
            const movie_data = await movie_response.json();
            this.setState({ movies: movie_data });
            console.log(movie_data);
        } catch (error) {
            console.error("Failed to fetch characteristics", error);
        }
    }
    grabMovies = () => {
        const {final_movies} = this.state;
        return final_movies;
    }
    render() {
        let movies = this.grabMovies();
        console.log(movies);
        return (
            <div id="Recommendations">
                <h2>Recommendations</h2>
                <div className="movie-recommendation-container">
                    {/* For every sample movie display its poster, title, and reasoning*/}
                    {movies.map((item, index) => (
                        <div className="movie-recommendation" key={index}>
                            <img className="movie-poster" src={item.movie_poster} alt="movie poster"></img>
                                <h4>{item.movie_title}</h4>
                                <p>{item.recommendation_reasoning}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default Movies;