// src/components/splash/Splash.jsx

import React from 'react';
import { motion } from 'framer-motion';

import logoImage from '@/assets/logo-image.png';

import '@fontsource/charm/400.css';
import '@fontsource/charm/700.css';

const Splash = () => {

  // animation
  const parentVariant = {
    animate: {
      transition: {
        staggerChildren: 0.05,
        repeat: Infinity,
        repeatDelay: 0.3,
      },
    },
  };

  const letterVariant = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 3.0,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 1.2,
      },
    },
  };

  return (
    <motion.div
      className="splash"
      initial="initial"
      animate="animate"
      variants={parentVariant}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >

      <motion.div variants={parentVariant}>
        <motion.img
          src={logoImage}
          alt="Splash Logo"
          variants={letterVariant}
          style={{
            width: '400px',
            height: 'auto',
            marginBottom: '2rem',
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Splash;