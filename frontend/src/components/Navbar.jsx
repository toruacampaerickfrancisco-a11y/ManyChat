import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isLive, setIsLive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setIsLive(data.podcast_is_live === 'true'))
      .catch(err => console.error(err));
  }, []);

  // Cierra el menú móvil al cambiar de página
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  const getLinkClass = (path, isMobile = false) => {
    if (isMobile) {
      return currentPath === path
        ? "text-[#c0392b] font-bold bg-[#c0392b]/10 px-4 py-3.5 rounded-xl transition-all block w-full text-left text-base shadow-sm"
        : "text-gray-800 hover:text-[#c0392b] hover:bg-gray-100 px-4 py-3.5 rounded-xl transition-all font-semibold block w-full text-left text-base";
    }
    return currentPath === path
      ? "text-[#c0392b] border-b-2 border-[#c0392b] pb-1 transition-colors font-bold"
      : "hover:text-[#c0392b] border-b-2 border-transparent pb-1 transition-colors";
  };

  return (
    <header className="sticky top-0 left-0 right-0 h-[80px] bg-white px-4 md:px-6 flex items-center justify-between shadow-sm z-50">
      <div className="flex items-center">
        <Link to="/login" title="Acceso Administrativo" className="flex items-center gap-3 group">
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
            className="h-12 md:h-14 object-contain transition-transform duration-200 group-hover:scale-105" 
          />
          <span className="text-gray-400 text-xs font-semibold tracking-wider border-l border-gray-200 pl-3 hidden sm:inline-block">
            RFC: CCE2602093B3
          </span>
        </Link>
      </div>

      {/* Menú de Escritorio */}
      <nav className="hidden md:flex items-center gap-7 font-semibold text-gray-600">
        <Link to="/" className={getLinkClass('/')}>Inicio</Link>
        <Link to="/servicios" className={getLinkClass('/servicios')}>Servicios</Link>
        <Link to="/cursos" className={getLinkClass('/cursos')}>Cursos</Link>
        <Link to="/contacto" className={getLinkClass('/contacto')}>Contacto</Link>
        <Link 
          to="/presentador-virtual" 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-cyan-400 border border-cyan-500/40 hover:scale-105 shadow-md shadow-cyan-500/10 transition-all"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Presentador CFE</span>
        </Link>
      </nav>

      {/* Botón de Menú Móvil */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 text-gray-700 hover:text-[#1a4a49] focus:outline-none transition-colors"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
      </button>

      {/* Menú Desplegable Móvil */}
      {isMobileMenuOpen && (
        <div className="absolute top-[80px] left-0 right-0 bg-white border-b border-gray-200 shadow-2xl md:hidden flex flex-col p-4 gap-2 z-[9999]">
          <Link to="/" className={getLinkClass('/', true)}>Inicio</Link>
          <Link to="/servicios" className={getLinkClass('/servicios', true)}>Servicios</Link>
          <Link to="/cursos" className={getLinkClass('/cursos', true)}>Cursos</Link>
          <Link to="/contacto" className={getLinkClass('/contacto', true)}>Contacto</Link>
          <Link 
            to="/presentador-virtual" 
            className="flex items-center gap-2 p-3.5 rounded-xl bg-slate-950 text-cyan-400 font-bold text-base border border-cyan-500/30"
          >
            <Zap className="w-4 h-4 animate-pulse text-cyan-400" />
            <span>Presentador Virtual CFE</span>
          </Link>
        </div>
      )}
    </header>
  );
}
