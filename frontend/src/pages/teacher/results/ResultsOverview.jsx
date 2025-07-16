// src/pages/teacher/results/ResultsOverview.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams  } from 'react-router-dom';

import { api } from '@/config';
import CONFIG from '@/config';

import ClassDropdown from '../dropdown/ClassDropdown';
import './results-overview.css';

const ResultsOverview = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const classIdFromUrl = searchParams.get('classId') || 'all';

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(classIdFromUrl);
  const [students, setStudents] = useState([]);
  const [scoreMap, setScoreMap] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 담당 학반 목록
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get(
          `${CONFIG.TEACHER.BASE_URL}${CONFIG.TEACHER.ENDPOINTS.GET_CLASSES}`,
        );
        setClasses(res.data);
      } catch (error) {
        console.error('학반 목록 불러오기 실패', error);
      }
    };
    fetchClasses();
  }, []);

  // 선택된 학반의 학생 목록
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClassId) return;

      setLoading(true);
      try {
        let allStudents = [];

        if (selectedClassId === 'all') {
          const promises = classes.map((cls) =>
            api.get(
              `${CONFIG.TEACHER.BASE_URL}${CONFIG.TEACHER.ENDPOINTS.GET_CLASS_STUDENTS(cls._id)}`,
            ),
          );
          const results = await Promise.all(promises);
          allStudents = results.flatMap((res, idx) =>
            res.data.map((student) => ({
              ...student,
              className: classes[idx].class_name,
              schoolName: classes[idx].school_name,
            })),
          );
        } else {
          const res = await api.get(
            `${CONFIG.TEACHER.BASE_URL}${CONFIG.TEACHER.ENDPOINTS.GET_CLASS_STUDENTS(selectedClassId)}`,
          );
          const cls = classes.find((c) => c._id === selectedClassId);
          allStudents = res.data.map((student) => ({
            ...student,
            className: cls?.class_name,
            schoolName: cls?.school_name,
          }));
        }

        // 이름 & 학반 기준으로 정렬
        allStudents.sort((a, b) => {
          const classCompare = a.className.localeCompare(b.className, 'ko');
          if (classCompare !== 0) return classCompare;
          return a.name.localeCompare(b.name, 'ko');
        });

        setStudents(allStudents);

        // 학생별 점수 표시
        const scoreResponses = await Promise.all(
          allStudents.map((student) =>
            api
              .get(
                `${CONFIG.TEACHER.BASE_URL}${CONFIG.TEACHER.ENDPOINTS.GET_STUDENT_RECORDS_SUMMARY(student._id)}`,
              )
              .then((res) => ({
                id: student._id,
                score: res.data.data.averageScore,
              }))
              .catch(() => ({ id: student._id, score: null })),
          ),
        );

        const newScoreMap = {};
        scoreResponses.forEach(({ id, score }) => {
          newScoreMap[id] = score;
        });

        setScoreMap(newScoreMap);
      } catch (error) {
        console.error('학생 목록 또는 점수 불러오기 실패', error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClassId, classes]);

  // 선택한 학반에 대해 URL query parameter
  useEffect(() => {
    if (selectedClassId === 'all') {
      searchParams.delete('classId');
    } else {
      searchParams.set('classId', selectedClassId);
    }
    setSearchParams(searchParams);
  }, [selectedClassId]);

  const handleStudentClick = (student) => {
    navigate(`/teacher/dashboard/results/student/${student._id}?classId=${selectedClassId}`, {
      state: { studentName: student.name },
    });
  };

  return (
    <div className="learning-results-container">
      <h3 className="learning-results-title">학습 결과</h3>

      <div className="dropdown-wrapper">
        <ClassDropdown
          classes={classes}
          selectedClassId={selectedClassId}
          onSelectClass={setSelectedClassId}
        />
      </div>

      <div className="learning-results-table-wrapper">
        {loading ? (
          <p>학생 목록 불러오는 중...</p>
        ) : (
          <>
            <table className="learning-results-table">
              <thead>
                <tr>
                  <th className="no">No.</th>
                  <th className="school">학교</th>
                  <th className="class">학반</th>
                  <th className="name">이름</th>
                  <th className="score">점수</th>
                </tr>
              </thead>
            </table>

            <div className="table-body-wrapper">
              <table className="learning-results-table">
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ textAlign: 'center', padding: '10px' }}
                      >
                        선택한 학반에 학생이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    students.map((student, idx) => (
                      <tr key={student._id}>
                        <td className="no">{idx + 1}</td>
                        <td className="school">{student.schoolName}</td>
                        <td className="class">{student.className}</td>
                        <td
                          className="name"
                          onClick={() => handleStudentClick(student)}
                        >
                          🔗 {student.name}
                        </td>
                        <td className="score">
                          {scoreMap[student._id] !== null
                            ? scoreMap[student._id]
                            : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultsOverview;