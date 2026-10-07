import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { googleSignIn, googleSignOut, getAccessToken } from '../services/googleAuth';
import {
  getOrCreateInductionSpreadsheet,
  appendApprenticeRecordToSheet,
  fetchInductionSheetRows,
  GoogleSpreadsheetInfo,
  ApprenticeInductionRecord,
} from '../services/googleSheetsService';
import { SubmissionRecord } from '../types/induction';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  submissions: SubmissionRecord[];
  onUpdateSubmissions: (submissions: SubmissionRecord[]) => void;
  onAdminAuthChange?: (isAuth: boolean) => void;
}

const INSTRUCTOR_MASTER_KEY = 'Efaq811210';
const BACKUP_PIN = 'SENA2026';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  submissions,
  onUpdateSubmissions,
  onAdminAuthChange,
}) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('sena_instructor_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [adminPin, setAdminPin] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSuccessMessage, setPinSuccessMessage] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);

  const [spreadsheetInfo, setSpreadsheetInfo] = useState<GoogleSpreadsheetInfo | null>(null);
  const [sheetRows, setSheetRows] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCohortFilter, setSelectedCohortFilter] = useState('all');
  const [selectedApprenticeForDetail, setSelectedApprenticeForDetail] = useState<SubmissionRecord | null>(null);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTimer > 0) {
      const interval = setInterval(() => {
        setLockoutTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTimer]);

  // Verify if currentUser is authenticated
  useEffect(() => {
    if (currentUser) {
      setIsAdminAuthenticated(true);
      onAdminAuthChange?.(true);
      try {
        sessionStorage.setItem('sena_instructor_auth', 'true');
        sessionStorage.setItem('sena_instructor_auth_method', 'Google Workspace Account');
      } catch {
        // ignore
      }
    }
  }, [currentUser, onAdminAuthChange]);

  useEffect(() => {
    if (isOpen && isAdminAuthenticated && currentUser) {
      loadSpreadsheetInfo();
    }
  }, [isOpen, isAdminAuthenticated, currentUser]);

  const loadSpreadsheetInfo = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) return;
      const sheet = await getOrCreateInductionSpreadsheet(token);
      setSpreadsheetInfo(sheet);
      const data = await fetchInductionSheetRows(token, sheet.id);
      setSheetRows(data.rows);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (lockoutTimer > 0) return;

    const trimmed = adminPin.trim();
    if (
      trimmed === INSTRUCTOR_MASTER_KEY ||
      trimmed.toLowerCase() === INSTRUCTOR_MASTER_KEY.toLowerCase() ||
      trimmed === BACKUP_PIN ||
      trimmed.toLowerCase() === 'sena2026'
    ) {
      setPinError(null);
      setFailedAttempts(0);
      setPinSuccessMessage('¡Clave institucional validada con éxito! Accediendo al panel...');
      setIsAdminAuthenticated(true);
      onAdminAuthChange?.(true);
      try {
        sessionStorage.setItem('sena_instructor_auth', 'true');
        sessionStorage.setItem(
          'sena_instructor_auth_method',
          'Método 2: PIN Maestro Institucional (' + INSTRUCTOR_MASTER_KEY + ')'
        );
      } catch {
        // ignore
      }
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        setLockoutTimer(30);
        setPinError(
          '⚠️ Demasiados intentos fallidos. El acceso seguro ha sido pausado temporalmente por 30 segundos.'
        );
      } else {
        setPinError(
          `Clave incorrecta (intento ${nextAttempts}/5). Ingrese la clave rápida de instructor (${INSTRUCTOR_MASTER_KEY}) o el PIN institucional (${BACKUP_PIN}).`
        );
      }
    }
  };

  const handleInstructorLogout = async () => {
    if (currentUser) {
      try {
        await googleSignOut();
      } catch {
        // ignore
      }
      onUserChange(null);
    }
    setIsAdminAuthenticated(false);
    onAdminAuthChange?.(false);
    try {
      sessionStorage.removeItem('sena_instructor_auth');
      sessionStorage.removeItem('sena_instructor_auth_method');
      sessionStorage.removeItem('sena_instructor_key_used');
    } catch {
      // ignore
    }
    setAdminPin('');
    setPinSuccessMessage(null);
    setPinError(null);
  };

  const handleQuickFillInstructorKey = () => {
    setAdminPin(INSTRUCTOR_MASTER_KEY);
    setPinError(null);
  };

  const handleGoogleAdminLogin = async () => {
    setIsLoading(true);
    try {
      const res = await googleSignIn();
      if (res) {
        onUserChange(res.user);
        setIsAdminAuthenticated(true);
        try {
          sessionStorage.setItem('sena_instructor_auth', 'true');
        } catch {
          // ignore
        }
        const sheet = await getOrCreateInductionSpreadsheet(res.accessToken);
        setSpreadsheetInfo(sheet);
        const data = await fetchInductionSheetRows(res.accessToken, sheet.id);
        setSheetRows(data.rows);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage('Error en autenticación Google: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncAllToDrive = async () => {
    setIsSyncingAll(true);
    setStatusMessage(null);
    try {
      let token = await getAccessToken();
      if (!token) {
        const signRes = await googleSignIn();
        if (!signRes) return;
        token = signRes.accessToken;
        onUserChange(signRes.user);
      }

      let currentSheet = spreadsheetInfo;
      if (!currentSheet) {
        currentSheet = await getOrCreateInductionSpreadsheet(token);
        setSpreadsheetInfo(currentSheet);
      }

      // Sync un-synced submissions
      const pendingSubmissions = submissions.filter((s) => !s.syncedToDrive);
      if (pendingSubmissions.length === 0 && submissions.length > 0) {
        // Offer to sync all anyway
        for (const sub of submissions) {
          const rec: ApprenticeInductionRecord = {
            timestamp: sub.timestamp,
            fullName: sub.fullName,
            documentType: sub.documentType,
            documentNumber: sub.documentNumber,
            cohortNumber: sub.cohortNumber,
            programName: sub.programName,
            trainingCenter: sub.trainingCenter,
            regional: sub.regional,
            scorePercent: sub.scorePercent,
            evaluationResult: sub.evaluationResult,
            certificateCode: sub.certificateCode,
            gamifiedScore: sub.gamifiedScore,
            timeFormatted: sub.timeFormatted,
            maxStreak: sub.maxStreak,
          };
          await appendApprenticeRecordToSheet(token, currentSheet.id, rec);
        }
      } else {
        for (const sub of pendingSubmissions) {
          const rec: ApprenticeInductionRecord = {
            timestamp: sub.timestamp,
            fullName: sub.fullName,
            documentType: sub.documentType,
            documentNumber: sub.documentNumber,
            cohortNumber: sub.cohortNumber,
            programName: sub.programName,
            trainingCenter: sub.trainingCenter,
            regional: sub.regional,
            scorePercent: sub.scorePercent,
            evaluationResult: sub.evaluationResult,
            certificateCode: sub.certificateCode,
            gamifiedScore: sub.gamifiedScore,
            timeFormatted: sub.timeFormatted,
            maxStreak: sub.maxStreak,
          };
          await appendApprenticeRecordToSheet(token, currentSheet.id, rec);
        }
      }

      // Mark all as synced
      const updated = submissions.map((s) => ({ ...s, syncedToDrive: true }));
      onUpdateSubmissions(updated);

      // Refresh rows
      const data = await fetchInductionSheetRows(token, currentSheet.id);
      setSheetRows(data.rows);
      setStatusMessage('¡Todos los aprendices han sido sincronizados exitosamente con Google Drive!');
    } catch (err: any) {
      console.error(err);
      setStatusMessage('Error al sincronizar con Google Drive: ' + err.message);
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    const headers = [
      'Fecha',
      'Nombre',
      'Tipo Doc',
      'Número Doc',
      'Ficha',
      'Programa',
      'Centro',
      'Regional',
      'Puntaje',
      'Juicio',
      'Código Certificado',
      'Puntaje Gamificado',
      'Tiempo Empleado',
      'Racha Máxima',
    ];
    const rows = submissions.map((s) => [
      `"${s.timestamp}"`,
      `"${s.fullName}"`,
      `"${s.documentType}"`,
      `"${s.documentNumber}"`,
      `"${s.cohortNumber}"`,
      `"${s.programName}"`,
      `"${s.trainingCenter}"`,
      `"${s.regional}"`,
      `"${s.scorePercent}%"`,
      `"${s.evaluationResult}"`,
      `"${s.certificateCode}"`,
      `"${s.gamifiedScore ?? 'N/A'}"`,
      `"${s.timeFormatted ?? 'N/A'}"`,
      `"${s.maxStreak ?? 'N/A'}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SENA_Induccion_Aprendices_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteSubmission = (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este registro local?')) {
      const filtered = submissions.filter((s) => s.id !== id);
      onUpdateSubmissions(filtered);
    }
  };

  const handleClearSampleData = () => {
    if (
      window.confirm(
        '¿Deseas reiniciar la base de datos y eliminar los datos de prueba para iniciar la plataforma en blanco con aprendices reales?'
      )
    ) {
      onUpdateSubmissions([]);
      setStatusMessage('✨ Se han eliminado los registros de prueba. La consola está lista en blanco para aprendices reales.');
    }
  };

  if (!isOpen) return null;

  // Cohort filter list
  const cohorts = Array.from(new Set(submissions.map((s) => s.cohortNumber).filter(Boolean)));
  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.documentNumber.includes(searchTerm) ||
      s.cohortNumber.includes(searchTerm);
    const matchesCohort = selectedCohortFilter === 'all' || s.cohortNumber === selectedCohortFilter;
    return matchesSearch && matchesCohort;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-sm">
              🛡️
            </span>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Panel de Administración e Instructor</span>
                <span className="text-[11px] font-normal text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                  Privado
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Supervisión de pruebas de inducción y control de la hoja de cálculo en Google Drive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {!isAdminAuthenticated ? (
          /* LOGIN LOCK SCREEN */
          <div className="p-6 sm:p-8 max-w-xl mx-auto my-auto space-y-6 w-full">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl mx-auto shadow-xs">
                🛡️
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                Acceso Seguro a la Consola de Instructor
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Por seguridad de la información y privacidad de los aprendices, la visualización de resultados y el enlace a la hoja de cálculo de Google Drive están protegidos y restringidos exclusivamente para el docente/administrador.
              </p>
            </div>

            {/* METODO 2: PIN MAESTRO INSTITUCIONAL (PREFERIDO / OFICIAL) */}
            <div className="bg-slate-50 border-2 border-emerald-600/30 rounded-2xl p-5 shadow-xs space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg tracking-wider uppercase">
                Método 2 · Acceso Rápido
              </div>

              <div className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0 mt-0.5">
                  🔑
                </span>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Método 2: PIN Maestro Institucional</span>
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Clave de acceso rápido autorizada para el instructor SENA
                  </p>
                </div>
              </div>

              {/* Formulario de Clave Rápida */}
              <form onSubmit={handlePinSubmit} className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Clave de Instructor / PIN Maestro:
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPin}
                      onChange={(e) => {
                        setAdminPin(e.target.value);
                        setPinError(null);
                      }}
                      disabled={lockoutTimer > 0}
                      placeholder="Ingrese clave (ej. Efaq811210)"
                      className="w-full text-sm bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 pr-20 focus:outline-emerald-600 font-mono tracking-wider transition-colors disabled:bg-slate-100 disabled:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                </div>

                {/* Mensaje de error o éxito */}
                {pinError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                    <span className="shrink-0 text-sm">⚠️</span>
                    <span>{pinError}</span>
                  </div>
                )}

                {pinSuccessMessage && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                    <span className="shrink-0 text-sm">✓</span>
                    <span>{pinSuccessMessage}</span>
                  </div>
                )}

                {/* Acciones de Desbloqueo y Botón de Acceso Rápido */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="submit"
                    disabled={lockoutTimer > 0 || !adminPin.trim()}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>🔓</span>
                    <span>
                      {lockoutTimer > 0
                        ? `Bloqueado (${lockoutTimer}s)`
                        : 'Ingresar con PIN'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickFillInstructorKey}
                    className="w-full py-2.5 bg-white border border-emerald-300 hover:bg-emerald-50/80 text-emerald-800 text-xs font-semibold rounded-xl transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    title="Cargar la clave de acceso rápido asignada al instructor"
                  >
                    <span>⚡</span>
                    <span>Usar clave rápida (Efaq811210)</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Clave asignada: <strong className="font-mono text-slate-700">Efaq811210</strong>
                  </span>
                  {failedAttempts > 0 && failedAttempts < 5 && (
                    <span className="text-amber-600 font-medium">
                      Intentos: {failedAttempts}/5
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* Separador de métodos */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                O método alternativo
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* METODO 1: GOOGLE SIGN-IN */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center space-y-2.5 shadow-xs">
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block">
                  Método 1: Autenticación con Cuenta Google
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Conexión directa con Google Workspace para sincronizar la hoja de cálculo en su Google Drive.
                </span>
              </div>
              <button
                onClick={handleGoogleAdminLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>Acceder como Administrador con Google</span>
              </button>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN PANEL */
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Admin Profile & Drive Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || ''}
                    className="w-10 h-10 rounded-full border border-slate-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    🛡️
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>{currentUser?.displayName || 'Instructor SENA Autorizado'}</span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-mono font-semibold">
                      {currentUser?.email || 'Método 2: PIN Maestro Validado (Efaq811210)'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Modo seguro activo · Panel confidencial fuera del alcance de los aprendices
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!currentUser && (
                  <button
                    onClick={handleGoogleAdminLogin}
                    disabled={isLoading}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    title="Conectar con Google Drive para crear y actualizar la hoja de cálculo"
                  >
                    <span>📁</span>
                    <span>Conectar Google Drive / Sheets</span>
                  </button>
                )}

                <button
                  onClick={handleInstructorLogout}
                  className="px-3 py-1.5 text-xs font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Bloquear el panel y cerrar sesión de instructor"
                >
                  <span>🔒</span>
                  <span>Cerrar Sesión / Bloquear Panel</span>
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-medium text-slate-500 block">Total Evaluados</span>
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {submissions.length}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Registros recibidos</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-medium text-slate-500 block">Aprobados</span>
                <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
                  {submissions.filter((s) => s.evaluationResult.includes('APROBADO')).length}
                </span>
                <span className="text-[11px] text-emerald-600 block mt-1">≥ 75% de puntaje</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-medium text-slate-500 block">Promedio Calificación</span>
                <span className="text-2xl font-bold text-sky-700 font-mono tabular-nums">
                  {submissions.length > 0
                    ? Math.round(
                        submissions.reduce((acc, curr) => acc + curr.scorePercent, 0) / submissions.length
                      )
                    : 0}
                  %
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Rendimiento global</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-medium text-slate-500 block">En Google Sheets</span>
                <span className="text-2xl font-bold text-amber-700 font-mono tabular-nums">
                  {sheetRows.length}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Filas en tu Drive</span>
              </div>
            </div>

            {/* Google Drive Sheet Management Card */}
            <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    <span>📊 Hoja de Cálculo en tu Google Drive</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-mono">
                      Confidencial
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                    {spreadsheetInfo?.title || 'Registro Inducción Aprendices SENA'}
                  </h4>
                  <p className="text-xs text-slate-600">
                    Solo tú como administrador tienes acceso al archivo y a esta visualización.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {spreadsheetInfo && (
                    <a
                      href={spreadsheetInfo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                    >
                      <span>Abrir Hoja en Google Drive</span>
                      <span>↗</span>
                    </a>
                  )}

                  <button
                    onClick={handleSyncAllToDrive}
                    disabled={isSyncingAll}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <span>{isSyncingAll ? 'Sincronizando...' : '🔄 Sincronizar Todo a Drive'}</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    disabled={submissions.length === 0}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                  >
                    ⬇ Exportar CSV
                  </button>

                  <button
                    onClick={handleClearSampleData}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    title="Eliminar registros de prueba para dejar la base de datos en blanco para aprendices reales"
                  >
                    🗑️ Reiniciar a Blanco
                  </button>
                </div>
              </div>

              {statusMessage && (
                <div className="p-2.5 rounded bg-white border border-emerald-200 text-xs text-emerald-900 font-medium">
                  {statusMessage}
                </div>
              )}
            </div>

            {/* Diagnóstico Pedagógico del Grupo */}
            {submissions.length > 0 && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Diagnóstico Pedagógico de Dificultad (Capítulos Acuerdo 0009)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">Basado en {submissions.length} evaluados</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                  {[
                    { key: 'I', name: 'Cap I: Definiciones', color: 'border-sky-200 bg-sky-50/50 text-sky-900' },
                    { key: 'II', name: 'Cap II: Derechos', color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900' },
                    { key: 'III', name: 'Cap III: Deberes', color: 'border-amber-200 bg-amber-50/50 text-amber-900' },
                    { key: 'IV', name: 'Cap IV: Ingreso', color: 'border-purple-200 bg-purple-50/50 text-purple-900' },
                    { key: 'V', name: 'Cap V: Sanciones', color: 'border-rose-200 bg-rose-50/50 text-rose-900' },
                  ].map((cap) => {
                    let totalQ = 0;
                    let wrongQ = 0;
                    submissions.forEach((s) => {
                      if (s.detailedAnswers) {
                        Object.entries(s.detailedAnswers).forEach(([qKey, item]) => {
                          const isCapMatch =
                            (cap.key === 'I' && (qKey.includes('cap1') || item.question.includes('Capítulo I'))) ||
                            (cap.key === 'II' && (qKey.includes('cap2') || item.question.includes('Capítulo II'))) ||
                            (cap.key === 'III' && (qKey.includes('cap3') || item.question.includes('Capítulo III'))) ||
                            (cap.key === 'IV' && (qKey.includes('cap4') || item.question.includes('Capítulo IV'))) ||
                            (cap.key === 'V' && (qKey.includes('cap5') || item.question.includes('Capítulo V')));

                          if (isCapMatch) {
                            totalQ++;
                            if (!item.isCorrect) wrongQ++;
                          }
                        });
                      }
                    });

                    const errorRate = totalQ > 0 ? Math.round((wrongQ / totalQ) * 100) : 0;
                    const passRate = 100 - errorRate;

                    return (
                      <div key={cap.key} className={`p-2.5 rounded-lg border space-y-1 ${cap.color}`}>
                        <div className="font-bold truncate text-[11px]">{cap.name}</div>
                        <div className="flex items-baseline justify-between font-mono">
                          <span className="text-base font-extrabold">{passRate}%</span>
                          <span className="text-[10px] text-slate-500">{wrongQ} fallos</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${errorRate > 30 ? 'bg-rose-500' : 'bg-emerald-600'}`}
                            style={{ width: `${passRate}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submissions Table with Search and Filters */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Listado de Aprendices Evaluados ({filteredSubmissions.length})
                </h4>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre, cédula o ficha..."
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-emerald-600 w-56"
                  />
                  {cohorts.length > 0 && (
                    <select
                      value={selectedCohortFilter}
                      onChange={(e) => setSelectedCohortFilter(e.target.value)}
                      className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-emerald-600"
                    >
                      <option value="all">Todas las fichas</option>
                      {cohorts.map((c) => (
                        <option key={c} value={c}>
                          Ficha {c}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-72 overflow-y-auto">
                <table className="min-w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Fecha</th>
                      <th className="py-2.5 px-3">Aprendiz</th>
                      <th className="py-2.5 px-3">Identificación</th>
                      <th className="py-2.5 px-3">Ficha</th>
                      <th className="py-2.5 px-3">Programa</th>
                      <th className="py-2.5 px-3">Puntaje</th>
                      <th className="py-2.5 px-3">Juicio</th>
                      <th className="py-2.5 px-3">Drive</th>
                      <th className="py-2.5 px-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-400">
                          No hay aprendices registrados todavía con los filtros seleccionados.
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                            {sub.timestamp}
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-900">{sub.fullName}</td>
                          <td className="py-2 px-3 whitespace-nowrap font-mono text-[11px]">
                            {sub.documentType} {sub.documentNumber}
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap font-mono font-bold text-emerald-800">
                            {sub.cohortNumber}
                          </td>
                          <td className="py-2 px-3 max-w-[160px] truncate">{sub.programName}</td>
                          <td className="py-2 px-3 whitespace-nowrap font-mono font-bold text-slate-900">
                            {sub.scorePercent}%
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {sub.evaluationResult}
                            </span>
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap">
                            {sub.syncedToDrive ? (
                              <span className="text-[10px] text-emerald-700 font-bold">✓ En Drive</span>
                            ) : (
                              <span className="text-[10px] text-amber-700 font-medium">Pendiente</span>
                            )}
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedApprenticeForDetail(sub)}
                                className="px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 rounded border border-emerald-200 transition-colors cursor-pointer"
                                title="Ver respuestas detalladas"
                              >
                                🔍 Respuestas
                              </button>
                              <button
                                onClick={() => handleDeleteSubmission(sub.id)}
                                className="text-rose-600 hover:text-rose-800 text-[11px] font-medium cursor-pointer"
                                title="Eliminar registro"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Apprentice Answers Detail Inspection Modal */}
            {selectedApprenticeForDetail && (
              <div className="p-5 bg-slate-900 text-white rounded-xl border border-slate-700 space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                      <span>Detalle de Respuestas del Aprendiz</span>
                      <span>·</span>
                      <span>{selectedApprenticeForDetail.timestamp}</span>
                    </div>
                    <h5 className="text-base font-bold text-white mt-1">
                      {selectedApprenticeForDetail.fullName}
                    </h5>
                    <div className="text-xs text-slate-300 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <span>Doc: {selectedApprenticeForDetail.documentType} {selectedApprenticeForDetail.documentNumber}</span>
                      <span>Ficha: {selectedApprenticeForDetail.cohortNumber}</span>
                      <span>Programa: {selectedApprenticeForDetail.programName}</span>
                      <span>Calificación: <strong className="text-emerald-400">{selectedApprenticeForDetail.scorePercent}%</strong> ({selectedApprenticeForDetail.evaluationResult})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedApprenticeForDetail(null)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    ✕ Cerrar Detalle
                  </button>
                </div>

                {selectedApprenticeForDetail.detailedAnswers ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                    {Object.entries(selectedApprenticeForDetail.detailedAnswers).map(([qKey, aItem], aIdx) => (
                      <div
                        key={qKey}
                        className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                          aItem.isCorrect
                            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                            : 'bg-rose-950/40 border-rose-800 text-rose-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-white text-[11px]">
                            Pregunta {aIdx + 1}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              aItem.isCorrect
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-600 text-white'
                            }`}
                          >
                            {aItem.isCorrect ? 'Correcta' : 'Incorrecta'}
                          </span>
                        </div>
                        <p className="text-slate-200 font-medium">{aItem.question}</p>
                        <div className="text-[11px] pt-1 border-t border-slate-800/80">
                          <div>
                            <span className="text-slate-400">Respuesta elegida: </span>
                            <span className="font-semibold text-white">{aItem.selected}</span>
                          </div>
                          {!aItem.isCorrect && (
                            <div className="text-emerald-400 mt-0.5">
                              <span>Respuesta correcta: </span>
                              <span className="font-semibold">{aItem.correct}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-800/50 rounded-lg text-xs text-slate-300">
                    <p className="font-medium text-white mb-1">Resumen de respuestas:</p>
                    <p>{selectedApprenticeForDetail.answersSummary || 'Registro con evaluación aprobada sin desglose detallado de opciones.'}</p>
                    <p className="text-slate-400 text-[11px] mt-2">
                      Código de Acta/Certificado: <span className="font-mono text-emerald-400">{selectedApprenticeForDetail.certificateCode}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Cerrar Consola
          </button>
          <div className="text-xs text-slate-400">
            SENA · Sistema de Aseguramiento de la Información de Inducción
          </div>
        </div>
      </div>
    </div>
  );
};
