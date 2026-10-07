import React from 'react';
import { ApprenticeProfile, StationId } from '../types/induction';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ApprenticeProfile;
  onUpdateProfile: (updated: Partial<ApprenticeProfile>) => void;
  completedStations: StationId[];
  onOpenCertificate: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  completedStations,
  onOpenCertificate,
}) => {
  if (!isOpen) return null;

  const totalStations = 5;
  const progressPercent = Math.round((completedStations.length / totalStations) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Pasaporte del Aprendiz SENA</h3>
            <p className="text-xs text-slate-500">
              Datos de caracterización y registro del proceso de inducción
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Progress Card */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Progreso General de Inducción
              </span>
              <span className="text-sm text-slate-700 mt-0.5 block">
                {completedStations.length} de {totalStations} estaciones aprobadas
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-900 font-mono tabular-nums">
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* Badges Earned */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Insignias de Competencia Obtenidas
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'identidad', label: 'Identidad SENA', icon: '🏛️' },
                { id: 'fpi', label: 'Maestro FPI', icon: '⚙️' },
                { id: 'reglamento', label: 'Guardián Ético', icon: '⚖️' },
                { id: 'bienestar', label: 'Bienestar Total', icon: '🌱' },
                { id: 'evaluacion', label: 'Certificado SENA', icon: '🏆' },
              ].map((badge) => {
                const isEarned = completedStations.includes(badge.id as StationId);
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      isEarned
                        ? 'bg-white border-emerald-300 shadow-xs'
                        : 'bg-slate-50 border-slate-200 opacity-50'
                    }`}
                  >
                    <div className="text-xl mb-1">{badge.icon}</div>
                    <div className="text-xs font-bold text-slate-900">{badge.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {isEarned ? 'Desbloqueada' : 'Pendiente'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Datos Personales y de Ficha
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => onUpdateProfile({ fullName: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Documento de Identidad</label>
                <div className="flex gap-2">
                  <select
                    value={profile.documentType}
                    onChange={(e) => onUpdateProfile({ documentType: e.target.value as any })}
                    className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2 py-2 focus:outline-emerald-600"
                  >
                    <option value="CC">C.C.</option>
                    <option value="TI">T.I.</option>
                    <option value="CE">C.E.</option>
                    <option value="PPT">PPT</option>
                  </select>
                  <input
                    type="text"
                    value={profile.documentNumber}
                    onChange={(e) => onUpdateProfile({ documentNumber: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Número de Ficha</label>
                <input
                  type="text"
                  value={profile.cohortNumber}
                  onChange={(e) => onUpdateProfile({ cohortNumber: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-mono focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Programa de Formación</label>
                <input
                  type="text"
                  value={profile.programName}
                  onChange={(e) => onUpdateProfile({ programName: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Regional SENA</label>
                <input
                  type="text"
                  value={profile.regional}
                  onChange={(e) => onUpdateProfile({ regional: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Centro de Formación</label>
                <input
                  type="text"
                  value={profile.trainingCenter}
                  onChange={(e) => onUpdateProfile({ trainingCenter: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Cerrar
          </button>

          {completedStations.includes('evaluacion') && (
            <button
              onClick={() => {
                onClose();
                onOpenCertificate();
              }}
              className="px-4 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors cursor-pointer"
            >
              Ver Certificado de Inducción
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
