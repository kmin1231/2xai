// src/store/index.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';  // use localStorage for persistence

import { combineReducers } from 'redux';

// redux-persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // reducers to persist (name)
};

const rootReducer = combineReducers({
  auth: authReducer,
});

// persisted reducer setup
const persistedReducer = persistReducer(persistConfig, rootReducer);

// store setup with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,  // redux-persist warning OFF
    }),
});

// persist store configuration
export const persistor = persistStore(store);

export default store;