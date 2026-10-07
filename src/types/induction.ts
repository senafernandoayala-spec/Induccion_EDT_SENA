export type StationId = 'identidad' | 'fpi' | 'reglamento' | 'bienestar' | 'evaluacion';

export interface ApprenticeProfile {
  fullName: string;
  documentType: 'CC' | 'TI' | 'CE' | 'PEP' | 'PPT' | 'PAS';
  documentNumber: string;
  regional: string;
  trainingCenter: string;
  programName: string;
  cohortNumber: string; // Número de Ficha
}

export interface QuizQuestion {
  id: string;
  station: StationId;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: 'Derechos' | 'Deberes' | 'Faltas Disciplinarias' | 'Faltas Académicas' | 'Seguridad';
  situation: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    consequence: string;
    articleReference: string;
  }[];
}

export interface GlossaryTerm {
  term: string;
  acronym?: string;
  definition: string;
  category: 'Institucional' | 'Pedagógico' | 'Normativo' | 'Tecnológico';
}

export interface ProductiveMode {
  id: string;
  name: string;
  description: string;
  duration: string;
  coverage: string;
  supportAmount: string;
  idealFor: string;
  badge: string;
}

export interface SubmissionRecord {
  id: string;
  timestamp: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  cohortNumber: string;
  programName: string;
  trainingCenter: string;
  regional: string;
  scorePercent: number;
  evaluationResult: string;
  certificateCode: string;
  answersSummary?: string;
  syncedToDrive: boolean;
  gamifiedScore?: number;
  timeSpentSeconds?: number;
  timeFormatted?: string;
  maxStreak?: number;
  badges?: string[];
  detailedAnswers?: Record<
    string,
    {
      question: string;
      selected: string;
      correct: string;
      isCorrect: boolean;
    }
  >;
}

export interface ChapterQuizQuestion {
  id: string;
  chapterId: string;
  chapterName: string;
  articleReference: string;
  question: string;
  options: string[];
  correctIndex: number;
  positiveFeedback: string;
  formativeFeedback: {
    mistakeAnalysis: string;
    normativeBasis: string;
    pedagogicalAdvice: string;
  };
  explanation: string;
}

export interface RegulationAgreement {
  documento: {
    tipo: string;
    numero: string;
    anio: number;
    titulo: string;
    entidad: string;
    fecha_publicacion: string;
    deroga: string[];
  };
  capitulos: {
    id: string;
    nombre: string;
    articulos: {
      articulo: number;
      titulo: string;
      contenido?: Record<string, string>;
      principios?: string[];
      cantidad_derechos?: number;
      derechos_principales?: string[];
      tipos?: any;
      cantidad_deberes?: number;
      cantidad_prohibiciones?: number;
      prohibiciones_destacadas?: string[];
      novedades?: string[];
      etapas?: string[];
      juicios?: string[];
      categorias?: string[];
      equipos?: string[];
      instancias?: string[];
    }[];
  }[];
  estadisticas: {
    total_capitulos: number;
    total_articulos: number;
    derechos_aprendiz: number;
    deberes_aprendiz: number;
    prohibiciones: number;
  };
}

