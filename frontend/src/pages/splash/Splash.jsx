// src/pages/splash/Splash.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

import Splash from '@/components/splash/Splash';
import './splash.css';

const SplashPage = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/login');
  };

  return <Splash onStartClick={handleStartClick} />;
};

export default SplashPage;