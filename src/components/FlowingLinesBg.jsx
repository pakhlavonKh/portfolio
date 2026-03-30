import { useEffect, useRef } from "react";
import * as THREE from "three";

const AnimatedWireframeBg = ({ showParticles = false }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const isMobile =
      /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ||
      window.innerWidth < 768;

    // ---------- SCENE ----------
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      isMobile ? 75 : 60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    camera.position.z = isMobile ? 180 : 120;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
    });

    // 🔑 dynamic resolution
    const DPR = isMobile ? 0.6 : Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(DPR);
    renderer.setSize(window.innerWidth, window.innerHeight);

    ref.current.appendChild(renderer.domElement);

    // ---------- GRID (lighter but smarter) ----------
    const LINES = isMobile ? 18 : 100;
    const POINTS = isMobile ? 40 : 180;

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const indices = [];

    for (let i = 0; i < LINES; i++) {
      for (let j = 0; j < POINTS; j++) {
        const x = (j / POINTS - 0.5) * 220;
        const y = (i / LINES - 0.5) * 220;

        positions.push(x, y, 0);

        if (j < POINTS - 1) {
          const a = i * POINTS + j;
          const b = i * POINTS + j + 1;
          indices.push(a, b);
        }
      }
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setIndex(indices);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },

      vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;

      varying float vDepth;
      varying float vWave;

      void main() {
        vec3 pos = position;

        float t = uTime;

        float w1 = sin(pos.x * 0.02 + t);
        float w2 = cos(pos.y * 0.02 - t);
        float w3 = sin((pos.x + pos.y) * 0.015 + t * 0.6);

        float wave = w1 + w2 + w3 * 0.6;

        pos.y += wave * 12.0;
        pos.z += wave * 18.0;

        pos.x += uMouse.x * 4.0;
        pos.y += uMouse.y * 4.0;

        vDepth = pos.z;
        vWave = wave;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,

      fragmentShader: `
      varying float vDepth;
      varying float vWave;

      void main() {
        float d = vDepth * 0.02;

        vec3 c1 = vec3(0.05, 0.1, 0.25);
        vec3 c2 = vec3(0.2, 0.5, 1.0);
        vec3 c3 = vec3(1.0);

        vec3 color = mix(c1, c2, smoothstep(-1.0, 0.5, d));
        color = mix(color, c3, smoothstep(0.3, 1.2, d));

        float glow = 0.35 + abs(vWave) * 0.5;

        gl_FragColor = vec4(color * glow, glow * 0.35);
      }
    `,
    });

    const grid = new THREE.LineSegments(geometry, material);
    scene.add(grid);

    // ---------- PARTICLES (cheap complexity) ----------
    let particles = null;
    if (showParticles) {
      const particleCount = isMobile ? 80 : 250;
      const pGeom = new THREE.BufferGeometry();
      const pPositions = [];

      for (let i = 0; i < particleCount; i++) {
        pPositions.push(
          (Math.random() - 0.5) * 300,
          (Math.random() - 0.5) * 300,
          (Math.random() - 0.5) * 200,
        );
      }

      pGeom.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(pPositions, 3),
      );

      const pMat = new THREE.PointsMaterial({
        size: isMobile ? 1.2 : 1.5,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });

      particles = new THREE.Points(pGeom, pMat);
      scene.add(particles);
    }

    // ---------- FLOATING SHAPES ----------
    const shapes = [];

    const shapeGeom = new THREE.IcosahedronGeometry(3, 0);
    const shapeMat = new THREE.MeshBasicMaterial({
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    const shapeCount = isMobile ? 2 : 6;

    for (let i = 0; i < shapeCount; i++) {
      const mesh = new THREE.Mesh(shapeGeom, shapeMat);

      mesh.position.set(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 100,
      );

      scene.add(mesh);
      shapes.push(mesh);
    }

    // ---------- INPUT ----------
    const target = new THREE.Vector2();
    const smooth = new THREE.Vector2();

    const update = (x, y) => {
      target.x = (x / window.innerWidth - 0.5) * 2;
      target.y = (y / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener(
      "mousemove",
      (e) => !isMobile && update(e.clientX, e.clientY),
    );
    window.addEventListener("touchmove", (e) => {
      if (isMobile && e.touches.length) {
        update(e.touches[0].clientX, e.touches[0].clientY);
      }
    });

    // ---------- ANIMATION ----------
    let last = performance.now();
    let animationId;

    const animate = () => {
      const now = performance.now();
      const delta = (now - last) / 1000;
      last = now;

      animationId = requestAnimationFrame(animate);

      material.uniforms.uTime.value += delta * (isMobile ? 0.6 : 1.2);

      smooth.lerp(target, isMobile ? 0.03 : 0.06);
      material.uniforms.uMouse.value.copy(smooth);

      // subtle camera movement
      camera.position.x += (smooth.x * 10 - camera.position.x) * 0.04;
      camera.position.y += (smooth.y * 10 - camera.position.y) * 0.04;

      // animate particles (cheap drift)
      if (particles) particles.rotation.y += delta * 0.02;

      // animate shapes
      shapes.forEach((s, i) => {
        s.rotation.x += delta * 0.3;
        s.rotation.y += delta * 0.2;

        s.position.y += Math.sin(now * 0.001 + i) * 0.02;
      });

      renderer.render(scene, camera);
    };

    animationId = animate();

    // ---------- RESIZE ----------
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  }, [showParticles]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
};

export default AnimatedWireframeBg;
