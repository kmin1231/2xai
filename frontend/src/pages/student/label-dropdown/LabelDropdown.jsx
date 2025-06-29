// src/pages/student/label-dropdown/LabelDropdown.jsx

import React from 'react';

const LABELS = {
  important: { labelKR: '⭐ 중요해요', color: '#FFD6C9' },
  confusing: { labelKR: '❓ 잘 모르겠어요', color: '#f0f2b6' },
  mainidea: { labelKR: '📌 주제', color: '#D6E6FF' },
  etc: { labelKR: '📝 기타', color: '#D6F5D6' },
};

const LabelDropdown = ({ position, onSelect, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        padding: '8px',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 9999,
      }}
    >
      {Object.entries(LABELS).map(([key, { labelKR }]) => (
        <div
          key={key}
          style={{ padding: '6px 10px', cursor: 'pointer' }}
          onClick={() => onSelect(key)}
        >
          {labelKR}
        </div>
      ))}
      <div
        style={{
          padding: '6px 10px',
          cursor: 'pointer',
          color: 'red',
          marginTop: '6px',
        }}
        onClick={onClose}
      >
        취소
      </div>
    </div>
  );
};

export { LabelDropdown, LABELS };