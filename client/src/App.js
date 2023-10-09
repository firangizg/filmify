import './App.css';
import Stats from './components/Stats';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginButton from './components/LoginButton';
import LoggedIn from './components/LoggedIn';

const App = () => {
  return (
    <div className="App">
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
