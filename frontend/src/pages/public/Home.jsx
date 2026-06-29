import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Target, Eye, BookOpen, Award, Calculator, TrendingUp } from 'lucide-react';
import ChatbotWidget from '../../components/ChatbotWidget';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&h=900&fit=crop", // Planos / escritorio
  "https://images.unsplash.com/photo-1541888081014-9ab5e55e8106?w=1600&h=900&fit=crop", // Construcción / Estructura
  "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1600&h=900&fit=crop"  // Trabajadores / Obra
];

export default function Home() {
  const INSTAGRAM_USER = "erick_torua";
  const getInstagramLink = () => `https://ig.me/m/${INSTAGRAM_USER}`;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Efecto para rotar las imágenes del carrusel cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === CAROUSEL_IMAGES.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      <Navbar />

      <main className="flex-grow flex flex-col">
        {/* Hero Section con Carrusel */}
        <section className="relative w-full h-[calc(100vh-80px)] min-h-[500px] flex items-center justify-center overflow-hidden">
          
          {/* Imágenes del Carrusel */}
          {CAROUSEL_IMAGES.map((img, index) => (
            <div 
              key={index}
              className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
          ))}

          {/* Contenido Principal (Texto y Botones) */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl pb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight drop-shadow-md">
              Servicios especializados para la industria de la construcción
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {/* Instagram */}
              <a href={getInstagramLink()} target="_blank" rel="noopener noreferrer" 
                className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white transition-all shadow-lg hover:shadow-xl rounded-full font-bold text-sm tracking-wide uppercase hover:-translate-y-1" title="Instagram">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
                </svg>
                Instagram
              </a>

              {/* Facebook */}
              <a href="#" className="group flex items-center gap-3 px-6 py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white transition-all shadow-lg hover:shadow-xl rounded-full font-bold text-sm tracking-wide uppercase hover:-translate-y-1" title="Facebook">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>

              {/* WhatsApp */}
              <a href="#" className="group flex items-center gap-3 px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white transition-all shadow-lg hover:shadow-xl rounded-full font-bold text-sm tracking-wide uppercase hover:-translate-y-1" title="WhatsApp">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12.013 2.007a9.92 9.92 0 00-8.487 15.084L2 22l5.05-1.328a9.932 9.932 0 0014.862-8.665A9.926 9.926 0 0012.013 2.007zM17.48 15.4c-.21.595-1.246 1.139-1.706 1.196-.425.053-.967.14-2.775-.609-2.184-.906-3.593-3.136-3.7-3.279-.107-.142-.884-1.178-.884-2.247 0-1.068.55-1.594.75-1.808.2-.213.434-.266.577-.266.142 0 .284 0 .408.006.133.006.31-.053.486.37.186.444.603 1.472.656 1.579.053.106.09.23.018.373-.071.141-.106.23-.213.337-.107.106-.226.23-.319.319-.106.107-.221.225-.097.438.124.213.551.912 1.185 1.478.818.73 1.503.953 1.716 1.06.213.106.337.088.462-.053.124-.142.533-.621.675-.834.142-.213.284-.177.479-.106.195.071 1.243.585 1.456.691.213.106.355.16.408.248.053.089.053.514-.157 1.109z"/>
                </svg>
                WhatsApp
              </a>

              {/* Telegram */}
              <a href="#" className="group flex items-center gap-3 px-6 py-3 bg-[#229ED9] hover:bg-[#1d8fc5] text-white transition-all shadow-lg hover:shadow-xl rounded-full font-bold text-sm tracking-wide uppercase hover:-translate-y-1" title="Telegram">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/>
                </svg>
                Telegram
              </a>
            </div>
          </div>

          {/* Franja de Logos Transparentes abajo del carrusel */}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent pt-12 pb-6 z-20">
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-4 px-6">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Especialistas en</p>
              <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
                {/* Logo CFE (SVG) */}
                <img 
                  src="/logo.png" 
                  alt="CFE" 
                  className="h-10 md:h-14 opacity-50 hover:opacity-100 transition-opacity drop-shadow-md grayscale hover:grayscale-0"
                />
                
                {/* Texto OPUS estilizado como logo */}
                <div className="opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 flex items-center cursor-default">
                  <span className="text-2xl md:text-3xl font-black text-white tracking-tighter drop-shadow-md">
                    OPUS
                  </span>
                </div>

                {/* Texto NEODATA estilizado como logo */}
                <div className="opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 flex items-center cursor-default">
                  <span className="text-xl md:text-2xl font-bold text-white tracking-widest drop-shadow-md">
                    NEODATA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Indicadores del Carrusel (Puntitos) */}
          <div className="absolute bottom-28 z-20 flex gap-3">
            {CAROUSEL_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-[#c0392b] scale-125' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Ir a imagen ${idx + 1}`}
              />
            ))}
          </div>

        </section>

        {/* Sección Misión y Visión */}
        <section className="py-24 px-6 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            
            {/* Misión */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#1a4a49]/5 text-[#1a4a49] rounded-full flex items-center justify-center mb-6">
                <Target size={40} />
              </div>
              <h3 className="text-3xl font-bold text-[#1a4a49] mb-4">Nuestra Misión</h3>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                Capacitar a los profesionales de la construcción con herramientas tecnológicas avanzadas como OPUS y Neodata, garantizando la elaboración de presupuestos y licitaciones altamente competitivas, precisas y rentables.
              </p>
            </div>
            
            {/* Visión */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#1a4a49]/5 text-[#1a4a49] rounded-full flex items-center justify-center mb-6">
                <Eye size={40} />
              </div>
              <h3 className="text-3xl font-bold text-[#1a4a49] mb-4">Nuestra Visión</h3>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                Ser la plataforma líder en formación continua para la industria de la construcción, destacando por la excelencia académica, la actualización constante de normativas y el éxito profesional de nuestros egresados.
              </p>
            </div>

          </div>
        </section>

        {/* Sección Perfil del Capacitador */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-[6px] border-[#1a4a49]/20 shadow-2xl flex-shrink-0 relative group">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&fit=crop" alt="Erick Torua - Capacitador" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-[#1a4a49] mb-2">Conoce a tu Capacitador</h2>
              <h4 className="text-2xl text-[#c0392b] font-bold mb-6">Ing. Erick Torua</h4>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Con años de experiencia en la elaboración de presupuestos y análisis de precios unitarios, me especializo en las herramientas más potentes del mercado como <strong>OPUS</strong> y <strong>Neodata</strong>, así como en licitaciones para dependencias gubernamentales como <strong>CFE</strong>. Mi enfoque 100% práctico te preparará para enfrentar desafíos reales y asegurar el éxito de cada uno de tus proyectos en el sector de la construcción.
              </p>
              <div className="flex flex-wrap gap-4">
                <span className="px-5 py-2.5 bg-gray-100 rounded-full text-sm font-bold text-[#1a4a49] shadow-sm">Experto en OPUS</span>
                <span className="px-5 py-2.5 bg-gray-100 rounded-full text-sm font-bold text-[#1a4a49] shadow-sm">Licitaciones CFE</span>
                <span className="px-5 py-2.5 bg-gray-100 rounded-full text-sm font-bold text-[#1a4a49] shadow-sm">Precios Unitarios</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Aprendizajes y Habilidades */}
        <section className="py-24 px-6 bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1a4a49] mb-4">¿Qué Habilidades Obtendrás?</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Domina las herramientas indispensables para triunfar en la industria y asegura la precisión absoluta de tus presupuestos.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Skill 1 */}
              <div className="flex flex-col group p-2">
                <div className="w-14 h-14 bg-[#1a4a49]/5 text-[#1a4a49] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1a4a49] group-hover:text-white transition-colors">
                  <BookOpen size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Dominio de Software</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Aprende a estructurar presupuestos y APUs desde cero con las versiones más actualizadas de OPUS y Neodata.
                </p>
              </div>

              {/* Skill 2 */}
              <div className="flex flex-col group p-2">
                <div className="w-14 h-14 bg-[#1a4a49]/5 text-[#1a4a49] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1a4a49] group-hover:text-white transition-colors">
                  <Award size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Licitaciones CFE</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Arma y presenta propuestas técnico-económicas ganadoras cumpliendo rigurosamente toda la normativa vigente.
                </p>
              </div>

              {/* Skill 3 */}
              <div className="flex flex-col group p-2">
                <div className="w-14 h-14 bg-[#1a4a49]/5 text-[#1a4a49] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1a4a49] group-hover:text-white transition-colors">
                  <Calculator size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Análisis de Costos</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Especialízate en el cálculo del factor de salario integrado (FSR), control de costos directos e indirectos.
                </p>
              </div>

              {/* Skill 4 */}
              <div className="flex flex-col group p-2">
                <div className="w-14 h-14 bg-[#1a4a49]/5 text-[#1a4a49] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1a4a49] group-hover:text-white transition-colors">
                  <TrendingUp size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Rentabilidad Total</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Optimiza tus recursos, evita fugas de capital y garantiza la rentabilidad absoluta de cada proyecto.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatbotWidget />
    </div>
  );
}
