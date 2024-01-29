// Server entry point
import express from 'express';
import cors from 'cors';
import spotifyRoutes from './routes/spotifyRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import config from './config.js';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Depending on the NODE_ENV, load the correct .env file
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

const app = express();

// Middlewares
app.use(cors({
  origin: config.clientBaseUrl // Client URL from the config
}));

// For detailed logging
app.use(morgan('dev'));

// Routes
app.use(spotifyRoutes);
app.use(movieRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something is not working');
});

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

export default app;
