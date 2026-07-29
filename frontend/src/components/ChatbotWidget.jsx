import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Zap } from 'lucide-react';

const parseMessage = (text) => {
  if (!text) return "";
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    const parts = [];
    let lastIndex = 0;
    // Soporta tanto urls absolutas (http/https) como relativas que empiezan con /
    const markdownLinkRegex = /\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g;
    let match;

    while ((match = markdownLinkRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }

      const linkText = match[1];
      const linkUrl = match[2];
      const isInternal = linkUrl.startsWith('/');
      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          target={isInternal ? undefined : "_blank"}
          rel={isInternal ? undefined : "noopener noreferrer"}
          className="text-blue-600 hover:text-blue-800 underline font-semibold break-all"
        >
          {linkText}
        </a>
      );

      lastIndex = markdownLinkRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      const remainingText = line.substring(lastIndex);
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      let urlMatch;
      let rawLastIndex = 0;

      while ((urlMatch = urlRegex.exec(remainingText)) !== null) {
        if (urlMatch.index > rawLastIndex) {
          parts.push(remainingText.substring(rawLastIndex, urlMatch.index));
        }

        const url = urlMatch[1];
        parts.push(
          <a
            key={lastIndex + urlMatch.index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-semibold break-all"
          >
            {url}
          </a>
        );
        rawLastIndex = urlRegex.lastIndex;
      }

      if (rawLastIndex < remainingText.length) {
        parts.push(remainingText.substring(rawLastIndex));
      }
    }

    const finalContent = parts.length > 0 ? parts : line;
    return (
      <span key={lineIdx}>
        {finalContent}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: '¡Hola! Bienvenido a **Clipop**. 🏗️ Soy tu asistente virtual y estoy aquí para guiarte en todo lo que necesites.\n\n¿Qué te gustaría consultar hoy? Elige una opción escribiendo el número correspondiente:\n\n1️⃣ **Cursos** (Ver nuestras especializaciones en OPUS, Neodata y CFE con descuento)\n2️⃣ **Contacto y Consultorías** (Hablar con nosotros o agendar servicios)' }
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
    const isAskingInactivity = lastMsg && lastMsg.role === 'model' && lastMsg.text.includes('¿Sigues ahí?');

    if (isAskingInactivity) {
      closeTimerRef.current = setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setMessages([
            { role: 'model', text: '¡Hola! Bienvenido a **Clipop**. 🏗️ Soy tu asistente virtual y estoy aquí para guiarte en todo lo que necesites.\n\n¿Qué te gustaría consultar hoy? Elige una opción escribiendo el número correspondiente:\n\n1️⃣ **Cursos** (Ver nuestras especializaciones en OPUS, Neodata y CFE con descuento)\n2️⃣ **Contacto y Consultorías** (Hablar con nosotros o agendar servicios)' }
          ]);
        }, 300);
      }, 60000);
    } else {
      inactivityTimerRef.current = setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { role: 'model', text: '⏰ ¿Sigues ahí? Escribe cualquier mensaje si deseas continuar con nuestra asesoría. De lo contrario, cerraré la sesión en un minuto.' }
        ]);
      }, 30000);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen) {
      clearTimers();
      return;
    }

    resetInactivityTimer();

    return () => clearTimers();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');

    // Añadir mensaje del usuario
    const newHistory = [...messages, { role: 'user', text: userMessage }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Formatear historial para la API de Gemini (necesita 'user' y 'model', y el campo 'parts' con 'text')
      const formattedHistory = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: formattedHistory
        })
      });

      const data = await response.json();

      if (data.reply) {
        setMessages([...newHistory, { role: 'model', text: data.reply }]);
      } else {
        setMessages([...newHistory, { role: 'model', text: 'Hubo un error de conexión con mi servidor.' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages([...newHistory, { role: 'model', text: 'Error al conectar con el servidor.' }]);
    } finally {
      setIsLoading(false);
    }
  };

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
          aria-label="Abrir chat de asistencia"
        >
          {/* Brillo interno de alta tensión */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/10 via-transparent to-teal-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

          {/* Icono de Globo de Chat en Contorno Limpio (MessageSquare) */}
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform duration-300" />
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300 absolute -top-1 -right-2 animate-bounce drop-shadow-[0_0_6px_rgba(252,211,77,0.9)]" />
          </div>

          {/* Indicador de Estado Activo (Punto verde brillante con parpadeo) */}
          <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
          </span>

          {/* Tooltip elegante al pasar el cursor */}
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900/90 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0 border border-gray-700/50">
            💬 Asistente Clipop
          </span>
        </button>
      </div>

      {/* Ventana de Chat */}
      <div
        className={`fixed bottom-6 right-6 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#0f3433] to-[#1a4a49] text-white rounded-t-2xl border-b border-teal-500/20 shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative p-1.5 bg-teal-800/60 rounded-xl border border-teal-400/30">
              <MessageSquare className="w-5 h-5 text-teal-200" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#1a4a49]"></span>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-none flex items-center gap-1.5">
                Asistente Clipop
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              </h3>
              <span className="text-[11px] text-teal-200 font-medium">En línea • Especialista CFE</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-300 hover:text-white" />
          </button>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.role === 'user'
                ? 'bg-[#1a4a49] text-white rounded-tr-sm'
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                }`}>
                {parseMessage(msg.text)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Área de entrada de texto */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 rounded-b-2xl">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="w-full pl-4 pr-12 py-3 bg-gray-100 border-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4a49]/30 focus:bg-white transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="absolute right-1 w-10 h-10 flex items-center justify-center bg-[#1a4a49] hover:bg-[#135a5b] text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
