import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';

class Genres extends Component {
  state = {
    genres: [],
    error: null,
  };

  componentDidMount() {
    this.fetchTopGenres();
  }

  fetchTopGenres = async () => {
    // Fetch data from your backend
    try {
      const response = await axios.get(`http://localhost:3001/top-genres?access_token=${this.props.accessToken}`);
      if (response.data && response.data.genres) {
        this.setState({ genres: response.data.genres });
      }
    } catch (error) {
      console.error('Error fetching top genres:', error);
      this.setState({ error: 'Failed to fetch top genres' });
    }
  };

  // Component for displaying top genres
  render() {
    const { genres, error } = this.state;

    return (
      <div id="Top Genres">
        <h3>Top Genres</h3>
        <div className="genres-container">
          {/* Display each of the top genres */}
          {genres.map((genre, index) => (
            <div key={index} className="genre">
              <p>{genre}</p>
            </div>
          ))}
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    );
  }
}

export default Genres;