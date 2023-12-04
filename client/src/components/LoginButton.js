import React from 'react';

// Login Button for Spotify Authentication
const LoginButton = () => {
  // Function to redirect user browser to /login route
  // Server handles Spotify login
  const loginToSpotify = async () => {
    window.location.href = `${process.env.REACT_APP_API_BASE_URL}/login`;
  };
  // Renders button element so that when button is clicked, loginToSpotify is called
  return (
    <button className="LoginButton" onClick={loginToSpotify}>
      Login with Spotify
    </button>
  );
};

// Export the component for use in other parts of the program
export default LoginButton;