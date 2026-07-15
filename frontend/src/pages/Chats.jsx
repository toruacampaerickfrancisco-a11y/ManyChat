import { Bot, User, ArrowLeft, RefreshCw, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

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

export default function Chats() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
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
          sender: 'ai' // Toma manual del administrador actúa en nombre de la IA/asistente
        })
      });

      if (res.ok) {
        // Refrescar para ver el mensaje
        fetchLeads(false);
      }
    } catch (error) {
      console.error('Error sending manual reply:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors bg-white">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Auditoría de Chats</h1>
            <p className="text-sm text-gray-600 mt-1">Historial de conversaciones atendidas por la IA y toma de control manual.</p>
          </div>
        </div>
        <button 
          onClick={() => fetchLeads(false)} 
          className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-all text-xs font-semibold text-gray-700 bg-white"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Actualizar
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Lista de Chats */}
        <div className="bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gray-50 font-semibold text-gray-700 text-sm">
            Conversaciones Recientes
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {loading ? (
              <p className="text-sm text-gray-500 text-center py-4">Cargando chats...</p>
            ) : leads.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No hay conversaciones registradas.</p>
            ) : (
              leads.map((lead) => (
                <div 
                  key={lead.id} 
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`p-4 rounded border text-sm cursor-pointer transition-all ${
                    lead.id === selectedLeadId 
                      ? 'bg-[#1a4a49]/10 border-[#1a4a49]/30' 
                      : 'bg-white border-gray-100 hover:border-gray-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-bold ${lead.id === selectedLeadId ? 'text-[#1a4a49]' : 'text-gray-800'}`}>
                      {lead.name || `Lead #${lead.phone_or_id}`}
                    </h4>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{lead.platform}</span>
                  </div>
                  <p className="text-gray-500 truncate mt-1">
                    {lead.conversations && lead.conversations.length > 0 
                      ? lead.conversations[lead.conversations.length - 1].message 
                      : 'Sin mensajes aún'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Visor de Chat */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden shadow-sm">
          {selectedLead ? (
            <>
              {/* Cabecera del visor */}
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">
                      {selectedLead.name || 'Sin Nombre'}
                    </h3>
                    <p className="text-[11px] text-gray-400">{selectedLead.phone_or_id}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded border border-emerald-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    IA ACTENDIENDO ({selectedLead.platform.toUpperCase()})
                  </span>
                </div>
                <div className="text-xs text-gray-400 font-semibold bg-gray-100 px-3 py-1.5 rounded border border-gray-200">
                  Estado: {selectedLead.status}
                </div>
              </div>

              {/* Contenedor de mensajes */}
              <div className="flex-1 overflow-auto p-6 space-y-6 bg-gray-50/30">
                {selectedLead.conversations && selectedLead.conversations.length > 0 ? (
                  selectedLead.conversations.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex gap-4 ${msg.sender === 'ai' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border ${
                        msg.sender === 'ai' 
                          ? 'bg-[#1a4a49]/10 border-[#1a4a49]/30 text-[#1a4a49]' 
                          : 'bg-gray-200 border-gray-300 text-gray-600'
                      }`}>
                        {msg.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <div className={`p-3 rounded-lg text-sm max-w-[80%] shadow-xs ${
                        msg.sender === 'ai' 
                          ? 'bg-[#1a4a49]/5 border border-[#1a4a49]/15 text-gray-800 rounded-tr-none' 
                          : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
                      }`}>
                        {parseMessage(msg.message)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-10">No hay mensajes en esta conversación.</p>
                )}
                <div ref={scrollToBottom} />
              </div>

              {/* Caja de texto para responder manualmente */}
              <form onSubmit={handleSend} className="p-3 border-t border-gray-200 bg-gray-50 flex items-center gap-3">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Responder manualmente a ${selectedLead.name || 'este cliente'}...`} 
                  className="flex-1 border border-gray-300 rounded p-2 text-sm bg-white focus:outline-none focus:border-[#1a4a49] transition-all" 
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="bg-[#1a4a49] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#135a5b] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Enviar
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
              <Bot size={48} className="mb-2 opacity-50 text-[#1a4a49]" />
              <p className="text-sm">Selecciona una conversación de la lista lateral para ver la auditoría del chat con la IA.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
