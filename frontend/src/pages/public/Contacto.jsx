import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ChatbotWidget from '../../components/ChatbotWidget';
import ColaboradoresMarquee from '../../components/ColaboradoresMarquee';
import { useState } from 'react';

export default function Contacto() {
  const INSTAGRAM_USER = "clipopoficial";
  const getInstagramLink = () => "https://www.instagram.com/clipopoficial/";

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoUrl = `mailto:clipopoficial@gmail.com?subject=Mensaje de Contacto - ${encodeURIComponent(formData.nombre)}&body=Nombre: ${encodeURIComponent(formData.nombre)}%0ACorreo: ${encodeURIComponent(formData.email)}%0AMensaje: ${encodeURIComponent(formData.mensaje)}`;
    window.location.href = mailtoUrl;
    setFormData({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      <Navbar />

      <main className="flex-grow flex flex-col items-center py-16 px-6 bg-gray-50">
        <div className="text-center max-w-3xl mb-12">
          <h2 className="text-4xl font-bold text-[#1a4a49] mb-4">Ponte en Contacto</h2>
          <p className="text-gray-600 text-lg">
            ¿Tienes alguna duda sobre nuestros cursos o servicios? Llena el siguiente formulario o escríbenos directamente a través de nuestras redes sociales.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 w-full max-w-6xl">
          {/* Columna Izquierda: Formulario de Contacto */}
          <div className="flex-1 bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-[#1a4a49] mb-6">Envíanos un mensaje</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre" 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#176a6b] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@correo.com" 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#176a6b] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-semibold text-gray-700 mb-1">Mensaje</label>
                <textarea 
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="¿En qué podemos ayudarte?" 
                  rows="5"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#176a6b] focus:border-transparent transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="mt-2 w-full py-4 bg-[#1a4a49] hover:bg-[#135a5b] text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>

          {/* Columna Derecha: Redes Sociales e Información */}
          <div className="lg:w-[400px] flex flex-col gap-6 justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center gap-4">
              <h3 className="text-xl font-bold text-gray-800 mb-1">Redes Sociales</h3>
              
              <div className="flex flex-row justify-center gap-8 w-full">
                {/* Instagram */}
                <a href={getInstagramLink()} target="_blank" rel="noopener noreferrer" 
                  className="group flex items-center justify-center text-gray-400 hover:text-[#e6683c] transition-all hover:-translate-y-1 hover:scale-110" title="Instagram">
                  <svg viewBox="0 0 24 24" width="38" height="38" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a href="https://www.facebook.com/profile.php?id=61591801231145" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center text-gray-400 hover:text-[#1877F2] transition-all hover:-translate-y-1 hover:scale-110" title="Facebook">
                  <svg viewBox="0 0 24 24" width="38" height="38" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* WhatsApp */}
                <a href="https://wa.me/526624745958?text=Hola%20Clipop,%20me%20gustaría%20recibir%20información" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center text-gray-400 hover:text-[#25D366] transition-all hover:-translate-y-1 hover:scale-110" title="WhatsApp">
                  <svg viewBox="0 0 24 24" width="38" height="38" fill="currentColor">
                    <path d="M12.013 2.007a9.92 9.92 0 00-8.487 15.084L2 22l5.05-1.328a9.932 9.932 0 0014.862-8.665A9.926 9.926 0 0012.013 2.007zM17.48 15.4c-.21.595-1.246 1.139-1.706 1.196-.425.053-.967.14-2.775-.609-2.184-.906-3.593-3.136-3.7-3.279-.107-.142-.884-1.178-.884-2.247 0-1.068.55-1.594.75-1.808.2-.213.434-.266.577-.266.142 0 .284 0 .408.006.133.006.31-.053.486.37.186.444.603 1.472.656 1.579.053.106.09.23.018.373-.071.141-.106.23-.213.337-.107.106-.226.23-.319.319-.106.107-.221.225-.097.438.124.213.551.912 1.185 1.478.818.73 1.503.953 1.716 1.06.213.106.337.088.462-.053.124-.142.533-.621.675-.834.142-.213.284-.177.479-.106.195.071 1.243.585 1.456.691.213.106.355.16.408.248.053.089.053.514-.157 1.109z"/>
                  </svg>
                </a>

                {/* Telegram */}
                <a href="#" className="group flex items-center justify-center text-gray-400 hover:text-[#229ED9] transition-all hover:-translate-y-1 hover:scale-110" title="Telegram">
                  <svg viewBox="0 0 24 24" width="38" height="38" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-[#1a4a49] text-white p-8 rounded-2xl shadow-xl flex flex-col gap-3">
              <h3 className="text-xl font-bold mb-1">Horario de Atención</h3>
              <p className="text-[#a5d6d6] text-sm">Lunes a Viernes</p>
              <p className="font-semibold">09:00 AM - 06:00 PM</p>
              
              <div className="h-px bg-[#235857] my-3"></div>
              
              <p className="text-[#a5d6d6] text-sm">Correo Electrónico</p>
              <p className="font-semibold">clipopoficial@gmail.com</p>
            </div>
          </div>
        </div>
      </main>

      <ColaboradoresMarquee />
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
