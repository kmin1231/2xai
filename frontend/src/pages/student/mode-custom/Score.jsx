// src/pages/student/mode-custom/Score.jsx

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import StudentHeader from '../header/StudentHeader';
import './score.css';

const CustomLevelScore = () => {
  const location = useLocation();
  const [score, setScore] = useState(0);
  const [correctness, setCorrectness] = useState([]);
  const [newLevel, setNewLevel] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [title, setTitle] = useState('');
  const [passage, setPassage] = useState('');
  const [question, setQuestion] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [userAnswer, setUserAnswer] = useState([]);
  const [solutions, setSolutions] = useState([]);

  const [selectedSolution, setSelectedSolution] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (location.state) {
      const {
        score,
        correctness,
        newLevel,
        title,
        passage,
        question,
        answer,
        solution,
        userAnswer,
      } = location.state;
      setScore(score);
      setCorrectness(correctness);
      setNewLevel(newLevel);
      setTitle(title);
      setPassage(passage);
      setQuestion(question);
      setAnswers(answer);
      setSolutions(solution);
      setUserAnswer(userAnswer);
    }
  }, [location.state]);

  // Mapping answer to symbol (O/X)
  const getAnswerSymbol = (isCorrect) => {
    return isCorrect ? 'O' : 'X';
  };

  const openModal = (questionText, solutionText, index) => {
    setSelectedQuestion(questionText);
    setSelectedSolution(solutionText);
    setSelectedIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedQuestion(null);
    setSelectedSolution('');
  };

  return (
    <div className="score-container">
      <StudentHeader />
      <div className="score-box" style={{ display: 'flex', gap: '2rem' }}>
        <div
          className="score-box-left"
          style={{
            flex: '1',
            whiteSpace: 'pre-wrap',
            borderRight: '1px solid #ccc',
            paddingRight: '2rem',
          }}
        >
          <h2>{title}</h2>
          <p>{passage}</p>
        </div>

        <div style={{ flex: '1' }}>
          <h2 className="score-header">Result</h2>
          <hr />
          <p>
            <strong>Score:</strong> {score} / 5
          </p>

          <table className="score-table">
            <thead>
              <tr>
                <th style={{ maxWidth: '5vw' }}>No.</th>
                <th style={{ minWidth: '5vw' }}>내 답변</th>
                <th style={{ minWidth: '5vw' }}>정답</th>
                <th style={{ minWidth: '5vw' }}>결과</th>
                <th style={{ minWidth: '10vw' }}>풀이</th>
              </tr>
            </thead>

            <tbody>
              {correctness.map((isCorrect, index) => (
                <tr key={index}>
                  <td style={{ minWidth: '100px', fontWeight: 'bold' }}>
                    Q{index + 1}
                  </td>
                  <td style={{ minWidth: '100px' }}>
                    {typeof userAnswer?.[index] === 'number'
                      ? String.fromCharCode(97 + userAnswer[index])
                      : userAnswer?.[index]}
                  </td>
                  <td style={{ minWidth: '100px' }}>{answers[index]}</td>
                  <td style={{ minWidth: '100px' }}>
                    {getAnswerSymbol(isCorrect)}
                  </td>
                  <td style={{ minWidth: '100px' }}>
                    <button
                      onClick={() =>
                        openModal(question[index], solutions[index], index)
                      }
                    >
                      solution
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showModal && (
            <div
              className="solution-modal-overlay"
              style={styles.overlay}
              onClick={closeModal}
            >
              <div
                className="solution-modal-content"
                style={{
                  ...styles.modal,
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '2rem',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* solution-modal-left */}
                <div
                  className="solution-modal-left-question"
                  style={{ flex: 1, whiteSpace: 'pre-wrap' }}
                >
                  {selectedQuestion && (
                    <>
                      <h3>
                        Q{selectedIndex + 1}. {selectedQuestion.split('\n')[0]}
                      </h3>
                      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                        {selectedQuestion
                          .split('\n')
                          .slice(1)
                          .map((option, idx) => (
                            <li key={idx}>
                              <strong>{String.fromCharCode(97 + idx)}.</strong>{' '}
                              {option}
                            </li>
                          ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* solution-modal-right */}
                <div
                  className="solution-modal-right-solution"
                  style={{ flex: 1, whiteSpace: 'pre-wrap' }}
                >
                  <h3>Solution</h3>
                  <p>{selectedSolution}</p>
                  <button className="solution-close-btn" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomLevelScore;

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    flexDirection: 'column',
  },
};