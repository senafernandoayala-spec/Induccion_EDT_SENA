import React from 'react';
import { ApprenticeProfile } from '../types/induction';
import { SenaLogo } from './SenaLogo';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ApprenticeProfile;
  issueDate: string;
  certificateCode?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  profile,
  issueDate,
  certificateCode,
}) => {
  if (!isOpen) return null;

  // Generate a stable, deterministic verification code if certificateCode is not provided
  const generateStableCode = () => {
    if (certificateCode) return certificateCode;
    const doc = profile.documentNumber || '0000';
    const cohort = profile.cohortNumber || '2026';
    let hash = 0;
    const str = `${profile.fullName}-${doc}-${cohort}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const codeSuffix = Math.abs(hash).toString(36).toUpperCase().padStart(5, 'X').substring(0, 5);
    return `SENA-IND-${cohort}-${codeSuffix}`;
  };

  const verificationCode = generateStableCode();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Top Actions (no-print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
            <span>Certificado Institucional de Inducción</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{verificationCode}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>🖨 Imprimir / Guardar en PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate Printable Area */}
        <div className="p-8 sm:p-12 bg-white text-slate-900 relative">
          {/* Decorative Security Border Frame */}
          <div className="border-4 border-emerald-800 p-6 sm:p-10 relative">
            <div className="absolute inset-1 border border-emerald-600/40 pointer-events-none" />

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-800" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-800" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-800" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-800" />

            {/* Certificate Header */}
            <div className="text-center space-y-2 mb-8">
              <div className="flex justify-center mb-1">
                <SenaLogo size={56} color="#39A900" />
              </div>
              <div className="text-xs font-bold tracking-wider text-slate-600 uppercase">
                Servicio Nacional de Aprendizaje
              </div>
              <div className="text-[11px] text-slate-500">
                Ministerio del Trabajo · República de Colombia
              </div>
              <div className="w-24 h-0.5 bg-emerald-700 mx-auto mt-2" />
            </div>

            {/* Main Attestation Statement */}
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-10">
              <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                Hace constar que:
              </p>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight underline decoration-emerald-600 decoration-2 underline-offset-8">
                {profile.fullName || 'APRENDIZ SENA'}
              </h2>

              <p className="text-xs text-slate-600">
                Identificado(a) con documento {profile.documentType} No.{' '}
                <span className="font-semibold font-mono">{profile.documentNumber || 'XXXXXXXXXX'}</span>
              </p>

              <p className="text-xs text-slate-600">
                Ha completado y aprobado con éxito la totalidad de las actividades formativas del proceso de:
              </p>

              <div className="py-2">
                <span className="text-base sm:text-lg font-bold text-emerald-900 uppercase tracking-wide block">
                  Inducción a la Formación Profesional Integral
                </span>
                <span className="text-xs text-slate-600 block mt-1">
                  Enfoque en Identidad Institucional, Filosofía, Modelo por Competencias y Reglamento del Aprendiz (Acuerdo 0009 de 2024)
                </span>
              </div>

              {/* Training Program Details Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
                <div>
                  <span className="font-bold text-slate-900 block">Programa de Formación:</span>
                  <span>{profile.programName || 'Formación Técnica / Tecnológica'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Número de Ficha:</span>
                  <span className="font-mono font-semibold text-emerald-800">
                    {profile.cohortNumber || '2987140'}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Centro de Formación:</span>
                  <span>{profile.trainingCenter || 'Centro de Tecnologías y Servicios'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Regional:</span>
                  <span>{profile.regional || 'Dirección Regional SENA'}</span>
                </div>
              </div>
            </div>

            {/* Signatures & Seal Section */}
            <div className="grid grid-cols-3 gap-4 items-end pt-6 border-t border-slate-200 text-center text-xs">
              <div>
                <div className="w-36 h-0.5 bg-slate-400 mx-auto mb-2" />
                <div className="font-bold text-slate-900">Subdirección de Centro</div>
                <div className="text-[11px] text-slate-500">Centro de Formación</div>
              </div>

              {/* Official Seal Mockup */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-700 flex items-center justify-center text-center p-1 bg-emerald-50/50">
                  <div className="text-[9px] font-bold text-emerald-900 leading-tight">
                    SENA<br />INDUCCIÓN<br />APROBADA
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 font-mono">{issueDate}</span>
              </div>

              <div>
                <div className="w-36 h-0.5 bg-slate-400 mx-auto mb-2" />
                <div className="font-bold text-slate-900">Coordinación Misional</div>
                <div className="text-[11px] text-slate-500">Bienestar al Aprendiz</div>
              </div>
            </div>

            {/* Verification Hash Footer */}
            <div className="mt-8 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Código Único de Verificación: {verificationCode}</span>
              <span>Constancia pedagógica expedida sin costo legal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
