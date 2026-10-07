import React from 'react';
import { StationId } from '../types/induction';
import { SenaLogo } from './SenaLogo';

interface HeaderProps {
  activeStation: StationId;
  onSelectStation: (station: StationId) => void;
  onOpenGlossary: () => void;
  onOpenProfile: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenRanking?: () => void;
  isAdminLoggedIn?: boolean;
  progressPercent: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeStation,
  onSelectStation,
  onOpenGlossary,
  onOpenProfile,
  onOpenAdminDashboard,
  onOpenRanking,
  isAdminLoggedIn = false,
  progressPercent,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title with official SENA green logo */}
        <button
          onClick={() => onSelectStation('identidad')}
          className="flex items-center gap-2.5 text-left font-bold text-xl tracking-tight text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer group"
        >
          <SenaLogo size={48} color="#39A900" className="group-hover:scale-105 transition-transform" />
          <span>SENA Inducción</span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectStation('identidad')}
            className={`cursor-pointer transition-colors hover:text-emerald-700 whitespace-nowrap ${
              activeStation === 'identidad' ? 'text-emerald-700 font-semibold' : ''
            }`}
          >
            Identidad
          </button>
          <button
            onClick={() => onSelectStation('fpi')}
            className={`cursor-pointer transition-colors hover:text-emerald-700 whitespace-nowrap ${
              activeStation === 'fpi' ? 'text-emerald-700 font-semibold' : ''
            }`}
          >
            Formación FPI
          </button>
          <button
            onClick={() => onSelectStation('reglamento')}
            className={`cursor-pointer transition-colors hover:text-emerald-700 whitespace-nowrap ${
              activeStation === 'reglamento' ? 'text-emerald-700 font-semibold' : ''
            }`}
          >
            Reglamento
          </button>
          <button
            onClick={() => onSelectStation('bienestar')}
            className={`cursor-pointer transition-colors hover:text-emerald-700 whitespace-nowrap ${
              activeStation === 'bienestar' ? 'text-emerald-700 font-semibold' : ''
            }`}
          >
            Bienestar
          </button>
          <button
            onClick={() => onSelectStation('evaluacion')}
            className={`cursor-pointer transition-colors hover:text-emerald-700 whitespace-nowrap ${
              activeStation === 'evaluacion' ? 'text-emerald-700 font-semibold' : ''
            }`}
          >
            Certificación
          </button>
        </nav>

        {/* Zone 3: Primary apprentice actions */}
        <div className="flex items-center gap-2.5">
          {onOpenAdminDashboard && (
            <button
              onClick={onOpenAdminDashboard}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isAdminLoggedIn
                  ? 'bg-slate-900 text-emerald-400 border border-slate-700 hover:bg-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
              }`}
              title="Acceso restringido para el Instructor / Administrador"
            >
              <span>{isAdminLoggedIn ? '🛡️' : '🔒'}</span>
              <span className="hidden sm:inline">
                {isAdminLoggedIn ? 'Panel Instructor' : 'Acceso Instructor'}
              </span>
            </button>
          )}
          {onOpenRanking && (
            <button
              onClick={onOpenRanking}
              className="px-2.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
              title="Ver Ranking de Puntuaciones y Velocidad"
            >
              <span>🏆</span>
              <span className="hidden sm:inline">Ranking</span>
            </button>
          )}
          <button
            onClick={onOpenGlossary}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Glosario
          </button>
          <button
            onClick={onOpenProfile}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <span>Mi Ficha</span>
            <span className="text-[11px] bg-emerald-900/60 text-emerald-100 px-1.5 py-0.5 rounded font-mono tabular-nums">
              {progressPercent}%
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
