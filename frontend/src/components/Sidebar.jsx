import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, MessageSquare, Settings, LogOut, Menu } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/catalog', icon: ShoppingBag, label: 'Catálogo' },
    { to: '/admin/leads', icon: Users, label: 'Leads' },
    { to: '/admin/chats', icon: MessageSquare, label: 'Chats IA' },
    { to: '/admin/settings', icon: Settings, label: 'Configuración' },
  ];

  return (
    <aside className="w-64 bg-[#70294D] text-white flex flex-col h-full shadow-xl z-20">
      <div className="h-20 flex items-center justify-between px-6 mb-4">
        <div>
          <h1 className="text-[15px] font-bold leading-tight">Secretaría de<br/>Bienestar</h1>
          <p className="text-xs text-white/80">Ventas CRM</p>
        </div>
        <button className="text-white hover:bg-white/10 p-1 rounded">
          <Menu className="w-5 h-5" />
        </button>
      </div>
      
      <nav className="flex-1 py-2 flex flex-col">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3.5 text-[14px] transition-all relative ${
                isActive 
                  ? 'bg-white/10 font-semibold' 
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
                )}
                <item.icon className="w-5 h-5 opacity-90" strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="py-4 mt-auto">
        <NavLink to="/login" className="flex items-center gap-4 px-6 py-3.5 text-[14px] text-white/80 hover:bg-white/5 hover:text-white w-full transition-all">
          <LogOut className="w-5 h-5 opacity-90" />
          <span>Salir</span>
        </NavLink>
      </div>
    </aside>
  );
}
