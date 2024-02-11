// Expired.js: the page that is displayed when the user's session has expired

import React from 'react';

const Expired = () => {
  const handleLoginRedirect = () => {
    window.location.href = '/'; // Redirects user back to the home page
  };
  // The page displays a message to the user that their session has expired and provides a button to log in again
  return (
    <div>
      <h1>Session Expired</h1>
      <p>Your session has expired. Please log in again to continue.</p>
      <button onClick={handleLoginRedirect}>Log In Again</button>
    </div>
  );
};

export default Expired;
