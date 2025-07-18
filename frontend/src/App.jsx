import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import '@fontsource/ibm-plex-sans-kr/400.css';
import '@fontsource/ibm-plex-sans-kr/700.css';

import SplashPage from './pages/splash/Splash';
import Login from './pages/login/Login';
import StudentMain from './pages/student/main/StudentMain';
import KeywordInput from './pages/student/keyword-learning/KeywordInput';
import KeywordSolve from './pages/student/keyword-learning/KeywordSolve';
import KeywordScore from './pages/student/keyword-learning/KeywordScore';
import StudentRecords from './pages/student/records/StudentRecords';

import TeacherMain from './pages/teacher/main/TeacherMain';
import TeacherDashboardLayout from '@/layouts/TeacherDashboardLayout';
import ResultsOverview from './pages/teacher/results/ResultsOverview';
import ResultsDetail from './pages/teacher/results/ResultsDetail';
import ClassConfig from './pages/teacher/class-config/ClassConfig';
import HighlightsOverview from './pages/teacher/highlights/HighlightsOverview';

import AdminDashboardLayout from '@/layouts/AdminDashboardLayout';
import AdminMain from './pages/admin/main/AdminMain';
import AdminResultsOverview from './pages/admin/results/AdminResultsOverview';
import AdminHighlightsOverview from './pages/admin/highlights/AdminHighlightsOverview';
import AdminFeedbacksOverview from './pages/admin/feedbacks/AdminFeedbacksOverview';

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student" element={<StudentMain />} />
          <Route path="/student/records" element={<StudentRecords />} />
          <Route path="/student/mode/:mode" element={<KeywordInput />} />
          <Route path="/student/mode/:mode/solve" element={<KeywordSolve />} />
          <Route path="/student/mode/:mode/score" element={<KeywordScore />} />

          <Route path="/teacher" element={<TeacherMain />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboardLayout />}>
            <Route path="results" element={<ResultsOverview />} />
            <Route path="results/student/:studentId" element={<ResultsDetail />} />
            <Route path="class/config" element={<ClassConfig />} />
            <Route path="highlights" element={<HighlightsOverview />} />
          </Route>

          <Route path="/admin" element={<AdminDashboardLayout />}>
            <Route index element={<AdminMain />} />
            <Route path="dashboard/results" element={<AdminResultsOverview />} />
            <Route path="dashboard/results/student/:studentId" element={<ResultsDetail />} />
            <Route path="dashboard/highlights" element={<AdminHighlightsOverview />} />
            <Route path="dashboard/feedbacks" element={<AdminFeedbacksOverview />} />
          </Route>
        </Routes>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </>
    </Router>
  );
}

export default App;