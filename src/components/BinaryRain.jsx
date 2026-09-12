import { useEffect, useRef } from "react";

const BinaryRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = canvas.parentElement.clientWidth;
    let height = canvas.parentElement.clientHeight;

    canvas.width = width;
    canvas.height = height;

    const isMobile = width < 768;

    const fontSize = isMobile ? 12 : 14;
    const columns = Math.floor(width / fontSize);

    const drops = Array(columns).fill(0);
    const chars = ["0", "1"];

    const fade = isMobile ? 0.03 : 0.02;
    const speed = isMobile ? 0.5 : 0.45;
    const spawnRate = isMobile ? 3 : 2;

    let frame = 0;
    let animationId = null;
    let isRunning = false;

    const draw = () => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0, 0, 0, ${fade})`;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";
      ctx.font = `${fontSize}px monospace`;

      const centerX = width / 2;

      for (let i = 0; i < drops.length; i++) {
        const baseX = i * fontSize;
        const wave = Math.sin(drops[i] * 0.05 + i) * 3;

        const distFromCenter = (baseX - centerX) / centerX;
        const perspective = distFromCenter * 6;
        const scale = 1 - Math.abs(distFromCenter) * 0.15;

        const x = baseX + wave + perspective;
        const y = drops[i] * fontSize;

        if (frame % spawnRate === 0) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          const alpha = 0.6 - Math.abs(distFromCenter) * 0.4;

          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scale, scale);

          ctx.fillStyle = `rgba(143, 211, 255, ${alpha})`;
          ctx.shadowColor = "rgba(143, 211, 255, 0.2)";
          ctx.shadowBlur = 4;
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }

        drops[i] += speed;

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }

      frame++;
    };

    const animate = () => {
      if (document.hidden) {
        isRunning = false;
        return;
      }
      draw();
      animationId = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!isRunning && !document.hidden) {
        isRunning = true;
        animationId = requestAnimationFrame(animate);
      }
    };

    const stopAnimation = () => {
      if (isRunning) {
        isRunning = false;
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    startAnimation();

    return () => {
      stopAnimation();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "30rem",
        overflow: "hidden",
        background: "transparent",
        maskImage: `
  linear-gradient(to right, transparent 0%, white 20%, white 80%, transparent 100%),
  linear-gradient(to bottom, transparent 0%, white 20%, white 80%, transparent 100%)
`,
        WebkitMaskImage: `
  linear-gradient(to right, transparent 0%, white 20%, white 80%, transparent 100%),
  linear-gradient(to bottom, transparent 0%, white 20%, white 80%, transparent 100%)
`,
        WebkitMaskComposite: "destination-in",
        maskComposite: "intersect",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
        }}
      />
    </div>
  );
};

export default BinaryRain;
