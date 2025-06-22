// src/layouts/AdminDashboardLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';

import AdminHeader from '@/pages/admin/header/AdminHeader';

const AdminDashboardLayout = () => {
  return (
    <div>
      {/* admin header component */}
      <AdminHeader />

      <main>
        <Outlet />
      </main>

    </div>
  );
};

export default AdminDashboardLayout;