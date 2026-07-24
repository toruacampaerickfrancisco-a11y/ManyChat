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
            © {new Date().getFullYear()} Clipop. Todos los derechos reservados.
          </p>
        </div>

        {/* Redes Sociales y WhatsApp */}
        <div className="flex items-center gap-4">
          {/* WhatsApp */}
          <a 
            href="https://wa.me/?text=Hola%20Clipop,%20me%20gustaría%20recibir%20información" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all duration-300"
            title="Chat en WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12.013 2.007a9.92 9.92 0 00-8.487 15.084L2 22l5.05-1.328a9.932 9.932 0 0014.862-8.665A9.926 9.926 0 0012.013 2.007zM17.48 15.4c-.21.595-1.246 1.139-1.706 1.196-.425.053-.967.14-2.775-.609-2.184-.906-3.593-3.136-3.7-3.279-.107-.142-.884-1.178-.884-2.247 0-1.068.55-1.594.75-1.808.2-.213.434-.266.577-.266.142 0 .284 0 .408.006.133.006.31-.053.486.37.186.444.603 1.472.656 1.579.053.106.09.23.018.373-.071.141-.106.23-.213.337-.107.106-.226.23-.319.319-.106.107-.221.225-.097.438.124.213.551.912 1.185 1.478.818.73 1.503.953 1.716 1.06.213.106.337.088.462-.053.124-.142.533-.621.675-.834.142-.213.284-.177.479-.106.195.071 1.243.585 1.456.691.213.106.355.16.408.248.053.089.053.514-.157 1.109z"/>
            </svg>
          </a>
          {/* Instagram */}
          <a 
            href="https://ig.me/m/erick_torua" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-pink-600/20 text-pink-400 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-all duration-300"
            title="Instagram"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
            </svg>
          </a>
          {/* Facebook */}
          <a 
            href="https://www.facebook.com/profile.php?id=61591764152849" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-300"
            title="Facebook"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          {/* Correo */}
          <a 
            href="mailto:clipopoficial@gmail.com"
            className="w-10 h-10 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white flex items-center justify-center transition-all duration-300"
            title="Correo Electrónico"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </a>
        </div>

        <div className="flex gap-4 text-sm text-gray-400">
          <Link to="/servicios" className="hover:text-white transition-colors">Servicios</Link>
          <Link to="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
          <Link to="/terminos" className="hover:text-white transition-colors">Términos</Link>
          <Link to="/contacto" className="hover:text-white transition-colors">Contacto</Link>
        </div>
      </div>
    </footer>
  );
}


