// src/components/splash/Splash.jsx

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

import logoImage from '@/assets/logo-image-without-bg.png';

import '@fontsource/charm/400.css';
import '@fontsource/charm/700.css';

const Splash = () => {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {

      // slide in animation
      await controls.start({
        width: '500px',
        opacity: 1,
        transition: {
          duration: 2.0,
          ease: 'easeInOut',
        },
      });

      // vertical bounce animation
      controls.start({
        y: [0, -20, 0, 0, 0],
        transition: {
          duration: 1.5,
          ease: 'easeInOut',
          repeat: Infinity,
        },
      });
    };

    sequence();
  }, [controls]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={controls}
        style={{
          overflow: 'hidden',
        }}
      >
        <img
          src={logoImage}
          alt="Splash Logo Image"
          style={{
            width: '500px',
            height: 'auto',
            display: 'block',
            cursor: 'pointer',
          }}
        />
      </motion.div>
    </div>
  );
};

export default Splash;