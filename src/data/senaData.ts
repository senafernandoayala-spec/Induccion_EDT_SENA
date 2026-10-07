import { CaseStudy, GlossaryTerm, ProductiveMode, QuizQuestion, RegulationAgreement } from '../types/induction';

export const ACUERDO_0009_2024: RegulationAgreement = {
  documento: {
    tipo: 'Acuerdo',
    numero: '0009',
    anio: 2024,
    titulo: 'Reglamento del Aprendiz SENA',
    entidad: 'SENA',
    fecha_publicacion: '2024-11-05',
    deroga: [
      'Acuerdo 07 de 2012',
      'Acuerdo 02 de 2014',
      'Acuerdo 06 de 2023',
      'Acuerdo 02 de 2024'
    ]
  },
  capitulos: [
    {
      id: 'I',
      nombre: 'Definiciones',
      articulos: [
        {
          articulo: 1,
          titulo: 'Definiciones',
          contenido: {
            formacion_profesional_integral: 'Proceso educativo teórico-práctico orientado al desarrollo de conocimientos, habilidades, valores y competencias.',
            comunidad_educativa: 'Aprendices, instructores, administrativos, directivos y demás actores vinculados.',
            aspirante: 'Persona que participa en el proceso de ingreso.',
            aprendiz: 'Persona matriculada en programas de formación del SENA.',
            grupo: 'Conjunto de aprendices asociados a un programa y ficha.'
          }
        },
        {
          articulo: 2,
          titulo: 'Alcance del reglamento'
        },
        {
          articulo: 3,
          titulo: 'Principios orientadores',
          principios: [
            'Autonomía',
            'Dignidad',
            'Inclusión',
            'Enfoque diferencial',
            'Enfoque territorial',
            'Participación',
            'Desarrollo sostenible',
            'Solidaridad'
          ]
        },
        {
          articulo: 4,
          titulo: 'Centro de convivencia'
        }
      ]
    },
    {
      id: 'II',
      nombre: 'Derechos del Aprendiz SENA',
      articulos: [
        {
          articulo: 5,
          titulo: 'Derechos del aprendiz',
          cantidad_derechos: 24,
          derechos_principales: [
            'Recibir formación integral',
            'Acceso a recursos formativos',
            'Bienestar al aprendiz',
            'Debido proceso',
            'Ser evaluado objetivamente',
            'Participación democrática',
            'Recibir certificación',
            'Trato digno e incluyente'
          ]
        },
        {
          articulo: 6,
          titulo: 'Reconocimientos formativos',
          tipos: [
            'Mención de honor',
            'Representación institucional',
            'Prácticas nacionales e internacionales',
            'Monitorías'
          ]
        },
        {
          articulo: 7,
          titulo: 'Representatividad de los aprendices'
        }
      ]
    },
    {
      id: 'III',
      nombre: 'Deberes del Aprendiz SENA',
      articulos: [
        {
          articulo: 8,
          titulo: 'Deberes del aprendiz',
          cantidad_deberes: 24
        },
        {
          articulo: 9,
          titulo: 'Prohibiciones',
          cantidad_prohibiciones: 14,
          prohibiciones_destacadas: [
            'Suplantación',
            'Falsificación documental',
            'Plagio',
            'Consumo de sustancias psicoactivas',
            'Portar armas',
            'Discriminación',
            'Daño a bienes institucionales'
          ]
        }
      ]
    },
    {
      id: 'IV',
      nombre: 'Ingreso, Permanencia y Certificación',
      articulos: [
        {
          articulo: 10,
          titulo: 'Reglas generales de ingreso'
        },
        {
          articulo: 11,
          titulo: 'Etapa de registro'
        },
        {
          articulo: 12,
          titulo: 'Etapa de inscripción'
        },
        {
          articulo: 13,
          titulo: 'Restricciones para la inscripción'
        },
        {
          articulo: 14,
          titulo: 'Etapa de selección'
        },
        {
          articulo: 15,
          titulo: 'Etapa de matrícula'
        },
        {
          articulo: 16,
          titulo: 'Trámites académicos y administrativos'
        },
        {
          articulo: 17,
          titulo: 'Novedades académicas y administrativas'
        },
        {
          articulo: 18,
          titulo: 'Novedades durante la formación',
          novedades: [
            'Traslado',
            'Aplazamiento',
            'Reintegro',
            'Retiro voluntario'
          ]
        },
        {
          articulo: 19,
          titulo: 'Certificación'
        },
        {
          articulo: 20,
          titulo: 'Expedición de documentos académicos'
        },
        {
          articulo: 21,
          titulo: 'Validación de documentos académicos'
        },
        {
          articulo: 22,
          titulo: 'Reingreso'
        },
        {
          articulo: 23,
          titulo: 'Condiciones para el reingreso'
        },
        {
          articulo: 24,
          titulo: 'Procedimiento para el reingreso'
        },
        {
          articulo: 25,
          titulo: 'Seguimiento al reingreso'
        },
        {
          articulo: 26,
          titulo: 'Proceso de formación',
          etapas: [
            'Lectiva',
            'Productiva'
          ]
        },
        {
          articulo: 27,
          titulo: 'Cumplimiento satisfactorio'
        },
        {
          articulo: 28,
          titulo: 'Incumplimiento justificado'
        },
        {
          articulo: 29,
          titulo: 'Incumplimiento injustificado'
        },
        {
          articulo: 30,
          titulo: 'Deserción'
        },
        {
          articulo: 31,
          titulo: 'Procedimiento por deserción'
        },
        {
          articulo: 32,
          titulo: 'Evaluación del aprendizaje'
        },
        {
          articulo: 33,
          titulo: 'Evidencias de aprendizaje'
        },
        {
          articulo: 34,
          titulo: 'Principios de evaluación'
        },
        {
          articulo: 35,
          titulo: 'Acompañamiento evaluativo'
        },
        {
          articulo: 36,
          titulo: 'Juicios de evaluación',
          juicios: [
            'APROBADO',
            'NO APROBADO'
          ]
        },
        {
          articulo: 37,
          titulo: 'Seguimiento de resultados'
        },
        {
          articulo: 38,
          titulo: 'Inconformidad y revisión'
        }
      ]
    },
    {
      id: 'V',
      nombre: 'Régimen de Faltas, Medidas Formativas, Disciplinarias y Sancionatorias',
      articulos: [
        {
          articulo: 39,
          titulo: 'Principios orientadores',
          principios: [
            'Confidencialidad',
            'Debido proceso',
            'Culpabilidad',
            'No doble sanción'
          ]
        },
        {
          articulo: 40,
          titulo: 'Medidas disciplinarias y sancionatorias'
        },
        {
          articulo: 41,
          titulo: 'Faltas',
          tipos: [
            'Académicas',
            'Disciplinarias'
          ]
        },
        {
          articulo: 42,
          titulo: 'Clasificación de faltas',
          categorias: [
            'Leves',
            'Graves',
            'Gravísimas'
          ]
        },
        {
          articulo: 43,
          titulo: 'Calificación de faltas'
        },
        {
          articulo: 44,
          titulo: 'Criterios para calificar faltas'
        },
        {
          articulo: 45,
          titulo: 'Medidas formativas'
        },
        {
          articulo: 46,
          titulo: 'Tipos de medidas formativas',
          tipos: {
            academicas: [
              'Llamado de atención',
              'Plan de mejoramiento'
            ],
            disciplinarias: [
              'Llamado de atención disciplinario',
              'Plan de mejoramiento disciplinario'
            ]
          }
        },
        {
          articulo: 47,
          titulo: 'Medidas sancionatorias',
          tipos: [
            'Condicionamiento de matrícula',
            'Cancelación de matrícula'
          ]
        },
        {
          articulo: 48,
          titulo: 'Equipos encargados',
          equipos: [
            'Equipo ejecutor',
            'Comité de evaluación y seguimiento'
          ]
        },
        {
          articulo: 49,
          titulo: 'Instancias decisorias',
          instancias: [
            'Subdirección de Centro',
            'Dirección Regional'
          ]
        },
        {
          articulo: 50,
          titulo: 'Criterios para aplicación de sanciones'
        },
        {
          articulo: 51,
          titulo: 'Procedimiento sancionatorio'
        },
        {
          articulo: 52,
          titulo: 'Certificación de conducta y sanciones'
        },
        {
          articulo: 53,
          titulo: 'Sujeción a la Constitución y la Ley'
        }
      ]
    }
  ],
  estadisticas: {
    total_capitulos: 5,
    total_articulos: 53,
    derechos_aprendiz: 24,
    deberes_aprendiz: 24,
    prohibiciones: 14
  }
};

export const INSTITUTIONAL_INFO = {
  name: 'Servicio Nacional de Aprendizaje (SENA)',
  foundedYear: '1957',
  founder: 'Rodolfo Martínez Tono',
  nature: 'Establecimiento público del orden nacional, adscrito al Ministerio del Trabajo de Colombia',
  mission: 'El SENA está encargado de cumplir la función que le corresponde al Estado de invertir en el desarrollo social y técnico de los trabajadores colombianos, ofreciendo y ejecutando la formación profesional integral gratuita, para la incorporación y el desarrollo de las personas en actividades productivas que contribuyan al desarrollo social, económico y tecnológico del país.',
  vision: 'El SENA se consolidará como una entidad referente nacional e internacional de formación profesional integral con pertinencia, equidad, innovación y transformación digital, respondiendo a las demandas reales del sector productivo y las comunidades.',
  principles: [
    { title: 'Dignidad del Ser Humano', desc: 'Reconocimiento del valor intrínseco de cada persona, promoviendo la igualdad, la inclusión y el respeto mutuo.' },
    { title: 'Libertad con Responsabilidad', desc: 'Autonomía individual guiada por el compromiso social, ético y profesional hacia la comunidad educativa.' },
    { title: 'Bien Común y Solidaridad', desc: 'Prevalencia del interés general sobre el particular y vocación de servicio para el desarrollo de Colombia.' },
    { title: 'Formación para la Vida y el Trabajo', desc: 'Desarrollo integral que conjuga saber técnico con competencias ciudadanas y éticas.' },
  ],
  values: [
    { name: 'Respeto', detail: 'Trato digno a instructores, compañeros y personal administrativo en todo espacio físico y virtual.' },
    { name: 'Honestidad', detail: 'Transparencia, autenticidad en proyectos formativos y rechazo absoluto al plagio.' },
    { name: 'Compromiso', detail: 'Dedicación constante a la excelencia en el aprendizaje y al cumplimiento de metas formativas.' },
    { name: 'Diligencia', detail: 'Cumplimiento oportuno de deberes, entregas de evidencias y asistencia puntual.' },
    { name: 'Justicia', detail: 'Actuación equitativa, imparcial y apegada al debido proceso y al reglamento del aprendiz.' },
    { name: 'Solidaridad', detail: 'Apoyo mutuo entre compañeros de ficha, colaboración comunitaria y empatía.' },
  ],
  symbols: {
    shield: {
      title: 'El Escudo del SENA',
      summary: 'El escudo institucional representa los tres sectores fundamentales de la economía colombiana, bases de la formación profesional integral.',
      elements: [
        {
          id: 'rueda',
          name: 'La Rueda Dentada (Piñón)',
          sector: 'Sector Industria y Construcción',
          description: 'Representa la fuerza motriz, la tecnología, la manufactura, las obras civiles y la transformación de materias primas que impulsan el desarrollo fabril del país.',
          color: 'text-amber-600 bg-amber-50 border-amber-200',
        },
        {
          id: 'caduceo',
          name: 'El Caduceo',
          sector: 'Sector Comercio y Servicios',
          description: 'Vara alada con serpientes entrelazadas que simboliza la actividad mercantil, las finanzas, el turismo, la logística y los servicios que dinamizan el intercambio en Colombia.',
          color: 'text-blue-600 bg-blue-50 border-blue-200',
        },
        {
          id: 'cafe',
          name: 'La Rama de Café y Espiga',
          sector: 'Sector Agropecuario y Rural',
          description: 'Evoca la fertilidad de los campos colombianos, la producción agrícola, pecuaria y agroindustrial que alimenta a la nación y fortalece la economía campesina.',
          color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        },
      ],
    },
    flag: {
      title: 'La Bandera',
      description: 'Consta de un fondo blanco puro que simboliza la paz, la tranquilidad, la rectitud ética y la transparencia en el accionar formativo. En su centro lleva el escudo institucional del SENA en verde corporativo, representando la esperanza, la juventud y el compromiso con el porvenir del país.',
    },
    logo: {
      title: 'El Logosímbolo',
      description: 'Diseñado como una figura humana estilizada que camina decidida hacia el frente, con los brazos abiertos superando obstáculos. Representa al aprendiz como protagonista de su propio destino formativo, impulsado por el conocimiento hacia el progreso y la realización profesional.',
    },
    hymn: {
      title: 'Himno del SENA',
      authorLyrics: 'Luis Alfredo Osorio',
      authorMusic: 'Daniel Marlez',
      stanzas: [
        {
          type: 'Coro',
          lines: [
            'Estudiantes del SENA adelante',
            'por Colombia luchad con amor',
            'con el ánimo noble y constante',
            'semenjante en la lucha al valor.',
          ],
        },
        {
          type: 'Estrofa I',
          lines: [
            'En la forja del SENA se forman',
            'hombres libres que saben triunfar,',
            'el trabajo es la fuerza bendita',
            'que a la patria sabrá libertar.',
          ],
        },
        {
          type: 'Estrofa II',
          lines: [
            'Hoy la patria nos llama a la lucha,',
            'con la mente serena y la fe,',
            'y en el pecho la viva esperanza',
            'de que un nuevo mañana se ve.',
          ],
        },
        {
          type: 'Estrofa III',
          lines: [
            'Nuestra meta es la cumbre gloriosa',
            'del saber que transforma el dolor,',
            'en canciones de paz y trabajo,',
            'y en emblemas de patrio fervor.',
          ],
        },
      ],
    },
  },
};

