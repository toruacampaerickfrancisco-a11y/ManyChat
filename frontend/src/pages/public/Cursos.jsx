import React, { useState, useEffect } from 'react';
import { Star, Users, ChevronLeft, ChevronRight, Quote, Award, CheckCircle2, Check, ExternalLink } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ChatbotWidget from '../../components/ChatbotWidget';
import ColaboradoresMarquee from '../../components/ColaboradoresMarquee';

const HOTMART_COURSE = {
  id: 'hotmart-masterclass',
  titulo: 'Curso de Análisis de Precios Unitarios. OPUS y Neodata, Proyectos de la Vida Real, CFE',
  tag: 'HOTMART MASTERCLASS / OPUS Y NEODATA / CFE',
  descripcion: 'Aprende a desarrollar precios unitarios desde cero, dominando los softwares líderes: Opus y Neodata. Enfocado en proyectos reales y licitaciones de CFE con clases personalizadas uno a uno por Teams y más de 40 horas de capacitación profesional intensiva.',
  enlace: 'https://go.hotmart.com/K93054265G',
  imagen: '/curso_hotmart_opus_neodata.jpg',
  rating: '5.0',
  valoraciones: '48',
  estudiantes: '320+',
  badge: 'Programa Más Completo',
  puntosClave: [
    'Más de 40 horas de formación práctica paso a paso',
    'Dominio de OPUS y Neodata aplicados a proyectos reales',
    'Clases y asesorías personalizadas 1 a 1 por Microsoft Teams',
    'Metodología completa para licitaciones técnico-económicas CFE'
  ]
};

const UDEMY_CURSOS_CON_RESENAS = [
  {
    id: 1,
    titulo: 'Precios Unitarios OPUS 22, OPUS 24, Neodata y Excel',
    tag: 'OPUS 22 / OPUS 24 / NEODATA / EXCEL',
    descripcion: 'Curso completo enfocado en estructurar presupuestos y análisis de precios unitarios (APU) desde cero, dominando los softwares líderes en la industria de la construcción.',
    imagen: '/concurso_subestacion.png',
    rating: '4.4',
    valoraciones: '226',
    estudiantes: '1,244',
    badge: 'Más Vendido',
    badgeColor: 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]',
    testimonio: {
      nombre: 'Ana Laura Gutiérrez',
      rating: 5,
      comentario: 'La comparación y uso práctico entre OPUS, Neodata y Excel es fantástica. El instructor tiene un dominio completo del tema y aclara dudas rápidamente. Me ayudó mucho en mi trabajo.',
      detalles: 'Estudiante verificada en Udemy'
    }
  },
  {
    id: 2,
    titulo: 'Cómo Presentar Concursos para CFE desde cero con OPUS 2020',
    tag: 'NORMATIVA CFE / OPUS 2020',
    descripcion: 'Guía práctica y metodológica para armar y presentar propuestas de licitaciones técnico-económicas para la Comisión Federal de Electricidad (CFE) en México cumpliendo toda la normativa vigente.',
    imagen: '/concurso_lineas.png',
    rating: '4.9',
    valoraciones: '24',
    estudiantes: '77',
    badge: 'Mejor Valorado',
    badgeColor: 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]',
    testimonio: {
      nombre: 'Carlos Mendoza',
      rating: 5,
      comentario: 'Excelente curso, muy bien estructurado. Te lleva de la mano paso a paso sobre cómo armar la propuesta técnica y económica conforme a las bases de CFE. ¡Totalmente recomendado!',
      detalles: 'Estudiante verificado en Udemy'
    }
  },
  {
    id: 3,
    titulo: 'OPUS. ANALISIS DE PRECIOS UNITARIOS. GRATIS!!',
    tag: 'CURSO INTRODUCTORIO',
    descripcion: 'Curso de especialización introductorio y dinámico para aprender a trabajar con la CFE, abordando la elaboración de licitaciones, concursos y análisis de precios unitarios utilizando OPUS.',
    imagen: '/concurso_redes.png',
    rating: '4.6',
    valoraciones: '62',
    estudiantes: '754',
    badge: 'Acceso Gratuito',
    badgeColor: 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]',
    testimonio: {
      nombre: 'Hugo',
      rating: 5,
      comentario: 'GRACIAS Ing. FRANCISCO GARDEA y a SIR ENERGY por este excelente curso dinámico. Con la mayoría de parámetros se aprende a trabajar con la CFE de manera profesional. Invito a más ingenieros y arquitectos a participar.',
      detalles: 'Estudiante verificado en Udemy'
    }
  },
  {
    id: 4,
    titulo: 'Análisis de Precios Unitarios 100% Práctico (OPUS 2025)',
    tag: 'OPUS 2025 / LICITACIONES CFE',
    descripcion: 'Curso del Ing. Francisco Gardea enfocado en el manejo de OPUS 2025, estructuración de concursos de CFE, elaboración de precios unitarios conforme a especificaciones vigentes y desarrollo de entregables y anexos económicos con ejemplos prácticos de Líneas de Transmisión de CFE.',
    imagen: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    rating: '5.0',
    valoraciones: '29',
    estudiantes: '180',
    badge: 'Nuevo 2025',
    badgeColor: 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]',
    testimonio: {
      nombre: 'Juan Carlos',
      rating: 5,
      comentario: 'Excelente presentación. Es un gran tema para aprender precios unitarios el elegir formas de licitaciones y concursos de CFE para el desarrollo de sus obras. El instructor tiene amplio dominio y preparación.',
      detalles: 'Estudiante verificado en Udemy'
    }
  },
  {
    id: 5,
    titulo: 'Opus 2020. Análisis de precios unitarios',
    tag: 'OPUS 2020 / CONCURSOS Y LICITACIONES',
    descripcion: 'Desarrollo de concursos y licitaciones públicas y privadas. Domina la estructuración de propuestas técnico-económicas, análisis de precios unitarios y optimización de presupuestos con OPUS.',
    imagen: '/concurso_lineas.png',
    rating: '4.5',
    valoraciones: '72',
    estudiantes: '362',
    badge: 'OPUS 2020',
    badgeColor: 'bg-[#f3e8ff] text-[#7e22ce] border-[#e9d5ff]',
    testimonio: {
      nombre: 'Cesar Axel',
      rating: 5,
      comentario: 'Me encantó el curso en verdad, explica el manejo del software sin tantos rodeos pero de manera muy objetiva. En todas las sesiones da tips y recomendaciones en base a su experiencia real en licitaciones. 10/10.',
      detalles: 'Estudiante verificado en Udemy'
    }
  }
];

