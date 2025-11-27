import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SpaceBackground = ({ currentView }) => {
  const canvasRef = useRef(null);
  const { colors, isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Medical symbols floating
    const medicalSymbols = [];
    const symbols = ['+', '×', '○', '△', '□', '◇', '⬟', '⬢', '⬡', '⬠'];
    
    for (let i = 0; i < 15; i++) {
      medicalSymbols.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        size: Math.random() * 20 + 15,
        opacity: Math.random() * 0.3 + 0.1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2
      });
    }

    // Floating particles
    const particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        pulse: Math.random() * 0.02 + 0.01
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Theme-based gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (isDark) {
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.3, '#1a1a1a');
        gradient.addColorStop(0.7, '#0f0f0f');
        gradient.addColorStop(1, '#0a0a0a');
      } else {
        gradient.addColorStop(0, '#f8fffe');
        gradient.addColorStop(0.3, '#f0fff4');
        gradient.addColorStop(0.7, '#e6fffa');
        gradient.addColorStop(1, '#f0fff0');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw floating medical symbols
      medicalSymbols.forEach(symbol => {
        symbol.x += symbol.speedX;
        symbol.y += symbol.speedY;
        symbol.rotation += symbol.rotationSpeed;
        
        // Wrap around screen
        if (symbol.x > canvas.width + 50) symbol.x = -50;
        if (symbol.x < -50) symbol.x = canvas.width + 50;
        if (symbol.y > canvas.height + 50) symbol.y = -50;
        if (symbol.y < -50) symbol.y = canvas.height + 50;
        
        ctx.save();
        ctx.translate(symbol.x, symbol.y);
        ctx.rotate(symbol.rotation * Math.PI / 180);
        ctx.globalAlpha = symbol.opacity;
        ctx.font = `${symbol.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(45, 90, 61, 0.3)';
        ctx.fillText(symbol.symbol, 0, 0);
        ctx.restore();
      });

      // Draw floating particles
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Pulse effect
        particle.opacity += Math.sin(Date.now() * particle.pulse) * 0.01;
        particle.opacity = Math.max(0.1, Math.min(0.5, particle.opacity));
        
        // Wrap around screen
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark 
          ? `rgba(100, 255, 150, ${particle.opacity})` 
          : `rgba(100, 200, 150, ${particle.opacity})`;
        ctx.fill();
      });

      // Add subtle medical cross pattern overlay
      ctx.globalAlpha = 0.03;
      ctx.strokeStyle = isDark ? '#ffffff' : '#00cc66';
      ctx.lineWidth = 1;
      
      // Draw grid of subtle crosses
      for (let x = 0; x < canvas.width; x += 100) {
        for (let y = 0; y < canvas.height; y += 100) {
          // Horizontal line
          ctx.beginPath();
          ctx.moveTo(x - 10, y);
          ctx.lineTo(x + 10, y);
          ctx.stroke();
          
          // Vertical line
          ctx.beginPath();
          ctx.moveTo(x, y - 10);
          ctx.lineTo(x, y + 10);
          ctx.stroke();
        }
      }
      
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark, colors]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default SpaceBackground;