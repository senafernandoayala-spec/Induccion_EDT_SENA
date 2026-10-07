import React, { useState } from 'react';
import { GLOSSARY } from '../data/senaData';

interface GlosarioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlosarioModal: React.FC<GlosarioModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filteredGlossary = GLOSSARY.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.acronym && item.acronym.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Glosario Terminológico SENA</h3>
            <p className="text-xs text-slate-500">
              Diccionario de conceptos, siglas y normativas esenciales para el aprendiz
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-200 bg-white space-y-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar concepto o sigla (ej. RAP, Ficha, FPI, Zajuna)..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-emerald-600"
          />

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'Pedagógico', 'Institucional', 'Normativo', 'Tecnológico'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'Todos los términos' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Terms List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {filteredGlossary.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No se encontraron términos que coincidan con la búsqueda.
            </div>
          ) : (
            filteredGlossary.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{item.term}</h4>
                    {item.acronym && (
                      <span className="text-xs font-semibold text-emerald-700 font-mono">
                        ({item.acronym})
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.definition}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
