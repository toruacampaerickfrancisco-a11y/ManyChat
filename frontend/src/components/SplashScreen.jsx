import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Incremento suave del progreso del 0 al 100% en ~2 segundos
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return next > 100 ? 100 : next;
      });
    }, 50);

    // A los 2.4s inicia la animación de salida (fade & scale out)
    const timeout1 = setTimeout(() => {
      setIsAnimatingOut(true);
    }, 2400);

    // A los 3.2s remueve el componente del DOM
    const timeout2 = setTimeout(() => {
      setIsVisible(false);
    }, 3200);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  if (!isVisible) return null;

  // Texto dinámico según el porcentaje de carga
  const getStatusText = () => {
    if (progress < 30) return "INICIALIZANDO DIAGNÓSTICO DE SUBESTACIONES DE POTENCIA (115kV / 230kV)...";
    if (progress < 65) return "ESTABLECIENDO SINCRONIZACIÓN CON LA RED ELÉCTRICA NACIONAL...";
    if (progress < 90) return "CARGANDO PARÁMETROS NORMADOS Y PROYECTOS DE INFRAESTRUCTURA...";
    return "SISTEMA ELÉCTRICO CONECTADO • RED OPERATIVA 60 Hz";
  };

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#070d0f] text-white transition-all duration-800 ease-in-out select-none ${
        isAnimatingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Fondo con Patrón sutil de Grilla Técnica y Resplandor Radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a4a49]/30 via-[#0a181a]/80 to-[#05090a] pointer-events-none"></div>
      
      {/* Patrón de líneas de cuadrícula tipo plano de ingeniería */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Tarjeta Contenedora Principal */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center">
        
        {/* ILUSTRACIÓN SVG VECTORIAL DE SUBESTACIÓN & TORRE DE ALTA TENSIÓN */}
        <div className="relative w-full max-w-md h-44 mb-6 flex items-center justify-center">
          
          {/* Anillos de energía de fondo */}
          <div className="absolute w-36 h-36 rounded-full border border-[#10b981]/20 animate-ping"></div>
          <div className="absolute w-48 h-48 rounded-full border border-[#0ea5e9]/15 animate-pulse"></div>

          <svg viewBox="0 0 500 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.35)]">
            <defs>
              {/* Gradiente para las líneas de transmisión */}
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              
              {/* Gradiente para el cuerpo de los equipos */}
              <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1a4a49" />
                <stop offset="100%" stopColor="#0b2424" />
              </linearGradient>

              {/* Filtro de Resplandor Neón */}
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Suelo / Línea de Tierra de Subestación */}
            <line x1="20" y1="170" x2="480" y2="170" stroke="#1a4a49" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="60" y1="170" x2="440" y2="170" stroke="#10b981" strokeWidth="2" opacity="0.6" />

            {/* --- TORRE DE ALTA TENSIÓN (Lado Izquierdo) --- */}
            <g stroke="#38bdf8" strokeWidth="1.8" fill="none" opacity="0.85">
              {/* Patas y cuerpo de torre celosía */}
              <polyline points="70,170 95,50 120,170" />
              <line x1="82" y1="110" x2="108" y2="110" />
              <line x1="88" y1="80" x2="102" y2="80" />
              <line x1="77" y1="140" x2="113" y2="140" />
              
              {/* Cruces X celosía */}
              <line x1="77" y1="140" x2="108" y2="110" strokeWidth="1" opacity="0.6" />
              <line x1="113" y1="140" x2="82" y2="110" strokeWidth="1" opacity="0.6" />
              <line x1="82" y1="110" x2="102" y2="80" strokeWidth="1" opacity="0.6" />
              <line x1="108" y1="110" x2="88" y2="80" strokeWidth="1" opacity="0.6" />

              {/* Brazos / Crucetas de alta tensión */}
              <line x1="65" y1="65" x2="125" y2="65" strokeWidth="2.2" />
              <line x1="75" y1="95" x2="115" y2="95" strokeWidth="2.2" />

              {/* Aisladores tipo disco (Cadenas) */}
              <line x1="67" y1="65" x2="67" y2="78" stroke="#10b981" strokeWidth="2.5" />
              <line x1="123" y1="65" x2="123" y2="78" stroke="#10b981" strokeWidth="2.5" />
              <line x1="95" y1="45" x2="95" y2="58" stroke="#10b981" strokeWidth="2.5" />
            </g>

            {/* --- SUBESTACIÓN Y TRANSFORMADOR DE POTENCIA (Lado Derecho) --- */}
            <g transform="translate(320, 70)">
              {/* Tanque Principal del Transformador */}
              <rect x="20" y="50" width="90" height="50" rx="4" fill="url(#metalGrad)" stroke="#10b981" strokeWidth="2" />
              {/* Aletas de Radiadores de Enfriamiento */}
              <line x1="30" y1="100" x2="30" y2="110" stroke="#1a4a49" strokeWidth="4" />
              <line x1="50" y1="100" x2="50" y2="110" stroke="#1a4a49" strokeWidth="4" />
              <line x1="70" y1="100" x2="70" y2="110" stroke="#1a4a49" strokeWidth="4" />
              <line x1="90" y1="100" x2="90" y2="110" stroke="#1a4a49" strokeWidth="4" />
              
              {/* Boquillas / Bushings de Alta Tensión en el Transformador */}
              <path d="M35,50 L35,25 M30,40 L40,40 M31,32 L39,32 M32,24 L38,24" stroke="#38bdf8" strokeWidth="1.8" fill="none" />
              <path d="M65,50 L65,25 M60,40 L70,40 M61,32 L69,32 M62,24 L68,24" stroke="#38bdf8" strokeWidth="1.8" fill="none" />
              <path d="M95,50 L95,25 M90,40 L100,40 M91,32 L99,32 M92,24 L98,24" stroke="#38bdf8" strokeWidth="1.8" fill="none" />

              {/* Tanque de Expansión / Conservador */}
              <rect x="35" y="10" width="60" height="12" rx="3" fill="#0b2424" stroke="#0ea5e9" strokeWidth="1.5" />
            </g>

            {/* INTERRUPTOR / BARRA DE SUBESTACIÓN CENTRAL (Centro) */}
            <g transform="translate(200, 110)">
              <rect x="0" y="20" width="40" height="40" rx="3" fill="#061315" stroke="#10b981" strokeWidth="1.5" />
              <circle cx="20" cy="40" r="10" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="20" cy="40" r="4" fill="#10b981" className="animate-pulse" />
              <text x="20" y="15" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="monospace">SE-230kV</text>
            </g>

            {/* --- LÍNEAS DE TRANSMISIÓN TRÁSICAS FLUYENDO DE ENERGÍA --- */}
            {/* Fase A */}
            <path d="M67,78 C130,110 160,110 200,130 M240,130 C280,110 310,95 355,95" fill="none" stroke="url(#lineGrad)" strokeWidth="2" />
            <path d="M67,78 C130,110 160,110 200,130 M240,130 C280,110 310,95 355,95" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="12 28" className="animate-dash-flow" filter="url(#neonGlow)" />

            {/* Fase B */}
            <path d="M95,58 C150,90 180,95 200,125 M240,125 C270,95 330,95 385,95" fill="none" stroke="url(#lineGrad)" strokeWidth="2" opacity="0.8" />
            <path d="M95,58 C150,90 180,95 200,125 M240,125 C270,95 330,95 385,95" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="8 20" className="animate-dash-flow" filter="url(#neonGlow)" />

            {/* Fase C */}
            <path d="M123,78 C170,105 190,115 200,135 M240,135 C290,115 340,95 415,95" fill="none" stroke="url(#lineGrad)" strokeWidth="2" opacity="0.7" />
            <path d="M123,78 C170,105 190,115 200,135 M240,135 C290,115 340,95 415,95" fill="none" stroke="#e6683c" strokeWidth="2" strokeDasharray="10 25" className="animate-dash-flow" filter="url(#neonGlow)" />

            {/* Arcos / Pulsos Eléctricos Neón en Nodos */}
            <circle cx="200" cy="130" r="5" fill="#10b981" className="animate-ping" opacity="0.7" />
            <circle cx="355" cy="95" r="4" fill="#38bdf8" className="animate-ping" opacity="0.7" />
          </svg>
        </div>

        {/* LOGO DE CLIPOP & MARCA DE INGENIERÍA */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.2)] mb-3">
            <img 
              src="/logomarca.jpeg" 
              alt="Clipop" 
              className="h-12 md:h-14 w-auto object-contain rounded-lg"
            />
          </div>

          <h1 className="text-xl md:text-2xl font-black tracking-wider text-white uppercase drop-shadow-md">
            Clipop Consultoría & Ingeniería
          </h1>
          <p className="text-xs md:text-sm text-[#10b981] font-bold tracking-[0.2em] uppercase mt-1">
            Especialistas en Subestaciones de Potencia y Líneas de Transmisión
          </p>
        </div>

        {/* TELEMETRÍA TÉCNICA Y ESTADO */}
        <div className="w-full bg-[#0a1518]/90 border border-[#1a4a49]/60 rounded-xl p-4 shadow-xl backdrop-blur-md">
          
          {/* Lecturas numéricas superiores */}
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-2 border-b border-gray-800 pb-2">
            <span className="flex items-center gap-1.5 text-[#10b981]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping"></span>
              FRECUENCIA: <strong className="text-white">60.00 Hz</strong>
            </span>
            <span className="text-[#38bdf8]">
              VOLTAJE: <strong className="text-white">230 kV NOMINAL</strong>
            </span>
            <span className="text-[#e6683c] font-bold">
              ESTADO: <strong className="text-white">{progress < 100 ? 'SINCRONIZANDO' : 'CONECTADO'}</strong>
            </span>
          </div>

          {/* Barra de Progreso con Gradiente Energético */}
          <div className="relative w-full h-3 bg-[#050a0c] rounded-full overflow-hidden border border-gray-800 mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#10b981] via-[#0ea5e9] to-[#1a4a49] transition-all duration-200 ease-out shadow-[0_0_12px_#10b981]"
              style={{ width: `${progress}%` }}
            >
              {/* Brillo móvil en el borde de carga */}
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/60 blur-[2px]"></div>
            </div>
          </div>

          {/* Porcentaje y Texto de Estado Dinámico */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-300 truncate max-w-[80%] text-left font-medium">
              {getStatusText()}
            </span>
            <span className="text-[#10b981] font-bold text-sm">
              {progress}%
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
