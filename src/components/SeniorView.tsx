import React, { useState } from 'react';
import { 
  PersonalBaseline, 
  GlucoseReading, 
  Medication, 
  Meal, 
  ActivityData, 
  CompoundRiskAssessment, 
  Language,
  IndianFoodItem,
  NextBestAction,
  SelectedDetailItem,
  TelemetryEvent
} from '../types';
import { INDIAN_FOOD_DATABASE } from '../engine/IndianFoodAI';
import { SmartNextActionCard } from './SmartNextActionCard';
import { 
  Mic, 
  HelpCircle, 
  Check, 
  Pill, 
  Utensils, 
  Activity, 
  Footprints, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Clock,
  Heart,
  Plus,
  ChevronRight,
  Info
} from 'lucide-react';

interface SeniorViewProps {
  baseline: PersonalBaseline;
  latestGlucose: GlucoseReading | null;
  medications: Medication[];
  meals: Meal[];
  activity: ActivityData;
  assessment: CompoundRiskAssessment;
  language: Language;
  onOpenVoice: () => void;
  onOpenWhy: () => void;
  onOpenTellMeWhatToDo: () => void;
  onToggleMedication: (medId: string) => void;
  onLogMeal: (food: IndianFoodItem) => void;
  onLogGlucoseModal: () => void;
  onSelectDetailItem?: (item: SelectedDetailItem) => void;
  recentEvents?: TelemetryEvent[];
}

