import React, { Component } from 'react';
import '../App.css';

import sample from './sample.json'

class Artists extends Component {
  render() {
    return (
      <div id="Top Artists">
        <h3>Top Artists</h3>
        <div className="tracks-artists-container">
          {sample.artists.map((item) => (
            <div className="track-artist">
              <img src={'./test_artist.png'}></img>
              <h4>{item.artist_name}</h4>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Artists;