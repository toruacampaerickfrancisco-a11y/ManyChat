import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, ChevronRight, ChevronLeft, Zap, BookOpen, Award, CheckCircle2, ArrowUpRight, Maximize2, Minimize2, X } from 'lucide-react';

const CHAPTERS = [
  {
    id: 1,
    title: "Bienvenida a CLIPOP",
    subtitle: "Ingeniería de Costos y Licitaciones",
    tag: "CONFERENCIA VIRTUAL",
    speech: "¡Hola! Sean bienvenidos a CLIPOP. Soy tu asesor virtual en ingeniería de costos y alta tensión. En CLIPOP, fundada por el Ingeniero Francisco Gardea, somos especialistas en consultoría, armado de licitaciones y capacitación profesional para la industria eléctrica y de la construcción.",
    bulletPoints: [
      "Especialistas en normativa y concursos para CFE",
      "Más de 15 años de experiencia técnica en licitaciones",
      "Capacitación líder en software OPUS, Neodata y Excel"
    ],
    highlightBadge: "400 kV / 230 kV",
    ctaText: "Conocer Servicios",
    ctaLink: "/servicios"
  },
  {
    id: 2,
    title: "Análisis de Precios Unitarios",
    subtitle: "Dominio de OPUS 2025 y Normativa CFE",
    tag: "CURSOS ESPECIALIZADOS",
    speech: "Nuestros programas de formación te enseñan a estructurar presupuestos y análisis de precios unitarios con la máxima precisión, dominando OPUS 2022, 2024 y la nueva versión 2025, cumpliendo estrictamente con los formatos y anexos económicos que exige la Comisión Federal de Electricidad.",
    bulletPoints: [
      "Elaboración de matrices de precios unitarios desde cero",
      "Cálculo de factores de sobrecosto, financiamiento y utilidad",
      "Casos reales aplicados a proyectos electromecánicos y de obra civil"
    ],
    highlightBadge: "OPUS 2025 Práctico",
    ctaText: "Ver Cursos en Udemy",
    ctaLink: "/cursos"
  },
  {
    id: 3,
    title: "Líneas de Transmisión y Subestaciones",
    subtitle: "Concursos de Media y Alta Tensión",
    tag: "ALTA INGENIERÍA",
    speech: "Armamos propuestas técnico-económicas completas para proyectos de infraestructura de alta potencia, incluyendo líneas de transmisión de 115, 230 y 400 kilovoltios, subestaciones eléctricas y redes de distribución con metodología probada para ganar concursos.",
    bulletPoints: [
      "Catálogos de conceptos de líneas y subestaciones",
      "Análisis de rendimiento de cuadrillas y maquinaria pesada",
      "Cumplimiento cabal de especificaciones técnicas CFE"
    ],
    highlightBadge: "Infraestructura Pesada",
    ctaText: "Solicitar Cotización",
    ctaLink: "/contacto"
  },
  {
    id: 4,
    title: "Catálogo en Udemy & Clases en Vivo",
    subtitle: "5 Cursos Disponibles con Acceso Gratuito",
    tag: "EDUCACIÓN PROFESIONAL",
    speech: "Contamos con 5 cursos en la plataforma Udemy, incluyendo un curso introductorio 100% gratuito. Además, realizamos capacitaciones virtuales en tiempo real vía Microsoft Teams y talleres presenciales en la ciudad de Hermosillo, Sonora y otras sedes.",
    bulletPoints: [
      "Curso gratuito introductorio disponible de inmediato",
      "Cupones de descuento exclusivos escribiendo a nuestro correo",
      "Certificado con valor curricular al finalizar"
    ],
    highlightBadge: "5 Cursos en Udemy",
    ctaText: "Ir al Curso Gratuito",
    ctaLink: "https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/?referralCode=F897FBB286B09C70CCED"
  },
  {
    id: 5,
    title: "Cotiza tu Proyecto con Nosotros",
    subtitle: "Hagamos Sinergia en tu Próxima Licitación",
    tag: "CONSULTORÍA INMEDIATA",
    speech: "Si tienes un proyecto o licitación en puerta, contáctanos hoy mismo por WhatsApp al 52 662 474 5958 o al correo clipopoficial@gmail.com. Nuestro equipo de ingenieros está listo para apoyarte a ganar tu próximo concurso. ¡Mucho éxito!",
    bulletPoints: [
      "Atención directa por WhatsApp las 24 horas",
      "Revisión confidencial de catálogo de conceptos y planos",
      "Propuestas competitivas y respaldo técnico integral"
    ],
    highlightBadge: "WhatsApp: +52 662 474 5958",
    ctaText: "Contactar por WhatsApp",
    ctaLink: "https://wa.me/526624745958"
  }
];

