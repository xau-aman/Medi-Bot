import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const MedicalSuggestions = ({ onSuggestionClick }) => {
  const { colors } = useTheme();
  
  const suggestions = [
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>,
      text: 'Analyze chest X-ray for pulmonary pathology',
      category: 'Pulmonology'
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>,
      text: 'Evaluate brain MRI for neurological findings',
      category: 'Neurology'
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
      text: 'Assess bone fractures and joint abnormalities',
      category: 'Orthopedics'
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/></svg>,
      text: 'Review cardiac imaging for structural defects',
      category: 'Cardiology'
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>,
      text: 'Examine abdominal CT for organ pathology',
      category: 'Radiology'
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/></svg>,
      text: 'What are the normal anatomical landmarks?',
      category: 'Medical Education'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '12px',
      marginTop: '16px'
    }}>
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={index}
          onClick={() => onSuggestionClick(suggestion.text)}
          style={{
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'left',
            cursor: 'pointer',
            fontSize: '14px',
            backdropFilter: 'blur(10px)'
          }}
          animate={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            color: colors.text,
            opacity: 1,
            y: 0
          }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{
            scale: 1.02,
            background: colors.surfaceHover,
            border: `1px solid ${colors.borderHover || colors.border}`
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <motion.div 
              style={{ fontSize: '24px' }}
              animate={{ color: colors.accent }}
              transition={{ duration: 0.3 }}
            >
              {suggestion.icon}
            </motion.div>
            <div>
              <motion.div 
                style={{ fontWeight: 600, marginBottom: '4px' }}
                animate={{ color: colors.text }}
                transition={{ duration: 0.3 }}
              >
                {suggestion.text}
              </motion.div>
              <motion.div 
                style={{
                  fontSize: '12px',
                  fontWeight: 500
                }}
                animate={{ color: colors.textSecondary }}
                transition={{ duration: 0.3 }}
              >
                {suggestion.category}
              </motion.div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default MedicalSuggestions;