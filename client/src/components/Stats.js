// This file contains the code for the Stats page
// It is the parent component for the Genres, Characteristics, Tracks, and Artists components.

import React, { Component } from 'react';
import '../App.css';

import Genres from './Genres.js';
import Characteristics from './Characteristics.js';
import Tracks from './Tracks.js';
import Artists from './Artists.js';
import MoodAnalysis from './MoodAnalysis.js';

// This component displays the statistics of the song.
class Stats extends Component {
  state = {
    accessToken: null,
  };

  // Function that is called when the component is mounted
  componentDidMount() {
    // Grabbing the token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    // If the token exists, update the state
    if (accessToken) {
      this.setState({ accessToken });
    }
  }
  // Render the stats, if they exist
  render() {
    const { accessToken } = this.state;

    if (!accessToken) return null; // Don't render anything if no accessToken

    // Display the stats, including the Genres, Characteristics, Tracks, and Artists components
    return (
      <div className="stats-container" id="stats">
        <h2>Statistics</h2>
        <Genres accessToken={accessToken} />
        <Characteristics accessToken={accessToken} />
        <MoodAnalysis accessToken={accessToken} />
        <div className="list-stats-container">
          <Tracks accessToken={accessToken} />
          <Artists accessToken={accessToken} />
        </div>
      </div>
    );
  }
}

export default Stats;
