// src/config.js

import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production';

const BASE_URL = isProduction
  ? 'http://35.216.79.131/api' // deployment server URL
  : 'http://localhost:3200/api'; // development server URL


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
      VALIDATE_KEYWORD: '/validate-keyword',
      GENERATE_TEXT: '/generate-text',
      GENERATE_TEXT_LOW: '/generate-text-low',
      SAVE_FEEDBACK: '/feedback',
      SAVE_HIGHLIGHT: '/highlight',
      DELETE_HIGHLIGHT: '/highlight',
      CHECK_ANSWER: '/check-answer',
      GET_RECORDS: '/records',
    },
  },

  TEACHER: {
    BASE_URL: `${BASE_URL}/teacher`,
    ENDPOINTS: {
      GET_CLASSES: '/classes',
      GET_CLASS_STUDENTS: (classId) => `/classes/${classId}/students`,
      GET_STUDENT_RECORDS: (studentId) => `/students/${studentId}/records`,
      SET_STUDENT_LEVEL: (studentId) => `/students/${studentId}/level`,
      SET_CLASS_LEVEL: (classId) => `/classes/${classId}/level`,
      SET_CLASS_KEYWORD: (classId) => `/classes/${classId}/keyword`,
    },
  },
};

export { api };
export default CONFIG;