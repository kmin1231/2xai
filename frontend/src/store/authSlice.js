// src/store/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CONFIG from '@/config';

export const login = createAsyncThunk(
  'auth/login',

  async ({ username, password }) => {
    const res = await fetch(
      `${CONFIG.AUTH.BASE_URL}${CONFIG.AUTH.ENDPOINTS.LOGIN}`,
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      },
    );

    return await res.json();
  },
);

const initialState = {
  username: '',
  password: '',
  isLoggedIn: false,
  token: null,
  redirect: null,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUsername(state, action) {
      state.username = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    logout(state) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.redirect = action.payload.redirect;
        state.isLoggedIn = true;
        state.status = 'succeeded';
      })
      .addCase(login.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setUsername, setPassword, logout } = authSlice.actions;
export default authSlice.reducer;