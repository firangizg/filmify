import React, { Component } from 'react';
import '../App.css';

import Genres from './Genres.js';
import Characteristics from './Characteristics.js';
import Tracks from './Tracks.js';
import Artists from './Artists.js';

class Stats extends Component {
  state = {
    accessToken: null,
  };

  componentDidMount() {
    // Grabbing the token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
      this.setState({ accessToken });
    }
  }

  render() {
    const { accessToken } = this.state;

    if (!accessToken) return null; // Don't render anything if no accessToken

    return (
      <div className="stats-container" id="stats">
        <h2>Statistics</h2>
        <Genres accessToken={accessToken} />
        <Characteristics accessToken={accessToken} />
        <div className="list-stats-container">
          <Tracks accessToken={accessToken} />
          <Artists accessToken={accessToken} />
        </div>
      </div>
    );
  }
}

export default Stats;
