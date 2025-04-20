// src/pages/student/keywords/KeywordButtons.jsx

import React from 'react';

import './keyword-buttons.css';

const KeywordButtons = ({ keywords, onKeywordClick }) => {
  return (
    <div className="keyword-buttons">
      <div className="keyword-button-header">추천 키워드</div>

      {keywords.map((kw) => (
        <button
          key={kw}
          className="keyword-button"
          onClick={() => onKeywordClick(kw)}
        >
          {kw}
        </button>
      ))}
    </div>
  );
};

export default KeywordButtons;