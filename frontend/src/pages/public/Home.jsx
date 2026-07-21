import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Target, Eye } from 'lucide-react';
import ChatbotWidget from '../../components/ChatbotWidget';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ColaboradoresMarquee from '../../components/ColaboradoresMarquee';

const CAROUSEL_IMAGES = [
  "/Banner1.jpeg",
  "/Banner2.jpeg",
  "/Banner3.jpeg",
  "/Banner4.jpeg",
  "/Banner5.jpeg"
];

const CONCURSOS = [
  {
    imagen: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
    numeroConcurso: "CFE-0003-CACON-0040-2023",
    titulo: "S.E. Donato Guerra (Reactores de Potencia)",
    cliente: "AT PROYECTOS Y SERVICIOS ELECTROCIVILES SA DE CV",
    descripcion: "Construcción de la Obra Civil y Electromecánica para la SE Donato Guerra para el montaje de 2 reactores trifásicos de potencia de 35 MVAr, incluye traslado y montaje de equipo primario.",
    monto: "$37,643,399.50",
    status: "Adjudicado"
  },
  {
    imagen: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    numeroConcurso: "CFE-0003-CACON-0037-2023",
    titulo: "L.T. Atlacomulco Potencia – Almoloya",
    cliente: "AT PROYECTOS Y SERVICIOS ELECTROCIVILES SA DE CV",
    descripcion: "Construcción de obra civil y electromecánica del proyecto Línea de Transmisión Atlacomulco Potencia – Almoloya, integrando alcances de ampliación de subestaciones.",
    monto: "$113,477,895.68",
    status: "Adjudicado"
  },
  {
    imagen: "https://images.unsplash.com/photo-1540324155974-72413d90f414?auto=format&fit=crop&w=1200&q=80",
    numeroConcurso: "CFE-0003-CACOT-0004-2024",
    titulo: "Obras de Refuerzo CCC González Ortega",
    cliente: "ELECTRICA ASELCO SA DE CV",
    descripcion: "Obras de Refuerzo Asociadas a la Central de Ciclo Combinado González Ortega (Segunda convocatoria).",
    monto: "$2,998,072,323.78",
    status: "Adjudicado"
  },
  {
    imagen: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
    numeroConcurso: "CFE-0111-CACON-0001-2024",
    titulo: "R.E.I. Subestaciones Sonora Norte",
    cliente: "SIR ENERGY / MAJOFER CONSTRUCCIONES",
    descripcion: "Restablecimiento, eficiencia e infraestructura en subestaciones de subtransmisión de la Zona Sonora Norte.",
    monto: "$8,692,452.60",
    status: "Adjudicado"
  },
  {
    imagen: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=1200&q=80",
    numeroConcurso: "CFE-0115-CACON-0033-2024",
    titulo: "Torres de Telecomunicaciones Golfo Norte",
    cliente: "SYNCOM INTERNATIONAL SA DE CV",
    descripcion: "Construcción de obra civil y electromecánica para la instalación de torres de telecomunicaciones en el ámbito de la División Golfo Norte, paquete 04, Quinta Fase.",
    monto: "$5,979,642.43",
    status: "Adjudicado"
  },
  {
    imagen: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    numeroConcurso: "CFE-0709-CSCON-0001-2024",
    titulo: "Mantenimiento Almacén 1 Emilio Portes Gil",
    cliente: "QUETZAL CONSTRUCCION Y ESTRUCTURAS SA DE CV",
    descripcion: "Obra de mantenimiento a almacén no. 1 de cambio de techumbre de la Central Termoeléctrica Emilio Portes Gil.",
    monto: "$1,632,234.63",
    status: "Adjudicado"
  }
];

