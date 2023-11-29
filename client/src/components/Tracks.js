import React, { Component } from 'react';
import '../App.css';

class Tracks extends Component {
  state = {
    tracks: [],
  };

  async componentDidMount() {
    const { accessToken } = this.props;
    if (accessToken) {
      try {
        // Fetch data from your backend
        const response = await fetch(`http://localhost:3001/top-tracks?access_token=${accessToken}`);
        const data = await response.json();
        this.setState({ tracks: data.items });
      } catch (error) {
        console.error("Failed to fetch top tracks:", error);
      }
    }
  }

  // Component for displaying all top tracks
  render() {
    const { tracks } = this.state;

    return (
      <div id="Top Tracks">
        <h3>Top Tracks</h3>
        <div className="tracks-artists-container">
          {/* For each of the top tracks, display the track artwork, title, and artist */}
          {tracks.map((item) => (
            <div className="track" key={item.id}>
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
