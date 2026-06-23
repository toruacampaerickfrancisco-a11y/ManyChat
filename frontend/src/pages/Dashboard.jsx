import { ArrowUpRight, Users, MessageSquare, TrendingUp, Zap } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Leads Capturados', value: '1,248', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
    { label: 'Conversaciones Activas', value: '84', icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+5%' },
    { label: 'Tasa de Conversión', value: '14.2%', icon: TrendingUp, color: 'text-[#198754]', bg: 'bg-[#198754]/10', trend: '+2.4%' },
    { label: 'Respuestas IA', value: '4,592', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+24%' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Dashboard de Rendimiento</h2>
        <p className="text-sm text-gray-600 mt-1">Resumen general de las ventas e interacciones de la IA.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-md ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1 text-[#198754] bg-[#198754]/10 px-2 py-1 rounded text-xs font-semibold">
                <ArrowUpRight className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Actividad Reciente</h3>
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-500">Gráfico de actividad irá aquí...</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Estado del Sistema</h3>
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <div className="flex justify-between items-center p-4 rounded bg-gray-50 border border-gray-100">
              <span className="text-sm text-gray-700 font-medium">WhatsApp API</span>
              <span className="text-[#198754] flex items-center gap-2 text-xs font-bold"><div className="w-2 h-2 rounded-full bg-[#198754] animate-pulse"></div> CONECTADO</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded bg-gray-50 border border-gray-100">
              <span className="text-sm text-gray-700 font-medium">Gemini IA</span>
              <span className="text-[#198754] flex items-center gap-2 text-xs font-bold"><div className="w-2 h-2 rounded-full bg-[#198754] animate-pulse"></div> OPERATIVO</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded bg-gray-50 border border-gray-100">
              <span className="text-sm text-gray-700 font-medium">Base de Datos</span>
              <span className="text-amber-500 flex items-center gap-2 text-xs font-bold"><div className="w-2 h-2 rounded-full bg-amber-500"></div> PENDIENTE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
