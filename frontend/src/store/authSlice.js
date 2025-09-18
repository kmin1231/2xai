// src/store/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CONFIG from '@/config';
import { api } from '@/config';

// login
export const login = createAsyncThunk(
  'auth/login',

  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${CONFIG.AUTH.BASE_URL}${CONFIG.AUTH.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
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
  loginReason: null,
};


// fetch student info
export const fetchStudentInfo = createAsyncThunk(
  'auth/fetchStudentInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${CONFIG.STUDENT.BASE_URL}${CONFIG.STUDENT.ENDPOINTS.GET_CURRENT_INFO}`
      );
      return response.data; // { name, studentLevels, classInfo }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


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
    logout() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        const { token, role, name, classInfo, studentLevels } = action.payload;

        state.token = token;
        state.isLoggedIn = true;
        state.role = role;

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

        state.loginReason = null;

        localStorage.setItem('token', token);
      })
      .addCase(login.rejected, (state, action) => {
        console.error('Login rejected payload:', action.payload);
        state.status = 'failed';
        state.loginReason = action.payload?.reason || 'unknown';
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        return initialState;  // initialize every state
      })
      .addCase(fetchStudentInfo.fulfilled, (state, action) => {
        const { name, studentLevels, classInfo } = action.payload;

        state.userInfo = {
          name: name || '',
          school: classInfo?.schoolName || '',
          inferredLevel: studentLevels?.inferredLevel || 'low',
          assignedLevel: studentLevels?.assignedLevel || 'low',
        };
      })
      .addCase(fetchStudentInfo.rejected, (state, action) => {
        console.error('fetchStudentInfo failed:', action.payload);
      });
  },
});


// export
export const { setUsername, setPassword, logout } = authSlice.actions;
export default authSlice.reducer;