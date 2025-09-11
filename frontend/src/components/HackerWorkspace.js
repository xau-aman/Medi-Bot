import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HackerWorkspace = ({ isVisible, onClose }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [terminalText, setTerminalText] = useState('');
  const [imageData, setImageData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const introSequence = [
    'INITIALIZING FORENSIC ANALYSIS MODULE...',
    'LOADING METADATA EXTRACTION PROTOCOLS...',
    'ESTABLISHING SECURE CONNECTION...',
    'BYPASSING IMAGE SECURITY LAYERS...',
    'ACCESS GRANTED - WELCOME TO VISION FORENSICS',
    '',
    'Welcome back X-NINJA!'
  ];

  useEffect(() => {
    if (isVisible && showIntro) {
      let currentLine = 0;
      let currentChar = 0;
      
      const typeWriter = () => {
        if (currentLine < introSequence.length) {
          if (introSequence[currentLine] === '') {
            setTerminalText(prev => prev + '\n');
            currentLine++;
            setTimeout(typeWriter, 500);
            return;
          }
          
          if (currentChar < introSequence[currentLine].length) {
            setTerminalText(prev => prev + introSequence[currentLine][currentChar]);
            currentChar++;
            setTimeout(typeWriter, currentLine === introSequence.length - 1 ? 80 : 50);
          } else {
            setTerminalText(prev => prev + '\n');
            currentLine++;
            currentChar = 0;
            setTimeout(typeWriter, currentLine === introSequence.length - 1 ? 800 : 300);
          }
        } else {
          setTimeout(() => setShowIntro(false), 1500);
        }
      };
      
      setTerminalText('');
      setTimeout(typeWriter, 500);
    }
  }, [isVisible, showIntro, introSequence]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setImageData(data.image_data);
        setMetadata(data.metadata);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a1a0a 100%)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Matrix-style background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 0, 100, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(0, 100, 255, 0.1) 0%, transparent 50%)
          `,
          opacity: 0.3
        }} />

        {/* Header */}
        <motion.div
          style={{
            padding: '20px',
            borderBottom: '2px solid #00ff00',
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div style={{
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#00ff00',
            fontWeight: 'bold',
            textShadow: '0 0 10px #00ff00'
          }}>
            {'>>>'} {'>>> VISION_FORENSICS.EXE'}
          </div>
          
          <motion.button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '2px solid #ff0040',
              color: '#ff0040',
              padding: '8px 16px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              fontSize: '14px',
              textShadow: '0 0 5px #ff0040'
            }}
            whileHover={{ 
              background: 'rgba(255, 0, 64, 0.1)',
              boxShadow: '0 0 20px #ff0040'
            }}
          >
            [ESC]
          </motion.button>
        </motion.div>

        {/* Intro Animation */}
        {showIntro && (
          <motion.div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div style={{
              background: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #00ff00',
              borderRadius: '10px',
              padding: '40px',
              maxWidth: '600px',
              boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)'
            }}>
              <pre style={{
                fontFamily: 'monospace',
                fontSize: '16px',
                color: terminalText.includes('Welcome back X-NINJA!') ? '#ff0040' : '#00ff00',
                lineHeight: '1.6',
                margin: 0,
                textShadow: terminalText.includes('Welcome back X-NINJA!') ? '0 0 10px #ff0040' : '0 0 5px #00ff00'
              }}>
                {terminalText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ color: '#00ff00' }}
                >
                  █
                </motion.span>
              </pre>
            </div>
          </motion.div>
        )}

        {/* Main Workspace */}
        {!showIntro && (
          <motion.div
            style={{
              flex: 1,
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Left Panel - Upload Area */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              border: '2px solid #00ff00',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)'
            }}>
              <h3 style={{
                fontFamily: 'monospace',
                color: '#00ff00',
                fontSize: '18px',
                marginBottom: '20px',
                textShadow: '0 0 5px #00ff00'
              }}>
                {'>>>'} {'>>> TARGET_IMAGE.UPLOAD'}
              </h3>
              
              {!imageData ? (
                <div 
                  style={{
                    border: '2px dashed #00ff00',
                    borderRadius: '8px',
                    padding: '40px',
                    textAlign: 'center',
                    background: 'rgba(0, 255, 0, 0.05)',
                    cursor: 'pointer'
                  }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById('hackerFileInput').click()}
                >
                  <div style={{
                    fontFamily: 'monospace',
                    color: '#00ff00',
                    fontSize: '14px'
                  }}>
                    {isAnalyzing ? 'ANALYZING TARGET...' : 'DROP IMAGE FOR FORENSIC ANALYSIS'}
                  </div>
                </div>
              ) : (
                <div style={{
                  border: '2px solid #00ff00',
                  borderRadius: '8px',
                  padding: '10px',
                  background: 'rgba(0, 255, 0, 0.05)'
                }}>
                  <img 
                    src={`data:image/jpeg;base64,${imageData}`}
                    alt="Target"
                    style={{
                      width: '100%',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{
                    fontFamily: 'monospace',
                    color: '#00ff00',
                    fontSize: '12px',
                    textAlign: 'center',
                    marginTop: '10px'
                  }}>
                    TARGET ACQUIRED - ANALYSIS COMPLETE
                  </div>
                </div>
              )}
              
              <input
                id="hackerFileInput"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </div>

            {/* Right Panel - Metadata Display */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              border: '2px solid #ff0040',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 0 20px rgba(255, 0, 64, 0.2)'
            }}>
              <h3 style={{
                fontFamily: 'monospace',
                color: '#ff0040',
                fontSize: '18px',
                marginBottom: '20px',
                textShadow: '0 0 5px #ff0040'
              }}>
                {'>>>'} {'>>> METADATA_EXTRACTION.LOG'}
              </h3>
              
              <div style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#00ff00',
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '15px',
                borderRadius: '5px',
                height: '300px',
                overflowY: 'auto'
              }}>
                <div>AWAITING TARGET IMAGE...</div>
                <div>FORENSIC PROTOCOLS READY</div>
                <div>METADATA SCANNERS ONLINE</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Glitch Effects */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(0, 255, 0, 0.03) 50%, transparent 100%)',
            pointerEvents: 'none'
          }}
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default HackerWorkspace;