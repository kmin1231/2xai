// src/pages/admin/highlights/AdminHighlightsOverview.jsx

import React, { useEffect, useState } from 'react';

import { api } from '@/config';
import CONFIG from '@/config';

import ClassDropdown from '@/pages/teacher/dropdown/ClassDropdown';
import HighlightTable from '@/pages/teacher/highlights/HighlightTable';
import '@/pages/teacher/highlights/highlights-overview.css';

const AdminHighlightsOverview = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('all');
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get(
          `${CONFIG.ADMIN.BASE_URL}${CONFIG.ADMIN.ENDPOINTS.GET_CLASSES}`,
        );
        setClasses(res.data.data || []);
      } catch (error) {
        console.error('Admin 학반 목록 불러오기 실패', error);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await api.get(
          `${CONFIG.TEACHER.BASE_URL}${CONFIG.TEACHER.ENDPOINTS.GET_HIGHLIGHTS}`,
        );

        const rawHighlights = res.data.data || res.data || [];

        const dataWithClassInfo = rawHighlights.map((item) => {
          const cls = classes.find((c) => c._id === item.userId.class_id);
          return {
            ...item,
            userName: item.userId.name,
            className: cls?.class_name || '',
            schoolName: cls?.school_name || '',
          };
        });
        setHighlights(dataWithClassInfo);
      } catch (error) {
        console.error('Admin 하이라이트 불러오기 실패', error);
      }
    };
    if (classes.length > 0) fetchHighlights();
  }, [classes]);

  const filteredHighlights =
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
        <HighlightTable highlights={filteredHighlights} />
      </div>
    </div>
  );
};

export default AdminHighlightsOverview;