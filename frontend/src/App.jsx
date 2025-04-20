import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';

import SplashPage from './pages/splash/Splash';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
      </Routes>
    </Router>
  );
}

export default App;