import { useState, useEffect } from 'react';
import { Star, Users, MessageSquare, ChevronLeft, ChevronRight, BookOpen, Quote, Award } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ChatbotWidget from '../../components/ChatbotWidget';

const CURSOS_DATA = [
  {
    id: 1,
    titulo: "Precios Unitarios OPUS 22, OPUS 24, Neodata y Excel",
    tag: "OPUS 22 / OPUS 24 / NEODATA / EXCEL",
    descripcion: "Curso completo enfocado en estructurar presupuestos y análisis de precios unitarios (APU) desde cero, dominando los softwares líderes en la industria de la construcción.",
    enlace: "https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/",
    imagen: "/concurso_subestacion.png",
    rating: "4.4",
    valoraciones: "226",
    estudiantes: "1,244",
    badge: "Más Vendido",
    badgeColor: "bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]", // Azul
  },
  {
    id: 2,
    titulo: "Cómo Presentar Concursos para CFE desde cero con OPUS 2020",
    tag: "NORMATIVA CFE / OPUS 2020",
    descripcion: "Guía práctica y metodológica para armar y presentar propuestas de licitaciones técnico-económicas para la Comisión Federal de Electricidad (CFE) en México cumpliendo toda la normativa vigente.",
    enlace: "https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/",
    imagen: "/concurso_lineas.png",
    rating: "4.9",
    valoraciones: "24",
    estudiantes: "77",
    badge: "Mejor Valorado",
    badgeColor: "bg-[#fef3c7] text-[#b45309] border-[#fde68a]", // Naranja/Crema
  },
  {
    id: 3,
    titulo: "Análisis de Precios Unitarios - OPUS 2020 (Gratuito)",
    tag: "CURSO INTRODUCTORIO",
    descripcion: "Curso de especialización dedicado al dominio del análisis de costos directos, indirectos, cálculo de factor de salario integrado (FSR) y presupuestación esencial.",
    enlace: "https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/",
    imagen: "/concurso_redes.png",
    rating: "4.6",
    valoraciones: "115",
    estudiantes: "650",
    badge: "Acceso Gratuito",
    badgeColor: "bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]", // Verde
  }
];

const TESTIMONIOS_DATA = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    rating: 5,
    comentario: "Excelente curso, muy bien estructurado. Te lleva de la mano paso a paso sobre cómo armar la propuesta técnica y económica conforme a las bases de CFE. ¡Totalmente recomendado!",
    curso: "Cómo Presentar Concursos para CFE"
  },
  {
    id: 2,
    nombre: "Ana Laura Gutiérrez",
    rating: 5,
    comentario: "La comparación y uso práctico entre OPUS, Neodata y Excel es fantástica. El instructor tiene un dominio completo del tema y aclara dudas rápidamente. Me ayudó mucho en mi trabajo.",
    curso: "Precios Unitarios OPUS, Neodata y Excel"
  },
  {
    id: 3,
    nombre: "Ing. Roberto Solís",
    rating: 5,
    comentario: "Explicaciones claras y objetivas. Un curso sumamente práctico para quienes nos dedicamos a la formulación de ofertas de concursos públicos y privados. Gran inversión.",
    curso: "Cómo Presentar Concursos para CFE"
  },
  {
    id: 4,
    nombre: "Jorge T. Valdez",
    rating: 5,
    comentario: "Muy buena metodología de enseñanza. Ideal tanto para quienes inician en análisis de precios unitarios como para los que ya tenemos experiencia y buscamos optimizar tiempos con OPUS.",
    curso: "Precios Unitarios OPUS, Neodata y Excel"
  },
  {
    id: 5,
    nombre: "Esteban R. H.",
    rating: 4,
    comentario: "Excelente curso introductorio y gratuito. Explica muy bien los conceptos de FSR y costos indirectos de forma muy clara. Muy agradecido por este material.",
    curso: "Análisis de Precios Unitarios (Gratis)"
  }
];

