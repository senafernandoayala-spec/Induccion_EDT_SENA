import React, { useState, useEffect } from 'react';
import { INSTITUTIONAL_INFO } from '../data/senaData';
import { hymnPlayer } from '../utils/audioHymn';
import { SenaLogo } from './SenaLogo';
import symbolsConceptImg from '../assets/images/sena_symbols_concept_1791379363564.jpg';

interface StationIdentidadProps {
  onComplete: () => void;
  isCompleted: boolean;
}

export const StationIdentidad: React.FC<StationIdentidadProps> = ({ onComplete, isCompleted }) => {
  const [selectedElementId, setSelectedElementId] = useState<string>('rueda');
  const [isPlayingHymn, setIsPlayingHymn] = useState<boolean>(false);
  const [activeStanzaIndex, setActiveStanzaIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'simbolos' | 'mision' | 'valores' | 'himno'>('simbolos');

  const selectedElement = INSTITUTIONAL_INFO.symbols.shield.elements.find(
    (el) => el.id === selectedElementId
  ) || INSTITUTIONAL_INFO.symbols.shield.elements[0];

  useEffect(() => {
    // Auto-mark station as viewed when user explores tabs
    if (!isCompleted) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isCompleted, onComplete]);

  const handleToggleHymn = () => {
    if (isPlayingHymn) {
      hymnPlayer.stop();
      setIsPlayingHymn(false);
    } else {
      setIsPlayingHymn(true);
      hymnPlayer.play(
        (stanzaIdx) => {
          setActiveStanzaIndex(stanzaIdx);
        },
        () => {
          setIsPlayingHymn(false);
        }
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Station Title & Progress Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Estación 01</span>
            <span aria-hidden="true">·</span>
            <span>Cultura & Patrimonio Institucional</span>
            <span aria-hidden="true">·</span>
            <span>Fundado en 1957</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Identidad, Filosofía y Símbolos del SENA
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Comprende las raíces históricas creadas por Rodolfo Martínez Tono, la misión transformadora del Estado colombiano y el significado profundo de los emblemas que portarás con orgullo.
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

      {/* Segmented navigation tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg max-w-xl">
        <button
          onClick={() => setActiveTab('simbolos')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'simbolos'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Símbolos & Escudo
        </button>
        <button
          onClick={() => setActiveTab('mision')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'mision'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Misión & Visión
        </button>
        <button
          onClick={() => setActiveTab('valores')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'valores'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Valores Éticos
        </button>
        <button
          onClick={() => setActiveTab('himno')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'himno'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Himno Oficial
        </button>
      </div>

      {/* TAB 1: Símbolos Institucionales */}
      {activeTab === 'simbolos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Shield Visualizer */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Explorador Interactivo del Escudo SENA
                </h3>
                <p className="text-xs text-slate-500">
                  Haz clic en cada componente para descubrir el sector productivo que representa
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Tres Sectores Económicos
              </span>
            </div>

            {/* Shield interactive diagram simulation */}
            <div className="relative bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col items-center">
              <div className="w-56 h-56 relative flex items-center justify-center my-4">
                {/* Visual stylization of the SENA shield with interactive hot zones */}
                <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-md">
                  {/* Outer Shield contour */}
                  <path
                    d="M 20 20 L 180 20 L 180 120 C 180 180 100 210 100 210 C 100 210 20 180 20 120 Z"
                    fill="#059669"
                    stroke="#047857"
                    strokeWidth="3"
                  />
                  <path
                    d="M 26 26 L 174 26 L 174 118 C 174 172 100 202 100 202 C 100 202 26 172 26 118 Z"
                    fill="#ffffff"
                  />

                  {/* Top Gear / Rueda Dentada sector */}
                  <g
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setSelectedElementId('rueda')}
                  >
                    <circle
                      cx="100"
                      cy="60"
                      r="26"
                      fill={selectedElementId === 'rueda' ? '#d97706' : '#f59e0b'}
                      opacity="0.9"
                    />
                    <circle cx="100" cy="60" r="14" fill="#ffffff" />
                    {/* Cog teeth */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <rect
                        key={angle}
                        x="97"
                        y="30"
                        width="6"
                        height="6"
                        fill={selectedElementId === 'rueda' ? '#b45309' : '#d97706'}
                        transform={`rotate(${angle} 100 60)`}
                      />
                    ))}
                    <text x="100" y="64" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#78350f">
                      ⚙️
                    </text>
                  </g>

                  {/* Left: Rama de Café y Espiga (Agropecuario) */}
                  <g
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setSelectedElementId('cafe')}
                  >
                    <path
                      d="M 45 155 Q 65 110 90 95"
                      stroke={selectedElementId === 'cafe' ? '#047857' : '#10b981'}
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <circle cx="56" cy="138" r="5" fill="#dc2626" />
                    <circle cx="68" cy="120" r="5" fill="#dc2626" />
                    <circle cx="80" cy="106" r="5" fill="#dc2626" />
                    <ellipse cx="60" cy="130" rx="7" ry="4" fill="#059669" transform="rotate(-30 60 130)" />
                    <ellipse cx="74" cy="114" rx="7" ry="4" fill="#059669" transform="rotate(-30 74 114)" />
                  </g>

                  {/* Right: Caduceo (Comercio y Servicios) */}
                  <g
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setSelectedElementId('caduceo')}
                  >
                    <line
                      x1="110"
                      y1="95"
                      x2="155"
                      y2="155"
                      stroke={selectedElementId === 'caduceo' ? '#1d4ed8' : '#3b82f6'}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <ellipse
                      cx="145"
                      cy="120"
                      rx="12"
                      ry="7"
                      fill="none"
                      stroke={selectedElementId === 'caduceo' ? '#1d4ed8' : '#60a5fa'}
                      strokeWidth="3"
                    />
                    <circle cx="110" cy="95" r="4" fill="#2563eb" />
                    <path d="M 104 90 Q 110 82 116 90 Z" fill="#2563eb" />
                  </g>

                  {/* Institutional Header Banner */}
                  <path d="M 35 22 L 165 22 L 155 38 L 45 38 Z" fill="#047857" />
                  <text x="100" y="34" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff" letterSpacing="2">
                    SENA
                  </text>
                </svg>
              </div>

              {/* Segmented selector buttons */}
              <div className="grid grid-cols-3 gap-2 w-full mt-2">
                {INSTITUTIONAL_INFO.symbols.shield.elements.map((el) => {
                  const isCurrent = el.id === selectedElementId;
                  return (
                    <button
                      key={el.id}
                      onClick={() => setSelectedElementId(el.id)}
                      className={`py-2 px-2 text-xs rounded-lg border text-center transition-all cursor-pointer ${
                        isCurrent
                          ? `${el.color} font-semibold shadow-xs`
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {el.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Element Deep Dive */}
            <div className={`p-4 rounded-xl border ${selectedElement.color}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase font-bold tracking-wider opacity-80">
                  {selectedElement.sector}
                </span>
                <span className="text-xs font-mono font-semibold">Elemento Oficial</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                {selectedElement.name}
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedElement.description}
              </p>
            </div>
          </div>

          {/* Flag and Logosymbol cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Logosímbolo Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
                  <SenaLogo size={42} color="#39A900" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {INSTITUTIONAL_INFO.symbols.logo.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    El Aprendiz como protagonista de su proyecto de vida
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                {INSTITUTIONAL_INFO.symbols.logo.description}
              </p>
            </div>

            {/* Flag Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-8 border border-slate-300 rounded shadow-xs bg-white flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {INSTITUTIONAL_INFO.symbols.flag.title}
                  </h3>
                  <p className="text-xs text-slate-500">Paz, ética y esperanza nacional</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {INSTITUTIONAL_INFO.symbols.flag.description}
              </p>
            </div>

            {/* Image asset container with zero-broken-image fallback */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3">
              <img
                src={symbolsConceptImg}
                alt="Emblemas y símbolos de la innovación del SENA"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <p className="text-xs text-white font-medium">
                  Patrimonio Institucional: 68 años forjando la fuerza laboral de Colombia.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Misión y Visión */}
      {activeTab === 'mision' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs border-l-4 border-l-emerald-600">
              <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">
                Razón de Ser
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">
                Misión Institucional
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {INSTITUTIONAL_INFO.mission}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <span>Decreto Ley 118 de 1957</span>
                <span aria-hidden="true">·</span>
                <span>Formación Profesional Gratuita</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs border-l-4 border-l-blue-600">
              <span className="text-xs font-semibold text-blue-700 tracking-wider uppercase">
                Horizonte 2026
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">
                Visión Prospectiva
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {INSTITUTIONAL_INFO.vision}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <span>Transformación Digital</span>
                <span aria-hidden="true">·</span>
                <span>Pertinencia Territorial</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Principios Fundamentales de la Comunidad Educativa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {INSTITUTIONAL_INFO.principles.map((pr, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs font-mono text-emerald-700 font-semibold mb-1">
                    0{idx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{pr.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{pr.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Valores Éticos */}
      {activeTab === 'valores' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="max-w-2xl mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              Código de Integridad y Valores del Aprendiz SENA
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              La formación no se limita a las destrezas técnicas. Tu comportamiento ético es el sello distintivo que te abrirá las puertas en la sociedad y en las empresas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INSTITUTIONAL_INFO.values.map((v, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-bold text-emerald-800">{v.name}</h4>
                  <span className="text-xs font-mono text-slate-400">#0{idx + 1}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{v.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Himno Oficial con Reproductor Interactivo */}
      {activeTab === 'himno' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {INSTITUTIONAL_INFO.symbols.hymn.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>Letra: {INSTITUTIONAL_INFO.symbols.hymn.authorLyrics}</span>
                <span aria-hidden="true">·</span>
                <span>Música: {INSTITUTIONAL_INFO.symbols.hymn.authorMusic}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleHymn}
                className={`px-4 py-2 rounded-lg font-semibold text-xs transition-colors cursor-pointer flex items-center gap-2 ${
                  isPlayingHymn
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                }`}
              >
                <span>{isPlayingHymn ? '⏸ Pausar Himno' : '▶ Escuchar Melodía Oficial'}</span>
              </button>
            </div>
          </div>

          {isPlayingHymn && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs text-emerald-800 font-medium">
                Reproduciendo melodía sintetizada en vivo. Sigue la letra resaltada:
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INSTITUTIONAL_INFO.symbols.hymn.stanzas.map((stanza, idx) => {
              const isCurrentStanza = isPlayingHymn && activeStanzaIndex === idx;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrentStanza
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      {stanza.type}
                    </span>
                    {isCurrentStanza && (
                      <span className="text-[11px] font-semibold text-emerald-700 font-mono">
                        ♪ Entonando
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {stanza.lines.map((line, lIdx) => (
                      <p
                        key={lIdx}
                        className={`text-sm italic leading-relaxed ${
                          isCurrentStanza ? 'text-emerald-950 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
