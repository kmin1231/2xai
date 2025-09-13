// src/pages/student/feedback/FeedbackModal.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

import { api } from '@/config';
import CONFIG from '@/config';

import './feedback-modal.css';
// import sampleData from '@/data/sampleResponse.json';

Modal.setAppElement('#root');

const trimTextToWordBoundary = (text, maxLen) => {
  if (text.length <= maxLen) return text;

  const trimmed = text.slice(0, maxLen);
  const lastSpace = trimmed.lastIndexOf(' ');
  return trimmed.slice(0, lastSpace > 0 ? lastSpace : maxLen) + '...';
};

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
  keyword,
  level,
  mode,
}) => {
  const navigate = useNavigate();
  const totalPages = generations.length + 1;

  const currentGeneration =
    currentPage < 3 && generations[currentPage]
      ? generations[currentPage]
      : null;

  const handleFeedback = (choice) => {
    const updated = [...feedbacks];

    updated[currentPage] = {
      ...updated[currentPage],
      choice: choice,
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
    event.preventDefault();

    const selectedGeneration = generations[finalChoiceIndex];

    console.log('selected generation index:', finalChoiceIndex);
    console.log('selected generation:', selectedGeneration);

    const payloadFeedbacks = feedbacks.map(f => ({
      feedback: f.choice,
      title: f.title,
      passage: f.passage,
    }));

    try {
      const response = await api.post(
        `${CONFIG.TEXT.BASE_URL}${CONFIG.TEXT.ENDPOINTS.SAVE_FEEDBACK}`, {
          keyword,
          level,
          feedbacks: payloadFeedbacks,
        },
      );
      console.log('Feedback saved successfully:', response.data);

      const savedFeedbackId = response.data.data._id;

      onConfirmSelection(selectedGeneration, savedFeedbackId);

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
      <div className="feedback-modal-content">
        {currentPage < 3 ? (
          <>
            <div className="feedback-modal-left">
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

            <div className="feedback-modal-right">
              <button
                className="retry-btn"
                onClick={() => {
                  onClose();
                  const targetMode = mode || 'personal';
                  navigate(`/student/mode/${targetMode}`, { replace: true });
                }}
              >
                ↩️ 다시 시도
              </button>

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
          <div className="feedback-modal-final">
            <h3>지문을 선택하세요</h3>
            <ul className="final-selection-list">
              {generations.map((gen, index) => (
                <li
                  key={index}
                  className={`final-option ${finalChoiceIndex === index ? 'selected' : ''}`}
                >
                  <p className="multiline-truncate">
                    {trimTextToWordBoundary(gen.passage, 190)}
                  </p>

                  <div className="button-feedback-container">
                    <button
                      className="final-select-button"
                      onClick={() => handleFinalSelect(index)}
                    >
                      {index + 1}번 선택
                    </button>

                    {/* 사용자가 선택한 피드백 표시 */}
                    {feedbacks[index]?.feedback || feedbacks[index]?.choice ? (
                      <p className="user-feedback">
                        {
                          {
                            good: '😎 적당해요',
                            too_easy: '😌 너무 쉬워요',
                            too_hard: '😩 너무 어려워요',
                            not_interesting: '😐 흥미롭지 않아요',
                          }[
                            feedbacks[index]?.feedback ||
                              feedbacks[index]?.choice
                          ]
                        }
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="confirm-btn"
              disabled={finalChoiceIndex === null || finalChoiceIndex === undefined || finalChoiceIndex < 0}
              onClick={ConfirmSelection}
            >
              문제 풀기
            </button>
          </div>
        )}
      </div>

      <div className="feedback-modal-footer">
        <button
          className="move-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          ← 이전
        </button>
        {currentPage < totalPages - 1 && (
          <button
            className="move-btn"
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