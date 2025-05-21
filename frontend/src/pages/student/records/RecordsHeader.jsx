// src/pages/student/header/RecordsHeader.jsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { persistor } from '@/store';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/authSlice';

import '../header/student-header.css';

const StudentRecordsHeader = () => {
  const { isLoggedIn, userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenuClick = () => {
    navigate('/student');
  };

  const handleLogoutClick = () => {
    dispatch(logout());
    persistor.purge();
    navigate('/');
  };

  return (
    <header className="student-header">
      <div className="student-header-info">
        {isLoggedIn
          ? `${userInfo.school || '학교명'} | ${userInfo.name || '이름'}`
          : '2xAI'}
      </div>

      <div className="student-header-buttons">
        <button onClick={handleMenuClick}>메인 화면</button>
        <button onClick={handleLogoutClick}>로그아웃</button>
      </div>
    </header>
  );
};

export default StudentRecordsHeader;