// This file contains the component for the top tracks of the user.
import React, { Component } from 'react';
import '../App.css';

class Tracks extends Component {
  // Initialize the state
  state = {
    tracks: [],
  };

  // Function that is called when the component is mounted
  async componentDidMount() {
    const { accessToken } = this.props;
    // Fetch the top tracks if the access token exists
    if (accessToken) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/top-tracks?access_token=${accessToken}`);
        const data = await response.json();
        this.setState({ tracks: data.items });
      } catch (error) {
        console.error("Failed to fetch top tracks:", error);
      }
    }
  }

  // Render the top tracks
  render() {
    const { tracks } = this.state;

    // Display the track name and artist name
    return (
      <div id="Top Tracks">
        <h3>Top Tracks</h3>
        <div className="tracks-artists-container">
          {tracks.map((item) => (
            <div className="track-artist" key={item.id}>
              <img src={item.album.images[0].url} alt={item.name}></img>
              <div>
                <h4>{item.name}</h4>
                <p>{item.artists[0].name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Tracks;
