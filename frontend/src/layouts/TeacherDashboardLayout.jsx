// src/layouts/TeacherDashboardLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';

const TeacherDashboardLayout = () => {
  return (
    <div>
      {/* teacher header component */}
      <header>
        <h1>Teacher Dashboard</h1>
      </header>

      <main>
        <Outlet />
      </main>

    </div>
  );
};

export default TeacherDashboardLayout;