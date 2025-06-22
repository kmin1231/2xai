// src/pages/teacher/highlight/HighlightsOverview.jsx

import React, { useEffect, useState } from 'react';

import { api } from '@/config';
import CONFIG from '@/config';

import ClassDropdown from '../dropdown/ClassDropdown';
import HighlightTable from './HighlightTable';
import './highlights-overview.css';

const HighlightsOverview = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('all');
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const res = await api.get(
        `${CONFIG.TEACHER.BASE_URL}${CONFIG.TEACHER.ENDPOINTS.GET_CLASSES}`,
      );
      setClasses(res.data);
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchHighlights = async () => {
      const res = await api.get(`${CONFIG.TEACHER.BASE_URL}${CONFIG.TEACHER.ENDPOINTS.GET_HIGHLIGHTS}`);

      const dataWithClassInfo = res.data.data.map((item) => {
        const cls = classes.find((c) => c._id === item.userId.class_id);
        return {
          ...item,
          userName: item.userId.name,
          className: cls?.class_name || '',
          schoolName: cls?.school_name || '',
        };
      });
      setHighlights(dataWithClassInfo);
    };
    if (classes.length > 0) fetchHighlights();
  }, [classes]);

  const filtered =
    selectedClassId === 'all'
      ? highlights
      : highlights.filter((h) => h.userId.class_id === selectedClassId);

  return (
    <div className="highlights-overview-container">
      <h3 className="highlights-overview-title">하이라이트 확인</h3>
      <div className="dropdown-wrapper">
        <ClassDropdown
          classes={classes}
          selectedClassId={selectedClassId}
          onSelectClass={setSelectedClassId}
        />
      </div>
      <div className="table-wrapper">
        <HighlightTable highlights={filtered} />
      </div>
    </div>
  );
};

export default HighlightsOverview;