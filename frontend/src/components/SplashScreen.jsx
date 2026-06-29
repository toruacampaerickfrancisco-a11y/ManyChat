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
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0d2625] transition-all duration-1000 ease-in-out ${
        isAnimatingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center animate-pulse">
        <div className="w-24 h-24 bg-gradient-to-tr from-[#1a4a49] to-[#2a7a78] rounded-2xl flex items-center justify-center shadow-2xl mb-6 shadow-[#1a4a49]/50 border border-white/10">
          <HardHat size={48} className="text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-[0.2em] uppercase drop-shadow-lg">
          Ingeniería
        </h1>
        <p className="text-[#8cb8b8] mt-3 tracking-[0.3em] text-sm md:text-base font-medium">
          & COSTOS ESTRATÉGICOS
        </p>
      </div>
      
      {/* Barra de progreso decorativa inferior */}
      <div className="absolute bottom-12 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-white/60 animate-[loading_2s_ease-in-out_forwards]"></div>
      </div>
      
      {/* Estilos para la animación de la barra de carga */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}} />
    </div>
  );
}
