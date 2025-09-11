import React, { useEffect, useRef } from 'react';

const SpaceBackground = ({ currentView }) => {
  const canvasRef = useRef(null);
  const animationStateRef = useRef({ targetSpeed: 0, currentSpeed: 0 });

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

    // Static stars
    const stars = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        originalX: 0,
        originalY: 0,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * 0.02 + 0.01,
        trail: []
      });
    }

    // Store original positions
    stars.forEach(star => {
      star.originalX = star.x;
      star.originalY = star.y;
    });

    // Spacecraft
    const spacecraft = [];
    for (let i = 0; i < 3; i++) {
      spacecraft.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 1,
        size: Math.random() * 8 + 4,
        opacity: Math.random() * 0.6 + 0.4,
        blinkTimer: Math.random() * 100
      });
    }

    // Complex star speed animation when transitioning to chat
    if (currentView === 'chat' && animationStateRef.current.targetSpeed === 0) {
      // Initial burst for 1 second
      animationStateRef.current.targetSpeed = 3;
      setTimeout(() => {
        // Slow down for 2 seconds
        animationStateRef.current.targetSpeed = 0.2;
        setTimeout(() => {
          // Gradually increase to normal speed
          animationStateRef.current.targetSpeed = 1;
        }, 2000);
      }, 1000);
    } else if (currentView === 'hero') {
      animationStateRef.current.targetSpeed = 0;
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep space galaxy gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a0f');
      gradient.addColorStop(0.2, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(0.8, '#0f3460');
      gradient.addColorStop(1, '#0a0a0f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dynamic speed transition based on current speed
      const state = animationStateRef.current;
      const speedDiff = state.targetSpeed - state.currentSpeed;
      
      // Faster interpolation during burst, slower during gradual increase
      let interpolationRate = 0.002;
      if (state.targetSpeed > 2) {
        interpolationRate = 0.05; // Fast burst
      } else if (state.targetSpeed < 0.5) {
        interpolationRate = 0.01; // Quick slowdown
      }
      
      state.currentSpeed += speedDiff * interpolationRate;

      // Draw stars
      stars.forEach(star => {
        // Always move rightward, speed increases gradually
        const baseSpeed = 0.15;
        const acceleratedSpeed = baseSpeed + (state.currentSpeed * 2);
        
        // Move star rightward with increasing speed
        star.x += acceleratedSpeed;
        
        // Add gentle vertical drift
        star.y += Math.sin(Date.now() * 0.0001 + star.originalX * 0.01) * 0.01;
        
        // Add to trail when moving fast enough
        if (state.currentSpeed > 0.1) {
          star.trail.push({ x: star.x, y: star.y });
          
          // Limit trail length based on speed
          const maxTrailLength = Math.min(15, Math.floor(state.currentSpeed * 20));
          if (star.trail.length > maxTrailLength) {
            star.trail.shift();
          }
        } else {
          star.trail = [];
        }
        
        // Twinkling effect
        star.opacity += Math.sin(Date.now() * star.twinkle) * 0.01;
        star.opacity = Math.max(0.2, Math.min(1, star.opacity));
        
        // Reset when off right edge
        if (star.x > canvas.width + 50) {
          star.x = -50;
          star.y = Math.random() * canvas.height;
          star.trail = [];
        }
        
        // Draw trail when present
        if (star.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(star.trail[0].x, star.trail[0].y);
          for (let i = 1; i < star.trail.length; i++) {
            ctx.lineTo(star.trail[i].x, star.trail[i].y);
          }
          const trailOpacity = star.opacity * state.currentSpeed * 0.4;
          ctx.strokeStyle = `rgba(255, 255, 255, ${trailOpacity})`;
          ctx.lineWidth = star.radius * 0.8;
          ctx.stroke();
        }
        
        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      // Draw spacecraft
      spacecraft.forEach(ship => {
        // Move spacecraft slower
        ship.x += ship.speedX * (state.currentSpeed * 0.3 + 0.3);
        ship.y += ship.speedY * (state.currentSpeed * 0.3 + 0.3);
        
        // Wrap around screen
        if (ship.x > canvas.width + 20) ship.x = -20;
        if (ship.x < -20) ship.x = canvas.width + 20;
        if (ship.y > canvas.height + 20) ship.y = -20;
        if (ship.y < -20) ship.y = canvas.height + 20;
        
        // Blinking lights
        ship.blinkTimer += 0.5;
        const blinkOpacity = Math.sin(ship.blinkTimer * 0.05) * 0.3 + 0.7;
        
        // Draw spacecraft with realistic design
        ctx.save();
        
        // Main body (elongated diamond shape)
        ctx.fillStyle = `rgba(180, 180, 220, ${ship.opacity})`;
        ctx.beginPath();
        ctx.moveTo(ship.x - ship.size, ship.y);
        ctx.lineTo(ship.x - ship.size/3, ship.y - 3);
        ctx.lineTo(ship.x + ship.size/2, ship.y);
        ctx.lineTo(ship.x - ship.size/3, ship.y + 3);
        ctx.closePath();
        ctx.fill();
        
        // Cockpit
        ctx.fillStyle = `rgba(100, 150, 255, ${ship.opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(ship.x - ship.size/2, ship.y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Engine glow
        ctx.fillStyle = `rgba(0, 150, 255, ${blinkOpacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(ship.x + ship.size/2, ship.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Navigation lights
        ctx.fillStyle = `rgba(255, 100, 100, ${blinkOpacity})`;
        ctx.fillRect(ship.x - ship.size/3, ship.y - 3, 1, 1);
        ctx.fillStyle = `rgba(100, 255, 100, ${Math.sin(ship.blinkTimer * 0.15) * 0.5 + 0.5})`;
        ctx.fillRect(ship.x - ship.size/3, ship.y + 2, 1, 1);
        
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentView]);

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