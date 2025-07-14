// src/pages/student/keyword-learning/KeywordSolve.jsx

import React, { useState, useEffect, useRef } from 'react';
import FeedbackModal from '../feedback/FeedbackModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import { CircularProgress } from '@mui/material'

import { api } from '@/config';
import CONFIG from '@/config';

import { useDispatch } from 'react-redux';
import { fetchStudentInfo } from '@/store/authSlice';

import StudentHeader from '../header/StudentHeader';
import { HighlightToast, HighlightUndoToast } from '../toast/HighlightToast';
import { LabelDropdown, LABELS } from '../label-dropdown/LabelDropdown';

import './keyword-solve.css';

const KeywordSolve = () => {
  const location = useLocation();
  const apiResponseData = location.state?.data;
  const mode = location.state?.mode;

  const modeToRecordMode = {
    personal: 'inferred',
    manual: 'selected',
    assigned: 'assigned',
  };

  const recordMode = modeToRecordMode[mode];

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
  const [pendingHighlight, setPendingHighlight] = useState(null);
  const [showLabelDropdown, setShowLabelDropdown] = useState(false);
  const [labelPosition, setLabelPosition] = useState({ x: 0, y: 0 });

  const [feedbackClosedAt, setFeedbackClosedAt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passageRef = useRef(null);

  const [userAnswers, setUserAnswers] = useState({});

  const isTouchDevice = () => {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  };

  useEffect(() => {
    if (!passageRef.current) return;

    if (isTouchDevice()) {
      const handleSelectionChange = () => {
        handleTextSelection();
      };
      document.addEventListener('selectionchange', handleSelectionChange);

      return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
      };
    }
  }, []);

  const handleConfirmSelection = (selectedGeneration) => {
    console.log('selected generation index:', selectedGeneration);
    setSelectedGeneration(selectedGeneration);
    setIsModalOpen(false);
    setFeedbackClosedAt(Date.now());
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

  const handleTextSelection = () => {
    const selectionInfo = getIndexFromSelection(passageRef.current);
    if (!selectionInfo) return;

    const { start, end, selectedText } = selectionInfo;
    if (!selectedText || selectedText.trim() === '') return;

    const isAlreadyHighlighted = highlightedRanges.some(
      (r) => r.start === start && r.end === end
    );
    if (isAlreadyHighlighted) return;

    setPendingHighlight({ start, end, text: selectedText });

    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setLabelPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });

    setShowLabelDropdown(true);
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

    setPendingHighlight({ start, end, text: selectedText });

    // label dropdown position
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setLabelPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });

    setShowLabelDropdown(true);
  };

  const saveHighlightToServer = async ({ text, label = 'etc' }) => {
    try {
      const response = await api.post(
        `${CONFIG.TEXT.BASE_URL}${CONFIG.TEXT.ENDPOINTS.SAVE_HIGHLIGHT}`,
        { text, label },
      );
      console.log('Highlights saved successfully:', response.data);

      return response.data.data;
    } catch (error) {
      console.error('Failed to save highlights:', error);
      alert('하이라이트 저장에 실패했습니다.');
    }
  };

  const handleLabelSelect = async (label) => {
    if (!pendingHighlight) return;

    const savedHighlight = await saveHighlightToServer({
      text: pendingHighlight.text,
      label,
    });
    if (!savedHighlight) return;

    const newHighlight = {
      ...pendingHighlight,
      _id: savedHighlight._id,
      label,
      timestamp: Date.now(),
    };

    setHighlightedRanges((prev) => [...prev, newHighlight]);
    setPendingHighlight(null);
    setShowLabelDropdown(false);
    window.getSelection()?.removeAllRanges();

    const toastId = toast.success(
      <HighlightToast
        onUndo={() => {
          handleUndoHighlight(newHighlight);
          toast.dismiss(toastId);
        }}
      />,
      {
        className: 'highlight-toast',
        icon: false,
        autoClose: 5000,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        position: 'bottom-right',
      },
    );
  };

  const renderHighlightedPassage = () => {
    const text = selectedGeneration.passage;
    if (highlightedRanges.length === 0) return text;

    const sortedRanges = [...highlightedRanges]
    .sort((a, b) => a.start - b.start || b.timestamp - a.timestamp);

    const highlightMap = Array(text.length).fill(null);

    sortedRanges.forEach((range) => {
      for (let i = range.start; i < range.end; i++) {
        if (highlightMap[i] === null) {
          highlightMap[i] = range;
        }
      }
    });

    const elements = [];
    let lastIndex = 0;

    while (lastIndex < text.length) {
      const currentHighlight = highlightMap[lastIndex];
      let endIndex = lastIndex + 1;

      while (
        endIndex < text.length &&
        highlightMap[endIndex] === currentHighlight
      ) {
        endIndex++;
      }

      const spanText = text.slice(lastIndex, endIndex);

      if (currentHighlight) {
        const color = LABELS[currentHighlight.label]?.color || LABELS.etc.color;
        elements.push(
          <span
            key={`highlight-${lastIndex}`}
            className="highlighted-text"
            style={{ backgroundColor: color }}
            title={LABELS[currentHighlight.label]?.labelKR}
            onClick={() => handleHighlightClick(currentHighlight)}
          >
            {spanText}
          </span>
        );
      } else {
        elements.push(
          <span key={`normal-${lastIndex}`}>{spanText}</span>
        );
      }
      lastIndex = endIndex;
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
        className: 'highlight-toast',
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

  const handleHighlightClick = async (highlight) => {
    const confirmDelete = window.confirm('이 하이라이트를 삭제하시겠습니까?');
    if (!confirmDelete) return;

    await handleUndoHighlight(highlight);
  };

  const uploadHighlightImage = async () => {
    const passageElement = document.querySelector('.result-left');
    if (!passageElement) return;

    const highlightIds = highlightedRanges.map(h => h._id);

    if (highlightIds.length === 0) {
      console.warn('No highlights found.');
      return null;
    }

    try {
      const canvas = await html2canvas(passageElement);
      const imageBase64 = canvas.toDataURL('image/png');

      const res = await api.post(
        `${CONFIG.TEXT.BASE_URL}${CONFIG.TEXT.ENDPOINTS.UPLOAD_HIGHLIGHT_IMAGE}`,
        {
          imageBase64,
          highlightIds,
        }
      );

      console.log('Image uploaded and DB updated:', res.data);
      return res.data.imageUrl;
    } catch (err) {
      console.error('Error uploading highlight image:', err);
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitAnswers = async () => {
    setIsSubmitting(true);

    const imageUrl = await uploadHighlightImage();
    if (!imageUrl) {
      console.warn('Highlight image upload was skipped or failed.');
    }

    const selectedGeneration = generations[finalChoiceIndex];

    const answers = selectedGeneration.question.map(
      (_, index) => userAnswers[index],
    );

    console.log('selected generation: ', selectedGeneration);
    console.log('user answers: ', answers);

    const submittedAt = Date.now();
    const elapsedSeconds = feedbackClosedAt ? Math.floor((submittedAt - feedbackClosedAt) / 1000) : null;

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
          elapsedSeconds,
          mode: recordMode,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {isSubmitting && (
        <div className="loading-overlay">
          <CircularProgress />
          <p>제출 중...</p>
        </div>
      )}

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

      {showLabelDropdown && (
        <LabelDropdown
          position={labelPosition}
          onSelect={handleLabelSelect}
          onClose={() => {
            setShowLabelDropdown(false);
            setPendingHighlight(null);
          }}
        />
      )}

      {selectedGeneration && (
        <div className="result-container">
          <StudentHeader />
          <div className="result-left">
            <h2>{selectedGeneration.title}</h2>
            <p
              ref={passageRef}
              onMouseUp={!isTouchDevice() ? handleTextMouseUp : undefined}
              onTouchEnd={isTouchDevice() ? handleTextSelection : undefined}
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
                  <div className="option-button-group">
        {options.map((opt, optIdx) => {
          const isSelected = userAnswers[index] === optIdx;
          return (
            <button
              key={optIdx}
              type="button"
              className={`option-button ${isSelected ? 'selected' : ''}`}
              onClick={() =>
                setUserAnswers((prev) => ({
                  ...prev,
                  [index]: optIdx,
                }))
              }
            >
              {String.fromCharCode(97 + optIdx)}. {opt}
            </button>
          );
        })}
      </div>
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