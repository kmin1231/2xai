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
  const [selectedText, setSelectedText] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const resRecords = await api.get(
          `${CONFIG.TEXT.BASE_URL}${CONFIG.TEXT.ENDPOINTS.GET_RECORDS}`
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
                `${CONFIG.TEXT.BASE_URL}/contents/${textId}`
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
                <tr key={record._id} onClick={() => setSelectedText(text)}>
                  {' '}

                  {/* open TextDetailModal */}
                  <td>{idx + 1}</td>
                  <td>{text?.keyword || '-'}</td>
                  <td>{text?.level || '-'}</td>
                  <td>{text?.title || '-'}</td>
                  <td>{shortPassage || '-'}</td>
                  <td>
                    {moment(record.createdAt).utcOffset(9 * 60).format('YYYY-MM-DD HH:mm:ss')}
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

export default StudentRecords;