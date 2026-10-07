/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { ApprenticeProfile, StationId, SubmissionRecord } from './types/induction';
import { initAuth } from './services/googleAuth';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { StationIdentidad } from './components/StationIdentidad';
import { StationFPI } from './components/StationFPI';
import { StationReglamento } from './components/StationReglamento';
import { StationBienestar } from './components/StationBienestar';
import { StationEvaluacion } from './components/StationEvaluacion';
import { CertificateModal } from './components/CertificateModal';
import { GlosarioModal } from './components/GlosarioModal';
import { ProfileModal } from './components/ProfileModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { Footer } from './components/Footer';

const DEFAULT_PROFILE: ApprenticeProfile = {
  fullName: 'Fernando Ayala',
  documentType: 'CC',
  documentNumber: '1024567890',
  regional: 'Regional Distrito Capital',
  trainingCenter: 'Centro de Tecnologías de la Información y las Comunicaciones',
  programName: 'Tecnología en Análisis y Desarrollo de Software (ADSO)',
  cohortNumber: '2987410',
};

const INITIAL_SAMPLE_SUBMISSIONS: SubmissionRecord[] = [
  {
    id: 'sub-sample-1',
    timestamp: '2026-03-15 09:42:10',
    fullName: 'Carlos Andrés Gómez Pardo',
    documentType: 'CC',
    documentNumber: '1018439201',
    cohortNumber: '2987410',
    programName: 'Tecnología en Análisis y Desarrollo de Software (ADSO)',
    trainingCenter: 'Centro de Tecnologías de la Información y las Comunicaciones',
    regional: 'Distrito Capital',
    scorePercent: 100,
    evaluationResult: 'APROBADO (A)',
    certificateCode: 'SENA-IND-2987410-X7K9P',
    answersSummary: '25/25 aciertos (100%)',
    syncedToDrive: true,
    gamifiedScore: 3620,
    timeSpentSeconds: 215,
    timeFormatted: '03:35',
    maxStreak: 25,
    badges: ['Perito del Acuerdo 0009', 'Tirador de Élite', 'Racha Imparable', 'Guepardo Digital'],
  },
  {
    id: 'sub-sample-2',
    timestamp: '2026-03-15 10:15:33',
    fullName: 'María Paula Rodríguez Castro',
    documentType: 'TI',
    documentNumber: '1075849302',
    cohortNumber: '2987410',
    programName: 'Tecnología en Análisis y Desarrollo de Software (ADSO)',
    trainingCenter: 'Centro de Tecnologías de la Información y las Comunicaciones',
    regional: 'Distrito Capital',
    scorePercent: 92,
    evaluationResult: 'APROBADO (A)',
    certificateCode: 'SENA-IND-2987410-M2N8Q',
    answersSummary: '23/25 aciertos (92%)',
    syncedToDrive: true,
    gamifiedScore: 3180,
    timeSpentSeconds: 278,
    timeFormatted: '04:38',
    maxStreak: 12,
    badges: ['Precisión Quirúrgica', 'Racha Imparable', 'Perito del Acuerdo 0009'],
  },
  {
    id: 'sub-sample-3',
    timestamp: '2026-03-15 11:05:14',
    fullName: 'Juan David Martínez Silva',
    documentType: 'CC',
    documentNumber: '1032849102',
    cohortNumber: '2987410',
    programName: 'Tecnología en Análisis y Desarrollo de Software (ADSO)',
    trainingCenter: 'Centro de Tecnologías de la Información y las Comunicaciones',
    regional: 'Distrito Capital',
    scorePercent: 84,
    evaluationResult: 'APROBADO (A)',
    certificateCode: 'SENA-IND-2987410-J9R2W',
    answersSummary: '21/25 aciertos (84%)',
    syncedToDrive: true,
    gamifiedScore: 2740,
    timeSpentSeconds: 340,
    timeFormatted: '05:40',
    maxStreak: 8,
    badges: ['Racha Imparable'],
  },
];

const STATIONS: { id: StationId; label: string; icon: string; short: string }[] = [
  { id: 'identidad', label: '1. Identidad & Símbolos', icon: '🏛️', short: 'Identidad' },
  { id: 'fpi', label: '2. Formación Profesional', icon: '⚙️', short: 'FPI' },
  { id: 'reglamento', label: '3. Reglamento del Aprendiz', icon: '⚖️', short: 'Reglamento' },
  { id: 'bienestar', label: '4. Bienestar & Ecosistema', icon: '🌱', short: 'Bienestar' },
  { id: 'evaluacion', label: '5. Reto de Certificación', icon: '🏆', short: 'Certificación' },
];

