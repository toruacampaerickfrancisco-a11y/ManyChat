import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <img 
              src="/logomarca.jpeg" 
              alt="Clipop Logo" 
              onError={(e) => {
                const currentSrc = e.target.src;
                if (currentSrc.endsWith('.jpeg')) {
                  e.target.src = '/logomarca.jpg';
                } else if (currentSrc.endsWith('.jpg')) {
                  e.target.src = '/logo.png';
                }
              }}
              className="h-10 object-contain rounded-md" 
            />
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Todos los derechos reservados.
          </p>
        </div>
        <div className="flex gap-4 text-sm text-gray-400">
          <Link to="/servicios" className="hover:text-white transition-colors">Servicios</Link>
          <Link to="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
          <Link to="/terminos" className="hover:text-white transition-colors">Términos</Link>
          <a href="mailto:clipopoficial@gmail.com" className="hover:text-white transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
