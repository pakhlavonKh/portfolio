import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * AnimatedWireframeBg
 * Programmatically generates the sleek fluid waves and contour ribbon in Three.js,
 * replicating the reference design in real-time code:
 * 1. Deep organic 3D fluid wave hills with volumetric gradient lighting and crest highlights.
 * 2. Parallel curved contour wave ribbons (the elegant S-curve lines sweeping across).
 * 3. User's floating 3D wireframe shapes with smooth mouse parallax.
 */
const AnimatedWireframeBg = ({ showParticles = true }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const isMobile =
      /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ||
      window.innerWidth < 768;

    // ---------- SCENE & CAMERA ----------
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      isMobile ? 70 : 55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, isMobile ? 140 : 110);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });

    const DPR = isMobile ? 0.75 : Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(DPR);
    renderer.setSize(window.innerWidth, window.innerHeight);

    ref.current.appendChild(renderer.domElement);

    // -----------------------------------------------------------------
    // 1. ORGANIC 3D FLUID WAVE HILLS (Volumetric backdrop wave folds)
    // -----------------------------------------------------------------
    const fluidGeom = new THREE.PlaneGeometry(
      isMobile ? 260 : 320,
      isMobile ? 180 : 220,
      isMobile ? 50 : 80,
      isMobile ? 40 : 60
    );

    const fluidMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec3 vWorldPos;
        varying vec3 vNormalVec;
        varying float vElevation;

        void main() {
          vec3 pos = position;

          float t = uTime * 0.45;
          // Smooth multi-harmonic organic fluid curves
          float w1 = sin(pos.x * 0.016 + t * 0.8) * cos(pos.y * 0.018 - t * 0.6) * 26.0;
          float w2 = sin((pos.x * 0.022 + pos.y * 0.015) + t) * 14.0;
          float w3 = cos(pos.x * 0.009 - pos.y * 0.012 + t * 0.4) * 18.0;

          // Push billow towards the top-right / center like reference image
          float centerBias = smoothstep(-120.0, 80.0, pos.x) * smoothstep(-80.0, 80.0, pos.y);
          pos.z += (w1 + w2 + w3) * (0.8 + centerBias * 0.7);

          // Subtle mouse deformation
          pos.x += uMouse.x * 5.0;
          pos.y += uMouse.y * 5.0;

          vElevation = pos.z;
          vec4 worldP = modelMatrix * vec4(pos, 1.0);
          vWorldPos = worldP.xyz;
          vNormalVec = normalMatrix * normal;

          gl_Position = projectionMatrix * viewMatrix * worldP;
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPos;
        varying vec3 vNormalVec;
        varying float vElevation;

        void main() {
          // Dynamic normal approximation from screen gradients
          vec3 dx = dFdx(vWorldPos);
          vec3 dy = dFdy(vWorldPos);
          vec3 n = normalize(cross(dx, dy));

          // Soft light angles matching reference image
          vec3 lightDir1 = normalize(vec3(0.4, 0.8, 0.5));
          vec3 lightDir2 = normalize(vec3(-0.6, -0.2, 0.4));

          float diff1 = max(dot(n, lightDir1), 0.0);
          float diff2 = max(dot(n, lightDir2), 0.0);

          // Deep navy-to-ocean palette
          vec3 baseDark = vec3(0.035, 0.05, 0.11);
          vec3 midTone  = vec3(0.08, 0.13, 0.25);
          vec3 crest    = vec3(0.24, 0.38, 0.62);
          vec3 highlight= vec3(0.55, 0.72, 0.95);

          vec3 color = mix(baseDark, midTone, diff1 * 0.8);
          color = mix(color, crest, pow(diff1, 2.0) * 0.65);

          // Crest rim highlight
          float rim = 1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0);
          color += highlight * pow(rim, 3.2) * 0.5;

          // Depth fade
          float alpha = smoothstep(-40.0, 25.0, vElevation) * 0.55 + 0.15;
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });

    const fluidMesh = new THREE.Mesh(fluidGeom, fluidMaterial);
    fluidMesh.position.set(10, 10, -25);
    scene.add(fluidMesh);

    // -----------------------------------------------------------------
    // 2. CONTOUR WAVE RIBBON (The elegant S-curve parallel lines)
    // -----------------------------------------------------------------
    const RIBBON_LINES = isMobile ? 8 : 12;
    const LINE_POINTS = isMobile ? 60 : 150;

    const ribbonGeom = new THREE.BufferGeometry();
    const linePositions = [];
    const lineIndices = [];
    const lineAttributes = []; // stores normalized line index [-1 to 1]

    for (let l = 0; l < RIBBON_LINES; l++) {
      const lineNorm = (l / (RIBBON_LINES - 1) - 0.5) * 2.0; // -1.0 to 1.0
      const startIdx = l * LINE_POINTS;

      for (let p = 0; p < LINE_POINTS; p++) {
        const u = p / (LINE_POINTS - 1); // 0.0 to 1.0
        const x = (u - 0.5) * (isMobile ? 200 : 250);

        // Base S-curve path matching reference:
        // Enters from mid-left, dips into valley in center-right, curves back up
        const normX = x / 125.0; // -1 to 1
        const sCurve =
          Math.sin(normX * 2.4 - 0.4) * -16.0 -
          Math.cos(normX * 1.6) * 10.0 -
          8.0;

        const y = sCurve + lineNorm * 4.5;
        const z = -lineNorm * 3.5;

        linePositions.push(x, y, z);
        lineAttributes.push(lineNorm);

        if (p < LINE_POINTS - 1) {
          lineIndices.push(startIdx + p, startIdx + p + 1);
        }
      }
    }

    ribbonGeom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    ribbonGeom.setAttribute(
      "aLineNorm",
      new THREE.Float32BufferAttribute(lineAttributes, 1)
    );
    ribbonGeom.setIndex(lineIndices);

    const ribbonMaterial = new THREE.ShaderMaterial({
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
        attribute float aLineNorm;
        varying float vLineNorm;
        varying float vX;

        void main() {
          vec3 pos = position;
          vLineNorm = aLineNorm;
          vX = pos.x;

          float t = uTime * 0.9;
          // Harmonious travelling wave propagation along the ribbon
          float wave1 = sin(pos.x * 0.028 + t + aLineNorm * 0.4) * 4.5;
          float wave2 = cos(pos.x * 0.016 - t * 0.7 + aLineNorm * 0.3) * 3.0;

          pos.y += wave1 + wave2;
          pos.z += sin(pos.x * 0.02 + t * 0.6) * 6.0;

          // Mouse parallax response
          pos.x += uMouse.x * 6.0;
          pos.y += uMouse.y * 6.0;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying float vLineNorm;
        varying float vX;

        void main() {
          // Elegant cyan-to-white sheen
          vec3 c1 = vec3(0.18, 0.42, 0.78);
          vec3 c2 = vec3(0.55, 0.85, 1.0);
          vec3 c3 = vec3(0.92, 0.96, 1.0);

          float t = smoothstep(-80.0, 70.0, vX);
          vec3 color = mix(c1, c2, t);
          color = mix(color, c3, pow(t, 2.5) * 0.6);

          // Fade edges smoothly at left and right boundaries
          float edgeFade = smoothstep(-120.0, -70.0, vX) * (1.0 - smoothstep(70.0, 120.0, vX));
          float centerGlow = 1.0 - abs(vLineNorm) * 0.45;

          float alpha = centerGlow * edgeFade * 0.42;
          gl_FragColor = vec4(color * (1.1 + centerGlow * 0.3), alpha);
        }
      `,
    });

    const ribbonLines = new THREE.LineSegments(ribbonGeom, ribbonMaterial);
    ribbonLines.position.set(0, -6, 5);
    scene.add(ribbonLines);

    // -----------------------------------------------------------------
    // 3. FLOATING 3D SHAPES (Preserved wireframe icosahedra)
    // -----------------------------------------------------------------
    const shapes = [];
    const shapeGeom = new THREE.IcosahedronGeometry(3.5, 0);
    const shapeMat = new THREE.MeshBasicMaterial({
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      color: 0xffffff,
    });

    const shapeCount = isMobile ? 3 : 7;
    for (let i = 0; i < shapeCount; i++) {
      const mesh = new THREE.Mesh(shapeGeom, shapeMat);
      mesh.position.set(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 110,
        (Math.random() - 0.5) * 60 + 5
      );
      scene.add(mesh);
      shapes.push(mesh);
    }

    // -----------------------------------------------------------------
    // 4. PARTICLES (Subtle drifting dust)
    // -----------------------------------------------------------------
    let particles = null;
    if (showParticles) {
      const particleCount = isMobile ? 60 : 160;
      const pGeom = new THREE.BufferGeometry();
      const pPositions = [];

      for (let i = 0; i < particleCount; i++) {
        pPositions.push(
          (Math.random() - 0.5) * 260,
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 120
        );
      }

      pGeom.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(pPositions, 3)
      );

      const pMat = new THREE.PointsMaterial({
        size: isMobile ? 1.0 : 1.4,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        color: 0x88bbff,
      });

      particles = new THREE.Points(pGeom, pMat);
      scene.add(particles);
    }

    // -----------------------------------------------------------------
    // 5. MOUSE INTERACTION & ANIMATION LOOP
    // -----------------------------------------------------------------
    const target = new THREE.Vector2(0, 0);
    const smooth = new THREE.Vector2(0, 0);

    const updateMouse = (x, y) => {
      target.x = (x / window.innerWidth - 0.5) * 2;
      target.y = -(y / window.innerHeight - 0.5) * 2;
    };

    const onMouseMove = (e) => !isMobile && updateMouse(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (isMobile && e.touches.length) {
        updateMouse(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    let lastTime = performance.now();
    let animationId;

    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      animationId = requestAnimationFrame(animate);

      // Smooth mouse interpolation
      smooth.lerp(target, isMobile ? 0.03 : 0.05);

      // Pass time and mouse uniforms
      fluidMaterial.uniforms.uTime.value += delta;
      fluidMaterial.uniforms.uMouse.value.copy(smooth);

      ribbonMaterial.uniforms.uTime.value += delta;
      ribbonMaterial.uniforms.uMouse.value.copy(smooth);

      // Smooth camera parallax
      camera.position.x += (smooth.x * 12 - camera.position.x) * 0.04;
      camera.position.y += (smooth.y * 10 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Animate floating 3D shapes
      shapes.forEach((s, i) => {
        s.rotation.x += delta * 0.35;
        s.rotation.y += delta * 0.25;
        s.position.y += Math.sin(now * 0.0012 + i) * 0.025;
      });

      // Animate particles
      if (particles) {
        particles.rotation.y += delta * 0.015;
      }

      renderer.render(scene, camera);
    };

    animationId = animate();

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);

      renderer.dispose();
      fluidGeom.dispose();
      fluidMaterial.dispose();
      ribbonGeom.dispose();
      ribbonMaterial.dispose();
      shapeGeom.dispose();
      shapeMat.dispose();

      if (
        ref.current &&
        renderer.domElement &&
        ref.current.contains(renderer.domElement)
      ) {
        ref.current.removeChild(renderer.domElement);
      }
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
        zIndex: 1,
      }}
    />
  );
};

export default AnimatedWireframeBg;
