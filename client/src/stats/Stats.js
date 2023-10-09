import React, { Component } from 'react';
import '../App.css';

import Genres from './Genres.js';
import Characteristics from './Characteristics.js';
import Tracks from './Tracks.js';
import Artists from './Artists.js';

class Stats extends Component {
  render() {
    return (
      <div className="stats-container" id="stats">
        <h2>Statistics</h2>
        <Genres />
        <Characteristics />
        <div className="list-stats-container">
          <Tracks />
          <Artists />
        </div>
      </div>
    )
  }
}

export default Stats;