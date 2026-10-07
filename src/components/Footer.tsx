import React from 'react';
import { StationId } from '../types/induction';

interface FooterProps {
  onSelectStation: (station: StationId) => void;
  onOpenGlossary: () => void;
  onOpenAdminDashboard?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectStation,
  onOpenGlossary,
  onOpenAdminDashboard,
}) => {
  return (
    <footer className="no-print bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="text-white font-bold text-lg tracking-tight">
              Servicio Nacional de Aprendizaje (SENA)
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Entidad pública adscrita al Ministerio del Trabajo de Colombia. Comprometida con la formación profesional integral gratuita, la equidad de oportunidades y el progreso de los trabajadores colombianos desde 1957.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
              <span>Línea Gratuita Nacional: 01 8000 910 270</span>
              <span aria-hidden="true">·</span>
              <span>Bogotá: (601) 343 0111</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Ruta de Inducción
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectStation('identidad')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Identidad y Símbolos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectStation('fpi')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Formación Integral (FPI)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectStation('reglamento')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Reglamento del Aprendiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectStation('bienestar')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Bienestar al Aprendiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectStation('evaluacion')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Certificación Final
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Canales & Soporte
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenGlossary}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Glosario de Términos
                </button>
              </li>
              <li>
                <a
                  href="https://www.sena.edu.co"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Portal Institucional SENA
                </a>
              </li>
              <li>
                <a
                  href="https://ape.sena.edu.co"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Agencia Pública de Empleo (APE)
                </a>
              </li>
              <li>
                <a
                  href="https://www.fondoemprender.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Fondo Emprender
                </a>
              </li>
              {onOpenAdminDashboard && (
                <li className="pt-2 border-t border-slate-800">
                  <button
                    onClick={onOpenAdminDashboard}
                    className="hover:text-emerald-400 text-slate-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <span>🔒</span>
                    <span>Consola del Instructor (Privada)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Servicio Nacional de Aprendizaje SENA · República de Colombia
          </div>
          <div className="flex items-center gap-3">
            <span>Formación Profesional Integral</span>
            <span aria-hidden="true">·</span>
            <span>Acceso Libre y Gratuito</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
