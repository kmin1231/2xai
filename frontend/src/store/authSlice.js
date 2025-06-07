// src/store/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CONFIG from '@/config';

// login
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

    const data = await res.json();
    return data;
  },
);


// logout
export const logoutAsync = createAsyncThunk('auth/logout', async () => {
  const res = await fetch(
    `${CONFIG.AUTH.BASE_URL}${CONFIG.AUTH.ENDPOINTS.LOGOUT}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const data = await res.json();
  return data;
});


// initialState
const initialState = {
  username: '',
  password: '',
  isLoggedIn: false,
  token: null,
  userInfo: null,
  redirect: null,
  status: 'idle',
};


// slice
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
        const { token, redirect, role, name, classInfo, studentLevels, school } = action.payload;

        state.token = token;
        state.redirect = redirect;
        state.isLoggedIn = true;

        let userInfo = {
          name: name || '',
          school: '',
          inferredLevel: 'low',
          assignedLevel: 'low',
        };

        if (role === 'student') {
          userInfo.school = classInfo?.schoolName || '';
          userInfo.inferredLevel = studentLevels?.inferredLevel || 'low';
          userInfo.assignedLevel = studentLevels?.assignedLevel || 'low';
        } else if (role === 'teacher') {
          userInfo.school = classInfo?.schoolName || '';
        } else if (role === 'admin') {
          userInfo.school = '2xAI';
        }

        state.userInfo = userInfo;
        state.status = 'succeeded';

        localStorage.setItem('token', action.payload.token);

      })
      .addCase(login.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        return initialState;  // initialize every state
      });
  },
});


// export
export const { setUsername, setPassword, logout } = authSlice.actions;
export default authSlice.reducer;