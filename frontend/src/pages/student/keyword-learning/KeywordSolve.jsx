// src/pages/student/keyword-learning/KeywordSolve.jsx

import React, { useState, useEffect, useRef } from 'react';
import FeedbackModal from '../feedback/FeedbackModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { api } from '@/config';
import CONFIG from '@/config';

import { useDispatch } from 'react-redux';
import { fetchStudentInfo } from '@/store/authSlice';

import StudentHeader from '../header/StudentHeader';
import { HighlightToast, HighlightUndoToast } from '../toast/HighlightToast';

import './keyword-solve.css';

const KeywordSolve = () => {
  const location = useLocation();
  const apiResponseData = location.state?.data;

  const generations = [
    apiResponseData.generation0,
    apiResponseData.generation1,
    apiResponseData.generation2,
  ];

  const keyword = apiResponseData.keyword;
  const level = apiResponseData.level;

  const [currentPage, setCurrentPage] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [finalChoiceIndex, setFinalChoiceIndex] = useState(null);

  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const [highlightedRanges, setHighlightedRanges] = useState([]);
  const passageRef = useRef(null);

  const [userAnswers, setUserAnswers] = useState({});

  const handleConfirmSelection = (selectedGeneration) => {
    console.log('selected generation index:', selectedGeneration);
    setSelectedGeneration(selectedGeneration);
    setIsModalOpen(false);
  };

  const getIndexFromSelection = (containerElement) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const preRange = range.cloneRange();

    preRange.selectNodeContents(containerElement);
    preRange.setEnd(range.startContainer, range.startOffset);

    const start = preRange.toString().length;
    const end = start + range.toString().length;

    return { start, end, selectedText: range.toString() };
  };

  const handleTextMouseUp = async () => {
    const selectionInfo = getIndexFromSelection(passageRef.current);
    if (!selectionInfo) return;

    const { start, end, selectedText } = selectionInfo;

    if (!selectedText || selectedText.trim() === '') return;

    // 중복 하이라이트 방지
    const isAlreadyHighlighted = highlightedRanges.some(
      (r) => r.start === start && r.end === end,
    );
    if (isAlreadyHighlighted) return;

    const savedHighlight = await saveHighlightToServer({ text: selectedText });
    if (!savedHighlight) return;

    const newHighlight = {
      start,
      end,
      text: selectedText,
      _id: savedHighlight._id,
    };

    setHighlightedRanges((prev) => [...prev, newHighlight]);

    const toastId = toast.success(
      <HighlightToast
        onUndo={() => {
          handleUndoHighlight(newHighlight);
          toast.dismiss(toastId);
        }}
      />,
      {
        icon: true,
        autoClose: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        position: 'bottom-right',
      },
    );

    selection.removeAllRanges();
  };

  const saveHighlightToServer = async (highlight) => {
    try {
      const response = await api.post(
        `${CONFIG.TEXT.BASE_URL}${CONFIG.TEXT.ENDPOINTS.SAVE_HIGHLIGHT}`,
        {
          text: highlight.text,
        },
      );
      console.log('Highlights saved successfully:', response.data);
      // alert('하이라이트가 저장되었습니다.');

      return response.data.data;
    } catch (error) {
      console.error('Failed to save highlights:', error);
      alert('하이라이트 저장에 실패했습니다.');
    }
  };

  const renderHighlightedPassage = () => {
    const text = selectedGeneration.passage;
    if (highlightedRanges.length === 0) return text;

    let lastIndex = 0;
    const elements = [];

    const sortedRanges = [...highlightedRanges].sort(
      (a, b) => a.start - b.start,
    );
    sortedRanges.forEach((range, idx) => {
      if (range.start > lastIndex) {
        elements.push(
          <span key={`text-${idx}-normal`}>
            {text.slice(lastIndex, range.start)}
          </span>,
        );
      }
      elements.push(
        <span className="highlighted-text" key={`text-${idx}-highlight`}>
          {text.slice(range.start, range.end)}
        </span>,
      );
      lastIndex = range.end;
    });

    if (lastIndex < text.length) {
      elements.push(<span key="text-last">{text.slice(lastIndex)}</span>);
    }

    return elements;
  };

  const handleUndoHighlight = async (highlight) => {
    try {
      await api.delete(
        `${CONFIG.TEXT.BASE_URL}${CONFIG.TEXT.ENDPOINTS.DELETE_HIGHLIGHT}`,
        {
          data: {
            text: highlight.text,
          },
        },
      );

      setHighlightedRanges((prev) =>
        prev.filter((h) => h.text !== highlight.text),
      );

      toast.info(<HighlightUndoToast />, {
        icon: false,
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error('하이라이트 삭제 실패:', error);
      toast.error('하이라이트를 삭제하는 데 실패했습니다.');
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitAnswers = async () => {
    const selectedGeneration = generations[finalChoiceIndex];

    const answers = selectedGeneration.question.map(
      (_, index) => userAnswers[index],
    );

    console.log('selected generation: ', selectedGeneration);
    console.log('user answers: ', answers);

    try {
      const response = await api.post(
        `${CONFIG.TEXT.BASE_URL}${CONFIG.TEXT.ENDPOINTS.CHECK_ANSWER}`,
        {
          keyword,
          level,
          title: selectedGeneration.title,
          passage: selectedGeneration.passage,
          question: selectedGeneration.question,
          answer: selectedGeneration.answer,
          solution: selectedGeneration.solution,
          userAnswer: answers,
        },
      );
      console.log('Requested successfully:', response.data);

      await dispatch(fetchStudentInfo());

      navigate('/student/mode/${mode}/score', {
        state: {
          score: response.data.score,
          correctness: response.data.correctness,
          newLevel: response.data.newLevel,
          title: selectedGeneration.title,
          passage: selectedGeneration.passage,
          question: selectedGeneration.question,
          answer: selectedGeneration.answer,
          solution: selectedGeneration.solution,
          userAnswer: answers,
        },
      });
    } catch (error) {
      console.error('Error checking answers:', error);
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
        keyword={keyword}
        level={level}
      />
      {selectedGeneration && (
        <div className="result-container">
          <StudentHeader />
          <div className="result-left">
            <h2>{selectedGeneration.title}</h2>
            <p
              ref={passageRef}
              onMouseUp={handleTextMouseUp}
              style={{ whiteSpace: 'pre-wrap', cursor: 'text' }}
            >
              {renderHighlightedPassage()}
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
                onClick={submitAnswers}
                disabled={
                  selectedGeneration &&
                  selectedGeneration.question.some(
                    (_, idx) => userAnswers[idx] === undefined,
                  )
                }
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

export default KeywordSolve;