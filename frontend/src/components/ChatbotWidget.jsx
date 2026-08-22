import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Zap, Sparkles, RefreshCw, ExternalLink, ArrowRight, BookOpen, Briefcase, UserCheck, HelpCircle } from 'lucide-react';

const parseMessage = (text) => {
  if (!text) return "";
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
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
      const isWhatsApp = linkUrl.includes('wa.me');
      const isInstagram = linkUrl.includes('instagram.com');
      const isFacebook = linkUrl.includes('facebook.com');

      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          target={isInternal ? undefined : "_blank"}
          rel={isInternal ? undefined : "noopener noreferrer"}
          className={`inline-flex items-center gap-1 my-1 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm transition-all duration-200 break-all ${
            isExternalUdemy
              ? 'bg-amber-500/10 text-amber-900 border border-amber-400/40 hover:bg-amber-500 hover:text-white'
              : isWhatsApp
              ? 'bg-emerald-500/10 text-emerald-800 border border-emerald-400/40 hover:bg-emerald-600 hover:text-white'
              : isInstagram
              ? 'bg-purple-500/10 text-purple-800 border border-purple-400/40 hover:bg-purple-600 hover:text-white'
              : isFacebook
              ? 'bg-blue-500/10 text-blue-800 border border-blue-400/40 hover:bg-blue-600 hover:text-white'
              : 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-[#1a4a49] hover:text-white'
          }`}
        >
          <span>{linkText}</span>
          {!isInternal && <ExternalLink className="w-3 h-3 opacity-75 inline" />}
        </a>
      );

      lastIndex = markdownLinkRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      const remainingText = line.substring(lastIndex);
      
      // Parsear negritas **texto**
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
  const initialGreeting = 'Hola que tal! Muchas gracias por contactarnos, sera un placer atenderte!\n\nPlaticanos sobre cual de nuestros servicios estas interesado:\n\n1️⃣ **Cursos pregrabados!**\n2️⃣ **Cursos en tiempo real, por medio de teams**\n3️⃣ **Cursos presenciales**\n4️⃣ **Cotizacion de un proyecto de media o alta tension**';
  
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
      // Si ya se preguntó y no contesta en los siguientes 2.5 minutos (total 5m), enviar mensaje de cierre y cerrar
      closeTimerRef.current = setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { role: 'model', text: '🔒 Hemos cerrado la conversación por inactividad. Puedes volver a escribir cuando gustes enviando "Hola" o seleccionando una opción del menú. ¡Mucho éxito en tus proyectos! 👋✨' }
        ]);
        setTimeout(() => {
          setIsOpen(false);
          setTimeout(() => {
            setMessages([
              { role: 'model', text: initialGreeting }
            ]);
          }, 300);
        }, 8000);
      }, 150000); // 2.5 min después del primer aviso
    } else {
      // A los 2.5 minutos de inactividad, enviar mensaje de seguimiento
      inactivityTimerRef.current = setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { role: 'model', text: '⏰ ¿Sigues por ahí? ¿Te gustaría continuar con la conversación o tienes alguna otra duda sobre nuestros cursos y cotizaciones? 😊\n\n💡 *Escribe cualquier duda o pulsa una opción para continuar.*' }
        ]);
      }, 150000); // 2.5 minutos
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) {
      clearTimers();
      return;
    }
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
      // Formatear historial para la API
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

  // Botones de respuesta rápida dinámicos según el flujo del bot
  const getQuickReplies = () => {
    const lastMsg = messages[messages.length - 1];
    const text = (lastMsg?.text || '').toLowerCase();

    if (text.includes('otra duda') || text.includes('alguna otra duda')) {
      return [
        { label: '👍 Sí, tengo una duda', action: 'si' },
        { label: '👋 No, gracias', action: 'no' },
        { label: '🏠 Menú Principal', action: 'menu' },
      ];
    }

    if (text.includes('acerca de que es tu duda') || text.includes('acerca de qué es tu duda')) {
      return [
        { label: '🎓 1. Cursos pregrabados', action: '1' },
        { label: '💻 2. Cursos en Teams', action: '2' },
        { label: '📍 3. Cursos presenciales', action: '3' },
        { label: '⚡ 4. Cotización proyecto', action: '4' },
      ];
    }

    // Opciones predeterminadas del Menú Principal
    return [
      { label: '🎓 1. Cursos pregrabados', action: '1' },
      { label: '💻 2. Cursos en Teams', action: '2' },
      { label: '📍 3. Cursos presenciales', action: '3' },
      { label: '⚡ 4. Cotización proyecto', action: '4' },
      { label: '👨‍💼 Hablar con Asesor', action: 'asesor' },
    ];
  };

  const currentReplies = getQuickReplies();

  return (
    <>
      {/* Botón Flotante Energizado y Moderno */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        
        {/* Anillo de pulso de energía exterior */}
        <span className="absolute inset-0 rounded-full bg-[#1a4a49] opacity-60 animate-ping"></span>
        
        {/* Botón Principal */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative group w-16 h-16 bg-gradient-to-tr from-[#0f3433] via-[#1a4a49] to-[#256f6d] hover:to-[#2d8784] rounded-full flex items-center justify-center text-white shadow-[0_8px_25px_rgba(26,74,73,0.5)] hover:shadow-[0_10px_30px_rgba(37,111,109,0.7)] transition-all duration-300 hover:scale-110 border-2 border-teal-400/40"
          aria-label="Abrir chat de asistencia ManyChat"
        >
          {/* Brillo interno */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/10 via-transparent to-teal-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

          {/* Icono de Globo de Chat */}
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform duration-300" />
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300 absolute -top-1 -right-2 animate-bounce drop-shadow-[0_0_6px_rgba(252,211,77,0.9)]" />
          </div>

          {/* Indicador de Estado Activo */}
          <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
          </span>

          {/* Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900/95 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0 border border-gray-700/50">
            💬 Asistente CLIPOP
          </span>
        </button>
      </div>

      {/* Ventana de Chat Flotante */}
      <div
        className={`fixed bottom-5 right-5 sm:right-6 w-[94vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex flex-col z-50 transition-all duration-300 origin-bottom-right border border-gray-100 overflow-hidden ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Cabecera ManyChat Estilizada */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#0b2827] via-[#0f3433] to-[#1a4a49] text-white border-b border-teal-500/20 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-teal-900/80 rounded-2xl border border-teal-400/30 shadow-inner">
              <Bot className="w-5 h-5 text-teal-200" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0f3433]"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm leading-tight text-white">
                  Asistente CLIPOP
                </h3>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300/30">
                  Bot Pro
                </span>
              </div>
              <p className="text-[11px] text-teal-200/90 font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                En línea • Ing. Francisco Gardea
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              title="Reiniciar chat al inicio"
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Área de mensajes con Scroll Automático */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm shadow-sm transition-all ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#1a4a49] to-[#256f6d] text-white rounded-tr-xs'
                    : 'bg-white text-gray-800 border border-slate-200/80 rounded-tl-xs shadow-slate-200/40'
                }`}
              >
                {msg.role === 'model' && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-teal-800 mb-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    CLIPOP Asesor
                  </div>
                )}
                <div className="text-[13px]">
                  {parseMessage(msg.text)}
                </div>
              </div>
            </div>
          ))}

          {/* Indicador de escritura */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs px-4 py-3 shadow-sm flex gap-1.5 items-center">
                <span className="text-xs text-gray-400 font-medium mr-1">Escribiendo</span>
                <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Botones de Respuesta Rápida (Quick Replies ManyChat) */}
        <div className="px-3 py-2 bg-slate-100/90 border-t border-slate-200/70 overflow-x-auto flex gap-1.5 no-scrollbar">
          {currentReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => sendQuery(reply.action)}
              disabled={isLoading}
              className="shrink-0 px-3 py-1.5 bg-white hover:bg-[#1a4a49] text-gray-700 hover:text-white text-xs font-semibold rounded-full border border-gray-300 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {reply.label}
            </button>
          ))}
        </div>

        {/* Entrada de Texto y Envío */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu mensaje o duda técnica..."
              className="w-full pl-4 pr-12 py-3 bg-slate-100/90 border border-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4a49]/40 focus:bg-white focus:border-teal-300 transition-all text-gray-800 placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="absolute right-1.5 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-[#1a4a49] to-[#256f6d] hover:to-[#2d8784] text-white rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:scale-105"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
