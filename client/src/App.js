import React from 'react';
import './App.css';
import Stats from './components/Stats';
import Movies from './components/Movies';
import Expired from './components/Expired';
import LoginButton from './components/LoginButton';
import html2canvas from 'html2canvas';

const App = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');
  const hasExpired = window.location.pathname.endsWith('/expired');
  // add a function to handle the download of the summary
  const handleDownload = () => {
    const appElement = document.getElementById('root');
    // use html2canvas to take a screenshot of the app and download it
    html2canvas(appElement, { useCORS: true, scrollY: -window.scrollY }).then((canvas) => {
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
          <h1 className="AppTitle">Filmify</h1>
          <Movies />
          <Stats />
          <button onClick={handleDownload}>Download Summary</button>
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
