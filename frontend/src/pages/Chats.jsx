import { Bot, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Chats() {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors bg-white">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Auditoría de Chats</h1>
          <p className="text-sm text-gray-600 mt-1">Historial de conversaciones atendidas por la IA.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Lista de Chats */}
        <div className="bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gray-50 font-semibold text-gray-700 text-sm">
            Conversaciones Recientes
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`p-4 rounded border text-sm cursor-pointer transition-colors ${i === 1 ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100 hover:border-gray-300 shadow-sm'}`}>
                <h4 className={`font-bold ${i === 1 ? 'text-indigo-700' : 'text-gray-800'}`}>Cliente #{1000 + i}</h4>
                <p className="text-gray-500 truncate mt-1">¿Tienen algún descuento disponible?</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visor de Chat */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-800 text-sm">Cliente #1001 (WhatsApp)</h3>
              <span className="flex items-center gap-1.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded border border-emerald-200">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                IA ATENDIENDO
              </span>
            </div>
            <button className="text-xs font-semibold px-3 py-1.5 border border-red-300 text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              PAUSAR IA (Toma Manual)
            </button>
          </div>
          <div className="flex-1 overflow-auto p-6 space-y-6 bg-gray-50/30">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center shrink-0 border border-gray-300">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-white p-3 rounded-lg rounded-tl-none border border-gray-200 text-sm text-gray-700 max-w-[80%] shadow-sm">
                Hola, estoy interesado en el curso de React Avanzado. ¿Cuánto dura y qué precio tiene?
              </div>
            </div>
            
            <div className="flex gap-4 flex-row-reverse">
              <div className="w-8 h-8 rounded bg-[#198754]/10 flex items-center justify-center shrink-0 border border-[#198754]/30">
                <Bot className="w-4 h-4 text-[#198754]" />
              </div>
              <div className="bg-[#198754]/5 p-3 rounded-lg rounded-tr-none border border-[#198754]/20 text-sm text-gray-800 max-w-[80%] shadow-sm">
                ¡Hola! Qué gusto saludarte. El <strong>Curso de React Avanzado</strong> tiene una duración total de 40 horas de contenido en video y su precio actual es de $99.99 USD. Además, si te inscribes hoy, te puedo ofrecer un código de descuento del 10%. ¿Te gustaría que te envíe el enlace de compra?
              </div>
            </div>
          </div>
          <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center gap-3">
            <input type="text" placeholder="Escribe un mensaje para enviarlo manualmente..." className="flex-1 border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#198754]" />
            <button className="bg-[#198754] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#157347] transition-colors">Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
