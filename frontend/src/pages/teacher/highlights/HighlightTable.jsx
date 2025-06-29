// src/pages/teacher/highlights/HighlightTable.jsx

import React, { useState } from 'react';
import './highlight-table.css';

const labelMap = {
  important: '중요',
  confusing: '어려움',
  mainidea: '주제',
  etc: '기타',
};

const HighlightTable = ({ highlights }) => {
  const [modalImageUrl, setModalImageUrl] = useState(null);

  return (
    <div className="highlight-table-wrapper">
      <table className="highlights-overview-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>학교</th>
            <th>학반</th>
            <th>이름</th>
            <th>하이라이트</th>
            <th>태그</th>
            <th>이미지</th>
          </tr>
        </thead>
        <tbody>
          {highlights.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '10px' }}>
                하이라이트가 없습니다.
              </td>
            </tr>
          ) : (
            highlights.map((item, idx) => (
              <tr key={item._id}>
                <td>{idx + 1}</td>
                <td>{item.schoolName}</td>
                <td>{item.className}</td>
                <td>{item.userName}</td>
                <td>{item.text}</td>
                <td>{labelMap[item.label] || '기타'}</td>
                <td>
                  {item.imageUrl ? (
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => setModalImageUrl(item.imageUrl)}
                    >
                      🔗
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {modalImageUrl && (
        <div className="highlight-image-modal" onClick={() => setModalImageUrl(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalImageUrl} alt="highlight screenshot" />
          </div>
        </div>
      )}

    </div>
  );
};

export default HighlightTable;