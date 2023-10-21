import './App.css';
import Stats from './components/Stats';
import Movies from './components/Movies'

import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginButton from './components/LoginButton';

const App = () => {
  // Detect if user is logged in by checking the URL for the access token
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');

  return (
    <div className="App">
        {/*if user is logged in show the final page*/}
      {accessToken ? (
          <>
              <h1 className="AppTitle">Filmify</h1>
              <Movies />
              <Stats />
          </>)
          : (
        <>
            {/* otherwise have the user log in*/}
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
