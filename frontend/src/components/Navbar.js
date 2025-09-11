import React from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '16px 40px',
        background: 'linear-gradient(135deg, rgba(22, 33, 62, 0.6), rgba(15, 52, 96, 0.4))',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(100, 150, 255, 0.3)'
      }}
      initial={{ opacity: 0, y: -50 }}
      animate={{ 
        opacity: 1, 
        y: 0 
      }}
      transition={{ 
        duration: 2, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: 'spring',
        stiffness: 60
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Logo */}
        <motion.div
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          whileHover={{ scale: 1.05 }}
        >
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            {/* Aura Effect */}
            <circle cx="16" cy="16" r="14" fill="url(#aura)" opacity="0.3"/>
            <circle cx="16" cy="16" r="10" fill="url(#aura2)" opacity="0.5"/>
            {/* Main Eye Shape */}
            <ellipse cx="16" cy="16" rx="12" ry="8" fill="url(#eyeGrad)" stroke="#6496ff" strokeWidth="2"/>
            {/* Inner Eye */}
            <ellipse cx="16" cy="16" rx="8" ry="5" fill="rgba(100,150,255,0.4)"/>
            {/* Pupil */}
            <circle cx="16" cy="16" r="3" fill="#6496ff"/>
            <circle cx="16" cy="16" r="1.5" fill="#ffffff" opacity="0.8"/>
            {/* Vision Beams */}
            <path d="M4 16L12 16M20 16L28 16M16 4L16 12M16 20L16 28" stroke="#6496ff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round"/>
            <defs>
              <radialGradient id="aura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(100,150,255,0.1)"/>
                <stop offset="100%" stopColor="transparent"/>
              </radialGradient>
              <radialGradient id="aura2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(100,150,255,0.2)"/>
                <stop offset="100%" stopColor="transparent"/>
              </radialGradient>
              <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(100,150,255,0.3)"/>
                <stop offset="100%" stopColor="rgba(22,33,62,0.6)"/>
              </linearGradient>
            </defs>
          </svg>
          VisionBot
        </motion.div>

        {/* Tech Stack Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px'
        }}>
          <motion.a
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            whileHover={{ 
              color: '#ffffff',
              scale: 1.05
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
              <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.36-.034-.47 0-.92.014-1.36.034.44-.572.895-1.096 1.36-1.564zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.36.034.47 0 .92-.014 1.36-.034-.44.572-.895 1.095-1.36 1.56-.465-.467-.92-.992-1.36-1.56z"/>
            </svg>
            React
          </motion.a>

          <motion.a
            href="https://flask.palletsprojects.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            whileHover={{ 
              color: '#ffffff',
              scale: 1.05
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            Flask
          </motion.a>

          <motion.div
            style={{
              padding: '6px 12px',
              background: 'linear-gradient(135deg, rgba(100, 150, 255, 0.2), rgba(22, 33, 62, 0.3))',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(100, 150, 255, 0.4)'
            }}
            whileHover={{ 
              background: 'linear-gradient(135deg, rgba(100, 150, 255, 0.3), rgba(22, 33, 62, 0.4))',
              scale: 1.05
            }}
          >
            v1.0
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;