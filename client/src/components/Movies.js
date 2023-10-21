import React, { Component } from 'react';
import '../App.css';

import sample from './sample.json'

//Component for displaying the movies recommended
class Movies extends Component {
    render() {
        return (
            <div id="Recommendations">
                <h2>Recommendations</h2>
                <div className="movie-recommendation-container">
                    {/* For every sample movie display its poster, title, and reasoning*/}
                    {sample.movies.map((item) => (
                        <div className="movie-recommendation">
                            <img className="movie-poster" src={item.movie_poster}></img>
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