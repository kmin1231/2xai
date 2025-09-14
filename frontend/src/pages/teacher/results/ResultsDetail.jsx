// src/pages/teacher/results/ResultsDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';

import TextDetailModal from '@/pages/student/records/TextDetailModal';
import { handleDownload } from '@/utils/download-text';

import { api } from '@/config';
import CONFIG from '@/config';

import './results-detail.css';


const formatElapsedSeconds = (seconds) => {
  if (seconds == null) return '-';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  if (m === 0) return `${s}초`;
  return `${m}분 ${s}초`;
};

const ResultsDetail = () => {
  const { studentId } = useParams();
  const location = useLocation();
  const passedStudentName = location.state?.studentName || '';

  const [studentName, setStudentName] = useState(passedStudentName);
  const [records, setRecords] = useState([]);
  const [textsMap, setTextsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [feedbacksMap, setFeedbacksMap] = useState({});
  const [highlightsMap, setHighlightsMap] = useState({});

  const levelMap = {
    low: '하',
    middle: '중',
    high: '상',
  };

  const modeMap = {
    inferred: (
      <>맞춤형<br />난이도</>
    ),
    selected: (
      <>직접<br />선택</>
    ),
    assigned: (
      <>교사<br />추천</>
    ),
  };

  const { role } = useSelector((state) => state.auth);
  const isAdmin = role === 'admin';

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const resRecords = await api.get(
          `${CONFIG.TEACHER.BASE_URL}${CONFIG.TEACHER.ENDPOINTS.GET_STUDENT_RECORDS(studentId)}`,
        );

        const sortedRecords = resRecords.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
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

  const fetchFeedbackForRecord = async (recordId) => {
    if (!isAdmin) return;

    try {
      const res = await api.get(
        `${CONFIG.ADMIN.BASE_URL}${CONFIG.ADMIN.ENDPOINTS.GET_FEEDBACK_BY_RECORD(recordId)}`
      );

      const feedbackList = res.data.data?.feedbacks || [];

      setFeedbacksMap((prev) => ({
        ...prev,
        [recordId]: feedbackList,
      }));

      return feedbackList;
    } catch (err) {
      console.error('Failed to fetch feedback by recordId:', error);
    }
  };

  const fetchHighlightsForRecord = async (recordId) => {
    if (!isAdmin) return;

    try {
      const res = await api.get(
        `${CONFIG.ADMIN.BASE_URL}${CONFIG.ADMIN.ENDPOINTS.GET_HIGHLIGHTS_BY_RECORD(recordId)}`
      );

      console.log('fetchHighlightsForRecord res.data:', res.data);
      const highlights = res.data.data || [];

      setHighlightsMap((prev) => ({
        ...prev,
        [recordId]: highlights,
      }));

      return highlights;
    } catch (error) {
      console.error('Failed to fetch highlights by recordId:', error);
    }
  };

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
              <th>유형</th>
              <th>지문 제목</th>
              <th>지문</th>
              <th>제출 시간</th>
              <th>소요 시간</th>
              <th>결과</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, idx) => {
              const text = textsMap[record.textId];
              const shortPassage =
                (text?.passage || '').replace(/\n/g, ' ').slice(0, 170) || '-';

              return (
                <tr
                  key={record._id}
                  onClick={async () => {

                    // 데이터 연결 전 학생 피드백 데이터를 가져오지 못하는 경우에도 modal이 열리도록 처리
                    let feedbacks = [];
                    try {
                      feedbacks = await fetchFeedbackForRecord(record._id);
                      if (!feedbacks) feedbacks = [];
                    } catch (err) {
                      console.error('Feedback fetch failed, ignoring', err);
                      feedbacks = [];
                    }

                    const highlights = await fetchHighlightsForRecord(record._id) || [];

                    setSelectedRecord({
                      record,
                      text: textsMap[record.textId],
                      feedbacks,
                      highlights
                    });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{idx + 1}</td>
                  <td>{text?.keyword || '-'}</td>
                  <td>{levelMap[text?.level] || '-'}</td>
                  <td>{modeMap[record.mode] || '-'}</td>
                  <td>{text?.title || '-'}</td>
                  <td>{shortPassage}</td>
                  <td>
                    {moment(record.createdAt)
                      .utcOffset(9 * 60)
                      .format('YYYY-MM-DD HH:mm:ss')}
                  </td>
                  <td>{formatElapsedSeconds(record.elapsedSeconds)}</td>
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

      {selectedRecord && (
        <TextDetailModal
          text={selectedRecord.text}
          record={selectedRecord.record}
          highlights={selectedRecord.highlights || []}
          onClose={() => setSelectedRecord(null)}
          onDownload={(type) => handleDownload(selectedRecord.text, type)}
          feedbacks={selectedRecord.feedbacks || []}
          isAdmin={true}
        />
      )}
    </div>
  );
};

export default ResultsDetail;