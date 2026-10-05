import React from 'react';
import { CompoundRiskAssessment, PersonalBaseline, Medication, Language } from '../types';
import { Minimize2, Mic, CheckCircle2, Heart, Sparkles, HelpCircle } from 'lucide-react';

interface FocusModeViewProps {
  baseline: PersonalBaseline;
  assessment: CompoundRiskAssessment;
  medications: Medication[];
  onToggleMedication: (id: string) => void;
  onOpenVoice: () => void;
  onOpenWhy: () => void;
  onExitFocusMode: () => void;
  language: Language;
}

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  baseline,
  assessment,
  medications,
  onToggleMedication,
  onOpenVoice,
  onOpenWhy,
  onExitFocusMode,
  language,
}) => {
  const pendingMeds = medications.filter(m => !m.taken);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-12 relative animate-fadeIn font-sans">
      {/* Top bar with Exit */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-black uppercase tracking-widest text-teal-400">
            SugarSense Focus Companion
          </span>
        </div>

        <button
          onClick={onExitFocusMode}
          className="flex items-center space-x-1.5 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition"
        >
          <Minimize2 className="w-4 h-4" />
          <span>Exit Focus Mode</span>
        </button>
      </div>

      {/* Central High-Legibility Display */}
      <div className="max-w-2xl mx-auto w-full text-center space-y-8 my-auto">
        <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Good Morning, {baseline.preferredName.en} ❤️
        </p>

        {/* Status Pill */}
        <div className="inline-flex items-center space-x-3 p-4 px-8 rounded-full bg-slate-900 border border-slate-800 shadow-2xl">
          <span className={`w-4 h-4 rounded-full ${
            assessment.status === 'STABLE' ? 'bg-emerald-400' :
            assessment.status === 'ATTENTION' ? 'bg-amber-400' : 'bg-rose-500'
          }`} />
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {assessment.title[language]}
          </h2>
          <button
            onClick={onOpenWhy}
            className="p-1 text-slate-400 hover:text-white"
            title="Why this status?"
          >
            <HelpCircle className="w-5 h-5 text-teal-400" />
          </button>
        </div>

        <p className="text-lg text-slate-300 max-w-lg mx-auto">
          {assessment.summary[language]}
        </p>

        {/* Pending Medication Quick Tap */}
        {pendingMeds.length > 0 && (
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 text-left max-w-md mx-auto space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Prescription Dose:
            </p>
            {pendingMeds.map((med) => (
              <div
                key={med.id}
                onClick={() => onToggleMedication(med.id)}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl cursor-pointer flex items-center justify-between transition"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{med.name}</h4>
                  <p className="text-xs text-slate-400">{med.dosage}</p>
                </div>
                <span className="text-xs font-bold text-teal-400 bg-teal-950/60 px-3 py-1 rounded-xl border border-teal-800">
                  Tap to take ✅
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Giant Mic Button */}
        <div>
          <button
            onClick={onOpenVoice}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 hover:scale-105 text-slate-950 flex items-center justify-center mx-auto shadow-glow-teal transition active:scale-95"
          >
            <Mic className="w-12 h-12" />
          </button>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-3">
            Tap to speak in Marathi, Hindi, or English
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-600">
        SugarSense • Quiet Caregiver Safety Net Active in Background
      </div>
    </div>
  );
};
