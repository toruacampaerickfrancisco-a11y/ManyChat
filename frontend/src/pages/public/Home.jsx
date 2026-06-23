import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, Camera, Users, MessageCircle, Send } from 'lucide-react';
import ChatbotWidget from '../../components/ChatbotWidget';

export default function Home() {
  // Enlace directo al perfil de Instagram para activar el Bot de ManyChat
  const INSTAGRAM_USER = "erick_torua";
  const getInstagramLink = () => `https://ig.me/m/${INSTAGRAM_USER}`;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      {/* Navbar Simple */}
      <header className="h-[80px] bg-white px-6 flex items-center justify-between shadow-sm relative z-20">
        <div className="flex items-center">
          <h1 className="text-[32px] font-bold tracking-tight text-[#1a4a49]">
            C<span className="text-[#c0392b]">O</span>STOS
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-semibold text-gray-600">
          <a href="#" className="hover:text-[#c0392b] transition-colors">Inicio</a>
          <a href="#" className="text-[#c0392b] border-b-2 border-[#c0392b] pb-1">Servicios</a>
          <a href="#" className="hover:text-[#c0392b] transition-colors">Contacto</a>
          <a href="#" className="hover:text-[#c0392b] transition-colors">Cursos</a>
          <button className="p-2 hover:text-[#c0392b] transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </nav>

        <button className="md:hidden p-2 text-gray-600">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&h=900&fit=crop"
              alt="Construcción"
              className="w-full h-full object-cover"
            />
            {/* Overlay para oscurecer la imagen y que el texto resalte */}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight drop-shadow-md">
              Servicios especializados para la industria de la construcción
            </h2>
            <div className="flex gap-4">
              <a href={getInstagramLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-3 bg-[#176a6b] hover:bg-[#135a5b] text-white transition-colors shadow-lg rounded-full font-bold text-sm tracking-widest uppercase" title="Instagram">
                <Camera className="w-5 h-5" /> IG
              </a>
              <a href="#" className="flex items-center gap-2 px-8 py-3 bg-[#176a6b] hover:bg-[#135a5b] text-white transition-colors shadow-lg rounded-full font-bold text-sm tracking-widest uppercase" title="Facebook">
                <Users className="w-5 h-5" /> FB
              </a>
              <a href="#" className="flex items-center gap-2 px-8 py-3 bg-[#176a6b] hover:bg-[#135a5b] text-white transition-colors shadow-lg rounded-full font-bold text-sm tracking-widest uppercase" title="WhatsApp">
                <MessageCircle className="w-5 h-5" /> WA
              </a>
              <a href="#" className="flex items-center gap-2 px-8 py-3 bg-[#176a6b] hover:bg-[#135a5b] text-white transition-colors shadow-lg rounded-full font-bold text-sm tracking-widest uppercase" title="Telegram">
                <Send className="w-5 h-5" /> TG
              </a>
            </div>
          </div>
        </section>


        {/* Curso 1 */}
        <section className="w-full py-24 bg-[#1a4a49] flex items-center justify-center text-center px-6" id="cursos">
          <div className="max-w-4xl flex flex-col items-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-snug">
              Precios Unitarios OPUS 22, OPUS 24, Neodata y Excel
            </h3>
            <p className="text-white/80 mb-10 max-w-2xl text-lg">
              Curso completo enfocado en estructurar presupuestos y análisis de precios unitarios (APU) desde cero, dominando OPUS (versiones 22 y 24), Neodata y Excel.
            </p>
            <a
              href="https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gray-100 hover:bg-white text-[#1a4a49] font-bold text-sm tracking-widest uppercase transition-colors shadow-sm"
            >
              Ver en Udemy
            </a>
          </div>
        </section>

        {/* Curso 2 */}
        <section className="w-full py-24 bg-[#235857] flex items-center justify-center text-center px-6">
          <div className="max-w-4xl flex flex-col items-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-snug">
              Cómo Presentar Concursos para CFE desde cero con OPUS 2020
            </h3>
            <p className="text-white/80 mb-10 max-w-2xl text-lg">
              Guía práctica y metodológica para armar y presentar propuestas de licitaciones técnico-económicas para la Comisión Federal de Electricidad (CFE) en México usando OPUS 2020.
            </p>
            <a
              href="https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gray-100 hover:bg-white text-[#235857] font-bold text-sm tracking-widest uppercase transition-colors shadow-sm"
            >
              Ver en Udemy
            </a>
          </div>
        </section>

        {/* Curso 3 */}
        <section className="w-full py-24 bg-[#1a4a49] flex items-center justify-center text-center px-6">
          <div className="max-w-4xl flex flex-col items-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-snug">
              OPUS 2020 - Análisis de Precios Unitarios
            </h3>
            <p className="text-white/80 mb-10 max-w-2xl text-lg">
              Curso de especialización dedicado al dominio del análisis de costos directos, indirectos, cálculo de factor de salario integrado (FSR) y presupuestación en la versión 2020 de OPUS.
            </p>
            <a
              href="https://www.udemy.com/course/opus-2020-analisis-de-precios-unitarios/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gray-100 hover:bg-white text-[#1a4a49] font-bold text-sm tracking-widest uppercase transition-colors shadow-sm"
            >
              Ver en Udemy
            </a>
          </div>
        </section>

      </main>

      {/* Footer Básico */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-gray-300 mb-2">
              COSTOS
            </h1>
            <p className="text-sm text-gray-500">
              © 2026 Todos los derechos reservados.
            </p>
          </div>
          <div className="flex gap-4 text-sm text-gray-400">
            <Link to="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <Link to="/terminos" className="hover:text-white transition-colors">Términos</Link>
          </div>
        </div>
      </footer>
      <ChatbotWidget />
    </div>
  );
}
