// Entry point for the client side application
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Create a root for ReactDOM
const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);