import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setIsLive(data.podcast_is_live === 'true'))
      .catch(err => console.error(err));
  }, []);

  const getLinkClass = (path) => {
    return currentPath === path
      ? "text-[#c0392b] border-b-2 border-[#c0392b] pb-1 transition-colors font-bold"
      : "hover:text-[#c0392b] border-b-2 border-transparent pb-1 transition-colors";
  };

  return (
    <header className="sticky top-0 left-0 right-0 h-[80px] bg-white px-6 flex items-center justify-between shadow-sm z-50">
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-3">
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
            className="h-14 object-contain" 
          />
          <span className="text-gray-400 text-xs font-semibold tracking-wider border-l border-gray-200 pl-3 hidden sm:inline-block">
            RFC: CCE2602093B3
          </span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8 font-semibold text-gray-600">
        <Link to="/" className={getLinkClass('/')}>Inicio</Link>
        <Link to="/servicios" className={getLinkClass('/servicios')}>Servicios</Link>
        <Link to="/cursos" className={getLinkClass('/cursos')}>Cursos</Link>
        <Link to="/contacto" className={getLinkClass('/contacto')}>Contacto</Link>

        <Link
          to="/login"
          className="px-5 py-2 bg-[#1a4a49] text-white rounded-full hover:bg-[#135a5b] transition-colors text-sm font-bold shadow-sm"
        >
          Iniciar sesión
        </Link>
      </nav>

      <button className="md:hidden p-2 text-gray-600">
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
}
