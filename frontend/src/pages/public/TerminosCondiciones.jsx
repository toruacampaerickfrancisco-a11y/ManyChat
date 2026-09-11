import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FileText, ShieldAlert, CheckCircle2, Mail, Trash2 } from 'lucide-react';

export default function TerminosCondiciones() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 space-y-8">
          
          <div className="border-b border-gray-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-3">
              <FileText className="w-4 h-4" /> Condiciones de Uso & Servicio
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Términos y Condiciones del Servicio
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              CLIPOP Ingeniería de Costos, Consultoría y Licitaciones | Hermosillo, Sonora
            </p>
          </div>

          <section className="space-y-3 text-gray-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-xl font-bold text-gray-900">1. Aceptación de los Términos</h2>
            <p>
              Al acceder al sitio web <strong>clipop.com.mx</strong> o al interactuar con nuestros canales automatizados en WhatsApp, Facebook Messenger e Instagram, usted acepta sujetarse a los presentes Términos y Condiciones, así como a nuestro Aviso de Privacidad. Si no está de acuerdo con estos términos, le sugerimos abstenerse de utilizar nuestros servicios digitales.
            </p>
          </section>

          <section className="space-y-3 text-gray-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-xl font-bold text-gray-900">2. Servicios Ofrecidos</h2>
            <p>CLIPOP pone a disposición de empresas, ingenieros y contratistas:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-xs sm:text-sm">Cursos pregrabados especializados en OPUS y precios unitarios.</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-xs sm:text-sm">Capacitaciones virtuales en tiempo real vía Microsoft Teams.</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-xs sm:text-sm">Cursos presenciales en Hermosillo y sedes foráneas.</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-xs sm:text-sm">Ingeniería de costos y cotización para proyectos de media y alta tensión.</span>
              </div>
            </div>
          </section>

          <section className="space-y-3 text-gray-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-xl font-bold text-gray-900">3. Uso del Asistente Virtual (Nikola)</h2>
            <p>
              Nuestro asistente inteligente Nikola está diseñado para guiar y orientar al usuario en la selección de cursos, resolución de dudas frecuentes y recepción de solicitudes de cotización. Las cotizaciones formales y alcances técnicos definitivos son revisados y confirmados directamente por nuestro equipo de ingeniería.
            </p>
          </section>

          {/* Sección crucial para Meta App Review: Eliminación de datos de usuario */}
          <section id="eliminacion-datos" className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-lg">
              <Trash2 className="w-5 h-5 text-emerald-700" />
              <span>Instrucciones para la Eliminación de Datos de Usuario</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-700">
              De acuerdo con las políticas de Meta Platform y la legislación de protección de datos, cualquier usuario que interactúe con nuestra aplicación o página de Facebook puede solicitar en cualquier momento la <strong>eliminación inmediata y completa de todos sus datos y conversaciones</strong>.
            </p>
            <div className="space-y-2 text-xs sm:text-sm">
              <p className="font-semibold text-gray-900">Pasos para solicitar la eliminación de datos:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Envíe un correo a <strong>contacto@clipop.com.mx</strong> con el asunto: <em>"Solicitud de Eliminación de Datos"</em>.</li>
                <li>Indique su nombre y el medio por el cual interactuó (ejemplo: enlace a su perfil de Facebook o número telefónico).</li>
                <li>Nuestro equipo técnico procederá al borrado permanente de sus registros en un plazo no mayor a 48 horas y le enviará la confirmación correspondiente.</li>
              </ol>
            </div>
            <div className="pt-2">
              <a 
                href="mailto:contacto@clipop.com.mx?subject=Solicitud%20de%20Eliminaci%C3%B3n%20de%20Datos"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                <Mail className="w-3.5 h-3.5" /> Solicitar Eliminación de Datos por Correo
              </a>
            </div>
          </section>

          <section className="space-y-3 text-gray-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-xl font-bold text-gray-900">4. Propiedad Intelectual</h2>
            <p>
              Todos los contenidos, marcas, logotipos, materiales didácticos de cursos y elementos multimedia presentes en esta plataforma son propiedad exclusiva de CLIPOP o cuentan con las debidas licencias de uso. Queda prohibida su reproducción o distribución no autorizada.
            </p>
          </section>

          <section className="space-y-3 text-gray-700 leading-relaxed text-sm sm:text-base border-t border-gray-100 pt-6">
            <h2 className="text-xl font-bold text-gray-900">5. Dudas y Aclaraciones</h2>
            <p className="text-sm text-gray-600">
              Para cualquier consulta sobre estos términos, escríbenos directamente a: <a href="mailto:contacto@clipop.com.mx" className="font-bold text-[#1a4a49] hover:underline">contacto@clipop.com.mx</a>.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
