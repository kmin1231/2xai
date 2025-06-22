// src/pages/teacher/results/ResultsDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import moment from 'moment';

import TextDetailModal from '@/pages/student/records/TextDetailModal';
import { handleDownload } from '@/utils/download-text';

import { api } from '@/config';
import CONFIG from '@/config';

import './results-detail.css';

const ResultsDetail = () => {
  const { studentId } = useParams();
  const location = useLocation();
  const passedStudentName = location.state?.studentName || '';

  const [studentName, setStudentName] = useState(passedStudentName);
  const [records, setRecords] = useState([]);
  const [textsMap, setTextsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedText, setSelectedText] = useState(null);

  const levelMap = {
    low: '하',
    middle: '중',
    high: '상',
  };

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const resRecords = await api.get(
          `${CONFIG.TEACHER.BASE_URL}${CONFIG.TEACHER.ENDPOINTS.GET_STUDENT_RECORDS(studentId)}`,
        );

        const sortedRecords = resRecords.data.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
        setRecords(sortedRecords);

        const uniqueTextIds = [...new Set(sortedRecords.map((r) => r.textId))];

        const textsMapTemp = {};
        await Promise.all(
          uniqueTextIds.map(async (textId) => {
            try {
              const resText = await api.get(
                `${CONFIG.TEXT.BASE_URL}${CONFIG.TEXT.ENDPOINTS.CONTENTS_BY_ID(textId)}`,
              );
              textsMapTemp[textId] = resText.data.data;
            } catch (err) {
              console.error(
                `Failed to fetch text info for textId: ${textId}`,
                err,
              );
            }
          }),
        );

        setTextsMap(textsMapTemp);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch student records:', error);
        setLoading(false);
      }
    };

    fetchRecords();
  }, [studentId]);

  if (loading) return <p>Loading...</p>;

  if (records.length === 0) return <p>해당 학생의 학습 기록이 없습니다.</p>;

  return (
    <div className="results-detail-container">
      <h3 className="results-detail-header">
        {studentName ? `${studentName} 학생의 학습 결과` : '학습 결과'}
      </h3>
      <div className="records-container">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>키워드</th>
              <th>난이도</th>
              <th>지문 제목</th>
              <th>지문</th>
              <th>시간</th>
              <th>결과</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, idx) => {
              const text = textsMap[record.textId];
              const shortPassage =
                (text?.passage || '').replace(/\n/g, ' ').slice(0, 200) || '-';

              return (
                <tr
                  key={record._id}
                  onClick={() => setSelectedText(text)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{idx + 1}</td>
                  <td>{text?.keyword || '-'}</td>
                  <td>{levelMap[text?.level] || '-'}</td>
                  <td>{text?.title || '-'}</td>
                  <td>{shortPassage}</td>
                  <td>
                    {moment(record.createdAt)
                      .utcOffset(9 * 60)
                      .format('YYYY-MM-DD HH:mm:ss')}
                  </td>
                  <td>
                    {record.correctness.map((isCorrect, i) => (
                      <span
                        key={i}
                        style={{
                          color: isCorrect ? 'green' : 'red',
                          marginRight: 4,
                        }}
                      >
                        {isCorrect ? 'O' : 'X'}
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedText && (
        <TextDetailModal
          text={selectedText}
          onClose={() => setSelectedText(null)}
          onDownload={(type) => handleDownload(selectedText, type)}
        />
      )}
    </div>
  );
};

export default ResultsDetail;