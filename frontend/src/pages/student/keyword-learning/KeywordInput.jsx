// src/pages/student/keyword-learning/KeywordInput.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { api } from '@/config';

import StudentHeader from '../header/StudentHeader';
import InputField from '@/components/inputs/InputField';
import KeywordButtons from '../keyword-button/KeywordButtons';
import LoadingAnimation from '@/components/loading/LoadingAnimation';
import recommendedKeywords from './recommendedKeywords';
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

function getRandomItems(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

const KeywordInput = () => {
  const { mode } = useParams(); // 'personal', 'manual', 'assigned'

  const availableLevels = [
    { label: '상', value: 'high' },
    { label: '중', value: 'middle' },
    { label: '하', value: 'low' },
  ];

  const { userInfo, token } = useSelector((state) => state.auth);

  const [selectedLevel, setSelectedLevel] = useState('low');

  const [keyword, setKeyword] = useState('');
  const [classKeyword, setClassKeyword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [visibleKeywords, setVisibleKeywords] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const randomKeywords = getRandomItems(recommendedKeywords, 7);
    setVisibleKeywords(randomKeywords);
  }, [recommendedKeywords]);

  const handleKeywordClick = (selectedKeyword) => {
    setKeyword(selectedKeyword); // selected keyword into InputField
  };

  useEffect(() => {
    const fetchClassKeyword = async () => {
      try {
        const res = await api.get(
          `${CONFIG.STUDENT.BASE_URL}${CONFIG.STUDENT.ENDPOINTS.GET_CLASS_INFO}`
        );
        const keywordFromClass = res.data.data.class_keyword || '';
        setClassKeyword(keywordFromClass);
        setKeyword(keywordFromClass);
      } catch (err) {
        console.error('학반 키워드 로드에 실패했습니다.', err);
      }
    };

    if (mode === 'assigned') {
      fetchClassKeyword();
    }
  }, [mode]);

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
              onChange={(e) => {
                if (mode !== 'assigned') setKeyword(e.target.value);
              }}
              onButtonClick={handleGenerateContents}
              buttonText="시작"
              disabled={mode === 'assigned'}
            />
          </div>

          <div className="keyword-buttons-wrapper">
            <KeywordButtons
              keywords={visibleKeywords}
              onKeywordClick={handleKeywordClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordInput;