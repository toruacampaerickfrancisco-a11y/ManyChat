import { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, Bot, User, Zap, Sparkles, RefreshCw, 
  ExternalLink, ArrowRight, BookOpen, Briefcase, UserCheck, 
  HelpCircle, Star, Phone, CheckCircle2, ChevronRight, Mail, Globe
} from 'lucide-react';

// Cursos Oficiales de Clipop para visualización enriquecida
const OFFICIAL_COURSES = [
  {
    id: 'c1',
    title: 'Curso Gratuito Introductorio APU',
    rating: '4.9',
    badge: '100% GRATUITO',
    badgeColor: 'bg-emerald-500 text-white',
    url: 'https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/?referralCode=F897FBB286B09C70CCED',
    actionText: 'Inscribirme Gratis en Udemy'
  },
  {
    id: 'c2',
    title: 'Precios Unitarios OPUS 22, 24, Neodata y Excel',
    rating: '4.8',
    badge: 'Más Vendido',
    badgeColor: 'bg-amber-500 text-white',
    url: 'https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/',
    actionText: 'Ver Curso en Udemy'
  },
  {
    id: 'c3',
    title: 'Cómo Presentar Concursos para CFE (OPUS 2020)',
    rating: '4.9',
    badge: 'Especializado',
    badgeColor: 'bg-blue-600 text-white',
    url: 'https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/',
    actionText: 'Ver Curso CFE en Udemy'
  },
  {
    id: 'c4',
    title: 'Análisis de Precios Unitarios 100% Práctico (OPUS 2025)',
    rating: '5.0',
    badge: 'Nueva Versión 2025',
    badgeColor: 'bg-teal-600 text-white',
    url: 'https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F',
    actionText: 'Ver Curso OPUS 2025'
  }
];

