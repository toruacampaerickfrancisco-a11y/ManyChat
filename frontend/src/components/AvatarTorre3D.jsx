import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AvatarTorre3D({ isSpeaking = false, mouthOpen = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. CONFIGURACIÓN DE LA ESCENA 3D ---
    const scene = new THREE.Scene();

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // --- 2. ILUMINACIÓN ESTILO PIXAR 3D ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.8);
    sunLight.position.set(4, 7, 5);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 1.8);
    fillLight.position.set(-5, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf97316, 2.2); // Resplandor naranja de alta tensión
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);

    // Luces de plasma en los conductores
    const sparkLightLeft = new THREE.PointLight(0x00f2fe, 3, 5);
    sparkLightLeft.position.set(-1.6, 0.6, 0.2);
    scene.add(sparkLightLeft);

    const sparkLightRight = new THREE.PointLight(0xff8800, 3, 5);
    sparkLightRight.position.set(1.6, 0.6, 0.2);
    scene.add(sparkLightRight);

    // --- 3. GRUPO PRINCIPAL DE LA TORRE AVATAR ---
    const avatarGroup = new THREE.Group();
    avatarGroup.position.set(0, -0.2, 0);
    scene.add(avatarGroup);

    // MATERIALES EXACTOS AL DISEÑO PIXAR
    // Acero estructural azul-grisáceo (Slate Steel)
    const towerSteelMat = new THREE.MeshStandardMaterial({
      color: 0x476375,
      metalness: 0.45,
      roughness: 0.35
    });

    const towerDarkJointMat = new THREE.MeshStandardMaterial({
      color: 0x334856,
      metalness: 0.6,
      roughness: 0.3
    });

    // Casco Naranja Brillante con Sombra
    const helmetMat = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      metalness: 0.15,
      roughness: 0.2,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2
    });

    // Aisladores Rojos de Cerámica CFE
    const insulatorMat = new THREE.MeshStandardMaterial({
      color: 0xc92a2a,
      metalness: 0.2,
      roughness: 0.25,
      emissive: 0x4a0404,
      emissiveIntensity: 0.2
    });

    // Helper: Crear barra de celosía
    const createLatticeBeam = (p1, p2, radius = 0.022, mat = towerSteelMat) => {
      const distance = p1.distanceTo(p2);
      const geom = new THREE.CylinderGeometry(radius, radius, distance, 8);
      const mesh = new THREE.Mesh(geom, mat);
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      mesh.position.copy(mid);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
      return mesh;
    };

    // A. ESTRUCTURA TRONCOPIRAMIDAL DE LA TORRE
    const bW = 0.95;
    const mW = 0.52;
    const tW = 0.38;
    const yBase = -1.6;
    const yMid = 0.1;
    const yTop = 1.35;

    const p1 = new THREE.Vector3(-bW, yBase, -bW * 0.7);
    const p2 = new THREE.Vector3(bW, yBase, -bW * 0.7);
    const p3 = new THREE.Vector3(bW, yBase, bW * 0.7);
    const p4 = new THREE.Vector3(-bW, yBase, bW * 0.7);

    const m1 = new THREE.Vector3(-mW, yMid, -mW * 0.7);
    const m2 = new THREE.Vector3(mW, yMid, -mW * 0.7);
    const m3 = new THREE.Vector3(mW, yMid, mW * 0.7);
    const m4 = new THREE.Vector3(-mW, yMid, mW * 0.7);

    const t1 = new THREE.Vector3(-tW, yTop, -tW * 0.7);
    const t2 = new THREE.Vector3(tW, yTop, -tW * 0.7);
    const t3 = new THREE.Vector3(tW, yTop, tW * 0.7);
    const t4 = new THREE.Vector3(-tW, yTop, tW * 0.7);

    // Columnas esquineras
    avatarGroup.add(createLatticeBeam(p1, m1, 0.038));
    avatarGroup.add(createLatticeBeam(p2, m2, 0.038));
    avatarGroup.add(createLatticeBeam(p3, m3, 0.038));
    avatarGroup.add(createLatticeBeam(p4, m4, 0.038));

    avatarGroup.add(createLatticeBeam(m1, t1, 0.032));
    avatarGroup.add(createLatticeBeam(m2, t2, 0.032));
    avatarGroup.add(createLatticeBeam(m3, t3, 0.032));
    avatarGroup.add(createLatticeBeam(m4, t4, 0.032));

    // Travesaños y cruces X
    const addXBracing = (a1, a2, a3, a4, b1, b2, b3, b4) => {
      avatarGroup.add(createLatticeBeam(a1, a2));
      avatarGroup.add(createLatticeBeam(a2, a3));
      avatarGroup.add(createLatticeBeam(a3, a4));
      avatarGroup.add(createLatticeBeam(a4, a1));

      avatarGroup.add(createLatticeBeam(a1, b2, 0.016));
      avatarGroup.add(createLatticeBeam(a2, b1, 0.016));
      avatarGroup.add(createLatticeBeam(a4, b3, 0.016));
      avatarGroup.add(createLatticeBeam(a3, b4, 0.016));
    };

    addXBracing(p1, p2, p3, p4, m1, m2, m3, m4);
    addXBracing(m1, m2, m3, m4, t1, t2, t3, t4);

    // Cúpula superior piramidal
    const peak = new THREE.Vector3(0, yTop + 0.85, 0);
    avatarGroup.add(createLatticeBeam(t1, peak, 0.026));
    avatarGroup.add(createLatticeBeam(t2, peak, 0.026));
    avatarGroup.add(createLatticeBeam(t3, peak, 0.026));
    avatarGroup.add(createLatticeBeam(t4, peak, 0.026));

    // B. CRUCETAS DE ALTA TENSIÓN Y AISLADORES ROJOS
    const arms = [
      { y: 1.05, span: 1.35 },
      { y: 0.55, span: 1.65 },
      { y: -0.05, span: 1.45 }
    ];

    arms.forEach((arm, idx) => {
      const leftTip = new THREE.Vector3(-arm.span, arm.y, 0);
      const rightTip = new THREE.Vector3(arm.span, arm.y, 0);

      avatarGroup.add(createLatticeBeam(leftTip, rightTip, 0.026));
      avatarGroup.add(createLatticeBeam(leftTip, new THREE.Vector3(0, arm.y + 0.28, 0), 0.018));
      avatarGroup.add(createLatticeBeam(rightTip, new THREE.Vector3(0, arm.y + 0.28, 0), 0.018));

      // Cadenas de campanas rojas
      const createInsulator = (pos, glowColor) => {
        const insGroup = new THREE.Group();
        insGroup.position.copy(pos);
        for (let i = 0; i < 4; i++) {
          const disc = new THREE.Mesh(
            new THREE.CylinderGeometry(0.065 - i * 0.004, 0.045 - i * 0.004, 0.03, 14),
            insulatorMat
          );
          disc.position.y = -i * 0.045;
          insGroup.add(disc);
        }
        
        // Terminal eléctrica con aura brillante
        const terminal = new THREE.Mesh(
          new THREE.SphereGeometry(0.035, 12, 12),
          new THREE.MeshStandardMaterial({ color: glowColor, emissive: glowColor, emissiveIntensity: 2.2 })
        );
        terminal.position.y = -0.22;
        insGroup.add(terminal);

        avatarGroup.add(insGroup);
      };

      createInsulator(leftTip, 0x00d2ff);
      createInsulator(rightTip, 0xff8800);
    });

    // C. ROSTRO AMIGABLE ESTILO PIXAR
    const faceGroup = new THREE.Group();
    faceGroup.position.set(0, 0.85, 0.22);
    avatarGroup.add(faceGroup);

    // Placa frontal de la cara (Azul acero suave redondeado)
    const faceBacking = new THREE.Mesh(
      new THREE.BoxGeometry(0.56, 0.46, 0.12),
      new THREE.MeshStandardMaterial({
        color: 0x435f72,
        roughness: 0.35,
        metalness: 0.25
      })
    );
    faceGroup.add(faceBacking);

    // Ojos Grandes Expresivos Estilo Pixar
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const irisMat = new THREE.MeshStandardMaterial({ color: 0x24140e, roughness: 0.2 });
    const pupilGlowMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const createPixarEye = (xPos) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xPos, 0.06, 0.065);

      // Globo ocular
      const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.08, 20, 20), eyeWhiteMat);
      eyeGroup.add(eyeball);

      // Iris y pupila
      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), irisMat);
      iris.position.set(0, 0, 0.04);
      eyeGroup.add(iris);

      // Brillo especular Pixar
      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), pupilGlowMat);
      glint.position.set(0.02, 0.02, 0.085);
      eyeGroup.add(glint);

      // Párpado superior
      const lid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.085, 0.018, 16),
        new THREE.MeshStandardMaterial({ color: 0x2e4250, roughness: 0.4 })
      );
      lid.rotation.x = Math.PI * 0.5;
      lid.position.set(0, 0.07, 0.03);
      eyeGroup.add(lid);

      return { eyeGroup, iris };
    };

    const leftEye = createPixarEye(-0.13);
    const rightEye = createPixarEye(0.13);
    faceGroup.add(leftEye.eyeGroup);
    faceGroup.add(rightEye.eyeGroup);

    // Cejas amigables curvadas
    const browGeom = new THREE.CylinderGeometry(0.014, 0.014, 0.13, 8);
    const browMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5 });

    const leftBrow = new THREE.Mesh(browGeom, browMat);
    leftBrow.position.set(-0.13, 0.17, 0.08);
    leftBrow.rotation.z = 0.25;
    faceGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeom, browMat);
    rightBrow.position.set(0.13, 0.17, 0.08);
    rightBrow.rotation.z = -0.25;
    faceGroup.add(rightBrow);

    // Boca Sonriente / Parlante
    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(0, -0.11, 0.075);

    // Fondo oscuro de la boca
    const mouthCavity = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.09, 0.04, 16, 1, false, 0, Math.PI),
      new THREE.MeshBasicMaterial({ color: 0x180808 })
    );
    mouthCavity.rotation.x = -Math.PI * 0.5;
    mouthGroup.add(mouthCavity);

    // Dientes superiores blancos
    const teeth = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.024, 0.02),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 })
    );
    teeth.position.set(0, 0.012, 0.015);
    mouthGroup.add(teeth);

    // Lengua rosada
    const tongue = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 })
    );
    tongue.position.set(0, -0.022, 0.01);
    mouthGroup.add(tongue);

    faceGroup.add(mouthGroup);

    // D. CASCO NARANJA DE SEGURIDAD CON RAYO BLANCO
    const helmetGroup = new THREE.Group();
    helmetGroup.position.set(0, 1.42, 0.04);

    // Bóveda del casco
    const domeGeom = new THREE.SphereGeometry(0.42, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.52);
    const domeMesh = new THREE.Mesh(domeGeom, helmetMat);
    domeMesh.scale.set(1.0, 0.95, 1.15);
    helmetGroup.add(domeMesh);

    // Ala / Visera del casco
    const brimGeom = new THREE.TorusGeometry(0.45, 0.032, 12, 32);
    const brimMesh = new THREE.Mesh(brimGeom, helmetMat);
    brimMesh.rotation.x = Math.PI * 0.5;
    brimMesh.scale.set(1.0, 1.15, 1.0);
    helmetGroup.add(brimMesh);

    // Símbolo de Rayo Blanco en el Casco (ExtrudeGeometry)
    const lightningShape = new THREE.Shape();
    lightningShape.moveTo(0, 0.14);
    lightningShape.lineTo(-0.06, 0.01);
    lightningShape.lineTo(-0.01, 0.01);
    lightningShape.lineTo(-0.04, -0.12);
    lightningShape.lineTo(0.07, 0.01);
    lightningShape.lineTo(0.015, 0.01);
    lightningShape.closePath();

    const lightningGeom = new THREE.ExtrudeGeometry(lightningShape, { depth: 0.015, bevelEnabled: false });
    const lightningMesh = new THREE.Mesh(
      lightningGeom,
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.6 })
    );
    lightningMesh.position.set(0, 0.12, 0.44);
    lightningMesh.scale.set(1.1, 1.1, 1.1);
    helmetGroup.add(lightningMesh);

    avatarGroup.add(helmetGroup);

    // E. BRAZOS Y MANOS DE CELOSÍA (Brazo izquierdo saludando)
    // Brazo izquierdo (Saludando arriba)
    const waveArmGroup = new THREE.Group();
    waveArmGroup.position.set(0.65, 0.45, 0);

    const upperArm = createLatticeBeam(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.5, 0.4, 0.1), 0.028);
    waveArmGroup.add(upperArm);

    const forearm = createLatticeBeam(new THREE.Vector3(0.5, 0.4, 0.1), new THREE.Vector3(0.75, 0.95, 0.2), 0.024);
    waveArmGroup.add(forearm);

    // Mano saludando con 4 dedos abiertos
    const handGroup = new THREE.Group();
    handGroup.position.set(0.75, 0.95, 0.2);

    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.035), towerSteelMat);
    handGroup.add(palm);

    const fingerMat = towerSteelMat;
    const f1 = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.012, 0.1, 8), fingerMat);
    f1.position.set(-0.045, 0.1, 0);
    f1.rotation.z = 0.1;
    handGroup.add(f1);

    const f2 = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.012, 0.12, 8), fingerMat);
    f2.position.set(-0.015, 0.11, 0);
    handGroup.add(f2);

    const f3 = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.012, 0.11, 8), fingerMat);
    f3.position.set(0.018, 0.1, 0);
    f3.rotation.z = -0.1;
    handGroup.add(f3);

    const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.012, 0.08, 8), fingerMat);
    thumb.position.set(0.065, 0.02, 0);
    thumb.rotation.z = -0.6;
    handGroup.add(thumb);

    waveArmGroup.add(handGroup);
    avatarGroup.add(waveArmGroup);

    // Brazo derecho (En la cintura / reposo)
    const restArmGroup = new THREE.Group();
    restArmGroup.position.set(-0.65, 0.45, 0);
    restArmGroup.add(createLatticeBeam(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-0.4, -0.35, 0.15), 0.028));
    restArmGroup.add(createLatticeBeam(new THREE.Vector3(-0.4, -0.35, 0.15), new THREE.Vector3(-0.15, -0.7, 0.2), 0.024));
    avatarGroup.add(restArmGroup);

    // F. CABLES DE ENERGÍA CONDUCTORES CON CHISPAS
    const sparkCount = 80;
    const sparkGeom = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3] = (Math.random() - 0.5) * 4.0;
      sparkPos[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      sparkPos[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
    }
    sparkGeom.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkSystem = new THREE.Points(
      sparkGeom,
      new THREE.PointsMaterial({ color: 0x00f2fe, size: 0.05, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending })
    );
    scene.add(sparkSystem);

    // --- 4. INTERACTIVIDAD CON EL RATÓN ---
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
        targetRotY += deltaX * 0.01;
        targetRotX += deltaY * 0.006;
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

    // --- 5. BUCLE DE ANIMACIÓN ---
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotación suave del personaje
      if (!isDragging) {
        targetRotY += 0.002;
      }
      avatarGroup.rotation.y = THREE.MathUtils.lerp(avatarGroup.rotation.y, targetRotY, 0.08);
      avatarGroup.rotation.x = THREE.MathUtils.lerp(avatarGroup.rotation.x, targetRotX * 0.25, 0.08);

      // Flotación / Respiración amigable
      avatarGroup.position.y = -0.2 + Math.sin(t * 1.8) * 0.04;

      // Movimiento del brazo saludando (Wave Hand)
      handGroup.rotation.z = Math.sin(t * 4.5) * 0.25;
      waveArmGroup.rotation.z = Math.sin(t * 2.2) * 0.08;

      // Seguimiento de Ojos hacia el Cursor
      leftEye.iris.position.x = THREE.MathUtils.lerp(leftEye.iris.position.x, mouseX * 0.025, 0.15);
      leftEye.iris.position.y = THREE.MathUtils.lerp(leftEye.iris.position.y, mouseY * 0.025, 0.15);
      rightEye.iris.position.x = THREE.MathUtils.lerp(rightEye.iris.position.x, mouseX * 0.025, 0.15);
      rightEye.iris.position.y = THREE.MathUtils.lerp(rightEye.iris.position.y, mouseY * 0.025, 0.15);

      // Inclinación de Cejas según el habla
      if (isSpeaking) {
        // Boca modulando
        const mouthScaleY = 1.0 + Math.sin(t * 20) * 1.6;
        const mouthScaleX = 1.0 + Math.cos(t * 15) * 0.25;
        mouthGroup.scale.set(mouthScaleX, Math.max(0.4, mouthScaleY), 1.0);

        // Movimiento sutil de casco y cejas al hablar
        helmetGroup.rotation.z = Math.sin(t * 9) * 0.03;
        leftBrow.position.y = 0.17 + Math.sin(t * 12) * 0.015;
        rightBrow.position.y = 0.17 + Math.sin(t * 12) * 0.015;

        sparkLightLeft.intensity = 3.5 + Math.sin(t * 25) * 2.0;
        sparkLightRight.intensity = 3.5 + Math.cos(t * 22) * 2.0;
      } else {
        mouthGroup.scale.set(1.0, 1.0, 1.0);
        helmetGroup.rotation.z = THREE.MathUtils.lerp(helmetGroup.rotation.z, 0, 0.1);
        sparkLightLeft.intensity = 2.0;
        sparkLightRight.intensity = 2.0;
      }

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
  }, [isSpeaking]);

  return (
    <div className="relative w-full h-full min-h-[320px] sm:min-h-[380px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
      <div ref={containerRef} className="w-full h-full absolute inset-0" />
      
      {/* Badge de Modelo 3D */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-[10px] font-bold text-cyan-300 flex items-center gap-1.5 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        3D Pixar CFE • Arrastra para rotar
      </div>
    </div>
  );
}
