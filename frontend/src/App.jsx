import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import '@fontsource/ibm-plex-sans-kr/400.css';
import '@fontsource/ibm-plex-sans-kr/700.css';

import SplashPage from './pages/splash/Splash';
import Login from './pages/login/Login';
import StudentMain from './pages/student/main/StudentMain';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentMain />} />
      </Routes>
    </Router>
  );
}

export default App;