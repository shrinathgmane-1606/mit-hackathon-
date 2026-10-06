import React from 'react';
import { CompoundRiskAssessment, Language } from '../types';
import { VoiceEngine } from '../engine/VoiceEngine';
import { X, Volume2, CheckCircle2, ArrowRight } from 'lucide-react';

interface TellMeWhatToDoModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: CompoundRiskAssessment;
  language: Language;
}

export const TellMeWhatToDoModal: React.FC<TellMeWhatToDoModalProps> = ({
  isOpen,
  onClose,
  assessment,
  language,
}) => {
  if (!isOpen) return null;

  const actions = assessment.recommendedActions[language] || assessment.recommendedActions.en;

  const labels = {
    title: {
      mr: 'आता पुढे काय करायचे? (पुढील पावले)',
      hi: 'अब आगे क्या करना है? (सरल कदम)',
      en: 'What should I do next? (Simple Steps)'
    },
    subtitle: {
      mr: 'घाबरण्याचे कारण नाही. खालील सोप्या गोष्टींचे पालन करा:',
      hi: 'घबराने की कोई बात नहीं है। बस इन सरल चरणों का पालन करें:',
      en: 'No need to worry. Simply follow these calm, straightforward steps:'
    },
    listenBtn: {
      mr: 'मोठ्याने ऐका (Listen)',
      hi: 'आवाज़ में सुनें (Listen)',
      en: 'Listen Aloud'
    },
    doneBtn: {
      mr: 'मी हे केले (Done)',
      hi: 'मैंने यह कर लिया (Done)',
      en: 'I Did This'
    }
  };

  const handleSpeakActions = () => {
    const speechText = actions.join('. ');
    VoiceEngine.speak(speechText, language);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-teal-500 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="mb-4 pr-10">
          <h2 className="text-2xl font-black text-slate-900 leading-snug">
            {labels.title[language]}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {labels.subtitle[language]}
          </p>
        </div>

        {/* Listen Aloud Button */}
        <button
          onClick={handleSpeakActions}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-2xl border border-teal-200 shadow-sm transition mb-5"
        >
          <Volume2 className="w-5 h-5 text-teal-600 animate-pulse" />
          <span>{labels.listenBtn[language]}</span>
        </button>

        {/* Big Action Cards for Seniors */}
        <div className="space-y-3.5 mb-6">
          {actions.map((actionText, index) => (
            <div
              key={index}
              className="flex items-start space-x-3.5 p-4 bg-gradient-to-r from-slate-50 to-teal-50/30 rounded-2xl border border-slate-200 shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-base flex items-center justify-center flex-shrink-0 shadow-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-slate-800 leading-snug">
                  {actionText}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Finished Button */}
        <button
          onClick={onClose}
          className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-lg font-black rounded-2xl shadow-xl transition active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>{labels.doneBtn[language]}</span>
        </button>
      </div>
    </div>
  );
};
