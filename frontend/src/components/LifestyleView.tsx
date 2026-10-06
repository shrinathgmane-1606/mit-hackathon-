import React, { useState } from 'react';
import { 
  Language, 
  HydrationData, 
  SleepData, 
  FitnessSuggestion, 
  PersonalBaseline 
} from '../types';
import { MOCK_FITNESS_SUGGESTIONS } from '../data/mockProfiles';
import { 
  Droplets, 
  Moon, 
  Sun, 
  Activity, 
  Utensils, 
  Sparkles, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldAlert,
  Flame,
  Clock,
  Heart
} from 'lucide-react';

interface LifestyleViewProps {
  hydration: HydrationData;
  onUpdateHydration: (data: HydrationData) => void;
  sleep: SleepData;
  baseline: PersonalBaseline;
  language: Language;
}

export const LifestyleView: React.FC<LifestyleViewProps> = ({
  hydration,
  onUpdateHydration,
  sleep,
  baseline,
  language
}) => {
  const [activeExercise, setActiveExercise] = useState<FitnessSuggestion | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Timer interval handler
  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleStartExercise = (exercise: FitnessSuggestion) => {
    setActiveExercise(exercise);
    setTimerSeconds(exercise.durationMin * 60);
    setIsTimerRunning(true);
  };

  const handleAddWater = () => {
    if (hydration.glassesDrunk < 12) {
      onUpdateHydration({
        ...hydration,
        glassesDrunk: hydration.glassesDrunk + 1,
        lastLogTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  const handleRemoveWater = () => {
    if (hydration.glassesDrunk > 0) {
      onUpdateHydration({
        ...hydration,
        glassesDrunk: hydration.glassesDrunk - 1,
        lastLogTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-inner">
            <Activity className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {language === 'mr' ? 'जीवनशैली व सौम्य व्यायाम' : language === 'hi' ? 'लाइफस्टाइल व हल्का व्यायाम' : 'Lifestyle & Fitness Guidance'}
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                Senior Safe
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-0.5">
              {language === 'mr'
                ? 'पाणी, झोप, भारतीय आहार जागरूकता आणि ज्येष्ठांसाठी सुरक्षित हलके व्यायाम.'
                : language === 'hi'
                ? 'हाइड्रेशन, नींद, भारतीय खानपान जागरूकता और बुजुर्गों के लिए अनुकूलित गतिविधियां।'
                : 'Hydration, sleep rhythms, Indian food sequencing & gentle mobility exercises.'}
            </p>
          </div>
        </div>
      </div>

      {/* 1. Hydration & Sleep Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Hydration Tracker */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {language === 'mr' ? 'पाणी पिण्याची नोंद (हायड्रेशन)' : language === 'hi' ? 'दैनिक पानी का सेवन (हाइड्रेशन)' : 'Daily Hydration Tracker'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Target: {hydration.targetGlasses} glasses (2.0 Liters)
                  </p>
                </div>
              </div>

              <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
                {hydration.glassesDrunk} <span className="text-sm font-bold text-slate-400">/ {hydration.targetGlasses}</span>
              </span>
            </div>

            {/* Visual Glass Icons */}
            <div className="grid grid-cols-8 gap-2 my-5">
              {Array.from({ length: hydration.targetGlasses }).map((_, idx) => {
                const isFilled = idx < hydration.glassesDrunk;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onUpdateHydration({
                        ...hydration,
                        glassesDrunk: idx + 1,
                        lastLogTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      });
                    }}
                    className={`h-12 rounded-xl flex flex-col items-center justify-end pb-1.5 transition-all border ${
                      isFilled
                        ? 'bg-sky-500 text-white border-sky-600 shadow-xs scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 hover:border-sky-400'
                    }`}
                    title={`Glass ${idx + 1}`}
                  >
                    <Droplets className={`w-4 h-4 ${isFilled ? 'fill-white text-white' : ''}`} />
                    <span className="text-[9px] font-bold mt-0.5">{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 bg-sky-50/70 dark:bg-sky-950/30 p-2.5 rounded-xl border border-sky-100 dark:border-sky-900/50">
              💡 <strong>{language === 'mr' ? 'आरोग्य टीप:' : language === 'hi' ? 'स्वास्थ्य सलाह:' : 'Senior Benefit:'}</strong>{' '}
              {language === 'mr'
                ? 'योग्य प्रमाणात पाणी प्यायल्याने मूत्रपिंड (किडनी) साखरेचे व्यवस्थित उत्सर्जन करतात आणि थकवा दूर राहतो.'
                : language === 'hi'
                ? 'पर्याप्त पानी पीने से किडनी शुगर को बेहतर फिल्टर करती है और शरीर में निर्जलीकरण (डिहाइड्रेशन) नहीं होता।'
                : 'Adequate hydration aids renal glucose excretion and prevents orthostatic hypotension upon standing.'}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <span className="text-xs text-slate-400">
              Last logged: <strong>{hydration.lastLogTime}</strong>
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRemoveWater}
                disabled={hydration.glassesDrunk <= 0}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={handleAddWater}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ 1 Glass</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sleep & Circadian Rhythm Tracker */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {language === 'mr' ? 'झोप व नैसर्गिक लय' : language === 'hi' ? 'नींद व सर्केडियन रिदम' : 'Sleep & Circadian Rhythm'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Last Night: {sleep.bedtime} → {sleep.wakeTime}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {sleep.hoursSlept} <span className="text-xs font-bold text-slate-400">hrs</span>
                </span>
                <span className="block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800 text-center mt-0.5">
                  {sleep.sleepQuality} Quality
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Deep Sleep</p>
                <p className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">
                  {sleep.deepSleepPercent}% <span className="text-xs font-semibold text-emerald-500">(Optimal)</span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Fasting Cortisol Impact</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Low Spike Risk</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 bg-indigo-50/70 dark:bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
              🧠 <strong>{language === 'mr' ? 'AI विश्लेषण:' : language === 'hi' ? 'AI विश्लेषण:' : 'Circadian Sync:'}</strong>{' '}
              {language === 'mr'
                ? '७ तासांहून अधिक शांत झोपेमुळे सकाळी कॉर्टिसोल हार्मोन्स नियंत्रित राहतात व सकाळची साखर अचानक वाढत नाही.'
                : language === 'hi'
                ? '7 घंटे से अधिक गहरी नींद सुबह के कोर्टिसोल हार्मोन को स्थिर रखती है, जिससे फास्टिंग शुगर नहीं बढ़ती।'
                : 'Consistent 7+ hour restorative sleep suppresses nocturnal cortisol surges, protecting basal insulin sensitivity.'}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-xs text-slate-500">
            <span>Target Bedtime: <strong>{baseline.typicalBedtime}</strong></span>
            <span>Target Wake: <strong>{baseline.typicalWakeupTime}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Indian Food Awareness & Glycemic Sequencing */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'mr' ? 'भारतीय आहार जागरूकता व अन्न क्रमवारी (Food Sequencing)' : language === 'hi' ? 'भारतीय खानपान व फूड सीक्वेंसिंग गाइड' : 'Indian Food Awareness & Sequencing'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clinically validated order of eating to flatten post-prandial spikes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">1</span>
              <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                {language === 'mr' ? 'सुरुवातीला: फायबर व सॅलड' : language === 'hi' ? 'पहले: फाइबर व सलाद' : 'Step 1: Fiber & Greens'}
              </h4>
            </div>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
              Cucumber (काकडी), Tomatoes, Methi/Palak Sabzi. Creates a viscous mesh in the small intestine.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60 space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">2</span>
              <h4 className="font-bold text-sm text-teal-900 dark:text-teal-200">
                {language === 'mr' ? 'नंतर: प्रथिने व चांगले फॅट्स' : language === 'hi' ? 'फिर: प्रोटीन व दाल' : 'Step 2: Protein & Fats'}
              </h4>
            </div>
            <p className="text-xs text-teal-800 dark:text-teal-300 font-medium">
              Moong Dal, Sprouted Usal, Curd (ताक), Paneer or Peanuts. Slows down gastric emptying.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">3</span>
              <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                {language === 'mr' ? 'शेवटी: कार्बोहायड्रेट्स' : language === 'hi' ? 'अंत में: अनाज व रोटी' : 'Step 3: Complex Carbs'}
              </h4>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
              1 Jowar/Bajra Bhakri or Brown Rice Khichdi. Glucose is absorbed at 40% slower rate.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Gentle Exercise & Fitness Suggestions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'mr' ? 'ज्येष्ठांसाठी सुरक्षित सौम्य व्यायाम' : language === 'hi' ? 'वरिष्ठ नागरिकों के लिए सुरक्षित व्यायाम' : 'Tailored Senior Fitness & Chair Yoga'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gentle muscle contractions that activate GLUT4 glucose receptors without joint strain
              </p>
            </div>
          </div>

          <span className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800 font-medium">
            ⚠️ General fitness — not medical prescription
          </span>
        </div>

        {/* Exercise Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_FITNESS_SUGGESTIONS.map((ex) => {
            const isCurrentActive = activeExercise?.id === ex.id;

            return (
              <div
                key={ex.id}
                className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                  isCurrentActive
                    ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/70 hover:border-teal-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                      {ex.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ex.durationMin} mins</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {ex.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {ex.instructions[language] || ex.instructions.en}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-teal-700 dark:text-teal-400 font-bold">
                    {ex.intensity}
                  </span>

                  <button
                    onClick={() => handleStartExercise(ex)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{language === 'mr' ? 'सुरू करा' : language === 'hi' ? 'आरंभ करें' : 'Start Guide'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Exercise Live Helper Modal */}
      {activeExercise && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 bg-gradient-to-r from-teal-700 to-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-teal-200" />
                <h3 className="font-bold text-base sm:text-lg">
                  {activeExercise.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveExercise(null);
                  setIsTimerRunning(false);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 text-center space-y-5">
              {/* Timer Display */}
              <div className="w-32 h-32 mx-auto rounded-full bg-teal-50 dark:bg-teal-950/60 border-4 border-teal-500 flex flex-col items-center justify-center shadow-inner">
                <span className="text-3xl font-black text-teal-700 dark:text-teal-300 font-mono">
                  {formatTimer(timerSeconds)}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Remaining
                </span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-left border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                  {language === 'mr' ? 'कसे करावे?' : language === 'hi' ? 'कैसे करें?' : 'Step-by-Step Instructions'}
                </p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {activeExercise.instructions[language] || activeExercise.instructions.en}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                  ✨ <strong>Benefit:</strong> {activeExercise.benefits}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => setIsTimerRunning(prev => !prev)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm text-white flex items-center space-x-2 shadow-md ${
                    isTimerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-600 hover:bg-teal-700'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
                </button>

                <button
                  onClick={() => setTimerSeconds(activeExercise.durationMin * 60)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