const STYLES = [
  { id: 'diagrama', name: 'Diagrama Técnico', closed: '/avatar-torre/Avatar_Torre_Diagrama_V2.jpg', open: '/avatar-torre/Avatar_Torre_Hablando.jpg' },
  { id: 'pixar', name: 'Estilo 3D Amigable', closed: '/avatar-torre/Avatar_Torre_Estilo_Pixar.jpg', open: '/avatar-torre/Avatar_Torre_Hablando.jpg' },
  { id: 'futurista', name: 'Androide Alta Tensión', closed: '/avatar-torre/Avatar_Torre_Estilo_Futurista.jpg', open: '/avatar-torre/Avatar_Torre_Hablando.jpg' },
  { id: 'emoji', name: 'Memoji 3D', closed: '/avatar-torre/Avatar_Torre_Estilo_Emoji.jpg', open: '/avatar-torre/Avatar_Torre_Hablando.jpg' }
];

export default function AvatarPresenter({ isModal = false, onClose = null }) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakingState, setIsSpeakingState] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);

  const canvasRef = useRef(null);
  const speechRef = useRef(null);
  const lipSyncInterval = useRef(null);
  const animationFrameRef = useRef(null);

  const currentData = CHAPTERS[currentChapter];

  // Efecto de rayos de alta tensión en Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const drawLightning = (x1, y1, x2, y2, displace, iterations) => {
      if (iterations <= 0) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return;
      }
      const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displace;
      const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displace;
      drawLightning(x1, y1, midX, midY, displace / 2, iterations - 1);
      drawLightning(midX, midY, x2, y2, displace / 2, iterations - 1);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Dibujar destellos cuando está hablando
      if (isSpeakingState && Math.random() > 0.4) {
        ctx.strokeStyle = Math.random() > 0.5 ? '#00d2ff' : '#00b067';
        ctx.lineWidth = 1.5 + Math.random() * 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00d2ff';

        // Rayo superior izquierdo
        drawLightning(50, 60, 160, 140, 45, 4);
        // Rayo superior derecho
        drawLightning(width - 50, 60, width - 160, 140, 45, 4);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isSpeakingState]);

  // Manejo de síntesis de voz (SpeechSynthesis) con Lip-Sync
  const speakCurrentChapter = () => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    clearInterval(lipSyncInterval.current);

    if (isMuted) {
      setIsSpeakingState(true);
      simulateLipSync();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentData.speech);
    speechRef.current = utterance;
    utterance.lang = 'es-MX';
    utterance.rate = 1.02;
    utterance.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.includes('es-MX') || v.lang.includes('es-ES') || v.lang.includes('es'));
    if (spanishVoice) utterance.voice = spanishVoice;

    utterance.onstart = () => {
      setIsSpeakingState(true);
      simulateLipSync();
    };

    utterance.onend = () => {
      setIsSpeakingState(false);
      setMouthOpen(false);
      clearInterval(lipSyncInterval.current);

      // Avanzar al siguiente capítulo automáticamente si hay más
      if (currentChapter < CHAPTERS.length - 1) {
        setTimeout(() => {
          setCurrentChapter(prev => prev + 1);
        }, 1200);
      } else {
        setIsPlaying(false);
      }
    };

    utterance.onerror = () => {
      setIsSpeakingState(false);
      setMouthOpen(false);
      clearInterval(lipSyncInterval.current);
    };

    window.speechSynthesis.speak(utterance);
  };

  const simulateLipSync = () => {
    clearInterval(lipSyncInterval.current);
    lipSyncInterval.current = setInterval(() => {
      setMouthOpen(prev => !prev);
    }, 140 + Math.random() * 80);
  };

  // Reproducir/Pausar
  useEffect(() => {
    if (isPlaying) {
      speakCurrentChapter();
    } else {
      window.speechSynthesis?.cancel();
      setIsSpeakingState(false);
      setMouthOpen(false);
      clearInterval(lipSyncInterval.current);
    }
    return () => {
      window.speechSynthesis?.cancel();
      clearInterval(lipSyncInterval.current);
    };
  }, [currentChapter, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextChapter = () => {
    if (currentChapter < CHAPTERS.length - 1) {
      setCurrentChapter(prev => prev + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentChapter(0);
    setIsPlaying(true);
  };

  return (
    <div className={`relative bg-gradient-to-br from-[#060c18] via-[#091428] to-[#040812] text-white rounded-3xl overflow-hidden border border-cyan-500/30 shadow-[0_20px_60px_-15px_rgba(0,210,255,0.25)] ${isModal ? 'w-full max-w-5xl' : 'w-full'}`}>
      
      {/* Header Bar */}
      <div className="px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Zap className="w-5 h-5 text-slate-950 font-black animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base tracking-wide bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 bg-clip-text text-transparent">
                PRESENTADOR VIRTUAL CLIPOP
              </h3>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                ALTA TENSIÓN CFE
              </span>
            </div>
            <p className="text-xs text-slate-400">Asistente Interactivo de Licitaciones y Cursos</p>
          </div>
        </div>

        {/* Estilos del Avatar y Controles rápidos */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            {STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${selectedStyle.id === style.id ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                {style.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isMuted ? 'Activar Voz' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 items-center">
        
        {/* AVATAR INTERACTIVO (Columna Izquierda / Central) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_50px_rgba(0,210,255,0.35)] bg-slate-950 group">
            
            {/* Fotograma Base (Boca cerrada) */}
            <img
              src={selectedStyle.closed}
              alt="Avatar Torre CFE"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-100 ${mouthOpen && isSpeakingState ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* Fotograma Hablando (Boca abierta) */}
            <img
              src={selectedStyle.open}
              alt="Avatar Torre CFE Hablando"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-100 ${mouthOpen && isSpeakingState ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Canvas de Rayos Eléctricos */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

            {/* Badge de Estado */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-[11px] font-bold text-cyan-300">
              <span className={`w-2 h-2 rounded-full ${isSpeakingState ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`}></span>
              {isSpeakingState ? 'Hablando en Vivo...' : 'En Espera'}
            </div>

            {/* Indicador de Tensión Eléctrica */}
            <div className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-[10px] font-extrabold text-amber-300">
              ⚡ 400 kV RED NACIONAL
            </div>
          </div>

          {/* Selector de Estilo en Móvil */}
          <div className="flex md:hidden items-center gap-1 mt-4 overflow-x-auto max-w-full pb-1">
            {STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style)}
                className={`px-2 py-1 rounded-md text-[10px] font-semibold shrink-0 ${selectedStyle.id === style.id ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>

        {/* DIAPOSITIVA INTERACTIVA (Columna Derecha) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Tag & Capítulo */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-lg text-xs font-black tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {currentData.tag}
            </span>
            <span className="text-xs font-bold text-slate-400">
              Módulo {currentChapter + 1} de {CHAPTERS.length}
            </span>
          </div>

          {/* Títulos */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {currentData.title}
            </h2>
            <p className="text-sm font-semibold text-cyan-300/90 mt-1">
              {currentData.subtitle}
            </p>
          </div>

          {/* Cuadro de Diálogo / Subtítulo */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 relative">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                "{currentData.speech}"
              </p>
            </div>
          </div>

          {/* Puntos Clave */}
          <div className="space-y-2">
            {currentData.bulletPoints.map((pt, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{pt}</span>
              </div>
            ))}
          </div>

          {/* CTA & Botón de Acción */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={currentData.ctaLink}
              target={currentData.ctaLink.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5"
            >
              {currentData.ctaText} <ArrowUpRight className="w-4 h-4" />
            </a>

            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800/80 text-amber-300 border border-amber-500/20">
              🏷️ {currentData.highlightBadge}
            </span>
          </div>
        </div>

      </div>

      {/* Controles de Reproducción y Capítulos */}
      <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Barra de Capítulos Rápidos */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full w-full sm:w-auto">
          {CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => {
                setCurrentChapter(idx);
                setIsPlaying(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${currentChapter === idx ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-950/30 text-[10px] flex items-center justify-center font-black">
                {idx + 1}
              </span>
              <span className="hidden sm:inline">{ch.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Botones de Control */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={prevChapter}
            disabled={currentChapter === 0}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Capítulo Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all ${isPlaying ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30'}`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" /> Pausar
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Iniciar Presentación
              </>
            )}
          </button>

          <button
            onClick={nextChapter}
            disabled={currentChapter === CHAPTERS.length - 1}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Siguiente Capítulo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleRestart}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Reiniciar Presentación"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
