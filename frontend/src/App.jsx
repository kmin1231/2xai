import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import '@fontsource/ibm-plex-sans-kr/400.css';
import '@fontsource/ibm-plex-sans-kr/700.css';

import SplashPage from './pages/splash/Splash';
import Login from './pages/login/Login';
import StudentMain from './pages/student/main/StudentMain';
import CustomLevelKeyword from './pages/student/mode-custom/Keyword';
import CustomLevelResult from './pages/student/mode-custom/Result';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentMain />} />
        <Route path="/student/mode/custom" element={<CustomLevelKeyword />} />
        <Route path="/student/mode/custom/result" element={<CustomLevelResult />} />

      </Routes>
    </Router>
  );
}

export default App;