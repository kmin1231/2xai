// src/pages/teacher/highlight/HighlightsOverview.jsx

import React, { useEffect, useState } from 'react';

import { api } from '@/config';
import CONFIG from '@/config';

import ClassDropdown from '../dropdown/ClassDropdown';
import HighlightTable from './HighlightTable';
import StudentListPanel from './StudentListPanel';
import './highlights-overview.css';

const HighlightsOverview = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('all');
  const [studentsInClass, setStudentsInClass] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
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
      const res = await api.get(
        `${CONFIG.TEACHER.BASE_URL}${CONFIG.TEACHER.ENDPOINTS.GET_HIGHLIGHTS}`,
      );

      const dataWithClassInfo = res.data.data.map((item) => {
        const cls = classes.find((c) => c._id === item.userId.class_id);
        return {
          ...item,
          studentName: item.userId.name,
          className: cls?.class_name || '',
          schoolName: cls?.school_name || '',
        };
      });
      setHighlights(dataWithClassInfo);
    };
    if (classes.length > 0) fetchHighlights();
  }, [classes]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClassId) {
        setStudentsInClass([]);
        return;
      }

      try {
        if (selectedClassId === 'all') {
          // 해당 교사 사용자의 전체 학생 목록
          const promises = classes.map((c) =>
            api.get(
              `${CONFIG.TEACHER.BASE_URL}${CONFIG.TEACHER.ENDPOINTS.GET_CLASS_STUDENTS(c._id)}`,
            ),
          );
          const results = await Promise.all(promises);
          const allStudents = results.flatMap((res) => res.data);
          setStudentsInClass(allStudents);
        } else {
          // 특정 학반 학생 목록
          const res = await api.get(
            `${CONFIG.TEACHER.BASE_URL}${CONFIG.TEACHER.ENDPOINTS.GET_CLASS_STUDENTS(selectedClassId)}`,
          );
          setStudentsInClass(res.data);
        }
      } catch (err) {
        console.error('학생 목록 불러오기 실패', err);
        setStudentsInClass([]);
      }
    };

    fetchStudents();
  }, [selectedClassId, classes]);

  const filteredByClass =
    selectedClassId === 'all'
      ? highlights
      : highlights.filter((h) => h.userId.class_id === selectedClassId);

  const filtered = selectedStudentId
    ? filteredByClass.filter((h) => h.userId._id === selectedStudentId)
    : filteredByClass;

  return (
    <div className="highlights-overview-container">
      <h3 className="highlights-overview-title">하이라이트 확인</h3>
      <div className="dropdown-wrapper">
        <ClassDropdown
          classes={classes}
          selectedClassId={selectedClassId}
          onSelectClass={(id) => {
            setSelectedClassId(id);
            setSelectedStudentId(null);
          }}
        />
      </div>

      <div className="highlight-panel-container">
        <div className="student-list-panel">
          <StudentListPanel
            students={studentsInClass}
            selectedStudentId={selectedStudentId}
            onSelectStudent={setSelectedStudentId}
          />
        </div>

        <div className="highlight-table-panel">
          <HighlightTable highlights={filtered} />
        </div>
      </div>
    </div>
  );
};

export default HighlightsOverview;