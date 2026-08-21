import { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Users, 
  Bell, 
  FileText, 
  Sliders, 
  CreditCard, 
  Inbox, 
  UserCheck, 
  MessageSquare, 
  Zap, 
  Bot, 
  Smartphone, 
  Check, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  Play, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  Search, 
  Filter, 
  FolderPlus, 
  Trash, 
  Grid, 
  MoreVertical, 
  ChevronDown, 
  Sparkles, 
  CheckCircle2, 
  Shield, 
  Send, 
  Radio, 
  HelpCircle,
  Clock,
  ToggleLeft,
  ToggleRight,
  ArrowRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Custom SVG Icons for exact ManyChat branding
const ManyChatLogo = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm-2-8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TikTokIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V9.28a8.28 8.28 0 0 0 3.91 1.25V7.08c0-.13-.01-.26-.01-.39z" />
  </svg>
);

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();

  // Active Menu: 'general', 'team', 'automations', 'keywords', 'instagram', 'whatsapp', 'ai', 'inbox_settings'
  const initialHash = location.hash ? location.hash.replace('#', '') : 'general';
  const [activeMenu, setActiveMenu] = useState(initialHash || 'general');
  const [copiedField, setCopiedField] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings State
  const [botEnabled, setBotEnabled] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [podcastIsLive, setPodcastIsLive] = useState(false);
  const [podcastUrl, setPodcastUrl] = useState('');
  const [loginBgColor, setLoginBgColor] = useState('#6b2143');
  const [timezone, setTimezone] = useState('(UTC-07:00) - Mexican Pacific Standard Time');
  const [shortenerUrl, setShortenerUrl] = useState('My.Many.Chat');

  // Instagram Settings State
  const [igDefaultReplyEnabled, setIgDefaultReplyEnabled] = useState(true);
  const [igStoryMentionEnabled, setIgStoryMentionEnabled] = useState(true);
  const [igStoryMentionText, setIgStoryMentionText] = useState('¡Muchas gracias por mencionarnos en tu historia de Instagram 🎉 Te compartimos nuestro catálogo de cursos de OPUS y CFE con precio especial: https://clipop.com.mx/cursos');
  const [conversationStarters, setConversationStarters] = useState([
    { id: 1, text: '🎓 Ver Catálogo de Cursos (OPUS y CFE)', payload: '1' },
    { id: 2, text: '💼 Cotizar Consultoría de Licitaciones', payload: '2' },
    { id: 3, text: '⚡ Cómo Presentar Concursos para CFE', payload: 'cfe' },
    { id: 4, text: '👨‍💼 Hablar con un Asesor Humano', payload: '3' }
  ]);
  const [newStarterText, setNewStarterText] = useState('');

  // Meta Credentials State
  const [metaAccessToken, setMetaAccessToken] = useState('');
  const [whatsappPhoneId, setWhatsappPhoneId] = useState('');
  const [testWhatsappPhone, setTestWhatsappPhone] = useState('526624745958');
  const [sendingTestMessage, setSendingTestMessage] = useState(false);
  const [testWhatsappResult, setTestWhatsappResult] = useState(null);

  // WhatsApp QR & Pairing Code State
  const [waStatus, setWaStatus] = useState({ status: 'DISCONNECTED', qr: null, connectedNumber: null });
  const [loadingWa, setLoadingWa] = useState(false);
  const [pairingPhone, setPairingPhone] = useState('526624745958');
  const [generatedPairingCode, setGeneratedPairingCode] = useState('');
  const [loadingPairing, setLoadingPairing] = useState(false);

  // Automations List State (Matching ManyChat Screenshot 4)
  const [automations, setAutomations] = useState([
    {
      id: 1,
      name: 'Clipop WhatsApp',
      status: 'STOPPED',
      trigger: 'El mensaje contiene [Hola Clipop, me gustaría recibir información]',
      executions: 2,
      ctr: '100%',
      modified: 'hace 2 semanas'
    },
    {
      id: 2,
      name: 'Clipop Facebook & Instagram',
      status: 'LIVE',
      trigger: 'El mensaje contiene [Hola Clipop, me gustaría recibir información]',
      executions: 3,
      ctr: '100%',
      modified: 'hace 2 semanas'
    },
    {
      id: 3,
      name: 'Default Reply (Flujo de Bienvenida & Cursos)',
      status: 'LIVE',
      trigger: 'Cualquier mensaje sin coincidencia',
      executions: 18,
      ctr: '94%',
      modified: 'hace 4 semanas'
    },
    {
      id: 4,
      name: 'Flujo Asesor Humano (Live Hand-off)',
      status: 'LIVE',
      trigger: 'El mensaje contiene [asesor, humano, agente]',
      executions: 7,
      ctr: '100%',
      modified: 'hace 1 semana'
    }
  ]);
  const [automationSearch, setAutomationSearch] = useState('');
  const [selectedAutomations, setSelectedAutomations] = useState([]);

  // Rules State
  const [rules, setRules] = useState([]);
  const [editingRule, setEditingRule] = useState(null);
  const [ruleForm, setRuleForm] = useState({ keyword: '', match_type: 'contains', response: '', is_active: true });
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);

  // AI Simulator State
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [testingAi, setTestingAi] = useState(false);

  // Team Members (Matching ManyChat Screenshot 3)
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Francisco Gardea Hernandez',
      email: 'contacto@gardeah.com',
      avatar: '/ing_francisco_avatar.png',
      isOwner: true,
      inboxRole: true,
      billingRole: true
    }
  ]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');

  // Synchronize hash changes with navigation
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.replace('#', '');
      setActiveMenu(hash);
    }
  }, [location.hash]);

  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
    window.location.hash = menuId;
  };

  // WhatsApp Polling
  const fetchWhatsAppStatus = async () => {
    try {
      const res = await fetch('/api/whatsapp/status');
      const data = await res.json();
      setWaStatus(data);
      if (data.pairingCode) {
        setGeneratedPairingCode(data.pairingCode);
      }
    } catch (err) {
      console.error('[WA Status fetch error]', err);
    }
  };

  useEffect(() => {
    fetchWhatsAppStatus();
    const interval = setInterval(fetchWhatsAppStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Settings & Rules
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setBotEnabled(data.bot_enabled !== 'false');
        if (data.bot_system_prompt) setSystemPrompt(data.bot_system_prompt);
        if (data.meta_access_token) setMetaAccessToken(data.meta_access_token);
        if (data.whatsapp_phone_number_id) setWhatsappPhoneId(data.whatsapp_phone_number_id);
        setPodcastIsLive(data.podcast_is_live === 'true');
        setPodcastUrl(data.podcast_live_url || '');
        if (data.login_bg_color) setLoginBgColor(data.login_bg_color);
        if (data.ig_story_mention_text) setIgStoryMentionText(data.ig_story_mention_text);
      })
      .catch(err => console.error('[Settings fetch error]', err));

    fetchRules();
  }, []);

  const fetchRules = () => {
    fetch('/api/bot/rules')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRules(data);
      })
      .catch(err => console.error('[Rules fetch error]', err));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            bot_enabled: botEnabled.toString(),
            bot_system_prompt: systemPrompt,
            meta_access_token: metaAccessToken,
            whatsapp_phone_number_id: whatsappPhoneId,
            podcast_is_live: podcastIsLive.toString(),
            podcast_live_url: podcastUrl,
            login_bg_color: loginBgColor,
            ig_story_mention_text: igStoryMentionText
          }
        })
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert('Error guardando configuración');
    }
    setSaving(false);
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleAddStarter = (e) => {
    e.preventDefault();
    if (!newStarterText.trim()) return;
    if (conversationStarters.length >= 4) {
      alert('ManyChat permite un máximo de 4 Iniciadores de Conversación en Instagram.');
      return;
    }
    setConversationStarters([
      ...conversationStarters,
      { id: Date.now(), text: newStarterText.trim(), payload: newStarterText.trim() }
    ]);
    setNewStarterText('');
  };

  const handleDeleteStarter = (id) => {
    setConversationStarters(conversationStarters.filter(s => s.id !== id));
  };

  const handleToggleAutomationStatus = (id) => {
    setAutomations(automations.map(auto => {
      if (auto.id === id) {
        return {
          ...auto,
          status: auto.status === 'LIVE' ? 'STOPPED' : 'LIVE'
        };
      }
      return auto;
    }));
  };

  const handleStartWhatsApp = async () => {
    setLoadingWa(true);
    try {
      const res = await fetch('/api/whatsapp/connect', { method: 'POST' });
      const data = await res.json();
      setWaStatus(data);
    } catch (err) {
      alert('Error iniciando conexión de WhatsApp');
    }
    setLoadingWa(false);
  };

  const handleRequestPairingCode = async (e) => {
    e.preventDefault();
    if (!pairingPhone.trim()) return alert('Introduce tu número de teléfono');
    setLoadingPairing(true);
    setGeneratedPairingCode('');

    try {
      const res = await fetch('/api/whatsapp/pairing-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: pairingPhone })
      });
      const data = await res.json();
      if (data.success && data.code) {
        setGeneratedPairingCode(data.code);
      } else {
        alert('Error: ' + (data.error || 'No se pudo generar el código. Intenta de nuevo.'));
      }
    } catch (err) {
      alert('Error solicitando código: ' + err.message);
    }
    setLoadingPairing(false);
  };

  const handleLogoutWhatsApp = async () => {
    if (!window.confirm('¿Deseas desvincular tu WhatsApp?')) return;
    setLoadingWa(true);
    try {
      await fetch('/api/whatsapp/logout', { method: 'POST' });
      setGeneratedPairingCode('');
      fetchWhatsAppStatus();
    } catch (err) {
      alert('Error al desvincular WhatsApp');
    }
    setLoadingWa(false);
  };

  const handleSaveRule = async (e) => {
    e.preventDefault();
    if (!ruleForm.keyword || !ruleForm.response) return alert('Completa la palabra clave y la respuesta');

    try {
      await fetch('/api/bot/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRule ? { ...ruleForm, id: editingRule.id } : ruleForm)
      });
      setIsRuleModalOpen(false);
      setEditingRule(null);
      setRuleForm({ keyword: '', match_type: 'contains', response: '', is_active: true });
      fetchRules();
    } catch (err) {
      alert('Error al guardar la regla');
    }
  };

  const handleDeleteRule = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta regla automática?')) return;
    try {
      await fetch(`/api/bot/rules/${id}`, { method: 'DELETE' });
      fetchRules();
    } catch (err) {
      alert('Error al eliminar la regla');
    }
  };

  const handleTestBot = async () => {
    if (!testInput.trim()) return;
    setTestingAi(true);
    setTestOutput('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testInput })
      });
      const data = await res.json();
      setTestOutput(data.reply || 'Sin respuesta generada.');
    } catch (err) {
      setTestOutput('Error en el simulador: ' + err.message);
    }
    setTestingAi(false);
  };

  const handleSendTestWhatsapp = async () => {
    if (!testWhatsappPhone.trim()) return;
    setSendingTestMessage(true);
    setTestWhatsappResult(null);

    try {
      const res = await fetch('/api/meta/test-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: testWhatsappPhone })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestWhatsappResult({ success: true, message: '✅ ¡Mensaje de prueba enviado con éxito a WhatsApp!' });
      } else {
        setTestWhatsappResult({ success: false, message: `❌ Error: ${data.error || 'Verifica que tu Token y Phone ID sean correctos'}` });
      }
    } catch (err) {
      setTestWhatsappResult({ success: false, message: `❌ Error: ${err.message}` });
    }
    setSendingTestMessage(false);
  };

  const handleInviteMember = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setTeamMembers([
      ...teamMembers,
      {
        id: Date.now(),
        name: inviteName.trim() || inviteEmail.split('@')[0],
        email: inviteEmail.trim(),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        isOwner: false,
        inboxRole: true,
        billingRole: false
      }
    ]);
    setInviteEmail('');
    setInviteName('');
    setIsInviteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white -m-6 flex flex-col font-sans antialiased text-[#1c1e21]">
      
      {/* Top Header ManyChat Navigation Bar */}
      <header className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            {activeMenu === 'automations' && 'Automatización'}
            {activeMenu === 'general' && 'Configuración'}
            {activeMenu === 'team' && 'Configuración'}
            {activeMenu === 'instagram' && 'Configuración'}
            {activeMenu === 'whatsapp' && 'Configuración'}
            {activeMenu === 'keywords' && 'Automatización'}
            {activeMenu === 'ai' && 'Automatización'}
            {activeMenu === 'inbox_settings' && 'Configuración'}
          </h1>
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            CLIPOP • Ing. Francisco Gardea
          </span>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
              <Check className="w-4 h-4" /> Guardado
            </span>
          )}
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-[#0084ff] hover:bg-[#0073e6] active:scale-98 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </header>

      {/* Main ManyChat 2-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ManyChat Sub-Sidebar (Left Navigation) */}
        <aside className="w-60 border-r border-gray-200 bg-white overflow-y-auto p-4 space-y-6 shrink-0">
          
          {/* Section: Principal */}
          <div>
            <div className="px-2 py-1 text-xs font-bold text-gray-900 tracking-tight">
              Principal
            </div>
            <div className="mt-1 space-y-0.5 text-xs font-medium">
              <button
                onClick={() => handleMenuChange('general')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors ${
                  activeMenu === 'general'
                    ? 'text-emerald-700 font-bold bg-emerald-50/60'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                General
              </button>
              <button
                onClick={() => handleMenuChange('team')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors ${
                  activeMenu === 'team'
                    ? 'text-emerald-700 font-bold bg-emerald-50/60'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Miembros del equipo
              </button>
            </div>
          </div>

          {/* Section: Automatización */}
          <div>
            <div className="px-2 py-1 text-xs font-bold text-gray-900 tracking-tight">
              Automatización
            </div>
            <div className="mt-1 space-y-0.5 text-xs font-medium">
              <button
                onClick={() => handleMenuChange('automations')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors ${
                  activeMenu === 'automations'
                    ? 'text-emerald-700 font-bold bg-emerald-50/60'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Mis automatizaciones
              </button>
              <button
                onClick={() => handleMenuChange('keywords')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors ${
                  activeMenu === 'keywords'
                    ? 'text-emerald-700 font-bold bg-emerald-50/60'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Palabras clave ({rules.length})
              </button>
              <button
                onClick={() => handleMenuChange('ai')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors ${
                  activeMenu === 'ai'
                    ? 'text-emerald-700 font-bold bg-emerald-50/60'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                AI Agent (Gemini)
              </button>
            </div>
          </div>

          {/* Section: Bandeja de entrada */}
          <div>
            <div className="px-2 py-1 text-xs font-bold text-gray-900 tracking-tight">
              Bandeja de entrada
            </div>
            <div className="mt-1 space-y-0.5 text-xs font-medium">
              <button
                onClick={() => handleMenuChange('inbox_settings')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors ${
                  activeMenu === 'inbox_settings'
                    ? 'text-emerald-700 font-bold bg-emerald-50/60'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Comportamiento de Inbox
              </button>
            </div>
          </div>

          {/* Section: Canales */}
          <div>
            <div className="px-2 py-1 text-xs font-bold text-gray-900 tracking-tight">
              Canales
            </div>
            <div className="mt-1 space-y-1 text-xs font-medium">
              <button
                onClick={() => handleMenuChange('instagram')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors ${
                  activeMenu === 'instagram'
                    ? 'text-purple-900 font-bold bg-purple-50/70 border border-purple-200/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white">
                  <InstagramIcon className="w-2.5 h-2.5" />
                </div>
                <span>Instagram</span>
              </button>

              <button
                onClick={() => handleMenuChange('whatsapp')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors ${
                  activeMenu === 'whatsapp'
                    ? 'text-emerald-900 font-bold bg-emerald-50/70 border border-emerald-200/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                  <Smartphone className="w-2.5 h-2.5" />
                </div>
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white overflow-y-auto p-8 max-w-5xl">
          
          {/* ========================================================================= */}
          {/* VIEW 1: GENERAL SETTINGS (Exact ManyChat Screenshot 2) */}
          {/* ========================================================================= */}
          {activeMenu === 'general' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* ManyChat Table/Card Structure with horizontal dividers */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs divide-y divide-gray-200 bg-white">
                
                {/* Row 1: Acortador URL de la tarjeta */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="w-64 font-medium text-xs text-gray-900">
                    Acortador URL de la tarjeta
                  </div>
                  <div className="flex-1 max-w-sm">
                    <input 
                      type="text" 
                      value={shortenerUrl}
                      onChange={(e) => setShortenerUrl(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0084ff]"
                    />
                  </div>
                  <div className="w-72 text-[11px] text-gray-500 leading-relaxed">
                    Si desactivas el acortador de enlaces, no podremos proporcionar los datos de la Proporción de clics (CTR).
                  </div>
                </div>

                {/* Row 2: Zona horaria de la cuenta */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="w-64 font-medium text-xs text-gray-900">
                    Zona horaria de la cuenta
                  </div>
                  <div className="flex-1 max-w-sm">
                    <select 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0084ff]"
                    >
                      <option value="(UTC-07:00) - Mexican Pacific Standard Time">(UTC-07:00) - Mexican Pacific Standard Time</option>
                      <option value="(UTC-06:00) - Central Standard Time (Mexico)">(UTC-06:00) - Central Standard Time (Mexico)</option>
                      <option value="(UTC-05:00) - Eastern Standard Time">(UTC-05:00) - Eastern Standard Time</option>
                    </select>
                  </div>
                  <div className="w-72 text-[11px] text-gray-500 leading-relaxed">
                    Todos los datos de Manychat serán mostrados y exportados según esta zona horaria.<br />
                    <span className="text-[#0084ff] font-semibold cursor-pointer">Obtén más información</span>
                  </div>
                </div>

                {/* Row 3: Conectar a otra cuenta */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="w-64 font-medium text-xs text-gray-900">
                    Conectar a otra cuenta
                  </div>
                  <div className="flex-1 max-w-sm">
                    <button 
                      onClick={() => alert('Función de clonación activa en ManyChat Pro')}
                      className="bg-[#0084ff] hover:bg-[#0073e6] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-2xs"
                    >
                      Clonar Esta Cuenta
                    </button>
                  </div>
                  <div className="w-72 text-[11px] text-gray-500">
                    Copiar todo el contenido a otra cuenta
                  </div>
                </div>

                {/* Row 4: Usar como plantilla */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="w-64 font-medium text-xs text-gray-900">
                    Usar como plantilla
                  </div>
                  <div className="flex-1 max-w-sm">
                    <button 
                      onClick={() => alert('Plantilla generada exitosamente')}
                      className="bg-[#0084ff] hover:bg-[#0073e6] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-2xs"
                    >
                      Crear Plantilla De Cuenta
                    </button>
                  </div>
                  <div className="w-72 text-[11px] text-gray-500">
                    Crea un panorama de esta cuenta y compártelo mediante un enlace
                  </div>
                </div>

                {/* Row 5: Salir de la cuenta */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="w-64 font-medium text-xs text-gray-900">
                    Salir de la cuenta
                  </div>
                  <div className="flex-1 max-w-sm">
                    <button 
                      onClick={() => navigate('/login')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-6 py-2 rounded-lg text-xs font-bold transition-all"
                    >
                      Salir
                    </button>
                  </div>
                  <div className="w-72 text-[11px] text-gray-500 leading-relaxed">
                    <span className="text-[#0084ff] font-semibold cursor-pointer">Transfiere</span> tu propiedad con otro miembro del equipo si deseas abandonar esta cuenta
                  </div>
                </div>

                {/* Row 6: Eliminar cuenta */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="w-64 font-medium text-xs text-gray-900">
                    Eliminar cuenta
                  </div>
                  <div className="flex-1 max-w-sm">
                    <button 
                      onClick={() => alert('Acción protegida por seguridad.')}
                      className="border border-red-200 text-red-600 hover:bg-red-50 px-6 py-2 rounded-lg text-xs font-bold transition-all"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className="w-72 text-[11px] text-gray-500">
                    Continúa con la eliminación de la cuenta
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: MIEMBROS DEL EQUIPO (Exact ManyChat Screenshot 3) */}
          {/* ========================================================================= */}
          {activeMenu === 'team' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Subtabs: Miembros del equipo / Grupos */}
              <div className="flex border-b border-gray-200 gap-6 text-xs font-bold">
                <button className="pb-3 text-[#0084ff] border-b-2 border-[#0084ff]">
                  Miembros del equipo
                </button>
                <button className="pb-3 text-gray-500 hover:text-gray-800">
                  Grupos
                </button>
              </div>

              {/* Team Members Card */}
              <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-sm font-bold text-gray-900">
                    Miembros del equipo para Clipop
                  </h3>
                  <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    className="bg-[#0084ff] hover:bg-[#0073e6] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start"
                  >
                    <Plus className="w-3.5 h-3.5" /> Invitar A Nuevo Miembro
                  </button>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-900">Propietario</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    El propietario controla la gestión de roles de contacto. El propietario también puede desactivar y clonar el bot, compartir su contenido, crear e instalar plantillas, gestionar la facturación y los pagos. Solo hay un rol del propietario por cuenta.
                  </p>
                </div>

                {/* Team Members Table */}
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 font-bold">
                        <th className="pb-3">Nombre</th>
                        <th className="pb-3">Puesto en Inbox <HelpCircle className="w-3 h-3 inline text-gray-400" /></th>
                        <th className="pb-3">Facturación <HelpCircle className="w-3 h-3 inline text-gray-400" /></th>
                        <th className="pb-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {teamMembers.map(member => (
                        <tr key={member.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={member.avatar} 
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'; }}
                                alt={member.name}
                                className="w-9 h-9 rounded-full object-cover border border-gray-200"
                              />
                              <div>
                                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                  {member.name}
                                  {member.isOwner && (
                                    <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold">
                                      Soy yo
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-gray-500">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-gray-700">
                            {member.inboxRole ? <Check className="w-4 h-4 text-gray-700" /> : '—'}
                          </td>
                          <td className="py-4 text-gray-700">
                            {member.billingRole ? <Check className="w-4 h-4 text-gray-700" /> : '—'}
                          </td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => alert(`Editando permisos de ${member.name}`)}
                              className="text-[#0084ff] hover:underline font-bold text-xs"
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: MY AUTOMATIONS / FLOWS (Exact ManyChat Screenshot 4) */}
          {/* ========================================================================= */}
          {activeMenu === 'automations' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Header + New Automation Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-black text-gray-900">My Automations</h2>
                <button 
                  onClick={() => {
                    setEditingRule(null);
                    setRuleForm({ keyword: '', match_type: 'contains', response: '', is_active: true });
                    setIsRuleModalOpen(true);
                  }}
                  className="bg-[#0084ff] hover:bg-[#0073e6] text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Nueva Automatización
                </button>
              </div>

              {/* Filters Bar ManyChat Style */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={automationSearch}
                    onChange={(e) => setAutomationSearch(e.target.value)}
                    placeholder="Buscar todas las Automatizaciones"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0084ff]"
                  />
                </div>

                <select className="border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0084ff]">
                  <option>Cualquier disparador</option>
                  <option>Palabra clave</option>
                  <option>Mención en Historia</option>
                  <option>Mensaje por defecto</option>
                </select>

                <select className="border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0084ff]">
                  <option>Cualquier estado del disparador</option>
                  <option>Activo (LIVE)</option>
                  <option>Pausado (STOPPED)</option>
                </select>

                <button className="border border-dashed border-[#0084ff] text-[#0084ff] hover:bg-blue-50 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Nueva carpeta
                </button>
              </div>

              {/* Automation Cards List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase px-4">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded text-[#0084ff]" />
                    <span>Nombre</span>
                  </div>
                  <div className="flex items-center gap-12 text-right">
                    <span>Ejecuciones</span>
                    <span>CTR</span>
                    <span>Modificado</span>
                  </div>
                </div>

                {automations.map(auto => (
                  <div 
                    key={auto.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs hover:border-[#0084ff]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded text-[#0084ff]" />
                      
                      {/* Status Badge */}
                      <button
                        onClick={() => handleToggleAutomationStatus(auto.id)}
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded cursor-pointer transition-transform active:scale-95 ${
                          auto.status === 'LIVE'
                            ? 'bg-rose-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {auto.status}
                      </button>

                      <div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#0084ff] transition-colors">
                          {auto.name}
                        </h4>
                        <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          {auto.trigger}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-12 text-xs font-medium text-gray-700 pl-8 sm:pl-0">
                      <span className="w-12 text-right font-bold">{auto.executions}</span>
                      <span className="w-12 text-right font-bold">{auto.ctr}</span>
                      <span className="w-24 text-right text-gray-400">{auto.modified}</span>
                      <button
                        onClick={() => {
                          setEditingRule({ id: auto.id, keyword: auto.name, match_type: 'contains', response: auto.trigger, is_active: auto.status === 'LIVE' });
                          setRuleForm({ keyword: auto.name, match_type: 'contains', response: auto.trigger, is_active: auto.status === 'LIVE' });
                          setIsRuleModalOpen(true);
                        }}
                        className="text-gray-400 hover:text-[#0084ff] p-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: KEYWORDS & RULES */}
          {/* ========================================================================= */}
          {activeMenu === 'keywords' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Palabras Clave (Keywords)</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Respuestas automáticas instantáneas disparadas por palabras específicas del cliente.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingRule(null);
                    setRuleForm({ keyword: '', match_type: 'contains', response: '', is_active: true });
                    setIsRuleModalOpen(true);
                  }}
                  className="bg-[#0084ff] hover:bg-[#0073e6] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Nueva Palabra Clave
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-bold bg-gray-50/50">
                      <th className="py-3 px-4">Trigger / Keyword</th>
                      <th className="py-3 px-4">Coincidencia</th>
                      <th className="py-3 px-4">Respuesta del Bot</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rules.map(rule => (
                      <tr key={rule.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold">
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200 font-mono text-[11px]">
                            {rule.keyword}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {rule.match_type === 'exact' ? 'Exacta' : 'Contiene'}
                        </td>
                        <td className="py-3.5 px-4 text-gray-700 max-w-sm truncate">
                          {rule.response}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            rule.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {rule.is_active ? 'ACTIVA' : 'INACTIVA'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingRule(rule);
                              setRuleForm({ keyword: rule.keyword, match_type: rule.match_type, response: rule.response, is_active: rule.is_active });
                              setIsRuleModalOpen(true);
                            }}
                            className="p-1.5 text-gray-500 hover:text-[#0084ff] rounded hover:bg-gray-100"
                            title="Editar regla"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 rounded hover:bg-gray-100"
                            title="Eliminar regla"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 5: INSTAGRAM CHANNEL */}
          {/* ========================================================================= */}
          {activeMenu === 'instagram' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Connected Account Card */}
              <div className="border border-gray-200 rounded-xl p-5 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src="/ing_francisco_avatar.png" 
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'; }}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover border-2 border-pink-500"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white">
                      <InstagramIcon className="w-2.5 h-2.5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Ing. Francisco Gardea</h3>
                    <p className="text-xs text-purple-700 font-semibold">@ing.pako.pansho</p>
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Conectado a CLIPOP
                    </span>
                  </div>
                </div>

                <a
                  href="https://www.instagram.com/ing.pako.pansho"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  Ver Perfil <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Conversation Starters */}
              <div className="border border-gray-200 rounded-xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Iniciadores de Conversación (Ice Breakers)</h3>
                    <p className="text-xs text-gray-500">Botones que aparecen en Instagram Direct al iniciar el chat.</p>
                  </div>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {conversationStarters.length} / 4 activos
                  </span>
                </div>

                <div className="space-y-2">
                  {conversationStarters.map((starter, index) => (
                    <div key={starter.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white text-gray-700 font-bold text-[11px] flex items-center justify-center border border-gray-300">
                          {index + 1}
                        </span>
                        <span>{starter.text}</span>
                      </div>
                      <button onClick={() => handleDeleteStarter(starter.id)} className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {conversationStarters.length < 4 && (
                  <form onSubmit={handleAddStarter} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newStarterText}
                      onChange={(e) => setNewStarterText(e.target.value)}
                      placeholder="Ej: 🎁 Ver curso gratis de OPUS"
                      className="flex-1 border border-gray-300 rounded-lg px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0084ff]"
                    />
                    <button
                      type="submit"
                      disabled={!newStarterText.trim()}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-40"
                    >
                      Agregar
                    </button>
                  </form>
                )}
              </div>

              {/* Story Mentions */}
              <div className="border border-gray-200 rounded-xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Respuesta a Menciones en Historias</h3>
                    <p className="text-xs text-gray-500">Envía un mensaje automatizado cuando te etiquetan en una Story.</p>
                  </div>
                  <button
                    onClick={() => setIgStoryMentionEnabled(!igStoryMentionEnabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      igStoryMentionEnabled ? 'bg-[#0084ff]' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${igStoryMentionEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {igStoryMentionEnabled && (
                  <textarea
                    rows="3"
                    value={igStoryMentionText}
                    onChange={(e) => setIgStoryMentionText(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0084ff]"
                  />
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 6: WHATSAPP CHANNEL */}
          {/* ========================================================================= */}
          {activeMenu === 'whatsapp' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border border-gray-200 rounded-xl p-6 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">WhatsApp Oficial de CLIPOP</h3>
                      <p className="text-xs text-gray-500">Conecta tu número para atender mensajes con el flujo ManyChat.</p>
                    </div>
                  </div>

                  {waStatus.status === 'CONNECTED' && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                      +{waStatus.connectedNumber || '526624745958'} CONECTADO
                    </span>
                  )}
                </div>

                {waStatus.status === 'CONNECTED' ? (
                  <div className="text-center py-6 space-y-4 max-w-md mx-auto">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="text-sm font-bold text-gray-900">WhatsApp Activo y Respondiendo</h4>
                    <button
                      onClick={handleLogoutWhatsApp}
                      disabled={loadingWa}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold"
                    >
                      Desvincular WhatsApp
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
                      <h4 className="text-xs font-bold text-emerald-900">1. Vincular con Código de 8 Dígitos</h4>
                      <form onSubmit={handleRequestPairingCode} className="space-y-3">
                        <input
                          type="text"
                          value={pairingPhone}
                          onChange={(e) => setPairingPhone(e.target.value)}
                          placeholder="Ej: 526624745958"
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs bg-white"
                        />
                        <button
                          type="submit"
                          disabled={loadingPairing}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                        >
                          {loadingPairing ? 'Generando...' : 'Obtener Código'}
                        </button>
                      </form>

                      {generatedPairingCode && (
                        <div className="p-3 bg-white border border-emerald-500 rounded-lg text-center font-mono font-black text-lg text-emerald-700">
                          {generatedPairingCode}
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center space-y-3">
                      <h4 className="text-xs font-bold text-gray-900 text-left">2. Escanear Código QR</h4>
                      {waStatus.qr ? (
                        <img src={waStatus.qr} alt="QR" className="w-36 h-36 mx-auto rounded border" />
                      ) : (
                        <button
                          onClick={handleStartWhatsApp}
                          disabled={loadingWa}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold mt-6"
                        >
                          Mostrar Código QR
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 7: AI AGENT (GEMINI) */}
          {/* ========================================================================= */}
          {activeMenu === 'ai' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border border-gray-200 rounded-xl p-6 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#0084ff]" /> AI Agent System Prompt & Personalidad
                </h3>
                <textarea
                  rows="8"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3.5 text-xs text-gray-800 font-mono leading-relaxed bg-slate-50"
                  placeholder="Instrucciones para la IA..."
                />
              </div>

              <div className="border border-gray-200 rounded-xl p-6 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-600" /> Simulador de Conversación (Sandbox)
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTestBot()}
                    placeholder="Ej: ¿Qué cursos tienen sobre OPUS y CFE?"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs"
                  />
                  <button
                    onClick={handleTestBot}
                    disabled={testingAi}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                  >
                    Probar
                  </button>
                </div>
                {testOutput && (
                  <div className="p-4 rounded-lg bg-slate-900 text-slate-200 text-xs whitespace-pre-wrap leading-relaxed">
                    {testOutput}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 8: INBOX SETTINGS */}
          {/* ========================================================================= */}
          {activeMenu === 'inbox_settings' && (
            <div className="border border-gray-200 rounded-xl p-6 shadow-2xs space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-gray-900">Comportamiento de Inbox & Live Chat</h3>
              <p className="text-xs text-gray-500">
                Pausa automática de automatizaciones cuando un asesor humano interviene en el chat.
              </p>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-xs font-bold text-gray-800">Pausar bot al responder humano</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Activo</span>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL: INVITAR MIEMBRO */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Invitar A Nuevo Miembro</h3>
            <form onSubmit={handleInviteMember} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Ej: Ing. Carlos Pérez"
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="carlos@obra.mx"
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0084ff] text-white rounded-lg text-xs font-bold"
                >
                  Enviar Invitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PALABRAS CLAVE */}
      {isRuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 space-y-4">
            <h3 className="text-sm font-bold text-gray-900">
              {editingRule ? 'Editar Palabra Clave' : 'Nueva Palabra Clave Automática'}
            </h3>
            <form onSubmit={handleSaveRule} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Palabra Clave (Trigger)</label>
                <input 
                  type="text"
                  required
                  value={ruleForm.keyword}
                  onChange={(e) => setRuleForm({ ...ruleForm, keyword: e.target.value })}
                  placeholder="Ej: PRECIO, OPUS, CFE"
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tipo de Coincidencia</label>
                <select
                  value={ruleForm.match_type}
                  onChange={(e) => setRuleForm({ ...ruleForm, match_type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs bg-white"
                >
                  <option value="contains">Contiene la palabra</option>
                  <option value="exact">Coincidencia exacta</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Respuesta Automática</label>
                <textarea 
                  rows="4"
                  required
                  value={ruleForm.response}
                  onChange={(e) => setRuleForm({ ...ruleForm, response: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                  placeholder="Escribe el mensaje..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsRuleModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0084ff] text-white rounded-lg text-xs font-bold"
                >
                  Guardar Regla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}


