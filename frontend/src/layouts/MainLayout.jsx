// src/layouts/MainLayout.jsx

import React from 'react';
import Header from '@/components/header/Header';
import styles from '@/layouts/MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div>
      <Header schoolName="My School" userName="John Doe" />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
