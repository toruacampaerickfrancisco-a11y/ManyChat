import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ChatbotWidget from '../../components/ChatbotWidget';

export default function Cursos() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      <Navbar />

      <main className="flex-grow flex flex-col">
        <div className="w-full py-12 bg-gray-50 flex items-center justify-center text-center px-6">
          <h2 className="text-4xl font-bold text-[#1a4a49]">Nuestros Cursos</h2>
        </div>

        <div>
          {/* Curso 1 */}
          <section className="w-full py-24 bg-[#1a4a49] flex items-center justify-center text-center px-6">
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
                className="px-8 py-3 bg-gray-100 hover:bg-white text-[#1a4a49] font-bold text-sm tracking-widest uppercase transition-colors shadow-sm rounded-full"
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
                className="px-8 py-3 bg-gray-100 hover:bg-white text-[#235857] font-bold text-sm tracking-widest uppercase transition-colors shadow-sm rounded-full"
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
                className="px-8 py-3 bg-gray-100 hover:bg-white text-[#1a4a49] font-bold text-sm tracking-widest uppercase transition-colors shadow-sm rounded-full"
              >
                Ver en Udemy
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <ChatbotWidget />
    </div>
  );
}
