// src/pages/teacher/dropdown/ClassDropdown.jsx

import React from 'react';

const ClassDropdown = ({ classes, selectedClassId, onSelectClass }) => {
  return (
    <select
      value={selectedClassId}
      onChange={(e) => onSelectClass(e.target.value)}
      style={{
        padding: '10px 8px',
        minWidth: '200px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        backgroundColor: '#f9f9f9',
        fontSize: '15px',
      }}
    >
      <option value="all">전체</option>
      {classes.map((cls) => (
        <option key={cls._id} value={cls._id}>
          [{cls.school_name}] {cls.class_name}
        </option>
      ))}
    </select>
  );
};

export default ClassDropdown;