// Parser dinámico y limpio de mensajes
const parseMessage = (text, onQuickAction) => {
  if (!text) return "";
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    // Si es una línea divisoria
    if (line.includes('━━━━━━━━━━━━━━━━━━━')) {
      return <hr key={lineIdx} className="my-2.5 border-gray-200" />;
    }

    // Parser de links en formato markdown [Texto](url)
    const parts = [];
    let lastIndex = 0;
    const markdownLinkRegex = /\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g;
    let match;

    while ((match = markdownLinkRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }

      const linkText = match[1];
      const linkUrl = match[2];
      const isInternal = linkUrl.startsWith('/');
      const isExternalUdemy = linkUrl.includes('udemy.com');
      const isWhatsApp = linkUrl.includes('wa.me') || linkUrl.includes('whatsapp');
      const isInstagram = linkUrl.includes('instagram.com');
      const isFacebook = linkUrl.includes('facebook.com');

      // Botón interactivo de marca estilizado
      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          target={isInternal ? undefined : "_blank"}
          rel={isInternal ? undefined : "noopener noreferrer"}
          className={`inline-flex items-center gap-1.5 my-1 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all duration-200 active:scale-95 group ${
            isExternalUdemy
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-amber-500/20'
              : isWhatsApp
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-600/20'
              : isInstagram
              ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white hover:opacity-95 shadow-purple-500/20'
              : isFacebook
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-blue-500/20'
              : 'bg-[#1a4a49] text-white hover:bg-[#133c3b] shadow-teal-900/20'
          }`}
        >
          {isExternalUdemy && <BookOpen className="w-3.5 h-3.5 shrink-0" />}
          {isWhatsApp && <Phone className="w-3.5 h-3.5 shrink-0" />}
          {isFacebook && <Globe className="w-3.5 h-3.5 shrink-0" />}
          {isInstagram && <Sparkles className="w-3.5 h-3.5 shrink-0" />}
          <span>{linkText}</span>
          {!isInternal && <ExternalLink className="w-3 h-3 opacity-80 group-hover:translate-x-0.5 transition-transform shrink-0" />}
        </a>
      );

      lastIndex = markdownLinkRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      const remainingText = line.substring(lastIndex);
      
      // Parsear negritas **texto** o *texto*
      const boldParts = [];
      let boldLastIdx = 0;
      const boldRegex = /\*\*([^*]+)\*\*/g;
      let boldMatch;

      while ((boldMatch = boldRegex.exec(remainingText)) !== null) {
        if (boldMatch.index > boldLastIdx) {
          boldParts.push(remainingText.substring(boldLastIdx, boldMatch.index));
        }
        boldParts.push(
          <strong key={boldMatch.index} className="font-bold text-gray-900">
            {boldMatch[1]}
          </strong>
        );
        boldLastIdx = boldRegex.lastIndex;
      }

      if (boldLastIdx < remainingText.length) {
        boldParts.push(remainingText.substring(boldLastIdx));
      }

      parts.push(...boldParts);
    }

    const finalContent = parts.length > 0 ? parts : line;
    return (
      <span key={lineIdx} className="block leading-relaxed">
        {finalContent}
      </span>
    );
  });
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const initialGreeting = '¡Hola que tal! 👋 Muchas gracias por contactarnos, será un placer atenderte.\n\nPlatícanos, ¿en cuál de nuestros servicios estás interesado?\n\n1️⃣ **Cursos pregrabados (Udemy)**\n2️⃣ **Cursos en tiempo real por Teams**\n3️⃣ **Cursos presenciales (Hermosillo)**\n4️⃣ **Cotización de proyectos de media o alta tensión**';
  
  const [messages, setMessages] = useState([
    { role: 'model', text: initialGreeting }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const inactivityTimerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const clearTimers = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  };

  const resetInactivityTimer = () => {
    clearTimers();
    const lastMsg = messages[messages.length - 1];
    const isAskingInactivity = lastMsg && lastMsg.role === 'model' && lastMsg.text.includes('¿Sigues');

    if (isAskingInactivity) {
      closeTimerRef.current = setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { role: 'model', text: '🔒 Hemos cerrado la conversación por inactividad. Puedes volver a escribir cuando gustes enviando "Hola" o seleccionando una opción del menú. ¡Mucho éxito en tus proyectos! 👋✨' }
        ]);
        setTimeout(() => {
          setIsOpen(false);
          setTimeout(() => {
            setMessages([{ role: 'model', text: initialGreeting }]);
          }, 300);
        }, 8000);
      }, 150000); // 2.5 min después del primer aviso
    } else {
      inactivityTimerRef.current = setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { role: 'model', text: '⏰ ¿Sigues por ahí? ¿Te gustaría continuar con la conversación o tienes alguna otra duda sobre nuestros cursos y cotizaciones? 😊\n\n💡 *Escribe cualquier duda o pulsa una opción para continuar.*' }
        ]);
      }, 150000); // 2.5 minutos
    }
  };

  // Teaser emergente automático después de 4 segundos
  useEffect(() => {
    const teaserTimer = setTimeout(() => {
      if (!isOpen) {
        setShowTeaser(true);
      }
    }, 4000);
    return () => clearTimeout(teaserTimer);
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) {
      clearTimers();
      return;
    }
    setShowTeaser(false);
    resetInactivityTimer();
    return () => clearTimers();
  }, [messages, isOpen]);

  const sendQuery = async (userMessage) => {
    if (!userMessage || !userMessage.trim() || isLoading) return;

    const cleanMsg = userMessage.trim();
    setInputText('');

    // Añadir mensaje del usuario
    const newHistory = [...messages, { role: 'user', text: cleanMsg }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const formattedHistory = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanMsg,
          history: formattedHistory
        })
      });

      const data = await response.json();

      if (data.reply) {
        setMessages([...newHistory, { role: 'model', text: data.reply }]);
      } else {
        setMessages([...newHistory, { role: 'model', text: 'Hubo un error de conexión con el servidor.' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages([...newHistory, { role: 'model', text: 'Error de red al conectar con el servidor.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    sendQuery(inputText);
  };

  const handleResetChat = () => {
    setMessages([{ role: 'model', text: initialGreeting }]);
  };

  // Detección contextual de respuestas rápidas
  const lastModelMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';
  const isCoursesTopic = lastModelMsg.includes('udemy') || lastModelMsg.includes('pregrabados') || lastModelMsg.includes('opus');
  const isQuotationTopic = lastModelMsg.includes('cotización') || lastModelMsg.includes('cotizacion') || lastModelMsg.includes('alta tensión');

  return (
    <>
      {/* Globo Teaser Emergente de Bienvenida */}
      {showTeaser && !isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-[280px]">
          <div className="bg-white p-3.5 rounded-2xl shadow-xl border border-gray-100 flex items-start gap-3 relative ring-1 ring-black/5">
            <button
              onClick={() => setShowTeaser(false)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-xs shadow-xs"
            >
              ×
            </button>
            <div className="w-8 h-8 rounded-full bg-[#1a4a49] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
              🤖
            </div>
            <div className="text-xs">
              <p className="font-bold text-gray-800">¡Hola! ¿Tienes dudas?</p>
              <p className="text-gray-600 mt-0.5">Consulta cursos, OPUS o cotiza proyectos al instante.</p>
              <button
                onClick={() => {
                  setShowTeaser(false);
                  setIsOpen(true);
                }}
                className="mt-2 text-[11px] font-bold text-[#1a4a49] hover:underline flex items-center gap-1"
              >
                Abrir chat <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón Flotante Energizado */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        <span className="absolute inset-0 rounded-full bg-[#1a4a49] opacity-60 animate-ping"></span>
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 bg-gradient-to-tr from-[#143d3c] via-[#1a4a49] to-[#256c6b] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/30"
          aria-label="Abrir Asistente Virtual Clipop"
        >
          <Bot className="w-7 h-7 animate-pulse" />
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs"></span>
        </button>
      </div>

      {/* Ventana Principal del Chat */}
      <div
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] max-w-[440px] h-[85vh] sm:h-[620px] max-h-[700px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100 transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        {/* Cabecera Premium con Glassmorphism */}
        <div className="bg-gradient-to-r from-[#143c3b] via-[#1a4a49] to-[#246362] text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-md relative overflow-hidden">
          {/* Luz ambiental sutil de fondo */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#1a4a49] rounded-full"></span>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5 text-white">
                Asistente Clipop
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  IA Activa ⚡
                </span>
              </h3>
              <p className="text-[11px] text-gray-300 mt-0.5 flex items-center gap-1">
                <span>Ingeniería & Capacitación</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 relative z-10">
            {/* Botón directo a WhatsApp */}
            <a
              href="https://wa.me/526624745958"
              target="_blank"
              rel="noopener noreferrer"
              title="Chatear por WhatsApp con un Asesor"
              className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl transition-colors border border-emerald-400/20"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>

            {/* Reiniciar chat */}
            <button
              onClick={handleResetChat}
              title="Reiniciar conversación"
              className="p-2 hover:bg-white/10 text-white/80 hover:text-white rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Cerrar chat */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 text-white/80 hover:text-white rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cuerpo de Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-gray-50/60 via-white to-gray-50/40 text-xs sm:text-sm">
          {messages.map((msg, idx) => {
            const isModel = msg.role === 'model';
            return (
              <div
                key={idx}
                className={`flex gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  isModel ? 'justify-start' : 'justify-end'
                }`}
              >
                {isModel && (
                  <div className="w-7 h-7 rounded-full bg-[#1a4a49]/10 border border-[#1a4a49]/20 text-[#1a4a49] flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[82%] p-3.5 rounded-2xl shadow-xs transition-all ${
                    isModel
                      ? 'bg-white border border-gray-200/80 text-gray-800 rounded-tl-sm'
                      : 'bg-gradient-to-br from-[#1a4a49] to-[#143c3b] text-white rounded-tr-sm shadow-md'
                  }`}
                >
                  {parseMessage(msg.text, sendQuery)}
                </div>
              </div>
            );
          })}

          {/* Carrusel interactivo de Cursos si se tocó el tema */}
          {isCoursesTopic && (
            <div className="pt-2 animate-in fade-in zoom-in-95 duration-400">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#1a4a49]" /> Cursos Destacados Udemy
                </span>
                <span className="text-[10px] text-gray-400">Desliza ➔</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
                {OFFICIAL_COURSES.map((course) => (
                  <div
                    key={course.id}
                    className="min-w-[210px] max-w-[210px] bg-white border border-gray-200 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between snap-start"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${course.badgeColor}`}>
                          {course.badge}
                        </span>
                        <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {course.rating}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-gray-800 line-clamp-2 leading-tight">
                        {course.title}
                      </h4>
                    </div>

                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 w-full py-1.5 bg-gray-900 hover:bg-[#1a4a49] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
                    >
                      {course.actionText} <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tarjeta de Acción Rápida para Cotización */}
          {isQuotationTopic && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs mb-1">
                <Zap className="w-4 h-4 text-emerald-600" /> Solicitud Rápida de Cotización
              </div>
              <p className="text-[11px] text-emerald-700 mb-3 leading-relaxed">
                Envía tus planos y catálogo a nuestro equipo de ingeniería o comunícate directo vía WhatsApp:
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="mailto:clipopoficial@gmail.com?subject=Solicitud%20de%20Cotizaci%C3%B3n%20-%20Media%20y%20Alta%20Tensi%C3%B3n"
                  className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold text-center flex items-center justify-center gap-1 shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" /> Enviar Correo
                </a>
                <a
                  href="https://wa.me/526624745958?text=Hola%20Clipop,%20deseo%20cotizar%20un%20proyecto%20de%20media%20o%20alta%20tensi%C3%B3n."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold text-center flex items-center justify-center gap-1 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" /> WhatsApp Asesor
                </a>
              </div>
            </div>
          )}

          {/* Animación de Pensamiento (Loading) */}
          {isLoading && (
            <div className="flex gap-2 items-center text-gray-400 text-xs italic pl-2">
              <div className="w-6 h-6 rounded-full bg-[#1a4a49]/10 text-[#1a4a49] flex items-center justify-center text-xs font-bold animate-spin">
                ⏳
              </div>
              <span>Clipop AI está redactando una respuesta...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Píldoras Interactivas de Acción Rápida */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 overflow-x-auto flex gap-1.5 scrollbar-none shrink-0">
          <button
            onClick={() => sendQuery('1')}
            className="shrink-0 px-3 py-1.5 bg-white hover:bg-[#1a4a49] hover:text-white border border-gray-200 text-gray-700 rounded-full text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-95"
          >
            🎓 1. Cursos Udemy
          </button>
          <button
            onClick={() => sendQuery('2')}
            className="shrink-0 px-3 py-1.5 bg-white hover:bg-[#1a4a49] hover:text-white border border-gray-200 text-gray-700 rounded-full text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-95"
          >
            💻 2. Cursos Teams
          </button>
          <button
            onClick={() => sendQuery('3')}
            className="shrink-0 px-3 py-1.5 bg-white hover:bg-[#1a4a49] hover:text-white border border-gray-200 text-gray-700 rounded-full text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-95"
          >
            📍 3. Presenciales
          </button>
          <button
            onClick={() => sendQuery('4')}
            className="shrink-0 px-3 py-1.5 bg-white hover:bg-[#1a4a49] hover:text-white border border-gray-200 text-gray-700 rounded-full text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-95"
          >
            ⚡ 4. Cotización
          </button>
          <button
            onClick={() => sendQuery('menu')}
            className="shrink-0 px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-full text-[11px] font-bold transition-all shadow-2xs active:scale-95"
          >
            🏠 Menú
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe tu duda o selecciona una opción..."
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4a49] focus:bg-white transition-all text-gray-800 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-10 h-10 bg-[#1a4a49] hover:bg-[#133c3b] disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
}
