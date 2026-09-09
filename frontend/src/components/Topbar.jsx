import { useState, useEffect } from 'react';
import { ShieldCheck, User } from 'lucide-react';

export default function Topbar() {
  const [now, setNow] = useState(new Date());
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('clipop_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {}

    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = now.toLocaleDateString('es-MX', dateOptions);
  // Capitalizar primera letra
  const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  return (
    <header className="h-20 bg-white border-b border-gray-200 px-8 flex justify-between items-center shrink-0 shadow-sm">
      <div className="flex flex-col text-sm text-gray-800 font-medium">
        <span className="font-semibold text-gray-900">{formattedDate}</span>
        <span className="text-gray-500 text-xs">{timeStr} hrs</span>
      </div>

      <div className="flex items-center gap-4">
        {currentUser && (
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 py-1.5 px-3.5 rounded-full">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white ${
              currentUser.role === 'ADMIN' ? 'bg-[#70294D]' : 'bg-[#f39c12]'
            }`}>
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-gray-800 leading-tight">
                {currentUser.name || currentUser.email}
              </span>
              <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                {currentUser.role === 'ADMIN' ? (
                  <>
                    <ShieldCheck className="w-3 h-3 text-[#70294D]" />
                    <span>Administrador Total</span>
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3 text-[#f39c12]" />
                    <span>Cliente (Cursos & Dashboard)</span>
                  </>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
