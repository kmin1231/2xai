// src/components/splash/Splash.jsx

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

import logoImage from '@/assets/logo-image-without-bg.png';

import '@fontsource/charm/400.css';
import '@fontsource/charm/700.css';

const Splash = () => {
  const controls = useAnimation();
  const [showButton, setShowButton] = useState(false);

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

      // START button
      setShowButton(true);

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
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
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
            width: '480px',
            height: 'auto',
            display: 'block',
            cursor: 'pointer',
          }}
        />
      </motion.div>

      {showButton && (
        <div
          style={{ position: 'absolute', bottom: '23%', textAlign: 'center' }}
        >
          <button
            style={{
              padding: '10px 15px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              backgroundColor: '#ff0000',
              color: 'white',
              borderRadius: '30px',
              cursor: 'pointer',
              width: '180px',
              height: '60px',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#f78181')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#ff0000')}
          >
            START ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default Splash;