import { Link, useNavigate } from 'react-router-dom';
import { User, Eye, ArrowLeft } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#6b2143] flex font-sans text-white overflow-hidden relative">
      {/* Botón de regresar */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors z-10 text-sm font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Regresar
      </Link>

      {/* Lado Izquierdo (Textos institucionales) */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative border-r border-white/20">
        <div className="max-w-xl text-center space-y-6">
          <h1 className="text-3xl font-bold tracking-wide">
            PANEL DE ADMINISTRACION<br />
          </h1>
          <p className="text-sm font-medium leading-relaxed px-8">
            Sistema de organizacion para el ManyChat Boot
          </p>
          <p className="text-sm tracking-widest pt-4">
            SISTEMA DE CAPTACION DE NUEVOS CLIENTES
          </p>
        </div>

        {/* Textos del footer izquierdo */}
        <div className="absolute bottom-8 left-8 text-[10px] text-white/70 border-l border-white/40 pl-3 space-y-1">
          <p> Hermosillo, Sonora, México</p>
          <p>Aviso de privacidad.</p>
        </div>
      </div>

      {/* Lado Derecho (Formulario de Login) */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-sm flex flex-col items-center">

          {/* Icono de Usuario circular */}
          <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center mb-6">
            <User className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-xl font-bold mb-12 tracking-wide">INICIAR SESIÓN</h2>

          <form onSubmit={handleLogin} className="w-full space-y-8">
            {/* Input Correo */}
            <div className="relative">
              <label className="block text-xs font-bold mb-2">Correo electrónico</label>
              <input
                type="email"
                className="w-full bg-transparent border-b border-white/50 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>

            {/* Input Contraseña */}
            <div className="relative">
              <label className="block text-xs font-bold mb-2">Contraseña</label>
              <input
                type="password"
                className="w-full bg-transparent border-b border-white/50 py-2 pr-8 text-sm text-white focus:outline-none focus:border-white transition-colors"
                required
              />
              <button type="button" className="absolute right-0 bottom-2 text-white/70 hover:text-white">
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* Olvidaste Contraseña */}
            <div className="flex justify-end pt-2">
              <a href="#" className="text-[10px] text-white hover:underline opacity-80">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón */}
            <div className="pt-8 flex justify-center">
              <button
                type="submit"
                className="bg-white text-[#6b2143] px-12 py-2.5 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors"
              >
                Iniciar sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
