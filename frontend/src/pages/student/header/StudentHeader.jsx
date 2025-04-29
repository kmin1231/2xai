// src/pages/student/header/StudentHeader.jsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { persistor } from '@/store';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/authSlice';

import './student-header.css';

const StudentHeader = () => {
  const { isLoggedIn, userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenuClick = () => {
    // [check] student result page routing
    navigate('/student/results');
  };

  const handleLogoutClick = () => {
    dispatch(logout()); // initialize Redux state
    persistor.purge(); // initialize redux-persist state
    navigate('/'); // redirect to '/'
  };

  return (
    <header className="student-header">
      <div className="student-header-info">
        {isLoggedIn
          ? `${userInfo.school || '학교명'} | ${userInfo.name || '이름'}`
          : '2xAI'}
      </div>

      <div className="student-header-buttons">
        <button onClick={handleMenuClick}>학습 결과</button>
        <button onClick={handleLogoutClick}>로그아웃</button>
      </div>
    </header>
  );
};

export default StudentHeader;