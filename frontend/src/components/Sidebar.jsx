import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, Users, MessageSquare, Settings, LogOut, Menu, UserCircle, ShieldCheck } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('clipop_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error parsing user session:', e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('clipop_user');
    localStorage.removeItem('clipop_token');
    navigate('/login');
  };

  // Definición de menú completo
  const allNavItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'CLIENT'] },
    { to: '/admin/catalog', icon: GraduationCap, label: 'Cursos', roles: ['ADMIN', 'CLIENT'] },
    { to: '/admin/leads', icon: Users, label: 'Leads', roles: ['ADMIN'] },
    { to: '/admin/chats', icon: MessageSquare, label: 'Chats IA', roles: ['ADMIN'] },
    { to: '/admin/settings', icon: Settings, label: 'Configuración', roles: ['ADMIN'] },
  ];

  // Si el usuario es CLIENT (francisco@clipop.com.mx), solo ve Dashboard y Cursos
  const userRole = currentUser?.role || 'CLIENT';
  const visibleNavItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-[#70294D] text-white flex flex-col h-full shadow-xl z-20">
      {/* Header del Sidebar */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
        <div>
          <h1 className="text-[16px] font-black tracking-wider flex items-center gap-1.5 text-white">
            CLIPOP
          </h1>
          <p className="text-[11px] text-white/70 font-medium">
            {userRole === 'ADMIN' ? 'Control Maestro' : 'Portal de Cursos'}
          </p>
        </div>
        <div className="p-1 rounded bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
          {userRole === 'ADMIN' ? 'ADMIN' : 'CLIENTE'}
        </div>
      </div>

      {/* Navegación por Rol */}
      <nav className="flex-1 py-4 flex flex-col space-y-1">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3.5 text-[14px] transition-all relative ${isActive
                ? 'bg-white/15 font-semibold text-white shadow-inner'
                : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#f39c12] rounded-r" />
                )}
                <item.icon className="w-5 h-5 opacity-95" strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Perfil del Usuario Activo */}
      {currentUser && (
        <div className="mx-4 mb-2 p-3 rounded-xl bg-black/20 border border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center font-bold text-sm text-white shrink-0">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{currentUser.name || 'Usuario'}</p>
            <p className="text-[10px] text-white/60 truncate">{currentUser.email}</p>
          </div>
        </div>
      )}

      {/* Botón Salir */}
      <div className="p-4 pt-2 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-white/80 hover:bg-red-500/20 hover:text-white rounded-lg w-full transition-all cursor-pointer font-medium"
        >
          <LogOut className="w-4 h-4 opacity-90" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
