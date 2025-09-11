import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = ({ imageData, detections, onChatQuery, onImageUpload, isLoading: uploadLoading }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `👋 Hello! I'm VisionBot, your AI assistant. I can help with image analysis, answer questions, have conversations, or assist with various tasks. Upload an image for analysis or just ask me anything!`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Format AI responses into clean sections
  const formatAIResponse = (content) => {
    // Check if content has structured sections
    if (content.includes('What I see:') || content.includes('Objects:') || content.includes('Colors:')) {
      const sections = content.split(/\n\s*\n/);
      
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sections.map((section, index) => {
            if (!section.trim()) return null;
            
            const lines = section.split('\n').filter(line => line.trim());
            if (lines.length === 0) return null;
            
            const header = lines[0];
            const items = lines.slice(1);
            
            return (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#6496ff',
                  marginBottom: '8px'
                }}>{header}</div>
                {items.map((item, itemIndex) => (
                  <div key={itemIndex} style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '4px',
                    paddingLeft: '8px'
                  }}>
                    {item.replace(/^[•\-]\s*/, '')}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      );
    }
    
    // Return regular content if no structure found
    return content;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Analysis animation when uploading
  useEffect(() => {
    if (uploadLoading) {
      setAnalysisProgress(0);
      
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          // 5-second animation: increment by 2% every 100ms
          return Math.min(prev + 2, 100);
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      // Hide animation when upload completes
      setTimeout(() => {
        setAnalysisProgress(0);
      }, 500);
    }
  }, [uploadLoading]);

  // Add comprehensive analysis when image is uploaded
  useEffect(() => {
    if (imageData && !uploadLoading && window.lastAnalysis) {
      const analysisMessage = {
        id: Date.now(),
        type: 'bot',
        content: window.lastAnalysis,
        timestamp: new Date()
      };
      
      setMessages(prev => {
        // Check if this analysis already exists to prevent duplicates
        const hasAnalysisMessage = prev.some(msg => 
          msg.content === window.lastAnalysis
        );
        
        if (!hasAnalysisMessage) {
          // Clear the stored analysis to prevent re-adding
          window.lastAnalysis = null;
          return [...prev, analysisMessage];
        }
        return prev;
      });
    }
  }, [imageData, uploadLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await onChatQuery(inputValue);
      
      setIsTyping(false);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Refocus input after response
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (error) {
      setIsTyping(false);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: '⚠️ Sorry, I encountered an error processing your request.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Refocus input after error
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      onImageUpload(file);
      // Reset file input
      e.target.value = '';
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'grid',
      gridTemplateColumns: '350px 1fr',
      gap: '20px',
      padding: '20px'
    }}>
      
      {/* Left Panel - Image Preview & Analysis */}
      <motion.div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
        initial={{ opacity: 0, x: -40, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ 
          duration: 2, 
          ease: [0.25, 0.46, 0.45, 0.94],
          type: 'spring',
          stiffness: 40,
          damping: 25
        }}
      >
        {/* Image Preview */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.8), rgba(22, 33, 62, 0.6))',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(100, 150, 255, 0.3)',
          padding: '16px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
            borderRadius: '20px 20px 0 0'
          }} />
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#ffffff'
            }}>Image Preview</h3>
            
            <motion.button
              onClick={() => {
                console.log('Button clicked');
                fileInputRef.current?.click();
              }}
              disabled={uploadLoading}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: uploadLoading ? 'not-allowed' : 'pointer',
                opacity: uploadLoading ? 0.5 : 1,
                zIndex: 20,
                position: 'relative',
                backdropFilter: 'blur(10px)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
              whileHover={!uploadLoading ? { 
                scale: 1.05,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))'
              } : {}}
              whileTap={!uploadLoading ? { scale: 0.95 } : {}}
            >
              {uploadLoading ? 'Analyzing...' : imageData ? 'Upload Another Image' : 'Upload Image'}
            </motion.button>
          </div>
          
          {uploadLoading ? (
            <div style={{
              width: '100%',
              height: '280px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(100, 150, 255, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '14px'
            }}>
              <motion.div 
                style={{
                  fontSize: '40px',
                  marginBottom: '16px'
                }}
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: 'linear' }
                }}
              >🔍</motion.div>
              
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '16px',
                color: '#ffffff'
              }}>Analyzing Image...</h3>
              
              <div style={{
                width: '80%',
                height: '6px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '12px'
              }}>
                <motion.div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #6496ff, #4a90e2)',
                    borderRadius: '3px'
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${analysisProgress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
              
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '12px',
                margin: 0
              }}>{Math.round(analysisProgress)}% complete</p>
            </div>
          ) : imageData ? (
            <img
              src={`data:image/jpeg;base64,${imageData}`}
              alt="Analyzed"
              style={{
                width: '100%',
                height: '280px',
                objectFit: 'contain',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(0, 0, 0, 0.2)'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '280px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '2px dashed rgba(255, 255, 255, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '14px',
              cursor: 'pointer'
            }} onClick={() => fileInputRef.current?.click()}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📷</div>
              <div>Click to upload an image</div>
              <div style={{ fontSize: '12px', marginTop: '6px' }}>PNG, JPG, GIF up to 16MB</div>
            </div>
          )}


        </div>
        
        {/* Analysis Panel */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.8), rgba(22, 33, 62, 0.6))',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(100, 150, 255, 0.3)',
          padding: '16px',
          position: 'relative',
          overflow: 'hidden',
          flex: 1
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
            borderRadius: '20px 20px 0 0'
          }} />
          
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: '12px',
            color: '#ffffff'
          }}>Detected Objects</h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flex: 1,
            overflowY: detections.length > 4 ? 'auto' : 'visible',
            paddingRight: detections.length > 4 ? '8px' : '0'
          }}>
            {detections.length === 0 ? (
              <div style={{
                padding: '40px 10px',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}>
                {imageData ? 'No objects detected' : 'Upload an image to see analysis'}
              </div>
            ) : (
              detections.map((detection, index) => (
                <motion.div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: '50px'
                  }}
                  initial={{ opacity: 0, x: 30, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.2,
                    duration: 1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: 'spring',
                    stiffness: 50,
                    damping: 20
                  }}
                >
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 500,
                    textTransform: 'capitalize'
                  }}>{detection.class}</span>
                  <span style={{
                    fontSize: '13px',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}>
                    {(detection.confidence * 100).toFixed(1)}%
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Chat Area */}
      <motion.div
        style={{
          background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.8), rgba(22, 33, 62, 0.6))',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(100, 150, 255, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
        initial={{ opacity: 0, x: 40, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ 
          duration: 2, 
          ease: [0.25, 0.46, 0.45, 0.94],
          type: 'spring',
          stiffness: 40,
          damping: 25,
          delay: 0.4
        }}
      >
        {/* Glossy overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
          borderRadius: '20px 20px 0 0'
        }} />
        
        {/* Chat Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(100,150,255,0.3), rgba(22,33,62,0.6))',
            border: '1px solid rgba(100,150,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              {/* Aura Effect */}
              <circle cx="16" cy="16" r="14" fill="url(#chatAura)" opacity="0.4"/>
              <circle cx="16" cy="16" r="10" fill="url(#chatAura2)" opacity="0.6"/>
              {/* Main Eye Shape */}
              <ellipse cx="16" cy="16" rx="12" ry="8" fill="url(#chatEyeGrad)" stroke="#6496ff" strokeWidth="2"/>
              {/* Inner Eye */}
              <ellipse cx="16" cy="16" rx="8" ry="5" fill="rgba(100,150,255,0.5)"/>
              {/* Pupil */}
              <circle cx="16" cy="16" r="3" fill="#6496ff"/>
              <circle cx="16" cy="16" r="1.5" fill="#ffffff" opacity="0.9"/>
              {/* Vision Beams */}
              <path d="M4 16L12 16M20 16L28 16M16 4L16 12M16 20L16 28" stroke="#6496ff" strokeWidth="1.5" opacity="0.7" strokeLinecap="round"/>
              <defs>
                <radialGradient id="chatAura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(100,150,255,0.15)"/>
                  <stop offset="100%" stopColor="transparent"/>
                </radialGradient>
                <radialGradient id="chatAura2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(100,150,255,0.25)"/>
                  <stop offset="100%" stopColor="transparent"/>
                </radialGradient>
                <linearGradient id="chatEyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.3)"/>
                  <stop offset="100%" stopColor="rgba(100,150,255,0.2)"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#ffffff',
              marginBottom: '4px'
            }}>VisionBot AI</h3>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>Ready to analyze your images</p>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                }}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ 
                  duration: 1, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: 'spring',
                  stiffness: 60,
                  damping: 20
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '16px 20px',
                  borderRadius: message.type === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                  background: message.type === 'user' 
                    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '15px',
                  lineHeight: '1.5',
                  wordWrap: 'break-word',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: message.type === 'user' 
                    ? '0 8px 32px rgba(102, 126, 234, 0.3)' 
                    : '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}>
                  {message.type === 'bot' ? formatAIResponse(message.content) : message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Animation */}
          {isTyping && (
            <motion.div
              style={{
                display: 'flex',
                justifyContent: 'flex-start'
              }}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ 
                duration: 1, 
                ease: [0.25, 0.46, 0.45, 0.94],
                type: 'spring',
                stiffness: 60,
                damping: 20
              }}
            >
              <div style={{
                padding: '16px 20px',
                borderRadius: '20px 20px 20px 6px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '4px'
                }}>
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.6)',
                        animation: `typing 1.4s ease-in-out infinite ${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>
                <span style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px'
                }}>AI is thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '12px 16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything or upload an image for analysis..."
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none',
                fontFamily: 'inherit'
              }}

            />
            <motion.button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: inputValue.trim()
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))' 
                  : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                backdropFilter: 'blur(10px)',
                boxShadow: inputValue.trim() 
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 2px 8px rgba(0, 0, 0, 0.3)'
                  : 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
              whileHover={inputValue.trim() ? { 
                scale: 1.05,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.3))'
              } : {}}
              whileTap={inputValue.trim() ? { scale: 0.95 } : {}}
            >
              ➤
            </motion.button>
          </div>
        </div>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />



      {/* CSS Animations */}
      <style>{`
        @keyframes typing {̀
          0%, 60%, 100% { 
            transform: translateY(0); 
            opacity: 0.4; 
          }
          30% { 
            transform: translateY(-10px); 
            opacity: 1; 
          }
        }
      `}</style>
    </div>
  );
};

export default Chat;