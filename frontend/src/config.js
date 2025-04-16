// src/config.js

const isProduction = process.env.NODE_ENV === 'production';

const BASE_URL = isProduction
  ? 'http://35.216.79.131/api' // deployment server URL
  : 'http://localhost:3200/api'; // development server URL

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

export default CONFIG;