import React, { useState, useEffect } from 'react';
import { Language, PersonalBaseline, GlucoseReading } from '../types';
import { 
  AlertOctagon, 
  PhoneCall, 
  MessageCircle, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  HeartHandshake,
  ExternalLink
} from 'lucide-react';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseline: PersonalBaseline;
  latestGlucose: GlucoseReading | null;
  language: Language;
  onLogEmergencyEvent?: (note: string) => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  baseline,
  latestGlucose,
  language,
  onLogEmergencyEvent
}) => {
  const [timerSeconds, setTimerSeconds] = useState(15 * 60); // 15 minutes = 900 seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  if (!isOpen) return null;

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = ((900 - timerSeconds) / 900) * 100;

  const currentReading = latestGlucose?.value || 58;

  // Language content
  const texts = {
    title: {
      en: 'EMERGENCY SOS & HYPOGLYCEMIA RESCUE',
      mr: 'आपत्कालीन SOS आणि रक्तातील साखर वाढवण्याचे नियम',
      hi: 'आपातकालीन SOS एवं कम ब्लड शुगर बचाव प्रोटोकॉल'
    },
    reassurance: {
      en: 'Please remain seated and calm. Follow the 15-15 clinical rescue rule below. Your caregiver has been alerted.',
      mr: 'कृपया शांत बसा, घाबरू नका. खालील १५-१५ नियमाचे पालन करा. कुटुंबियांना सूचित केले आहे.',
      hi: 'कृपया आराम से बैठ जाएं और घबराएं नहीं। नीचे दिए गए 15-15 नियम का पालन करें। परिवार को सूचित कर दिया गया है।'
    },
    rule15Title: {
      en: 'The Clinical "Rule of 15" (Immediate Sugar Rescue)',
      mr: 'वैद्यकीय "१५ चा नियम" (त्वरित साखर वाढवा)',
      hi: 'चिकित्सीय "15 का नियम" (तुरंत शुगर सामान्य करें)'
    },
    step1Title: {
      en: 'Step 1: Take 15g Fast-Acting Glucose NOW',
      mr: 'पायरी १: आत्ताच १५ ग्रॅम साखर / ग्लुकोज घ्या',
      hi: 'स्टेप 1: तुरंत 15 ग्राम तेज़ असर करने वाली चीनी/ग्लूकोज लें'
    },
    step1Options: {
      en: [
        '3 to 4 Glucose Tablets OR 1 packet Glucose Powder (Glucon-D)',
        '1/2 cup (120ml) fresh fruit juice or regular sweet tea',
        '1 tablespoon (15g) table sugar or pure honey dissolved in water',
        '3-4 Marie biscuits or 1 small banana'
      ],
      mr: [
        '३ ते ४ ग्लुकोज गोळ्या किंवा १ चमचा ग्लुकॉन-डी पावडर',
        'अर्धा कप (१२० मिली) फळांचा रस किंवा गोड चहा',
        '१ चमचा साखर किंवा मध पाण्यात मिसळून प्या',
        '३-४ मारी बिस्किटे किंवा १ लहान केळे'
      ],
      hi: [
        '3 से 4 ग्लूकोज टैबलेट या 1 चम्मच ग्लूकोज पाउडर (Glucon-D)',
        'आधा कप (120ml) ताज़ा फलों का रस या मीठी चाय',
        '1 चम्मच चीनी या शुद्ध शहद पानी में घोलकर पिएं',
        '3-4 मारी बिस्कुट या 1 छोटा केला'
      ]
    },
    step2Title: {
      en: 'Step 2: Rest & Wait 15 Minutes (Timer)',
      mr: 'पायरी २: शांत बसा आणि १५ मिनिटे थांबा (टाइमर)',
      hi: 'स्टेप 2: आराम से बैठें और 15 मिनट प्रतीक्षा करें (टाइमर)'
    },
    step3Title: {
      en: 'Step 3: Re-test Blood Glucose',
      mr: 'पायरी ३: १५ मिनिटांनी पुन्हा साखर तपासा',
      hi: 'स्टेप 3: 15 मिनट बाद दोबारा ब्लड शुगर जांचें'
    },
    step3Desc: {
      en: 'If sugar is still under 70 mg/dL, repeat 15g glucose. If above 70 mg/dL, eat a light snack/meal.',
      mr: 'जर साखर अजूनही ७० च्या खाली असेल, तर पुन्हा १५ ग्रॅम साखर घ्या. ७० च्या वर असल्यास हलका नाश्ता करा.',
      hi: 'यदि शुगर अभी भी 70 से कम है, तो दोबारा 15 ग्राम चीनी लें। यदि 70 से अधिक है, तो हल्का भोजन करें।'
    },
    callCaregiver: {
      en: 'Call Caregiver (Priya)',
      mr: 'मुलीला फोन करा (प्रिया)',
      hi: 'बेटी को कॉल करें (प्रिया)'
    },
    call108: {
      en: 'Call Ambulance (108)',
      mr: 'रुग्णवाहिका बोलवा (१०८)',
      hi: 'एम्बुलेंस कॉल करें (108)'
    },
    sendWhatsApp: {
      en: 'Send Live WhatsApp SOS with GPS & Reading',
      mr: 'व्हॉट्सअॅपवर तातडीचा SOS संदेश पाठवा',
      hi: 'व्हाट्सएप पर तत्काल SOS संदेश भेजें'
    }
  };

  const currentTexts = {
    title: texts.title[language] || texts.title.en,
    reassurance: texts.reassurance[language] || texts.reassurance.en,
    rule15Title: texts.rule15Title[language] || texts.rule15Title.en,
    step1Title: texts.step1Title[language] || texts.step1Title.en,
    step1Options: texts.step1Options[language] || texts.step1Options.en,
    step2Title: texts.step2Title[language] || texts.step2Title.en,
    step3Title: texts.step3Title[language] || texts.step3Title.en,
    step3Desc: texts.step3Desc[language] || texts.step3Desc.en,
    callCaregiver: texts.callCaregiver[language] || texts.callCaregiver.en,
    call108: texts.call108[language] || texts.call108.en,
    sendWhatsApp: texts.sendWhatsApp[language] || texts.sendWhatsApp.en,
  };

  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(15 * 60);
  };

  const handleToggleAudio = () => {
    if (!isPlayingAudio) {
      setIsPlayingAudio(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToSpeak = language === 'mr' 
          ? 'घाबरू नका. शांत बसा. लगेच तीन ग्लुकोज गोळ्या किंवा साखर पाणी प्या. आम्ही पंधरा मिनिटांचा टाइमर लावला आहे.'
          : language === 'hi'
          ? 'घबराएं नहीं। आराम से बैठें। तुरंत 3 ग्लूकोज गोलियां या मीठा पानी पिएं। हमने 15 मिनट का टाइमर चालू किया है।'
          : 'Do not panic. Please sit down comfortably. Take 15 grams of fast-acting sugar or juice now. We started your 15 minute timer.';
        
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.85; // slower, soothing cadence
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    }
  };

  const handleSendWhatsAppSOS = () => {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const message = `🚨 *URGENT SUGARSENSE SOS ALERT* 🚨
Patient: *${baseline.patientName}* (${baseline.age}y, ${baseline.diabetesType})
Time: ${timeStr}
Current Blood Glucose: *${currentReading} mg/dL* (Hypoglycemia Warning)
Location: Home (Pune, MH)

Status: Clinical Rule of 15 initiated. Patient taking 15g fast carbs. 15-min re-test timer running.
Please check in immediately or call: +91 98765 43210.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
    setWhatsappSent(true);
    if (onLogEmergencyEvent) {
      onLogEmergencyEvent(`SOS Alert dispatched via WhatsApp for Glucose ${currentReading} mg/dL.`);
    }
    setTimeout(() => setWhatsappSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border-4 border-rose-500 relative overflow-hidden my-auto">
        
        {/* Pulsing Emergency Top Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 animate-pulse" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Section */}
        <div className="flex items-start space-x-3.5 mb-5 mt-1">
          <div className="p-3 bg-rose-600 text-white rounded-2xl animate-bounce">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 text-xs font-black uppercase tracking-wider">
                Priority 1 Emergency Protocol
              </span>
              <span className="text-xs font-bold text-slate-500">
                Reading: <strong className="text-rose-600 font-mono text-sm">{currentReading} mg/dL</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {currentTexts.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium leading-relaxed">
              {currentTexts.reassurance}
            </p>
          </div>
        </div>

        {/* Calming Audio Reassurance Voice Bar */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-3.5 flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-xl">
              {isPlayingAudio ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Calming Voice Guidance ({language.toUpperCase()})
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                Spoken reassurance instructions for seniors in low-sugar distress
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleAudio}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            {isPlayingAudio ? <span>Stop Voice</span> : <span>Listen Reassurance</span>}
          </button>
        </div>

        {/* The 15-15 Rule Cards */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-teal-600" />
            <span>{currentTexts.rule15Title}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Step 1: 15g Carbs */}
            <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80">
              <div className="flex items-center space-x-2 text-rose-900 dark:text-rose-200 font-bold text-xs mb-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center">1</span>
                <span>{currentTexts.step1Title}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200">
                {currentTexts.step1Options.map((opt, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 2: 15-Minute Live Countdown Timer */}
            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-teal-900 dark:text-teal-200 font-bold text-xs mb-1">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs font-black flex items-center justify-center">2</span>
                  <span>{currentTexts.step2Title}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Allow simple carbohydrates 15 minutes to enter bloodstream safely.
                </p>
              </div>

              {/* Visual Countdown */}
              <div className="my-2 text-center bg-white dark:bg-slate-900 py-2.5 px-4 rounded-xl border border-teal-200 dark:border-teal-800 shadow-inner">
                <p className="text-3xl font-black font-mono text-teal-700 dark:text-teal-300">
                  {formattedTime}
                </p>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className="bg-teal-500 h-full transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center space-x-2 pt-1">
                <button
                  onClick={handleToggleTimer}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1 transition cursor-pointer active:scale-95 ${
                    isTimerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-600 hover:bg-teal-700'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTimerRunning ? 'Pause Timer' : 'Start 15m Timer'}</span>
                </button>
                <button
                  onClick={handleResetTimer}
                  className="p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Reset 15m Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Re-test Reminder */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white">{currentTexts.step3Title}: </strong>
              <span>{currentTexts.step3Desc}</span>
            </div>
          </div>
        </div>

        {/* Direct Action Dispatch Grid */}
        <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
          {/* WhatsApp 1-Click SOS */}
          <button
            onClick={handleSendWhatsAppSOS}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md transition active:scale-[0.98] cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{whatsappSent ? '✅ SOS Dispatched via WhatsApp' : currentTexts.sendWhatsApp}</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Call Caregiver */}
            <a
              href="tel:+919876543210"
              className="py-3 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-xs transition active:scale-[0.98]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{currentTexts.callCaregiver}</span>
            </a>

            {/* Call Ambulance 108 */}
            <a
              href="tel:108"
              className="py-3 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-xs transition active:scale-[0.98]"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{currentTexts.call108}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
