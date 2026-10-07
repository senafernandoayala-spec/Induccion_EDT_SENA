import React, { useState, useEffect } from 'react';
import { PRODUCTIVE_MODES } from '../data/senaData';
import { ProductiveMode } from '../types/induction';
import labImg from '../assets/images/sena_apprentices_lab_1791379352082.jpg';

interface StationFPIProps {
  onComplete: () => void;
  isCompleted: boolean;
}

export const StationFPI: React.FC<StationFPIProps> = ({ onComplete, isCompleted }) => {
  const [selectedMode, setSelectedMode] = useState<ProductiveMode>(PRODUCTIVE_MODES[0]);
  const [activeTab, setActiveTab] = useState<'dimensiones' | 'etapas' | 'modalidades' | 'metodologia'>('dimensiones');

  useEffect(() => {
    if (!isCompleted) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isCompleted, onComplete]);

  return (
    <div className="space-y-8">
      {/* Station Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Estación 02</span>
            <span aria-hidden="true">·</span>
            <span>Modelo Pedagógico Institucional</span>
            <span aria-hidden="true">·</span>
            <span>Saber · Saber Hacer · Saber Ser</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Formación Profesional Integral (FPI)
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Descubre la metodología de formación por competencias, la ruta desde el aula y los talleres (Etapa Lectiva) hasta tu inmersión laboral o investigativa (Etapa Productiva).
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

      {/* Navigation tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg max-w-xl">
        <button
          onClick={() => setActiveTab('dimensiones')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'dimensiones'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Las 3 Dimensiones
        </button>
        <button
          onClick={() => setActiveTab('etapas')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'etapas'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Lectiva vs Productiva
        </button>
        <button
          onClick={() => setActiveTab('modalidades')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'modalidades'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Modalidades Productivas
        </button>
        <button
          onClick={() => setActiveTab('metodologia')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'metodologia'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Método de Proyectos
        </button>
      </div>

      {/* TAB 1: 3 Dimensiones */}
      {activeTab === 'dimensiones' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs border-t-4 border-t-sky-600 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-sky-700">Dimensión 01</span>
                  <span className="text-xs text-slate-400">Cognitiva</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Saber</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Fundamentos conceptuales, teorías científicas, matemáticas aplicadas y normativas técnicas que sustentan el oficio u ocupación.
                </p>
                <div className="space-y-1.5 text-xs text-slate-700 bg-sky-50/60 p-3 rounded-lg border border-sky-100">
                  <div className="font-semibold text-sky-900">En la práctica:</div>
                  <div>• Comprensión de manuales técnicos</div>
                  <div>• Interpretación de planos y datos</div>
                  <div>• Dominio de conceptos de la disciplina</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs border-t-4 border-t-emerald-600 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-emerald-700">Dimensión 02</span>
                  <span className="text-xs text-slate-400">Procedimental</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Saber Hacer</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Destrezas motrices, operación de herramientas de vanguardia, software especializado y resolución de problemas prácticos en entornos reales.
                </p>
                <div className="space-y-1.5 text-xs text-slate-700 bg-emerald-50/60 p-3 rounded-lg border border-emerald-100">
                  <div className="font-semibold text-emerald-900">En la práctica:</div>
                  <div>• Programación y prototipado ágil</div>
                  <div>• Manejo seguro de maquinaria</div>
                  <div>• Ejecución de entregables del proyecto</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs border-t-4 border-t-amber-600 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-amber-700">Dimensión 03</span>
                  <span className="text-xs text-slate-400">Actitudinal & Ética</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Saber Ser</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Valores humanos, ética profesional, comunicación asertiva, resiliencia, trabajo en equipo y empatía ciudadana.
                </p>
                <div className="space-y-1.5 text-xs text-slate-700 bg-amber-50/60 p-3 rounded-lg border border-amber-100">
                  <div className="font-semibold text-amber-900">En la práctica:</div>
                  <div>• Convivencia respetuosa con la ficha</div>
                  <div>• Puntualidad y sentido de responsabilidad</div>
                  <div>• Cuidado del medio ambiente y recursos</div>
                </div>
              </div>
            </div>
          </div>

          {/* Apprentices Lab photo highlight */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-5 h-56 md:h-auto bg-slate-100 relative">
              <img
                src={labImg}
                alt="Aprendices SENA colaborando en ambiente tecnológico"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-center">
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                Ambientes de Aprendizaje SENA
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Aprender Haciendo: La Esencia de la Formación Profesional
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                En el SENA no eres un receptor pasivo de información: eres un aprendiz activo que formula hipótesis, construye soluciones y aprende a través de la práctica constante en laboratorios, talleres, campos de entrenamiento y plataformas digitales interactivas.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>117 Centros de Formación en Colombia</span>
                <span aria-hidden="true">·</span>
                <span>33 Regionales</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Etapas Lectiva vs Productiva */}
      {activeTab === 'etapas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                  Fase 1
                </span>
                <span className="text-xs text-slate-500">Aulas, Talleres y Zajuna</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Etapa Lectiva</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Período en el cual el aprendiz adquiere y apropia los conocimientos y competencias requeridas mediante el desarrollo de proyectos formativos, talleres técnicos y trabajo colaborativo.
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-900 shrink-0">Metodología:</span>
                  <span>Aprendizaje Basado en Proyectos (ABP) organizado en fases: Análisis, Planeación, Ejecución y Evaluación.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-900 shrink-0">Evaluación:</span>
                  <span>Evidencias de Conocimiento, Desempeño y Producto registradas en el Portafolio de Aprendizaje.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-900 shrink-0">Acompañamiento:</span>
                  <span>Equipo de instructores técnicos, transversales (inglés, TIC, ética, SST) y bienestar al aprendiz.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Fase 2
                </span>
                <span className="text-xs text-slate-500">Sector Real de la Economía</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Etapa Productiva</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Período en el cual el aprendiz aplica, consolida y perfecciona las competencias adquiridas directamente en el sector productivo o a través de proyectos de innovación tecnológica.
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-900 shrink-0">Requisito:</span>
                  <span>Haber aprobado el 100% de los Resultados de Aprendizaje (RAP) de la etapa lectiva.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-900 shrink-0">Seguimiento:</span>
                  <span>Visitas de concertación y evaluación por parte de un instructor de seguimiento del SENA.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-900 shrink-0">Bitácoras:</span>
                  <span>Diligenciamiento de 12 bitácoras quincenales (formato F023) firmadas por el jefe inmediato.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Modalidades Productivas */}
      {activeTab === 'modalidades' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Modalidades selector list */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="text-xs font-semibold text-slate-500 mb-1">
              Selecciona una alternativa de etapa práctica:
            </div>
            {PRODUCTIVE_MODES.map((mode) => {
              const isSelected = mode.id === selectedMode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{mode.name}</span>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      {mode.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{mode.description}</p>
                </button>
              );
            })}
          </div>

          {/* Modalidad Deep Dive card */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold mb-1">
                <span>Alternativa Oficial de Etapa Productiva</span>
                <span aria-hidden="true">·</span>
                <span>{selectedMode.badge}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{selectedMode.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{selectedMode.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-medium text-slate-500 block">Duración Típica</span>
                <span className="text-sm font-semibold text-slate-900">{selectedMode.duration}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-medium text-slate-500 block">Seguridad Social (Salud y Riesgos)</span>
                <span className="text-sm font-semibold text-slate-900">{selectedMode.coverage}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-medium text-slate-500 block">Apoyo Económico</span>
                <span className="text-sm font-semibold text-slate-900">{selectedMode.supportAmount}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-medium text-slate-500 block">Perfil Recomendado</span>
                <span className="text-sm font-semibold text-slate-900">{selectedMode.idealFor}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-emerald-900 block mb-1">
                💡 Consejo del Coordinador Académico:
              </span>
              Puedes postular a tu contrato de aprendizaje a través del Sistema de Gestión Virtual de Aprendices (SGVA) desde la etapa lectiva, pero su ejecución formal comenzará tan pronto apruebes todas tus materias y RAP lectivos.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Metodología de Proyectos */}
      {activeTab === 'metodologia' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Aprendizaje Basado en Proyectos (ABP)
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              En tu programa no harás ejercicios aislados sin sentido: resolverás un problema real de la comunidad o de una empresa mediante las 4 fases de tu proyecto formativo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                fase: 'Fase 1: Análisis',
                desc: 'Diagnóstico de necesidades, levantamiento de requerimientos del cliente o entorno, y delimitación del alcance.',
                deliverables: 'Árbol de problemas, matriz de requisitos, marco lógico.',
              },
              {
                fase: 'Fase 2: Planeación',
                desc: 'Diseño de la solución técnica, cronograma en diagrama de Gantt, presupuestos y asignación de roles de equipo.',
                deliverables: 'Planos, prototipos de diseño, arquitectura técnica.',
              },
              {
                fase: 'Fase 3: Ejecución',
                desc: 'Construcción física, desarrollo de software, manufactura o prestación del servicio en el ambiente de aprendizaje.',
                deliverables: 'Producto tangible o servicio funcional operando.',
              },
              {
                fase: 'Fase 4: Evaluación',
                desc: 'Pruebas de calidad, validación de impacto social o económico, sustentación pública y lecciones aprendidas.',
                deliverables: 'Informe final de resultados y plan de mejora continua.',
              },
            ].map((p, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-700 mb-1">0{idx + 1}</div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">{p.fase}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{p.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Entregables:</span> {p.deliverables}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
