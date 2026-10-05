import React, { useState } from 'react';
import { CompoundRiskAssessment, Language } from '../types';
import { 
  X, 
  HelpCircle, 
  Activity, 
  Pill, 
  Utensils, 
  Footprints, 
  ShieldCheck, 
  AlertCircle, 
  Sliders, 
  Sparkles, 
  ArrowDownRight, 
  Check, 
  RotateCcw,
  Heart
} from 'lucide-react';

interface WhyModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: CompoundRiskAssessment;
  language: Language;
  onApplySimulatedActions?: (actions: string[]) => void;
}

export const WhyModal: React.FC<WhyModalProps> = ({
  isOpen,
  onClose,
  assessment,
  language,
  onApplySimulatedActions
}) => {
  const [simulatedMeds, setSimulatedMeds] = useState(false);
  const [simulatedWalk, setSimulatedWalk] = useState(false);
  const [simulatedWater, setSimulatedWater] = useState(false);
  const [simulatedEarlyDinner, setSimulatedEarlyDinner] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  // Calculate Counterfactual Simulated Score
  let scoreReduction = 0;
  if (simulatedMeds) scoreReduction += 28;
  if (simulatedWalk) scoreReduction += 18;
  if (simulatedWater) scoreReduction += 12;
  if (simulatedEarlyDinner) scoreReduction += 14;

  const baseScore = assessment.score;
  const simulatedScore = Math.max(8, baseScore - scoreReduction);

  const getSimulatedStatus = (score: number) => {
    if (score > 60) return { label: 'HIGH RISK', color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-950/60', border: 'border-rose-400' };
    if (score > 30) return { label: 'ATTENTION', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-950/60', border: 'border-amber-400' };
    return { label: 'STABLE BASELINE', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-950/60', border: 'border-emerald-400' };
  };

  const simStatus = getSimulatedStatus(simulatedScore);

  const headings = {
    title: {
      mr: 'हे मूल्यमापन का करण्यात आले? (Explainable AI)',
      hi: 'यह आकलन क्यों किया गया? (Explainable AI)',
      en: 'Why this status? (Explainable AI Rationale)'
    },
    factorsTitle: {
      mr: 'आजच्या दिनचर्येचे घटक (Multi-Factor Breakdown):',
      hi: 'आज की दिनचर्या के घटक (Multi-Factor Breakdown):',
      en: 'Today’s Multi-Factor Matrix Breakdown:'
    },
    simulatorTitle: {
      mr: '💡 परस्परसंवादी सिम्युलेटर: मी आत्ता कृती केली तर काय होईल?',
      hi: '💡 इंटरैक्टिव सिम्युलेटर: अगर मैं अभी कदम उठाऊं तो क्या होगा?',
      en: '💡 Interactive Factor Shifter: What if I act right now?'
    },
    simulatorSubtitle: {
      mr: 'पहा कशी छोटी पावले तुमच्या रक्तातील साखरेचा धोका तात्काळ कमी करू शकतात:',
      hi: 'देखें कैसे छोटे प्रयास आपके स्वास्थ्य जोखिम को तुरंत कम कर सकते हैं:',
      en: 'See how micro-interventions dynamically eliminate glycemic compounding risk:'
    },
    disclaimer: {
      mr: 'टीप: आमची AI प्रणाली रोगाचे थेट निदान करत नाही, तर तुमच्या वैयक्तिक बेसलाइनमधील बदल ओळखून वेळीच मार्गदर्शन करते.',
      hi: 'नोट: हमारा AI सिस्टम बीमारी का सीधा निदान नहीं करता, बल्कि आपकी व्यक्तिगत दिनचर्या में आए बदलावों की पहचान कर उचित कदम उठाने में मदद करता है।',
      en: 'Note: Our AI identifies non-linear routine deviations from personal baselines for timely proactive support—not clinical diagnostic claims.'
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
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />
    },
    ATTENTION: {
      border: 'border-amber-500',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      icon: <AlertCircle className="w-6 h-6 text-amber-600" />
    },
    HIGH_RISK: {
      border: 'border-rose-500',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
      icon: <AlertCircle className="w-6 h-6 text-rose-600" />
    }
  };

  const currentTheme = statusColorMap[assessment.status];

  const handleApplyActions = () => {
    const selected: string[] = [];
    if (simulatedMeds) selected.push('Take prescribed medicine');
    if (simulatedWalk) selected.push('15-min gentle stroll');
    if (simulatedWater) selected.push('Hydration + Fiber intake');
    if (simulatedEarlyDinner) selected.push('Circadian dinner timing');
    
    if (onApplySimulatedActions) {
      onApplySimulatedActions(selected);
    }
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className={`bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border-t-8 ${currentTheme.border} relative overflow-hidden my-auto`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-start space-x-3 mb-4">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-2xl">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {headings.title[language]}
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${currentTheme.badge}`}>
                {assessment.title[language]}
              </span>
              <span className="text-xs text-slate-500">
                Current Risk: <strong className="text-slate-900 dark:text-white font-mono">{assessment.score}/100</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Plain Language Explanation Bullets */}
        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700 mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            {headings.factorsTitle[language]}
          </p>
          <ul className="space-y-2.5">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Multi-Factor 4-Bar Metric Matrix */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-center shadow-xs">
            <Activity className="w-4 h-4 mx-auto text-rose-500 mb-1" />
            <p className="text-[10px] text-slate-400 font-medium">Glucose</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{assessment.factors.glucoseRisk}%</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-center shadow-xs">
            <Pill className="w-4 h-4 mx-auto text-blue-500 mb-1" />
            <p className="text-[10px] text-slate-400 font-medium">Medicine</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{assessment.factors.medicationRisk}%</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-center shadow-xs">
            <Utensils className="w-4 h-4 mx-auto text-amber-500 mb-1" />
            <p className="text-[10px] text-slate-400 font-medium">Meals</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{assessment.factors.mealRisk}%</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-center shadow-xs">
            <Footprints className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
            <p className="text-[10px] text-slate-400 font-medium">Activity</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{assessment.factors.activityRisk}%</p>
          </div>
        </div>

        {/* 🌟 RARE FEATURE: Interactive Counterfactual Factor Simulator */}
        <div className="bg-gradient-to-br from-teal-50/90 to-emerald-50/70 dark:from-slate-800 dark:to-teal-950/30 rounded-2xl p-4 border border-teal-200 dark:border-teal-800 mb-4">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-black text-teal-950 dark:text-teal-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{headings.simulatorTitle[language]}</span>
            </h4>
            <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
              Live Simulator
            </span>
          </div>

          <p className="text-[11px] text-teal-800 dark:text-teal-300 mb-3">
            {headings.simulatorSubtitle[language]}
          </p>

          {/* Interactive Toggle Buttons */}
          <div className="space-y-2 mb-3">
            <label className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-teal-100 dark:border-slate-700 text-xs font-semibold cursor-pointer hover:border-teal-400 transition">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={simulatedMeds}
                  onChange={(e) => setSimulatedMeds(e.target.checked)}
                  className="w-4 h-4 accent-teal-600 rounded"
                />
                <span className="text-slate-800 dark:text-slate-200">💊 Take scheduled dose now (Glimepiride/Metformin)</span>
              </div>
              <span className="text-emerald-600 font-bold text-[11px]">-28% Risk</span>
            </label>

            <label className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-teal-100 dark:border-slate-700 text-xs font-semibold cursor-pointer hover:border-teal-400 transition">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={simulatedWalk}
                  onChange={(e) => setSimulatedWalk(e.target.checked)}
                  className="w-4 h-4 accent-teal-600 rounded"
                />
                <span className="text-slate-800 dark:text-slate-200">🚶‍♂️ Complete 15-minute gentle post-meal stroll</span>
              </div>
              <span className="text-emerald-600 font-bold text-[11px]">-18% Risk</span>
            </label>

            <label className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-teal-100 dark:border-slate-700 text-xs font-semibold cursor-pointer hover:border-teal-400 transition">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={simulatedWater}
                  onChange={(e) => setSimulatedWater(e.target.checked)}
                  className="w-4 h-4 accent-teal-600 rounded"
                />
                <span className="text-slate-800 dark:text-slate-200">💧 Drink 2 glasses of warm water + high fiber salad</span>
              </div>
              <span className="text-emerald-600 font-bold text-[11px]">-12% Risk</span>
            </label>
          </div>

          {/* Dynamic Score Outcome Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-teal-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Simulated Horizon Score</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                  {simulatedScore}/100
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${simStatus.bg} ${simStatus.color}`}>
                  {simStatus.label}
                </span>
              </div>
            </div>

            {scoreReduction > 0 ? (
              <div className="text-right">
                <span className="text-xs font-black text-emerald-600 flex items-center justify-end gap-0.5">
                  <ArrowDownRight className="w-4 h-4" /> -{scoreReduction}% Risk
                </span>
                <p className="text-[10px] text-slate-400">Projected recovery</p>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400">Select actions above</span>
            )}
          </div>
        </div>

        {/* Medical Liability Safe Disclaimer */}
        <p className="text-[11px] text-slate-500 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60 rounded-xl p-2.5 mb-4 leading-relaxed">
          ℹ️ {headings.disclaimer[language]}
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleApplyActions}
            disabled={scoreReduction === 0 || applied}
            className={`py-3 px-3 font-bold rounded-2xl text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 cursor-pointer ${
              scoreReduction > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            {applied ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            <span>{applied ? 'Actions Applied! ✅' : 'Apply Actions to Today'}</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-xs transition active:scale-[0.98] text-xs cursor-pointer"
          >
            {headings.closeBtn[language]}
          </button>
        </div>
      </div>
    </div>
  );
};
