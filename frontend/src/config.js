// src/config.js

import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production';

const BASE_URL = isProduction
  ? 'https://www.twoxai.online/api' // deployment server URL
  : 'http://localhost:3200/api';    // development server URL


// axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// axios request interceptors -- authorization header configuration
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const CONFIG = {
  BASE_URL,

  AUTH: {
    BASE_URL: `${BASE_URL}/auth`,
    ENDPOINTS: {
      LOGIN: '/login',
      PROTECTED: '/protected',
      LOGOUT: '/logout',
    },
  },

  TEXT: {
    BASE_URL: `${BASE_URL}/text`,
    ENDPOINTS: {
      VALIDATE_KEYWORD: '/keywords/validate',
      GENERATE_TEXT: '/generate-text',
      GENERATE_TEXT_CONTENTS: '/contents',
      SAVE_FEEDBACK: '/feedback',
      SAVE_GENERATION: '/generation',
      SAVE_HIGHLIGHT: '/highlight',
      DELETE_HIGHLIGHT: '/highlight',
      UPLOAD_HIGHLIGHT_IMAGE: '/highlight/image',
      CHECK_ANSWER: '/answers/verify',
      GET_RECORDS: '/records',
      CONTENTS_BY_ID: (textId) => `/contents/${textId}`,
    },
  },

  STUDENT: {
    BASE_URL: `${BASE_URL}/student`,
    ENDPOINTS: {
      GET_CLASS_INFO: '/class',
      GET_CURRENT_INFO: '/me',
    },
  },

  TEACHER: {
    BASE_URL: `${BASE_URL}/teacher`,
    ENDPOINTS: {
      GET_CLASSES: '/classes',
      GET_CLASS_STUDENTS: (classId) => `/classes/${classId}/students`,
      GET_STUDENT_RECORDS: (studentId) => `/students/${studentId}/records`,
      GET_STUDENT_RECORDS_SUMMARY: (studentId) => `/students/${studentId}/records/summary`,
      SET_STUDENT_LEVEL: (studentId) => `/students/${studentId}/level`,
      SET_CLASS_LEVEL: (classId) => `/classes/${classId}/level`,
      SET_CLASS_KEYWORD: (classId) => `/classes/${classId}/keyword`,
      GET_HIGHLIGHTS: '/highlights',
    },
  },

  ADMIN: {
    BASE_URL: `${BASE_URL}/admin`,
    ENDPOINTS: {
      GET_CLASSES: '/classes',
      GET_FEEDBACKS: '/feedbacks',
      GET_FEEDBACK_BY_RECORD: (recordId) => `/records/${recordId}/feedback`,
      GET_HIGHLIGHTS_BY_RECORD: (recordId) => `/records/${recordId}/highlights`,
    },
  },
};

export { api };
export default CONFIG;
