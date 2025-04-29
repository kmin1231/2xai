// src/pages/splash/Splash.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

import Splash from '@/components/splash/Splash';
import './splash.css';

const SplashPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <div onClick={handleClick}>
      <Splash />
    </div>
  );
};

export default SplashPage;