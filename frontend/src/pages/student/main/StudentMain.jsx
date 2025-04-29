// src/pages/student/main/StudentMain.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

import StudentHeader from '../header/StudentHeader';
import './student-main.css';

const StudentMain = () => {
  const navigate = useNavigate();

  const modes = [
    {
      title: '맞춤형 난이도',
      action: () => navigate('/student/mode/custom'),
    },

    {
      title: '난이도 직접 설정',
      action: () => navigate('/student/mode/select'),
    },

    {
      title: '선생님 추천 난이도',
      action: () => navigate('/student/mode/recommend'),
    },
  ];

  return (
    <div className="student-main-container">
      <StudentHeader />

      <h2 className="student-main-header-text">학습 모드를 선택해 주세요</h2>

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

export default StudentMain;