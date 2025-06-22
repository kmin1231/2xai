// src/pages/teacher/class-config/ClassDetailPanel.jsx

import React, { useState } from 'react';

import { api } from '@/config';
import CONFIG from '@/config';

const displayToInternalMap = {
  하: 'low',
  중: 'middle',
  상: 'high',
};

const ClassDetailPanel = ({
  classData,
  levelMap,
  onEditLevel,
  onEditKeyword,
}) => {
  const [showLevelSelector, setShowLevelSelector] = useState(false);

  if (!classData) return <p>학반을 선택해주세요.</p>;

  const handleLevelSubmit = async (e) => {
    const selectedDisplay = e.target.value;
    const newLevel = displayToInternalMap[selectedDisplay];
    if (!newLevel) return;

    try {
      await api.post(
        `${CONFIG.TEACHER.BASE_URL}${CONFIG.TEACHER.ENDPOINTS.SET_CLASS_LEVEL(classData._id)}`,
        { assigned_level: newLevel },
      );
      alert('난이도가 수정되었습니다.');
      onEditLevel({ ...classData, class_level: newLevel });
    } catch (err) {
      console.error('Failed to update class level', err);
      alert('난이도 수정에 실패했습니다.');
    } finally {
      setShowLevelSelector(false);
    }
  };

  const handleKeywordEdit = async () => {
    const newKeyword = prompt(
      '새로운 키워드를 입력하세요:',
      classData.class_keyword || '',
    );
    if (!newKeyword || newKeyword.trim() === '') return;

    try {
      await api.post(
        `${CONFIG.TEACHER.BASE_URL}${CONFIG.TEACHER.ENDPOINTS.SET_CLASS_KEYWORD(classData._id)}`,
        { keyword: newKeyword },
      );
      alert('키워드가 수정되었습니다.');
      onEditKeyword({ ...classData, class_keyword: newKeyword });
    } catch (err) {
      console.error('Failed to update class keyword', err);
      alert('키워드 수정에 실패했습니다.');
    }
  };

  return (
    <div>
      <h3 className="class-detail-title">학반 상세 정보</h3>

      <p className="class-detail-text">
        <strong>학교명:</strong> {classData.school_name}
      </p>

      <p className="class-detail-text">
        <strong>학반명:</strong> {classData.class_name}
      </p>

      <p className="class-detail-text">
        <strong>난이도:</strong> {levelMap[classData.class_level] || '-'}
        <button
          className="set-class-level-btn"
          onClick={() => setShowLevelSelector(true)}
        >
          난이도 수정
        </button>
      </p>

      {showLevelSelector && (
        <div>
          <select
            onChange={handleLevelSubmit}
            defaultValue=""
            className="level-select-dropdown"
          >
            <option value="" disabled>
              난이도 선택
            </option>
            <option value="하">하</option>
            <option value="중">중</option>
            <option value="상">상</option>
          </select>
        </div>
      )}
      
      <p className="class-detail-text">
        <strong>키워드:</strong>{' '}
        {classData.class_keyword && classData.class_keyword.trim().length > 0
          ? classData.class_keyword
          : '아직 설정되지 않았습니다.'}
        <button className="set-class-keyword-btn" onClick={handleKeywordEdit}>
          키워드 수정
        </button>
      </p>
    </div>
  );
};

export default ClassDetailPanel;