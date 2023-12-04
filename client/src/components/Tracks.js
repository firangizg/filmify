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
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/top-tracks?access_token=${accessToken}`);
        const data = await response.json();
        this.setState({ tracks: data.items });
      } catch (error) {
        console.error("Failed to fetch top tracks:", error);
      }
    }
  }

  render() {
    const { tracks } = this.state;

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
