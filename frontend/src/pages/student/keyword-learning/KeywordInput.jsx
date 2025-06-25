// src/pages/student/keyword-learning/KeywordInput.jsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { api } from '@/config';

import StudentHeader from '../header/StudentHeader';
import InputField from '@/components/inputs/InputField';
import KeywordButtons from '../keyword-button/KeywordButtons';
import LoadingAnimation from '@/components/loading/LoadingAnimation';
import './keyword-input.css';

import CONFIG from '@/config';

// API request config for each mode
const DIRECT_API_BASE = 'https://api.twoxai.online'

const modeToApiConfig = {
  personal: {
    url: (level) =>
      `${DIRECT_API_BASE}/api/text/contents/${level}?type=inferred`,
  },
  manual: {
    url: (level) =>
      `${DIRECT_API_BASE}/api/text/contents/${level}?type=selected`,
  },
  assigned: {
    url: (level) =>
      `${DIRECT_API_BASE}/api/text/contents/${level}?type=assigned`,
  },
};

const KeywordInput = () => {
  const { mode } = useParams(); // 'personal', 'manual', 'assigned'

  const availableLevels = [
    { label: '상', value: 'high' },
    { label: '중', value: 'middle' },
    { label: '하', value: 'low' },
  ];

  const [selectedLevel, setSelectedLevel] = useState('low');

  const [keyword, setKeyword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const recommendedKeywords = [
    'sports',
    'Harry Potter',
    'Do You Have Text Neck?',
    'Around the World in 80 Days',
    'The Perfect Job for You',
    'A Whole New World',
  ];

  const handleKeywordClick = (selectedKeyword) => {
    setKeyword(selectedKeyword); // selected keyword into InputField
  };

  const { userInfo } = useSelector((state) => state.auth);

  const handleGenerateContents = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('로그인 정보가 만료되었습니다. 다시 로그인해주세요.');
      return;
    }

    if (!keyword) {
      alert('키워드를 입력해주세요!');
      return;
    }

    const userLevel =
      mode === 'manual'
        ? selectedLevel
        : mode === 'assigned'
          ? userInfo?.assignedLevel || 'low'
          : userInfo?.inferredLevel || 'low';

    const urlBuilder = modeToApiConfig[mode];

    if (!urlBuilder) {
      alert('잘못된 학습 모드입니다.');
      return;
    }

    const url = urlBuilder.url(userLevel);

    const startTime = Date.now();

    try {
      setIsLoading(true);

      const response = await api.post(
        url,
        { keyword },
        {
          timeout: 900000,  // 15 minutes
        }
      );

      const elapsed = Date.now() - startTime;
      const remainingTime = 5000 - elapsed;
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }
  
      setIsLoading(false);

      navigate(`/student/mode/${mode}/solve`, {
        state: { data: response.data },
      });
    } catch (error) {
      console.error('Error generating text:', error);

      setIsLoading(false);

      const message =
        error.response?.data?.message || '텍스트 생성 중 오류가 발생했습니다.';
      alert(message);
    }
  };

  return (
    <div className="student-custom-container">
      <StudentHeader />

      {isLoading && <LoadingAnimation />}
      
      {!isLoading && (
        <div className="keyword-container">
          {mode === 'manual' && (
            <div className="level-button-group">
              <label className="level-button-label">학습 난이도 선택</label>
              <div className="level-buttons">
                {availableLevels.map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    className={`level-button ${selectedLevel === value ? 'selected' : ''}`}
                    onClick={() => setSelectedLevel(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="keyword-input-wrapper">
            <InputField
              label="키워드를 입력해 보세요."
              placeholder="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onButtonClick={handleGenerateContents}
              buttonText="검색"
            />
          </div>

          <div className="keyword-buttons-wrapper">
            <KeywordButtons
              keywords={recommendedKeywords}
              onKeywordClick={handleKeywordClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordInput;