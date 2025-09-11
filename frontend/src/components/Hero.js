import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Hero = ({ onGetStarted }) => {
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
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1
            }}
          >
            VisionBot
          </h1>
          
          <p 
            style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: 1.5,
              marginBottom: '40px',
              maxWidth: '450px'
            }}
          >
            Advanced AI-powered image analysis with YOLO object detection and intelligent conversation capabilities
          </p>

          <button
            onClick={handleStartClick}
            style={{
              background: 'linear-gradient(135deg, rgba(100, 150, 255, 0.3), rgba(22, 33, 62, 0.4))',
              border: '2px solid rgba(100, 150, 255, 0.4)',
              borderRadius: '16px',
              padding: '18px 36px',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(20px)',
              boxShadow: 'inset 0 2px 0 rgba(255, 255, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
              <path d="M8 5v14l11-7z"/>
            </svg>
            Start Analysis
          </button>
        </motion.div>

        {/* Right Side - Features Border */}
        <motion.div
          style={{
            flex: 1,
            marginLeft: '60px',
            background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.8), rgba(22, 33, 62, 0.6))',
            border: '2px solid rgba(100, 150, 255, 0.3)',
            borderRadius: '24px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden'
          }}
          animate={{
            x: isTransitioning ? 600 : 0,
            y: [0, -2, 0],
            rotateX: [0, 1, 0]
          }}
          transition={{
            x: { duration: 1.2, ease: 'easeInOut' },
            y: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            rotateX: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
          }}
          whileHover={{
            scale: 1.02,
            y: -5,
            rotateY: 2,
            transition: { duration: 0.3, ease: 'easeOut' }
          }}
        >
          {/* Dark accent overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(15, 52, 96, 0.3))',
            borderRadius: '24px'
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 600,
              marginBottom: '32px',
              color: '#ffffff',
              textAlign: 'center'
            }}>
              Powered by Advanced AI
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              marginBottom: '20px'
            }}>
              {/* Smart Analysis */}
              <motion.div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  rotateZ: 2,
                  background: 'rgba(100, 150, 255, 0.15)',
                  transition: { duration: 0.2 }
                }}
              >
                <div style={{
                  fontSize: '24px',
                  marginBottom: '12px',
                  color: '#6496ff'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  marginBottom: '8px',
                  color: '#ffffff'
                }}>Smart Analysis</h3>
                <p style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.4
                }}>Advanced AI-powered image recognition and analysis</p>
              </motion.div>

              {/* Instant Results */}
              <motion.div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  rotateZ: -2,
                  background: 'rgba(74, 144, 226, 0.15)',
                  transition: { duration: 0.2 }
                }}
              >
                <div style={{
                  fontSize: '24px',
                  marginBottom: '12px',
                  color: '#4a90e2'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  marginBottom: '8px',
                  color: '#ffffff'
                }}>Instant Results</h3>
                <p style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.4
                }}>Get detailed analysis and insights in seconds</p>
              </motion.div>

              {/* Interactive Chat */}
              <motion.div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  rotateZ: 2,
                  background: 'rgba(100, 150, 255, 0.15)',
                  transition: { duration: 0.2 }
                }}
              >
                <div style={{
                  fontSize: '24px',
                  marginBottom: '12px',
                  color: '#6496ff'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  marginBottom: '8px',
                  color: '#ffffff'
                }}>Interactive Chat</h3>
                <p style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.4
                }}>Ask questions and get intelligent responses</p>
              </motion.div>

              {/* Real-time Processing */}
              <motion.div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  rotateZ: -2,
                  background: 'rgba(74, 144, 226, 0.15)',
                  transition: { duration: 0.2 }
                }}
              >
                <div style={{
                  fontSize: '24px',
                  marginBottom: '12px',
                  color: '#4a90e2'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  marginBottom: '8px',
                  color: '#ffffff'
                }}>Real-time Processing</h3>
                <p style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.4
                }}>Live analysis with instant feedback and results</p>
              </motion.div>
            </div>

            {/* Tech Stack Info */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '8px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>Tech Stack</h4>
              <p style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: 1.4
              }}>
                Built with React, Flask, YOLOv8 for object detection, Google Gemini Flash 1.5 for AI conversations, 
                and OpenRouter API for model access. Supports PNG, JPG, GIF formats up to 16MB.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Hero;