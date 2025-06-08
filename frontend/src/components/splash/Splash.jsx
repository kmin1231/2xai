// src/components/splash/Splash.jsx

import React from 'react';
import { motion } from 'framer-motion';

import '@fontsource/charm/400.css';
import '@fontsource/charm/700.css';

const Splash = () => {
  const textA = '2xAI   Research   Lab';
  const textB = 'eXplainable  &  eXchangeable  AI';

  const splitTextA = textA.split('').map((char, index) => ({
    char,
    color: index % 3,
  }));

  const splitTextB = textB.split('').map((char, index) => ({
    char,
    color: index % 3,
  }));

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
      {/* animiation #1: 2xAI Research Lab */}
      <motion.div
        style={{ display: 'flex', marginBottom: '1rem' }}
        variants={parentVariant}
      >
        {splitTextA.map((item, index) => (
          <motion.span
            key={`a-${index}`}
            variants={letterVariant}
            style={{
              display: 'inline-block',
              fontSize: '5.0rem',
              marginLeft: '3px',
              marginRight: '3px',
              fontWeight: '700',
              fontFamily: `'Noto Sans', sans-serif`,
              background: `linear-gradient(135deg,rgb(20, 39, 71),rgb(74, 138, 180), #8aaec5)`,
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {item.char}
          </motion.span>
        ))}
      </motion.div>

      {/* animiation #2: eXplainable & eXchangeable AI */}
      <motion.div style={{ display: 'flex' }} variants={parentVariant}>
        {splitTextB.map((item, index) => (
          <motion.span
            key={`b-${index}`}
            variants={letterVariant}
            style={{
              display: 'inline-block',
              marginLeft: '2px',
              marginRight: '2px',
              fontSize: '2.5rem',
              fontWeight: '400',
              fontFamily: `'Noto sans', sans-serif`,
              background: `linear-gradient(135deg,rgb(65, 137, 185),rgb(124, 160, 182),rgb(168, 196, 219))`,
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {item.char}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Splash;
