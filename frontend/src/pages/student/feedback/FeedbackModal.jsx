// src/pages/student/feedback/FeedbackModal.jsx

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

import { api } from '@/config';
import CONFIG from '@/config';

import './feedback-modal.css';
// import sampleData from '@/data/sampleResponse.json';

Modal.setAppElement('#root');

const FeedbackModal = ({
  isOpen,
  onClose,
  currentPage = 0,
  setCurrentPage,
  feedbacks,
  setFeedbacks,
  finalChoiceIndex,
  setFinalChoiceIndex,
  onConfirmSelection,
  generations,
  keyword={keyword},
  level={level},
}) => {
  const totalPages = generations.length + 1;

  const currentGeneration =
    currentPage < 3 && generations[currentPage]
      ? generations[currentPage]
      : null;

  const handleFeedback = (choice) => {
    const updated = [...feedbacks];

    updated[currentPage] = {
      feedback: choice,
      title: currentGeneration?.title,
      passage: currentGeneration?.passage,
    };

    setFeedbacks(updated);
  };

  const handleFinalSelect = (index) => {
    setFinalChoiceIndex(index);
  };


  const ConfirmSelection = async () => {
    console.log(generations);

    const selectedGeneration = generations[finalChoiceIndex];
    onConfirmSelection(selectedGeneration);

    console.log('selected generation index:', finalChoiceIndex);
    console.log('selected generation:', selectedGeneration);

    try {
      const response = await api.post(
        `${CONFIG.TEXT.BASE_URL}${CONFIG.TEXT.ENDPOINTS.SAVE_FEEDBACK}`, {
          keyword,
          level,
          feedbacks,
       }
      );
      console.log('Feedback saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
      className="feedback-modal"
      overlayClassName="feedback-modal-overlay"
    >
      <div className="modal-content">
        {currentPage < 3 ? (
          <>
            <div className="modal-left">
              <h3>
                [Passage #{currentPage + 1}] {currentGeneration?.title}
              </h3>

              <p>
                {currentGeneration?.passage.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </div>

            <div className="modal-right">
              <h4>읽기 자료가 마음에 드나요?</h4>
              <button

                className={`feedback-btn ${feedbacks[currentPage]?.choice === 'good' ? 'selected' : ''}`}
                onClick={() => handleFeedback('good')}
              >
                😎 적당해요
              </button>
              <button
                className={`feedback-btn ${feedbacks[currentPage]?.choice === 'too_easy' ? 'selected' : ''}`}
                onClick={() => handleFeedback('too_easy')}
              >
                😌 너무 쉬워요
              </button>
              <button
                className={`feedback-btn ${feedbacks[currentPage]?.choice === 'too_hard' ? 'selected' : ''}`}
                onClick={() => handleFeedback('too_hard')}
              >
                😩 너무 어려워요
              </button>
              <button
                className={`feedback-btn ${feedbacks[currentPage]?.choice === 'not_interesting' ? 'selected' : ''}`}
                onClick={() => handleFeedback('not_interesting')}
              >
                😐 흥미롭지 않아요
              </button>
            </div>
          </>
        ) : (
          <div className="modal-final">
            <h3>지문을 선택하세요</h3>
            <ul className="final-selection-list">
              {generations.map((gen, index) => (
                <li
                  key={index}
                  className={`final-option ${finalChoiceIndex === index ? 'selected' : ''}`}
                >
                  <p>{gen.passage.slice(0, 200)}...</p>
                  <button
                    className="final-select-button"
                    onClick={() => handleFinalSelect(index)}
                  >
                    {index + 1}번 선택
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="confirm-btn"
              disabled={finalChoiceIndex === null}
              onClick={ConfirmSelection}
            >
              문제 풀기
            </button>
          </div>
        )}
      </div>

      <div className="modal-footer">
        <button className="move-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          ← 이전
        </button>
        {currentPage < totalPages - 1 && (
          <button className="move-btn"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage < 3 && !feedbacks[currentPage]}
          >
            다음 →
          </button>
        )}
      </div>
    </Modal>
  );
};

export default FeedbackModal;