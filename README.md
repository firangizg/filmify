# filmify 
## Description
Filmify is a web application that suggests users movies to watch based on their recent Spotify listening history, gathering data from user's top genres, artists and tracks. 

## Accessing the application

The frontend of the application is currently hosted  [here](https://mango-rock-0c2ad6d0f.4.azurestaticapps.net/)

The backend is currently being hosted on Microsoft Azure at [filmify.azurewebsites.net](https://filmify.azurewebsites.net/) however it needs further refinement to be accessed for production. 

## Running the application locally
1. Clone the repository
2. Install the dependencies with `npm install`
3. Create a `.env` file in the root directory and add the following variables:
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
API_KEY=movies_db_api_key
```
```
SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET can be obtained from https://developer.spotify.com/dashboard/
API_KEY can be obtained from https://www.themoviedb.org/settings/api
```
4. Run the application with `npm start`
5. Open http://localhost:3000 to view it in the browser.

## ENV variables
Currently, in client folder, there is .env.development and .env.production files. Both contain REACT_APP_API_BASE_URL. 

In server, .env contains, in addition to the api credentials, the following variables: 

CLIENT_BASE_URL is set to http://localhost:3000
SERVER_BASE_URL is set to http://localhost:3001 

We also have .env.production that sets those variables to https://filmify.azurewebsites.net/. 
## Technologies used
- React
- Node.js
- Express
- MongoDB
- Mongoose
- Spotify API
- The Movie Database API

## Work in Progress
We are currently working on deploying it to a live website so local installation is not required.
