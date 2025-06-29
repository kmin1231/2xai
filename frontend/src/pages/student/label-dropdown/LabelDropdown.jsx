// src/pages/student/label-dropdown/LabelDropdown.jsx

import React from 'react';

import './label-dropdown.css';

const LABELS = {
  important: { labelKR: '⭐ 중요해요', color: '#FFD6C9' },
  confusing: { labelKR: '❓ 잘 모르겠어요', color: '#f0f2b6' },
  mainidea: { labelKR: '📌 주제', color: '#D6E6FF' },
  etc: { labelKR: '📝 기타', color: '#D6F5D6' },
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