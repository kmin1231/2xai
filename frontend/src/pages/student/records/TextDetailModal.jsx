// src/pages/student/records/TextDetailModal.jsx

import React from 'react';
import './text-detail-modal.css';

const optionLabels = ['a', 'b', 'c', 'd', 'e'];

const formatQuestions = (questions, userAnswers = [], correctAnswers = []) => {
  if (!questions) return null;

  return questions.map((q, i) => {
    const parts = q.split('\n');
    const questionText = parts[0];
    const options = parts.slice(1);

    const userAnsLabel =
      typeof userAnswers[i] === 'number'
        ? optionLabels[userAnswers[i]]
        : userAnswers[i] || '-';

    const correctAnsLabel = correctAnswers[i] || '-';

    return (
      <div key={i} style={{ marginBottom: 5 }}>
        <p>
          <strong>
            Q{i + 1}. {questionText}
          </strong>
        </p>

        <p style={{ textAlign: 'center' }}>
          <strong>[학생 답안]</strong> {userAnsLabel}
        </p>

        <p style={{ textAlign: 'center' }}>
          <strong>[정답]</strong> {correctAnsLabel}
        </p>

        {options.map((opt, idx) => (
          <p key={idx} style={{ marginBottom: '0.0em' }}>
            {optionLabels[idx]}. {opt}
          </p>
        ))}

        <div style={{ height: 10 }}></div>
      </div>
    );
  });
};

const TextDetailModal = ({ text, record, onClose, onDownload }) => {
  if (!text) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="text-detail-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-buttons">
          <button className="download-btn" onClick={() => onDownload('txt')}>
            ⬇️ TXT 다운로드
          </button>
          <button className="download-btn" onClick={() => onDownload('pdf')}>
            ⬇️ PDF 다운로드
          </button>
        </div>

        <h2 className="modal-title">{text.title || '지문 상세 정보'}</h2>

        <div className="modal-body">
          <section>
            <p>
              <strong>Passage:</strong>
            </p>
            <p>{text.passage}</p>
          </section>

          <hr />

          <section>
            <p>
              <strong>Question:</strong>
            </p>
            {formatQuestions(text.question, record.userAnswer, text.answer)}
          </section>

          <hr />

          <section>
            <p>
              <strong>Answer:</strong>
            </p>
            {text.answer?.map((a, i) => (
              <p key={i}>
                Q{i + 1}. {a}
              </p>
            ))}
          </section>

          <hr />

          <section>
            <p>
              <strong>Solution:</strong>
            </p>
            {text.solution?.map((s, i) => (
              <p key={i}>
                Q{i + 1}. {s}
              </p>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default TextDetailModal;