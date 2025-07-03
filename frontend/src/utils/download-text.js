// src/utils/download-text.js

import jsPDF from 'jspdf';

// date-time formatting (YYMMDD_HHMMSS)
const formatDate = (isoString) => {
  const date = new Date(isoString);

  // UTC to KST (+ 9 hours)
  date.setHours(date.getHours() + 9);

  const pad = (n) => String(n).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return `${yy}${MM}${dd}_${hh}${mm}${ss}`;
};

const cleanFilename = (str) => {
  return str
    ?.trim()
    .replace(/[\/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_\uAC00-\uD7A3]/g, '')
    || 'text';
};

async function loadNanumGothicFont() {
  const res = await fetch('/fonts/NanumGothicEncoded.txt');
  const base64Font = await res.text();
  return base64Font.replace(/\s/g, '');
}

async function createPdfWithNanumGothic(content, filename) {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
  });

  const nanumBase64 = await loadNanumGothicFont();

  doc.addFileToVFS('NanumGothic.ttf', nanumBase64);
  doc.addFont('NanumGothic.ttf', 'NanumGothic', 'normal');
  doc.setFont('NanumGothic');
  doc.setFontSize(12);

  const margin = 15;
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxLineWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const lineHeight = 7;
  let currentY = margin;

  const lines = doc.splitTextToSize(content, maxLineWidth);

  lines.forEach((line) => {
    if (currentY + lineHeight > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
    }
    doc.text(line, margin, currentY);
    currentY += lineHeight;
  });

  doc.save(filename);
}

export const handleDownload = async (type, text, record) => {
  if (!text) return;

  const keyword = cleanFilename(text.keyword);
  const createdAt = formatDate(text.createdAt || new Date());
  const filename = `${keyword}_${createdAt}`;

  const optionLabels = ['a', 'b', 'c', 'd', 'e'];

  function formatQuestionLines(text, record) {
    return text.question?.map((q, i) => {
      const [question, ...options] = q.split('\n');
      const userAnswerIndex = record?.userAnswer?.[i];
      const userAnswerLabel = typeof userAnswerIndex === 'number'
        ? optionLabels[userAnswerIndex]
        : userAnswerIndex || '-';
      const correctAnswer = text.answer?.[i] || '-';

      const questionLines = [
        `Q${i + 1}: ${question}`,
        `[학생 답안] ${userAnswerLabel} — [정답] ${correctAnswer}`,
        ...options.map((opt, idx) => `${optionLabels[idx]}. ${opt}`),
        ''
      ];

      return questionLines.join('\n');
    }) || [];
  }

  const answersFormatted = text.answer?.map((a, i) => `Q${i + 1}. ${a}`) || [];
  const solutionsFormatted = text.solution?.map((s, i) => `Q${i + 1}. ${s}`) || [];

  const questionLines = formatQuestionLines(text, record);

  const lines = [
    `[keyword] ${text.keyword}`,
    `[level] ${text.level}`,
    `[title] ${text.title}`,
    '',
    `[Passage]`,
    text.passage,
    '',
    `[Questions]`,
    ...questionLines,
    `[Answers]`,
    ...answersFormatted,
    '',
    `[Solutions]`,
    ...solutionsFormatted
  ];

  const content = lines.join('\n');

  if (type === 'txt') {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  } else if (type === 'pdf') {
    await createPdfWithNanumGothic(content, `${filename}.pdf`);
  }
}