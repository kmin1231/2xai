// src/pages/student/mode-custom/Result.jsx

import React, { useState } from 'react';
import FeedbackModal from '../feedback/FeedbackModal';
import { useLocation } from 'react-router-dom';

import StudentHeader from '../header/StudentHeader';
import './result.css';

const CustomLevelResult = () => {
  const location = useLocation();
  const apiResponseData = location.state?.data;

  const generations = [
    apiResponseData.generation0,
    apiResponseData.generation1,
    apiResponseData.generation2,
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [finalChoiceIndex, setFinalChoiceIndex] = useState(null);

  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const [userAnswers, setUserAnswers] = useState({});

  const handleConfirmSelection = (selectedGeneration) => {
    console.log('selected generation index:', selectedGeneration);
    setSelectedGeneration(selectedGeneration);
    setIsModalOpen(false);
  };

  const handleSubmitAnswers = async () => {
    try {
      const payload = {
        answers: Object.values(userAnswers),
        questionIds: selectedGeneration.questions.map((q, i) => i),
      };
      const response = await axios.post('/api/text/answers', payload);
      console.log('정답 제출 성공:', response.data);
      alert('제출 완료!');
    } catch (error) {
      console.error('정답 제출 오류:', error);
      alert('제출 실패');
    }
  };

  return (
    <div>
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        feedbacks={feedbacks}
        setFeedbacks={setFeedbacks}
        finalChoiceIndex={finalChoiceIndex}
        setFinalChoiceIndex={setFinalChoiceIndex}
        onConfirmSelection={handleConfirmSelection}
        generations={generations} // actual data (API response)
      />
      {selectedGeneration && (
        <div className="result-container">
          <StudentHeader />
          <div className="result-left">
            <h2>{selectedGeneration.title}</h2>
            <p>
              {selectedGeneration.passage.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div>
          <div className="result-right">
            <h3>Questions</h3>
            {selectedGeneration.question.map((q, index) => {
              const questionParts = q.split('\n');
              const questionText = questionParts[0];
              const options = questionParts.slice(1);

              return (
                <div key={index} className="question-text">
                  <p>
                    <strong>
                      Q{index + 1}. {questionText}
                    </strong>
                  </p>
                  <ul>
                    {options.map((opt, optIdx) => {
                      const optionId = `q${index}_opt${optIdx}`;
                      return (
                        <li key={optIdx} style={{ listStyleType: 'none' }}>
                          <label htmlFor={optionId}>
                            <input
                              type="radio"
                              name={`question-${index}`}
                              id={optionId}
                              value={optIdx}
                              checked={userAnswers[index] === optIdx}
                              onChange={() =>
                                setUserAnswers((prev) => ({
                                  ...prev,
                                  [index]: optIdx,
                                }))
                              }
                            />
                            {String.fromCharCode(97 + optIdx)}. {opt}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
            <div className="question-submit-wrapper">
              <button
                className="question-submit-btn"
                onClick={handleSubmitAnswers}
              >
                답안 제출
              </button>
            </div>
          </div>
        </div>
      )}
      ;
    </div>
  );
};

export default CustomLevelResult;