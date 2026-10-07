import React from 'react';
import { StationId } from '../types/induction';
import { SenaLogo } from './SenaLogo';
import heroImg from '../assets/images/sena_campus_hero_1791379334960.jpg';

interface HeroSectionProps {
  onSelectStation: (station: StationId) => void;
  activeStation: StationId;
  completedStations: StationId[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectStation,
  activeStation,
  completedStations,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800">
      {/* Background imagery with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Campus tecnológico y centro de formación del SENA"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Unboxed clean metadata kicker */}
        <div className="flex items-center gap-2.5 text-xs font-medium text-emerald-400 mb-3 tracking-wide">
          <SenaLogo size={27} color="#39A900" />
          <span>Servicio Nacional de Aprendizaje</span>
          <span aria-hidden="true">·</span>
          <span>República de Colombia</span>
          <span aria-hidden="true">·</span>
          <span>Inducción Institucional 2026</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight text-balance">
              Bienvenido al SENA: Donde Colombia se Transforma a través del Trabajo y el Conocimiento
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mb-6 leading-relaxed">
              Inicia tu viaje como aprendiz de la entidad más querida de los colombianos. Explora los valores institucionales, el modelo pedagógico integral, tus derechos y deberes, y prepárate para liderar el sector productivo con excelencia.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectStation('identidad')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer shadow-sm hover:shadow-emerald-900/30"
              >
                Comenzar Ruta de Inducción
              </button>
              <button
                onClick={() => onSelectStation('evaluacion')}
                className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-medium text-sm rounded-lg transition-colors cursor-pointer"
              >
                Reto de Certificación
              </button>
            </div>
          </div>

          {/* Quick interactive station cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {[
              { id: 'identidad', label: '1. Identidad & Símbolos', detail: 'Misión, Escudo de 3 sectores e Himno' },
              { id: 'fpi', label: '2. Formación Profesional', detail: 'Saber-Hacer-Ser y Etapa Productiva' },
              { id: 'reglamento', label: '3. Reglamento del Aprendiz', detail: 'Derechos, deberes y simulador ético' },
              { id: 'bienestar', label: '4. Bienestar & Ecosistema', detail: 'Fondo Emprender, Sennova y Apoyos' },
              { id: 'evaluacion', label: '5. Certificación Oficial', detail: 'Evaluación y Acta de Inducción' },
            ].map((station) => {
              const isCurrent = activeStation === station.id;
              const isCompleted = completedStations.includes(station.id as StationId);
              return (
                <button
                  key={station.id}
                  onClick={() => onSelectStation(station.id as StationId)}
                  className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'bg-emerald-950/60 border-emerald-500/80 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold flex items-center gap-2">
                      <span>{station.label}</span>
                      {isCompleted && (
                        <span className="text-[11px] text-emerald-400 font-normal">
                          ✓ Completado
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{station.detail}</div>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">→</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