export const PRODUCTIVE_MODES: ProductiveMode[] = [
  {
    id: 'contrato_aprendizaje',
    name: 'Contrato de Aprendizaje',
    badge: 'Más Frecuente',
    description: 'Vinculación formativa con empresa patrocinadora conforme a la Ley 789 de 2002. La empresa brinda afiliación a EPS y ARL, más apoyo económico.',
    duration: 'Hasta 6 meses (según programa)',
    coverage: '100% EPS + 100% ARL obligatoria',
    supportAmount: '75% a 100% de 1 SMMLV (según tasa de desempleo nacional)',
    idealFor: 'Aprendices que buscan inmersión directa en el sector productivo corporativo.',
  },
  {
    id: 'proyecto_productivo',
    name: 'Proyecto Productivo (I+D+i SENNOVA)',
    badge: 'Innovación & Emprendimiento',
    description: 'Desarrollo de un proyecto de base tecnológica o empresarial validado por el Centro de Formación, o participación en proyectos de investigación aplicada SENNOVA.',
    duration: '6 meses con entregables verificables',
    coverage: 'Afiliación a ARL por el SENA',
    supportAmount: 'Posibilidad de capital semilla Fondo Emprender',
    idealFor: 'Emprendedores y aprendices con vocación de investigación y desarrollo técnico.',
  },
  {
    id: 'vinculo_laboral',
    name: 'Vínculo Laboral o Contractual',
    badge: 'Trabajadores Activos',
    description: 'Homologación de la etapa productiva si el aprendiz ya labora en una empresa y sus funciones cotidianas guardan relación directa con el programa formativo.',
    duration: 'Mínimo 6 meses de funciones afines',
    coverage: 'Seguridad social integral asumida por el empleador',
    supportAmount: 'Salario convenido en el contrato de trabajo',
    idealFor: 'Aprendices empleados que buscan certificar sus competencias técnicas en su puesto.',
  },
  {
    id: 'pasantia',
    name: 'Pasantía Técnica o Comunitaria',
    badge: 'Sector Público / Social',
    description: 'Acuerdo de práctica con entidades públicas, ONG, pymes o instituciones sin ánimo de lucro para asesorías o soluciones técnicas específicas.',
    duration: 'Hasta 6 meses concertados',
    coverage: 'ARL cubierta por la entidad receptora o el SENA',
    supportAmount: 'Acordado voluntariamente con la entidad receptora',
    idealFor: 'Aprendices interesados en impacto social, comunitario o del sector público.',
  },
  {
    id: 'monitoria',
    name: 'Monitoría Institucional SENA',
    badge: 'Mérito Académico',
    description: 'Apoyo pedagógico o técnico a instructores y centros de formación en ambientes de aprendizaje, laboratorios o proyectos institucionales.',
    duration: 'Hasta 6 meses con resolución del Centro',
    coverage: 'ARL gestionada por el SENA',
    supportAmount: 'Estímulo económico fijado por resolución SENA (50% SMMLV)',
    idealFor: 'Aprendices destacados académicamente con vocación docente o de apoyo técnico.',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'caso-1',
    title: 'Dilema de Plagio en el Proyecto Formativo',
    category: 'Faltas Académicas',
    situation: 'Durante la entrega de la fase de Ejecución del proyecto formativo, el equipo de Andrés encuentra en internet un documento idéntico al solicitado y decide copiarlo textualmente sin citar al autor para no retrasarse en la fecha de cierre de la plataforma.',
    options: [
      {
        id: 'opt-1a',
        text: 'Entregar el documento copiado porque lo importante es cumplir el plazo de la plataforma.',
        isCorrect: false,
        consequence: 'Constituye una infracción grave tipificada expresamente en las prohibiciones del Acuerdo 0009 de 2024 (Artículo 9), acarreando activación del Comité de Evaluación y Seguimiento y posibles medidas sancionatorias.',
        articleReference: 'Acuerdo 0009 de 2024 · Cap. III, Art. 9 (Prohibición No. 3: Plagio) y Cap. V, Arts. 41 y 47.',
      },
      {
        id: 'opt-1b',
        text: 'Citar adecuadamente las fuentes consultadas bajo normas APA, adaptar los conceptos al contexto real de su proyecto y solicitar asesoría técnica al instructor.',
        isCorrect: true,
        consequence: '¡Excelente decisión! Promueve la honestidad institucional, respeta la propiedad intelectual y cumple con los 24 deberes del aprendiz consagrados en el Artículo 8.',
        articleReference: 'Acuerdo 0009 de 2024 · Cap. III, Art. 8 (Deberes del Aprendiz: Propiedad intelectual y originalidad).',
      },
      {
        id: 'opt-1c',
        text: 'Pagar a un tercero para que elabore el informe y cambiarle solo los nombres de los integrantes.',
        isCorrect: false,
        consequence: 'Es una falta gravísima que implica suplantación y falsificación documental, expresamente sancionable con cancelación de matrícula (Art. 47).',
        articleReference: 'Acuerdo 0009 de 2024 · Cap. III, Art. 9 y Cap. V, Arts. 42 y 47 (Cancelación de Matrícula).',
      },
    ],
  },
  {
    id: 'caso-2',
    title: 'Uso de Elementos de Protección Personal (EPP) y Carné',
    category: 'Seguridad',
    situation: 'Camila ingresa al taller de mecanizado o laboratorio de biotecnología sin sus gafas de seguridad, botas dieléctricas ni el carné institucional visible, argumentando que solo va a hacer una pregunta de dos minutos a su instructor.',
    options: [
      {
        id: 'opt-2a',
        text: 'Ingresar rápidamente porque dos minutos no representan ningún peligro en un taller.',
        isCorrect: false,
        consequence: 'Pone en riesgo inminente su integridad física y la de sus compañeros, e infringe los deberes de Seguridad y Salud en el Trabajo.',
        articleReference: 'Acuerdo 0009 de 2024 · Cap. III, Art. 8 (Deberes del Aprendiz: Normas de SST y porte de carné institucional).',
      },
      {
        id: 'opt-2b',
        text: 'Colocarse la totalidad de los EPP exigidos para el ambiente y portar el carné institucional visible antes de cruzar la línea de seguridad.',
        isCorrect: true,
        consequence: '¡Correcto! La seguridad en el SENA es una cultura innegociable. El carné identifica al aprendiz y los EPP salvan vidas.',
        articleReference: 'Acuerdo 0009 de 2024 · Cap. III, Art. 8 (Cumplimiento de normas de SST en ambientes de formación).',
      },
      {
        id: 'opt-2c',
        text: 'Pedirle a un compañero que le preste sus gafas mientras el compañero opera la máquina.',
        isCorrect: false,
        consequence: 'Deja desprotegido a su compañero que está en zona de riesgo mecánico o químico, generando un riesgo doble en el ambiente formativo.',
        articleReference: 'Acuerdo 0009 de 2024 · Cap. I, Art. 3 y Cap. III, Art. 8.',
      },
    ],
  },
  {
    id: 'caso-3',
    title: 'Inasistencia Justificada por Causa Médica',
    category: 'Derechos',
    situation: 'Julián sufre una urgencia médica que le impide asistir durante tres días hábiles a sus clases presenciales y a las entregas de evidencias programadas en la plataforma.',
    options: [
      {
        id: 'opt-3a',
        text: 'No avisar a nadie y esperar a que el instructor le pregunte la semana siguiente qué le pasó.',
        isCorrect: false,
        consequence: 'Tres días hábiles continuos de inasistencia injustificada activan el procedimiento por deserción establecido en los Artículos 30 y 31 del Acuerdo 0009 de 2024.',
        articleReference: 'Acuerdo 0009 de 2024 · Cap. IV, Arts. 30 y 31 (Deserción y Procedimiento por deserción).',
      },
      {
        id: 'opt-3b',
        text: 'Radicar la incapacidad médica formal ante la coordinación académica y su instructor dentro de los plazos reglamentarios para registrar incumplimiento justificado y concertar plan de mejoramiento.',
        isCorrect: true,
        consequence: '¡Conducta impecable! El aprendiz ejerce su derecho al debido proceso y aplica la figura de incumplimiento justificado conforme al Artículo 28.',
        articleReference: 'Acuerdo 0009 de 2024 · Cap. IV, Art. 28 (Incumplimiento justificado) y Art. 35 (Acompañamiento evaluativo).',
      },
      {
        id: 'opt-3c',
        text: 'Enviar un mensaje informal de WhatsApp a un compañero para que le diga al instructor de palabra.',
        isCorrect: false,
        consequence: 'Las justificaciones de inasistencia requieren trámite documental formal ante el Centro (incapacidad EPS o fuerza mayor comprobable).',
        articleReference: 'Acuerdo 0009 de 2024 · Cap. IV, Arts. 16, 17 y 28.',
      },
    ],
  },
  {
    id: 'caso-4',
    title: 'Convivencia y Respeto en Espacios Virtuales (Zajuna / Teams)',
    category: 'Faltas Disciplinarias',
    situation: 'En el foro de debate técnico de la ficha, un compañero expresa una postura metodológica diferente sobre el proyecto. David responde con insultos, memes denigrantes y descalificaciones personales.',
    options: [
      {
        id: 'opt-4a',
        text: 'Justificar los insultos diciendo que en redes sociales y ambientes virtuales la libertad de expresión es total.',
        isCorrect: false,
        consequence: 'El Acuerdo 0009 de 2024 rige con el mismo rigor en ambientes presenciales y virtuales. La discriminación y la agresión están expresamente prohibidas en el Artículo 9.',
        articleReference: 'Acuerdo 0009 de 2024 · Cap. III, Art. 9 (Prohibición: Discriminación y violencia en cualquier medio).',
      },
      {
        id: 'opt-4b',
        text: 'Promover el debate respetuoso con argumentos técnicos, reconociendo el valor de la diversidad de ideas y los principios orientadores del SENA.',
        isCorrect: true,
        consequence: '¡Brillante! La dignidad, la inclusión y la solidaridad son principios orientadores del Acuerdo 0009 de 2024 (Artículo 3).',
        articleReference: 'Acuerdo 0009 de 2024 · Cap. I, Art. 3 (Principios Orientadores) y Cap. II, Art. 5 (Trato digno e incluyente).',
      },
    ],
  },
];

