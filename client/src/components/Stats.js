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

    return (
      <div className="stats-container" id="stats">
        <h2>Statistics</h2>
        {accessToken ? <Genres accessToken={accessToken} /> : <div>Loading genres...</div>}
        {accessToken ? <Characteristics accessToken={accessToken} /> : <div>Loading characteristics...</div>}
        <div className="list-stats-container">
        {accessToken ? <Tracks accessToken={accessToken} /> : <div>Loading tracks...</div>}
        {accessToken ? <Artists accessToken={accessToken} /> : <div>Loading artists...</div>}
        </div>
      </div>
    );
  }
}

export default Stats;