import { Bot, User, ArrowLeft, RefreshCw, Send, UserCheck, PauseCircle, PlayCircle, MessageSquare, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const parseMessage = (text) => {
  if (!text) return "";
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
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

export default function Chats() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [togglingBot, setTogglingBot] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchLeads = (selectFirst = false) => {
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLeads(data);
          if (data.length > 0) {
            if (selectFirst || !selectedLeadId) {
              setSelectedLeadId(data[0].id);
            }
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching leads for chats:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeads(true);
  }, []);

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedLead?.conversations]);

  // Toggle Bot On / Off for this specific lead (Human Handover)
  const handleToggleBot = async () => {
    if (!selectedLead || togglingBot) return;
    setTogglingBot(true);
    const newPausedState = !selectedLead.bot_paused;

    try {
      const res = await fetch(`/api/leads/${selectedLead.id}/toggle-bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot_paused: newPausedState })
      });

      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, bot_paused: newPausedState } : l));
      }
    } catch (err) {
      alert('Error cambiando estado del bot');
    }
    setTogglingBot(false);
  };

  // Change Lead Status (NUEVO, EN CONTACTO, COTIZADO, CONVERTIDO)
  const handleChangeStatus = async (newStatus) => {
    if (!selectedLead) return;
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: newStatus } : l));
      }
    } catch (err) {
      alert('Error al actualizar estado');
    }
  };

  // Send Manual Message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedLeadId || sending) return;

    const messageText = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const res = await fetch(`/api/leads/${selectedLeadId}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          sender: 'human' // Mensaje enviado directamente por el administrador humano
        })
      });

      if (res.ok) {
        fetchLeads(false);
      }
    } catch (error) {
      console.error('Error sending manual reply:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-300 h-full flex flex-col pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white shadow-sm">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              Bandeja Live Chat & Auditoría IA
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">Monitorea los chats en tiempo real, pausa la IA y toma el control como asesor humano.</p>
          </div>
        </div>
        <button
          onClick={() => fetchLeads(false)}
          className="flex items-center gap-2 px-3.5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-xs font-bold text-gray-700 bg-white shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-500" /> Actualizar
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[550px]">
        {/* Lista de Conversaciones */}
        <div className="bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center justify-between">
            <span>Conversaciones ({leads.length})</span>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-2">
            {loading ? (
              <p className="text-sm text-gray-500 text-center py-6">Cargando conversaciones...</p>
            ) : leads.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No hay conversaciones registradas.</p>
            ) : (
              leads.map((lead) => {
                const isSelected = lead.id === selectedLeadId;
                const isPaused = lead.bot_paused;

                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLeadId(lead.id)}
                    className={`p-3.5 rounded-xl border text-sm cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1a4a49]/10 border-[#1a4a49]/40 shadow-sm ring-1 ring-[#1a4a49]/30'
                        : 'bg-white border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <h4 className={`font-bold text-xs truncate max-w-[140px] ${isSelected ? 'text-[#1a4a49]' : 'text-gray-800'}`}>
                          {lead.name || `Lead #${lead.phone_or_id}`}
                        </h4>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        lead.platform === 'whatsapp' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        lead.platform === 'instagram' ? 'bg-pink-100 text-pink-800 border border-pink-200' :
                        'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {lead.platform}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 truncate mt-1">
                      {lead.conversations && lead.conversations.length > 0
                        ? lead.conversations[lead.conversations.length - 1].message
                        : 'Sin mensajes aún'}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[10px]">
                      <span className="text-gray-400 font-medium">{lead.phone_or_id}</span>
                      <span className={`font-bold px-1.5 py-0.5 rounded ${
                        isPaused ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {isPaused ? '👤 Modo Asesor' : '🤖 IA Activa'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Visor de Chat & Acciones */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
          {selectedLead ? (
            <>
              {/* Cabecera del visor de chat */}
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1a4a49]/10 border border-[#1a4a49]/20 flex items-center justify-center text-[#1a4a49] font-bold text-sm">
                    {selectedLead.name ? selectedLead.name.substring(0, 2).toUpperCase() : 'LE'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      {selectedLead.name || 'Cliente sin nombre'}
                      <span className="text-[10px] font-normal text-gray-500 font-mono">({selectedLead.phone_or_id})</span>
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        selectedLead.bot_paused 
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${selectedLead.bot_paused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
                        {selectedLead.bot_paused ? 'MODO ASESOR HUMANO (BOT PAUSADO)' : 'BOT IA ACTIVO EN PILOTO AUTOMÁTICO'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botones de Control de Intervención */}
                <div className="flex items-center gap-2">
                  {/* Selector de Estado del Lead */}
                  <select
                    value={selectedLead.status || 'NUEVO'}
                    onChange={(e) => handleChangeStatus(e.target.value)}
                    className="text-xs font-bold bg-white border border-gray-300 text-gray-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1a4a49]"
                  >
                    <option value="NUEVO">🟡 NUEVO</option>
                    <option value="EN CONTACTO">🔵 EN CONTACTO</option>
                    <option value="COTIZADO">🟣 COTIZADO</option>
                    <option value="CONVERTIDO">🟢 CONVERTIDO</option>
                  </select>

                  {/* Botón de Pausar / Reactivar Bot */}
                  <button
                    onClick={handleToggleBot}
                    disabled={togglingBot}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                      selectedLead.bot_paused
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                  >
                    {selectedLead.bot_paused ? (
                      <>
                        <PlayCircle className="w-3.5 h-3.5" /> Devolver a IA
                      </>
                    ) : (
                      <>
                        <PauseCircle className="w-3.5 h-3.5" /> Tomar Chat (Pausar Bot)
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Mensajes del Chat */}
              <div className="flex-1 overflow-auto p-6 space-y-4 bg-gray-50/40">
                {selectedLead.conversations && selectedLead.conversations.length > 0 ? (
                  selectedLead.conversations.map((msg) => {
                    const isAi = msg.sender === 'ai';
                    const isHuman = msg.sender === 'human';
                    const isUser = msg.sender === 'user';

                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${!isUser ? 'flex-row-reverse' : ''}`}
                      >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                          isAi 
                            ? 'bg-[#1a4a49] text-white' 
                            : isHuman 
                            ? 'bg-amber-600 text-white' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {isAi ? <Bot className="w-4 h-4" /> : isHuman ? <UserCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>

                        {/* Globo de mensaje */}
                        <div className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-[80%] leading-relaxed shadow-xs ${
                          isAi
                            ? 'bg-[#1a4a49]/10 border border-[#1a4a49]/20 text-gray-900 rounded-tr-none'
                            : isHuman
                            ? 'bg-amber-50 border border-amber-200 text-gray-900 rounded-tr-none'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                        }`}>
                          <div className="text-[10px] font-bold text-gray-400 mb-1 flex items-center justify-between gap-4">
                            <span>{isAi ? '🤖 Asistente Gemini' : isHuman ? '👤 Asesor Humano (Tú)' : 'Cliente'}</span>
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          {parseMessage(msg.message)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-400 text-center py-10">No hay mensajes registrados con este cliente.</p>
                )}
                <div ref={scrollToBottom} />
              </div>

              {/* Caja de texto para responder manualmente */}
              <form onSubmit={handleSend} className="p-3 border-t border-gray-200 bg-white flex items-center gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    selectedLead.bot_paused
                      ? `Escribe una respuesta directa a ${selectedLead.name || 'este cliente'}...`
                      : `Escribe para responder como asesor (el bot se pausará)...`
                  }
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a4a49] transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="bg-[#1a4a49] hover:bg-[#153e3d] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" /> Enviar
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
              <MessageSquare size={48} className="mb-3 opacity-30 text-[#1a4a49]" />
              <p className="text-sm font-semibold text-gray-600">Selecciona un chat de la lista</p>
              <p className="text-xs text-gray-400 mt-1">Podrás auditar la IA, pausar el bot y atender a los clientes en vivo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

