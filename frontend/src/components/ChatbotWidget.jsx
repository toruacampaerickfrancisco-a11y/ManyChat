import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, X, Send, Bot, User, Zap, Sparkles, RefreshCw,
  ExternalLink, ArrowRight, BookOpen, Briefcase, UserCheck,
  HelpCircle, Star, Phone, CheckCircle2, ChevronRight, Mail, Globe
} from 'lucide-react';



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
          className={`inline-flex items-center gap-1.5 my-1 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all duration-200 active:scale-95 group ${isExternalUdemy
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
      const boldRegex = /(?:\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
      let boldMatch;

      while ((boldMatch = boldRegex.exec(remainingText)) !== null) {
        if (boldMatch.index > boldLastIdx) {
          boldParts.push(remainingText.substring(boldLastIdx, boldMatch.index));
        }
        const boldText = boldMatch[1] || boldMatch[2];
        boldParts.push(
          <strong key={boldMatch.index} className="font-bold text-gray-900">
            {boldText}
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
  const initialGreeting = '¡Hola!  Soy Nikola, tu asistente ¿En qué te puedo ayudar hoy?\n\n*Platícanos, ¿en cuál de nuestros servicios estás interesado?*\n\n1️⃣ *Cursos pregrabados (Udemy)*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales (Hermosillo)*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe tu duda._';

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
    const isAskingInactivity = lastMsg && lastMsg.role === 'model' && (lastMsg.text.includes('¿Sigues') || lastMsg.text.includes('¿sigues'));

    if (isAskingInactivity) {
      closeTimerRef.current = setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { role: 'model', text: '🔒 *Sesión finalizada por inactividad.*\n\nHemos dado por finalizada esta sesión. Puedes volver a escribirnos cuando gustes enviando **"Menú"** o **"0"** para consultar las opciones disponibles. ¡Mucho éxito en tus proyectos! 👋✨' }
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
          { role: 'model', text: '⏰ *¿Sigues por ahí?* 🤔\n\n❓ *¿Deseas continuar con la conversación?*\n👉 *Opciones:* **SÍ** o **NO**\n\n💡 _O escribe **"Menú"** o **"0"** para ver las opciones disponibles._' }
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
            <img
              src="/avatar-torre/nikola_avatar.jpg"
              alt="Nikola"
              className="w-8 h-8 rounded-full object-cover border border-[#1a4a49]/30 shadow-xs shrink-0"
            />
            <div className="text-xs">
              <p className="font-bold text-gray-800">¡Hola! Soy Nikola </p>
              <p className="text-gray-600 mt-0.5">¿En qué te puedo ayudar hoy? Cursos, OPUS o cotizaciones.</p>
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
          className="relative w-14 h-14 bg-gradient-to-tr from-[#143d3c] via-[#1a4a49] to-[#256c6b] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/50 overflow-hidden"
          aria-label="Abrir Asistente Virtual Nikola"
        >
          <img
            src="/avatar-torre/nikola_avatar.jpg"
            alt="Nikola"
            className="w-full h-full object-cover"
          />
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs"></span>
        </button>
      </div>

      {/* Ventana Principal del Chat */}
      <div
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] max-w-[440px] h-[85vh] sm:h-[620px] max-h-[700px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100 transition-all duration-300 ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8 pointer-events-none'
          }`}
      >
        {/* Cabecera Premium con Glassmorphism */}
        <div className="bg-gradient-to-r from-[#143c3b] via-[#1a4a49] to-[#246362] text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-md relative overflow-hidden">
          {/* Luz ambiental sutil de fondo */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <img
                src="/avatar-torre/nikola_avatar.jpg"
                alt="Nikola"
                className="w-10 h-10 rounded-2xl object-cover border border-white/30 shadow-md"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#1a4a49] rounded-full"></span>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight text-white">
                Nikola
              </h3>
              <p className="text-[11px] text-gray-300 mt-0.5 flex items-center gap-1">
                <span>Asistente de Clipop</span>
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
                className={`flex gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isModel ? 'justify-start' : 'justify-end'
                  }`}
              >
                {isModel && (
                  <img
                    src="/avatar-torre/nikola_avatar.jpg"
                    alt="Nikola"
                    className="w-7 h-7 rounded-full object-cover border border-[#1a4a49]/30 shrink-0 mt-1 shadow-xs"
                  />
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[82%] p-3.5 rounded-2xl shadow-xs transition-all ${isModel
                    ? 'bg-white border border-gray-200/80 text-gray-800 rounded-tl-sm'
                    : 'bg-gradient-to-br from-[#1a4a49] to-[#143c3b] text-white rounded-tr-sm shadow-md'
                    }`}
                >
                  {parseMessage(msg.text, sendQuery)}
                </div>
              </div>
            );
          })}

          {/* Animación de Pensamiento (Loading) */}
          {isLoading && (
            <div className="flex gap-2 items-center text-gray-400 text-xs italic pl-2">
              <img
                src="/avatar-torre/nikola_avatar.jpg"
                alt="Nikola"
                className="w-6 h-6 rounded-full object-cover border border-[#1a4a49]/30 animate-pulse"
              />
              <span>Nikola está redactando una respuesta...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
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
