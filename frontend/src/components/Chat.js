import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MedicalSuggestions from './MedicalSuggestions';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Chat = ({ imageData, detections, onChatQuery, onImageUpload, isLoading: uploadLoading, onBack }) => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello! I'm MediBot AI, your professional medical imaging assistant.

CAPABILITIES:
• Medical image analysis (X-rays, MRI, CT, ultrasound)
• Anatomical structure identification
• Pathological finding assessment
• Clinical consultation support
• Medical education assistance

SPECIALTIES:
• Radiology • Cardiology • Neurology
• Orthopedics • Pulmonology • Pathology

MEDICAL DISCLAIMER:
• Educational and clinical support purposes only
• All findings require professional medical verification
• Not intended for diagnostic or treatment decisions
• Always consult qualified healthcare professionals`,
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

  // Format AI responses into clean medical sections
  const formatAIResponse = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {lines.map((line, index) => {
          const trimmedLine = line.trim();
          
          // Format headers
          if (trimmedLine.includes('IMAGING MODALITY:') || trimmedLine.includes('ANATOMICAL STRUCTURES:') || trimmedLine.includes('RADIOLOGICAL FINDINGS:') || trimmedLine.includes('CLINICAL IMPRESSION:') || trimmedLine.includes('MEDICAL DISCLAIMER:') || trimmedLine.includes('CAPABILITIES:') || trimmedLine.includes('SPECIALTIES:')) {
            return (
              <div key={index} style={{
                fontSize: '13px',
                fontWeight: 600,
                color: colors.accent,
                marginTop: index > 0 ? '8px' : '0',
                marginBottom: '4px'
              }}>
                {trimmedLine}
              </div>
            );
          }
          
          // Format bullet points
          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
            return (
              <div key={index} style={{
                fontSize: '13px',
                color: colors.text,
                paddingLeft: '12px',
                marginBottom: '2px'
              }}>
                {trimmedLine}
              </div>
            );
          }
          
          // Regular text
          if (trimmedLine) {
            return (
              <div key={index} style={{
                fontSize: '13px',
                color: colors.text,
                marginBottom: '4px'
              }}>
                {trimmedLine}
              </div>
            );
          }
          
          return null;
        })}
      </div>
    );
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (uploadLoading) {
      setAnalysisProgress(0);
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return Math.min(prev + 2, 100);
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setTimeout(() => {
        setAnalysisProgress(0);
      }, 500);
    }
  }, [uploadLoading]);

  useEffect(() => {
    if (imageData && !uploadLoading && window.lastAnalysis) {
      const analysisMessage = {
        id: Date.now(),
        type: 'bot',
        content: window.lastAnalysis,
        timestamp: new Date()
      };
      
      setMessages(prev => {
        const hasAnalysisMessage = prev.some(msg => 
          msg.content === window.lastAnalysis
        );
        
        if (!hasAnalysisMessage) {
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
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (error) {
      setIsTyping(false);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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
      onImageUpload(file);
      e.target.value = '';
    }
  };

  return (
    <div style={{
      height: '100vh',
      background: colors.background,
      position: 'relative'
    }}>
      {/* Header with Back Button and Theme Toggle */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        background: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        backdropFilter: 'blur(20px)'
      }}>
        <motion.button
          onClick={onBack}
          style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '8px 16px',
            color: colors.text,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(10px)'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back
        </motion.button>
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div style={{
        paddingTop: '80px',
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '20px',
        padding: '80px 20px 20px'
      }}>
        
        {/* Left Panel */}
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
          {/* Image Upload Section - Redesigned */}
          <div style={{
            background: colors.panel,
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: colors.text,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={colors.accent}>
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              Medical Image
            </h3>
            
            {uploadLoading ? (
              <div style={{
                width: '100%',
                height: '200px',
                background: colors.surface,
                borderRadius: '12px',
                border: `2px solid ${colors.border}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.text,
                fontSize: '14px'
              }}>
                <motion.div 
                  style={{
                    marginBottom: '16px',
                    color: colors.accent
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ rotate: { duration: 2, repeat: Infinity, ease: 'linear' } }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                  </svg>
                </motion.div>
                
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  marginBottom: '12px',
                  color: colors.text
                }}>Analyzing Medical Image</h4>
                
                <div style={{
                  width: '80%',
                  height: '6px',
                  background: colors.surface,
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginBottom: '8px'
                }}>
                  <motion.div
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentDark})`,
                      borderRadius: '3px'
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${analysisProgress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
                
                <p style={{
                  color: colors.textSecondary,
                  fontSize: '12px',
                  margin: 0
                }}>{Math.round(analysisProgress)}% complete</p>
              </div>
            ) : imageData ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={`data:image/jpeg;base64,${imageData}`}
                  alt="Medical scan"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'contain',
                    borderRadius: '12px',
                    border: `1px solid ${colors.border}`,
                    background: colors.surface
                  }}
                />
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    padding: '4px 8px',
                    color: colors.text,
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Replace
                </motion.button>
              </div>
            ) : (
              <motion.div 
                style={{
                  width: '100%',
                  height: '200px',
                  background: colors.surface,
                  borderRadius: '12px',
                  border: `2px dashed ${colors.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.textMuted,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => fileInputRef.current?.click()}
                whileHover={{
                  background: colors.surfaceHover,
                  borderColor: colors.accent,
                  scale: 1.02
                }}
                whileTap={{ scale: 0.98 }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill={colors.accent} style={{ marginBottom: '12px' }}>
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                <div style={{ fontWeight: 600, marginBottom: '4px', color: colors.text }}>
                  Upload Medical Image
                </div>
                <div style={{ fontSize: '12px', textAlign: 'center', lineHeight: 1.4 }}>
                  X-ray, MRI, CT scan, Ultrasound<br/>
                  PNG, JPG, DICOM supported
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Analysis Panel */}
          <div style={{
            background: colors.panel,
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            padding: '16px',
            position: 'relative',
            overflow: 'hidden',
            flex: 1
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '12px',
              color: colors.text,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={colors.accent}>
                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
              </svg>
              Anatomical Structures
            </h3>
            
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
                  color: colors.textMuted,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }}>
                  {imageData ? 'No anatomical structures detected' : 'Upload medical image to see analysis'}
                </div>
              ) : (
                detections.map((detection, index) => (
                  <motion.div
                    key={index}
                    style={{
                      background: colors.surface,
                      borderRadius: '8px',
                      padding: '12px',
                      border: `1px solid ${colors.border}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
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
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      color: colors.text
                    }}>{detection.class}</span>
                    <span style={{
                      fontSize: '12px',
                      background: colors.accent,
                      color: '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: 600
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
            background: colors.panel,
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: `1px solid ${colors.border}`,
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
          {/* Chat Header */}
          <div style={{
            padding: '24px',
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <rect x="14" y="8" width="4" height="16" fill={colors.accent} rx="2"/>
                <rect x="8" y="14" width="16" height="4" fill={colors.accent} rx="2"/>
                <circle cx="16" cy="16" r="3" fill={colors.accent} opacity="0.8"/>
                <circle cx="16" cy="16" r="1.5" fill={colors.text} opacity="0.9"/>
              </svg>
            </div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: colors.text,
                marginBottom: '4px'
              }}>MediBot AI</h3>
              <p style={{
                fontSize: '14px',
                color: colors.textSecondary
              }}>Medical Image Analysis Platform</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
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
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: message.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: message.type === 'user' 
                      ? `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})` 
                      : colors.surface,
                    color: message.type === 'user' ? '#ffffff' : colors.text,
                    fontSize: '14px',
                    lineHeight: '1.4',
                    wordWrap: 'break-word',
                    border: `1px solid ${colors.border}`,
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 8px 32px ${colors.shadow}`
                  }}>
                    {message.type === 'bot' ? formatAIResponse(message.content) : message.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Animation */}
            {isTyping && (
              <motion.div
                style={{ display: 'flex', justifyContent: 'flex-start' }}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
              >
                <div style={{
                  padding: '16px 20px',
                  borderRadius: '20px 20px 20px 6px',
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: colors.textSecondary,
                          animation: `typing 1.4s ease-in-out infinite ${i * 0.2}s`
                        }}
                      />
                    ))}
                  </div>
                  <span style={{
                    color: colors.textSecondary,
                    fontSize: '14px'
                  }}>AI is thinking...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
            
            {/* Medical Suggestions */}
            {messages.length <= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div style={{
                  marginBottom: '20px',
                  padding: '16px',
                  background: colors.surface,
                  borderRadius: '12px',
                  border: `1px solid ${colors.border}`
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: colors.text,
                    marginBottom: '12px'
                  }}>Medical Specialties</h4>
                  <MedicalSuggestions onSuggestionClick={(suggestion) => {
                    setInputValue(suggestion);
                    inputRef.current?.focus();
                  }} />
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div style={{
            padding: '20px',
            borderTop: `1px solid ${colors.border}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: colors.input,
              borderRadius: '16px',
              padding: '12px 16px',
              border: `1px solid ${colors.inputBorder}`,
              backdropFilter: 'blur(10px)'
            }}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask medical questions or upload medical images..."
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: colors.text,
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
                  background: inputValue.trim() ? colors.accent : colors.surface,
                  border: `1px solid ${colors.border}`,
                  color: inputValue.trim() ? '#ffffff' : colors.text,
                  cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  backdropFilter: 'blur(10px)'
                }}
                whileHover={inputValue.trim() ? { scale: 1.05 } : {}}
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

        <style>{`
          @keyframes typing {
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
    </div>
  );
};

export default Chat;