export default function Home() {
  const INSTAGRAM_USER = "erick_torua";
  const getInstagramLink = () => `https://ig.me/m/${INSTAGRAM_USER}`;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentConcursoIndex, setCurrentConcursoIndex] = useState(0);

  // Efecto para rotar las imágenes del carrusel cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === CAROUSEL_IMAGES.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Efecto para rotar el carrusel de concursos cada 6 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentConcursoIndex((prevIndex) =>
        prevIndex === CONCURSOS.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

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
              className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                onError={(e) => {
                  if (img.endsWith('.jpeg')) {
                    e.target.src = img.replace('.jpeg', '.jpg');
                  } else if (img.endsWith('.jpg')) {
                    e.target.src = img.replace('.jpg', '.png');
                  } else {
                    e.target.src = '/Banner1.jpeg';
                  }
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
          ))}

          {/* Contenido Principal (Texto y Botones) */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl pb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight drop-shadow-md">
              Clipop Consultoría Especializada, Proyectos y Construcción
            </h2>
          </div>

          {/* Franja de Logos Transparentes abajo del carrusel */}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent pt-12 pb-6 z-20">
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-4 px-6">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Nuestras Redes Sociales</p>
              <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
                {/* Logo Clipop */}
                <img
                  src="/logomarca.jpeg"
                  alt="Clipop"
                  className="h-10 md:h-14 rounded-xl opacity-50 hover:opacity-100 transition-all drop-shadow-md grayscale hover:grayscale-0 object-contain"
                />

                {/* Divisor vertical sutil */}
                <div className="h-8 w-px bg-white/20 hidden md:block"></div>

                {/* Instagram */}
                <a href={getInstagramLink()} target="_blank" rel="noopener noreferrer"
                  className="opacity-50 hover:opacity-100 text-white hover:text-[#e6683c] transition-all drop-shadow-md flex items-center justify-center" title="Instagram">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a href="https://www.facebook.com/profile.php?id=61591764152849" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 text-white hover:text-[#1877F2] transition-all drop-shadow-md flex items-center justify-center" title="Facebook">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a href="#" className="opacity-50 hover:opacity-100 text-white hover:text-[#25D366] transition-all drop-shadow-md flex items-center justify-center" title="WhatsApp">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10" fill="currentColor">
                    <path d="M12.013 2.007a9.92 9.92 0 00-8.487 15.084L2 22l5.05-1.328a9.932 9.932 0 0014.862-8.665A9.926 9.926 0 0012.013 2.007zM17.48 15.4c-.21.595-1.246 1.139-1.706 1.196-.425.053-.967.14-2.775-.609-2.184-.906-3.593-3.136-3.7-3.279-.107-.142-.884-1.178-.884-2.247 0-1.068.55-1.594.75-1.808.2-.213.434-.266.577-.266.142 0 .284 0 .408.006.133.006.31-.053.486.37.186.444.603 1.472.656 1.579.053.106.09.23.018.373-.071.141-.106.23-.213.337-.107.106-.226.23-.319.319-.106.107-.221.225-.097.438.124.213.551.912 1.185 1.478.818.73 1.503.953 1.716 1.06.213.106.337.088.462-.053.124-.142.533-.621.675-.834.142-.213.284-.177.479-.106.195.071 1.243.585 1.456.691.213.106.355.16.408.248.053.089.053.514-.157 1.109z" />
                  </svg>
                </a>

                {/* Telegram */}
                <a href="#" className="opacity-50 hover:opacity-100 text-white hover:text-[#229ED9] transition-all drop-shadow-md flex items-center justify-center" title="Telegram">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Indicadores del Carrusel (Puntitos) */}
          <div className="absolute bottom-28 z-20 flex gap-3">
            {CAROUSEL_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${idx === currentImageIndex ? 'bg-[#c0392b] scale-125' : 'bg-white/50 hover:bg-white/80'
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
              <h3 className="text-3xl font-bold text-[#1a4a49] mb-4">Misión</h3>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                Ayuda a profesionistas, emprendedores y empresarios a participar en concursos de CFE en los diferentes procedimientos, adquisiciones, servicios, mantenimiento y construcccion de proyectos que ayuden a la red electrica nacional.
              </p>
            </div>

            {/* Visión */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#1a4a49]/5 text-[#1a4a49] rounded-full flex items-center justify-center mb-6">
                <Eye size={40} />
              </div>
              <h3 className="text-3xl font-bold text-[#1a4a49] mb-4">Visión</h3>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                Crear una comunidad de profesionistas, emprendedores y empresarios que trabajando en equipo lleven acabo proyectos que ayuden a la mejora de la red electrica nacional, desarrollando y ejecutando proyectos de generacion, transmision o distribucion de energia electrica.
              </p>
            </div>

          </div>
        </section>

        {/* Sección Portafolio de Licitaciones */}
        <section className="py-24 px-6 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto flex flex-col">

            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#1a4a49] mb-4">Casos de Exito en Licitaciones</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Casos de éxito y concursos de infraestructura coordinados por nuestro equipo
              </p>
            </div>

            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl group/carousel bg-[#1a4a49]/10">
              {/* Imagen del Carrusel */}
              {CONCURSOS.map((concurso, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentConcursoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <img
                    src={concurso.imagen}
                    alt={concurso.titulo}
                    onError={(e) => {
                      e.target.src = `/Banner${(index % 5) + 1}.jpeg`;
                    }}
                    className="w-full h-full object-cover"
                  />
                  {/* Filtro oscuro para legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                  {/* Número de Concurso (Superior Derecha) */}
                  <div className="absolute top-6 right-6 bg-[#c0392b] text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg shadow-md z-20">
                    {concurso.numeroConcurso}
                  </div>

                  {/* Contenido Dinámico (Parte Inferior) */}
                  <div className="absolute bottom-0 left-0 w-full p-8 text-white z-20 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col justify-end min-h-[160px]">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white/70">
                      <span>Cliente: <strong className="text-white font-extrabold">{concurso.cliente}</strong></span>
                      <span className="w-1.5 h-1.5 bg-white/30 rounded-full"></span>
                      <span className="text-emerald-400 font-extrabold">{concurso.status}</span>
                    </div>
                    <h4 className="text-xl md:text-2xl font-extrabold mb-2 drop-shadow-md tracking-tight">
                      {concurso.titulo}
                    </h4>
                    <p className="text-white/85 text-xs md:text-sm leading-relaxed max-w-3xl drop-shadow-sm font-medium">
                      {concurso.descripcion}
                    </p>
                  </div>
                </div>
              ))}

              {/* Botón Izquierda */}
              <button
                onClick={() => setCurrentConcursoIndex((prev) => (prev === 0 ? CONCURSOS.length - 1 : prev - 1))}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 shadow-md"
                aria-label="Anterior"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
              </button>

              {/* Botón Derecha */}
              <button
                onClick={() => setCurrentConcursoIndex((prev) => (prev === CONCURSOS.length - 1 ? 0 : prev + 1))}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 shadow-md"
                aria-label="Siguiente"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
              </button>

              {/* Paginación (Puntitos) */}
              <div className="absolute bottom-6 right-8 z-30 flex gap-2">
                {CONCURSOS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentConcursoIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentConcursoIndex ? 'bg-[#c0392b] scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                    aria-label={`Ir al proyecto ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </section>

      </main>

      <ColaboradoresMarquee />
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
