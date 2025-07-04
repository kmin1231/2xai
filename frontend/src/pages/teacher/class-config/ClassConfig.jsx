// src/pages/teacher/class-config/ClassConfig.jsx

import React, { useState, useEffect } from 'react';

import ClassListPanel from './ClassListPanel';
import ClassDetailPanel from './ClassDetailPanel';

import { api } from '@/config';
import CONFIG from '@/config';

import './class-config.css';

const levelMap = {
  low: '하',
  middle: '중',
  high: '상',
};

const ClassConfig = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `${CONFIG.TEACHER.BASE_URL}${CONFIG.TEACHER.ENDPOINTS.GET_CLASSES}`,
        );
        setClasses(res.data);
        if (res.data.length > 0) setSelectedClass(res.data[0]);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleSelectClass = (classId) => {
    const cls = classes.find((c) => c._id === classId);
    setSelectedClass(cls);
  };

  return (
    <div className="class-config-container">
      <div className="class-list-panel">
        <ClassListPanel
          classes={classes}
          selectedClassId={selectedClass?._id || ''}
          onSelectClass={handleSelectClass}
          levelMap={levelMap}
          loading={loading}
        />
      </div>
      <div className="class-detail-panel">
        <ClassDetailPanel
          classData={selectedClass}
          levelMap={levelMap}
          onEditLevel={(updatedClass) => {
            setSelectedClass(updatedClass);
            setClasses((prev) =>
              prev.map((c) => (c._id === updatedClass._id ? updatedClass : c))
            );
          }}
          onEditKeyword={(updatedClass) => {
            setSelectedClass(updatedClass);
            setClasses((prev) =>
              prev.map((c) => (c._id === updatedClass._id ? updatedClass : c))
            );
          }}
        />
      </div>
    </div>
  );
};

export default ClassConfig;