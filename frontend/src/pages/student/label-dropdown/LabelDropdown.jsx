// src/pages/student/label-dropdown/LabelDropdown.jsx

import React from 'react';

import './label-dropdown.css';

const LABELS = {
  important: { labelKR: '⭐ 중요해요', color: '#F5DCEA' },
  confusing: { labelKR: '❓ 잘 모르겠어요', color: '#F0F2B6' },
  mainidea: { labelKR: '📌 주제', color: '#D9E6FA' },
  etc: { labelKR: '📝 기타', color: '#DFF7DF' },
};

const LabelDropdown = ({ position, onSelect, onClose }) => {
  return (
    <div
      className="label-dropdown"
      style={{ top: position.y, left: position.x }}
    >
      {Object.entries(LABELS).map(([key, { labelKR }]) => (
        <div
          key={key}
          className="label-dropdown-item"
          onClick={() => onSelect(key)}
        >
          {labelKR}
        </div>
      ))}
      <div className="label-dropdown-cancel" onClick={onClose}>
        취소
      </div>
    </div>
  );
};

export { LabelDropdown, LABELS };