// src/layouts/TeacherDashboardLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';

import TeacherHeader from '@/pages/teacher/header/TeacherHeader';

const TeacherDashboardLayout = () => {
  return (
    <div>
      {/* teacher header component */}
      <TeacherHeader />

      <main>
        <Outlet />
      </main>

    </div>
  );
};

export default TeacherDashboardLayout;