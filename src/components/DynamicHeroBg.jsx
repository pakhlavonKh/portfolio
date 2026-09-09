import { useEffect, useRef } from "react";

/**
 * DynamicHeroBg
 * A high-performance, GPU-accelerated canvas background recreating the reference design:
 * - Deep navy/indigo palette with vast dark negative space for hero typography.
 * - Slowly morphing translucent liquid/glass surfaces in the upper area (15–40s non-repeating periods).
 * - Gentle ambient glow slowly shifting position over time.
 * - 10 thin contour wave lines across the lower-middle section with independent horizontal travel speeds.
 * - Subdued, sophisticated mouse parallax with smooth damping.
 * - Respects prefers-reduced-motion and pauses when scrolled off-screen.
 * - Zero particles, zero floating random 3D objects, zero bright neon.
 */
const DynamicHeroBg = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationId = null;
    let width = 0;
    let height = 0;
    let isVisible = true;

    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = mediaQuery.matches;

    const handleMotionPreferenceChange = (e) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        drawFrame(0);
      }
    };
    mediaQuery.addEventListener("change", handleMotionPreferenceChange);

    // Damped mouse tracking for subtle, non-exaggerated parallax
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const onMouseMove = (e) => {
      if (prefersReducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = (clientX / width - 0.5) * 2; // -1 to 1
      mouse.targetY = (clientY / height - 0.5) * 2; // -1 to 1
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Handle high-DPI retina scaling
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
      ctx.scale(dpr, dpr);

      if (prefersReducedMotion) {
        drawFrame(0);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Pause rendering loop when off-screen to preserve CPU/battery
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Multi-period parameters for non-repeating, living motion
    // Different layers cycle over ~18s, ~27s, ~34s, and ~40s
    let startTime = performance.now();

    // 16 contour lines with varying speed multipliers for a fuller, richer wave
    const LINE_COUNT = 16;
    const lineSpeeds = [
      0.82, 1.05, 0.94, 1.20, 0.88, 1.12, 0.96, 1.25,
      0.90, 1.08, 1.18, 0.85, 1.28, 1.02, 1.15, 0.92,
    ];

    const drawFrame = (currentTime) => {
      const elapsed = (currentTime - startTime) / 1000;

      // Mouse damping (slow, graceful response)
      mouse.x += (mouse.targetX - mouse.x) * 0.025;
      mouse.y += (mouse.targetY - mouse.y) * 0.025;

      const w = width;
      const h = height;

      // -------------------------------------------------------------
      // 1. BASE DEEP NAVY / INDIGO BACKGROUND
      // -------------------------------------------------------------
      ctx.fillStyle = "#060914";
      ctx.fillRect(0, 0, w, h);

      // -------------------------------------------------------------
      // 2. SLOWLY SHIFTING AMBIENT GLOW (35-40s period)
      // -------------------------------------------------------------
      const glowT = elapsed * 0.16; // ~39s cycle
      const glowX = w * (0.68 + Math.sin(glowT) * 0.08) + mouse.x * 16;
      const glowY = h * (0.28 + Math.cos(glowT * 0.85) * 0.06) + mouse.y * 12;
      const glowRadius = Math.max(w, h) * 0.65;

      const ambientGrad = ctx.createRadialGradient(
        glowX,
        glowY,
        20,
        glowX,
        glowY,
        glowRadius
      );
      ambientGrad.addColorStop(0, "rgba(22, 34, 68, 0.45)");
      ambientGrad.addColorStop(0.45, "rgba(12, 18, 40, 0.25)");
      ambientGrad.addColorStop(1, "rgba(6, 9, 20, 0)");

      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, w, h);

      // Secondary cool tint in lower-left for subtle visual balance
      const coolGrad = ctx.createRadialGradient(
        w * 0.15 - mouse.x * 10,
        h * 0.85 - mouse.y * 10,
        10,
        w * 0.15 - mouse.x * 10,
        h * 0.85 - mouse.y * 10,
        w * 0.5
      );
      coolGrad.addColorStop(0, "rgba(14, 22, 45, 0.35)");
      coolGrad.addColorStop(1, "rgba(6, 9, 20, 0)");
      ctx.fillStyle = coolGrad;
      ctx.fillRect(0, 0, w, h);

      // -------------------------------------------------------------
      // 3. LARGE TRANSLUCENT LIQUID SURFACES (Upper Area)
      // -------------------------------------------------------------
      // Wave 1: Primary organic wave crest sweeping from top-right down to center
      const morphT1 = elapsed * 0.42; // active organic morphing
      const morphT2 = elapsed * 0.35;

      const mX1 = mouse.x * 18;
      const mY1 = mouse.y * 14;

      // Control points with non-harmonic multi-sine displacement
      const cp1_x = w * (0.42 + Math.sin(morphT1) * 0.04) + mX1;
      const cp1_y = h * (0.12 + Math.cos(morphT2 * 1.1) * 0.045) + mY1;
      const cp2_x = w * (0.64 + Math.cos(morphT1 * 0.9) * 0.04) + mX1 * 1.2;
      const cp2_y = h * (0.48 + Math.sin(morphT2 * 0.8) * 0.05) + mY1 * 1.2;
      const end1_x = w * 1.05;
      const end1_y = h * (0.58 + Math.sin(morphT1 * 0.7) * 0.035) + mY1;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(w * 1.05, -h * 0.05);
      ctx.lineTo(w * 0.32 + Math.cos(morphT2) * 16 + mX1 * 0.8, -h * 0.05);
      ctx.bezierCurveTo(cp1_x, cp1_y, cp2_x, cp2_y, end1_x, end1_y);
      ctx.closePath();

      const waveGrad1 = ctx.createLinearGradient(
        w * 0.4 + mX1,
        0,
        w * 0.85 + mX1,
        h * 0.65
      );
      waveGrad1.addColorStop(0, "rgba(22, 32, 64, 0.65)");
      waveGrad1.addColorStop(0.45, "rgba(14, 20, 44, 0.45)");
      waveGrad1.addColorStop(1, "rgba(8, 12, 26, 0.15)");

      ctx.fillStyle = waveGrad1;
      ctx.fill();

      // Delicate crest illumination along the border of Wave 1
      ctx.beginPath();
      ctx.moveTo(w * 0.32 + Math.cos(morphT2) * 16 + mX1 * 0.8, -h * 0.05);
      ctx.bezierCurveTo(cp1_x, cp1_y, cp2_x, cp2_y, end1_x, end1_y);
      const edgeGrad1 = ctx.createLinearGradient(
        w * 0.35,
        0,
        w * 0.9,
        h * 0.55
      );
      edgeGrad1.addColorStop(0, "rgba(140, 185, 235, 0)");
      edgeGrad1.addColorStop(0.3, "rgba(140, 185, 235, 0.12)");
      edgeGrad1.addColorStop(0.7, "rgba(190, 220, 255, 0.08)");
      edgeGrad1.addColorStop(1, "rgba(140, 185, 235, 0)");
      ctx.strokeStyle = edgeGrad1;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // Wave 2: Secondary soft liquid surface in the upper left/mid quadrant
      const morphT3 = elapsed * 0.38;
      const cp3_x = w * (0.28 + Math.cos(morphT3 * 0.9) * 0.035) + mX1 * 0.7;
      const cp3_y = h * (0.26 + Math.sin(morphT3 * 1.1) * 0.035) + mY1 * 0.7;
      const cp4_x = w * (0.48 + Math.sin(morphT3 * 0.8) * 0.04) + mX1 * 0.8;
      const cp4_y = h * (0.22 + Math.cos(morphT3 * 0.7) * 0.035) + mY1 * 0.8;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-w * 0.05, -h * 0.05);
      ctx.lineTo(w * 0.18 + mX1 * 0.5, -h * 0.05);
      ctx.bezierCurveTo(cp3_x, cp3_y, cp4_x, cp4_y, w * 0.52 + mX1, -h * 0.05);
      ctx.closePath();

      const waveGrad2 = ctx.createLinearGradient(0, 0, w * 0.5, h * 0.35);
      waveGrad2.addColorStop(0, "rgba(18, 26, 52, 0.45)");
      waveGrad2.addColorStop(0.6, "rgba(10, 15, 34, 0.25)");
      waveGrad2.addColorStop(1, "rgba(6, 9, 20, 0)");
      ctx.fillStyle = waveGrad2;
      ctx.fill();

      // Soft crest line on Wave 2
      ctx.beginPath();
      ctx.moveTo(w * 0.18 + mX1 * 0.5, -h * 0.05);
      ctx.bezierCurveTo(cp3_x, cp3_y, cp4_x, cp4_y, w * 0.52 + mX1, -h * 0.05);
      ctx.strokeStyle = "rgba(120, 165, 220, 0.07)";
      ctx.lineWidth = 1.0;
      ctx.stroke();
      ctx.restore();

      // -------------------------------------------------------------
      // 4. THIN WAVE / CONTOUR LINES (Lower Section, Below Text)
      // -------------------------------------------------------------
      const lineStep = 180; // points per line for buttery-smooth spline
      const baseSpacing = 9.5; // wider spacing for a larger, bolder ribbon

      const lineMX = mouse.x * 18;
      const lineMY = mouse.y * 14;

      for (let i = 0; i < LINE_COUNT; i++) {
        const lineOffset = (i - LINE_COUNT / 2) * baseSpacing;
        const speed = lineSpeeds[i];
        const lineTime = elapsed * speed * 2.2; // faster, energetic continuous traveling flow

        ctx.beginPath();

        for (let p = 0; p <= lineStep; p++) {
          const u = p / lineStep; // 0.0 to 1.0
          const x = -w * 0.08 + u * (w * 1.16);

          // Positioned lower down (h * 0.68) so it gracefully frames below the hero title
          const normX = (u - 0.5) * 2.0; // -1.0 to 1.0
          const baseS =
            h * 0.68 +
            Math.sin(normX * 2.0 - 0.2) * (h * 0.16) +
            Math.cos(normX * 1.4) * (h * 0.07);

          // Highly active traveling waves + energetic vertical undulation
          const wave1 =
            Math.sin(normX * 4.4 - lineTime + i * 0.32) * (20 + i * 1.1);
          const wave2 =
            Math.cos(normX * 6.2 - lineTime * 0.8 - i * 0.22) * 12;
          const waveBreathing =
            Math.sin(elapsed * 1.6 + normX * 2.5) * (h * 0.045);

          const y = baseS + lineOffset + wave1 + wave2 + waveBreathing + lineMY;

          if (p === 0) {
            ctx.moveTo(x + lineMX, y);
          } else {
            ctx.lineTo(x + lineMX, y);
          }
        }

        // Luminous high-tech stroke gradient
        const lineGrad = ctx.createLinearGradient(0, 0, w, 0);
        const centerAlpha = Math.max(
          0.14,
          0.42 - Math.abs(i - LINE_COUNT / 2) * 0.024
        );

        lineGrad.addColorStop(0, "rgba(80, 120, 200, 0)");
        lineGrad.addColorStop(0.18, `rgba(90, 145, 230, ${centerAlpha * 0.55})`);
        lineGrad.addColorStop(0.55, `rgba(145, 225, 255, ${centerAlpha * 1.0})`);
        lineGrad.addColorStop(0.82, `rgba(105, 185, 245, ${centerAlpha * 0.65})`);
        lineGrad.addColorStop(1, "rgba(80, 120, 200, 0)");

        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // 5. NEGATIVE SPACE SHADING FOR HERO TEXT READABILITY
      // -------------------------------------------------------------
      // Gentle radial vignette over center so typography has maximum clarity
      const textVignette = ctx.createRadialGradient(
        w * 0.5,
        h * 0.5,
        w * 0.15,
        w * 0.5,
        h * 0.5,
        w * 0.55
      );
      textVignette.addColorStop(0, "rgba(6, 9, 20, 0.35)");
      textVignette.addColorStop(1, "rgba(6, 9, 20, 0)");
      ctx.fillStyle = textVignette;
      ctx.fillRect(0, 0, w, h);

      // -------------------------------------------------------------
      // 6. SEAMLESS BOTTOM BLEND INTO SUBSEQUENT SECTION
      // -------------------------------------------------------------
      const fadeHeight = Math.min(260, h * 0.4);
      const bottomFade = ctx.createLinearGradient(0, h - fadeHeight, 0, h);
      bottomFade.addColorStop(0, "rgba(6, 9, 20, 0)");
      bottomFade.addColorStop(0.45, "rgba(6, 9, 20, 0.55)");
      bottomFade.addColorStop(1, "rgba(6, 9, 20, 1)");
      ctx.fillStyle = bottomFade;
      ctx.fillRect(0, h - fadeHeight, w, fadeHeight);
    };

    const animate = (currentTime) => {
      if (!prefersReducedMotion && isVisible) {
        drawFrame(currentTime);
      }
      animationId = requestAnimationFrame(animate);
    };

    // Draw initial frame and start loop
    drawFrame(performance.now());
    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", handleMotionPreferenceChange);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="dynamic-hero-bg-canvas"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

export default DynamicHeroBg;
