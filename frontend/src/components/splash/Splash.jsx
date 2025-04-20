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
        duration: 2.0,
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
              fontSize: '4.5rem',
              marginLeft: '3px',
              marginRight: '3px',
              fontWeight: '700',
              fontFamily: `'charm', sans-serif`,
              background: `linear-gradient(135deg, #0f1d35, #3e7ca6, #8aaec5)`,
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
              fontSize: '2.2rem',
              fontWeight: '400',
              fontFamily: `'charm', sans-serif`,
              background: `linear-gradient(135deg,rgb(65, 137, 185), #8aaec5,rgb(183, 211, 233))`,
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
