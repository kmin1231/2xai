// src/components/header/Header.jsx

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import './Header.css';

const Header = () => {

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userInfo = useSelector((state) => state.auth.userInfo);

  return (
    <header className="header">
      <div className="header-info">

    {/* depends on login status */}
      {isLoggedIn ? (
          `${userInfo.school || "학교명"} | ${userInfo.name || "이름"}`
        ) : (
          "2xAI"
        )}

      </div>
      <div className="nav">
      <Link to="/"><svg xmlns="http://www.w3.org/2000/svg" height="42px" viewBox="0 -960 960 960" width="42px" fill="#1f1f1f"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg></Link>
      </div>
    </header>
  );
};

export default Header;