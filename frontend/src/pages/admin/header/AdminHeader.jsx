// src/pages/admin/header/AdminHeader.jsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { persistor } from '@/store';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/authSlice';

import './admin-header.css';

const AdminHeader = () => {
  const { isLoggedIn, userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenuClick = () => {
    navigate('/admin');
  };

  const handleLogoutClick = () => {
    dispatch(logout()); // initialize Redux state
    persistor.purge(); // initialize redux-persist state
    navigate('/'); // redirect to '/'
  };

  return (
    <header className="admin-header">
      <div className="admin-header-info">
        {isLoggedIn
          ? `${userInfo.school || '학교명'} | ${userInfo.name || '이름'}`
          : '2xAI'}
      </div>

      <div className="admin-header-buttons">
        <button onClick={handleMenuClick}>메인 화면</button>
        <button onClick={handleLogoutClick}>로그아웃</button>
      </div>
    </header>
  );
};

export default AdminHeader;