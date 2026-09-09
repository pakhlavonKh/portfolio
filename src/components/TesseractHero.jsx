import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * 4D Tesseract (Hypercube) & Floating 3D Micro-Geometry Hero Visual
 *
 * - 16 vertices: combinations of (±1, ±1, ±1, ±1) in 4D Euclidean space
 * - 32 edges: connects vertices differing by Hamming distance of 1
 * - Real 4D rotations through the X-W and Z-W planes
 * - 4D perspective projection down to 3D creating the "cube within a cube" morph
 * - Rendered with Three.js using metallic spheres & cylinders
 * - Complementary floating 3D micro-shapes (octahedrons, icosahedrons, tetrahedrons, tori)
 * - Positioned cleanly to the right side of the hero section, responsive, pointer-events: none
 */
const TesseractHero = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 1. Generate 16 4D Vertices (x, y, z, w in {-1, 1})
    const vertices4D = [];
    for (let x = -1; x <= 1; x += 2) {
      for (let y = -1; y <= 1; y += 2) {
        for (let z = -1; z <= 1; z += 2) {
          for (let w = -1; w <= 1; w += 2) {
            vertices4D.push([x, y, z, w]);
          }
        }
      }
    }

    // 2. Generate 32 4D Edges (differ by exactly one coordinate)
    const edges = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        let diffCount = 0;
        for (let k = 0; k < 4; k++) {
          if (vertices4D[i][k] !== vertices4D[j][k]) {
            diffCount++;
          }
        }
        if (diffCount === 1) {
          edges.push([i, j]);
        }
      }
    }

    // 3. Three.js Scene Setup
    const scene = new THREE.Scene();

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const canvas = renderer.domElement;
    canvas.className = "tesseract-hero-canvas";
    container.appendChild(canvas);

    // 4. Materials & Geometries for Tesseract
    const metallicMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8d3de,
      metalness: 0.88,
      roughness: 0.26,
      envMapIntensity: 0.9,
    });

    const sphereGeometry = new THREE.SphereGeometry(0.16, 16, 16);
    const cylinderGeometry = new THREE.CylinderGeometry(0.046, 0.046, 1, 12);
    const upVector = new THREE.Vector3(0, 1, 0);

    // Tesseract container group
    const tesseractGroup = new THREE.Group();
    scene.add(tesseractGroup);

    // Responsive offset: placed comfortably further to the right on desktop, framing text
    const updateGroupPosition = (w) => {
      if (w >= 1200) {
        tesseractGroup.position.set(5.8, 0.1, 0);
        tesseractGroup.scale.set(1.25, 1.25, 1.25);
      } else if (w >= 900) {
        tesseractGroup.position.set(4.8, 0.1, 0);
        tesseractGroup.scale.set(1.12, 1.12, 1.12);
      } else if (w >= 700) {
        tesseractGroup.position.set(3.4, -0.2, -0.5);
        tesseractGroup.scale.set(0.95, 0.95, 0.95);
      } else {
        tesseractGroup.position.set(0, -1.0, -1.8);
        tesseractGroup.scale.set(0.85, 0.85, 0.85);
      }
    };
    updateGroupPosition(width);

    // Create 16 vertex sphere meshes
    const vertexMeshes = [];
    for (let i = 0; i < 16; i++) {
      const sphere = new THREE.Mesh(sphereGeometry, metallicMaterial);
      tesseractGroup.add(sphere);
      vertexMeshes.push(sphere);
    }

    // Create 32 edge cylinder meshes
    const edgeMeshes = [];
    for (let i = 0; i < 32; i++) {
      const cylinder = new THREE.Mesh(cylinderGeometry, metallicMaterial);
      tesseractGroup.add(cylinder);
      edgeMeshes.push(cylinder);
    }

    // -------------------------------------------------------------
    // 5. Small Floating 3D Shapes
    // -------------------------------------------------------------
    const shapesGroup = new THREE.Group();
    scene.add(shapesGroup);

    const smallChromeMat = new THREE.MeshStandardMaterial({
      color: 0xd8e4f2,
      metalness: 0.92,
      roughness: 0.22,
    });

    const smallCyanMat = new THREE.MeshStandardMaterial({
      color: 0x64ffda,
      metalness: 0.82,
      roughness: 0.32,
      emissive: 0x103830,
      emissiveIntensity: 0.4,
    });

    const smallWireMat = new THREE.MeshStandardMaterial({
      color: 0x4da6ff,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });

    const octaGeo = new THREE.OctahedronGeometry(0.28, 0);
    const tetraGeo = new THREE.TetrahedronGeometry(0.32, 0);
    const icosaGeo = new THREE.IcosahedronGeometry(0.24, 0);
    const torusGeo = new THREE.TorusGeometry(0.26, 0.07, 10, 20);
    const boxGeo = new THREE.BoxGeometry(0.32, 0.32, 0.32);

    // Array of small floating shapes with organic position offsets and drift rates
    const shapeConfigs = [
      { geo: octaGeo, mat: smallChromeMat, pos: [6.8, 2.8, -1.2], scale: 1.1, rot: [0.012, 0.018, 0.008], float: [0.9, 0.45, 0.2] },
      { geo: tetraGeo, mat: smallCyanMat, pos: [3.8, 3.2, 1.0], scale: 0.85, rot: [-0.015, 0.012, -0.01], float: [1.2, 0.38, 1.4] },
      { geo: torusGeo, mat: smallChromeMat, pos: [7.2, -2.4, 0.5], scale: 1.0, rot: [0.018, -0.014, 0.02], float: [0.8, 0.52, 2.6] },
      { geo: icosaGeo, mat: smallWireMat, pos: [4.4, -3.1, -0.8], scale: 1.25, rot: [0.009, 0.022, -0.015], float: [1.1, 0.42, 3.8] },
      { geo: boxGeo, mat: smallCyanMat, pos: [8.2, 0.4, -2.0], scale: 0.9, rot: [0.016, 0.016, 0.012], float: [0.75, 0.48, 0.9] },
      { geo: octaGeo, mat: smallWireMat, pos: [2.6, 2.4, -1.8], scale: 0.8, rot: [-0.018, 0.01, 0.014], float: [1.3, 0.35, 4.2] },
      { geo: tetraGeo, mat: smallChromeMat, pos: [7.8, -1.2, 1.8], scale: 0.95, rot: [0.014, -0.018, 0.01], float: [0.95, 0.4, 5.1] },
      { geo: torusGeo, mat: smallCyanMat, pos: [3.2, -2.2, 1.2], scale: 0.8, rot: [-0.012, 0.02, 0.016], float: [1.05, 0.36, 1.8] },
      { geo: icosaGeo, mat: smallChromeMat, pos: [-6.8, 2.2, -2.5], scale: 0.9, rot: [0.01, 0.015, -0.012], float: [0.85, 0.44, 3.1] },
      { geo: octaGeo, mat: smallCyanMat, pos: [-5.8, -2.6, -1.5], scale: 0.85, rot: [0.014, -0.012, 0.018], float: [1.15, 0.38, 0.5] },
    ];

    const smallMeshes = shapeConfigs.map((cfg) => {
      const mesh = new THREE.Mesh(cfg.geo, cfg.mat);
      mesh.position.set(...cfg.pos);
      mesh.scale.set(cfg.scale, cfg.scale, cfg.scale);
      shapesGroup.add(mesh);
      return {
        mesh,
        baseX: cfg.pos[0],
        baseY: cfg.pos[1],
        baseZ: cfg.pos[2],
        rotX: cfg.rot[0],
        rotY: cfg.rot[1],
        rotZ: cfg.rot[2],
        floatSpeed: cfg.float[0],
        floatAmp: cfg.float[1],
        phase: cfg.float[2],
      };
    });

    // 6. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x162036, 0.95);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 4.8);
    spotLight.position.set(12, 16, 14);
    spotLight.angle = Math.PI / 4.5;
    spotLight.penumbra = 0.7;
    scene.add(spotLight);

    const rimLight = new THREE.DirectionalLight(0x4da6ff, 3.4);
    rimLight.position.set(-14, -8, -8);
    scene.add(rimLight);

    const accentFill = new THREE.PointLight(0x64ffda, 1.6, 40);
    accentFill.position.set(6, -6, 6);
    scene.add(accentFill);

    // 7. 4D Rotation & Projection Loop
    const projected3D = Array.from({ length: 16 }, () => new THREE.Vector3());
    const tempDiff = new THREE.Vector3();
    const tempDir = new THREE.Vector3();
    const tempQuat = new THREE.Quaternion();

    let animationId = null;
    let isVisible = true;
    const startTime = performance.now();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const render = (time) => {
      animationId = requestAnimationFrame(render);
      if (!isVisible) return;

      const elapsed = (time - startTime) * 0.001;

      // 4D continuous rotations
      const thetaXW = prefersReducedMotion ? 0.3 : elapsed * 0.42;
      const phiZW = prefersReducedMotion ? 0.4 : elapsed * 0.31;
      const tilt3D = elapsed * 0.12;

      const cosXW = Math.cos(thetaXW);
      const sinXW = Math.sin(thetaXW);
      const cosZW = Math.cos(phiZW);
      const sinZW = Math.sin(phiZW);
      const cosTilt = Math.cos(tilt3D);
      const sinTilt = Math.sin(tilt3D);

      const D = 2.9;
      const baseScale = 3.35;

      // Project each of the 16 vertices from 4D -> 3D
      for (let i = 0; i < 16; i++) {
        let [x, y, z, w] = vertices4D[i];

        const x1 = x * cosXW - w * sinXW;
        const w1 = x * sinXW + w * cosXW;

        const z2 = z * cosZW - w1 * sinZW;
        const w2 = z * sinZW + w1 * cosZW;

        const x3 = x1 * cosTilt - y * sinTilt;
        const y3 = x1 * sinTilt + y * cosTilt;
        const z3 = z2;

        const wFactor = 1 / (D - w2);

        projected3D[i].set(
          x3 * wFactor * baseScale,
          y3 * wFactor * baseScale,
          z3 * wFactor * baseScale
        );

        vertexMeshes[i].position.copy(projected3D[i]);
      }

      // Update 32 edge cylinders
      for (let i = 0; i < 32; i++) {
        const [idxA, idxB] = edges[i];
        const vA = projected3D[idxA];
        const vB = projected3D[idxB];

        const cylinder = edgeMeshes[i];
        cylinder.position.set(
          (vA.x + vB.x) * 0.5,
          (vA.y + vB.y) * 0.5,
          (vA.z + vB.z) * 0.5
        );

        tempDiff.subVectors(vB, vA);
        const edgeLength = tempDiff.length();
        cylinder.scale.set(1, Math.max(edgeLength, 0.001), 1);

        tempDir.copy(tempDiff).normalize();
        tempQuat.setFromUnitVectors(upVector, tempDir);
        cylinder.quaternion.copy(tempQuat);
      }

      // Tesseract group slow drift
      tesseractGroup.rotation.y = elapsed * 0.08;
      tesseractGroup.rotation.x = Math.sin(elapsed * 0.15) * 0.1;

      // Animate small 3D floating shapes
      if (!prefersReducedMotion) {
        for (let i = 0; i < smallMeshes.length; i++) {
          const s = smallMeshes[i];
          s.mesh.rotation.x += s.rotX;
          s.mesh.rotation.y += s.rotY;
          s.mesh.rotation.z += s.rotZ;

          s.mesh.position.y =
            s.baseY + Math.sin(elapsed * s.floatSpeed + s.phase) * s.floatAmp;
          s.mesh.position.x =
            s.baseX +
            Math.cos(elapsed * (s.floatSpeed * 0.7) + s.phase) *
              (s.floatAmp * 0.4);
        }
      }

      renderer.render(scene, camera);
    };

    animationId = requestAnimationFrame(render);

    // 8. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      updateGroupPosition(newWidth);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // 9. Cleanup
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);

      sphereGeometry.dispose();
      cylinderGeometry.dispose();
      metallicMaterial.dispose();

      octaGeo.dispose();
      tetraGeo.dispose();
      icosaGeo.dispose();
      torusGeo.dispose();
      boxGeo.dispose();
      smallChromeMat.dispose();
      smallCyanMat.dispose();
      smallWireMat.dispose();

      renderer.dispose();

      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
      aria-hidden="true"
    />
  );
};

export default TesseractHero;
