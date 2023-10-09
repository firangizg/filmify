import React, { Component } from 'react';
import '../App.css';

import sample from './sample.json'

class Genres extends Component {
  render() {
    return (
      <div id="Top Genres">
        <h3>Top Genres</h3>
        <div className="genres-container">
          {sample.genres.map((item) => (
            <div className="genre">
              <p>{item.genre}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Genres;