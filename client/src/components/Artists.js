//Represents a component that displays the top artists.

import React, { Component } from 'react';
import '../App.css';

class Artists extends Component {
  state = {
    artists: [],
  };

  // Fetches the top artists using the access token and updates the state.
  
  async componentDidMount() {
    // Get the access token from the props
    const { accessToken } = this.props;
    // If the access token exists, fetch the top artists
    if (accessToken) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/top-artists?access_token=${accessToken}`);
        const data = await response.json();
        this.setState({ artists: data.items });
      } catch (error) {
        console.error("Failed to fetch top artists:", error);
      }
    }
  }
  // Renders the top artists
  render() {
    const { artists } = this.state;
    // Return artists and their image
    return (
      <div id="Top Artists">
        <h3>Top Artists</h3>
        <div className="tracks-artists-container">
          {artists.map((artist) => (
            <div className="track-artist" key={artist.id}>
              {artist.images[0] && (
                <img src={artist.images[0].url} alt={artist.name} />
              )}
              <h4>{artist.name}</h4>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Artists;