export default function App() {
  const [activeStation, setActiveStation] = useState<StationId>('identidad');
  const [completedStations, setCompletedStations] = useState<StationId[]>(() => {
    try {
      const saved = localStorage.getItem('sena_completed_stations');
      return saved ? JSON.parse(saved) : ['identidad'];
    } catch {
      return ['identidad'];
    }
  });

  const [profile, setProfile] = useState<ApprenticeProfile>(() => {
    try {
      const saved = localStorage.getItem('sena_apprentice_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return sessionStorage.getItem('sena_instructor_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sena_induction_submissions');
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_SUBMISSIONS;
    } catch {
      return INITIAL_SAMPLE_SUBMISSIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sena_induction_submissions', JSON.stringify(submissions));
    } catch {
      // ignore
    }
  }, [submissions]);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
        if (user) {
          setIsAdminLoggedIn(true);
          try {
            sessionStorage.setItem('sena_instructor_auth', 'true');
          } catch {
            // ignore
          }
        }
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('sena_completed_stations', JSON.stringify(completedStations));
    } catch {
      // ignore
    }
  }, [completedStations]);

  useEffect(() => {
    try {
      localStorage.setItem('sena_apprentice_profile', JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  const handleCompleteStation = (stationId: StationId) => {
    if (!completedStations.includes(stationId)) {
      setCompletedStations((prev) => [...prev, stationId]);
    }
  };

  const handleUpdateProfile = (partial: Partial<ApprenticeProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  };

  const handleRecordSubmission = (newRecord: Omit<SubmissionRecord, 'id' | 'syncedToDrive'>) => {
    const record: SubmissionRecord = {
      ...newRecord,
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      syncedToDrive: false,
    };
    setSubmissions((prev) => [record, ...prev]);
  };

  const currentStationIndex = STATIONS.findIndex((s) => s.id === activeStation);
  const progressPercent = Math.round((completedStations.length / STATIONS.length) * 100);

  const handleNextStation = () => {
    const nextIdx = currentStationIndex + 1;
    if (nextIdx < STATIONS.length) {
      setActiveStation(STATIONS[nextIdx].id);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handlePrevStation = () => {
    const prevIdx = currentStationIndex - 1;
    if (prevIdx >= 0) {
      setActiveStation(STATIONS[prevIdx].id);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const currentDateFormatted = new Date().toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Bar Navigation */}
      <Header
        activeStation={activeStation}
        onSelectStation={(st) => {
          setActiveStation(st);
          window.scrollTo({ top: 380, behavior: 'smooth' });
        }}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onOpenRanking={() => {
          setActiveStation('evaluacion');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        isAdminLoggedIn={isAdminLoggedIn || !!currentUser}
        progressPercent={progressPercent}
      />

      {/* Hero Showcase Section */}
      <HeroSection
        activeStation={activeStation}
        onSelectStation={(st) => {
          setActiveStation(st);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        completedStations={completedStations}
      />

      {/* Interactive Stepper Navigation Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4 overflow-x-auto">
            <div className="flex items-center gap-2">
              {STATIONS.map((station, idx) => {
                const isActive = activeStation === station.id;
                const isCompleted = completedStations.includes(station.id);
                return (
                  <button
                    key={station.id}
                    onClick={() => {
                      setActiveStation(station.id);
                      window.scrollTo({ top: 420, behavior: 'smooth' });
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{station.icon}</span>
                    <span className="hidden sm:inline">{station.label}</span>
                    <span className="sm:hidden">{station.short}</span>
                    {isCompleted && !isActive && (
                      <span className="text-[10px] text-emerald-700 font-bold">✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick action to open certificate if passed */}
            {completedStations.includes('evaluacion') && (
              <button
                onClick={() => setIsCertificateOpen(true)}
                className="px-3.5 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span>📜 Ver Certificado</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {activeStation === 'identidad' && (
          <StationIdentidad
            onComplete={() => handleCompleteStation('identidad')}
            isCompleted={completedStations.includes('identidad')}
          />
        )}

        {activeStation === 'fpi' && (
          <StationFPI
            onComplete={() => handleCompleteStation('fpi')}
            isCompleted={completedStations.includes('fpi')}
          />
        )}

        {activeStation === 'reglamento' && (
          <StationReglamento
            onComplete={() => handleCompleteStation('reglamento')}
            isCompleted={completedStations.includes('reglamento')}
          />
        )}

        {activeStation === 'bienestar' && (
          <StationBienestar
            onComplete={() => handleCompleteStation('bienestar')}
            isCompleted={completedStations.includes('bienestar')}
          />
        )}

        {activeStation === 'evaluacion' && (
          <StationEvaluacion
            onComplete={() => handleCompleteStation('evaluacion')}
            isCompleted={completedStations.includes('evaluacion')}
            onOpenCertificate={() => setIsCertificateOpen(true)}
            onRecordSubmission={handleRecordSubmission}
            apprenticeProfile={profile}
            onUpdateProfile={handleUpdateProfile}
            submissions={submissions}
          />
        )}

        {/* Bottom Station Pagination Controls */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrevStation}
            disabled={currentStationIndex === 0}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            ← Estación Anterior
          </button>

          <div className="text-xs text-slate-500">
            Estación {currentStationIndex + 1} de {STATIONS.length}
          </div>

          <button
            onClick={handleNextStation}
            disabled={currentStationIndex === STATIONS.length - 1}
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Siguiente Estación →
          </button>
        </div>
      </main>

      {/* Institutional Footer */}
      <Footer
        onSelectStation={(st) => {
          setActiveStation(st);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Modals */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        profile={profile}
        issueDate={currentDateFormatted}
      />

      <GlosarioModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        completedStations={completedStations}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        currentUser={currentUser}
        onUserChange={(usr) => {
          setCurrentUser(usr);
          if (usr) {
            setIsAdminLoggedIn(true);
            try {
              sessionStorage.setItem('sena_instructor_auth', 'true');
            } catch {
              // ignore
            }
          }
        }}
        submissions={submissions}
        onUpdateSubmissions={setSubmissions}
        onAdminAuthChange={(isAuth) => setIsAdminLoggedIn(isAuth)}
      />
    </div>
  );
}