export const WELLNESS_DIMENSIONS = [
  {
    title: 'Salud Física y Mental',
    iconName: 'HeartPulse',
    desc: 'Atención primaria en enfermería, jornadas de salud preventiva, tamizaje visual, salud sexual y reproductiva, y orientación psicológica.',
  },
  {
    title: 'Deporte y Recreación',
    iconName: 'Trophy',
    desc: 'Torneos intercentros, juegos zonales y nacionales SENA, actividad física dirigida, pausas activas y fomento de hábitos de vida saludable.',
  },
  {
    title: 'Arte y Cultura',
    iconName: 'Palette',
    desc: 'Talleres de danzas tradicionales colombianas, teatro, música, literatura, festivales artísticos de aprendices y preservación de patrimonio.',
  },
  {
    title: 'Liderazgo y Convivencia',
    iconName: 'Users',
    desc: 'Elección de voceros de ficha, representantes de aprendices ante el Consejo Directivo, campamentos de liderazgo y mediación de conflictos.',
  },
  {
    title: 'Apoyos de Sostenimiento',
    iconName: 'BadgeDollarSign',
    desc: 'Apoyos regulares para transporte y alimentación, Fondo de la Industria de la Construcción (FIC), y convenios con entes territoriales.',
  },
  {
    title: 'Equidad e Inclusión',
    iconName: 'Sparkles',
    desc: 'Atención diferencial a poblaciones étnicas (indígenas, afrocolombianas, ROM), personas con discapacidad, víctimas del conflicto y enfoque de género.',
  },
  {
    title: 'Consejería y Acompañamiento',
    iconName: 'UserCheck',
    desc: 'Prevención de la deserción mediante orientación psicopedagógica personalizada a aprendices con dificultades sociofamiliares.',
  },
  {
    title: 'Promoción Socioeconómica',
    iconName: 'TrendingUp',
    desc: 'Campañas de alimentación complementaria, bonos de transporte y articulación con redes de apoyo social de cada municipio.',
  },
];

