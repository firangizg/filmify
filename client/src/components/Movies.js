// This file contains the code for the Recommendations component.
import React, { Component } from 'react';
import '../App.css';

import sample from './sample.json'

//Component for displaying the movies recommended
class Movies extends Component {
    state = {
        spotify_characteristics: [],
        movies: [],
        genre_id: 0,
    };
    async componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');

        // Fetch the characteristics
        try {
            const spotify_response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/track-features?access_token=${accessToken}`);
            const spotify_data = await spotify_response.json();

            // Transform the data into the required format
            const characteristics = Object.keys(spotify_data).map(key => ({
                characteristic_name: key.charAt(0).toUpperCase() + key.slice(1), // Convert to capital case
                characteristic_score: spotify_data[key].toFixed(2) // Round to 2 decimal places
            }));
            const characteristics_json = JSON.stringify(characteristics);
            console.log(characteristics_json);
            // var str =  String(characteristics_json);
            // var newData = str.replace("[", "");
            // newData = newData.replace("]", "");
            // const char_json = JSON.parse(newData);
            // this.setState({ spotify_characteristics: char_json });


            const genre_response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-genre?characteristics=${this.state.spotify_characteristics}`);
            const genre_json = await genre_response.json();
            console.log(genre_json);
            const genre_id = Number(genre_json);
            // console.log("genre id: ", genre_id);

            // const genre_id = 53;
            this.setState({ genre_id: genre_id});
            // const movie_response = await  fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?genre_id=${genre_id}`);
            // const movie_data = await movie_response.json();
            // this.setState({ movies: movie_data });
            // console.log(movie_data);
        } catch (error) {
            console.error("Failed to fetch characteristics, genre, and movies", error);
        }
    }
    render() {
        let movies = this.state.movies;
        return (
            <div id="Recommendations">
                <h2>Recommendations</h2>
                <div className="movie-recommendation-container">
                    {/*<p> {this.state.spotify_charactertistics}</p>*/}
                     {/*For every sample movie display its poster, title, and reasoning*/}
                    {movies?.map((item, index) => (
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