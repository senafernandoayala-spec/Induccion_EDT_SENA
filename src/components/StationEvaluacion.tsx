import React, { useState, useEffect, useRef } from 'react';
import { REGLAMENTO_CHAPTERS_QUIZ } from '../data/reglamentoQuizData';
import { ApprenticeProfile, SubmissionRecord, ChapterQuizQuestion } from '../types/induction';

interface StationEvaluacionProps {
  onComplete: () => void;
  isCompleted: boolean;
  onOpenCertificate: () => void;
  onRecordSubmission?: (record: Omit<SubmissionRecord, 'id' | 'syncedToDrive'>) => void;
  apprenticeProfile: ApprenticeProfile;
  onUpdateProfile: (profile: Partial<ApprenticeProfile>) => void;
  submissions?: SubmissionRecord[];
}

type QuizStage = 'identificacion' | 'quiz' | 'resultados' | 'ranking_vista';
type ResultsTab = 'resumen' | 'revision' | 'ranking';

const DOCUMENT_TYPES = [
  { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
  { value: 'TI', label: 'Tarjeta de Identidad (TI)' },
  { value: 'CE', label: 'Cédula de Extranjería (CE)' },
  { value: 'PPT', label: 'Permiso por Protección Temporal (PPT)' },
  { value: 'PEP', label: 'Permiso Especial de Permanencia (PEP)' },
  { value: 'PAS', label: 'Pasaporte (PAS)' },
];

export const StationEvaluacion: React.FC<StationEvaluacionProps> = ({
  onComplete,
  isCompleted,
  onOpenCertificate,
  onRecordSubmission,
  apprenticeProfile,
  onUpdateProfile,
  submissions = [],
}) => {
  // Navigation / stage state
  const [stage, setStage] = useState<QuizStage>('identificacion');
  const [resultsTab, setResultsTab] = useState<ResultsTab>('resumen');

  // Apprentice local form state for identification stage
  const [editProfile, setEditProfile] = useState<ApprenticeProfile>({ ...apprenticeProfile });
  const [profileValidationMsg, setProfileValidationMsg] = useState<string | null>(null);

  // Quiz progression state
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [answeredState, setAnsweredState] = useState<Record<string, boolean>>({});

  // Question answering & feedback interaction
  const [tempSelectedOption, setTempSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  // Gamification & Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [gamifiedScore, setGamifiedScore] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [lastQuestionPoints, setLastQuestionPoints] = useState<number>(0);

  // Review filter
  const [reviewFilter, setReviewFilter] = useState<'all' | 'errors' | 'I' | 'II' | 'III' | 'IV' | 'V'>('all');
  const [rankingFilterCohort, setRankingFilterCohort] = useState<string>('all');

  // Question timing for speed bonus
  const questionStartTimestamp = useRef<number>(Date.now());
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const questions: ChapterQuizQuestion[] = REGLAMENTO_CHAPTERS_QUIZ;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIdx];

  // Keep editProfile synced if apprenticeProfile updates from outside
  useEffect(() => {
    setEditProfile({ ...apprenticeProfile });
  }, [apprenticeProfile]);

  // Stopwatch effect
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  // Format seconds to mm:ss
  const formatTime = (totalSecs: number): string => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to start the quiz
  const handleStartQuiz = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editProfile.fullName.trim() || !editProfile.documentNumber.trim() || !editProfile.cohortNumber.trim()) {
      setProfileValidationMsg('Por favor complete su nombre, documento y número de ficha para iniciar.');
      return;
    }
    setProfileValidationMsg(null);
    onUpdateProfile(editProfile);

    // Reset quiz states
    setCurrentIdx(0);
    setSelectedAnswers({});
    setAnsweredState({});
    setTempSelectedOption(null);
    setShowFeedback(false);
    setLastAnswerCorrect(null);
    setElapsedSeconds(0);
    setGamifiedScore(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setLastQuestionPoints(0);

    // Start timer
    questionStartTimestamp.current = Date.now();
    setIsTimerRunning(true);
    setStage('quiz');
  };

  // Select an option during active question
  const handleSelectOption = (optIdx: number) => {
    if (showFeedback) return;
    setTempSelectedOption(optIdx);
  };

  // Confirm answer and trigger immediate positive or formative feedback with animations
  const handleConfirmAnswer = () => {
    if (tempSelectedOption === null || showFeedback) return;

    const isCorrect = tempSelectedOption === currentQuestion.correctIndex;
    const timeTakenOnQuestionSec = Math.max(1, Math.round((Date.now() - questionStartTimestamp.current) / 1000));

    // Save answered state
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: tempSelectedOption,
    }));
    setAnsweredState((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));

    // Calculate gamified score points
    let pointsEarned = 0;
    let nextStreak = currentStreak;

    if (isCorrect) {
      nextStreak = currentStreak + 1;
      // Base points
      let basePts = 100;
      // Speed bonus
      let speedBonus = 0;
      if (timeTakenOnQuestionSec <= 10) speedBonus = 50;
      else if (timeTakenOnQuestionSec <= 20) speedBonus = 30;
      else if (timeTakenOnQuestionSec <= 30) speedBonus = 15;
      else speedBonus = 5;

      // Streak combo bonus
      let streakBonus = 0;
      if (nextStreak >= 5) streakBonus = 80;
      else if (nextStreak >= 4) streakBonus = 50;
      else if (nextStreak >= 3) streakBonus = 30;
      else if (nextStreak >= 2) streakBonus = 15;

      pointsEarned = basePts + speedBonus + streakBonus;
      setGamifiedScore((prev) => prev + pointsEarned);
      setCurrentStreak(nextStreak);
      if (nextStreak > maxStreak) {
        setMaxStreak(nextStreak);
      }
    } else {
      nextStreak = 0;
      setCurrentStreak(0);
      pointsEarned = 0;
    }

    setLastQuestionPoints(pointsEarned);
    setLastAnswerCorrect(isCorrect);
    setShowFeedback(true);
  };

  // Advance to next question or conclude evaluation
  const handleNextQuestion = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
      setTempSelectedOption(null);
      setShowFeedback(false);
      setLastAnswerCorrect(null);
      questionStartTimestamp.current = Date.now();
    } else {
      // Completed all questions
      handleFinishEvaluation();
    }
  };

  // Conclude evaluation, record submission, and transition to results
  const handleFinishEvaluation = () => {
    setIsTimerRunning(false);

    // Calculate score
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    const hasPassed = scorePercent >= 75;

    if (hasPassed) {
      onComplete();
    }

    // Determine earned badges
    const earnedBadges: string[] = [];
    if (scorePercent === 100) earnedBadges.push('Tirador de Élite (100% Aciertos)');
    if (scorePercent >= 90) earnedBadges.push('Precisión Quirúrgica');
    if (elapsedSeconds <= 300) earnedBadges.push('Guepardo Digital (<5 min)');
    if (maxStreak >= 5) earnedBadges.push(`Racha Imparable (${maxStreak} en línea)`);
    if (hasPassed) earnedBadges.push('Perito del Acuerdo 0009 de 2024');

    // Prepare detailed answers map
    const detailedMap: Record<
      string,
      { question: string; selected: string; correct: string; isCorrect: boolean }
    > = {};

    questions.forEach((q) => {
      const userSelected = selectedAnswers[q.id];
      detailedMap[q.id] = {
        question: `[${q.chapterName} · ${q.articleReference}] ${q.question}`,
        selected: userSelected !== undefined ? q.options[userSelected] : 'Sin responder',
        correct: q.options[q.correctIndex],
        isCorrect: userSelected === q.correctIndex,
      };
    });

    // Generate a deterministic and unique certificate code
    let hash = 0;
    const hashStr = `${editProfile.fullName}-${editProfile.documentNumber}-${editProfile.cohortNumber}`;
    for (let i = 0; i < hashStr.length; i++) {
      hash = (hash << 5) - hash + hashStr.charCodeAt(i);
      hash |= 0;
    }
    const codeSuffix = Math.abs(hash).toString(36).toUpperCase().padStart(5, 'X').substring(0, 5);
    const verificationCode = `SENA-IND-${editProfile.cohortNumber || '2026'}-${codeSuffix}`;

    const formattedTimeStr = formatTime(elapsedSeconds);

    if (onRecordSubmission) {
      onRecordSubmission({
        timestamp: new Date().toLocaleString('es-CO', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        fullName: editProfile.fullName,
        documentType: editProfile.documentType,
        documentNumber: editProfile.documentNumber,
        cohortNumber: editProfile.cohortNumber,
        programName: editProfile.programName,
        trainingCenter: editProfile.trainingCenter,
        regional: editProfile.regional,
        scorePercent,
        evaluationResult: hasPassed ? 'APROBADO (A)' : 'POR MEJORAR (D)',
        certificateCode: verificationCode,
        answersSummary: `${correctCount}/${totalQuestions} aciertos (${scorePercent}%) · ${gamifiedScore} pts · ${formattedTimeStr}`,
        gamifiedScore,
        timeSpentSeconds: elapsedSeconds,
        timeFormatted: formattedTimeStr,
        maxStreak,
        badges: earnedBadges,
        detailedAnswers: detailedMap,
      });
    }

    setStage('resultados');
    setResultsTab('resumen');
  };

  // Helper score counts
  const correctCount = Object.keys(selectedAnswers).reduce((acc, qId) => {
    const q = questions.find((item) => item.id === qId);
    return q && selectedAnswers[qId] === q.correctIndex ? acc + 1 : acc;
  }, 0);
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const hasPassed = scorePercent >= 75;

  // Chapter mapping for current question
  const currentChapterIndex = ['I', 'II', 'III', 'IV', 'V'].indexOf(currentQuestion?.chapterId || 'I') + 1;
  const currentQuestionInChapter = (currentIdx % 5) + 1;

  // Combined leaderboard list with current session included if evaluated
  const leaderboardList = [...submissions].sort((a, b) => {
    const scoreA = a.gamifiedScore ?? a.scorePercent * 25;
    const scoreB = b.gamifiedScore ?? b.scorePercent * 25;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return (a.timeSpentSeconds || 9999) - (b.timeSpentSeconds || 9999);
  });

  const availableCohorts = Array.from(new Set(leaderboardList.map((s) => s.cohortNumber).filter(Boolean)));
  const filteredLeaderboard = leaderboardList.filter((s) => {
    return rankingFilterCohort === 'all' || s.cohortNumber === rankingFilterCohort;
  });

  const handleExportRankingCSV = () => {
    const headers = [
      'Posicion',
      'Nombre Aprendiz',
      'Ficha',
      'Programa',
      'Puntaje Gamificado',
      'Precision %',
      'Tiempo',
      'Estado',
    ];
    const rows = filteredLeaderboard.map((item, idx) => [
      idx + 1,
      `"${item.fullName}"`,
      `"${item.cohortNumber}"`,
      `"${item.programName}"`,
      item.gamifiedScore ?? item.scorePercent * 25,
      `"${item.scorePercent}%"`,
      `"${item.timeFormatted || '00:00'}"`,
      `"${item.evaluationResult}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `SENA_Ranking_Induccion_Ficha_${rankingFilterCohort}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Estación 05</span>
            <span aria-hidden="true">·</span>
            <span>Reglamento del Aprendiz (Acuerdo 0009 de 2024)</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">Reto Gamificado</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Evaluación Oficial & Ranking Gamificado</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold font-mono border border-emerald-300">
              5 Secciones · 25 Preguntas
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Responde 5 preguntas de cada una de las secciones del Acuerdo 0009 de 2024. Obtén refuerzo positivo inmediato, análisis pedagógico de errores y acumula puntos en el ranking oficial de tu ficha por responder con precisión y velocidad.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {stage !== 'ranking_vista' ? (
            <button
              onClick={() => setStage('ranking_vista')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>🏆</span>
              <span>Ver Ranking</span>
            </button>
          ) : (
            <button
              onClick={() => setStage(selectedAnswers && Object.keys(selectedAnswers).length === totalQuestions ? 'resultados' : 'identificacion')}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>←</span>
              <span>Volver a Evaluación</span>
            </button>
          )}

          {isCompleted && (
            <button
              onClick={onOpenCertificate}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span>📜</span>
              <span>Mi Certificado</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. STAGE: IDENTIFICACIÓN Y REGISTRO DEL APRENDIZ         */}
      {/* ========================================================= */}
      {stage === 'identificacion' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formulario de Confirmación de Datos */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg border border-emerald-200 shadow-xs">
                📝
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Paso 1: Identificación y Registro del Aprendiz
                </h3>
                <p className="text-xs text-slate-500">
                  Estos datos quedarán asociados a tu evaluación, a la hoja de cálculo institucional y a tu Acta de Certificación.
                </p>
              </div>
            </div>

            <form onSubmit={handleStartQuiz} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Nombre Completo del Aprendiz *
                </label>
                <input
                  type="text"
                  required
                  value={editProfile.fullName}
                  onChange={(e) => setEditProfile({ ...editProfile, fullName: e.target.value })}
                  placeholder="Ej. Carlos Andrés Gómez Pardo"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-emerald-600 focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Tipo de Documento *
                  </label>
                  <select
                    value={editProfile.documentType}
                    onChange={(e) => setEditProfile({ ...editProfile, documentType: e.target.value as any })}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-emerald-600 focus:bg-white transition-colors cursor-pointer"
                  >
                    {DOCUMENT_TYPES.map((dt) => (
                      <option key={dt.value} value={dt.value}>
                        {dt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    required
                    value={editProfile.documentNumber}
                    onChange={(e) => setEditProfile({ ...editProfile, documentNumber: e.target.value })}
                    placeholder="Ej. 1024567890"
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-emerald-600 focus:bg-white font-mono transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Número de Ficha *
                  </label>
                  <input
                    type="text"
                    required
                    value={editProfile.cohortNumber}
                    onChange={(e) => setEditProfile({ ...editProfile, cohortNumber: e.target.value })}
                    placeholder="Ej. 2987410"
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-emerald-600 focus:bg-white font-mono transition-colors"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Programa de Formación
                  </label>
                  <input
                    type="text"
                    value={editProfile.programName}
                    onChange={(e) => setEditProfile({ ...editProfile, programName: e.target.value })}
                    placeholder="Ej. Análisis y Desarrollo de Software"
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-emerald-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Centro de Formación
                  </label>
                  <input
                    type="text"
                    value={editProfile.trainingCenter}
                    onChange={(e) => setEditProfile({ ...editProfile, trainingCenter: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-emerald-600 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Regional SENA
                  </label>
                  <input
                    type="text"
                    value={editProfile.regional}
                    onChange={(e) => setEditProfile({ ...editProfile, regional: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-emerald-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {profileValidationMsg && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  ⚠️ {profileValidationMsg}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>🚀 Iniciar Reto Gamificado del Reglamento</span>
                  <span className="text-xs bg-emerald-900/40 px-2 py-0.5 rounded font-mono">25 Preguntas</span>
                </button>
              </div>
            </form>
          </div>

          {/* Información del Reto & Dinámica de Juego */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-sm">
                  ⚡
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Mecánica del Reto Gamificado</h4>
                  <p className="text-xs text-slate-400">Puntajes por velocidad, precisión y racha</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 pt-1">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">🎯</span>
                  <div>
                    <strong className="text-white block">+100 pts Base por Acierto</strong>
                    Responde correctamente aplicando los artículos del Acuerdo 0009 de 2024.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold shrink-0">⏱️</span>
                  <div>
                    <strong className="text-white block">Bonus de Velocidad (Hasta +50 pts)</strong>
                    El cronómetro registrará tu tiempo. Responder en menos de 10 segundos da bonificación máxima.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-2.5">
                  <span className="text-orange-400 font-bold shrink-0">🔥</span>
                  <div>
                    <strong className="text-white block">Multiplicador de Racha (Streak)</strong>
                    Encadena respuestas correctas seguidas para desbloquear bonificaciones acumulativas.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-2.5">
                  <span className="text-sky-400 font-bold shrink-0">💡</span>
                  <div>
                    <strong className="text-white block">Refuerzo Pedagógico Inmediato</strong>
                    Si te equivocas, la plataforma te explicará pedagógicamente en qué fallaste y qué artículo consultar.
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Aprobación: ≥ 75% (19/25 aciertos)</span>
                <span className="font-mono text-emerald-400">Acuerdo 0009 de 2024</span>
              </div>
            </div>

            {/* Vista previa del Top 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>🏆</span>
                  <span>Podio Actual de la Plataforma</span>
                </h4>
                <button
                  onClick={() => setStage('ranking_vista')}
                  className="text-[11px] text-emerald-700 font-semibold hover:underline cursor-pointer"
                >
                  Ver tabla completa →
                </button>
              </div>

              <div className="space-y-2">
                {leaderboardList.slice(0, 3).map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                      </span>
                      <div>
                        <span className="font-semibold text-slate-900 block truncate max-w-[150px]">
                          {item.fullName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Ficha {item.cohortNumber}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-800 font-mono block">
                        {item.gamifiedScore ?? item.scorePercent * 25} pts
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.timeFormatted || '03:45'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. STAGE: RETO DE EVALUACIÓN GAMIFICADO ACTIVO           */}
      {/* ========================================================= */}
      {stage === 'quiz' && currentQuestion && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
          {/* Barra Superior Gamificada: Cronómetro, Racha, Puntos y Capítulo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            {/* Sección & Capítulo */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wide">
                  Sección {currentChapterIndex} de 5 · {currentQuestion.chapterName}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Pregunta {currentQuestionInChapter}/5 de la sección
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-700">
                Pregunta global <span className="font-bold text-slate-900">{currentIdx + 1}</span> de {totalQuestions}
              </div>
            </div>

            {/* Métricas de Juego en Vivo */}
            <div className="flex items-center gap-3">
              {/* Cronómetro en tiempo real */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-mono font-bold text-xs shadow-2xs">
                <span className="animate-pulse text-emerald-600">⏱️</span>
                <span>{formatTime(elapsedSeconds)}</span>
              </div>

              {/* Racha (Streak) */}
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                currentStreak >= 3
                  ? 'bg-amber-500 text-white border-amber-600 animate-pulse shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}>
                <span>🔥</span>
                <span>Racha: {currentStreak}</span>
              </div>

              {/* Puntaje Gamificado acumulado */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-mono font-bold text-xs shadow-xs">
                <span>⭐</span>
                <span>{gamifiedScore} pts</span>
              </div>
            </div>
          </div>

          {/* Barra de Progreso de las 25 preguntas */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
              {Array.from({ length: 5 }).map((_, cIdx) => (
                <div
                  key={cIdx}
                  className={`h-full flex-1 border-r border-white last:border-none transition-all duration-300 ${
                    currentChapterIndex > cIdx + 1
                      ? 'bg-emerald-600'
                      : currentChapterIndex === cIdx + 1
                      ? 'bg-emerald-400'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Cap I: Definiciones</span>
              <span>Cap II: Derechos</span>
              <span>Cap III: Deberes</span>
              <span>Cap IV: Ingreso</span>
              <span>Cap V: Sanciones</span>
            </div>
          </div>

          {/* Enunciado de la Pregunta */}
          <div className="space-y-2 py-1">
            <div className="inline-block text-[11px] font-bold text-slate-500 font-mono bg-slate-100 px-2.5 py-0.5 rounded">
              Norma: {currentQuestion.articleReference}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Opciones de Respuesta */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((optText, optIdx) => {
              const isSelected = tempSelectedOption === optIdx;
              const isConfirmed = showFeedback;
              const isCorrectAnswer = optIdx === currentQuestion.correctIndex;
              const isUserChoice = selectedAnswers[currentQuestion.id] === optIdx;

              // Color classes based on state
              let optionStyles = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';
              let badgeStyles = 'border-slate-300 text-slate-500';

              if (!isConfirmed && isSelected) {
                optionStyles = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-medium ring-1 ring-emerald-600';
                badgeStyles = 'border-emerald-700 bg-emerald-700 text-white';
              } else if (isConfirmed) {
                if (isCorrectAnswer) {
                  optionStyles = 'bg-emerald-50/90 border-emerald-600 text-emerald-950 font-bold ring-2 ring-emerald-500 animate-pop';
                  badgeStyles = 'border-emerald-700 bg-emerald-700 text-white';
                } else if (isUserChoice && !isCorrectAnswer) {
                  optionStyles = 'bg-rose-50 border-rose-500 text-rose-950 font-medium line-through opacity-85';
                  badgeStyles = 'border-rose-600 bg-rose-600 text-white';
                } else {
                  optionStyles = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={showFeedback}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${optionStyles}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full border text-xs flex items-center justify-center shrink-0 font-semibold mt-0.5 ${badgeStyles}`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="text-xs sm:text-sm flex-1">{optText}</span>
                  {isConfirmed && isCorrectAnswer && (
                    <span className="text-emerald-700 font-bold text-sm shrink-0">✓ Correcta</span>
                  )}
                  {isConfirmed && isUserChoice && !isCorrectAnswer && (
                    <span className="text-rose-600 font-bold text-sm shrink-0">✗ Tu elección</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ========================================================= */}
          {/* REFUERZO POSITIVO O FORMATIVO TRAS CONFIRMAR             */}
          {/* ========================================================= */}
          {showFeedback && (
            <div className="pt-2">
              {lastAnswerCorrect ? (
                /* REFUERZO POSITIVO */
                <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 space-y-3 animate-pop shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                      <span className="text-xl">🎉</span>
                      <span>¡EXCELENTE RAZONAMIENTO! RESPUESTA CORRECTA</span>
                    </div>
                    <div className="px-3 py-1 bg-emerald-700 text-white font-mono font-bold text-xs rounded-lg shadow-2xs">
                      +{lastQuestionPoints} pts ganados
                    </div>
                  </div>

                  <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                    {currentQuestion.positiveFeedback}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-200 text-[11px] text-emerald-800">
                    <span className="font-semibold">
                      Sustento: {currentQuestion.explanation}
                    </span>
                    {currentStreak >= 2 && (
                      <span className="bg-emerald-200/80 px-2 py-0.5 rounded font-bold font-mono">
                        🔥 Racha activa: x{currentStreak} seguidas
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                /* REFUERZO FORMATIVO Y ANÁLISIS DE ERROR */
                <div className="p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-500 space-y-3.5 animate-shake shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                      <span className="text-xl">💡</span>
                      <span>REFUERZO FORMATIVO · ANÁLISIS PEDAGÓGICO DE TU RESPUESTA</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-amber-800 bg-amber-200/70 px-2.5 py-0.5 rounded-lg">
                      0 pts · Oportunidad de aprendizaje
                    </span>
                  </div>

                  {/* Tres cajas pedagógicas para entender el error */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white/90 rounded-xl border border-amber-200">
                      <strong className="text-rose-700 block mb-1 flex items-center gap-1">
                        <span>🔍</span> ¿En qué falló tu opción?
                      </strong>
                      <p className="text-slate-700 leading-relaxed">
                        {currentQuestion.formativeFeedback.mistakeAnalysis}
                      </p>
                    </div>

                    <div className="p-3 bg-white/90 rounded-xl border border-amber-200">
                      <strong className="text-emerald-800 block mb-1 flex items-center gap-1">
                        <span>📜</span> ¿Qué dice el Acuerdo 0009?
                      </strong>
                      <p className="text-slate-700 leading-relaxed">
                        {currentQuestion.formativeFeedback.normativeBasis}
                      </p>
                    </div>

                    <div className="p-3 bg-white/90 rounded-xl border border-amber-200">
                      <strong className="text-sky-800 block mb-1 flex items-center gap-1">
                        <span>🎯</span> Consejo para tu formación
                      </strong>
                      <p className="text-slate-700 leading-relaxed">
                        {currentQuestion.formativeFeedback.pedagogicalAdvice}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-mono">
              Aprendiz: <strong className="text-slate-700">{editProfile.fullName}</strong> (Ficha {editProfile.cohortNumber})
            </span>

            {!showFeedback ? (
              <button
                type="button"
                disabled={tempSelectedOption === null}
                onClick={handleConfirmAnswer}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Confirmar Respuesta</span>
                <span>→</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 animate-pop"
              >
                <span>
                  {currentIdx < totalQuestions - 1 ? 'Siguiente Pregunta →' : 'Ver Resultados Finales 🏆'}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. STAGE: RESULTADOS FINALES Y RANKING                   */}
      {/* ========================================================= */}
      {stage === 'resultados' && (
        <div className="space-y-6">
          {/* Navegación por Pestañas de Resultados */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl max-w-md mx-auto">
            <button
              onClick={() => setResultsTab('resumen')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                resultsTab === 'resumen'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏆 Mi Calificación
            </button>
            <button
              onClick={() => setResultsTab('revision')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                resultsTab === 'revision'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📖 Revisión 25 Preguntas
            </button>
            <button
              onClick={() => setResultsTab('ranking')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                resultsTab === 'ranking'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🥇 Ranking Ficha
            </button>
          </div>

          {/* TAB 1: RESUMEN DE CALIFICACIÓN */}
          {resultsTab === 'resumen' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-800 text-4xl shadow-xs">
                  {hasPassed ? '🏆' : '📚'}
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {hasPassed
                      ? '¡Excelente Desempeño! Has Aprobado la Inducción SENA'
                      : 'Evaluación Completada · Requiere Repaso'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-1 leading-relaxed">
                    {hasPassed
                      ? 'Has respondido las 5 secciones del Acuerdo 0009 de 2024 demostrando dominio normativo, ético e institucional.'
                      : 'Para certificar la inducción se requiere al menos el 75% de aciertos (19 de 25). Puedes revisar tus respuestas y volver a presentar el reto.'}
                  </p>
                </div>

                {/* Grid de 4 Métricas Gamificadas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                    <span className="text-[11px] text-emerald-800 font-semibold block">Puntos Gamificados</span>
                    <span className="text-2xl font-extrabold text-emerald-900 font-mono">
                      {gamifiedScore}
                    </span>
                    <span className="text-[10px] text-emerald-700 block mt-0.5">Velocidad + Racha</span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[11px] text-slate-500 font-semibold block">Aciertos Totales</span>
                    <span className="text-2xl font-extrabold text-slate-900 font-mono">
                      {correctCount}/{totalQuestions}
                    </span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">{scorePercent}% de precisión</span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[11px] text-slate-500 font-semibold block">Tiempo Total</span>
                    <span className="text-2xl font-extrabold text-sky-800 font-mono">
                      {formatTime(elapsedSeconds)}
                    </span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">Cronómetro oficial</span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[11px] text-slate-500 font-semibold block">Racha Máxima</span>
                    <span className="text-2xl font-extrabold text-amber-600 font-mono">
                      {maxStreak}
                    </span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">Aciertos consecutivos</span>
                  </div>
                </div>

                {/* Insignia de Registro en Hoja de Cálculo */}
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-900 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl max-w-lg mx-auto">
                  <span className="font-bold text-sm">✓</span>
                  <span>Tus datos y puntuaciones fueron guardados exitosamente de acuerdo con la lógica institucional en Google Sheets.</span>
                </div>

                {/* Botones Principales */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {hasPassed && (
                    <button
                      onClick={onOpenCertificate}
                      className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    >
                      <span>📜</span>
                      <span>Generar Mi Certificado Oficial de Inducción</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleStartQuiz()}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    🔄 Reintentar Evaluación
                  </button>
                  <button
                    onClick={() => setResultsTab('ranking')}
                    className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>🏆</span>
                    <span>Ver Tabla de Posiciones</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REVISIÓN DE LAS 25 PREGUNTAS */}
          {resultsTab === 'revision' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Revisión Pedagógica Completa (25 Preguntas)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Consulta el sustento normativo exacto de cada artículo del Acuerdo 0009 de 2024
                  </p>
                </div>

                {/* Filtro por capítulo o errores */}
                <div className="flex flex-wrap gap-1 text-xs">
                  <button
                    onClick={() => setReviewFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      reviewFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Todas ({totalQuestions})
                  </button>
                  <button
                    onClick={() => setReviewFilter('errors')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      reviewFilter === 'errors' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Solo Errores ({totalQuestions - correctCount})
                  </button>
                  {['I', 'II', 'III', 'IV', 'V'].map((cId) => (
                    <button
                      key={cId}
                      onClick={() => setReviewFilter(cId as any)}
                      className={`px-2 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        reviewFilter === cId ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Cap {cId}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {questions
                  .filter((q) => {
                    const isCorrect = selectedAnswers[q.id] === q.correctIndex;
                    if (reviewFilter === 'errors') return !isCorrect;
                    if (['I', 'II', 'III', 'IV', 'V'].includes(reviewFilter)) return q.chapterId === reviewFilter;
                    return true;
                  })
                  .map((q, idx) => {
                    const userChoice = selectedAnswers[q.id];
                    const isCorrect = userChoice === q.correctIndex;
                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                          isCorrect ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="font-bold text-[11px] text-slate-500 font-mono block">
                              {q.chapterName} · {q.articleReference}
                            </span>
                            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                              {q.question}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                            }`}
                          >
                            {isCorrect ? '✓ Correcta' : '✗ Incorrecta'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                          <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200">
                            <span className="text-slate-500 block font-semibold">Tu respuesta:</span>
                            <span className={isCorrect ? 'text-emerald-900 font-bold' : 'text-rose-900 font-medium'}>
                              {userChoice !== undefined ? q.options[userChoice] : 'Sin responder'}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                            <span className="text-emerald-800 block font-semibold">Respuesta correcta según el Reglamento:</span>
                            <span className="text-emerald-950 font-bold">{q.options[q.correctIndex]}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white/90 border border-slate-200 text-slate-700 leading-relaxed">
                          <strong className="text-slate-900">Sustento Normativo: </strong>
                          {q.explanation}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 3: RANKING GAMIFICADO */}
          {resultsTab === 'ranking' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>🏆</span>
                    <span>Tabla de Posiciones de la Ficha</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Clasificación gamificada de aprendices por puntaje, velocidad y precisión
                  </p>
                </div>

                {/* Filtro por cohorte/ficha y botón CSV */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 font-semibold">Filtrar por Ficha:</span>
                  <select
                    value={rankingFilterCohort}
                    onChange={(e) => setRankingFilterCohort(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono cursor-pointer"
                  >
                    <option value="all">Todas las Fichas ({leaderboardList.length})</option>
                    {availableCohorts.map((co) => (
                      <option key={co} value={co}>
                        Ficha {co}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleExportRankingCSV}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                    title="Descargar tabla de clasificación en formato CSV"
                  >
                    <span>⬇ CSV Ranking</span>
                  </button>
                </div>
              </div>

              {/* Podio Top 3 Visual */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {filteredLeaderboard.slice(0, 3).map((item, idx) => {
                  const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
                  const medalColors =
                    idx === 0
                      ? 'border-amber-400 bg-amber-50/50'
                      : idx === 1
                      ? 'border-slate-300 bg-slate-50/60'
                      : 'border-orange-300 bg-orange-50/50';

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border-2 text-center space-y-2 relative overflow-hidden ${medalColors}`}
                    >
                      <span className="text-3xl block">{medal}</span>
                      <div>
                        <h5 className="font-bold text-sm text-slate-900 truncate">
                          {item.fullName}
                        </h5>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Ficha {item.cohortNumber}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-white/90 border border-slate-200 text-xs">
                        <span className="text-base font-extrabold text-emerald-800 font-mono block">
                          {item.gamifiedScore ?? item.scorePercent * 25} pts
                        </span>
                        <div className="flex justify-between text-[10px] text-slate-500 pt-1 font-mono">
                          <span>⏱️ {item.timeFormatted || '03:45'}</span>
                          <span>🎯 {item.scorePercent}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tabla Detallada */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Aprendiz</th>
                      <th className="py-2.5 px-3">Ficha</th>
                      <th className="py-2.5 px-3 text-right">Puntaje</th>
                      <th className="py-2.5 px-3 text-center">Precisión</th>
                      <th className="py-2.5 px-3 text-center">Tiempo</th>
                      <th className="py-2.5 px-3">Juicio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeaderboard.map((row, idx) => {
                      const isCurrentUser = row.documentNumber === editProfile.documentNumber;
                      return (
                        <tr
                          key={row.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            isCurrentUser ? 'bg-emerald-50/70 font-semibold' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-medium text-slate-900 block">{row.fullName}</span>
                            {isCurrentUser && (
                              <span className="text-[10px] text-emerald-700 font-bold font-mono">
                                ⭐ Tu Resultado
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{row.cohortNumber}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">
                            {row.gamifiedScore ?? row.scorePercent * 25} pts
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                            {row.scorePercent}%
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                            {row.timeFormatted || '03:45'}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                row.evaluationResult.includes('APROBADO')
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {row.evaluationResult.includes('APROBADO') ? 'APROBADO' : 'POR MEJORAR'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. STAGE: VISTA SOLA DE RANKING (DESDE CUALQUIER LUGAR)    */}
      {/* ========================================================= */}
      {stage === 'ranking_vista' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>🏆</span>
                <span>Ranking Oficial de Aprendices en la Plataforma</span>
              </h3>
              <p className="text-xs text-slate-500">
                Puntuaciones en tiempo real de acuerdo a la hoja de cálculo institucional
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportRankingCSV}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>⬇ Descargar Ranking CSV</span>
              </button>
              <button
                onClick={() => setStage(selectedAnswers && Object.keys(selectedAnswers).length === totalQuestions ? 'resultados' : 'identificacion')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                ← Regresar al Módulo
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Posición</th>
                  <th className="py-2.5 px-3">Aprendiz</th>
                  <th className="py-2.5 px-3">Ficha</th>
                  <th className="py-2.5 px-3">Programa</th>
                  <th className="py-2.5 px-3 text-right">Puntaje</th>
                  <th className="py-2.5 px-3 text-center">Precisión</th>
                  <th className="py-2.5 px-3 text-center">Tiempo</th>
                  <th className="py-2.5 px-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaderboardList.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                      {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `#${idx + 1}`}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{row.fullName}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{row.cohortNumber}</td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-[200px]">{row.programName}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">
                      {row.gamifiedScore ?? row.scorePercent * 25} pts
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-700">{row.scorePercent}%</td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-700">{row.timeFormatted || '03:45'}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {row.evaluationResult}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
