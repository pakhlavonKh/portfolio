import { useEffect, useRef } from "react";

const LiquidBinaryField = ({ density = 1 }) => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = canvas.parentElement.clientWidth;
    let height = canvas.parentElement.clientHeight;

    canvas.width = width;
    canvas.height = height;

    const isMobile = width < 768;

    // particle count
    const PARTICLE_COUNT = Math.floor((width * height) / 12000) * density;

    const chars = ["0", "1"];

    // particles
    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      char: chars[Math.floor(Math.random() * 2)],
    }));

    // smooth noise-like field
    const flow = (x, y, t) => {
      const scale = 0.002;
      const angle =
        Math.sin(x * scale + t) +
        Math.cos(y * scale - t * 0.5);
      return {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
    };

    const fade = isMobile ? 0.04 : 0.025;

    let time = 0;
    let animationId;

    const draw = () => {
      // soft fade (liquid trail)
      ctx.fillStyle = `rgba(0,0,0,${fade})`;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      particles.forEach((p) => {
        const f = flow(p.x, p.y, time);

        // base motion (fluid)
        p.vx += f.x * 0.15;
        p.vy += f.y * 0.15;

        // mouse interaction (repel/attract field)
        if (mouse.current.x !== null) {
          const dx = p.x - mouse.current.x;
          const dy = p.y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const force = (150 - dist) / 150;
            p.vx += (dx / dist) * force * 0.6;
            p.vy += (dy / dist) * force * 0.6;
          }
        }

        // damping (liquid viscosity)
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        // wrap around (continuous field)
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // depth (center stronger, edges faint)
        const dx = (p.x - centerX) / centerX;
        const dy = (p.y - centerY) / centerY;
        const distFromCenter = Math.sqrt(dx * dx + dy * dy);

        const alpha = 1 - distFromCenter * 0.8;

        // perspective slight scale
        const scale = 1 - distFromCenter * 0.3;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(scale, scale);

        ctx.fillStyle = `rgba(143, 211, 255, ${alpha * 0.6})`;
        ctx.shadowColor = "rgba(143, 211, 255, 0.25)";
        ctx.shadowBlur = 6;

        ctx.font = "14px monospace";
        ctx.fillText(p.char, 0, 0);

        ctx.restore();
      });

      time += 0.005;
    };

    const animate = () => {
      draw();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // mouse tracking
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    const handleLeave = () => {
      mouse.current.x = null;
      mouse.current.y = null;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleLeave);

    const handleResize = () => {
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [density]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",

        // edge fade (critical for polish)
        maskImage:
          "radial-gradient(circle at center, white 55%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(circle at center, white 55%, transparent 100%)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default LiquidBinaryField;