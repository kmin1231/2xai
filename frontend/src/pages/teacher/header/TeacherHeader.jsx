// src/pages/teacher/header/TeacherHeader.jsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { persistor } from '@/store';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/authSlice';

import './teacher-header.css';

const TeacherHeader = () => {
  const { isLoggedIn, userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenuClick = () => {
    // navigate('/teacher/temp-route');
  };

  const handleLogoutClick = () => {
    dispatch(logout()); // initialize Redux state
    persistor.purge(); // initialize redux-persist state
    navigate('/'); // redirect to '/'
  };

  return (
    <header className="teacher-header">
      <div className="teacher-header-info">
        {isLoggedIn
          ? `${userInfo.school || '학교명'} | ${userInfo.name || '이름'}`
          : '2xAI'}
      </div>

      <div className="teacher-header-buttons">
        <button onClick={handleMenuClick}>tempBtn</button>
        <button onClick={handleLogoutClick}>로그아웃</button>
      </div>
    </header>
  );
};

export default TeacherHeader;