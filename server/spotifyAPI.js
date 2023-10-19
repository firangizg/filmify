// Import libraries express.js for web server, axios for HTTP requests, dotenv for environment variables
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();
// Initialize Express app
const app = express();
app.use(cors());
// Use the port from env variables or use 3001 as default
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000'  // your react app's address
}));

// Route handler for GET requests to /login
app.get('/login', (req, res) => {
  // define spotify scopes we need access to
  const scopes = 'user-library-read user-read-recently-played user-top-read';

  // redirect user to spotify authorization
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + process.env.SPOTIFY_CLIENT_ID +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent('http://localhost:3001/callback')
  );
});

// Start Express.js server 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Define route handler for GET requests to /callback
app.get('/callback', async (req, res) => {
  // Extract authorization code from query
  const code = req.query.code || null;
  try {
    // Create URLSearchParams to hold parameters to fetch access tokens
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('redirect_uri', 'http://localhost:3001/callback');
    params.append('grant_type', 'authorization_code');

    // Setup config for Axios request
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
      }
    };
    
    // POST request to Spotify to exchange authorization code for access tokens
    const response = await axios.post('https://accounts.spotify.com/api/token', params, config);
    
    // Extract data from response
    const data = response.data;
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;

    // TODO: Save the tokens to the database for later use (use PostgreSQL)

    // Redirect user back to client app w the access and refresh tokens
    res.redirect(`http://localhost:3000/logged_in?access_token=${accessToken}&refresh_token=${refreshToken}`);
  } catch (error) {
    // Log errors and redirect user to error page on client side
    console.error('Error fetching access token', error);
    res.redirect(`http://localhost:3000/error`);
  }
});

// New routes for stats
app.get('/top-tracks', fetchTopTracks);
app.get('/top-artists', fetchTopArtists);
app.get('/top-genres', fetchTopGenres);

// Fetch Functions

// Top Tracks
async function fetchTopTracks(req, res) {
  try {
      const { data } = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
          headers: {
              'Authorization': 'Bearer ' + req.query.access_token
          }
      });
      res.json(data);
  } catch (error) {
    console.error('Error details:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch top tracks" });
  } 
}

// Top Artists
async function fetchTopArtists(req, res) {
  try {
      const { data } = await axios.get('https://api.spotify.com/v1/me/top/artists', {
          headers: {
              'Authorization': 'Bearer ' + req.query.access_token
          }
      });
      res.json(data);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch top artists" });
  }
}

// Top Genres
async function fetchTopGenres(req, res) {
  try {
      const { data } = await axios.get('https://api.spotify.com/v1/me/top/artists', {
          headers: {
              'Authorization': 'Bearer ' + req.query.access_token
          }
      });

      const genreCounts = {};
      for (let artist of data.items) {
          for (let genre of artist.genres) {
              genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          }
      }

      // Sort genres by count and return top ones
      const topGenres = Object.entries(genreCounts).sort(([,a], [,b]) => b - a).map(([genre]) => genre);
      res.json({genres: topGenres});
      
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch top genres" });
  }
}
  