import React, { useState, useEffect } from 'react';
import { WELLNESS_DIMENSIONS, ECOSYSTEM_SERVICES } from '../data/senaData';

interface StationBienestarProps {
  onComplete: () => void;
  isCompleted: boolean;
}

export const StationBienestar: React.FC<StationBienestarProps> = ({ onComplete, isCompleted }) => {
  const [selectedDimensionIdx, setSelectedDimensionIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'dimensiones' | 'ecosistema' | 'apoyos'>('dimensiones');

  useEffect(() => {
    if (!isCompleted) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isCompleted, onComplete]);

  const selectedDimension = WELLNESS_DIMENSIONS[selectedDimensionIdx];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Estación 04</span>
            <span aria-hidden="true">·</span>
            <span>Desarrollo Humano & Oportunidades</span>
            <span aria-hidden="true">·</span>
            <span>Bienestar al Aprendiz</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Bienestar al Aprendiz y Ecosistema de Innovación
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            El SENA no solo te capacita: te cuida. Descubre las dimensiones de bienestar físico, cultural y socioeconómico, y aprovecha el Fondo Emprender, SENNOVA y la Agencia Pública de Empleo.
          </p>
        </div>

        <button
          onClick={onComplete}
          className={`self-start sm:self-auto px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
            isCompleted
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white'
          }`}
        >
          {isCompleted ? '✓ Estación Completada' : 'Marcar Estación como Vista'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg max-w-xl">
        <button
          onClick={() => setActiveTab('dimensiones')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'dimensiones'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Dimensiones de Bienestar
        </button>
        <button
          onClick={() => setActiveTab('ecosistema')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'ecosistema'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Ecosistema SENA (APE, Emprender)
        </button>
        <button
          onClick={() => setActiveTab('apoyos')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'apoyos'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Liderazgo & Apoyos
        </button>
      </div>

      {/* TAB 1: Dimensiones de Bienestar */}
      {activeTab === 'dimensiones' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Dimension buttons */}
          <div className="lg:col-span-5 space-y-2">
            <div className="text-xs font-semibold text-slate-500 mb-1">
              Las dimensiones del Plan Nacional Integral de Bienestar:
            </div>
            {WELLNESS_DIMENSIONS.map((dim, idx) => {
              const isSelected = idx === selectedDimensionIdx;
              return (
                <button
                  key={dim.title}
                  onClick={() => setSelectedDimensionIdx(idx)}
                  className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{dim.title}</span>
                  </div>
                  <span className="text-xs text-slate-400">→</span>
                </button>
              );
            })}
          </div>

          {/* Dimension Details */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold mb-1">
                <span>Dimensión #{selectedDimensionIdx + 1}</span>
                <span aria-hidden="true">·</span>
                <span>Resolución Oficial de Bienestar</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{selectedDimension.title}</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{selectedDimension.desc}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                ¿Cómo acceder a estos beneficios en tu centro?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dirígete a la oficina de Bienestar al Aprendiz de tu sede o contacta a los profesionales encargados de tu ficha. Todos los servicios de salud preventiva, deporte, arte y acompañamiento psicopedagógico son 100% gratuitos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-0.5">Enfermería & Salud:</span>
                Atención básica de urgencias, primeros auxilios y orientación en hábitos de autocuidado.
              </div>
              <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-0.5">Torneos & Juegos:</span>
                Participa en campeonatos de fútbol, baloncesto, voleibol, tenis de mesa y ajedrez.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Ecosistema SENA */}
      {activeTab === 'ecosistema' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ECOSYSTEM_SERVICES.map((serv, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {serv.tagline}
                  </span>
                  <span className="text-xs font-mono text-slate-400">#0{idx + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{serv.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{serv.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Acceso Gratuito Nacional</span>
                <span className="font-semibold text-emerald-700">Servicio Disponible</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Liderazgo & Apoyos */}
      {activeTab === 'apoyos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                Representación
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Vocero de Ficha</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Elegido democráticamente por sus compañeros de grupo durante el primer mes de formación para canalizar iniciativas, concertar con instructores y liderar la convivencia.
              </p>
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
                Participa con voz en reuniones de equipo ejecutor y comités pedagógicos.
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                Liderazgo de Centro
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Representante de Aprendices</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Elegido mediante votación electrónica general en todo el centro. Representa la voz de miles de aprendices ante el Subdirector de Centro y el Consejo Directivo.
              </p>
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
                Voz oficial en el Comité de Centro y formulación del Plan Anual de Bienestar.
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                Incentivo Socioeconómico
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Apoyos de Sostenimiento</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Estímulos económicos para aprendices en condición de vulnerabilidad socioeconómica (estratos 1 y 2, víctimas, población rural) para mitigar gastos de transporte y alimentación.
              </p>
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
                Convocatorias semestrales reguladas por la Dirección General del SENA.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
