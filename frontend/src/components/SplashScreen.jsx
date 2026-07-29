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

            {/* TORRE DE ALTA TENSIÓN IZQUIERDA (Verde Institucional #1a4a49) */}
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

            {/* TORRE DE ALTA TENSIÓN DERECHA (Verde Institucional #1a4a49) */}
            <g stroke="#1a4a49" strokeWidth="2" fill="none">
              <polyline points="380,170 405,50 430,170" />
              <line x1="392" y1="110" x2="418" y2="110" />
              <line x1="398" y1="80" x2="412" y2="80" />
              <line x1="387" y1="140" x2="423" y2="140" />
              
              <line x1="387" y1="140" x2="418" y2="110" strokeWidth="1" opacity="0.5" />
              <line x1="423" y1="140" x2="392" y2="110" strokeWidth="1" opacity="0.5" />
              <line x1="392" y1="110" x2="412" y2="80" strokeWidth="1" opacity="0.5" />
              <line x1="418" y1="110" x2="398" y2="80" strokeWidth="1" opacity="0.5" />

              <line x1="375" y1="65" x2="435" y2="65" strokeWidth="2.5" />
              <line x1="385" y1="95" x2="425" y2="95" strokeWidth="2.5" />

              {/* Aisladores con Rojo Institucional #c0392b */}
              <line x1="377" y1="65" x2="377" y2="78" stroke="#c0392b" strokeWidth="2.5" />
              <line x1="433" y1="65" x2="433" y2="78" stroke="#c0392b" strokeWidth="2.5" />
              <line x1="405" y1="45" x2="405" y2="58" stroke="#c0392b" strokeWidth="2.5" />
            </g>

            {/* INTERRUPTOR CENTRAL DE SUBESTACIÓN */}
            <g transform="translate(230, 110)">
              <rect x="0" y="20" width="40" height="40" rx="4" fill="#ffffff" stroke="#1a4a49" strokeWidth="2" />
              <circle cx="20" cy="40" r="9" fill="none" stroke="#1a4a49" strokeWidth="1.5" />
              <circle cx="20" cy="40" r="4" fill="#c0392b" className="animate-pulse" />
              <text x="20" y="14" textAnchor="middle" fill="#1a4a49" fontSize="9" fontWeight="bold">SE-230kV</text>
            </g>

            {/* LÍNEAS DE TRANSMISIÓN CON FLUJO DE ENERGÍA ANIMADO */}
            {/* Izquierda (Torre 1 a SE-230kV: Entrada 400/230 kV) */}
            <path d="M67,78 C120,110 170,110 230,130" fill="none" stroke="#1a4a49" strokeWidth="2" opacity="0.2" />
            <path d="M67,78 C120,110 170,110 230,130" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="10 20" className="animate-dash-flow" />

            <path d="M95,58 C145,95 185,105 230,138" fill="none" stroke="#1a4a49" strokeWidth="2" opacity="0.2" />
            <path d="M95,58 C145,95 185,105 230,138" fill="none" stroke="#d97706" strokeWidth="2.5" strokeDasharray="12 24" className="animate-dash-flow" />

            <path d="M123,78 C165,105 195,120 230,146" fill="none" stroke="#1a4a49" strokeWidth="2" opacity="0.2" />
            <path d="M123,78 C165,105 195,120 230,146" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="8 18" className="animate-dash-flow" />

            {/* Derecha (SE-230kV a Torre 2: Salida 230/115 kV) */}
            <path d="M270,130 C305,120 335,105 377,78" fill="none" stroke="#1a4a49" strokeWidth="2" opacity="0.2" />
            <path d="M270,130 C305,120 335,105 377,78" fill="none" stroke="#d97706" strokeWidth="2.5" strokeDasharray="10 20" className="animate-dash-flow" />

            <path d="M270,138 C315,105 355,95 405,58" fill="none" stroke="#1a4a49" strokeWidth="2" opacity="0.2" />
            <path d="M270,138 C315,105 355,95 405,58" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeDasharray="12 24" className="animate-dash-flow" />

            <path d="M270,146 C330,110 380,110 433,78" fill="none" stroke="#1a4a49" strokeWidth="2" opacity="0.2" />
            <path d="M270,146 C330,110 380,110 433,78" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="8 18" className="animate-dash-flow" />

            {/* ETIQUETAS DE VOLTAJE / FLUJO DE CORRIENTE ARRIBA DE LAS TORRES */}
            {/* Arriba de Torre Izquierda: 400/230 kV */}
            <line x1="95" y1="35" x2="95" y2="45" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="2 2" />
            <g transform="translate(95, 24)">
              <rect x="-42" y="-11" width="84" height="22" rx="6" fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" className="drop-shadow-sm" />
              <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                <tspan fill="#2563eb">400</tspan>
                <tspan fill="#4b5563">/</tspan>
                <tspan fill="#d97706">230 kV</tspan>
              </text>
            </g>

            {/* Arriba de Torre Derecha: 230/115 kV */}
            <line x1="405" y1="35" x2="405" y2="45" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="2 2" />
            <g transform="translate(405, 24)">
              <rect x="-42" y="-11" width="84" height="22" rx="6" fill="#ffffff" stroke="#7c3aed" strokeWidth="1.5" className="drop-shadow-sm" />
              <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                <tspan fill="#d97706">230</tspan>
                <tspan fill="#4b5563">/</tspan>
                <tspan fill="#7c3aed">115 kV</tspan>
              </text>
            </g>

            <circle cx="250" cy="150" r="4" fill="#c0392b" className="animate-ping" opacity="0.8" />
            <circle cx="95" cy="58" r="3" fill="#2563eb" className="animate-ping" opacity="0.8" />
            <circle cx="405" cy="58" r="3" fill="#7c3aed" className="animate-ping" opacity="0.8" />
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
            <span className="inline-block">
              <span className="text-[#325af0]">Cl</span>
              <span className="text-[#ffd23c]">ip</span>
              <span className="text-[#c35fe1]">op</span>
            </span> Consultoría Especializada
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
