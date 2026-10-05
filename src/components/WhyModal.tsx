import React from 'react';
import { CompoundRiskAssessment, Language } from '../types';
import { X, HelpCircle, Activity, Pill, Utensils, Footprints, ShieldCheck, AlertCircle } from 'lucide-react';

interface WhyModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: CompoundRiskAssessment;
  language: Language;
}

export const WhyModal: React.FC<WhyModalProps> = ({
  isOpen,
  onClose,
  assessment,
  language,
}) => {
  if (!isOpen) return null;

  const headings = {
    title: {
      mr: 'हे मूल्यमापन का करण्यात आले? (Explainable AI)',
      hi: 'यह आकलन क्यों किया गया? (Explainable AI)',
      en: 'Why this status? (Explainable AI Rationale)'
    },
    factorsTitle: {
      mr: 'आजच्या दिनचर्येचे घटक (Multi-Factor Breakdown):',
      hi: 'आज की दिनचर्या के घटक (Multi-Factor Breakdown):',
      en: 'Today’s Routine Matrix Breakdown:'
    },
    disclaimer: {
      mr: 'टीप: आमची AI प्रणाली रोगाचे थेट निदान करत नाही, तर तुमच्या वैयक्तिक बेसलाइनमधील बदल ओळखून वेळीच मार्गदर्शन करते.',
      hi: 'नोट: हमारा AI सिस्टम बीमारी का सीधा निदान नहीं करता, बल्कि आपकी व्यक्तिगत दिनचर्या में आए बदलावों की पहचान कर उचित कदम उठाने में मदद करता है।',
      en: 'Note: Our AI identifies patterns and routine deviations from personal baselines for timely decision support—not clinical diagnostic claims.'
    },
    closeBtn: {
      mr: 'समजले (Close)',
      hi: 'समझ गया (Close)',
      en: 'Understood'
    }
  };

  const bullets = assessment.whyExplanation[language] || assessment.whyExplanation.en;

  const statusColorMap = {
    STABLE: {
      border: 'border-emerald-500',
      badge: 'bg-emerald-100 text-emerald-800',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />
    },
    ATTENTION: {
      border: 'border-amber-500',
      badge: 'bg-amber-100 text-amber-800',
      icon: <AlertCircle className="w-6 h-6 text-amber-600" />
    },
    HIGH_RISK: {
      border: 'border-red-500',
      badge: 'bg-red-100 text-red-800',
      icon: <AlertCircle className="w-6 h-6 text-red-600" />
    }
  };

  const currentTheme = statusColorMap[assessment.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className={`bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border-t-8 ${currentTheme.border} relative overflow-hidden`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-teal-50 rounded-2xl">
            <HelpCircle className="w-7 h-7 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {headings.title[language]}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${currentTheme.badge}`}>
                {assessment.title[language]}
              </span>
              <span className="text-xs text-slate-500">
                Risk Score: <strong>{assessment.score}/100</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Plain Language Explanation Bullets */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
            {headings.factorsTitle[language]}
          </p>
          <ul className="space-y-3">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-sm text-slate-800 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Multi-Factor Radar / Bar Contribution */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          <div className="bg-white border rounded-xl p-2.5 text-center shadow-xs">
            <Activity className="w-4 h-4 mx-auto text-rose-500 mb-1" />
            <p className="text-[10px] text-slate-500 font-medium">Glucose</p>
            <p className="text-sm font-bold text-slate-800">{assessment.factors.glucoseRisk}%</p>
          </div>
          <div className="bg-white border rounded-xl p-2.5 text-center shadow-xs">
            <Pill className="w-4 h-4 mx-auto text-blue-500 mb-1" />
            <p className="text-[10px] text-slate-500 font-medium">Medicine</p>
            <p className="text-sm font-bold text-slate-800">{assessment.factors.medicationRisk}%</p>
          </div>
          <div className="bg-white border rounded-xl p-2.5 text-center shadow-xs">
            <Utensils className="w-4 h-4 mx-auto text-amber-500 mb-1" />
            <p className="text-[10px] text-slate-500 font-medium">Meals</p>
            <p className="text-sm font-bold text-slate-800">{assessment.factors.mealRisk}%</p>
          </div>
          <div className="bg-white border rounded-xl p-2.5 text-center shadow-xs">
            <Footprints className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
            <p className="text-[10px] text-slate-500 font-medium">Activity</p>
            <p className="text-sm font-bold text-slate-800">{assessment.factors.activityRisk}%</p>
          </div>
        </div>

        {/* Medical Liability Safe Disclaimer */}
        <p className="text-[11px] text-slate-500 bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 mb-5 leading-relaxed">
          ℹ️ {headings.disclaimer[language]}
        </p>

        {/* Primary Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg transition active:scale-[0.98] text-base"
        >
          {headings.closeBtn[language]}
        </button>
      </div>
    </div>
  );
};