export const ECOSYSTEM_SERVICES = [
  {
    title: 'Agencia Pública de Empleo (APE)',
    tagline: 'Intermediación Laboral Gratuita e Indiscriminada',
    desc: 'Plataforma oficial que conecta aprendices y egresados SENA con las vacantes reales del sector empresarial colombiano, con talleres de hoja de vida y entrevistas.',
  },
  {
    title: 'Fondo Emprender',
    tagline: 'Capital Semilla Condonable',
    desc: 'El fondo de capital semilla más grande del país para aprendices y emprendedores colombianos que desean crear empresas innovadoras y sostenibles.',
  },
  {
    title: 'SENNOVA',
    tagline: 'Investigación, Desarrollo Tecnológico e Innovación',
    desc: 'Sistema que vincula aprendices en semilleros de investigación aplicada, desarrollo de patentes y prototipado tecnológico de vanguardia.',
  },
  {
    title: 'Tecnoparque y Tecnoacademias',
    tagline: 'Laboratorios de Alta Tecnología',
    desc: 'Espacios abiertos de aceleración técnica con equipos de última generación en biotecnología, nanotecnología, electrónica, software y realidad virtual.',
  },
];

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'Aprendiz',
    category: 'Institucional',
    definition: 'Persona matriculada en un programa de formación profesional integral en el SENA, protagonista de su propio aprendizaje y gestor de su proyecto de vida.',
  },
  {
    term: 'Ficha de Caracterización',
    acronym: 'Ficha',
    category: 'Pedagógico',
    definition: 'Código numérico único que identifica la cohorte o grupo específico de aprendices matriculados en un programa de formación y centro determinado.',
  },
  {
    term: 'FPI',
    acronym: 'Formación Profesional Integral',
    category: 'Pedagógico',
    definition: 'Proceso teórico-práctico que orienta el desarrollo de conocimientos técnicos, tecnológicos y de actitudes y valores para el desarrollo humano y la convivencia social.',
  },
  {
    term: 'Resultado de Aprendizaje',
    acronym: 'RAP',
    category: 'Pedagógico',
    definition: 'Enunciados que describen lo que se espera que el aprendiz sea capaz de saber, comprender y demostrar en términos de competencias al finalizar una actividad de aprendizaje.',
  },
  {
    term: 'Juicio Evaluativo',
    category: 'Pedagógico',
    definition: 'Dictamen emitido por el instructor respecto al logro de un RAP: "Aprobado (A)" cuando alcanza el nivel de competencia requerido, o "Por Mejorar / No Aprobado" con plan de mejora.',
  },
  {
    term: 'Sofía Plus / Zajuna',
    category: 'Tecnológico',
    definition: 'Sistemas de información institucional del SENA para la administración educativa (Sofía Plus) y el ambiente virtual de aprendizaje LMS (Zajuna), donde se gestionan evidencias y calificaciones.',
  },
  {
    term: 'Etapa Lectiva',
    category: 'Pedagógico',
    definition: 'Período en el cual el aprendiz desarrolla conocimientos y competencias en los ambientes de aprendizaje del centro de formación, mediante proyectos y actividades guiadas.',
  },
  {
    term: 'Etapa Productiva',
    category: 'Pedagógico',
    definition: 'Período en el cual el aprendiz aplica, complementa y consolida sus competencias en situaciones reales del trabajo a través de contrato de aprendizaje, proyecto productivo u otra modalidad.',
  },
  {
    term: 'Reglamento del Aprendiz (Acuerdo 0009 de 2024)',
    category: 'Normativo',
    definition: 'Norma vigente expedida el 5 de noviembre de 2024 que rige la formación integral del SENA (deroga los Acuerdos 07 de 2012, 02 de 2014, 06 de 2023 y 02 de 2024). Consta de 5 capítulos, 53 artículos, 24 derechos, 24 deberes y 14 prohibiciones.',
  },
  {
    term: 'Principios Orientadores (Art. 3)',
    category: 'Normativo',
    definition: 'Pilares éticos del Acuerdo 0009 de 2024: Autonomía, Dignidad, Inclusión, Enfoque diferencial, Enfoque territorial, Participación, Desarrollo sostenible y Solidaridad.',
  },
  {
    term: 'Novedades de Formación (Art. 18)',
    category: 'Normativo',
    definition: 'Trámites oficiales contemplados en el Acuerdo 0009 de 2024: Traslado, Aplazamiento, Reintegro y Retiro voluntario.',
  },
  {
    term: 'Deserción (Art. 30 y 31)',
    category: 'Normativo',
    definition: 'Suspensión injustificada del proceso formativo cuando el aprendiz no asiste por 3 días hábiles consecutivos o incumple injustificadamente sus evidencias sin soporte formal.',
  },
  {
    term: 'Comité de Evaluación y Seguimiento (Art. 48)',
    category: 'Normativo',
    definition: 'Instancia colegiada encargada de asesorar a la Subdirección de Centro en el análisis del desempeño de aprendices, garantizando el debido proceso y proponiendo planes de mejoramiento o medidas disciplinarias.',
  },
];

export const INDUCTION_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    station: 'identidad',
    question: '¿En qué año fue fundado el SENA y quién fue su fundador principal?',
    options: [
      '1972 por Carlos Lleras Restrepo',
      '1957 por Rodolfo Martínez Tono',
      '1985 por Gabriel García Márquez',
      '1960 por Alfonso López Michelsen',
    ],
    correctIndex: 1,
    explanation: 'El SENA fue creado en 1957 por iniciativa del economista y visionario Rodolfo Martínez Tono, mediante el Decreto Ley 118 de 1957.',
  },
  {
    id: 'q2',
    station: 'identidad',
    question: '¿Qué sectores económicos representan los tres elementos del escudo del SENA?',
    options: [
      'Gobierno, Milicia y Diplomacia',
      'Industria/Construcción (piñón), Comercio/Servicios (caduceo) y Agropecuario (café)',
      'Tecnología de la información, Petróleo y Transporte aéreo',
      'Artes plásticas, Cine y Deportes olímpicos',
    ],
    correctIndex: 1,
    explanation: 'El escudo del SENA sintetiza los tres pilares económicos colombianos: el piñón (industria), el caduceo (comercio y servicios) y la rama de café (sector agropecuario).',
  },
  {
    id: 'q3',
    station: 'identidad',
    question: '¿Qué representa el fondo blanco de la bandera del SENA?',
    options: [
      'La riqueza mineral de las cordilleras',
      'La paz, la tranquilidad, la libertad y la transparencia ética',
      'El papel sobre el cual se redactan los planos técnicos',
      'La neutralidad política ante los sindicatos',
    ],
    correctIndex: 1,
    explanation: 'El blanco de la bandera SENA simboliza la paz, la transparencia y la serenidad sobre la que se forja el futuro de la juventud trabajadora.',
  },
  {
    id: 'q4',
    station: 'fpi',
    question: '¿Cuáles son las tres dimensiones del saber en la Formación Profesional Integral (FPI)?',
    options: [
      'Pensar, Escribir y Facturar',
      'Saber (conocimiento), Saber Hacer (habilidad práctica) y Saber Ser (actitud y ética)',
      'Memorizar, Repetir y Competir',
      'Escuchar, Callar y Obedecer',
    ],
    correctIndex: 1,
    explanation: 'La Formación Profesional Integral del SENA equilibra el Saber cognitivo, el Saber Hacer procedimental y el Saber Ser humano y ético.',
  },
  {
    id: 'q5',
    station: 'fpi',
    question: '¿Cuál de las siguientes NO es una modalidad válida para realizar la Etapa Productiva?',
    options: [
      'Contrato de Aprendizaje con empresa patrocinadora',
      'Proyecto Productivo o investigación aplicada SENNOVA',
      'Pasantía en entidad pública o privada',
      'Pagar una tarifa monetaria para omitir la práctica laboral',
    ],
    correctIndex: 3,
    explanation: 'La etapa productiva no se puede comprar ni omitir. Es un requisito pedagógico legal indispensable para la titulación en el SENA.',
  },
  {
    id: 'q6',
    station: 'reglamento',
    question: '¿Cuántos días hábiles continuos de inasistencia injustificada dan lugar a la declaratoria de deserción según el Acuerdo 0009 de 2024 (Art. 30)?',
    options: [
      '15 días continuos',
      '3 días hábiles continuos sin justificación formal',
      '30 días hábiles',
      '1 semestre completo',
    ],
    correctIndex: 1,
    explanation: 'El Artículo 30 del Acuerdo 0009 de 2024 estipula que 3 días hábiles consecutivos de inasistencia injustificada activan el procedimiento por deserción.',
  },
  {
    id: 'q7',
    station: 'bienestar',
    question: '¿Qué servicio del ecosistema SENA ofrece capital semilla condonable para crear nuevas empresas sostenibles?',
    options: [
      'Agencia Pública de Empleo (APE)',
      'Fondo Emprender',
      'Biblioteca Digital SENA',
      'Zajuna LMS',
    ],
    correctIndex: 1,
    explanation: 'El Fondo Emprender es el fondo del SENA que provee recursos condonables para financiar iniciativas empresariales de aprendices y egresados.',
  },
  {
    id: 'q8',
    station: 'reglamento',
    question: 'Bajo el Acuerdo 0009 de 2024 (Art. 45 y 46), ¿cuáles son las medidas formativas pedagógicas antes de cualquier sanción?',
    options: [
      'Expulsión inmediata y reporte penal',
      'Llamado de atención y Plan de mejoramiento (académico o disciplinario)',
      'Cancelación de matrícula directa por 5 años',
      'Multa económica al grupo familiar',
    ],
    correctIndex: 1,
    explanation: 'El Artículo 46 del Acuerdo 0009 de 2024 consagra como medidas formativas el Llamado de atención y el Plan de mejoramiento (tanto académicos como disciplinarios), preservando el enfoque pedagógico y el debido proceso.',
  },
  {
    id: 'q9',
    station: 'reglamento',
    question: '¿Cuál es la norma vigente que rige el Reglamento del Aprendiz SENA, derogando el Acuerdo 07 de 2012?',
    options: [
      'Acuerdo 0009 de 2024 (5 capítulos y 53 artículos)',
      'Decreto 1072 de 2015',
      'Ley 789 de 2002',
      'Resolución 100 de 1990',
    ],
    correctIndex: 0,
    explanation: 'El Acuerdo 0009 del 5 de noviembre de 2024 es el nuevo estatuto marco del Aprendiz SENA, estructurado en 5 capítulos, 53 artículos, 24 derechos, 24 deberes y 14 prohibiciones.',
  },
];
