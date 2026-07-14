import { useState, useEffect } from 'react';
import { HardHat } from 'lucide-react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    // A los 2 segundos, inicia la animación de salida (zoom y desvanecimiento)
    const timeout1 = setTimeout(() => {
      setIsAnimatingOut(true);
    }, 2000);

    // A los 3.2 segundos (da tiempo de sobra a la animación de 1s para terminar), quita el componente del DOM
    const timeout2 = setTimeout(() => {
      setIsVisible(false);
    }, 3200);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white transition-all duration-1000 ease-in-out ${
        isAnimatingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center animate-pulse">
        <div className="w-72 h-40 flex items-center justify-center mb-4 overflow-hidden">
          <img src="/logomarca.jpeg" alt="Clipop Logo" className="w-full h-full object-contain" />
        </div>
        <p className="text-gray-500 mt-2 tracking-[0.25em] text-xs md:text-sm font-bold text-center uppercase">
          Consultoría, Proyectos y Construcción
        </p>
      </div>
    </div>
  );
}
