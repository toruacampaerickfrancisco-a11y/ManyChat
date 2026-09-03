import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function AvatarTorre3D({ 
  isSpeaking = false, 
  mouthOpen = false,
  imageClosed = '/avatar-torre/Avatar_Torre_Diagrama_V2.jpg',
  imageOpen = '/avatar-torre/Avatar_Torre_Hablando.jpg'
}) {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. CONFIGURACIÓN DE ESCENA THREE.JS ---
    const scene = new THREE.Scene();

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // --- 2. ILUMINACIÓN DINÁMICA ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
    sunLight.position.set(2, 3, 4);
    scene.add(sunLight);

    const cyanLight = new THREE.PointLight(0x00d2ff, 2.5, 6);
    cyanLight.position.set(-1.2, 0.5, 1.2);
    scene.add(cyanLight);

    const orangeLight = new THREE.PointLight(0xff7700, 2.5, 6);
    orangeLight.position.set(1.2, -0.5, 1.2);
    scene.add(orangeLight);

    // --- 3. CARGA DE TEXTURAS EN ALTA DEFINICIÓN (IMÁGENES REALES) ---
    const textureLoader = new THREE.TextureLoader();
    const planeGroup = new THREE.Group();
    scene.add(planeGroup);

    let matClosed = null;
    let matOpen = null;
    let meshClosed = null;
    let meshOpen = null;

    const geometry = new THREE.PlaneGeometry(2.4, 2.4, 32, 32);

    textureLoader.load(imageClosed, (texClosed) => {
      texClosed.colorSpace = THREE.SRGBColorSpace;
      matClosed = new THREE.MeshStandardMaterial({
        map: texClosed,
        roughness: 0.35,
        metalness: 0.15,
        transparent: true,
        opacity: 1
      });
      meshClosed = new THREE.Mesh(geometry, matClosed);
      planeGroup.add(meshClosed);

      textureLoader.load(imageOpen, (texOpen) => {
        texOpen.colorSpace = THREE.SRGBColorSpace;
        matOpen = new THREE.MeshStandardMaterial({
          map: texOpen,
          roughness: 0.35,
          metalness: 0.15,
          transparent: true,
          opacity: 0
        });
        meshOpen = new THREE.Mesh(geometry, matOpen);
        meshOpen.position.z = 0.005; // Ligeramente adelante para evitar z-fighting
        planeGroup.add(meshOpen);
        setIsLoaded(true);
      });
    });

    // --- 4. SISTEMA DE RAYOS DE ALTA TENSIÓN 3D ---
    const lightningGroup = new THREE.Group();
    scene.add(lightningGroup);

    const createLightningLine = (color = 0x00f2fe) => {
      const lineGeom = new THREE.BufferGeometry();
      const points = new Float32Array(18 * 3);
      lineGeom.setAttribute('position', new THREE.BufferAttribute(points, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: color,
        linewidth: 2.5,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      return new THREE.Line(lineGeom, lineMat);
    };

    const leftBolt = createLightningLine(0x00f2fe);
    const rightBolt = createLightningLine(0xffaa00);
    lightningGroup.add(leftBolt);
    lightningGroup.add(rightBolt);

    const updateBolt = (lineMesh, startX, startY, endX, endY) => {
      const positions = lineMesh.geometry.attributes.position.array;
      const count = positions.length / 3;
      for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const jitterX = (Math.random() - 0.5) * (t > 0 && t < 1 ? 0.08 : 0);
        const jitterY = (Math.random() - 0.5) * (t > 0 && t < 1 ? 0.08 : 0);
        positions[i * 3] = THREE.MathUtils.lerp(startX, endX, t) + jitterX;
        positions[i * 3 + 1] = THREE.MathUtils.lerp(startY, endY, t) + jitterY;
        positions[i * 3 + 2] = 0.1 + (Math.random() - 0.5) * 0.04;
      }
      lineMesh.geometry.attributes.position.needsUpdate = true;
    };

    // Partículas de chispas
    const particleCount = 45;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 2.6;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 2.6;
      particlePositions[i * 3 + 2] = 0.05 + Math.random() * 0.4;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00d2ff,
      size: 0.04,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // --- 5. INTERACCIÓN DE PERSPECTIVA 3D Y PARALLAX ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotY = x * 0.35; // Inclinación en 3D
      targetRotX = -y * 0.25;
    };

    const handleMouseLeave = () => {
      mouseX = 0;
      mouseY = 0;
      targetRotY = 0;
      targetRotX = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // --- 6. BUCLE DE RENDERIZADO Y LIP-SYNC ---
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Parallax 3D suave con inercia
      planeGroup.rotation.y = THREE.MathUtils.lerp(planeGroup.rotation.y, targetRotY, 0.08);
      planeGroup.rotation.x = THREE.MathUtils.lerp(planeGroup.rotation.x, targetRotX, 0.08);

      // Respiración sutil
      planeGroup.position.y = Math.sin(t * 1.6) * 0.025;
      planeGroup.position.z = Math.cos(t * 1.6) * 0.015;

      // Luz sigue al ratón
      cyanLight.position.x = -1.2 + mouseX * 0.8;
      cyanLight.position.y = 0.5 + mouseY * 0.8;
      orangeLight.position.x = 1.2 + mouseX * 0.8;

      // Sincronización Labial (Lip-Sync con el render exacto)
      if (meshClosed && meshOpen) {
        if (isSpeaking) {
          // Modulación rápida entre boca abierta y cerrada
          const isMouthOpenNow = Math.sin(t * 18) > -0.2;
          meshOpen.material.opacity = isMouthOpenNow ? 1 : 0;
          meshClosed.material.opacity = isMouthOpenNow ? 0 : 1;

          // Destellos en los cables de los aisladores
          leftBolt.visible = Math.random() > 0.3;
          rightBolt.visible = Math.random() > 0.3;
          if (leftBolt.visible) {
            updateBolt(leftBolt, -0.65, 0.45, -1.15, 0.35);
          }
          if (rightBolt.visible) {
            updateBolt(rightBolt, 0.65, 0.45, 1.15, 0.35);
          }

          cyanLight.intensity = 3.5 + Math.sin(t * 22) * 2.0;
        } else {
          meshOpen.material.opacity = 0;
          meshClosed.material.opacity = 1;
          leftBolt.visible = false;
          rightBolt.visible = false;
          cyanLight.intensity = 1.8;
        }
      }

      // Animación de partículas de plasma flotantes
      const pArr = particleGeom.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pArr[i * 3 + 1] += 0.004;
        if (pArr[i * 3 + 1] > 1.3) pArr[i * 3 + 1] = -1.3;
      }
      particleGeom.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isSpeaking, imageClosed, imageOpen]);

  return (
    <div className="relative w-full h-full min-h-[340px] sm:min-h-[390px] flex items-center justify-center cursor-pointer select-none">
      <div ref={containerRef} className="w-full h-full absolute inset-0" />
      
      {/* Badge de Render Pixar HD */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-[10px] font-black text-cyan-300 flex items-center gap-1.5 shadow-xl">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        Render Pixar HD 3D • Mueve el ratón
      </div>
    </div>
  );
}
