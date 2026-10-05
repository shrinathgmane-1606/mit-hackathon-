import React from 'react';
import { 
  PersonalBaseline, 
  GlucoseReading, 
  CompoundRiskAssessment, 
  Language, 
  Medication, 
  Meal, 
  ActivityData 
} from '../types';
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Activity, 
  Pill, 
  Utensils, 
  Footprints, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle,
  ArrowRight,
  Info
} from 'lucide-react';

interface InsightsViewProps {
  baseline: PersonalBaseline;
  latestGlucose: GlucoseReading | null;
  medications: Medication[];
  meals: Meal[];
  activity: ActivityData;
  assessment: CompoundRiskAssessment;
  language: Language;
  onOpenWhy: () => void;
  onOpenTellMeWhatToDo: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  baseline,
  latestGlucose,
  medications,
  meals,
  activity,
  assessment,
  language,
  onOpenWhy,
  onOpenTellMeWhatToDo,
}) => {
  const whyList = assessment.whyExplanation[language] || assessment.whyExplanation.en;
  const actionList = assessment.recommendedActions[language] || assessment.recommendedActions.en;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* 1. Insights Hero Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Smart AI Routine Insights
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold uppercase">
                  Personalized
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                SugarSense converts multi-sensor telemetry into explainable answers: <em>What changed, Why it matters, and What to do next.</em>
              </p>
            </div>
          </div>

          <button
            onClick={onOpenWhy}
            className="flex items-center space-x-1.5 py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-teal-600" />
            <span>Open Explainable AI Matrix</span>
          </button>
        </div>
      </div>

      {/* 2. The Core 3-Question Framework: What Changed? Why it matters? What to do next? */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: What Changed? */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>1. What Changed Today?</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Routine Telemetry Observation
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {whyList.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Compared against {baseline.preferredName.en}'s 14-day learned pattern.
          </div>
        </div>

        {/* Card 2: Why Does It Matter? */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <Activity className="w-4 h-4 text-amber-600" />
              <span>2. Why Does It Matter?</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Clinical Context & Compounding
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {assessment.status === 'STABLE'
                ? 'Your metabolic circadian rhythm is harmonized. Timely medication and steady meals prevent steep glycemic spikes and sudden hypoglycemia dips.'
                : assessment.status === 'ATTENTION'
                ? 'Delayed meal intake causes liver glycogen release while medication timing drift can create delayed absorption curves.'
                : 'Synergistic risk: Missing critical insulin secretagogues while experiencing elevated glucose and reduced mobility increases acute vulnerability.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              assessment.status === 'STABLE' ? 'bg-emerald-100 text-emerald-800' :
              assessment.status === 'ATTENTION' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
            }`}>
              Compound Risk Index: {assessment.score}/100
            </span>
          </div>
        </div>

        {/* Card 3: What Should You Do Next? */}
        <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>3. What Should You Do Next?</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Recommended Simple Actions
            </h3>
            <ul className="space-y-2 text-xs text-slate-200">
              {actionList.map((act, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={onOpenTellMeWhatToDo}
              className="w-full py-2.5 px-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center space-x-1.5"
            >
              <span>View Step-by-Step Calming Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Multi-Factor Telemetry Contribution Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
          Today's Multi-Factor Risk Vector Weights
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Glucose Factor */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <span className="text-base">🩸</span> Glucose Factor
              </span>
              <span className="text-xs font-black text-slate-900">{assessment.factors.glucoseRisk}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all"
                style={{ width: `${assessment.factors.glucoseRisk}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Reading: {latestGlucose?.value || '--'} mg/dL vs baseline {baseline.postPrandialBaseline.avg} mg/dL
            </p>
          </div>

          {/* Medication Factor */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <span className="text-base">💊</span> Medication Factor
              </span>
              <span className="text-xs font-black text-slate-900">{assessment.factors.medicationRisk}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all"
                style={{ width: `${assessment.factors.medicationRisk}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              {medications.filter(m => m.taken).length}/{medications.length} doses confirmed on-time
            </p>
          </div>

          {/* Meal Cadence */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <span className="text-base">🍛</span> Meal Cadence
              </span>
              <span className="text-xs font-black text-slate-900">{assessment.factors.mealRisk}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${assessment.factors.mealRisk}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Circadian meal timing stability
            </p>
          </div>

          {/* Activity */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <span className="text-base">🚶</span> Mobility
              </span>
              <span className="text-xs font-black text-slate-900">{assessment.factors.activityRisk}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${assessment.factors.activityRisk}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              {activity.stepsToday} / {activity.stepTarget} steps completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
