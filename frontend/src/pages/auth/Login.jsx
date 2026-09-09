import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Eye, EyeOff, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import ClipopLogo from '../../components/ClipopLogo';

export default function Login() {
  const navigate = useNavigate();
  const [bgColor, setBgColor] = useState('#6b2143');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar el color guardado desde los settings del backend
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.login_bg_color) {
          setBgColor(data.login_bg_color);
        }
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || 'Credenciales incorrectas');
        setLoading(false);
        return;
      }

      // Guardar sesión de usuario y token
      localStorage.setItem('clipop_user', JSON.stringify(data.user));
      localStorage.setItem('clipop_token', data.token);

      // Redireccionar al panel
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Error en login:', err);
      setErrorMessage('Error al conectar con el servidor. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex font-sans text-white overflow-hidden relative transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px ${bgColor} inset !important;
          -webkit-text-fill-color: white !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Botón de regresar */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors z-10 text-sm font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Regresar al sitio
      </Link>

      {/* Lado Izquierdo (Textos institucionales) */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative border-r border-white/20">
        <div className="max-w-xl text-center space-y-6 flex flex-col items-center">
          
          {/* Logo Oficial CLIPOP */}
          <div className="mb-6 flex items-center justify-center transition-transform duration-300 hover:scale-105">
            <ClipopLogo />
          </div>

          <p className="text-sm font-medium leading-relaxed px-8">
            Consultoría Especializada, Proyectos y Construcción
          </p>
          <p className="text-sm tracking-widest pt-2">
            Ayudamos a profesionistas a participar en concursos de CFE Nacional
          </p>
        </div>

        {/* Textos del footer izquierdo */}
        <div className="absolute bottom-8 left-8 text-[10px] text-white/70 border-l border-white/40 pl-3 space-y-1">
          <p>Hermosillo, Sonora, México</p>
          <p>Aviso de privacidad.</p>
        </div>
      </div>

      {/* Lado Derecho (Formulario de Login) */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-sm flex flex-col items-center">

          {/* Logo Oficial en móvil */}
          <div className="lg:hidden mb-6 flex items-center justify-center">
            <ClipopLogo size="small" />
          </div>

          {/* Icono de Usuario circular en desktop */}
          <div className="hidden lg:flex w-20 h-20 rounded-full border-2 border-white items-center justify-center mb-6">
            <User className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-xl font-bold mb-8 tracking-wide">INICIAR SESIÓN</h2>

          {/* Mensaje de error si falla */}
          {errorMessage && (
            <div className="w-full mb-6 p-3 rounded-lg bg-red-500/20 border border-red-400/50 flex items-center gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full space-y-6">
            {/* Input Correo */}
            <div className="relative">
              <label className="block text-xs font-bold mb-2">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@clipop.com.mx"
                className="w-full bg-transparent border-b border-white/50 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>

            {/* Input Contraseña */}
            <div className="relative">
              <label className="block text-xs font-bold mb-2">Contraseña</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-transparent border-b border-white/50 py-2 pr-8 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-2 text-white/70 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Botón Iniciar Sesión */}
            <div className="pt-6 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                style={{ color: bgColor }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <span>Iniciar sesión</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
