import { Mail, Phone, ExternalLink, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors bg-white">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Gestión de Leads</h1>
          <p className="text-sm text-gray-600 mt-1">Prospectos capturados por la IA en todos tus canales.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="flex border-b border-gray-200 text-sm font-medium text-gray-600">
          <button className="px-6 py-4 border-b-2 border-[#198754] text-[#198754] bg-green-50/50">TODOS</button>
          <button className="px-6 py-4 border-b-2 border-transparent hover:text-gray-800 hover:bg-gray-50">NUEVOS</button>
          <button className="px-6 py-4 border-b-2 border-transparent hover:text-gray-800 hover:bg-gray-50">CONVERTIDOS</button>
        </div>
        
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b-2 border-black text-gray-900">
                <th className="py-4 px-6 font-semibold">Cliente</th>
                <th className="py-4 px-6 font-semibold">Plataforma</th>
                <th className="py-4 px-6 font-semibold">Contacto</th>
                <th className="py-4 px-6 font-semibold">Fecha</th>
                <th className="py-4 px-6 font-semibold">Estado</th>
                <th className="py-4 px-6 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="py-4 text-center">Cargando...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan="6" className="py-4 text-center">Aún no hay leads capturados por el bot.</td></tr>
              ) : leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6 text-xs font-semibold text-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                      {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    {lead.name || 'Sin Nombre'}
                    {lead.email && <span className="ml-2 font-normal text-gray-400">({lead.email})</span>}
                  </td>
                  <td className="py-4 px-6 text-xs flex items-center gap-1.5 uppercase">
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" /> {lead.platform}
                  </td>
                  <td className="py-4 px-6 text-xs flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> {lead.phone_or_id}
                  </td>
                  <td className="py-4 px-6 text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${
                      lead.status === 'CONVERTIDO' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      lead.status === 'EN CONTACTO' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-gray-800 border border-gray-200 rounded transition-colors">
                      <Mail className="w-4 h-4" />
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
