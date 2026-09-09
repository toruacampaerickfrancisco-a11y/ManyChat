import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Users, 
  MessageSquare, 
  Film, 
  Smartphone, 
  Bot, 
  Database, 
  RefreshCw, 
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLeads: 0,
    totalMessages: 0,
    totalAiResponses: 0,
    totalMedia: 0,
    whatsappStatus: 'DISCONNECTED',
    whatsappPhone: 'No vinculado',
    geminiStatus: 'OPERATIVO',
    databaseStatus: 'CONECTADO'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        if (Array.isArray(data.recentActivity)) {
          setRecentActivity(data.recentActivity);
        }
      }
    } catch (err) {
      console.error('[Dashboard fetch error]', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { 
      label: 'Cursos Oficiales Activos', 
      value: stats.totalCourses, 
      desc: 'Cursos y diplomados listos para venta',
      icon: GraduationCap, 
      color: 'text-emerald-700', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-200',
      actionText: 'Administrar Cursos',
      to: '/admin/catalog'
    },
    { 
      label: 'Leads & Prospectos Reales', 
      value: stats.totalLeads, 
      desc: 'Clientes registrados en el sistema',
      icon: Users, 
      color: 'text-blue-700', 
      bg: 'bg-blue-50', 
      border: 'border-blue-200',
      actionText: 'Ver Todos los Leads',
      to: '/admin/leads'
    },
    { 
      label: 'Mensajes Intercambiados', 
      value: stats.totalMessages, 
      desc: `${stats.totalAiResponses} respuestas automáticas del bot`,
      icon: MessageSquare, 
      color: 'text-purple-700', 
      bg: 'bg-purple-50', 
      border: 'border-purple-200',
      actionText: 'Ir a Chats en Vivo',
      to: '/admin/chats'
    },
    { 
      label: 'Archivos Multimedia', 
      value: stats.totalMedia, 
      desc: 'Videos, temarios y assets cargados',
      icon: Film, 
      color: 'text-amber-700', 
      bg: 'bg-amber-50', 
      border: 'border-amber-200',
      actionText: 'Abrir Gestor Multimedia',
      to: '/admin/settings#media_hub'
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-300 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            📊 Dashboard del Sistema CLIPOP
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Métricas y datos en tiempo real de cursos, leads, mensajería y servicios activos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchDashboardData}
            disabled={loading}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualizar Datos
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <div 
            key={i} 
            onClick={() => navigate(card.to)}
            className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="flex justify-between items-start">
              <div className={`w-12 h-12 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <span className="text-[11px] font-bold text-gray-400 group-hover:text-gray-700 transition-colors flex items-center gap-1">
                {card.actionText} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{card.value}</p>
              <p className="text-xs font-bold text-gray-800 mt-1">{card.label}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Actividad Reciente & Estado del Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda (2 cols): Actividad Reciente Real */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> Conversaciones & Mensajes Recientes
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Últimas interacciones registradas en WhatsApp y redes sociales.</p>
            </div>
            <button 
              onClick={() => navigate('/admin/chats')}
              className="text-xs font-bold text-[#0084ff] hover:underline"
            >
              Ver Todas
            </button>
          </div>

          {recentActivity.length > 0 ? (
            <div className="divide-y divide-gray-100 space-y-1">
              {recentActivity.map((act) => (
                <div key={act.id} className="py-3 flex items-start justify-between gap-4 hover:bg-gray-50/60 rounded-xl px-2 transition-colors">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 truncate">
                        {act.userName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        act.sender === 'user' ? 'bg-blue-50 text-blue-700' :
                        act.sender === 'ai' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {act.sender === 'user' ? 'Cliente' : act.sender === 'ai' ? 'Bot IA' : 'Asesor'}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase">
                        {act.platform}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate font-mono">
                      "{act.message}"
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap pt-1">
                    {new Date(act.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-2 bg-slate-50/50 rounded-xl border border-dashed border-gray-200">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-xs font-bold text-gray-700">Sin mensajes recientes registrados aún</p>
              <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                Los mensajes que envíen tus clientes por WhatsApp o Messenger aparecerán aquí en tiempo real.
              </p>
            </div>
          )}
        </div>

        {/* Columna Derecha (1 col): Estado del Sistema */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Estado de Servicios
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Monitoreo en vivo de integraciones.</p>
            </div>

            <div className="space-y-3">
              {/* WhatsApp */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">WhatsApp</p>
                    <p className="text-[10px] text-gray-500 font-mono">{stats.whatsappPhone}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1.5 ${
                  stats.whatsappStatus === 'CONNECTED' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${stats.whatsappStatus === 'CONNECTED' ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`}></div>
                  {stats.whatsappStatus === 'CONNECTED' ? 'CONECTADO' : 'DESCONECTADO'}
                </span>
              </div>

              {/* Gemini IA */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">Motor IA (Gemini 1.5)</p>
                    <p className="text-[10px] text-gray-500">System Prompt CLIPOP</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></div>
                  OPERATIVO
                </span>
              </div>

              {/* Base de Datos */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">Base de Datos</p>
                    <p className="text-[10px] text-gray-500">Persistencia & RAG</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                  {stats.databaseStatus}
                </span>
              </div>

              {/* Flujos Oficiales */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-teal-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">Flujos del Bot</p>
                    <p className="text-[10px] text-gray-500">Menús 1, 2, 3, 4, Sí, No</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-teal-100 text-teal-800">
                  8 ACTIVOS
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/admin/settings#bot_flows')}
            className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            Abrir Configurador del Bot <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
