import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function AvatarTorre3D({ 
  isSpeaking = false, 
  mouthOpen = false,
  imageClosed = '/avatar-torre/Avatar_Torre_Diagrama_V2.jpg',
  imageOpen = '/avatar-torre/Avatar_Torre_Hablando.jpg',
  modelPath = '/avatar-torre/torre_avatar.glb'
}) {
  const containerRef = useRef(null);
  const [modelMode, setModelMode] = useState('loading'); // 'glb' | 'parallax'

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. CONFIGURACIÓN DE ESCENA THREE.JS ---
    const scene = new THREE.Scene();

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // --- 2. ILUMINACIÓN DE ESTUDIO 3D ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xfffaed, 2.5);
    mainSun.position.set(3, 5, 4);
    scene.add(mainSun);

    const blueFill = new THREE.DirectionalLight(0x38bdf8, 1.5);
    blueFill.position.set(-4, 2, 2);
    scene.add(blueFill);

    const orangeRim = new THREE.DirectionalLight(0xff8800, 2.0);
    orangeRim.position.set(0, -3, -3);
    scene.add(orangeRim);

    // Luces de alta tensión pulsantes
    const sparkLightLeft = new THREE.PointLight(0x00f2fe, 3, 5);
    sparkLightLeft.position.set(-1.4, 0.5, 0.8);
    scene.add(sparkLightLeft);

    const sparkLightRight = new THREE.PointLight(0xff7700, 3, 5);
    sparkLightRight.position.set(1.4, -0.4, 0.8);
    scene.add(sparkLightRight);

    // --- 3. GRUPO PRINCIPAL ---
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    let mixer = null;
    let glbLoaded = false;
    let meshClosed = null;
    let meshOpen = null;

    // Cargar modelo .GLB si existe
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      modelPath,
      (gltf) => {
        glbLoaded = true;
        setModelMode('glb');
        const model = gltf.scene;
        
        // Centrar y ajustar escala automáticamente
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.4 / (maxDim || 1);
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));
        model.position.y -= 0.1;

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = Math.min(child.material.roughness, 0.4);
              child.material.metalness = Math.max(child.material.metalness, 0.2);
            }
          }
        });

        mainGroup.add(model);

        // Animaciones integradas del modelo
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }
      },
      undefined,
      (error) => {
        // Fallback a Parallax HD con texturas del usuario
        setModelMode('parallax');
        const textureLoader = new THREE.TextureLoader();
        const geometry = new THREE.PlaneGeometry(2.4, 2.4, 32, 32);

        textureLoader.load(imageClosed, (texClosed) => {
          texClosed.colorSpace = THREE.SRGBColorSpace;
          const matClosed = new THREE.MeshStandardMaterial({
            map: texClosed,
            roughness: 0.35,
            metalness: 0.15,
            transparent: true,
            opacity: 1
          });
          meshClosed = new THREE.Mesh(geometry, matClosed);
          mainGroup.add(meshClosed);

          textureLoader.load(imageOpen, (texOpen) => {
            texOpen.colorSpace = THREE.SRGBColorSpace;
            const matOpen = new THREE.MeshStandardMaterial({
              map: texOpen,
              roughness: 0.35,
              metalness: 0.15,
              transparent: true,
              opacity: 0
            });
            meshOpen = new THREE.Mesh(geometry, matOpen);
            meshOpen.position.z = 0.005;
            mainGroup.add(meshOpen);
          });
        });
      }
    );

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

    // Partículas de plasma
    const particleCount = 40;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 2.8;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 2.8;
      particlePositions[i * 3 + 2] = 0.05 + Math.random() * 0.5;
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

    // --- 5. INTERACCIÓN DE ROTACIÓN Y PARALLAX 360° ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;

      if (isDragging) {
        const deltaX = e.clientX - prevX;
        const deltaY = e.clientY - prevY;
        targetRotY += deltaX * 0.012;
        targetRotX += deltaY * 0.008;
      } else {
        targetRotY = THREE.MathUtils.lerp(targetRotY, x * 0.45, 0.1);
        targetRotX = THREE.MathUtils.lerp(targetRotX, -y * 0.3, 0.1);
      }
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const handleMouseDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // --- 6. BUCLE DE ANIMACIÓN Y RENDERIZADO ---
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const t = clock.getElapsedTime();

      if (mixer) mixer.update(delta);

      // --- ANIMACIÓN PROCEDURAL VIVA DEL MODELO 3D ---
      if (isSpeaking) {
        // Gesticulación de habla y presentación
        const talkSwayZ = Math.sin(t * 6.5) * 0.045;
        const talkNodX = Math.sin(t * 11) * 0.035;
        const talkBounceY = Math.sin(t * 14) * 0.03;

        mainGroup.position.y = -0.05 + Math.sin(t * 2.5) * 0.05 + talkBounceY;
        mainGroup.rotation.z = THREE.MathUtils.lerp(mainGroup.rotation.z, talkSwayZ, 0.1);
        mainGroup.rotation.x = THREE.MathUtils.lerp(mainGroup.rotation.x, targetRotX + talkNodX, 0.1);
        mainGroup.rotation.y = THREE.MathUtils.lerp(mainGroup.rotation.y, targetRotY + Math.sin(t * 3.5) * 0.03, 0.08);

        // Pulsos de energía al hablar
        sparkLightLeft.intensity = 3.8 + Math.sin(t * 22) * 2.5;
        sparkLightRight.intensity = 3.8 + Math.cos(t * 19) * 2.5;
      } else {
        // Movimiento de respiración y flotación en reposo
        const idleFloatY = Math.sin(t * 1.8) * 0.04;
        const idleSwayZ = Math.sin(t * 1.2) * 0.015;

        mainGroup.position.y = -0.05 + idleFloatY;
        mainGroup.rotation.z = THREE.MathUtils.lerp(mainGroup.rotation.z, idleSwayZ, 0.08);
        mainGroup.rotation.x = THREE.MathUtils.lerp(mainGroup.rotation.x, targetRotX, 0.08);
        mainGroup.rotation.y = THREE.MathUtils.lerp(mainGroup.rotation.y, targetRotY, 0.08);

        sparkLightLeft.intensity = 2.0;
        sparkLightRight.intensity = 2.0;
      }

      // Luces dinámicas siguiendo el cursor
      sparkLightLeft.position.x = -1.4 + mouseX * 0.6;
      sparkLightLeft.position.y = 0.5 + mouseY * 0.6;

      // Sincronización Labial y Rayos (Modo Parallax)
      if (meshClosed && meshOpen) {
        if (isSpeaking) {
          const isMouthOpenNow = Math.sin(t * 18) > -0.2;
          meshOpen.material.opacity = isMouthOpenNow ? 1 : 0;
          meshClosed.material.opacity = isMouthOpenNow ? 0 : 1;

          leftBolt.visible = Math.random() > 0.35;
          rightBolt.visible = Math.random() > 0.35;
          if (leftBolt.visible) updateBolt(leftBolt, -0.65, 0.45, -1.15, 0.35);
          if (rightBolt.visible) updateBolt(rightBolt, 0.65, 0.45, 1.15, 0.35);
        } else {
          meshOpen.material.opacity = 0;
          meshClosed.material.opacity = 1;
          leftBolt.visible = false;
          rightBolt.visible = false;
        }
      }

      // Animación de partículas de plasma
      const pArr = particleGeom.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pArr[i * 3 + 1] += 0.005;
        if (pArr[i * 3 + 1] > 1.4) pArr[i * 3 + 1] = -1.4;
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
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isSpeaking, imageClosed, imageOpen, modelPath]);

  return (
    <div className="relative w-full h-full min-h-[340px] sm:min-h-[390px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
      <div ref={containerRef} className="w-full h-full absolute inset-0" />
      
      {/* Badge de Estado del Render */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-[10px] font-black text-cyan-300 flex items-center gap-1.5 shadow-xl">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        {modelMode === 'glb' ? 'Modelo 3D GLB • Rotación 360°' : 'Render Pixar HD 3D • Mueve el ratón'}
      </div>
    </div>
  );
}
