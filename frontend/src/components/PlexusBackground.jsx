import React, { useEffect, useRef } from 'react';

/**
 * PlexusBackground Component
 * Exact visual recreation of the Pinterest reference (https://pin.it/1VLhHTyYW):
 * - 3D floating plexus / constellation network
 * - Connected particle nodes with glowing halos
 * - Dynamic line links between adjacent nodes
 * - Semi-transparent triangular facets (polygonal mesh) between connected node triplets
 * - Slow, fluid, undulating motion with subtle 3D rotational perspective
 * - Adapted to the GWC Manufacturing brand palette (Purple #6f3dba, Violet #7c3aed, Electric Indigo #4f46e5, Cyan #0ea5e9)
 */
export default function PlexusBackground({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for subtle interactive depth
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 3D Particles initialization
    // Slower motion: very low velocities, gentle harmonic oscillation
    const PARTICLE_COUNT = Math.min(85, Math.floor((width * height) / 14000));
    const CONNECT_DIST = 145; // Max distance for drawing connecting lines
    const TRIANGLE_DIST = 115; // Max distance for drawing filled triangular facets
    const FOV = 450; // Field of view for 3D perspective

    // Brand color palette
    const colors = [
      { r: 111, g: 61, b: 186 },  // Brand Primary Purple (#6f3dba)
      { r: 124, g: 58, b: 237 },  // Electric Violet (#7c3aed)
      { r: 79,  g: 70, b: 229 },  // Indigo Mesh (#4f46e5)
      { r: 14,  g: 165, b: 233 }, // Tech Cyan / Blue (#0ea5e9)
      { r: 147, g: 51, b: 234 },  // Bright Accent Purple (#9333ea)
    ];

    class Particle3D {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        // Position in 3D bounding box centered at (0, 0, 0)
        this.x = (Math.random() - 0.5) * (width * 1.1);
        this.y = (Math.random() - 0.5) * (height * 1.1);
        this.z = initial ? (Math.random() - 0.5) * 600 : 300;

        // Ultra-slow smooth velocity vector
        this.vx = (Math.random() - 0.5) * 0.28;
        this.vy = (Math.random() - 0.5) * 0.28;
        this.vz = (Math.random() - 0.5) * 0.22;

        // Base size and color
        this.baseRadius = 1.4 + Math.random() * 2.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Sine wave pulsation offset
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.008 + Math.random() * 0.012;
      }

      update(rotY, rotX, time) {
        // Slow natural drift
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        // Gentle boundary bounce / wrap
        const boundX = width * 0.65;
        const boundY = height * 0.65;
        const boundZ = 320;

        if (this.x < -boundX) this.x = boundX;
        if (this.x > boundX) this.x = -boundX;
        if (this.y < -boundY) this.y = boundY;
        if (this.y > boundY) this.y = -boundY;
        if (this.z < -boundZ) this.z = boundZ;
        if (this.z > boundZ) this.z = -boundZ;

        // 3D Rotation Matrix (slow yaw and pitch)
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        // Rotate around Y
        const rx1 = this.x * cosY + this.z * sinY;
        const rz1 = -this.x * sinY + this.z * cosY;

        // Rotate around X
        const ry2 = this.y * cosX - rz1 * sinX;
        const rz2 = this.y * sinX + rz1 * cosX;

        // 3D Perspective Projection
        const zDepth = rz2 + FOV;
        const scale = FOV / Math.max(zDepth, 100);

        this.projX = width / 2 + rx1 * scale;
        this.projY = height / 2 + ry2 * scale;
        this.scale = scale;
        this.depthAlpha = Math.max(0.12, Math.min(1.0, (rz2 + 300) / 600));

        // Breathing pulsation
        this.pulse = Math.sin(time * this.pulseSpeed + this.pulseOffset);
      }
    }

    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle3D());

    let rotY = 0;
    let rotX = 0;
    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.03;
      mouse.y += (mouse.targetY - mouse.y) * 0.03;

      // Slower motion rotation factors
      const targetRotY = (mouse.x / width - 0.5) * 0.35;
      const targetRotX = -(mouse.y / height - 0.5) * 0.35;
      rotY += (targetRotY - rotY) * 0.02 + 0.0006; // Constant ultra-slow spin
      rotX += (targetRotX - rotX) * 0.02 + 0.0003;

      // 1. Update all particle 3D positions
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(rotY, rotX, time);
      }

      // 2. Render connecting lines and find triangle triplets
      // To ensure high performance while preserving the rich Pinterest plexus aesthetic,
      // we draw mutual connections and filled polygons.
      const neighbors = Array.from({ length: particles.length }, () => []);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.projX < -50 || p1.projX > width + 50 || p1.projY < -50 || p1.projY > height + 50) continue;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.projX < -50 || p2.projX > width + 50 || p2.projY < -50 || p2.projY > height + 50) continue;

          const dx = p1.projX - p2.projX;
          const dy = p1.projY - p2.projY;
          const dist = Math.hypot(dx, dy);

          if (dist < CONNECT_DIST) {
            neighbors[i].push(j);

            // Line opacity based on distance and 3D depth
            const distRatio = 1 - dist / CONNECT_DIST;
            const avgScale = (p1.scale + p2.scale) * 0.5;
            const lineAlpha = distRatio * distRatio * avgScale * 0.28;

            if (lineAlpha > 0.015) {
              ctx.beginPath();
              ctx.moveTo(p1.projX, p1.projY);
              ctx.lineTo(p2.projX, p2.projY);
              
              // Blended brand line stroke
              ctx.strokeStyle = `rgba(111, 61, 186, ${lineAlpha.toFixed(3)})`;
              ctx.lineWidth = Math.max(0.6, 1.2 * avgScale);
              ctx.stroke();
            }
          }
        }
      }

      // 3. Render Translucent Triangular Mesh Facets (from mutual connections)
      let triangleCount = 0;
      const MAX_TRIANGLES = 48; // Crisp aesthetic without visual clutter

      for (let i = 0; i < particles.length && triangleCount < MAX_TRIANGLES; i++) {
        const p1 = particles[i];
        const nList = neighbors[i];

        for (let jIdx = 0; jIdx < nList.length && triangleCount < MAX_TRIANGLES; jIdx++) {
          const j = nList[jIdx];
          const p2 = particles[j];

          for (let kIdx = jIdx + 1; kIdx < nList.length && triangleCount < MAX_TRIANGLES; kIdx++) {
            const k = nList[kIdx];
            // Check if p2 is also connected to p3
            if (neighbors[j] && neighbors[j].includes(k)) {
              const p3 = particles[k];

              const d12 = Math.hypot(p1.projX - p2.projX, p1.projY - p2.projY);
              const d23 = Math.hypot(p2.projX - p3.projX, p2.projY - p3.projY);
              const d31 = Math.hypot(p3.projX - p1.projX, p3.projY - p1.projY);
              const maxEdge = Math.max(d12, d23, d31);

              if (maxEdge < TRIANGLE_DIST) {
                const avgScale = (p1.scale + p2.scale + p3.scale) / 3;
                const triAlpha = (1 - maxEdge / TRIANGLE_DIST) * avgScale * 0.12;

                if (triAlpha > 0.01) {
                  ctx.beginPath();
                  ctx.moveTo(p1.projX, p1.projY);
                  ctx.lineTo(p2.projX, p2.projY);
                  ctx.lineTo(p3.projX, p3.projY);
                  ctx.closePath();

                  // Subtle gradient fill between brand purple and indigo
                  const c = (i + j + k) % 3 === 0 
                    ? 'rgba(111, 61, 186, '  // Purple
                    : (i + j + k) % 3 === 1 
                      ? 'rgba(79, 70, 229, ' // Indigo
                      : 'rgba(14, 165, 233, '; // Cyan highlight

                  ctx.fillStyle = `${c}${triAlpha.toFixed(3)})`;
                  ctx.fill();

                  // Delicately trace triangle boundary
                  ctx.strokeStyle = `${c}${(triAlpha * 1.5).toFixed(3)})`;
                  ctx.lineWidth = 0.5 * avgScale;
                  ctx.stroke();

                  triangleCount++;
                }
              }
            }
          }
        }
      }

      // 4. Render Glowing Nodes / Dots
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.projX < -20 || p.projX > width + 20 || p.projY < -20 || p.projY > height + 20) continue;

        const radius = Math.max(1, p.baseRadius * p.scale * (1 + p.pulse * 0.18));
        const alpha = Math.min(0.9, p.depthAlpha * p.scale * 1.1);

        // Core Dot
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha.toFixed(3)})`;
        ctx.fill();

        // Subtle soft outer glow for foreground nodes
        if (p.scale > 0.95 && alpha > 0.5) {
          ctx.beginPath();
          ctx.arc(p.projX, p.projY, radius * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${(alpha * 0.18).toFixed(3)})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`plexus-background-canvas ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
