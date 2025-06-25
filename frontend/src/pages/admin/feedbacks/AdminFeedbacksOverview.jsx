// src/pages/admin/feedbacks/AdminFeedbacksOverview.jsx

import React, { useEffect, useState } from 'react';

import { api } from '@/config';
import CONFIG from '@/config';

import ClassDropdown from '@/pages/teacher/dropdown/ClassDropdown';
import './feedback-overview.css';

const feedbackLabelMap = {
  good: '😎 적당해요',
  too_easy: '😌 너무 쉬워요',
  too_hard: '😩 너무 어려워요',
  not_interesting: '😐 흥미롭지 않아요',
};

const levelLabelMap = {
  low: '하',
  middle: '중',
  high: '상',
};
const FeedbackDetailModal = ({ feedbackItem, onClose }) => {
  if (!feedbackItem) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h3>피드백 상세 정보</h3>
        <p>
          <strong>학교/학반:</strong> [
          {feedbackItem.userId?.class_id?.school_name}]{' '}
          {feedbackItem.userId?.class_id?.class_name} -{' '}
          {feedbackItem.userId?.name}
        </p>
        <p>
          <strong>키워드:</strong> {feedbackItem.keyword}
        </p>
        <p>
          <strong>난이도:</strong>{' '}
          {levelLabelMap[feedbackItem.level] || feedbackItem.level}
        </p>
        <p>
          <strong>제출 시간:</strong>{' '}
          {new Date(feedbackItem.createdAt).toLocaleString()}
        </p>

        <hr />

        {feedbackItem.feedbacks.map((fb, i) => (
          <div key={fb._id} style={{ marginBottom: '1em' }}>
            {i === 0 && <hr />}
            <h4>
              {i + 1}. {fb.title}
            </h4>
            <p>{feedbackLabelMap[fb.feedback] || fb.feedback}</p>
            {/* <p>{fb.passage}</p> */}
            <p style={{ whiteSpace: 'pre-line', fontSize: '1.0rem' }}>{fb.passage}</p>
            {i < feedbackItem.feedbacks.length - 1 && <hr />}
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminFeedbacksOverview = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('all');
  const [feedbacks, setFeedbacks] = useState([]);

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get(
          `${CONFIG.ADMIN.BASE_URL}${CONFIG.ADMIN.ENDPOINTS.GET_CLASSES}`,
        );
        setClasses(res.data.data || res.data || []);
      } catch (error) {
        console.error('학반 목록 불러오기 실패', error);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await api.get(
          `${CONFIG.ADMIN.BASE_URL}${CONFIG.ADMIN.ENDPOINTS.GET_FEEDBACKS}`,
        );
        setFeedbacks(res.data.data || res.data || []);
      } catch (error) {
        console.error('피드백 목록 불러오기 실패', error);
      }
    };

    if (classes.length > 0) fetchFeedbacks();
  }, [classes]);

  const onRowClick = (feedbackItem) => {
    setSelectedFeedback(feedbackItem);
    setIsModalOpen(true);
  };

  const filteredFeedbacks =
    selectedClassId === 'all'
      ? feedbacks
      : feedbacks.filter((fb) => fb.userId?.class_id?._id === selectedClassId);

  return (
    <div className="feedback-overview-container">
      <h3 className="feedback-overview-title">학생 피드백 확인</h3>

      <div className="dropdown-wrapper">
        <ClassDropdown
          classes={classes}
          selectedClassId={selectedClassId}
          onSelectClass={setSelectedClassId}
        />
      </div>

      <div className="table-wrapper">
        <table className="feedback-overview-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>학교</th>
              <th>학반</th>
              <th>학생 이름</th>
              <th>키워드</th>
              <th>난이도</th>
              <th>시간</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  style={{ textAlign: 'center', padding: '10px' }}
                >
                  피드백이 없습니다.
                </td>
              </tr>
            ) : (
              filteredFeedbacks.map((item, idx) => (
                <tr
                  key={item._id}
                  onClick={() => onRowClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{idx + 1}</td>
                  <td>{item.userId?.class_id?.school_name || '-'}</td>
                  <td>{item.userId?.class_id?.class_name || ''}</td>
                  <td>{item.userId?.name || '-'}</td>
                  <td>🔗 {item.keyword}</td>
                  <td>{levelLabelMap[item.level] || item.level}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <FeedbackDetailModal
          feedbackItem={selectedFeedback}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminFeedbacksOverview;