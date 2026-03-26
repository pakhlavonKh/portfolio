import { useEffect, useRef } from "react";
import * as THREE from "three";

const AnimatedWireframeBg = () => {
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
      1000
    );

    camera.position.z = isMobile ? 160 : 120;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(
      isMobile ? 0.8 : Math.min(window.devicePixelRatio, 2)
    );

    ref.current.appendChild(renderer.domElement);

    // ---------- DENSITY ----------
    const LINES = isMobile ? 30 : 120;
    const POINTS = isMobile ? 70 : 220;

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
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setIndex(indices);

    // ---------- SHADER ----------
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

          float t = uTime * 0.4;

          // --- PRIMARY WAVES ---
          float w1 = sin(pos.x * 0.02 + t);
          float w2 = cos(pos.y * 0.025 - t * 1.2);

          // --- SECONDARY DETAIL ---
          float w3 = sin((pos.x + pos.y) * 0.015 + t * 0.7);
          float w4 = cos((pos.x - pos.y) * 0.02 - t * 0.5);

          // --- STRUCTURE (adds "designed" feel) ---
          float grid = sin(pos.x * 0.01) * sin(pos.y * 0.01);

          // combine cleanly (not chaotic)
          float wave = w1 + w2 + w3 * 0.6 + w4 * 0.5 + grid * 0.4;

          // apply deformation
          pos.y += wave * 14.0;
          pos.z += wave * 22.0;

          // subtle mouse influence
          pos.x += uMouse.x * 5.0;
          pos.y += uMouse.y * 5.0;

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

          vec3 darkBlue = vec3(0.02, 0.05, 0.15);
          vec3 blue = vec3(0.1, 0.35, 1.0);
          vec3 light = vec3(0.85, 0.9, 1.0);

          vec3 color = mix(darkBlue, blue, smoothstep(-1.0, 0.4, d));
          color = mix(color, light, smoothstep(0.2, 1.2, d));

          float glow = 0.42 + abs(vWave) * 0.6;

          gl_FragColor = vec4(color * glow * 1.2, glow * 0.36);
        }
      `,
    });

    const lines = new THREE.LineSegments(geometry, material);
    scene.add(lines);

    // ---------- INPUT ----------
    const target = new THREE.Vector2();
    const smooth = new THREE.Vector2();

    const update = (x, y) => {
      target.x = (x / window.innerWidth - 0.5) * 2;
      target.y = (y / window.innerHeight - 0.5) * 2;
    };

    const onMouse = (e) => {
      if (!isMobile) update(e.clientX, e.clientY);
    };

    const onTouch = (e) => {
      if (isMobile && e.touches.length) {
        update(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch);

    // ---------- RESIZE ----------
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    // ---------- ANIMATION ----------
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      material.uniforms.uTime.value += isMobile ? 0.004 : 0.007;

      smooth.lerp(target, isMobile ? 0.02 : 0.05);
      material.uniforms.uMouse.value.copy(smooth);

      const camFactor = isMobile ? 8 : 18;

      camera.position.x += (smooth.x * camFactor - camera.position.x) * 0.05;
      camera.position.y += (smooth.y * camFactor - camera.position.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // ---------- CLEANUP ----------
    return () => {
      cancelAnimationFrame(frameId);

      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", onResize);

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

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