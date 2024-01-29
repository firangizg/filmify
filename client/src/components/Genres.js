// This file contains the code for the Top Genres component.
import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';

class Genres extends Component {
  // Initialize the state
  state = {
    genres: [],
    error: null,
  };

  // Function that is called when the component is mounted
  componentDidMount() {
    this.fetchTopGenres();
  }

  // Get the top genres from the backend and update the state
  fetchTopGenres = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/top-genres?access_token=${this.props.accessToken}`);
      if (response.data && response.data.genres) {
        this.setState({ genres: response.data.genres });
      }
    } // Catch any errors and update the error state
    catch (error) {
      console.error('Error fetching top genres:', error);
      this.setState({ error: 'Failed to fetch top genres' });
    }
  };
  // Render the top genres
  // Display the genre name
  render() {
    const { genres, error } = this.state;

    return (
      <div id="Top Genres">
        <h3>Top Genres</h3>
        <div className="genres-container">
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