import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Circle, MessageSquare, BookOpen, Send, Bot, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CoursePlayer() {
  const [activeTab, setActiveTab] = useState('temario'); // 'temario' | 'tutor'
  
  const curriculum = [
    { id: 1, title: '1. Introducción al Curso', duration: '5:30', completed: true },
    { id: 2, title: '2. Bases de React y Estado', duration: '15:45', completed: true },
    { id: 3, title: '3. Efectos y Ciclo de Vida', duration: '12:20', completed: false, current: true },
    { id: 4, title: '4. Enrutamiento con React Router', duration: '20:00', completed: false },
    { id: 5, title: '5. Proyecto Final', duration: '45:10', completed: false }
  ];

  return (
    <div className="h-screen bg-[#1c1d1f] text-white flex flex-col font-sans overflow-hidden">
      {/* Topbar Oscura */}
      <header className="h-[60px] bg-[#1c1d1f] border-b border-[#3e4143] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/mis-cursos" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold">Curso de React Avanzado: De cero a experto 2026</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-40 bg-[#3e4143] rounded-full h-2">
            <div className="bg-[#a435f0] h-2 rounded-full" style={{ width: '40%' }}></div>
          </div>
          <span className="text-xs font-bold text-gray-300">2 de 5 completados</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Zona del Video */}
        <div className="flex-1 flex flex-col relative bg-black">
          <div className="w-full aspect-video bg-black flex items-center justify-center border-b border-[#3e4143] relative">
            <img 
              src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop" 
              alt="Video thumbnail" 
              className="w-full h-full object-cover opacity-50"
            />
            <button className="absolute inset-0 m-auto w-20 h-20 bg-[#a435f0] hover:bg-[#8710d8] rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-[0_0_20px_rgba(164,53,240,0.5)]">
              <PlayCircle className="w-10 h-10 text-white ml-1" />
            </button>
            
            {/* Controles Simulados */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent flex items-end px-4 pb-3">
              <div className="w-full bg-white/30 h-1.5 rounded-full cursor-pointer">
                <div className="bg-[#a435f0] h-full w-1/3 rounded-full relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 overflow-y-auto flex-1">
            <h2 className="text-2xl font-bold mb-4">3. Efectos y Ciclo de Vida</h2>
            <p className="text-gray-400 mb-6 max-w-3xl leading-relaxed">
              En esta lección aprenderemos cómo utilizar el hook useEffect para conectarnos a APIs externas, manipular el DOM directamente y limpiar suscripciones. Entenderemos la diferencia entre la fase de renderizado y la fase de commit.
            </p>
            
            <div className="flex gap-4 border-b border-[#3e4143] pb-6">
              <button className="px-4 py-2 border border-gray-600 rounded text-sm font-bold hover:bg-[#3e4143] transition-colors">
                Descargar Recursos (.zip)
              </button>
            </div>
          </div>
        </div>

        {/* Barra Lateral (Temario / Tutor IA) */}
        <div className="w-[400px] border-l border-[#3e4143] bg-[#2d2f31] flex flex-col shrink-0">
          {/* Pestañas */}
          <div className="flex border-b border-[#3e4143]">
            <button 
              onClick={() => setActiveTab('temario')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'temario' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <BookOpen className="w-4 h-4" /> Contenido
            </button>
            <button 
              onClick={() => setActiveTab('tutor')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'tutor' ? 'text-[#a435f0] border-b-2 border-[#a435f0]' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <MessageSquare className="w-4 h-4" /> Tutor IA
            </button>
          </div>

          {/* Contenido Dinámico */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'temario' && (
              <div className="flex flex-col">
                <div className="bg-[#1c1d1f] p-4 border-b border-[#3e4143]">
                  <h3 className="font-bold text-sm">Sección 1: Fundamentos de React</h3>
                  <p className="text-xs text-gray-400 mt-1">2 / 5 | 1h 38m</p>
                </div>
                {curriculum.map((item) => (
                  <button 
                    key={item.id} 
                    className={`flex items-start gap-3 p-4 border-b border-[#3e4143] hover:bg-[#3e4143] text-left transition-colors ${item.current ? 'bg-[#3e4143]' : ''}`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm ${item.current ? 'font-bold text-white' : 'text-gray-300'}`}>{item.title}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <PlayCircle className="w-3 h-3" /> {item.duration}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'tutor' && (
              <div className="flex flex-col h-full bg-[#1c1d1f]">
                <div className="p-4 border-b border-[#3e4143] bg-gradient-to-r from-[#1c1d1f] to-[#2d1c3a]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#a435f0]/20 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-[#a435f0]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">Tutor Inteligente</h3>
                      <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> En línea
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                    Soy tu tutor asistente entrenado con el contenido exacto de este curso. Si tienes alguna duda sobre el video actual, pregúntame.
                  </p>
                </div>
                
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  {/* Mensaje AI */}
                  <div className="bg-[#2d2f31] rounded-lg p-3 text-sm border border-[#3e4143]">
                    ¡Hola! Estamos en la lección de "Efectos y Ciclo de Vida". ¿En qué te puedo ayudar?
                  </div>
                  {/* Mensaje Usuario */}
                  <div className="bg-[#a435f0] text-white rounded-lg p-3 text-sm ml-8">
                    No me quedó claro para qué sirve el array vacío al final del useEffect.
                  </div>
                  {/* Mensaje AI */}
                  <div className="bg-[#2d2f31] rounded-lg p-3 text-sm border border-[#3e4143]">
                    ¡Excelente pregunta! El array vacío <code>[]</code> le indica a React que el efecto no depende de ninguna variable de estado o prop. Por lo tanto, el código dentro del <code>useEffect</code> <strong>solo se ejecutará una única vez</strong>, justo cuando el componente se monta por primera vez en la pantalla.
                  </div>
                </div>

                <div className="p-4 border-t border-[#3e4143] bg-[#2d2f31]">
                  <div className="flex relative">
                    <input 
                      type="text" 
                      placeholder="Escribe tu duda aquí..." 
                      className="w-full bg-[#1c1d1f] border border-[#3e4143] rounded p-3 pr-12 text-sm text-white focus:outline-none focus:border-[#a435f0] transition-colors"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#a435f0] transition-colors p-2">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
