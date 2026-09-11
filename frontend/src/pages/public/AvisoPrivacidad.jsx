import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function AvisoPrivacidad() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 space-y-8">
          
          <div className="border-b border-gray-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4" /> Legal & Privacidad
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Aviso de Privacidad
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Última actualización: Septiembre 2026 | CLIPOP Ingeniería y Consultoría
            </p>
          </div>

          <section className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-xl font-bold text-gray-900">1. Identidad y Domicilio del Responsable</h2>
            <p>
              <strong>CLIPOP</strong> (Ingeniería de Costos, Consultoría y Licitaciones), con domicilio operativo en Macerata #33, Oficina, Col. Hermosillo, Sonora, C.P. 83117, México, es el responsable del tratamiento y resguardo de sus datos personales proporcionados a través de nuestro sitio web oficial (<strong>clipop.com.mx</strong>), asistente virtual (Nikola) y canales de mensajería integrados (WhatsApp, Facebook Messenger e Instagram).
            </p>
          </section>

          <section className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-xl font-bold text-gray-900">2. Datos Personales Recabados</h2>
            <p>Para brindarle nuestros servicios de capacitación, asesoría y cotización técnica, podemos recabar los siguientes datos:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nombre completo y datos de contacto (correo electrónico, número telefónico/WhatsApp).</li>
              <li>Información técnica o de proyectos compartida voluntariamente para solicitudes de cotización en media y alta tensión.</li>
              <li>Identificadores de usuario de mensajería (Facebook Messenger ID, WhatsApp ID) utilizados exclusivamente para responder a sus consultas mediante nuestro asistente inteligente.</li>
            </ul>
          </section>

          <section className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-xl font-bold text-gray-900">3. Finalidad del Tratamiento de Datos</h2>
            <p>Sus datos personales son utilizados estrictamente para las siguientes finalidades esenciales:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Atender y canalizar solicitudes de información sobre cursos en OPUS, precios unitarios y licitaciones CFE.</li>
              <li>Elaborar y remitir cotizaciones técnicas de ingeniería solicitadas.</li>
              <li>Facilitar la interacción mediante nuestro asistente virtual automatizado (Nikola).</li>
              <li>Proveer soporte técnico y seguimiento post-atención.</li>
            </ul>
            <p className="italic text-gray-500">
              CLIPOP <strong>no vende, renta ni transfiere</strong> sus datos personales a terceros con fines publicitarios o lucrativos.
            </p>
          </section>

          <section className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-xl font-bold text-gray-900">4. Derechos ARCO y Eliminación de Datos</h2>
            <p>
              Usted tiene derecho en todo momento a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales (Derechos ARCO), así como a solicitar la <strong>eliminación total de sus registros</strong> de nuestras plataformas y bases de datos.
            </p>
            <p>
              Para solicitar la eliminación de sus datos, simplemente envíe un correo electrónico a:
            </p>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-3">
              <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Correo para atención y eliminación de datos:</p>
                <a href="mailto:contacto@clipop.com.mx" className="text-sm font-bold text-[#1a4a49] hover:underline">
                  contacto@clipop.com.mx
                </a>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Su solicitud será atendida y procesada en un plazo máximo de 48 horas hábiles confirmando la baja definitiva de su información.
            </p>
          </section>

          <section className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-xl font-bold text-gray-900">5. Medidas de Seguridad</h2>
            <p>
              Implementamos protocolos de seguridad técnica y administrativa con cifrado SSL/TLS de extremo a extremo para salvaguardar la confidencialidad de todas las conversaciones e intercambios de información.
            </p>
          </section>

          <section className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base border-t border-gray-100 pt-6">
            <h2 className="text-xl font-bold text-gray-900">Contacto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hermosillo, Sonora, México</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>+52 662 474 5958</span>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
