import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const getLinkClass = (path) => {
    return currentPath === path
      ? "text-[#c0392b] border-b-2 border-[#c0392b] pb-1 transition-colors font-bold"
      : "hover:text-[#c0392b] border-b-2 border-transparent pb-1 transition-colors";
  };

  return (
    <header className="sticky top-0 left-0 right-0 h-[80px] bg-white px-6 flex items-center justify-between shadow-sm z-50">
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="GardeaH Logo" className="h-10 w-10 object-contain rounded-lg" />
          <span className="text-2xl font-extrabold tracking-tight text-[#1a4a49]">
            Gardea<span className="text-[#c0392b]">H</span>
          </span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8 font-semibold text-gray-600">
        <Link to="/" className={getLinkClass('/')}>Inicio</Link>
        <Link to="/cursos" className={getLinkClass('/cursos')}>Cursos</Link>
        <Link to="/contacto" className={getLinkClass('/contacto')}>Contacto</Link>
        
        <button className="p-2 hover:text-[#c0392b] transition-colors">
          <ShoppingCart className="w-5 h-5" />
        </button>
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
