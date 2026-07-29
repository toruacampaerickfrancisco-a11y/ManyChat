import { useState, useEffect } from 'react';
import { GraduationCap, ClipboardCheck } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ChatbotWidget from '../../components/ChatbotWidget';
import ColaboradoresMarquee from '../../components/ColaboradoresMarquee';

// Icono personalizado y estilizado para una Torre de Alta Tensión
function TowerIcon({ className, style }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Patas de la torre */}
      <path d="M4 22L9 2M20 22L15 2" />
      {/* Brazos cruzados de la torre (soportes de cables) */}
      <path d="M2 8h20" />
      <path d="M1 14h22" />
      {/* Vigas internas en X */}
      <path d="M6.5 14l11-6" />
      <path d="M17.5 14l-11-6" />
      {/* Detalles adicionales estructurales */}
      <path d="M9 2h6" />
      <path d="M4.5 20h15" />
    </svg>
  );
}

// Componente interactivo para cada Tarjeta de Servicio (Estilo unificado idéntico a Cursos.jsx)
function ServiceCard({ title, description, badge, images, Icon, gradientId, shadowClass }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Intervalo automático para rotar las imágenes de fondo del carrusel de cada servicio
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 6000); // Cambia cada 6 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="group relative w-full min-h-[420px] md:h-[450px] rounded-[24px] overflow-hidden shadow-2xl border border-white/10 bg-[#09090b] flex flex-col justify-end transition-all duration-300">
      {/* Carrusel de Imágenes de Fondo */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${title} - ${index + 1}`}
            onError={(e) => {
              e.target.src = `/Banner${(index % 5) + 1}.jpeg`;
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
              index === currentIndex 
                ? 'opacity-65 scale-100 group-hover:scale-105 transition-transform duration-[3000ms] ease-out' 
                : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Overlay degradado profundo y unificado para máxima legibilidad tipográfica */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/75 to-black/30 pointer-events-none"></div>

      {/* Badge en la esquina superior derecha */}
      <div className="absolute top-6 right-6 bg-[#c0392b] text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg shadow-lg z-20 transition-transform group-hover:scale-105 duration-300 border border-white/10">
        {badge}
      </div>

      {/* Contenido principal en la parte inferior (Unificado) */}
      <div className="relative z-20 p-6 md:p-10 pb-12 md:pb-10 flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Icono envuelto en estilo Glassmorphism */}
        <div className={`text-white flex-shrink-0 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/15 transition-all duration-500 ${shadowClass}`}>
          <Icon className="w-9 h-9 md:w-10 md:h-10" style={{ stroke: `url(#${gradientId})` }} />
        </div>

        {/* Textos Unificados (Tipografía idéntica a Cursos) */}
        <div className="flex-grow max-w-4xl">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 drop-shadow-md tracking-tight leading-snug">
            {title}
          </h3>
          <p className="text-white/90 text-sm md:text-base font-normal leading-relaxed drop-shadow-sm max-w-3xl">
            {description}
          </p>
        </div>
      </div>

      {/* Dots indicadores del carrusel en la parte inferior derecha */}
      <div className="absolute bottom-6 right-6 z-20 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-[#c0392b] scale-125' : 'bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Ir a imagen ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Servicios() {
  const serviciosData = [
    {
      title: "Cursos (virtuales o presenciales)",
      badge: "Cursos",
      description: "Contamos con cursos en tiempo real de forma virtual o presencial, grupales o uno a uno. Especialízate con los mejores profesionales en el área de la construcción y normativas.",
      Icon: GraduationCap,
      gradientId: "grad-cursos",
      shadowClass: "group-hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] group-hover:border-[#38bdf8]/40 group-hover:bg-[#38bdf8]/5",
      images: [
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      title: "Elaboración de paquetes de licitaciones para CFE",
      badge: "Licitaciones",
      description: "Manejamos la elaboración de paquetes completos de concursos de CFE: servicios, adquisiciones, obra y mantenimientos, apegados estrictamente a los requisitos y normativa vigente de CFE.",
      Icon: ClipboardCheck,
      gradientId: "grad-licitaciones",
      shadowClass: "group-hover:shadow-[0_0_30px_rgba(192,57,43,0.5)] group-hover:border-[#c0392b]/40 group-hover:bg-[#c0392b]/5",
      images: [
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      title: "Ejecución de proyectos de media y alta tensión",
      badge: "Proyectos",
      description: "Nuestro equipo de ingenieros con 15 años de experiencia en construcción de líneas de media y alta tensión, así como subestaciones, puede ser su aliado clave tanto en proyectos de CFE como de la iniciativa privada.",
      Icon: TowerIcon,
      gradientId: "grad-proyectos",
      shadowClass: "group-hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] group-hover:border-[#34d399]/40 group-hover:bg-[#34d399]/5",
      images: [
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50/50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Cabecera de la página */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-[#1a4a49] mb-4">
              Nuestros <span className="text-[#c0392b]">Servicios</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Soluciones integrales de capacitación, asesoría en concursos de obra y ejecución de proyectos de ingeniería de alta calidad.
            </p>
          </div>

          {/* Listado de Servicios */}
          <div className="flex flex-col gap-10">
            {serviciosData.map((servicio, idx) => (
              <ServiceCard 
                key={idx}
                title={servicio.title}
                badge={servicio.badge}
                description={servicio.description}
                Icon={servicio.Icon}
                gradientId={servicio.gradientId}
                shadowClass={servicio.shadowClass}
                images={servicio.images}
              />
            ))}
          </div>
        </div>
      </main>

      <ColaboradoresMarquee />

      {/* Definición global de gradientes para usar en los iconos */}
      <svg className="w-0 h-0 absolute pointer-events-none" aria-hidden="true">
        <defs>
          {/* Gradiente para Cursos: Azul / Cian a Violeta */}
          <linearGradient id="grad-cursos" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          {/* Gradiente para Licitaciones: Oro a Rojo corporativo */}
          <linearGradient id="grad-licitaciones" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#c0392b" />
          </linearGradient>
          {/* Gradiente para Proyectos: Esmeralda a Cian */}
          <linearGradient id="grad-proyectos" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>

      <Footer />
      <ChatbotWidget />
    </div>
  );
}

