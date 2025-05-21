// src/pages/student/toast/HighlightToast.jsx

import React from 'react';

export const HighlightToast = ({ onUndo }) => {
  const toastStyle = {
    color: 'black',
    padding: '0px 10px',
    borderRadius: '10px',
    fontSize: '14px',
    width: '320px',
    maxWidth: '350px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    wordBreak: 'break-word',
  };

  return (
    <div style={toastStyle}>
      하이라이트가 저장되었습니다.
      <button
        style={{
          marginLeft: '0px',
          background: '#f2f6f9',
          border: 'none',
          color: '#00f',
          cursor: 'pointer',
          textDecoration: 'underline',
          padding: 0,
          fontSize: 'inherit',
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
        fontSize: '14px',
        padding: '10px',
        color: '#333',
      }}
    >
      하이라이트가 취소되었습니다.
    </div>
  );
};