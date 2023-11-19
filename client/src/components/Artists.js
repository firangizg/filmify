import React, { Component } from 'react';
import '../App.css';

class Artists extends Component {
  state = {
    artists: [],
  };

  async componentDidMount() {
    const { accessToken } = this.props;
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

  render() {
    const { artists } = this.state;

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
