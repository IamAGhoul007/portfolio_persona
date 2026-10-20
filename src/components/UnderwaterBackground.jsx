import React, { useEffect, useRef } from 'react';

export function UnderwaterBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const isMobile = window.innerWidth < 980;
    const targetFps = isMobile ? 32 : 60;
    const frameInterval = 1000 / targetFps;
    let lastFrameTime = performance.now();

    // Particle / Bubble system
    const bubbles = Array.from({ length: isMobile ? 26 : 45 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 3.2 + 1,
      speedY: Math.random() * 0.75 + 0.3,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.45 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    // Floating Glass Shards (Persona 3 signature)
    const shards = Array.from({ length: isMobile ? 8 : 14 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 22 + 10,
      angle: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      speedY: -(Math.random() * 0.4 + 0.1),
      alpha: Math.random() * 0.35 + 0.15,
    }));

    let time = 0;
    let isPaused = false;

    const onVisibilityChange = () => {
      isPaused = document.visibilityState === 'hidden';
      if (!isPaused) {
        lastFrameTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const render = (now) => {
      if (isPaused) return;

      const delta = now - lastFrameTime;
      if (delta >= frameInterval) {
        lastFrameTime = now - (delta % frameInterval);

        time += 0.015;
        const w = window.innerWidth;
        const h = window.innerHeight;
        ctx.clearRect(0, 0, w, h);

        // 1. Draw animated water caustic light rays from top
        const numRays = isMobile ? 4 : 6;
        for (let i = 0; i < numRays; i++) {
          const rayX = (w / (numRays + 1)) * (i + 1) + Math.sin(time + i) * 55;
          const grad = ctx.createLinearGradient(rayX, 0, rayX + 110, h);
          grad.addColorStop(0, 'rgba(0, 229, 255, 0.13)');
          grad.addColorStop(0.5, 'rgba(0, 163, 255, 0.04)');
          grad.addColorStop(1, 'rgba(0, 36, 125, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(rayX - 30, 0);
          ctx.lineTo(rayX + 90, 0);
          ctx.lineTo(rayX + 260, h);
          ctx.lineTo(rayX - 120, h);
          ctx.closePath();
          ctx.fill();
        }

        // 2. Draw rising bubbles
        bubbles.forEach((b) => {
          b.y -= b.speedY;
          b.x += b.speedX + Math.sin(time + b.pulse) * 0.4;
          if (b.y < -10) {
            b.y = h + 10;
            b.x = Math.random() * w;
          }

          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 240, 255, ${b.alpha})`;
          ctx.fill();

          // Inner bubble highlight
          ctx.beginPath();
          ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 1.5})`;
          ctx.fill();
        });

        // 3. Draw floating geometric glass shards
        shards.forEach((s) => {
          s.y += s.speedY;
          s.angle += s.rotSpeed;
          if (s.y < -50) {
            s.y = h + 50;
            s.x = Math.random() * w;
          }

          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.angle);

          ctx.beginPath();
          ctx.moveTo(0, -s.size);
          ctx.lineTo(s.size * 0.6, s.size * 0.4);
          ctx.lineTo(-s.size * 0.6, s.size * 0.8);
          ctx.closePath();

          ctx.fillStyle = `rgba(0, 210, 255, ${s.alpha})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(255, 255, 255, ${s.alpha * 1.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.restore();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Background Undersea Tartarus Image */}
      <img
        src="./assets/p3_underwater_bg.jpg"
        alt="Persona 3 Underwater Tartarus"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.85) contrast(1.15)',
        }}
      />

      {/* Deep Sea Blue Overlay Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 75% 25%, rgba(0, 163, 255, 0.25) 0%, rgba(2, 6, 23, 0.85) 90%), linear-gradient(180deg, rgba(0, 36, 125, 0.35) 0%, rgba(2, 6, 23, 0.92) 100%)',
        }}
      />

      {/* Dynamic Animated Canvas Waves and Bubbles */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
