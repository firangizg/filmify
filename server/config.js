import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  clientBaseUrl: process.env.CLIENT_BASE_URL || 'http://localhost:3000',
  serverBaseUrl: process.env.SERVER_BASE_URL || 'http://localhost:3001',
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  movieApiKey: process.env.API_KEY,
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password:process.env.PASSWORD
};

export default config;