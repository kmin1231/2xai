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
    },
  },
};

export { api };
export default CONFIG;