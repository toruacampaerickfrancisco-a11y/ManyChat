import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Vistas Públicas
import Home from './pages/public/Home';
import Cursos from './pages/public/Cursos';
import Servicios from './pages/public/Servicios';
import Contacto from './pages/public/Contacto';
import PresentadorVirtual from './pages/public/PresentadorVirtual';
import AvisoPrivacidad from './pages/public/AvisoPrivacidad';
import TerminosCondiciones from './pages/public/TerminosCondiciones';
import Login from './pages/auth/Login';

// Vistas del Estudiante
import StudentDashboard from './pages/student/StudentDashboard';
import CoursePlayer from './pages/student/CoursePlayer';

// Vistas del Administrador
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import Leads from './pages/Leads';
import Chats from './pages/Chats';
import Settings from './pages/Settings';

// Layout para el Panel de Administrador
function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

// Guardián de Rutas con control de Roles
function ProtectedRoute({ children, allowedRoles = ['ADMIN', 'CLIENT'] }) {
  const userJson = localStorage.getItem('clipop_user');
  
  if (!userJson) {
    // Si no ha iniciado sesión, mandar al Login
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userJson);
    const userRole = user.role || 'CLIENT';

    if (!allowedRoles.includes(userRole)) {
      // Si el rol no tiene permiso para este módulo (ej: CLIENT intentando entrar a /admin/settings), redirigir a Dashboard
      return <Navigate to="/admin/dashboard" replace />;
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

function App() {
  return (
    <Router>
      <SplashScreen />
      <Routes>
        {/* ZONA PÚBLICA (Tienda) */}
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/presentador-virtual" element={<PresentadorVirtual />} />
        <Route path="/aviso-de-privacidad" element={<AvisoPrivacidad />} />
        <Route path="/privacidad" element={<AvisoPrivacidad />} />
        <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
        <Route path="/terminos" element={<TerminosCondiciones />} />
        <Route path="/eliminacion-datos" element={<TerminosCondiciones />} />
        <Route path="/login" element={<Login />} />

        {/* ZONA ESTUDIANTE */}
        <Route path="/mis-cursos" element={<StudentDashboard />} />
        <Route path="/mis-cursos/:id/play" element={<CoursePlayer />} />

        {/* ZONA ADMINISTRADOR (CRM) CON CONTROL DE ACCESO */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Permitido para ADMIN y CLIENT (francisco@clipop.com.mx) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'CLIENT']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/catalog"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'CLIENT']}>
              <Catalog />
            </ProtectedRoute>
          }
        />

        {/* Solo permitido para ADMIN (admin@clipop.com.mx) */}
        <Route
          path="/admin/leads"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Leads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/chats"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Chats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Settings />
            </ProtectedRoute>
          }
        />
        
        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