export default function Cursos() {
  const [currentCurso, setCurrentCurso] = useState(0);
  const [currentTestimonio, setCurrentTestimonio] = useState(0);

  // Auto-play opcional para el carrusel de cursos (cada 8 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCurso((prev) => (prev === CURSOS_DATA.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Auto-play para el carrusel de testimonios (cada 5 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonio((prev) => (prev === TESTIMONIOS_DATA.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrevCurso = () => {
    setCurrentCurso((prev) => (prev === 0 ? CURSOS_DATA.length - 1 : prev - 1));
  };

  const handleNextCurso = () => {
    setCurrentCurso((prev) => (prev === CURSOS_DATA.length - 1 ? 0 : prev + 1));
  };

  const handlePrevTestimonio = () => {
    setCurrentTestimonio((prev) => (prev === 0 ? TESTIMONIOS_DATA.length - 1 : prev - 1));
  };

  const handleNextTestimonio = () => {
    setCurrentTestimonio((prev) => (prev === TESTIMONIOS_DATA.length - 1 ? 0 : prev + 1));
  };

  // Renderizar las estrellitas de calificación
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={16} className="fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      <Navbar />

      <main className="flex-grow flex flex-col">
        {/* Cabecera / Sección Introducción */}
        <div className="w-full py-10 bg-gray-50 flex flex-col items-center justify-center text-center px-6 border-b border-gray-100">
          <span className="text-[#1a4a49] text-xs font-bold uppercase tracking-widest bg-[#1a4a49]/10 px-3 py-1 rounded-full mb-3">
            Formación Profesional
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a4a49]">
            Nuestros Cursos en Udemy
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-2 max-w-xl">
            Aprende a formular presupuestos ganadores de obra y licitaciones para la CFE con instructores altamente calificados.
          </p>
        </div>

        {/* 1. Carrusel de Cursos Principal */}
        <section className="py-12 px-6 bg-white flex items-center justify-center">
          <div className="w-full max-w-5xl">
            <div className="relative h-[480px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl bg-black group/carousel">

              {/* Slides del Carrusel */}
              {CURSOS_DATA.map((curso, index) => (
                <div
                  key={curso.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentCurso ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                >
                  {/* Imagen de fondo */}
                  <img
                    src={curso.imagen}
                    alt={curso.titulo}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradiente oscuro superior y lateral para excelente legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/95 via-black/75 to-black/30 md:bg-gradient-to-r md:from-black/90 md:via-black/75 md:to-black/40"></div>

                  {/* Insignia / Badge de Udemy y Rating (Esquina Superior Derecha) */}
                  <div className="absolute top-6 right-6 flex flex-col items-end gap-2 z-20">
                    <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md border ${curso.badgeColor}`}>
                      {curso.badge}
                    </span>
                  </div>

                  {/* Contenido del Curso (Parte Central/Inferior) */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white z-20 max-w-3xl">
                    <span className="text-[#f5c29b] text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2 block">
                      {curso.tag}
                    </span>

                    <h3 className="text-xl md:text-3xl font-extrabold mb-4 leading-tight drop-shadow-md">
                      {curso.titulo}
                    </h3>

                    <p className="text-white/80 text-xs md:text-sm leading-relaxed mb-6 line-clamp-3 md:line-clamp-none">
                      {curso.descripcion}
                    </p>

                    {/* Stats de Udemy (Inspirados en la captura del usuario, cliqueables) */}
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 text-xs md:text-sm text-gray-200">
                      <a
                        href={`${curso.enlace}#reviews`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm cursor-pointer transition-all border border-transparent hover:border-amber-400/40 text-white"
                        title="Ver valoraciones en Udemy"
                      >
                        <span className="font-bold text-amber-400">{curso.rating}</span>
                        <div className="flex">{renderStars(parseFloat(curso.rating))}</div>
                        <span className="text-white/80 hover:text-white underline">({curso.valoraciones} valoraciones)</span>
                      </a>

                      <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                        <Users size={14} className="text-gray-300" />
                        <span><strong>{curso.estudiantes}</strong> estudiantes</span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div>
                      <a
                        href={curso.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#c0392b] hover:bg-[#a93226] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-xl rounded-full transform hover:-translate-y-0.5"
                      >
                        Acceder al Curso
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {/* Botón Izquierda */}
              <button
                onClick={handlePrevCurso}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/15 hover:bg-white/35 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 shadow-md"
                aria-label="Curso anterior"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>

              {/* Botón Derecha */}
              <button
                onClick={handleNextCurso}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/15 hover:bg-white/35 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 shadow-md"
                aria-label="Siguiente curso"
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>

              {/* Puntos Indicadores (Paginación) */}
              <div className="absolute bottom-6 right-8 z-30 flex gap-2">
                {CURSOS_DATA.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentCurso(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentCurso ? 'bg-[#c0392b] scale-125' : 'bg-white/40 hover:bg-white/70'
                      }`}
                    aria-label={`Ir al curso ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Sección del Mini Carrusel de Reseñas de Udemy */}
        <section className="py-16 px-6 bg-gray-50 border-t border-b border-gray-200/50 flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center gap-2 mb-2">
                <div className="flex text-amber-400">
                  {renderStars(5)}
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Calificaciones reales
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#1a4a49]">
                Lo que dicen nuestros alumnos en Udemy
              </h3>
              <p className="text-gray-500 text-xs md:text-sm mt-1">
                Comentarios y testimonios tomados directamente de la plataforma
              </p>
            </div>

            {/* Slider de Testimonios */}
            <div className="relative min-h-[220px] bg-white rounded-2xl border border-gray-100 shadow-xl p-8 md:p-12 flex flex-col justify-between group/reviews">

              {/* Icono de Comillas Gigante */}
              <div className="absolute top-6 right-8 text-gray-100 z-0">
                <Quote size={80} className="stroke-[1.5]" />
              </div>

              {TESTIMONIOS_DATA.map((testimonio, index) => (
                <div
                  key={testimonio.id}
                  className={`transition-all duration-500 ease-in-out ${index === currentTestimonio
                      ? 'block opacity-100 translate-x-0 relative z-10'
                      : 'hidden opacity-0 translate-x-4'
                    }`}
                >
                  {/* Estrellas */}
                  <div className="flex gap-1 mb-4">
                    {renderStars(testimonio.rating)}
                  </div>

                  {/* Texto de la Reseña */}
                  <p className="text-gray-700 italic text-sm md:text-base leading-relaxed mb-6 font-medium">
                    "{testimonio.comentario}"
                  </p>

                  {/* Autor e Información */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm md:text-base">
                        {testimonio.nombre}
                      </h4>
                      <p className="text-xs text-gray-400">
                        Estudiante verificado en Udemy
                      </p>
                    </div>

                    <div className="bg-[#1a4a49]/5 px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold text-[#1a4a49] flex items-center gap-1">
                      <Award size={12} />
                      {testimonio.curso}
                    </div>
                  </div>
                </div>
              ))}

              {/* Botón de control izquierdo */}
              <button
                onClick={handlePrevTestimonio}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-800 w-8 h-8 rounded-full border border-gray-200/70 flex items-center justify-center opacity-0 group-hover/reviews:opacity-100 transition-opacity duration-300 shadow-sm"
                aria-label="Reseña anterior"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>

              {/* Botón de control derecho */}
              <button
                onClick={handleNextTestimonio}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-800 w-8 h-8 rounded-full border border-gray-200/70 flex items-center justify-center opacity-0 group-hover/reviews:opacity-100 transition-opacity duration-300 shadow-sm"
                aria-label="Siguiente reseña"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>

              {/* Paginación de reseñas */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5">
                {TESTIMONIOS_DATA.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonio(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentTestimonio ? 'bg-[#1a4a49] scale-110' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    aria-label={`Ir a reseña ${idx + 1}`}
                  />
                ))}
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
