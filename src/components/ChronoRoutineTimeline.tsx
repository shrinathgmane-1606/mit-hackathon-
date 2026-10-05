import React, { useState } from 'react';
import { Medication, Meal, ActivityData, GlucoseReading, Language, IndianFoodItem } from '../types';
import { 
  Sun, 
  Sunrise, 
  Sunset, 
  Moon, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  Pill, 
  Utensils, 
  Activity, 
  Footprints, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Info
} from 'lucide-react';

interface ChronoRoutineTimelineProps {
  medications: Medication[];
  meals: Meal[];
  activity: ActivityData;
  latestGlucose: GlucoseReading | null;
  language: Language;
  onToggleMedication: (medId: string) => void;
  onLogGlucoseModal: () => void;
  onOpenTellMeWhatToDo: () => void;
}

interface RoutinePhase {
  id: 'morning' | 'afternoon' | 'evening' | 'night';
  name: { en: string; mr: string; hi: string };
  timeRange: string;
  icon: React.ReactNode;
  bgGradient: string;
  borderColor: string;
}

export const ChronoRoutineTimeline: React.FC<ChronoRoutineTimelineProps> = ({
  medications,
  meals,
  activity,
  latestGlucose,
  language,
  onToggleMedication,
  onLogGlucoseModal,
  onOpenTellMeWhatToDo
}) => {
  const [activePhase, setActivePhase] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({
    'fasting-sugar': !!latestGlucose && latestGlucose.context === 'FASTING',
    'morning-breakfast': true,
    'lunch-walk': activity.stepsToday > 1500,
    'evening-hydration': true
  });

  const toggleItem = (itemId: string) => {
    setCompletedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const phases: RoutinePhase[] = [
    {
      id: 'morning',
      name: { en: 'Morning Rhythm', mr: 'सकाळची दिनचर्या', hi: 'सुबह की दिनचर्या' },
      timeRange: '07:00 – 10:30',
      icon: <Sunrise className="w-4 h-4 text-amber-500" />,
      bgGradient: 'from-amber-500/10 to-orange-500/5',
      borderColor: 'border-amber-200 dark:border-amber-800/60'
    },
    {
      id: 'afternoon',
      name: { en: 'Afternoon Cadence', mr: 'दुपारची दिनचर्या', hi: 'दोपहर की दिनचर्या' },
      timeRange: '12:30 – 15:30',
      icon: <Sun className="w-4 h-4 text-yellow-500" />,
      bgGradient: 'from-yellow-500/10 to-amber-500/5',
      borderColor: 'border-yellow-200 dark:border-yellow-800/60'
    },
    {
      id: 'evening',
      name: { en: 'Evening Refresh', mr: 'संध्याकाळची दिनचर्या', hi: 'शाम की दिनचर्या' },
      timeRange: '17:00 – 19:30',
      icon: <Sunset className="w-4 h-4 text-orange-500" />,
      bgGradient: 'from-orange-500/10 to-rose-500/5',
      borderColor: 'border-orange-200 dark:border-orange-800/60'
    },
    {
      id: 'night',
      name: { en: 'Night Wind Down', mr: 'रात्रीची दिनचर्या', hi: 'रात की दिनचर्या' },
      timeRange: '20:00 – 22:30',
      icon: <Moon className="w-4 h-4 text-indigo-500" />,
      bgGradient: 'from-indigo-500/10 to-purple-500/5',
      borderColor: 'border-indigo-200 dark:border-indigo-800/60'
    }
  ];

  const headers = {
    title: {
      en: "Today's Chrono-Routine Plan",
      mr: 'आजची वैयक्तिक दिनचर्या (Chrono-Routine)',
      hi: 'आज की व्यक्तिगत दिनचर्या (Chrono-Routine)'
    },
    subtitle: {
      en: 'Circadian-aligned daily health roadmap tuned to your learned baseline',
      mr: 'तुमच्या वैयक्तिक वेळेनुसार ठरवलेले अचूक आरोग्य वेळापत्रक',
      hi: 'आपकी जैविक घड़ी और स्वास्थ्य पैटर्न के अनुसार दैनिक रूपरेखा'
    }
  };

  const getPhaseTasks = (phaseId: 'morning' | 'afternoon' | 'evening' | 'night') => {
    switch (phaseId) {
      case 'morning':
        return [
          {
            id: 'fasting-sugar',
            time: '07:15 AM',
            title: language === 'mr' ? 'उपाशीपोटी साखर तपासणे' : language === 'hi' ? 'खाली पेट शुगर जांच' : 'Fasting Glucose Check',
            desc: language === 'mr' ? 'लक्ष्य: ८०-११० mg/dL' : language === 'hi' ? 'लक्ष्य: 80-110 mg/dL' : 'Target: 80–110 mg/dL (Learned range)',
            type: 'GLUCOSE',
            isCompleted: !!completedItems['fasting-sugar'],
            onAction: onLogGlucoseModal,
            actionLabel: 'Log Glucose'
          },
          {
            id: medications[0]?.id || 'med-glimepiride',
            time: medications[0]?.scheduledTime || '08:00 AM',
            title: `${medications[0]?.name || 'Glimepiride'} (${medications[0]?.dosage || '1mg'})`,
            desc: language === 'mr' ? 'नाश्त्यापूर्वी १० मिनिटे घ्या' : language === 'hi' ? 'नाश्ते से 10 मिनट पहले लें' : 'Take 10 mins before breakfast',
            type: 'MED',
            isCompleted: medications[0]?.taken || false,
            onAction: () => onToggleMedication(medications[0]?.id || ''),
            actionLabel: medications[0]?.taken ? 'Taken ✅' : 'Tap Taken'
          },
          {
            id: 'morning-breakfast',
            time: '08:30 AM',
            title: language === 'mr' ? 'पौष्टिक नाश्ता (कांदा पोहे / इडली)' : language === 'hi' ? 'पौष्टिक नाश्ता (पोहा / इडली)' : 'Nutritious Breakfast (Poha + Sprouts)',
            desc: language === 'mr' ? 'प्रथम मूग उसळ खा, नंतर पोहे' : language === 'hi' ? 'पहले अंकुरित मूंग खाएं, फिर पोहा' : 'Food Sequencing: Protein first, then carbs',
            type: 'MEAL',
            isCompleted: !!completedItems['morning-breakfast'],
            onAction: () => toggleItem('morning-breakfast'),
            actionLabel: 'Confirmed'
          }
        ];
      case 'afternoon':
        return [
          {
            id: 'balanced-lunch',
            time: '01:00 PM',
            title: language === 'mr' ? 'समतोल दुपारचे जेवण (दाल-रोटी-सलाड)' : language === 'hi' ? 'संतुलित दोपहर का भोजन (दाल-रोटी-सलाद)' : 'Balanced Lunch (Salad + Dal + 2 Rotis)',
            desc: language === 'mr' ? 'काकडी-गाजर सलाड आधी खा' : language === 'hi' ? 'सलाद पहले खाएं' : 'Food sequencing: Eat fresh salad 5 mins prior',
            type: 'MEAL',
            isCompleted: true,
            onAction: () => toggleItem('balanced-lunch'),
            actionLabel: 'Completed'
          },
          {
            id: medications[1]?.id || 'med-metformin',
            time: medications[1]?.scheduledTime || '01:30 PM',
            title: `${medications[1]?.name || 'Metformin SR'} (${medications[1]?.dosage || '500mg'})`,
            desc: language === 'mr' ? 'जेवणानंतर लगेच पाण्यासोबत घ्या' : language === 'hi' ? 'भोजन के तुरंत बाद पानी से लें' : 'Take with water immediately after lunch',
            type: 'MED',
            isCompleted: medications[1]?.taken || false,
            onAction: () => onToggleMedication(medications[1]?.id || ''),
            actionLabel: medications[1]?.taken ? 'Taken ✅' : 'Tap Taken'
          },
          {
            id: 'lunch-walk',
            time: '02:00 PM',
            title: language === 'mr' ? '१० मिनिटे हलकी शतपावली' : language === 'hi' ? '10 मिनट की हल्की सैर' : '10-Min Gentle Indoor Stroll',
            desc: language === 'mr' ? 'जेवणानंतर साखर नियंत्रित राहते' : language === 'hi' ? 'भोजन के बाद ब्लड शुगर स्थिर रहता है' : 'Stimulates non-insulin glucose clearance',
            type: 'WALK',
            isCompleted: !!completedItems['lunch-walk'],
            onAction: () => toggleItem('lunch-walk'),
            actionLabel: 'Done'
          }
        ];
      case 'evening':
        return [
          {
            id: 'evening-hydration',
            time: '05:30 PM',
            title: language === 'mr' ? 'कोमट पाणी व भाजलेले मखाने / चणे' : language === 'hi' ? 'गुनगुना पानी व भुने मखाने / चने' : 'Warm Water & Roasted Makhana / Chana',
            desc: language === 'mr' ? 'कमी ग्लायसेमिक इंडेक्स अल्पोपहार' : language === 'hi' ? 'लो-ग्लाइसेमिक हेल्दी स्नैक' : 'Low GI snack prevents pre-dinner dips',
            type: 'MEAL',
            isCompleted: !!completedItems['evening-hydration'],
            onAction: () => toggleItem('evening-hydration'),
            actionLabel: 'Logged'
          },
          {
            id: 'evening-sugar-check',
            time: '06:30 PM',
            title: language === 'mr' ? 'संध्याकाळची साखर तपासणी' : language === 'hi' ? 'शाम की शुगर जांच' : 'Post-Prandial Telemetry Check',
            desc: language === 'mr' ? 'ऐच्छिक: जर थकवा जाणवत असेल तर' : language === 'hi' ? 'वैकल्पिक: यदि सुस्ती लगे' : 'Target: 110–140 mg/dL',
            type: 'GLUCOSE',
            isCompleted: false,
            onAction: onLogGlucoseModal,
            actionLabel: 'Log Glucose'
          }
        ];
      case 'night':
        return [
          {
            id: 'night-dinner',
            time: '08:00 PM',
            title: language === 'mr' ? 'हलके रात्रीचे जेवण (मूग डाळ खिचडी)' : language === 'hi' ? 'हल्का रात का भोजन (मूंग दाल खिचड़ी)' : 'Light Dinner (Moong Dal Khichdi + Curd)',
            desc: language === 'mr' ? 'रात्री उशिरा जेवणे टाळा' : language === 'hi' ? 'रात में देर से भोजन से बचें' : 'Early dinner prevents overnight dawn effect',
            type: 'MEAL',
            isCompleted: false,
            onAction: () => toggleItem('night-dinner'),
            actionLabel: 'Mark Done'
          },
          {
            id: 'restorative-sleep',
            time: '10:00 PM',
            title: language === 'mr' ? 'शांत व गाढ झोप (७-८ तास)' : language === 'hi' ? 'शांतिपूर्ण नींद (7-8 घंटे)' : 'Restorative Sleep (7–8 hrs)',
            desc: language === 'mr' ? 'झोपेपूर्वी मोबाईल बाजूला ठेवा' : language === 'hi' ? 'सोने से पहले स्क्रीन बंद रखें' : 'Crucial for circadian cortisol & insulin recovery',
            type: 'REST',
            isCompleted: false,
            onAction: onOpenTellMeWhatToDo,
            actionLabel: 'Sleep Tips'
          }
        ];
    }
  };

  const currentTasks = getPhaseTasks(activePhase);
  const currentPhaseObj = phases.find(p => p.id === activePhase)!;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-2xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              {headers.title[language]}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {headers.subtitle[language]}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Circadian Optimized</span>
        </span>
      </div>

      {/* 4-Phase Chronological Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setActivePhase(phase.id)}
            className={`p-3 rounded-2xl border text-left transition active:scale-[0.98] cursor-pointer ${
              activePhase === phase.id
                ? 'bg-teal-50 dark:bg-slate-800 border-teal-500 dark:border-teal-400 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="p-1 rounded-lg bg-white dark:bg-slate-900 shadow-2xs">
                {phase.icon}
              </span>
              <span className="text-[10px] font-bold text-slate-400 font-mono">
                {phase.timeRange}
              </span>
            </div>
            <p className={`text-xs font-black truncate ${
              activePhase === phase.id ? 'text-teal-900 dark:text-teal-200' : 'text-slate-700 dark:text-slate-300'
            }`}>
              {phase.name[language]}
            </p>
          </button>
        ))}
      </div>

      {/* Selected Phase Items List */}
      <div className={`rounded-2xl border p-4 bg-gradient-to-br ${currentPhaseObj.bgGradient} ${currentPhaseObj.borderColor} space-y-3`}>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
          <span className="flex items-center gap-1.5">
            {currentPhaseObj.icon}
            <span>{currentPhaseObj.name[language]} ({currentPhaseObj.timeRange})</span>
          </span>
          <span className="text-[11px] text-slate-500">
            {currentTasks.filter(t => t.isCompleted).length} / {currentTasks.length} Completed
          </span>
        </div>

        <div className="space-y-2.5">
          {currentTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                task.isCompleted
                  ? 'bg-white/90 dark:bg-slate-900/90 border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-white'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={task.onAction}
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                  title="Toggle status"
                >
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black font-mono text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-1.5 py-0.2 rounded">
                      {task.time}
                    </span>
                    <span className={`text-xs font-bold ${task.isCompleted ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {task.desc}
                  </p>
                </div>
              </div>

              <button
                onClick={task.onAction}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex-shrink-0 active:scale-95 ${
                  task.isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-teal-600'
                }`}
              >
                {task.actionLabel}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