export const SeniorView: React.FC<SeniorViewProps> = ({
  baseline,
  latestGlucose,
  medications,
  meals,
  activity,
  assessment,
  language,
  onOpenVoice,
  onOpenWhy,
  onOpenTellMeWhatToDo,
  onToggleMedication,
  onLogMeal,
  onLogGlucoseModal,
  onSelectDetailItem,
  recentEvents = [],
}) => {
  const [showMealPicker, setShowMealPicker] = useState(false);

  // Time-aware personalized greeting
  const getGreeting = () => {
    const preferred = baseline.preferredName[language] || baseline.preferredName.en;
    if (language === 'mr') {
      return `शुभ सकाळ, ${preferred} ❤️`;
    } else if (language === 'hi') {
      return `सुप्रभात, ${preferred} ❤️`;
    } else {
      return `Good Morning, ${preferred} ❤️`;
    }
  };

  // Derive Dynamic Smart Next Best Action
  const smartNextAction: NextBestAction = React.useMemo(() => {
    const pendingCritical = medications.find(m => !m.taken && m.criticality === 'CRITICAL');
    if (pendingCritical) {
      return {
        id: 'take-critical-med',
        title: `Take ${pendingCritical.name} (${pendingCritical.dosage})`,
        subtitle: `Scheduled for ${pendingCritical.scheduledTime}. Stimulates circadian glucose stability.`,
        whyItMatters: 'Adherence to insulin secretagogues before breakfast avoids mid-morning rebound spikes.',
        actionLabel: 'Mark Taken Now',
        actionType: 'LOG_MED',
        urgency: 'CRITICAL',
        targetId: pendingCritical.id
      };
    }

    if (latestGlucose && latestGlucose.value < 70) {
      return {
        id: 'hypo-carbs',
        title: 'Take 15 Grams of Fast-Acting Carbs',
        subtitle: 'Half cup fresh fruit juice or 3 glucose biscuits. Rest comfortably.',
        whyItMatters: 'Restores blood sugar safely within the 15-minute clinical window.',
        actionLabel: 'View Calming Guide',
        actionType: 'VIEW_INSIGHTS',
        urgency: 'CRITICAL'
      };
    }

    if (activity.stepsToday < 1000) {
      return {
        id: 'morning-walk',
        title: 'Enjoy a 10-Minute Gentle Indoor Stroll',
        subtitle: `Completed ${activity.stepsToday} of ${activity.stepTarget} steps today.`,
        whyItMatters: 'Light post-meal movement stimulates non-insulin mediated muscle glucose uptake by up to 25%.',
        actionLabel: 'Tell Me What To Do',
        actionType: 'LOG_WALK',
        urgency: 'LOW'
      };
    }

    return {
      id: 'routine-on-track',
      title: 'Maintain Hydration & Stable Routine',
      subtitle: 'All daily telemetry parameters are closely aligned with your 14-day learned baseline.',
      whyItMatters: 'Circadian consistency is the highest predictor of healthy 14-day HbA1c stability.',
      actionLabel: 'View Detailed AI Rationale',
      actionType: 'VIEW_INSIGHTS',
      urgency: 'LOW'
    };
  }, [medications, latestGlucose, activity]);

  const handleExecuteNextAction = () => {
    if (smartNextAction.actionType === 'LOG_MED' && smartNextAction.targetId) {
      onToggleMedication(smartNextAction.targetId);
    } else if (smartNextAction.actionType === 'VIEW_INSIGHTS') {
      onOpenWhy();
    } else {
      onOpenTellMeWhatToDo();
    }
  };

  const labels = {
    todayHeading: {
      mr: 'आजची आरोग्य स्थिती',
      hi: 'आज की स्वास्थ्य स्थिति',
      en: 'Health Horizon Status'
    },
    whyBtn: {
      mr: 'का? (Why?)',
      hi: 'क्यों? (Why?)',
      en: 'Why?'
    },
    tellMeBtn: {
      mr: '🎤 मला काय करायचं सांगा',
      hi: '🎤 मुझे क्या करना है बताओ',
      en: '🎤 Tell me what to do'
    },
    sugarLabel: {
      mr: 'रक्तातील साखर',
      hi: 'रक्त शर्करा',
      en: 'Blood Glucose'
    },
    medicineLabel: {
      mr: 'औषधे',
      hi: 'दवाइयाँ',
      en: 'Prescriptions'
    },
    mealLabel: {
      mr: 'जेवणाची वेळ',
      hi: 'भोजन समय',
      en: 'Meal Cadence'
    },
    walkLabel: {
      mr: 'चालणे व हालचाल',
      hi: 'सैर व गतिविधि',
      en: 'Daily Steps'
    },
    tapToLogFood: {
      mr: '+ आज काय खाल्ले ते निवडा',
      hi: '+ आज क्या खाया चुनें',
      en: '+ Log Indian Meal'
    },
    takenText: {
      mr: 'घेतली ✅',
      hi: 'ले ली ✅',
      en: 'Confirmed ✅'
    },
    dueText: {
      mr: 'बाकी आहे ⏰',
      hi: 'बाकी है ⏰',
      en: 'Pending ⏰'
    }
  };

  const nextMeal = meals.find(m => m.status === 'DUE') || meals[0];
  const allMedsTaken = medications.every(m => m.taken);

  const statusTheme = {
    STABLE: {
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
    },
    ATTENTION: {
      badge: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      icon: <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
    },
    HIGH_RISK: {
      badge: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
      icon: <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
    }
  }[assessment.status];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Hero Greeting + Status Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {getGreeting()}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Learned personal corridor: <strong>{baseline.postPrandialBaseline.min}–{baseline.postPrandialBaseline.max} mg/dL</strong> • Target: {baseline.baselineDailySteps} steps
            </p>
          </div>

          {/* Explainable AI Status Badge */}
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-2 py-1.5 px-3.5 rounded-full border text-xs font-bold ${statusTheme.badge}`}>
              {statusTheme.icon}
              <span>{assessment.title[language]}</span>
            </div>

            <button
              onClick={onOpenWhy}
              className="py-1.5 px-3 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1 active:scale-95"
              title="Explainable AI Rationale"
            >
              <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>{labels.whyBtn[language]}</span>
            </button>
          </div>
        </div>

        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">
          {assessment.summary[language]}
        </p>

        {assessment.caregiverAlertRecommended && (
          <div className="mt-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
            <span className="text-base">👨‍👩‍👧</span>
            <span>Silent Safety Net dispatched context-aware alert to family caregiver.</span>
          </div>
        )}
      </div>

      {/* 2. Smart Next Best Action Card (Rare Feature) */}
      <SmartNextActionCard
        action={smartNextAction}
        onExecute={handleExecuteNextAction}
        language={language}
      />

      {/* 3. The 4 Essential Glanceable Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Blood Sugar */}
        <div
          onClick={() => {
            if (onSelectDetailItem && latestGlucose) {
              onSelectDetailItem({
                type: 'GLUCOSE',
                title: `Blood Glucose: ${latestGlucose.value} mg/dL`,
                subtitle: `Context: ${latestGlucose.context.replace('_', ' ')}`,
                timestamp: latestGlucose.timestamp,
                statusTag: latestGlucose.isDeviation ? 'ATTENTION' : 'NORMAL',
                details: {
                  reading: `${latestGlucose.value} mg/dL`,
                  personalCorridor: `${baseline.postPrandialBaseline.min}-${baseline.postPrandialBaseline.max} mg/dL`,
                  deviation: latestGlucose.deviationDelta > 0 ? `+${latestGlucose.deviationDelta} mg/dL above avg` : 'Within range',
                  context: latestGlucose.context
                },
                whyItMatters: 'Post-prandial glucose stability protects cardiovascular and micro-vascular endothelial health.',
                recommendations: ['Maintain good hydration with warm water', 'Take scheduled post-meal medication on time']
              });
            } else {
              onLogGlucoseModal();
            }
          }}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 shadow-xs transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>🩸</span> {labels.sugarLabel[language]}
            </span>
            <span className="text-[11px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
              {latestGlucose?.context === 'FASTING' ? 'Fasting' : 'Post-Meal'}
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">
              {latestGlucose?.value || '--'}
            </span>
            <span className="text-xs font-bold text-slate-400">mg/dL</span>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            <span className="text-slate-500">Learned Range: {baseline.postPrandialBaseline.min}–{baseline.postPrandialBaseline.max}</span>
            <span className="text-teal-600 font-bold group-hover:underline flex items-center gap-0.5">
              Details <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 2: Prescriptions */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>💊</span> {labels.medicineLabel[language]}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              allMedsTaken ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {allMedsTaken ? labels.takenText[language] : labels.dueText[language]}
            </span>
          </div>

          <div className="space-y-2 mt-2">
            {medications.slice(0, 2).map((med) => (
              <div
                key={med.id}
                onClick={() => onToggleMedication(med.id)}
                className={`p-2.5 rounded-2xl text-xs font-bold cursor-pointer transition flex items-center justify-between border ${
                  med.taken
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200'
                }`}
              >
                <span>{med.name}</span>
                <span className="text-[10px] font-black uppercase underline">
                  {med.taken ? 'Taken ✅' : 'Tap to take ⏰'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Meal Cadence */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>🍛</span> {labels.mealLabel[language]}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {nextMeal.scheduledTime}
            </span>
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-white">
            {nextMeal.name}
          </p>

          <button
            onClick={() => setShowMealPicker(!showMealPicker)}
            className="mt-3 w-full py-2 px-3 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 text-amber-900 dark:text-amber-200 text-xs font-bold rounded-xl border border-amber-200 dark:border-amber-800 flex items-center justify-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{labels.tapToLogFood[language]}</span>
          </button>
        </div>

        {/* Card 4: Daily Steps */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>🚶</span> {labels.walkLabel[language]}
            </span>
            <span className="text-xs font-bold text-teal-600">
              {Math.round((activity.stepsToday / activity.stepTarget) * 100)}%
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {activity.stepsToday.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-400">/ {activity.stepTarget}</span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (activity.stepsToday / activity.stepTarget) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Indian Food Quick Plate Drawer */}
      {showMealPicker && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-amber-300 dark:border-amber-800 shadow-lg animate-slideDown">
          <p className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-3">
            🇮🇳 Select Indian Meal for Personalized Glycemic Tips:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {INDIAN_FOOD_DATABASE.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onLogMeal(item);
                  setShowMealPicker(false);
                }}
                className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-2xl border border-slate-200 dark:border-slate-700 text-left transition active:scale-95"
              >
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {language === 'mr' ? item.nameMr : item.nameEn}
                </p>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded mt-1.5 inline-block ${
                  item.glycemicIndex === 'LOW' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  GI: {item.glycemicIndex}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Action CTA Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onOpenTellMeWhatToDo}
          className="py-4 px-6 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-2xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center space-x-2 font-black text-sm"
        >
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span>{labels.tellMeBtn[language]}</span>
        </button>

        <button
          onClick={onOpenVoice}
          className="py-4 px-6 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xs transition active:scale-98 flex items-center justify-center space-x-2 font-bold text-sm"
        >
          <Mic className="w-5 h-5 text-teal-600" />
          <span>Talk to AI Voice Companion</span>
        </button>
      </div>
    </div>
  );
};
