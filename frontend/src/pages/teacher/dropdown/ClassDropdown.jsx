// src/pages/teacher/dropdown/ClassDropdown.jsx

import React from 'react';
import './class-dropdown.css';

const ClassDropdown = ({ classes, selectedClassId, onSelectClass }) => {
  return (
    <select
      className="class-dropdown"
      value={selectedClassId}
      onChange={(e) => onSelectClass(e.target.value)}
      style={{
        padding: '10px 8px',
        minWidth: '200px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '1.0rem',
        color: 'inherit',
      }}
    >
      <option value="all">전체</option>

      {[...classes]
        .sort((a, b) => {
          // 학교 이름, 학반 이름 기준으로 정렬
          const schoolCompare = a.school_name.localeCompare(
            b.school_name,
            'ko',
          );
          if (schoolCompare !== 0) return schoolCompare;
          return a.class_name.localeCompare(b.class_name, 'ko');
        })
        .map((cls) => (
          <option key={cls._id} value={cls._id}>
            [{cls.school_name}] {cls.class_name}
          </option>
        ))}
    </select>
  );
};

export default ClassDropdown;