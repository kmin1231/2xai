// src/components/loading/LoadingAnimation.jsx

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

import logoImage from '@/assets/logo-image-without-bg.png';
import './loading-animation.css';

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
    <div className="loading-animation-wrapper">
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
          color: 'inherit',
        }}
      >
        맞춤형 학습 자료를 생성 중입니다. <br />
        잠시만 기다려 주세요.
      </p>
    </div>
  );
};

export default LoadingAnimation;