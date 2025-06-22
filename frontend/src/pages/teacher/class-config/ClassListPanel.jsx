// src/pages/teacher/class-config/ClassListPanel.jsx

import React from 'react';

const ClassListPanel = ({
  classes,
  selectedClassId,
  onSelectClass,
  loading,
}) => {
  if (loading) return <p>학반 목록 불러오는 중...</p>;
  if (classes.length === 0) return <p>담당 학반이 없습니다.</p>;

  return (
    <div>
      <h3 className="class-list-title">학반 목록</h3>
      <ul className="class-list-ul">
        {classes.map(({ _id, class_name, school_name, class_level }) => (
          <li
            key={_id}
            onClick={() => onSelectClass(_id)}
            className={`class-list-item ${
              selectedClassId === _id ? 'selected' : ''
            }`}
          >
            [{school_name}] {class_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassListPanel;