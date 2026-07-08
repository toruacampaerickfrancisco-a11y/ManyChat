import { useState, useEffect } from 'react';
import { Key, Save, Smartphone, ArrowLeft, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const [podcastIsLive, setPodcastIsLive] = useState(false);
  const [podcastUrl, setPodcastUrl] = useState('');
  const [loginBgColor, setLoginBgColor] = useState('#6b2143');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/settings')
      .then(res => res.json())
      .then(data => {
        setPodcastIsLive(data.podcast_is_live === 'true');
        setPodcastUrl(data.podcast_live_url || '');
        if (data.login_bg_color) setLoginBgColor(data.login_bg_color);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await fetch('http://localhost:3000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            podcast_is_live: podcastIsLive.toString(),
            podcast_live_url: podcastUrl,
            login_bg_color: loginBgColor
          }
        })
      });
      alert('Configuración guardada exitosamente');
    } catch (error) {
      alert('Error guardando configuración');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-10">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors bg-white">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Configuración</h1>
          <p className="text-sm text-gray-600 mt-1">Administra credenciales del sistema y conexión a WhatsApp.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Podcast Settings */}
        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <Radio className="w-4 h-4 text-gray-700" />
            <h3 className="text-sm font-semibold text-gray-800">Transmisión de Podcast</h3>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-gray-800">Estado En Vivo</label>
                <p className="text-xs text-gray-500">Activa esta opción para mostrar la alerta en la página principal.</p>
              </div>
              <button 
                onClick={() => setPodcastIsLive(!podcastIsLive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${podcastIsLive ? 'bg-red-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${podcastIsLive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">URL DEL VIDEO EN VIVO (YouTube, Twitch, etc.)</label>
              <input 
                type="text" 
                value={podcastUrl}
                onChange={(e) => setPodcastUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#198754]" 
              />
            </div>
            
            <button 
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-[#198754] hover:bg-[#157347] text-white px-5 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </section>

        {/* Diseño Settings */}
        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-800">Diseño del Sistema</h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">COLOR DE FONDO (INICIO DE SESIÓN)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="color" 
                  value={loginBgColor}
                  onChange={(e) => setLoginBgColor(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer border-0 p-0 bg-transparent"
                />
                <span className="text-sm font-medium text-gray-600">{loginBgColor}</span>
              </div>
            </div>
            
            <button 
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-[#198754] hover:bg-[#157347] text-white px-5 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </section>


        {/* IA Settings */}
        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <Key className="w-4 h-4 text-gray-700" />
            <h3 className="text-sm font-semibold text-gray-800">Google Gemini API</h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">API KEY DE GEMINI</label>
              <input type="password" value="************************" readOnly className="w-full bg-gray-50 border border-gray-300 rounded p-2.5 text-sm text-gray-800 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">SYSTEM PROMPT (PERSONALIDAD)</label>
              <textarea 
                rows="4" 
                className="w-full border border-gray-300 rounded p-3 text-sm text-gray-800 focus:outline-none focus:border-[#198754]"
                defaultValue="Eres un asistente de ventas experto, amable y persuasivo. Tu objetivo es vender los productos del catálogo..."
              ></textarea>
            </div>
            <button className="bg-[#198754] hover:bg-[#157347] text-white px-5 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" /> GUARDAR CAMBIOS
            </button>
          </div>
        </section>

        {/* WhatsApp Settings */}
        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-gray-700" />
            <h3 className="text-sm font-semibold text-gray-800">Conexión de WhatsApp</h3>
          </div>
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="w-48 h-48 bg-white p-2 border-2 border-gray-200 rounded mb-6">
              {/* Placeholder QR */}
              <div className="w-full h-full border-4 border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-bold text-sm text-center">
                CÓDIGO<br/>QR
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center max-w-sm mb-6">
              Abre WhatsApp en tu teléfono, ve a Dispositivos Vinculados y escanea este código.
            </p>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2 rounded text-sm font-medium transition-colors">
              GENERAR NUEVO QR
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
