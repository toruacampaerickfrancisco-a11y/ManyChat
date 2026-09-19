import { useState, useEffect } from 'react';
import { 
  Globe, 
  Bot, 
  Smartphone, 
  MessageSquare, 
  Share2, 
  TrendingUp, 
  BarChart3, 
  Users, 
  RefreshCw, 
  CheckCircle2, 
  Activity, 
  ArrowUpRight, 
  ShieldCheck,
  Clock,
  Radio,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pageViews: 0,
    totalInteractions: 0,
    webInteractions: 0,
    whatsappInteractions: 0,
    facebookInteractions: 0,
    instagramInteractions: 0,
    totalCourses: 0,
    totalLeads: 0,
    totalMessages: 0,
    whatsappStatus: 'CONNECTED',
    whatsappPhone: '6624745958',
    metaStatus: 'CONECTADO',
    metaAppId: '1098269179424331',
    geminiStatus: 'OPERATIVO',
    databaseStatus: 'SINCRONIZADO'
  });
  const [trendData, setTrendData] = useState([]);
  const [channelDistribution, setChannelDistribution] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        if (Array.isArray(data.trendData)) setTrendData(data.trendData);
        if (Array.isArray(data.channelDistribution)) setChannelDistribution(data.channelDistribution);
        if (Array.isArray(data.recentActivity)) setRecentActivity(data.recentActivity);
      }
    } catch (err) {
      console.error('[Dashboard fetch error]', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Máximo para escalar las barras de la gráfica
  const maxTotal = trendData.length > 0 
    ? Math.max(...trendData.map(d => d.total || 0), 1) 
    : 100;

  return (
    <div className="max-w-[1440px] mx-auto animate-in fade-in duration-300 space-y-7 pb-10">
      
      {/* Header Ejecutivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5 text-[#70294D]" /> Centro de Analítica & Monitoreo
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard General de Operaciones
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Tráfico web, actividad de bots omnicanal y rendimiento en tiempo real de CLIPOP.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Webhooks & Bots en Vivo
          </div>
          <button 
            onClick={fetchDashboardData}
            disabled={loading}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* 5 Tarjetas Métricas Clave (Tráfico Web + 4 Canales) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* 1. Tráfico Web */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Tráfico Web</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              {stats.pageViews?.toLocaleString('es-MX')}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Visitas en clipop.com.mx</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Conteo activo en vivo
          </div>
        </div>

        {/* 2. Bot Página Web Oficial */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Bot Página Web</span>
            <div className="w-9 h-9 rounded-xl bg-[#70294D]/10 text-[#70294D] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              {stats.webInteractions?.toLocaleString('es-MX')}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Consultas en widget web</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-[10px] text-gray-400 font-medium">
            <span>Asistente Nikola integrado</span>
          </div>
        </div>

        {/* 3. WhatsApp Oficial */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">WhatsApp</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              {stats.whatsappInteractions?.toLocaleString('es-MX')}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Línea +52 {stats.whatsappPhone}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Conexión activa
          </div>
        </div>

        {/* 4. Facebook Messenger */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Facebook Messenger</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              {stats.facebookInteractions?.toLocaleString('es-MX')}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Página Oficial CLIPOP</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-[10px] text-blue-700 font-semibold">
            <span>Meta Graph API v21.0</span>
          </div>
        </div>

        {/* 5. Instagram Direct */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Instagram</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              {stats.instagramInteractions?.toLocaleString('es-MX')}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">@clipopoficial</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-[10px] text-purple-700 font-semibold">
            <span>Canal vinculado</span>
          </div>
        </div>

      </div>

      {/* Sección Gráfica de Conversaciones & Distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfica Semanal (2 columnas) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-6">
              <div>
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#70294D]" /> Volumen de Conversaciones por Canal
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Interacciones procesadas en los últimos 7 días.
                </p>
              </div>

              {/* Leyenda sobria */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600"></span> WhatsApp
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span> Facebook
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#70294D]"></span> Web
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-600"></span> Instagram
                </span>
              </div>
            </div>

            {/* Gráfica de Barras Apiladas Elegante (SVG Puro / CSS) */}
            <div className="h-64 flex items-end justify-between gap-3 pt-4 px-2">
              {trendData.map((d, index) => {
                const isHovered = hoveredDay === index;
                const hasData = (d.total || 0) > 0;
                const totalH = hasData ? Math.max(Math.round((d.total / maxTotal) * 100), 10) : 0;
                const waH = hasData ? (d.whatsapp / d.total) * 100 : 0;
                const fbH = hasData ? (d.facebook / d.total) * 100 : 0;
                const webH = hasData ? (d.web / d.total) * 100 : 0;
                const igH = hasData ? (d.instagram / d.total) * 100 : 0;

                return (
                  <div 
                    key={index} 
                    className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                    onMouseEnter={() => setHoveredDay(index)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {/* Tooltip flotante */}
                    {isHovered && (
                      <div className="absolute bottom-full mb-3 z-30 bg-gray-900 text-white p-3 rounded-xl shadow-xl text-[11px] w-44 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                        <div className="font-bold border-b border-gray-700 pb-1 mb-1.5 text-gray-300 flex justify-between">
                          <span>{d.date}</span>
                          <span className="text-white font-bold">{d.total} msgs</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-emerald-400">
                            <span>WhatsApp:</span>
                            <span className="font-bold">{d.whatsapp}</span>
                          </div>
                          <div className="flex justify-between text-blue-400">
                            <span>Facebook:</span>
                            <span className="font-bold">{d.facebook}</span>
                          </div>
                          <div className="flex justify-between text-pink-300">
                            <span>Web:</span>
                            <span className="font-bold">{d.web}</span>
                          </div>
                          <div className="flex justify-between text-purple-300">
                            <span>Instagram:</span>
                            <span className="font-bold">{d.instagram}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Barra apilada o indicador base según datos reales */}
                    {hasData ? (
                      <div 
                        className={`w-full max-w-[42px] rounded-xl overflow-hidden flex flex-col-reverse transition-all duration-300 ${
                          isHovered ? 'ring-2 ring-gray-900/50 shadow-md' : 'shadow-2xs'
                        }`}
                        style={{ height: `${totalH}%` }}
                      >
                        <div style={{ height: `${waH}%` }} className="bg-emerald-600 hover:brightness-105 transition-all"></div>
                        <div style={{ height: `${fbH}%` }} className="bg-blue-600 hover:brightness-105 transition-all"></div>
                        <div style={{ height: `${webH}%` }} className="bg-[#70294D] hover:brightness-105 transition-all"></div>
                        <div style={{ height: `${igH}%` }} className="bg-purple-600 hover:brightness-105 transition-all"></div>
                      </div>
                    ) : (
                      <div 
                        className={`w-full max-w-[42px] h-2 rounded-full transition-all duration-200 ${
                          isHovered ? 'bg-gray-300' : 'bg-gray-100'
                        }`}
                        title="Sin actividad registrada este día"
                      />
                    )}

                    {/* Etiqueta del Día */}
                    <span className={`text-[11px] font-bold mt-3 transition-colors ${
                      isHovered ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {d.day}
                    </span>
                    <span className="text-[9px] text-gray-400 font-mono">
                      {d.date.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>Total registrado: {stats.totalInteractions} mensajes</span>
            <button 
              onClick={() => navigate('/admin/chats')} 
              className="font-bold text-[#70294D] hover:underline flex items-center gap-1"
            >
              Abrir Webhooks & Mensajería <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Distribución de Canales & Porcentajes (1 columna) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-gray-100 pb-4 mb-5">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#70294D]" /> Distribución Omnicanal
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Participación porcentual por plataforma.
              </p>
            </div>

            <div className="space-y-4">
              {channelDistribution.map((ch, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ch.color }}></span>
                      {ch.name}
                    </span>
                    <span className="font-mono text-gray-500 font-semibold">
                      {ch.count} msgs ({ch.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${ch.percentage}%`,
                        backgroundColor: ch.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-1.5">
            <div className="font-bold text-gray-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Cobertura Omnicanal Activa
            </div>
            <p className="text-gray-500 leading-relaxed">
              Las consultas entrantes en cualquier canal son respondidas automáticamente por el bot o canalizadas al asesor en la bandeja unificada.
            </p>
          </div>
        </div>

      </div>

      {/* Fila Inferior: Actividad Reciente & Monitoreo de Infraestructura */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Actividad Reciente en Vivo (2 columnas) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-700" /> Registro de Actividad Reciente
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Últimos mensajes entrantes y salientes en tiempo real.</p>
            </div>
            <button 
              onClick={() => navigate('/admin/chats')}
              className="text-xs font-bold text-[#70294D] hover:underline flex items-center gap-1"
            >
              Ver Bandeja Completa <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentActivity.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentActivity.map((act) => (
                <div key={act.id} className="py-3 flex items-start justify-between gap-4 hover:bg-gray-50/70 rounded-xl px-2.5 transition-colors">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 truncate">
                        {act.userName}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        act.sender === 'user' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        act.sender === 'ai' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                        'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {act.sender === 'user' ? 'Cliente' : act.sender === 'ai' ? 'Bot Nikola' : 'Asesor'}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase font-mono">
                        {act.platform}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      "{act.message}"
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap pt-1 font-mono">
                    {new Date(act.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 text-xs">
              Sin actividad reciente para mostrar.
            </div>
          )}
        </div>

        {/* Estado de Servicios e Infraestructura (1 columna) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-gray-700" /> Infraestructura & Integraciones
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Diagnóstico de conectividad técnica.</p>
          </div>

          <div className="space-y-3 text-xs">
            {/* Meta Graph API */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">Meta Graph API (v21.0)</p>
                <p className="text-[10px] text-gray-500 font-mono">App: {stats.metaAppId}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Conectado
              </span>
            </div>

            {/* WhatsApp */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">WhatsApp Gateway</p>
                <p className="text-[10px] text-gray-500 font-mono">{stats.whatsappPhone}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Conectado
              </span>
            </div>

            {/* Motor de Inteligencia Artificial */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">Motor Nikola IA & Reglas</p>
                <p className="text-[10px] text-gray-500">Flujos OPUS 2025 y CFE</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span> Operativo
              </span>
            </div>

            {/* Base de Datos & Memoria */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">Almacenamiento de Leads</p>
                <p className="text-[10px] text-gray-500">Sincronización en tiempo real</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Activo
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
