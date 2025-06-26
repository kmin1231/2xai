// src/pages/student/toast/HighlightToast.jsx

import React from 'react';

const toastStyle = {
  color: 'white',
  padding: '5px 5px',
  borderRadius: '20px',
  fontSize: '18px',
  fontWeight: 'bold',
  width: '450px',
  height: '50px',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  wordBreak: 'break-word',
  backgroundColor: '#7aaee0',
};

export const HighlightToast = ({ onUndo }) => {
  return (
    <div style={{ ...toastStyle, paddingRight: '25px' }}>
      <span style={{ flexGrow: 1 }}>
    ✔ 하이라이트가 저장되었습니다.
  </span>
      <button
        style={{
          marginLeft: '0px',
          background: 'transparent',
          border: '1.0px solid white',
          color: '#f7db86',
          cursor: 'pointer',
          padding: '6px 10px',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
        onClick={onUndo}
      >
        저장 취소
      </button>
    </div>
  );
};

export const HighlightUndoToast = () => {
  return (
    <div
      style={{
        ...toastStyle,
        justifyContent: 'center',
      }}
    >
      하이라이트가 취소되었습니다.
    </div>
  );
};