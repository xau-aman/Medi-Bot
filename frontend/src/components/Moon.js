import React from 'react';
import { motion } from 'framer-motion';

const Moon = ({ isInChat }) => {
  return (
    <motion.div
      style={{
        position: 'fixed',
        width: isInChat ? '600px' : '300px',
        height: isInChat ? '600px' : '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #f5f5f5, #d0d0d0, #a0a0a0)',
        boxShadow: `0 0 ${isInChat ? '100px' : '80px'} rgba(255, 255, 255, 0.3), inset -${isInChat ? '60px' : '40px'} -${isInChat ? '60px' : '40px'} 0 rgba(0, 0, 0, 0.2)`,
        zIndex: 5
      }}
      initial={{
        left: '50%',
        top: '50%',
        x: '-50%',
        y: '-50%'
      }}
      animate={{
        left: '50%',
        top: isInChat ? 'auto' : '50%',
        bottom: isInChat ? '-300px' : 'auto',
        x: '-50%',
        y: isInChat ? '0%' : '-50%'
      }}
      transition={{
        duration: 1.5,
        ease: 'easeInOut'
      }}
    >
      {/* Moon craters */}
      <div style={{
        position: 'absolute',
        width: isInChat ? '40px' : '20px',
        height: isInChat ? '40px' : '20px',
        borderRadius: '50%',
        background: 'rgba(0, 0, 0, 0.1)',
        top: isInChat ? '80px' : '40px',
        left: isInChat ? '150px' : '75px'
      }} />
      <div style={{
        position: 'absolute',
        width: isInChat ? '25px' : '12px',
        height: isInChat ? '25px' : '12px',
        borderRadius: '50%',
        background: 'rgba(0, 0, 0, 0.08)',
        top: isInChat ? '180px' : '90px',
        left: isInChat ? '350px' : '175px'
      }} />
      <div style={{
        position: 'absolute',
        width: isInChat ? '20px' : '10px',
        height: isInChat ? '20px' : '10px',
        borderRadius: '50%',
        background: 'rgba(0, 0, 0, 0.06)',
        top: isInChat ? '120px' : '60px',
        left: isInChat ? '400px' : '200px'
      }} />
      
      {/* Moon glow animation */}
      <motion.div
        style={{
          position: 'absolute',
          top: isInChat ? '-20px' : '-15px',
          left: isInChat ? '-20px' : '-15px',
          right: isInChat ? '-20px' : '-15px',
          bottom: isInChat ? '-20px' : '-15px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  );
};

export default Moon;