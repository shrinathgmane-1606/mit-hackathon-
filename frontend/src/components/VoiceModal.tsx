import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { VoiceEngine, VoiceIntentResult } from '../engine/VoiceEngine';
import { IndianFoodAI } from '../engine/IndianFoodAI';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  X, 
  Sparkles, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  AlertCircle, 
  Info, 
  Edit3, 
  Send, 
  UtensilsCrossed 
} from 'lucide-react';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  onVoiceSuccess: (result: VoiceIntentResult, rawText: string) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  language,
  onVoiceSuccess,
}) => {
  const [activeLang, setActiveLang] = useState<Language>(language);
  const [editableInput, setEditableInput] = useState('');
  const [aiResponseText, setAiResponseText] = useState('');
  const [activeFoodItem, setActiveFoodItem] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);

  const {
    speechState,
    isListening,
    interimTranscript,
    finalTranscript,
    errorMessage,
    audioLevel,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    setFinalTranscript
  } = useSpeechRecognition({
    language: activeLang,
    onResult: (text) => {
      setEditableInput(text);
    }
  });

  // Sync active language with prop
  useEffect(() => {
    setActiveLang(language);
  }, [language]);

  // Sync speech recognition text to editable input
  useEffect(() => {
    if (finalTranscript) {
      setEditableInput(finalTranscript);
    } else if (interimTranscript) {
      setEditableInput(interimTranscript);
    }
  }, [finalTranscript, interimTranscript]);

  // Reset states on open
  useEffect(() => {
    if (isOpen) {
      setEditableInput('');
      setAiResponseText('');
      setActiveFoodItem(null);
      setShowSuccessBadge(false);
      setIsProcessing(false);
      resetTranscript();
    } else {
      stopListening();
    }
  }, [isOpen, resetTranscript, stopListening]);

  if (!isOpen) return null;

  const labels = {
    title: {
      mr: 'SugarSense AI व्हॉइस असिस्टंट 🎤',
      hi: 'SugarSense AI वॉयस असिस्टेंट 🎤',
      en: 'SugarSense AI Voice Assistant 🎤'
    },
    subtitle: {
      mr: 'औषध, साखर, आजचे जेवण किंवा तब्येतीबद्दल सहज बोला',
      hi: 'दवा, शुगर, आज का भोजन या अपनी तबियत के बारे में आराम से बोलें',
      en: 'Speak naturally about your medicines, glucose, meals, or symptoms'
    },
    statusText: {
      idle: {
        mr: 'बोलण्यासाठी खालील मायक्रोफोन दाबा',
        hi: 'बोलने के लिए नीचे माइक दबाएं',
        en: 'Tap the microphone to speak'
      },
      listening: {
        mr: 'मी ऐकत आहे... (Listening)',
        hi: 'मैं सुन रहा हूँ... (Listening)',
        en: 'Listening to your voice...'
      },
      processing: {
        mr: 'माहिती तपासत आहे... (Processing)',
        hi: 'जानकारी प्रोसेस हो रही है...',
        en: 'Processing your request...'
      },
      success: {
        mr: 'आवाज यशस्वीरित्या नोंदवला! (Recognized)',
        hi: 'आवाज़ सफलतापूर्वक दर्ज हुई!',
        en: 'Voice input recognized'
      }
    },
    editableLabel: {
      mr: 'नोंदवलेला मजकूर (तुम्ही येथे बदल करू शकता):',
      hi: 'दर्ज किया गया संदेश (आप इसे बदल भी सकते हैं):',
      en: 'Recognized Voice Command (You can edit before submitting):'
    },
    submitBtn: {
      mr: 'नोंद करा (Process Command)',
      hi: 'जमा करें (Process Command)',
      en: 'Process & Save'
    },
    retryBtn: {
      mr: 'पुन्हा बोला',
      hi: 'फिर से बोलें',
      en: 'Clear & Retry'
    },
    quickSuggestionsTitle: {
      mr: 'किंवा १-टॅप व्हॉइस पर्याय निवडा (Quick Voice Chips):',
      hi: 'या 1-टैप वॉयस विकल्प चुनें (Quick Voice Chips):',
      en: 'Or choose a 1-tap demo voice action:'
    },
    chips: {
      mr: [
        { text: 'माझी सकाळची औषधं घेतली', icon: '💊', desc: 'सकाळचे औषध' },
        { text: 'आज पोहे आणि चहा खाल्ला', icon: '🍛', desc: 'पोहे नाश्ता' },
        { text: 'आज माझं sugar 185 आहे', icon: '🩸', desc: 'साखर १८५' },
        { text: 'मला थोडी चक्कर आणि थकवा जाणवतोय', icon: '⚠️', desc: 'लक्षणे' }
      ],
      hi: [
        { text: 'मैंने सुबह की दवाई ले ली', icon: '💊', desc: 'दवाई ली' },
        { text: 'आज दाल खिचड़ी और कढ़ी खाई', icon: '🍛', desc: 'दाल खिचड़ी' },
        { text: 'आज मेरी शुगर 160 है', icon: '🩸', desc: 'शुगर 160' },
        { text: 'मुझे थोड़ी कमजोरी लग रही है', icon: '⚠️', desc: 'कमजोरी' }
      ],
      en: [
        { text: 'Took my morning diabetes medicines', icon: '💊', desc: 'Meds taken' },
        { text: 'Had Poha and tea for breakfast', icon: '🍛', desc: 'Breakfast logged' },
        { text: 'My glucose reading is 175 mg/dL', icon: '🩸', desc: 'Glucose 175' },
        { text: 'Feeling slightly dizzy and tired', icon: '⚠️', desc: 'Report symptom' }
      ]
    }
  };

  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleExecuteVoiceProcessing = (inputText: string) => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    stopListening();

    // 1. Check Indian Food AI
    const detectedFood = IndianFoodAI.analyzeMealTranscript(inputText);
    setActiveFoodItem(detectedFood);

    // 2. Parse General Intent
    const intentResult = VoiceEngine.parseVoiceCommand(inputText, activeLang);
    const spoken = intentResult.speechResponse[activeLang] || intentResult.speechResponse.en;
    setAiResponseText(spoken);

    // Speak aloud the reply in native language
    VoiceEngine.speak(spoken, activeLang);

    // Show success badge
    setShowSuccessBadge(true);
    setIsProcessing(false);

    // Trigger parent callback
    onVoiceSuccess(intentResult, inputText);
  };

  const handleChipClick = (text: string) => {
    setEditableInput(text);
    setFinalTranscript(text);
    handleExecuteVoiceProcessing(text);
  };

  const activeChips = labels.chips[activeLang] || labels.chips.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top bar with Close button & Language Toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {labels.title[activeLang]}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {labels.subtitle[activeLang]}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Inline Language Selector for Voice */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
              <button
                onClick={() => setActiveLang('en')}
                className={`px-2 py-1 rounded-lg transition ${activeLang === 'en' ? 'bg-white shadow-xs text-teal-700' : 'hover:text-slate-900'}`}
              >
                EN
              </button>
              <button
                onClick={() => setActiveLang('mr')}
                className={`px-2 py-1 rounded-lg transition ${activeLang === 'mr' ? 'bg-white shadow-xs text-teal-700' : 'hover:text-slate-900'}`}
              >
                मराठी
              </button>
              <button
                onClick={() => setActiveLang('hi')}
                className={`px-2 py-1 rounded-lg transition ${activeLang === 'hi' ? 'bg-white shadow-xs text-teal-700' : 'hover:text-slate-900'}`}
              >
                हिंदी
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5">
          {/* Central Interactive Mic Button Area */}
          <div className="text-center py-2">
            <div className="relative inline-flex items-center justify-center mb-3">
              {/* Pulsing Ripple Rings when listening */}
              {isListening && (
                <>
                  <div className="absolute w-32 h-32 rounded-full bg-teal-400/20 animate-ping pointer-events-none" />
                  <div className="absolute w-28 h-28 rounded-full bg-teal-500/30 animate-pulse pointer-events-none" />
                </>
              )}

              {/* Main Button */}
              <button
                onClick={handleToggleMic}
                className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isListening
                    ? 'bg-rose-600 text-white ring-4 ring-rose-300 scale-105 shadow-rose-200'
                    : 'bg-gradient-to-tr from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white hover:scale-105 shadow-teal-200'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-10 h-10 animate-pulse" />
                ) : (
                  <Mic className="w-10 h-10" />
                )}
              </button>
            </div>

            {/* Audio Waveform Simulator Bars */}
            {isListening && (
              <div className="flex items-center justify-center space-x-1.5 h-6 mb-2">
                {[20, 45, 80, 60, 95, 70, 40, 65, 30].map((height, i) => (
                  <span
                    key={i}
                    className="w-1 bg-teal-500 rounded-full transition-all duration-150"
                    style={{
                      height: `${Math.max(6, Math.min(24, height * (audioLevel / 100 + 0.3)))}px`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Current State Text */}
            <p className="text-sm font-bold text-slate-800">
              {isListening
                ? labels.statusText.listening[activeLang]
                : isProcessing
                ? labels.statusText.processing[activeLang]
                : labels.statusText.idle[activeLang]}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isListening ? 'Click mic again to finish' : 'Language: ' + (activeLang === 'en' ? 'English (India)' : activeLang === 'mr' ? 'मराठी (Marathi)' : 'हिंदी (Hindi)')}
            </p>
          </div>

          {/* Permission Error / Unsupported Notification Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 flex items-start space-x-2.5 text-xs">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">{errorMessage}</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Tip: You can still click any of the 1-tap voice samples below or type directly into the text box.
                </p>
              </div>
            </div>
          )}

          {/* Editable Recognized Text Input Area */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 transition-all focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                <span>{labels.editableLabel[activeLang]}</span>
              </label>
              {editableInput && (
                <button
                  onClick={() => {
                    setEditableInput('');
                    resetTranscript();
                  }}
                  className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{labels.retryBtn[activeLang]}</span>
                </button>
              )}
            </div>

            <textarea
              rows={2}
              value={editableInput}
              onChange={(e) => setEditableInput(e.target.value)}
              placeholder={activeLang === 'en' ? 'e.g. "Took my morning medicine" or "Sugar reading is 145"' : activeLang === 'mr' ? 'उदा. "माझी औषधं घेतली" किंवा "आज पोहे खाल्ले"' : 'उदा. "मैंने दवाई ले ली" या "शुगर 160 है"'}
              className="w-full bg-transparent border-0 text-slate-900 font-semibold text-base focus:ring-0 focus:outline-none placeholder:text-slate-400 resize-none"
            />

            {/* Quick Submit Action Button */}
            {editableInput.trim() && (
              <div className="mt-2 pt-2 border-t border-slate-200/60 flex justify-end">
                <button
                  onClick={() => handleExecuteVoiceProcessing(editableInput)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{labels.submitBtn[activeLang]}</span>
                </button>
              </div>
            )}
          </div>

          {/* AI Companion Voice Feedback Speech Bubble */}
          {aiResponseText && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300/80 rounded-2xl p-4 animate-slideDown shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                    SugarSense AI Companion:
                  </p>
                </div>
                <button
                  onClick={() => VoiceEngine.speak(aiResponseText, activeLang)}
                  className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg transition"
                  title="Replay Audio Voice"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                "{aiResponseText}"
              </p>
            </div>
          )}

          {/* Indian Food Plate Intelligence Card if food detected */}
          {activeFoodItem && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 animate-slideDown">
              <div className="flex items-center space-x-2 mb-1">
                <UtensilsCrossed className="w-4 h-4 text-amber-700" />
                <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Indian Food Nutrition Intelligence
                </p>
              </div>
              <p className="text-sm font-bold text-slate-900 mb-1">
                {activeFoodItem.nameEn} ({activeFoodItem.nameMr})
              </p>
              <p className="text-xs text-slate-700 leading-relaxed mb-2">
                💡 <strong>Glycemic Sequencing Tip:</strong> {activeFoodItem.smartTip[activeLang] || activeFoodItem.smartTip.en}
              </p>
              <div className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                Glycemic Index: {activeFoodItem.glycemicIndex}
              </div>
            </div>
          )}

          {/* 1-Tap Quick Voice Demo Chips */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>{labels.quickSuggestionsTitle[activeLang]}</span>
              <span className="text-[10px] text-teal-600 font-normal">Click to test instant intent</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(chip.text)}
                  className="p-3 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-2xl text-left transition flex items-start space-x-2.5 group shadow-xs active:scale-98"
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{chip.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-teal-900">
                      {chip.text}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {chip.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Powered by Browser Web Speech & NLP Intent Engine
          </span>
          <button
            onClick={onClose}
            className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
