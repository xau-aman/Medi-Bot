import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Analysis = ({ imageData, detections, onContinue }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onContinue(), 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onContinue]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 20px 40px',
      textAlign: 'center'
    }}>
      <motion.div 
        style={{
          maxWidth: '600px',
          marginBottom: '40px'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 style={{
          fontSize: '32px',
          fontWeight: 300,
          marginBottom: '20px'
        }}>AI Analysis</h2>
        <p style={{
          color: '#888888',
          marginBottom: '40px'
        }}>Processing your image with advanced neural networks</p>
      </motion.div>

      <motion.div
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '12px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '500px',
          width: '100%'
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div style={{
          fontSize: '60px',
          marginBottom: '20px'
        }}>🔍</div>
        
        <h3 style={{
          fontSize: '20px',
          fontWeight: 500,
          marginBottom: '20px'
        }}>Analyzing Image...</h3>
        
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #ffffff, #888888)',
              borderRadius: '4px'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        
        <p style={{
          color: '#888888',
          fontSize: '14px'
        }}>{progress}% complete</p>
        
        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginTop: '20px' }}
          >
            <p style={{
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 500
            }}>
              ✅ Detected {detections.length} objects!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Analysis;