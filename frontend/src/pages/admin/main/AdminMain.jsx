// src/pages/admin/main/AdminMain.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

import './admin-main.css';

const AdminMain = () => {
  const navigate = useNavigate();

  const modes = [
    {
      title: '학습 결과 확인',
      action: () => navigate('/admin/dashboard/results'),
    },

    {
      title: '하이라이트 확인',
      action: () => navigate('/admin/dashboard/highlights'),
    },

    {
      title: '피드백 확인',
      action: () => navigate('/admin/dashboard/feedbacks'),
    },
  ];

  return (
    <div className="admin-main-container">

      <h2 className="main-header-text">항목을 선택해 주세요</h2>

      {/* mode selection */}
      <div className="mode-container">
        {modes.map((mode, index) => (
          <div
            key={index}
            className="mode-card"
            onClick={mode.action}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') mode.action();
            }}
          >
            <p>
              <svg
                className="check-icon"
                xmlns="http://www.w3.org/2000/svg"
                height="40px"
                viewBox="0 -960 960 960"
                width="40px"
                fill="#555"
              >
                <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
            </p>
            <h3 className="mode-title">{mode.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMain;