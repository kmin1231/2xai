// src/pages/teacher/highlights/HighlightTable.jsx

import React from 'react';
import './highlight-table.css';

const HighlightTable = ({ highlights }) => {
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HighlightTable;