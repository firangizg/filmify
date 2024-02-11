import './App.css';
import Stats from './components/Stats';
import Movies from './components/Movies';
import Expired from './components/Expired';
import React from 'react';
import LoginButton from './components/LoginButton';

const App = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');
  const hasExpired = window.location.pathname.endsWith('/expired'); 

  if (hasExpired) {
    // Directly return the Expired component without using Router or Routes
    return <Expired />;
  }

  return (
    <div className="App">
      {/* Check if user is logged in and render content accordingly */}
      {accessToken ? (
        <>
          <h1 className="AppTitle">Filmify</h1>
          <Movies />
          <Stats />
        </>
      ) : (
        <>
          <h1 className="AppTitle">Filmify</h1>
          <LoginButton />
        </>
      )}
    </div>
  );
};

export default App;
