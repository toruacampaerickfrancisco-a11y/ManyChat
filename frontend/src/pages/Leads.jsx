import { Mail, Phone, ExternalLink, ArrowLeft, RefreshCw, Search, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeads = () => {
    setLoading(true);
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLeads(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching leads:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getPlatformBadge = (platform) => {
    const p = (platform || '').toLowerCase();
    if (p === 'whatsapp') {
      return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">🟢 WhatsApp</span>;
    }
    if (p === 'facebook' || p === 'messenger') {
      return <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">🔵 Facebook</span>;
    }
    if (p === 'instagram') {
      return <span className="bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">🟣 Instagram</span>;
    }
    if (p === 'email' || p === 'correo') {
      return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">✉️ Correo Web</span>;
    }
    return <span className="bg-teal-100 text-teal-800 border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">🌐 Web</span>;
  };

  const filteredLeads = leads.filter(lead => {
    const s = (lead.status || '').toUpperCase();
    const p = (lead.platform || '').toLowerCase();

    // Filtro por Estado
    if (statusFilter === 'NUEVOS' && s !== 'NUEVO' && s !== 'NEW') return false;
    if (statusFilter === 'CONVERTIDOS' && s !== 'CONVERTIDO' && s !== 'CONVERTED') return false;

    // Filtro por Canal
    if (channelFilter === 'WHATSAPP' && p !== 'whatsapp') return false;
    if (channelFilter === 'FACEBOOK' && p !== 'facebook' && p !== 'messenger') return false;
    if (channelFilter === 'INSTAGRAM' && p !== 'instagram') return false;
    if (channelFilter === 'EMAIL' && p !== 'email' && p !== 'correo') return false;

    // Búsqueda
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = (lead.name || '').toLowerCase().includes(q);
      const matchPhone = (lead.phone_or_id || '').toLowerCase().includes(q);
      const matchEmail = (lead.email || '').toLowerCase().includes(q);
      return matchName || matchPhone || matchEmail;
    }

    return true;
  });

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 h-full flex flex-col pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white shadow-sm">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Leads & Clientes Potenciales</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Prospectos centralizados capturados en WhatsApp, Facebook, Instagram y Formulario Web.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/chats')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a4a49] hover:bg-[#135a5b] text-white rounded-lg text-xs font-bold shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4" /> Ir a Bandeja Live Chat
          </button>
          <button
            onClick={fetchLeads}
            className="flex items-center gap-2 px-3.5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-xs font-bold text-gray-700 bg-white shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" /> Actualizar
          </button>
        </div>
      </div>

      {/* Card Principal */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* Pestañas de Estado & Filtros de Red */}
        <div className="flex flex-wrap items-center justify-between border-b border-gray-200 bg-gray-50/70 px-4 py-2 gap-3">
          
          {/* Estados */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-4 py-2 rounded-lg transition-all ${statusFilter === 'ALL' ? 'bg-[#1a4a49] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-200/60'}`}
            >
              TODOS ({leads.length})
            </button>
            <button
              onClick={() => setStatusFilter('NUEVOS')}
              className={`px-4 py-2 rounded-lg transition-all ${statusFilter === 'NUEVOS' ? 'bg-amber-500 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-200/60'}`}
            >
              NUEVOS
            </button>
            <button
              onClick={() => setStatusFilter('CONVERTIDOS')}
              className={`px-4 py-2 rounded-lg transition-all ${statusFilter === 'CONVERTIDOS' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-200/60'}`}
            >
              CONVERTIDOS
            </button>
          </div>

          {/* Filtros de Canales */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold">
            <button
              onClick={() => setChannelFilter('ALL')}
              className={`px-2.5 py-1 rounded-md border transition-all ${channelFilter === 'ALL' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
            >
              Todos los Canales
            </button>
            <button
              onClick={() => setChannelFilter('WHATSAPP')}
              className={`px-2.5 py-1 rounded-md border transition-all ${channelFilter === 'WHATSAPP' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'}`}
            >
              🟢 WhatsApp
            </button>
            <button
              onClick={() => setChannelFilter('FACEBOOK')}
              className={`px-2.5 py-1 rounded-md border transition-all ${channelFilter === 'FACEBOOK' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-800 border-blue-200 hover:bg-blue-50'}`}
            >
              🔵 Facebook
            </button>
            <button
              onClick={() => setChannelFilter('INSTAGRAM')}
              className={`px-2.5 py-1 rounded-md border transition-all ${channelFilter === 'INSTAGRAM' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-800 border-purple-200 hover:bg-purple-50'}`}
            >
              🟣 Instagram
            </button>
            <button
              onClick={() => setChannelFilter('EMAIL')}
              className={`px-2.5 py-1 rounded-md border transition-all ${channelFilter === 'EMAIL' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'}`}
            >
              ✉️ Correo
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda */}
        <div className="p-3 border-b border-gray-100 bg-white">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar prospecto por nombre, correo o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a4a49]"
            />
          </div>
        </div>
        
        {/* Tabla */}
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 text-gray-700 text-xs uppercase tracking-wider">
                <th className="py-3.5 px-6 font-bold">Cliente</th>
                <th className="py-3.5 px-6 font-bold">Plataforma</th>
                <th className="py-3.5 px-6 font-bold">Contacto / ID</th>
                <th className="py-3.5 px-6 font-bold">Fecha Captura</th>
                <th className="py-3.5 px-6 font-bold">Estado</th>
                <th className="py-3.5 px-6 font-bold text-right">Atención</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="py-8 text-center text-sm text-gray-400">Cargando prospectos...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-sm text-gray-400">No se encontraron prospectos con los filtros seleccionados.</td></tr>
              ) : filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-6 text-xs font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1a4a49]/10 text-[#1a4a49] flex items-center justify-center font-bold text-xs">
                      {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <div>{lead.name || 'Sin Nombre'}</div>
                      {lead.email && <div className="font-normal text-gray-400 text-[11px]">{lead.email}</div>}
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-xs">
                    {getPlatformBadge(lead.platform)}
                  </td>
                  <td className="py-3.5 px-6 text-xs font-mono text-gray-600">
                    {lead.phone_or_id}
                  </td>
                  <td className="py-3.5 px-6 text-xs text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${
                      lead.status === 'CONVERTIDO' || lead.status === 'CONVERTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      lead.status === 'EN CONTACTO' || lead.status === 'COTIZADO' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {lead.status || 'NUEVO'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => navigate('/admin/chats')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#1a4a49] bg-[#1a4a49]/10 hover:bg-[#1a4a49] hover:text-white rounded-lg transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Abrir Chat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
