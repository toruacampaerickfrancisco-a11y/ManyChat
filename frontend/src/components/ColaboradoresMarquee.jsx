import React from 'react';
import atProyectos from '../assets/logos-colaboradores/ATPROYECTOS.jpeg';
import diproelec from '../assets/logos-colaboradores/DIPROELEC.jpeg';
import industream from '../assets/logos-colaboradores/Industream.jpeg';
import logocolaboradores from '../assets/logos-colaboradores/LOGOCOLABORADORES.jpeg';
import onetzal from '../assets/logos-colaboradores/Onetzal.jpeg';
import rgElectricidad from '../assets/logos-colaboradores/RG_ELECTRICIDAD.jpeg';
import syncom from '../assets/logos-colaboradores/SYNCOM.jpeg';

export default function ColaboradoresMarquee() {
  const LOGOS = [
    { src: atProyectos, name: "AT Proyectos" },
    { src: diproelec, name: "Diproelec" },
    { src: industream, name: "Industream" },
    { src: logocolaboradores, name: "Colaboradores" },
    { src: onetzal, name: "Onetzal" },
    { src: rgElectricidad, name: "RG Electricidad" },
    { src: syncom, name: "Syncom" }
  ];

  return (
    <section className="py-12 bg-white border-t border-b border-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-8 text-center">
        <span className="text-[#1a4a49] text-xs font-bold uppercase tracking-widest bg-[#1a4a49]/10 px-4 py-1.5 rounded-full inline-block">
          Nuestros Clientes y Colaboradores
        </span>
      </div>

      {/* Contenedor de marquesina con desvanecimiento suave en los laterales */}
      <div className="relative w-full overflow-hidden flex before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-24 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-24 after:bg-gradient-to-l after:from-white after:to-transparent">
        
        {/* El contenedor principal animado que se traslada de forma infinita */}
        <div className="flex w-max gap-16 animate-marquee py-2 select-none pointer-events-auto">
          
          {/* Primer conjunto de logos */}
          <div className="flex gap-16 items-center">
            {LOGOS.map((logo, idx) => (
              <img
                key={idx}
                src={logo.src}
                alt={logo.name}
                className="h-12 md:h-14 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-105 cursor-pointer max-w-[150px]"
              />
            ))}
          </div>

          {/* Segundo conjunto de logos duplicado para bucle sin fin */}
          <div className="flex gap-16 items-center" aria-hidden="true">
            {LOGOS.map((logo, idx) => (
              <img
                key={`dup-${idx}`}
                src={logo.src}
                alt={logo.name}
                className="h-12 md:h-14 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-105 cursor-pointer max-w-[150px]"
              />
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
