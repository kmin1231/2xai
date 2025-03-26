// src/components/inputs/InputField.jsx

import React from 'react';
import './InputField.css';

const InputField = ({ placeholder }) => {
  return (
    <div className="input-container">
      <div className="static-text">아이디를 입력해 주세요.</div>
      <div className="input-box">
        <input
          className="input-field"
          type="text"
          placeholder={"2xAIID123"}
          // placeholder={placeholder || "2xAIID123"}
        />
        <button className="next-button">다음</button>
      </div>
    </div>
  );
};

export default InputField;