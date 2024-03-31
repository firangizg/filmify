import React from 'react';
import './App.css';
import Stats from './components/Stats';
import Movies from './components/Movies';
import Expired from './components/Expired';
import LoginButton from './components/LoginButton';
import html2canvas from 'html2canvas';
import logo from './components/updated_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');
  const hasExpired = window.location.pathname.endsWith('/expired');
  // add a function to handle the download of the summary
  const handleDownload = () => {
    const appElement = document.getElementById('stats');
    // use html2canvas to take a screenshot of the app and download it
    html2canvas(appElement, { 
      useCORS: true, 
      scrollY: -window.scrollY,
      onclone: (clonedDocument) => {
        // style the cloned document to make it look better
        const clonedStatsElement = clonedDocument.getElementById('stats');
        clonedStatsElement.style.paddingLeft = '12rem';  
        clonedStatsElement.style.paddingRight = '12rem';
        clonedStatsElement.style.paddingTop = '1rem';
      }
    }).then((canvas) => {
      const base64image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = base64image;
      link.download = 'FilmifySummary.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  if (hasExpired) {
    return <Expired />;
  }

  return (
    <div className="App">
      {accessToken ? (
        <>
          <h1 className="AppTitle">Filmify<img src={logo} alt="logo"></img></h1>
          <button onClick={handleDownload} className='download-btn'>
          <FontAwesomeIcon icon={faDownload} /> Download Summary</button>
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
