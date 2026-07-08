import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: '¡Hola! Te doy la bienvenida a GardeaH, tu plataforma especializada en Ingeniería de Costos y Licitaciones de Obra. 🏗️ Soy tu asistente y puedo ayudarte a resolver tus dudas sobre los cursos de OPUS, Neodata, preparación de concursos para CFE o servicios de consultoría personalizada. ¿En qué te puedo asesorar hoy?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      {/* Botón Flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-[#1a4a49] hover:bg-[#135a5b] rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-300 z-50 ${isOpen ? 'scale-0' : 'scale-100 hover:scale-110'}`}
        aria-label="Abrir chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Ventana de Chat */}
      <div 
        className={`fixed bottom-6 right-6 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a4a49] text-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <h3 className="font-semibold">Asistente GardeaH</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#1a4a49] text-white rounded-tr-sm' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
              }`}>
                {msg.text}
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
