import { ArrowLeft, Search, Download, Columns, Plus, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Catalog() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [filterCategory, setFilterCategory] = useState('TODAS');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'CURSO',
    description: '',
    url: '',
    imagen: ''
  });

  // Cargar productos del backend API
  const loadProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(err => console.error('Error cargando catálogo:', err));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Cambiar estado ACTIVO/PAUSADO
  const handleToggleStatus = (item) => {
    const newStatus = item.status === 'ACTIVO' ? 'PAUSADO' : 'ACTIVO';
    fetch(`/api/products/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, is_active: newStatus === 'ACTIVO' })
    })
      .then(res => res.json())
      .then(() => {
        setProducts(prev => prev.map(p => p.id === item.id ? { ...p, status: newStatus, is_active: newStatus === 'ACTIVO' } : p));
      })
      .catch(err => console.error('Error cambiando estado:', err));
  };

  // Crear nuevo producto
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        titulo: formData.name,
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        description: formData.description,
        descripcion: formData.description,
        url: formData.url,
        enlace: formData.url,
        imagen: formData.imagen || '/concurso_subestacion.png',
        status: 'ACTIVO'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsModalOpen(false);
          setFormData({ name: '', price: '', category: 'CURSO', description: '', url: '', imagen: '' });
          loadProducts();
        }
      })
      .catch(err => console.error('Error creando producto:', err));
  };

  // Eliminar producto
  const handleDeleteProduct = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este curso del catálogo?')) return;
    fetch(`/api/products/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        setProducts(prev => prev.filter(p => p.id !== id));
      })
      .catch(err => console.error('Error eliminando producto:', err));
  };

  // Filtrar productos
  const filteredProducts = products.filter(item => {
    const matchesSearch = (item.name || item.titulo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'TODOS' || item.status === filterStatus;
    const matchesCat = filterCategory === 'TODAS' || item.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCat;
  });

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors bg-white">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Gestión de Catálogo</h1>
          <p className="text-sm text-gray-600 mt-1">Seguimiento a los productos y servicios de ventas.</p>
        </div>
      </div>

      {/* Filters Area */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div className="grid grid-cols-3 gap-4 flex-1">
            <div>
              <label className="block text-xs text-gray-700 mb-1">Estado</label>
              <select 
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm text-gray-700 focus:outline-none focus:border-[#198754]"
              >
                <option value="TODOS">TODOS</option>
                <option value="ACTIVO">ACTIVO</option>
                <option value="PAUSADO">PAUSADO</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">Categoría</label>
              <select 
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm text-gray-700 focus:outline-none focus:border-[#198754]"
              >
                <option value="TODAS">TODAS</option>
                <option value="CURSO">CURSO</option>
                <option value="LIBRO">LIBRO</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">Tipo de Servicio</label>
              <select className="w-full border border-gray-300 rounded p-2 text-sm text-gray-700 focus:outline-none focus:border-[#198754]">
                <option>TODOS</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="flex items-center gap-2 border border-[#198754] text-[#198754] px-4 py-2 rounded text-sm font-medium hover:bg-[#198754] hover:text-white transition-colors">
              <Download className="w-4 h-4" /> Excel
            </button>
            <button className="flex items-center gap-2 border border-gray-400 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
              <Columns className="w-4 h-4" /> Columnas
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar productos..." 
              className="w-full border border-gray-300 rounded py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#198754]"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#198754] hover:bg-[#157347] text-white px-5 py-2 rounded text-sm font-medium transition-colors shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Agregar
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b-2 border-black text-gray-900">
                <th className="py-4 px-6 font-semibold">Código</th>
                <th className="py-4 px-6 font-semibold">Nombre</th>
                <th className="py-4 px-6 font-semibold">Estado IA</th>
                <th className="py-4 px-6 font-semibold">Categoría</th>
                <th className="py-4 px-6 font-semibold">Tipo Servicio</th>
                <th className="py-4 px-6 font-semibold">Autor Asignado</th>
                <th className="py-4 px-6 font-semibold">Creado</th>
                <th className="py-4 px-6 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {filteredProducts.map((item, idx) => (
                <tr key={item.id || idx} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                    <div className="font-semibold text-gray-800">{item.id}</div>
                  </td>
                  <td className="py-4 px-6 text-xs font-semibold text-gray-800 max-w-xs truncate" title={item.name || item.titulo}>
                    {item.name || item.titulo}
                  </td>
                  <td className="py-4 px-6 text-xs">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={item.status === 'ACTIVO'} 
                        onChange={() => handleToggleStatus(item)}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#198754]"></div>
                      <span className={`ml-2 text-[10px] font-bold ${item.status === 'ACTIVO' ? 'text-[#198754]' : 'text-gray-400'}`}>
                        {item.status === 'ACTIVO' ? 'ACTIVO' : 'PAUSADO'}
                      </span>
                    </label>
                  </td>
                  <td className="py-4 px-6 text-xs">{item.category || 'CURSO'}</td>
                  <td className="py-4 px-6 text-xs">{item.type || 'DIGITAL'}</td>
                  <td className="py-4 px-6 text-xs">{item.author || 'FRANCISCO RAMÓN GARDEA HERNÁNDEZ'}</td>
                  <td className="py-4 px-6 text-xs">{item.created || '18/6/2026'}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600" title="Ver Enlace">
                          🔗
                        </a>
                      )}
                      <button 
                        onClick={() => handleDeleteProduct(item.id)} 
                        className="text-gray-400 hover:text-red-600 transition-colors" 
                        title="Eliminar del Catálogo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Agregar Curso */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Agregar Nuevo Curso al Catálogo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateProduct} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Curso</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#198754]" 
                      placeholder="Ej. Análisis de Precios Unitarios OPUS 2026" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Precio (USD)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#198754]" 
                      placeholder="0.00 (Opcional)" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#198754]"
                    >
                      <option value="CURSO">CURSO</option>
                      <option value="E-BOOK">E-BOOK</option>
                      <option value="CONSULTORÍA">CONSULTORÍA</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción del Curso</label>
                    <textarea 
                      rows="3" 
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#198754]" 
                      placeholder="Resumen del contenido y objetivos del curso..."
                    ></textarea>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Enlace de Acceso / Compra (Udemy u otro)</label>
                    <input 
                      type="url" 
                      value={formData.url}
                      onChange={e => setFormData({ ...formData, url: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#198754]" 
                      placeholder="https://www.udemy.com/course/..." 
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">URL de la Imagen de Portada</label>
                    <input 
                      type="text" 
                      value={formData.imagen}
                      onChange={e => setFormData({ ...formData, imagen: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#198754]" 
                      placeholder="/concurso_subestacion.png o https://..." 
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-lg shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)} 
                  className="px-5 py-2.5 rounded font-medium text-gray-700 hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded font-medium text-white bg-[#198754] hover:bg-[#157347] transition-colors text-sm shadow-sm"
                >
                  Guardar Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

