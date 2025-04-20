// src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { Provider } from 'react-redux';
import store, { persistor } from '@/store';

import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(
  <StrictMode>

    {/* Redux provider */}
    <Provider store={store}>

      {/* redux-persist */}
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>

    </Provider>
    
  </StrictMode>,
);