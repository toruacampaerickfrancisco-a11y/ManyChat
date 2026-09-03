import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AvatarPresenter from '../../components/AvatarPresenter';
import ColaboradoresMarquee from '../../components/ColaboradoresMarquee';
import ChatbotWidget from '../../components/ChatbotWidget';
import { Zap, Sparkles, BookOpen, ShieldCheck, ArrowRight, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PresentadorVirtual() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-wider">
            <Zap className="w-4 h-4 animate-pulse" /> Inteligencia Artificial de Alta Tensión
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Presentador Virtual <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 bg-clip-text text-transparent">CLIPOP CFE</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Conoce nuestra metodología en licitaciones de alta tensión, el catálogo completo de cursos de precios unitarios en Udemy y los servicios de ingeniería de costos explicados interactivamente por nuestro avatar con voz y lip-sync.
          </p>
        </div>

        {/* Reproductor / Presentador Virtual */}
        <div className="mb-14">
          <AvatarPresenter />
        </div>

        {/* Características Técnicas del Asistente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-base">Sincronización Labial en Vivo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Animación dinámica con cambio de fotogramas y simulación de ondas eléctricas de 400kV y 230kV mientras expone el temario.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-base">5 Módulos de Aprendizaje</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explora desde la introducción gratuita en Udemy hasta licitaciones de líneas de transmisión y subestaciones eléctricas para CFE.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-base">4 Estilos Visuales del Avatar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Alterna entre la versión Diagrama Técnico, Estilo 3D Pixar, Androide Futurista y Memoji interactivo.
            </p>
          </div>
        </div>

        {/* Banner de Cursos y Enlaces Rápidos */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0d1c38] to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider">¿Listo para especializarte?</span>
            <h3 className="text-2xl font-black text-white">Explora el Catálogo Completo de Cursos</h3>
            <p className="text-xs sm:text-sm text-slate-300">Aprende con el Ing. Francisco Gardea a ganar concursos y estructurar presupuestos.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/cursos"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              Ver Cursos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <ColaboradoresMarquee />
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
