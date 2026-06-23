import { ArrowLeft, Search, Download, Columns, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Catalog() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const products = [
    { id: '483B20BB76F1F136B88D', name: 'Precios Unitarios OPUS 22, OPUS 24, Neodata y Excel', status: 'ACTIVO', category: 'CURSO', type: 'DIGITAL', author: 'TORUA CAMPA ERICK FRANCISCO', created: '18/6/2026', url: 'https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/', description: 'Curso completo enfocado en estructurar presupuestos y análisis de precios unitarios (APU) desde cero, dominando OPUS (versiones 22 y 24), Neodata y Excel.' },
    { id: 'CE4F47D87E543CA1CB75', name: 'Cómo Presentar Concursos para CFE desde cero con OPUS 2020', status: 'ACTIVO', category: 'CURSO', type: 'DIGITAL', author: 'TORUA CAMPA ERICK FRANCISCO', created: '18/6/2026', url: 'https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/', description: 'Guía práctica y metodológica para armar y presentar propuestas de licitaciones técnico-económicas para la Comisión Federal de Electricidad (CFE) en México usando OPUS 2020.' },
    { id: '37ABE3618B5C83C37D65', name: 'OPUS 2020 - Análisis de Precios Unitarios', status: 'ACTIVO', category: 'CURSO', type: 'DIGITAL', author: 'TORUA CAMPA ERICK FRANCISCO', created: '18/6/2026', url: 'https://www.udemy.com/course/opus-2020-analisis-de-precios-unitarios/', description: 'Curso de especialización dedicado al dominio del análisis de costos directos, indirectos, cálculo de factor de salario integrado (FSR) y presupuestación en la versión 2020 de OPUS.' },
  ];

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
              <select className="w-full border border-gray-300 rounded p-2 text-sm text-gray-700 focus:outline-none focus:border-[#198754]">
                <option>TODOS</option>
                <option>ACTIVO</option>
                <option>PAUSADO</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">Categoría</label>
              <select className="w-full border border-gray-300 rounded p-2 text-sm text-gray-700 focus:outline-none focus:border-[#198754]">
                <option>TODAS</option>
                <option>CURSO</option>
                <option>LIBRO</option>
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
                <th className="py-4 px-6 font-semibold cursor-pointer">Código <span></span></th>
                <th className="py-4 px-6 font-semibold cursor-pointer">Nombre <span></span></th>
                <th className="py-4 px-6 font-semibold cursor-pointer">Estado IA <span></span></th>
                <th className="py-4 px-6 font-semibold cursor-pointer">Categoría <span></span></th>
                <th className="py-4 px-6 font-semibold cursor-pointer">Tipo Servicio <span></span></th>
                <th className="py-4 px-6 font-semibold cursor-pointer">Autor Asignado <span></span></th>
                <th className="py-4 px-6 font-semibold cursor-pointer">Creado <span></span></th>
                <th className="py-4 px-6 font-semibold cursor-pointer">Acciones <span></span></th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {products.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                    <div className="font-semibold text-gray-800">{item.id}</div>
                  </td>
                  <td className="py-4 px-6 text-xs font-semibold text-gray-800">{item.name}</td>
                  <td className="py-4 px-6 text-xs">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.status === 'ACTIVO'} />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#198754]"></div>
                      <span className={`ml-2 text-[10px] font-bold ${item.status === 'ACTIVO' ? 'text-[#198754]' : 'text-gray-400'}`}>
                        {item.status === 'ACTIVO' ? 'ACTIVO' : 'PAUSADO'}
                      </span>
                    </label>
                  </td>
                  <td className="py-4 px-6 text-xs">{item.category}</td>
                  <td className="py-4 px-6 text-xs">{item.type}</td>
                  <td className="py-4 px-6 text-xs">{item.author}</td>
                  <td className="py-4 px-6 text-xs">{item.created}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-gray-700" title="Ver Detalles">👁️</button>
                      <button className="text-gray-400 hover:text-[#198754]" title="Editar Prompt del Producto">⚙️</button>
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
              <h3 className="text-xl font-bold text-gray-800">Agregar Nuevo Curso</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Curso</label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#198754]" placeholder="Ej. Curso de React Avanzado" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Precio (USD)</label>
                    <input type="number" className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#198754]" placeholder="99.99" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                    <select className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#198754]">
                      <option>CURSO</option>
                      <option>E-BOOK</option>
                      <option>CONSULTORÍA</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción Corta</label>
                    <textarea rows="2" className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#198754]" placeholder="Breve resumen del curso..."></textarea>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Competencias Adquiridas <span className="text-xs text-gray-500 font-normal">(Separadas por comas)</span>
                    </label>
                    <textarea rows="2" className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#198754]" placeholder="Ej. Arquitectura de Software, Bases de Datos, Liderazgo de Equipos"></textarea>
                    <p className="text-xs text-gray-500 mt-1">Estas competencias se mostrarán con una viñeta verde en la tienda pública.</p>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">URL de la Imagen de Portada</label>
                    <input type="url" className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#198754]" placeholder="https://..." />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded font-medium text-gray-700 hover:bg-gray-200 transition-colors text-sm">
                Cancelar
              </button>
              <button className="px-5 py-2.5 rounded font-medium text-white bg-[#198754] hover:bg-[#157347] transition-colors text-sm shadow-sm">
                Guardar Curso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
