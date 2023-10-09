import React, { Component } from 'react';
import '../App.css';

import sample from './sample.json'

class Tracks extends Component {
  render() {
    return (
      <div id="Top Tracks">
        <h3>Top Tracks</h3>
        <div className="tracks-artists-container">
          {sample.tracks.map((item) => (
            <div className="track-artist">
              <img src={'./test_track.png'}></img>
              <div>
                <h4>{item.track_name}</h4>
                <p>{item.artist_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Tracks;