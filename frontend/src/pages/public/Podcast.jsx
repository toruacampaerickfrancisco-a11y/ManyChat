import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function Podcast() {
  const [isLive, setIsLive] = useState(false);
  const [liveUrl, setLiveUrl] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/settings')
      .then(res => res.json())
      .then(data => {
        setIsLive(data.podcast_is_live === 'true');
        setLiveUrl(data.podcast_live_url || '');
      })
      .catch(err => console.error(err));
  }, []);

  // Función para convertir URLs de YouTube regulares a URLs embed
  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      let videoId = '';
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v');
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a4a49] tracking-tight mb-4">
            Gardea<span className="text-[#c0392b]">H</span> Podcast
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Únete a nuestras sesiones donde hablamos sobre ingeniería de costos, licitaciones, OPUS, Neodata y tendencias del sector de la construcción.
          </p>
        </div>

        {isLive ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100">
            <div className="bg-red-600 text-white p-4 flex items-center justify-center gap-3">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
              </span>
              <span className="font-bold tracking-widest uppercase">¡Estamos En Vivo!</span>
            </div>
            <div className="aspect-video w-full bg-black">
              {liveUrl ? (
                <iframe 
                  src={getEmbedUrl(liveUrl)} 
                  className="w-full h-full"
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  Cargando transmisión...
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No estamos transmitiendo en este momento</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Suscríbete a nuestros canales para recibir notificaciones cuando estemos en vivo.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#" className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition shadow-sm">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </a>
                <a href="#" className="flex items-center gap-2 px-6 py-3 bg-[#1DB954] text-white rounded-full font-bold hover:bg-[#1ed760] transition shadow-sm">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.3 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.24 1.2zM19.08 10.5C15.24 8.28 8.88 8.04 5.16 9.18c-.6.18-1.2-.18-1.38-.78-.18-.6.18-1.2.78-1.38 4.2-1.32 11.28-1.02 15.72 1.62.54.3.72.96.42 1.5-.24.54-.9.72-1.62.36z"/>
                  </svg>
                  Spotify
                </a>
              </div>
            </div>

            {/* Galería de Episodios Previos */}
            <div>
              <h3 className="text-2xl font-bold text-[#1a4a49] mb-6">Episodios Anteriores</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Placeholder Episodes */}
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group cursor-pointer hover:shadow-md transition">
                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
                        <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-bold text-red-600 mb-1 block">Episodio {item}</span>
                      <h4 className="font-bold text-gray-800 leading-tight">Título del episodio de prueba sobre Precios Unitarios</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
