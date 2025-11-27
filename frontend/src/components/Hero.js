import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const Hero = ({ onGetStarted }) => {
  const { colors } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStartClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onGetStarted();
    }, 800);
  };

  return (
    <>
      <div style={{
        minHeight: '100vh',
        paddingTop: '80px',
        display: 'flex',
        alignItems: 'center',
        padding: '80px 60px 60px'
      }}>
        
        {/* Left Side - Vertical Layout */}
        <motion.div 
          style={{
            flex: '0 0 500px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}
          animate={{
            x: isTransitioning ? -600 : 0
          }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <h1 
            style={{
              fontSize: 'clamp(48px, 8vw, 80px)',
              fontWeight: 700,
              letterSpacing: '-2px',
              marginBottom: '24px',
              color: colors.text,
              lineHeight: 1.1
            }}
          >
            MediBot AI
          </h1>
          
          <p 
            style={{
              fontSize: '20px',
              color: colors.textSecondary,
              lineHeight: 1.5,
              marginBottom: '40px',
              maxWidth: '450px'
            }}
          >
            Professional medical imaging AI assistant for healthcare diagnostics and clinical decision support
          </p>

          <button
            onClick={handleStartClick}
            style={{
              background: colors.surface,
              border: `2px solid ${colors.border}`,
              borderRadius: '16px',
              padding: '18px 36px',
              color: colors.text,
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(20px)',
              boxShadow: `inset 0 2px 0 ${colors.border}, 0 8px 32px ${colors.shadow}`
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
              <path d="M8 5v14l11-7z"/>
            </svg>
            Start Medical Analysis
          </button>
        </motion.div>

        {/* Right Side - Features Border */}
        <motion.div
          style={{
            flex: 1,
            marginLeft: '60px',
            background: colors.panel,
            border: `2px solid ${colors.border}`,
            borderRadius: '24px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 8px 32px ${colors.shadow}`
          }}
          animate={{
            x: isTransitioning ? 600 : 0,
            y: [0, -2, 0],
            rotateX: [0, 1, 0],
            background: colors.panel
          }}
          transition={{
            x: { duration: 1.2, ease: 'easeInOut' },
            y: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            rotateX: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            background: { duration: 0.3 }
          }}
          whileHover={{
            scale: 1.02,
            y: -5,
            rotateY: 2,
            transition: { duration: 0.3, ease: 'easeOut' }
          }}
        >
          {/* Light accent overlay */}
          <motion.div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '24px'
            }}
            animate={{
              background: colors.overlay
            }}
            transition={{ duration: 0.3 }}
          />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <motion.h2 
              style={{
                fontSize: '28px',
                fontWeight: 600,
                marginBottom: '32px',
                textAlign: 'center'
              }}
              animate={{
                color: colors.text
              }}
              transition={{ duration: 0.3 }}
            >
              Clinical AI Platform
            </motion.h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              marginBottom: '20px'
            }}>
              {/* Diagnostic Imaging */}
              <motion.div
                style={{
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  boxShadow: `0 4px 16px ${colors.shadow}`
                }}
                animate={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`
                }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  rotateZ: 2,
                  background: colors.surfaceHover,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  style={{
                    fontSize: '32px',
                    marginBottom: '12px'
                  }}
                  animate={{
                    color: colors.accent
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                </motion.div>
                <motion.h3 
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    marginBottom: '8px'
                  }}
                  animate={{
                    color: colors.text
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Diagnostic Imaging
                </motion.h3>
                <motion.p 
                  style={{
                    fontSize: '12px',
                    lineHeight: 1.4
                  }}
                  animate={{
                    color: colors.textSecondary
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Advanced AI-powered medical image diagnostics
                </motion.p>
              </motion.div>

              {/* Clinical Reports */}
              <motion.div
                style={{
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  boxShadow: `0 4px 16px ${colors.shadow}`
                }}
                animate={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`
                }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  rotateZ: -2,
                  background: colors.surfaceHover,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  style={{
                    fontSize: '32px',
                    marginBottom: '12px'
                  }}
                  animate={{
                    color: colors.accentDark
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </motion.div>
                <motion.h3 
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    marginBottom: '8px'
                  }}
                  animate={{
                    color: colors.text
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Clinical Reports
                </motion.h3>
                <motion.p 
                  style={{
                    fontSize: '12px',
                    lineHeight: 1.4
                  }}
                  animate={{
                    color: colors.textSecondary
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Comprehensive medical reports and findings
                </motion.p>
              </motion.div>

              {/* AI Consultation */}
              <motion.div
                style={{
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  boxShadow: `0 4px 16px ${colors.shadow}`
                }}
                animate={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`
                }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  rotateZ: 2,
                  background: colors.surfaceHover,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  style={{
                    fontSize: '32px',
                    marginBottom: '12px'
                  }}
                  animate={{
                    color: colors.accent
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </motion.div>
                <motion.h3 
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    marginBottom: '8px'
                  }}
                  animate={{
                    color: colors.text
                  }}
                  transition={{ duration: 0.3 }}
                >
                  AI Consultation
                </motion.h3>
                <motion.p 
                  style={{
                    fontSize: '12px',
                    lineHeight: 1.4
                  }}
                  animate={{
                    color: colors.textSecondary
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Interactive medical AI consultation system
                </motion.p>
              </motion.div>

              {/* HIPAA Compliant */}
              <motion.div
                style={{
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  boxShadow: `0 4px 16px ${colors.shadow}`
                }}
                animate={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`
                }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  rotateZ: -2,
                  background: colors.surfaceHover,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  style={{
                    fontSize: '32px',
                    marginBottom: '12px'
                  }}
                  animate={{
                    color: colors.accentDark
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C14.8,12.6 14.4,13.5 13.5,14C13.3,14.2 13.2,14.4 13.2,14.7V16H10.8V14.7C10.8,14.4 10.7,14.2 10.5,14C9.6,13.5 9.2,12.6 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2A1.8,1.8 0 0,0 10.2,10V11.5A1.8,1.8 0 0,0 12,13.3A1.8,1.8 0 0,0 13.8,11.5V10A1.8,1.8 0 0,0 12,8.2Z"/>
                  </svg>
                </motion.div>
                <motion.h3 
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    marginBottom: '8px'
                  }}
                  animate={{
                    color: colors.text
                  }}
                  transition={{ duration: 0.3 }}
                >
                  HIPAA Compliant
                </motion.h3>
                <motion.p 
                  style={{
                    fontSize: '12px',
                    lineHeight: 1.4
                  }}
                  animate={{
                    color: colors.textSecondary
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Secure medical data processing and privacy protection
                </motion.p>
              </motion.div>
            </div>

            {/* Tech Stack Info */}
            <motion.div 
              style={{
                borderRadius: '12px',
                padding: '16px'
              }}
              animate={{
                background: colors.surface,
                border: `1px solid ${colors.borderLight}`
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.h4 
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '8px'
                }}
                animate={{
                  color: colors.text
                }}
                transition={{ duration: 0.3 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                Medical Technology
              </motion.h4>
              <motion.p 
                style={{
                  fontSize: '11px',
                  lineHeight: 1.4
                }}
                animate={{
                  color: colors.textSecondary
                }}
                transition={{ duration: 0.3 }}
              >
                FDA-compliant AI algorithms, YOLO anatomical detection, medical-grade image processing, 
                and secure HIPAA-compliant data handling. Supports all major medical imaging formats.
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Hero;