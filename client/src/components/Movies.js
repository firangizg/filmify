import React, { Component } from 'react';
import '../App.css';

import sample from './sample.json'

class Movies extends Component {
    render() {
        return (
            <div id="Recommendations">
                <h2>Recommendations</h2>
                <div className="movie-recommendation-container">
                    {sample.movies.map((item) => (
                        <div className="movie-recommendation">
                            {/*<div>*/}
                            <img className="movie-poster" src={'./test_poster.jpg'}></img>
                            {/*<div>*/}
                                <h4>{item.movie_title}</h4>
                                <p>{item.recommendation_reasoning}</p>
                            {/*</div>*/}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default Movies;