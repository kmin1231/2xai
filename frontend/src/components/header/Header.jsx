// src/components/header/Header.jsx

import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [userInfo, setUserInfo] = useState({
    school: 'ㅇㅇ중학교',
    name: 'ㅇㅇㅇ 학생',
  });

  // should be implemented to display user information
  const displayUserInfo = (school, name) => {
    setUserInfo({ school, name });
    console.log(userInfo);
  };

  return (
    <header className="header">
      <div className="headerInfo">
        {userInfo.school || "학교명"} &nbsp; | &nbsp; {userInfo.name || "이름"}
      </div>
      <div className="nav">
        <a href="#home">Home</a>
      </div>
    </header>
  );
};

export default Header;