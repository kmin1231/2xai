// src/pages/splash/Splash.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Splash from '@/components/splash/Splash';
import './splash.css';

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('splash-page');
    return () => {
      document.body.classList.remove('splash-page');
    };
  }, []);

  const handleStartClick = () => {
    navigate('/login');
  };

  return <Splash onStartClick={handleStartClick} />;
};

export default SplashPage;