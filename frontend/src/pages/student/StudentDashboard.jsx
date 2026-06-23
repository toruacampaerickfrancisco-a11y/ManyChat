import { BookOpen, PlayCircle, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const myCourses = [
    { id: 1, name: 'Curso de React Avanzado', progress: 45, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop' },
    { id: 2, name: 'Guía de Licitaciones 2026', progress: 100, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop' }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      {/* Topbar Estudiante */}
      <header className="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold flex items-center gap-2 text-[#70294D]">
          <BookOpen className="w-6 h-6" />
          Mi Aprendizaje
        </h1>
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-gray-700">Hola, Estudiante</span>
          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4" /> Salir
          </Link>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-5xl mx-auto w-full py-12 px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Mis Cursos</h2>
        <p className="text-gray-600 mb-8">Continúa desde donde te quedaste.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {myCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="relative h-48 group cursor-pointer">
                <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-16 h-16 text-white opacity-90" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{course.name}</h3>
                
                {/* Barra de progreso */}
                <div className="mb-2 flex justify-between text-xs font-semibold text-gray-600">
                  <span>Progreso</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div className={`h-2 rounded-full ${course.progress === 100 ? 'bg-[#198754]' : 'bg-[#70294D]'}`} style={{ width: `${course.progress}%` }}></div>
                </div>

                <Link 
                  to={`/mis-cursos/${course.id}/play`}
                  className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-800 py-2.5 rounded font-semibold transition-colors flex justify-center items-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" /> 
                  {course.progress === 100 ? 'Repasar Curso' : 'Continuar Curso'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
