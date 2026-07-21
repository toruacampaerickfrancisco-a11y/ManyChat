import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Incremento constante del progreso (0% a 100%)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 10) + 5;
        return next > 100 ? 100 : next;
      });
    }, 40);

    // Inicia animación de desvanecimiento a los 2.2s
    const timeout1 = setTimeout(() => {
      setIsAnimatingOut(true);
    }, 2200);

    // Oculta completamente a los 3.0s
    const timeout2 = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white transition-all duration-800 ease-in-out select-none ${
        isAnimatingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Contenedor Principal Centrado */}
      <div className="flex flex-col items-center max-w-xl px-6 text-center">
        
        {/* ANIMACIÓN VECTORIAL DE SUBESTACIÓN DE POTENCIA Y TENSIÓN CON COLORES DE LA MARCA (#1a4a49 y #c0392b) */}
        <div className="relative w-full max-w-md h-40 mb-6 flex items-center justify-center">
          
          <svg viewBox="0 0 500 200" className="w-full h-full drop-shadow-sm">
            {/* Suelo de Subestación */}
            <line x1="40" y1="170" x2="460" y2="170" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="80" y1="170" x2="420" y2="170" stroke="#1a4a49" strokeWidth="2" opacity="0.4" />

            {/* TORRE DE ALTA TENSIÓN (Verde Institucional #1a4a49) */}
            <g stroke="#1a4a49" strokeWidth="2" fill="none">
              <polyline points="70,170 95,50 120,170" />
              <line x1="82" y1="110" x2="108" y2="110" />
              <line x1="88" y1="80" x2="102" y2="80" />
              <line x1="77" y1="140" x2="113" y2="140" />
              
              <line x1="77" y1="140" x2="108" y2="110" strokeWidth="1" opacity="0.5" />
              <line x1="113" y1="140" x2="82" y2="110" strokeWidth="1" opacity="0.5" />
              <line x1="82" y1="110" x2="102" y2="80" strokeWidth="1" opacity="0.5" />
              <line x1="108" y1="110" x2="88" y2="80" strokeWidth="1" opacity="0.5" />

              <line x1="65" y1="65" x2="125" y2="65" strokeWidth="2.5" />
              <line x1="75" y1="95" x2="115" y2="95" strokeWidth="2.5" />

              {/* Aisladores con Rojo Institucional #c0392b */}
              <line x1="67" y1="65" x2="67" y2="78" stroke="#c0392b" strokeWidth="2.5" />
              <line x1="123" y1="65" x2="123" y2="78" stroke="#c0392b" strokeWidth="2.5" />
              <line x1="95" y1="45" x2="95" y2="58" stroke="#c0392b" strokeWidth="2.5" />
            </g>

            {/* SUBESTACIÓN Y TRANSFORMADOR DE POTENCIA */}
            <g transform="translate(320, 70)">
              <rect x="20" y="50" width="90" height="50" rx="4" fill="#1a4a49" stroke="#1a4a49" strokeWidth="2" />
              <line x1="30" y1="100" x2="30" y2="110" stroke="#1a4a49" strokeWidth="3" />
              <line x1="50" y1="100" x2="50" y2="110" stroke="#1a4a49" strokeWidth="3" />
              <line x1="70" y1="100" x2="70" y2="110" stroke="#1a4a49" strokeWidth="3" />
              <line x1="90" y1="100" x2="90" y2="110" stroke="#1a4a49" strokeWidth="3" />
              
              <path d="M35,50 L35,25 M30,40 L40,40 M31,32 L39,32 M32,24 L38,24" stroke="#c0392b" strokeWidth="2" fill="none" />
              <path d="M65,50 L65,25 M60,40 L70,40 M61,32 L69,32 M62,24 L68,24" stroke="#c0392b" strokeWidth="2" fill="none" />
              <path d="M95,50 L95,25 M90,40 L100,40 M91,32 L99,32 M92,24 L98,24" stroke="#c0392b" strokeWidth="2" fill="none" />

              <rect x="35" y="10" width="60" height="12" rx="3" fill="#0d2c2b" stroke="#1a4a49" strokeWidth="1.5" />
            </g>

            {/* INTERRUPTOR CENTRAL DE SUBESTACIÓN */}
            <g transform="translate(200, 110)">
              <rect x="0" y="20" width="40" height="40" rx="4" fill="#ffffff" stroke="#1a4a49" strokeWidth="2" />
              <circle cx="20" cy="40" r="9" fill="none" stroke="#1a4a49" strokeWidth="1.5" />
              <circle cx="20" cy="40" r="4" fill="#c0392b" className="animate-pulse" />
              <text x="20" y="14" textAnchor="middle" fill="#1a4a49" fontSize="9" fontWeight="bold">SE-230kV</text>
            </g>

            {/* LÍNEAS DE TRANSMISIÓN CON FLUJO DE ENERGÍA ANIMADO */}
            <path d="M67,78 C130,110 160,110 200,130 M240,130 C280,110 310,95 355,95" fill="none" stroke="#1a4a49" strokeWidth="2" opacity="0.25" />
            <path d="M67,78 C130,110 160,110 200,130 M240,130 C280,110 310,95 355,95" fill="none" stroke="#c0392b" strokeWidth="2.5" strokeDasharray="10 20" className="animate-dash-flow" />

            <path d="M95,58 C150,90 180,95 200,125 M240,125 C270,95 330,95 385,95" fill="none" stroke="#1a4a49" strokeWidth="2" opacity="0.25" />
            <path d="M95,58 C150,90 180,95 200,125 M240,125 C270,95 330,95 385,95" fill="none" stroke="#1a4a49" strokeWidth="2.5" strokeDasharray="12 24" className="animate-dash-flow" />

            <path d="M123,78 C170,105 190,115 200,135 M240,135 C290,115 340,95 415,95" fill="none" stroke="#1a4a49" strokeWidth="2" opacity="0.25" />
            <path d="M123,78 C170,105 190,115 200,135 M240,135 C290,115 340,95 415,95" fill="none" stroke="#c0392b" strokeWidth="2.5" strokeDasharray="8 18" className="animate-dash-flow" />

            <circle cx="200" cy="130" r="4" fill="#c0392b" className="animate-ping" opacity="0.8" />
            <circle cx="355" cy="95" r="4" fill="#1a4a49" className="animate-ping" opacity="0.8" />
          </svg>
        </div>

        {/* LOGO DE LA EMPRESA & MARCA */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-56 h-20 flex items-center justify-center mb-3">
            <img 
              src="/logomarca.jpeg" 
              alt="Clipop Logo" 
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#1a4a49] mb-1">
            Clipop Consultoría Especializada
          </h2>
          <p className="text-gray-500 text-xs md:text-sm font-bold tracking-widest uppercase">
            Proyectos, Construcción y Subestaciones
          </p>
        </div>

        {/* BARRA DE CARGA MINIMALISTA Y LIMPIA (SIN CAJA OSCURA DE ABAJO) */}
        <div className="w-full max-w-sm flex flex-col items-center gap-2">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div
              className="h-full bg-[#1a4a49] transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-[#1a4a49] tracking-wider">
            Cargando... {progress}%
          </span>
        </div>

      </div>
    </div>
  );
}
