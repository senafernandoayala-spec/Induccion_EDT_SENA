import React, { useState, useEffect } from 'react';
import { ACUERDO_0009_2024, CASE_STUDIES } from '../data/senaData';

interface StationReglamentoProps {
  onComplete: () => void;
  isCompleted: boolean;
}

export const StationReglamento: React.FC<StationReglamentoProps> = ({ onComplete, isCompleted }) => {
  const [activeTab, setActiveTab] = useState<'estructura' | 'derechos' | 'deberes' | 'permanencia' | 'faltas_sanciones' | 'simulador'>('estructura');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('I');
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [revealedResult, setRevealedResult] = useState<boolean>(false);

  useEffect(() => {
    if (!isCompleted) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isCompleted, onComplete]);

  const activeCase = CASE_STUDIES[currentCaseIndex];
  const selectedChapter = ACUERDO_0009_2024.capitulos.find((c) => c.id === selectedChapterId) || ACUERDO_0009_2024.capitulos[0];

  const handleSelectOption = (optId: string) => {
    setSelectedOptionId(optId);
    setRevealedResult(true);
  };

  const handleNextCase = () => {
    setSelectedOptionId(null);
    setRevealedResult(false);
    setCurrentCaseIndex((prev) => (prev + 1) % CASE_STUDIES.length);
  };

  return (
    <div className="space-y-8">
      {/* Header with official enactment tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Estación 03</span>
            <span aria-hidden="true">·</span>
            <span>Normativa Institucional Vigente</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-emerald-700">Acuerdo 0009 de 2024</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Reglamento del Aprendiz SENA (Acuerdo 0009 de 2024)
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Estatuto marco promulgado el 5 de noviembre de 2024. Deroga los Acuerdos 07 de 2012, 02 de 2014, 06 de 2023 y 02 de 2024, estableciendo las normas de convivencia, permanencia, derechos, deberes y debido proceso.
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

      {/* Regulation Dashboard Metrics Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-0.5">
              <span>SENA · Dirección General</span>
              <span aria-hidden="true">·</span>
              <span>Publicado: 5 de Noviembre de 2024</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Estructura Jurídica del Acuerdo 0009 de 2024
            </h3>
          </div>
          <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-emerald-400 font-semibold">Derogatoria Expresa:</span> Acuerdos 07/2012, 02/2014, 06/2023 y 02/2024
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 text-center">
            <span className="text-xs text-slate-400 block">Capítulos</span>
            <span className="text-2xl font-black text-white font-mono tabular-nums">
              {ACUERDO_0009_2024.estadisticas.total_capitulos}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Títulos temáticos</span>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 text-center">
            <span className="text-xs text-slate-400 block">Artículos</span>
            <span className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
              {ACUERDO_0009_2024.estadisticas.total_articulos}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Normas dispositivas</span>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 text-center">
            <span className="text-xs text-slate-400 block">Derechos</span>
            <span className="text-2xl font-black text-sky-400 font-mono tabular-nums">
              {ACUERDO_0009_2024.estadisticas.derechos_aprendiz}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Artículo 5</span>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 text-center">
            <span className="text-xs text-slate-400 block">Deberes</span>
            <span className="text-2xl font-black text-amber-400 font-mono tabular-nums">
              {ACUERDO_0009_2024.estadisticas.deberes_aprendiz}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Artículo 8</span>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 text-center col-span-2 sm:col-span-1">
            <span className="text-xs text-slate-400 block">Prohibiciones</span>
            <span className="text-2xl font-black text-rose-400 font-mono tabular-nums">
              {ACUERDO_0009_2024.estadisticas.prohibiciones}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Artículo 9</span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('estructura')}
          className={`py-1.5 px-3 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'estructura'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Estructura (5 Capítulos)
        </button>
        <button
          onClick={() => setActiveTab('derechos')}
          className={`py-1.5 px-3 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'derechos'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cap. II · Derechos (24) & Méritos
        </button>
        <button
          onClick={() => setActiveTab('deberes')}
          className={`py-1.5 px-3 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'deberes'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cap. III · Deberes (24) & Prohibiciones (14)
        </button>
        <button
          onClick={() => setActiveTab('permanencia')}
          className={`py-1.5 px-3 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'permanencia'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cap. IV · Novedades & Deserción
        </button>
        <button
          onClick={() => setActiveTab('faltas_sanciones')}
          className={`py-1.5 px-3 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'faltas_sanciones'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cap. V · Faltas & Sanciones
        </button>
        <button
          onClick={() => setActiveTab('simulador')}
          className={`py-1.5 px-3 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'simulador'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Simulador Ético (Casos Reales)
        </button>
      </div>

      {/* TAB 1: Estructura de los 5 Capítulos y 53 Artículos */}
      {activeTab === 'estructura' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Chapter list selector */}
            <div className="lg:col-span-5 space-y-2">
              <div className="text-xs font-semibold text-slate-500 mb-1">
                Selecciona un capítulo para explorar sus artículos:
              </div>
              {ACUERDO_0009_2024.capitulos.map((cap) => {
                const isSelected = cap.id === selectedChapterId;
                return (
                  <button
                    key={cap.id}
                    onClick={() => setSelectedChapterId(cap.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-800">
                        Capítulo {cap.id}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 font-mono">
                        {cap.articulos.length} artículos
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{cap.nombre}</h4>
                  </button>
                );
              })}
            </div>

            {/* Chapter deep dive */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-mono font-bold text-emerald-700 uppercase">
                  Capítulo {selectedChapter.id}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedChapter.nombre}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Artículos del {selectedChapter.articulos[0]?.articulo} al{' '}
                  {selectedChapter.articulos[selectedChapter.articulos.length - 1]?.articulo}
                </p>
              </div>

              {/* Special content for Chapter 1: Principios Orientadores (Art. 3) */}
              {selectedChapter.id === 'I' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Artículo 3 · Principios Orientadores del SENA
                    </span>
                    <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      8 Principios
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                      'Autonomía',
                      'Dignidad',
                      'Inclusión',
                      'Enfoque diferencial',
                      'Enfoque territorial',
                      'Participación',
                      'Desarrollo sostenible',
                      'Solidaridad',
                    ].map((pr, idx) => (
                      <div key={idx} className="p-2 bg-white rounded border border-slate-200 text-center font-medium text-slate-800">
                        {pr}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles table list */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {selectedChapter.articulos.map((art) => (
                  <div
                    key={art.articulo}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start gap-3"
                  >
                    <span className="w-8 h-8 rounded bg-emerald-100 text-emerald-900 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {art.articulo}
                    </span>
                    <div className="flex-1">
                      <h5 className="text-xs font-bold text-slate-900">
                        Artículo {art.articulo}: {art.titulo}
                      </h5>

                      {art.contenido && (
                        <div className="mt-1.5 space-y-1 text-[11px] text-slate-600">
                          {Object.entries(art.contenido).map(([k, v]) => (
                            <div key={k}>
                              <strong className="text-slate-800 capitalize">{k.replace(/_/g, ' ')}:</strong> {v}
                            </div>
                          ))}
                        </div>
                      )}

                      {art.derechos_principales && (
                        <div className="mt-1 text-[11px] text-slate-600">
                          <strong>Principales:</strong> {art.derechos_principales.join(' · ')}
                        </div>
                      )}

                      {art.prohibiciones_destacadas && (
                        <div className="mt-1 text-[11px] text-rose-700">
                          <strong>Faltas destacadas:</strong> {art.prohibiciones_destacadas.join(', ')}
                        </div>
                      )}

                      {art.novedades && (
                        <div className="mt-1 text-[11px] text-sky-800">
                          <strong>Novedades:</strong> {art.novedades.join(' · ')}
                        </div>
                      )}

                      {art.tipos && typeof art.tipos === 'object' && !Array.isArray(art.tipos) && (
                        <div className="mt-1 text-[11px] text-slate-600">
                          <span><strong>Académicas:</strong> {art.tipos.academicas?.join(', ')}</span> ·{' '}
                          <span><strong>Disciplinarias:</strong> {art.tipos.disciplinarias?.join(', ')}</span>
                        </div>
                      )}

                      {Array.isArray(art.tipos) && (
                        <div className="mt-1 text-[11px] text-slate-600">
                          <strong>Medidas/Tipos:</strong> {art.tipos.join(' · ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Capítulo II · Derechos (24) & Reconocimientos */}
      {activeTab === 'derechos' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-mono font-bold text-sky-700 uppercase">Capítulo II</span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              Derechos del Aprendiz SENA (Artículo 5) y Reconocimientos (Artículo 6)
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              El Acuerdo 0009 de 2024 consagra 24 derechos fundamentales para garantizar tu formación profesional integral, dignidad, inclusión y debido proceso.
            </p>
          </div>

          {/* 8 Derechos Principales Cards */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Derechos Principales del Aprendiz (Art. 5)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { title: 'Recibir Formación Integral', desc: 'Formación profesional de calidad acorde con el diseño curricular, la pertinencia y el modelo por competencias.' },
                { title: 'Acceso a Recursos Formativos', desc: 'Disponibilidad de ambientes de aprendizaje, laboratorios, bibliotecas físicas/digitales y conectividad.' },
                { title: 'Bienestar al Aprendiz', desc: 'Servicios de salud preventiva, deporte, recreación, arte, cultura, apoyos socioeconómicos y consejería.' },
                { title: 'Debido Proceso', desc: 'Garantía constitucional de defensa, contradicción y presunción de inocencia ante cualquier procedimiento.' },
                { title: 'Evaluación Objetiva', desc: 'Conocer oportunamente criterios de evaluación y juicios formativos fundamentados técnica y pedagógicamente.' },
                { title: 'Participación Democrática', desc: 'Elegir y ser elegido como vocero de ficha o representante de aprendices de centro.' },
                { title: 'Certificación Oportuna', desc: 'Recibir el título o certificado tras culminar exitosamente las etapas lectiva y productiva.' },
                { title: 'Trato Digno e Incluyente', desc: 'Respeto irrestricto sin discriminación por género, etnia, religión, condición física o ideología.' },
              ].map((der, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-sky-50/40 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-sky-800 mb-1 block">0{idx + 1}</span>
                    <h5 className="text-sm font-bold text-slate-900 mb-1">{der.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{der.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reconocimientos Formativos (Art. 6) */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Reconocimientos Formativos por Excelencia (Art. 6)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                <span className="font-bold block mb-1">Mención de Honor</span>
                Exaltación pública al mérito académico, actitudinal o investigativo del aprendiz en ceremonias institucionales.
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                <span className="font-bold block mb-1">Representación Institucional</span>
                Participación como delegado del SENA en eventos técnicos, olimpiadas de habilidades (WorldSkills) o foros.
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                <span className="font-bold block mb-1">Prácticas Destacadas</span>
                Oportunidades de pasantías o movilidad formativa nacional e internacional con centros y empresas aliadas.
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                <span className="font-bold block mb-1">Monitorías Institucionales</span>
                Asignación de estímulo formativo y económico para apoyar ambientes de aprendizaje y laboratorios.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Capítulo III · Deberes (24) & Prohibiciones (14) */}
      {activeTab === 'deberes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <span className="text-xs font-mono font-bold text-amber-700 uppercase">Capítulo III · Artículo 8</span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Deberes del Aprendiz SENA (24 Deberes)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Conductas activas indispensables para el desarrollo armonioso y la excelencia formativa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">1. Porte de Carné y EPP:</strong>
                Portar visiblemente el carné institucional en todo momento y usar los Elementos de Protección Personal obligatorios en ambientes técnicos.
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">2. Asistencia y Puntualidad:</strong>
                Participar activamente en las sesiones concertadas, respetando cronogramas tanto en ambientes físicos como en plataformas LMS.
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">3. Cuidado del Patrimonio:</strong>
                Conservar y dar uso adecuado a los bienes, maquinaria, herramientas, equipos de computo e instalaciones del Centro.
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">4. Honestidad Académica:</strong>
                Entregar evidencias originales de su autoría, citando debidamente fuentes bibliográficas y respetando derechos de autor.
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">5. Respeto y Convivencia:</strong>
                Mantener un trato respetuoso, solidario y digno con instructores, compañeros, personal de apoyo y directivos.
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">6. Trámites Documentales:</strong>
                Justificar oportunamente las inasistencias o novedades de formación con soportes válidos dentro de los términos establecidos.
              </div>
            </div>
          </div>

          {/* 14 Prohibiciones Expresas (Art. 9) */}
          <div className="bg-white rounded-xl border border-rose-200 p-6 shadow-xs bg-rose-50/20">
            <div className="border-b border-rose-100 pb-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-rose-700 uppercase">Capítulo III · Artículo 9</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    Prohibiciones Expresas (14 Prohibiciones)
                  </h3>
                </div>
                <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded">
                  Infracciones Reglamentarias
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Conductas que atentan contra la integridad institucional, la convivencia y la seguridad del entorno formativo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { title: 'Plagio y Fraude', desc: 'Copiar proyectos, tareas o exámenes, o pagar a terceros para elaboración de evidencias.' },
                { title: 'Suplantación de Identidad', desc: 'Presentarse como otro aprendiz en evaluaciones, plataformas LMS o ingreso a sedes.' },
                { title: 'Falsificación Documental', desc: 'Alterar certificados, incapacidades médicas, firmas o documentos académicos oficiales.' },
                { title: 'Consumo de SPA y Alcohol', desc: 'Ingresar, consumir o comercializar sustancias psicoactivas o alcohol en el SENA.' },
                { title: 'Porte de Armas', desc: 'Portar o ingresar cualquier tipo de arma de fuego, cortopunzante o artefacto explosivo.' },
                { title: 'Discriminación o Acoso', desc: 'Cualquier acto de violencia, hostigamiento, ciberacoso o discriminación por cualquier motivo.' },
                { title: 'Daño a Bienes', desc: 'Deteriorar, hurtar o destruir infraestructura, equipos o software de la entidad.' },
                { title: 'Uso Indebido de Marca', desc: 'Usar el nombre o logo del SENA para beneficio económico o político personal no autorizado.' },
              ].map((proh, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-rose-200 shadow-xs">
                  <span className="text-xs font-bold text-rose-700 block mb-1">🚫 {proh.title}</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{proh.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Capítulo IV · Novedades, Permanencia & Deserción */}
      {activeTab === 'permanencia' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-mono font-bold text-emerald-700 uppercase">Capítulo IV · Arts. 10 al 38</span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              Ingreso, Permanencia, Novedades y Certificación
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Marco procedimental que rige la trayectoria del aprendiz desde la matrícula hasta la titulación oficial.
            </p>
          </div>

          {/* Novedades durante la formación (Art. 18) */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Novedades durante la Formación (Artículo 18)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">1. Traslado</span>
                Solicitud para continuar el mismo programa formativo en otra jornada, grupo o Centro de Formación del país.
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">2. Aplazamiento</span>
                Suspensión temporal justificada del proceso formativo por fuerza mayor o razones de salud comprobables.
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">3. Reintegro</span>
                Retorno formal a la formación una vez vencido el período de aplazamiento autorizado previamente.
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">4. Retiro Voluntario</span>
                Manifestación escrita e informada del aprendiz para desvincularse formalmente del programa.
              </div>
            </div>
          </div>

          {/* Deserción (Art. 30 y 31) & Juicios de Evaluación (Art. 36) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
              <span className="text-xs font-bold text-amber-900 uppercase block">
                Deserción y Procedimiento (Artículos 30 y 31)
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Se configura deserción cuando el aprendiz:
              </p>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                <li>Acumula <strong>3 días hábiles consecutivos</strong> de inasistencia injustificada en etapa lectiva.</li>
                <li>No reporta justificación válida tras el requerimiento formal de la Coordinación dentro de los términos.</li>
                <li>Injustificadamente no inicia o abandona la etapa productiva concertada.</li>
              </ul>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-900 uppercase block">
                Juicios de Evaluación (Artículo 36)
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                El instructor registra en el sistema de información uno de los siguientes juicios sobre cada Resultado de Aprendizaje (RAP):
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-center font-bold text-xs">
                <div className="p-2 bg-white rounded border border-emerald-300 text-emerald-800">
                  APROBADO
                </div>
                <div className="p-2 bg-white rounded border border-slate-300 text-slate-700">
                  NO APROBADO
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Frente a un juicio "NO APROBADO", el aprendiz tiene derecho a concertar un Plan de Mejoramiento (Art. 35 y 46).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Capítulo V · Régimen de Faltas & Sanciones */}
      {activeTab === 'faltas_sanciones' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-mono font-bold text-rose-700 uppercase">Capítulo V · Arts. 39 al 53</span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              Régimen de Faltas, Medidas Formativas, Disciplinarias y Sancionatorias
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Garantías de legalidad, debido proceso, culpabilidad y no doble sanción (Artículo 39).
            </p>
          </div>

          {/* Clasificación de Faltas (Art. 42) */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Clasificación de las Faltas (Artículo 42)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-slate-700">
                <span className="font-bold text-amber-900 block mb-1">Faltas Leves</span>
                Incumplimientos menores que no afectan gravemente los procesos pedagógicos ni la integridad comunitaria (ej. inasistencia esporádica no reiterada).
              </div>
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-xs text-slate-700">
                <span className="font-bold text-orange-900 block mb-1">Faltas Graves</span>
                Afectación considerable a la convivencia, seguridad o desempeño formativo (ej. plagio, reincidencia en faltas leves, desacato a normas de SST).
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-slate-700">
                <span className="font-bold text-rose-900 block mb-1">Faltas Gravísimas</span>
                Vulneración flagrante de derechos fundamentales o delitos (ej. porte de armas, agresiones físicas, falsificación documental, suplantación).
              </div>
            </div>
          </div>

          {/* Medidas Formativas (Art. 46) vs Medidas Sancionatorias (Art. 47) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-900 uppercase block">
                Medidas Formativas Pedagógicas (Art. 46)
              </span>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div>
                  <strong>Académicas:</strong> Llamado de atención y Plan de mejoramiento académico.
                </div>
                <div>
                  <strong>Disciplinarias:</strong> Llamado de atención disciplinario y Plan de mejoramiento disciplinario.
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Enfocadas en orientar, concertar compromisos pedagógicos y restituir la trayectoria sin carácter punitivo.
                </div>
              </div>
            </div>

            <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 space-y-2">
              <span className="text-xs font-bold text-rose-900 uppercase block">
                Medidas Sancionatorias (Art. 47)
              </span>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div>
                  <strong>1. Condicionamiento de Matrícula:</strong> Estado de alerta formativa con compromisos estrictos.
                </div>
                <div>
                  <strong>2. Cancelación de Matrícula:</strong> Pérdida de la calidad de aprendiz e inhabilidad en el SENA.
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Requieren concepto previo del Comité de Evaluación y Seguimiento y resolución motivada de Subdirección.
                </div>
              </div>
            </div>
          </div>

          {/* Instancias y Equipos (Arts. 48 y 49) */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <strong>Equipos encargados (Art. 48):</strong> Equipo ejecutor · Comité de Evaluación y Seguimiento.
            </div>
            <div>
              <strong>Instancias decisorias (Art. 49):</strong> Subdirección de Centro (1ª instancia) · Dirección Regional (2ª instancia).
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Simulador Ético de Casos Reales */}
      {activeTab === 'simulador' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Simulador Basado en el Acuerdo 0009 de 2024
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Caso {currentCaseIndex + 1} de {CASE_STUDIES.length}: {activeCase.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Categoría:</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                {activeCase.category}
              </span>
            </div>
          </div>

          {/* Scenario description box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-1">Situación planteada:</span>
            {activeCase.situation}
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-600">
              ¿Cuál es la conducta ajustada a las normas del Acuerdo 0009 de 2024?
            </div>
            {activeCase.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              let optionStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-800';

              if (revealedResult && isSelected) {
                optionStyle = option.isCorrect
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500'
                  : 'bg-rose-50 border-rose-500 text-rose-950 ring-1 ring-rose-500';
              } else if (revealedResult && option.isCorrect) {
                optionStyle = 'bg-emerald-50/50 border-emerald-300 text-emerald-900';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={revealedResult}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${optionStyle} ${
                    revealedResult ? 'cursor-default' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                      {isSelected ? '●' : '○'}
                    </span>
                    <div className="text-sm leading-relaxed">{option.text}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback section when revealed */}
          {revealedResult && selectedOptionId && (
            <div className="mt-4 p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              {(() => {
                const opt = activeCase.options.find((o) => o.id === selectedOptionId);
                if (!opt) return null;
                return (
                  <>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          opt.isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {opt.isCorrect ? 'DECISIÓN CORRECTA' : 'DECISIÓN CON INFRACCIÓN O RIESGO'}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{opt.articleReference}</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {opt.consequence}
                    </p>
                  </>
                );
              })()}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextCase}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Siguiente Caso del Simulador →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
