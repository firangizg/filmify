import './App.css';
import Movies from './components/Movies'
import Stats from './components/Stats';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginButton from './components/LoginButton';
import LoggedIn from './components/LoggedIn';

const App = () => {
  return (
    <div className="App">
    {/* TODO: make App Title/header its own component  */}
    <h1 className="AppTitle">Filmify</h1>
      <Movies />
      <Stats />
      <Router>
        <Routes>
          <Route path="/logged_in" element={<LoggedIn />} />
          <Route path="/" element={<LoginButton />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
