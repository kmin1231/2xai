// src/components/loading/LoadingAnimation.jsx

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

import logoImage from '@/assets/logo-image-without-bg.png';

const LoadingAnimation = () => {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        width: '450px',
        opacity: 1,
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      });

      controls.start({
        y: [0, -20, 0],
        transition: {
          duration: 1.0,
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
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        backgroundColor: 'transparent',
        gap: 0,
      }}
    >
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={controls}
        style={{ overflow: 'hidden', padding: '0px', margin: '0px' }}
      >
        <img
          src={logoImage}
          alt="Loading..."
          style={{
            width: '450px',
            height: 'auto',
            display: 'block',
            padding: '0px',
          }}
        />
      </motion.div>

      <p
        style={{
          marginTop: '0px',
          marginBottom: '0px',
          fontSize: '1.5rem',
          textAlign: 'center',
          lineHeight: '2.0',
        }}
      >
        맞춤형 학습 자료를 생성 중입니다. <br />
        잠시만 기다려 주세요.
      </p>
    </div>
  );
};

export default LoadingAnimation;