export default function Cursos() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play cada 7 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= UDEMY_CURSOS_CON_RESENAS.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? UDEMY_CURSOS_CON_RESENAS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === UDEMY_CURSOS_CON_RESENAS.length - 1 ? 0 : prev + 1));
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={15} className="fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} size={15} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const currentItem = UDEMY_CURSOS_CON_RESENAS[currentIndex];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      <Navbar />

      <main className="flex-grow flex flex-col">
        {/* 1. SECCIÓN PRINCIPAL: NUESTRO CURSO MÁS COMPLETO ALOJADO EN HOTMART */}
        <section className="w-full py-12 md:py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-b border-gray-200/70">
          <div className="max-w-6xl mx-auto px-6">

            {/* Encabezado Principal */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h1 className="text-3xl md:text-5xl font-extrabold text-[#1a4a49] tracking-tight leading-tight">
                Nuestro curso más completo en Hotmart
              </h1>
              <p className="text-gray-600 text-sm md:text-base mt-3 leading-relaxed">
                Formación profesional avanzada y personalizada para dominar el análisis de precios unitarios y licitaciones de CFE con las herramientas líderes de la industria.
              </p>
            </div>

            {/* Tarjeta Destacada del Curso Hotmart */}
            <div className="relative bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">

                {/* Columna Izquierda: Imagen y Badges */}
                <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-[420px] bg-slate-900 overflow-hidden flex items-center justify-center">
                  <img
                    src={HOTMART_COURSE.imagen}
                    alt={HOTMART_COURSE.titulo}
                    onError={(e) => {
                      e.target.src = '/concurso_subestacion.png';
                    }}
                    className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                  {/* Badge Flotante */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                      {HOTMART_COURSE.badge}
                    </span>
                  </div>

                  {/* Stats en imagen */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs backdrop-blur-md bg-black/40 px-4 py-2.5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-amber-400">{HOTMART_COURSE.rating}</span>
                      <div className="flex">{renderStars(5)}</div>
                      <span className="text-white/80">({HOTMART_COURSE.valoraciones})</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Users size={14} className="text-gray-300" />
                      <span>{HOTMART_COURSE.estudiantes} alumnos</span>
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: Contenido, Puntos Clave y Botón */}
                <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <span className="text-[#c2410c] text-xs font-bold tracking-widest uppercase block mb-2">
                      {HOTMART_COURSE.tag}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                      {HOTMART_COURSE.titulo}
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                      {HOTMART_COURSE.descripcion}
                    </p>

                    {/* Puntos destacados */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {HOTMART_COURSE.puntosClave.map((punto, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                          <CheckCircle2 size={16} className="text-[#1a4a49] shrink-0 mt-0.5" />
                          <span>{punto}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botón único hacia Hotmart */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-gray-500 text-center sm:text-left">
                      <span className="block font-semibold text-gray-800">Alojado exclusivamente en Hotmart</span>
                      <span>Acceso inmediato y garantía de satisfacción</span>
                    </div>

                    <a
                      href={HOTMART_COURSE.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-[#c2410c] to-[#ea580c] hover:from-[#9a3412] hover:to-[#c2410c] text-white font-extrabold text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-xl rounded-full transform hover:-translate-y-0.5"
                    >
                      <span>Acceder en Hotmart</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 2. SECCIÓN UNIFICADA: LEYENDA DEL BENEFICIO + CARRUSEL DE CURSOS UDEMY Y RESEÑAS */}
        <section className="w-full py-14 px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">

            {/* Encabezado: Leyenda de beneficio y controles */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 px-2 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c2410c] bg-[#ffedd5] px-3 py-1 rounded-full border border-[#fed7aa] inline-block mb-3">
                  Beneficio Incluido
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a4a49] leading-snug">
                  Al adquirir el curso en Hotmart tienes acceso a todos nuestros cursos en Udemy
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-1.5">
                  Desliza para conocer los cursos de Udemy y las opiniones de los estudiantes incluidos en tu compra.
                </p>
              </div>

              {/* Botones de Navegación */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-all shadow-sm hover:shadow"
                  aria-label="Anterior curso"
                >
                  <ChevronLeft size={18} strokeWidth={2.5} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-all shadow-sm hover:shadow"
                  aria-label="Siguiente curso"
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Tarjeta Contenedora del Carrusel: Curso + Reseña */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

                {/* Lado Izquierdo (7 Cols): Ficha del Curso de Udemy */}
                <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100">
                  <div>
                    {/* Tags y Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${currentItem.badgeColor}`}>
                        {currentItem.badge}
                      </span>
                      <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">
                        {currentItem.tag}
                      </span>
                    </div>

                    {/* Título */}
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 leading-snug">
                      {currentItem.titulo}
                    </h3>

                    {/* Descripción */}
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                      {currentItem.descripcion}
                    </p>

                    {/* Métricas Udemy */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-700 mb-6 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-amber-500 text-sm">{currentItem.rating}</span>
                        <div className="flex">{renderStars(parseFloat(currentItem.rating))}</div>
                        <span className="text-gray-500">({currentItem.valoraciones} valoraciones)</span>
                      </div>
                      <div className="h-4 w-px bg-gray-200"></div>
                      <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                        <Users size={14} className="text-[#1a4a49]" />
                        <span>{currentItem.estudiantes} estudiantes</span>
                      </div>
                    </div>
                  </div>

                  {/* Inclusión garantizada sin botón a Udemy */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-xs md:text-sm text-emerald-800 font-bold bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200/60">
                      <Check size={16} className="text-emerald-600 stroke-[3]" /> Curso 100% incluido al adquirir la Masterclass en Hotmart
                    </span>
                  </div>
                </div>

                {/* Lado Derecho (5 Cols): Reseña / Testimonio del Alumno */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-6 sm:p-8 md:p-10 flex flex-col justify-between relative">

                  {/* Icono decorativo de comillas */}
                  <Quote size={80} className="absolute top-4 right-4 text-gray-200/80 -z-0 pointer-events-none stroke-[1]" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-bold text-[#1a4a49] uppercase tracking-wider bg-[#1a4a49]/10 px-2.5 py-1 rounded-md">
                        Reseña del Alumno
                      </span>
                      <div className="flex gap-1">
                        {renderStars(currentItem.testimonio.rating)}
                      </div>
                    </div>

                    <p className="text-gray-700 italic text-sm md:text-base leading-relaxed mb-6 font-medium">
                      "{currentItem.testimonio.comentario}"
                    </p>
                  </div>

                  <div className="relative z-10 border-t border-gray-200/70 pt-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {currentItem.testimonio.nombre}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {currentItem.testimonio.detalles}
                      </p>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-[#1a4a49]/10 text-[#1a4a49] flex items-center justify-center font-bold text-xs">
                      <Award size={18} />
                    </div>
                  </div>

                </div>

              </div>

              {/* Barra inferior de paginación con puntos */}
              <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  Curso {currentIndex + 1} de {UDEMY_CURSOS_CON_RESENAS.length}
                </span>

                <div className="flex gap-1.5">
                  {UDEMY_CURSOS_CON_RESENAS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-[#1a4a49]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                      aria-label={`Ir al curso ${idx + 1}`}
                    />
                  ))}
                </div>
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
