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
          <Route path="/teacher/dashboard/results" element={<ResultsOverview />} />
          <Route path="/teacher/dashboard/results/student/:studentId" element={<ResultsDetail />} />

            {/* <Route path="results" element={<TeacherLearningOverview />} />
            <Route path="keywords" element={<TeacherKeywordSettings />} />
            <Route path="levels" element={<TeacherLevelSettings />} /> */}
          </Route>
        </Routes>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </>
    </Router>
  );
}

export default App;