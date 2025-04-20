// src/components/inputs/InputField.jsx

import React from 'react';
import './InputField.css';

const InputField = ({
  label,
  placeholder,
  onChange,
  value,
  type = 'text',
  onButtonClick,
}) => {

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onButtonClick();  // Enter key press -> call onButtonClick
    }
  };

  return (
    <div className="input-container">
      <div className="input-static-text">
        {label || '아이디를 입력해 주세요.'}
      </div>
      <div className="input-box">
        <input
          className="input-field"
          type={type}
          placeholder={placeholder || '2xAIID123'}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />
        <button className="next-button" onClick={onButtonClick}>
          다음
        </button>
      </div>
    </div>
  );
};

export default InputField;