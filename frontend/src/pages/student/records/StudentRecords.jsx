// src/pages/student/records/StudentRecords.jsx

import React, { useEffect, useState } from 'react';
import moment from 'moment';

import StudentRecordsHeader from './RecordsHeader';
import TextDetailModal from './TextDetailModal';
import { handleDownload } from '@/utils/download-text';
import './student-records.css';

import { api } from '@/config';
import CONFIG from '@/config';

const StudentRecords = () => {
  const [records, setRecords] = useState([]);
  const [textsMap, setTextsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const levelMap = {
    low: '하',
    middle: '중',
    high: '상',
  };

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const resRecords = await api.get(
          `${CONFIG.TEXT.BASE_URL}${CONFIG.TEXT.ENDPOINTS.GET_RECORDS}`,
        );

        // NEWest first
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
        console.error('Failed to fetch records:', error);
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (records.length === 0) return <p>학습 기록이 없습니다.</p>;

  return (
    <div className="records-page-container">
      <StudentRecordsHeader />
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
              const shortPassage = (text?.passage || '').replace(/\n/g, ' ').slice(0, 200) || '-';

              return (
                <tr
                  key={record._id}
                  onClick={() => setSelectedRecord({ record, text })}
                  style={{ cursor: 'pointer' }}
                >

                  {/* open TextDetailModal */}
                  <td>{idx + 1}</td>
                  <td>{text?.keyword || '-'}</td>
                  <td>{levelMap[text?.level] || '-'}</td>
                  <td>{text?.title || '-'}</td>
                  <td>{shortPassage || '-'}</td>
                  <td>
                    {moment(record.createdAt).utcOffset(9 * 60).format('YYYY-MM-DD HH:mm:ss')}
                  </td>
                  <td>
                    {record.correctness.map((isCorrect, i) => (
                      <span
                        key={i}
                        className={isCorrect ? 'answer-correct' : 'answer-incorrect'}
                        style={{ marginRight: 4, }}
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
          onClose={() => setSelectedRecord(null)}
          onDownload={(type) => handleDownload(type, selectedRecord.text, selectedRecord.record)}
        />
      )}
    </div>
  );
};

export default StudentRecords;