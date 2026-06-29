import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-gray-300 mb-2">
            C<span className="text-[#c0392b]">O</span>STOS
          </h1>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Todos los derechos reservados.
          </p>
        </div>
        <div className="flex gap-4 text-sm text-gray-400">
          <Link to="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
          <Link to="/terminos" className="hover:text-white transition-colors">Términos</Link>
          <a href="mailto:contacto@costos.com" className="hover:text-white transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
