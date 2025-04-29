// src/pages/student/mode-custom/Keyword.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import StudentHeader from '../header/StudentHeader';
import InputField from '@/components/inputs/InputField';
import KeywordButtons from '../keywords/KeywordButtons';

import CONFIG from '@/config';

const CustomLevelKeyword = () => {
  const [keyword, setKeyword] = useState('');
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

  const handleCustomLevel = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('로그인 정보가 만료되었습니다. 다시 로그인해주세요.');
      return;
    }

    if (!keyword) {
      alert('키워드를 입력해주세요!');
      return;
    }

    console.log('Sending request to API with token:', token);
    console.log('Sending request with keyword:', keyword);

    try {
      const response = await axios.post(
        `${CONFIG.TEXT.BASE_URL}${CONFIG.TEXT.ENDPOINTS.GENERATE_TEXT}`,
        { keyword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('API response:', response.data);
      navigate('/student/mode/custom/result', { state: { data: response.data } });
    } catch (error) {
      console.error('Error generating text:', error);
      if (error.response) {
        const errorMessage =
          error.response.data.message || '텍스트 생성 중 오류가 발생했습니다.';
        alert(errorMessage);
      } else {
        alert('텍스트 생성 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="student-custom-container">
      <StudentHeader />
      <div className="keyword-container">
        <InputField
          label="주제를 입력해 보세요."
          placeholder="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onButtonClick={handleCustomLevel}
          buttonText="검색"
        />

        <KeywordButtons
          keywords={recommendedKeywords}
          onKeywordClick={handleKeywordClick}
        />
      </div>
    </div>
  );
};

export default CustomLevelKeyword;