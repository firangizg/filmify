import './App.css';
import Stats from './components/Stats';

import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginButton from './components/LoginButton';

const App = () => {
  // Detect if user is logged in by checking the URL for the access token
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');

  return (
    <div className="App">
      {accessToken ? <Stats /> : (
        <>
          <h1 className="AppTitle">Filmify</h1>
          <LoginButton />
        </>
      )}
      <Router>
        <Routes>
        </Routes>
      </Router>
    </div>
  );
};

export default App;