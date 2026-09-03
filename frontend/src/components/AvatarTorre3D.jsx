import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AvatarTorre3D({ isSpeaking = false, mouthOpen = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. CONFIGURACIÓN DE LA ESCENA 3D ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040914, 0.045);

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- 2. ILUMINACIÓN AMBIENTAL Y VOLTAJE ---
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00d2ff, 3.5);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00b067, 3.0);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Luces de alta tensión pulsantes
    const plasmaLight = new THREE.PointLight(0x00d2ff, 4, 8);
    plasmaLight.position.set(0, 1.8, 0.5);
    scene.add(plasmaLight);

    const coronaLight = new THREE.PointLight(0x00ff88, 3, 6);
    coronaLight.position.set(0, 0.2, 0.5);
    scene.add(coronaLight);

    // --- 3. GRUPO PRINCIPAL DE LA TORRE Y AVATAR ---
    const towerGroup = new THREE.Group();
    scene.add(towerGroup);

    // Materiales
    const steelMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false
    });

    const insulatorMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Rojo aislador CFE
      metalness: 0.3,
      roughness: 0.15,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.3
    });

    const energyMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true
    });

    const glowLineMaterial = new THREE.LineBasicMaterial({
      color: 0x00d2ff,
      linewidth: 2
    });

    // Helper: Crear barra de celosía
    const createBeam = (p1, p2, radius = 0.025, mat = steelMaterial) => {
      const distance = p1.distanceTo(p2);
      const geom = new THREE.CylinderGeometry(radius, radius, distance, 6);
      const mesh = new THREE.Mesh(geom, mat);
      
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      mesh.position.copy(mid);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
      return mesh;
    };

    // A. CUERPO TRONCOPIRAMIDAL DE CELOSÍA (Torre 400kV)
    const baseW = 1.1;
    const midW = 0.55;
    const topW = 0.35;
    const baseH = -1.8;
    const midH = 0.3;
    const topH = 1.9;

    // 4 Postes principales (esquineros)
    const p1 = new THREE.Vector3(-baseW, baseH, -baseW);
    const p2 = new THREE.Vector3(baseW, baseH, -baseW);
    const p3 = new THREE.Vector3(baseW, baseH, baseW);
    const p4 = new THREE.Vector3(-baseW, baseH, baseW);

    const m1 = new THREE.Vector3(-midW, midH, -midW);
    const m2 = new THREE.Vector3(midW, midH, -midW);
    const m3 = new THREE.Vector3(midW, midH, midW);
    const m4 = new THREE.Vector3(-midW, midH, midW);

    const t1 = new THREE.Vector3(-topW, topH, -topW);
    const t2 = new THREE.Vector3(topW, topH, -topW);
    const t3 = new THREE.Vector3(topW, topH, topW);
    const t4 = new THREE.Vector3(-topW, topH, topW);

    // Columnas base a medio
    towerGroup.add(createBeam(p1, m1, 0.035));
    towerGroup.add(createBeam(p2, m2, 0.035));
    towerGroup.add(createBeam(p3, m3, 0.035));
    towerGroup.add(createBeam(p4, m4, 0.035));

    // Columnas medio a tope
    towerGroup.add(createBeam(m1, t1, 0.03));
    towerGroup.add(createBeam(m2, t2, 0.03));
    towerGroup.add(createBeam(m3, t3, 0.03));
    towerGroup.add(createBeam(m4, t4, 0.03));

    // Travesaños horizontales y diagonales en X
    const addLatticeBox = (b1, b2, b3, b4, u1, u2, u3, u4) => {
      towerGroup.add(createBeam(b1, b2));
      towerGroup.add(createBeam(b2, b3));
      towerGroup.add(createBeam(b3, b4));
      towerGroup.add(createBeam(b4, b1));

      // Diagonales X front/back
      towerGroup.add(createBeam(b4, u3, 0.015));
      towerGroup.add(createBeam(b3, u4, 0.015));
      towerGroup.add(createBeam(b1, u2, 0.015));
      towerGroup.add(createBeam(b2, u1, 0.015));

      // Diagonales laterales
      towerGroup.add(createBeam(b1, u4, 0.015));
      towerGroup.add(createBeam(b4, u1, 0.015));
      towerGroup.add(createBeam(b2, u3, 0.015));
      towerGroup.add(createBeam(b3, u2, 0.015));
    };

    addLatticeBox(p1, p2, p3, p4, m1, m2, m3, m4);
    addLatticeBox(m1, m2, m3, m4, t1, t2, t3, t4);

    // B. CRUCETAS DE ALTA TENSIÓN (Brazos de soporte de conductores)
    const armLevels = [
      { y: 1.4, span: 1.45 },
      { y: 0.9, span: 1.75 },
      { y: 0.4, span: 1.55 }
    ];

    const insulatorMeshes = [];

    armLevels.forEach((arm, idx) => {
      const leftTip = new THREE.Vector3(-arm.span, arm.y, 0);
      const rightTip = new THREE.Vector3(arm.span, arm.y, 0);
      const centerBack = new THREE.Vector3(0, arm.y, 0);

      towerGroup.add(createBeam(leftTip, rightTip, 0.028));
      towerGroup.add(createBeam(leftTip, new THREE.Vector3(0, arm.y + 0.35, 0), 0.02));
      towerGroup.add(createBeam(rightTip, new THREE.Vector3(0, arm.y + 0.35, 0), 0.02));

      // Cadenas de aisladores colgantes (rojo CFE)
      const createInsulatorString = (pos) => {
        const insGroup = new THREE.Group();
        insGroup.position.copy(pos);
        for (let i = 0; i < 5; i++) {
          const disc = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08 - i * 0.005, 0.06 - i * 0.005, 0.035, 12),
            insulatorMaterial
          );
          disc.position.y = -i * 0.055;
          insGroup.add(disc);
        }
        
        // Conductor terminal con aura de plasma
        const tipSphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.5 })
        );
        tipSphere.position.y = -0.3;
        insGroup.add(tipSphere);

        towerGroup.add(insGroup);
        insulatorMeshes.push(insGroup);
      };

      createInsulatorString(leftTip);
      createInsulatorString(rightTip);
    });

    // C. ROSTRO Y CABEZA 3D DEL AVATAR (Integrado en el cuerpo superior)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.25, 0.3);
    towerGroup.add(headGroup);

    // Placa frontal de visualización (Chasis inteligente)
    const visorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.42, 0.15),
      new THREE.MeshStandardMaterial({
        color: 0x091428,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x003366,
        emissiveIntensity: 0.3
      })
    );
    headGroup.add(visorMesh);

    // Ojos 3D Luminosos (Azul Eléctrico)
    const eyeGeom = new THREE.CapsuleGeometry(0.045, 0.06, 8, 12);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00d2ff,
      emissiveIntensity: 2.5
    });

    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(-0.11, 0.06, 0.09);
    leftEye.rotation.z = 0.1;
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    rightEye.position.set(0.11, 0.06, 0.09);
    rightEye.rotation.z = -0.1;
    headGroup.add(rightEye);

    // Cejas Holográficas
    const browGeom = new THREE.BoxGeometry(0.1, 0.015, 0.02);
    const browMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.2 });
    
    const leftBrow = new THREE.Mesh(browGeom, browMat);
    leftBrow.position.set(-0.11, 0.14, 0.09);
    leftBrow.rotation.z = 0.15;
    headGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeom, browMat);
    rightBrow.position.set(0.11, 0.14, 0.09);
    rightBrow.rotation.z = -0.15;
    headGroup.add(rightBrow);

    // Boca 3D con apertura reactiva al habla
    const mouthGeom = new THREE.BoxGeometry(0.16, 0.035, 0.03);
    const mouthMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00d2ff,
      emissiveIntensity: 2.2
    });
    const mouthMesh = new THREE.Mesh(mouthGeom, mouthMat);
    mouthMesh.position.set(0, -0.08, 0.09);
    headGroup.add(mouthMesh);

    // Casco de Seguridad CFE 3D
    const helmetGroup = new THREE.Group();
    const helmetDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.2 })
    );
    helmetDome.position.y = 0.2;
    helmetGroup.add(helmetDome);

    const helmetBrim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.34, 0.025, 16),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 })
    );
    helmetBrim.position.y = 0.2;
    helmetGroup.add(helmetBrim);

    // Insignia CFE verde en el casco
    const logoCFE = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.05, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x007848, emissive: 0x00b067, emissiveIntensity: 0.8 })
    );
    logoCFE.position.set(0, 0.3, 0.25);
    helmetGroup.add(logoCFE);

    headGroup.add(helmetGroup);

    // D. SISTEMA DE PARTÍCULAS DE ALTA TENSIÓN (Rayos y Plasma)
    const particleCount = 180;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
      speeds[i] = 0.02 + Math.random() * 0.04;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00d2ff,
      size: 0.045,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    scene.add(particleSystem);

    // Anillo de Plasma Rotativo
    const ringGeom = new THREE.TorusGeometry(1.6, 0.02, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = Math.PI * 0.5;
    ringMesh.position.y = 0.8;
    scene.add(ringMesh);

    // --- 4. INTERACCIÓN CON EL RATÓN / SEGUIMIENTO OCULAR ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;

      if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;
        targetRotationY += deltaX * 0.012;
        targetRotationX += deltaY * 0.008;
      }
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch events para móviles
    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
      }
    };
    container.addEventListener('touchmove', handleTouchMove);

    // --- 5. BUCLE DE ANIMACIÓN Y RENDERIZADO ---
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotación suave con inercia hacia el objetivo
      if (!isDragging) {
        targetRotationY += 0.003; // Auto-rotación sutil
      }
      towerGroup.rotation.y = THREE.MathUtils.lerp(towerGroup.rotation.y, targetRotationY, 0.08);
      towerGroup.rotation.x = THREE.MathUtils.lerp(towerGroup.rotation.x, targetRotationX * 0.3, 0.08);

      // Seguimiento de cabeza y ojos hacia el cursor
      headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, mouseX * 0.4, 0.1);
      headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, -mouseY * 0.3, 0.1);
      leftEye.position.x = THREE.MathUtils.lerp(leftEye.position.x, -0.11 + mouseX * 0.02, 0.15);
      rightEye.position.x = THREE.MathUtils.lerp(rightEye.position.x, 0.11 + mouseX * 0.02, 0.15);

      // Animación de respiración / flotación de la torre
      towerGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.06;

      // Animación de habla / sincronización labial 3D
      if (isSpeaking) {
        const mouthScaleY = 1.0 + Math.sin(elapsedTime * 18) * 1.8;
        const mouthScaleX = 1.0 + Math.cos(elapsedTime * 14) * 0.3;
        mouthMesh.scale.set(mouthScaleX, Math.max(0.6, mouthScaleY), 1.0);
        
        // Oscilación de cabeza al hablar
        headGroup.position.y = 1.25 + Math.sin(elapsedTime * 12) * 0.02;
        headGroup.rotation.z = Math.sin(elapsedTime * 8) * 0.03;

        // Pulsos de energía en luces
        plasmaLight.intensity = 3.5 + Math.sin(elapsedTime * 25) * 2.5;
        coronaLight.intensity = 2.5 + Math.cos(elapsedTime * 20) * 1.8;
      } else {
        mouthMesh.scale.set(1.0, 1.0, 1.0);
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0, 0.1);
        plasmaLight.intensity = 2.0;
        coronaLight.intensity = 1.5;
      }

      // Animación de partículas de plasma
      const posArr = particleGeom.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += speeds[i];
        if (posArr[i * 3 + 1] > 2.5) {
          posArr[i * 3 + 1] = -2.0;
        }
      }
      particleGeom.attributes.position.needsUpdate = true;

      // Rotación del anillo de plasma
      ringMesh.rotation.z += 0.015;
      ringMesh.scale.setScalar(1.0 + Math.sin(elapsedTime * 3) * 0.05);

      renderer.render(scene, camera);
    };

    animate();

    // Redimensionamiento responsivo
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
      container.removeEventListener('touchmove', handleTouchMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isSpeaking]);

  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[360px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
      <div ref={containerRef} className="w-full h-full absolute inset-0" />
      
      {/* Indicador de 3D Interactivo */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-[10px] font-bold text-cyan-300 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        3D WebGL • Arrastra para girar
      </div>
    </div>
  );
}
