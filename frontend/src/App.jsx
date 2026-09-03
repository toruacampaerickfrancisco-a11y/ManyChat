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
        <Route path="/login" element={<Login />} />

        {/* ZONA ESTUDIANTE */}
        <Route path="/mis-cursos" element={<StudentDashboard />} />
        <Route path="/mis-cursos/:id/play" element={<CoursePlayer />} />

        {/* ZONA ADMINISTRADOR (CRM) */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/catalog" element={<AdminLayout><Catalog /></AdminLayout>} />
        <Route path="/admin/leads" element={<AdminLayout><Leads /></AdminLayout>} />
        <Route path="/admin/chats" element={<AdminLayout><Chats /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><Settings /></AdminLayout>} />
        
        {/* Ruta para manejar errores 404 y evitar pantallas blancas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
