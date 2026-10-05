import React, { useState } from 'react';
import { Language, GlucoseReading } from '../types';
import { X, Droplet, Check } from 'lucide-react';

interface GlucoseModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSaveReading: (reading: number, context: 'FASTING' | 'POST_BREAKFAST' | 'POST_LUNCH' | 'POST_DINNER' | 'RANDOM') => void;
}

export const GlucoseModal: React.FC<GlucoseModalProps> = ({
  isOpen,
  onClose,
  language,
  onSaveReading,
}) => {
  const [value, setValue] = useState<number>(130);
  const [context, setContext] = useState<'FASTING' | 'POST_BREAKFAST' | 'POST_LUNCH' | 'POST_DINNER' | 'RANDOM'>('POST_BREAKFAST');

  if (!isOpen) return null;

  const labels = {
    title: {
      mr: 'रक्तातील साखर नोंदवा (Log Glucose)',
      hi: 'रक्त शर्करा दर्ज करें (Log Glucose)',
      en: 'Log Blood Glucose Reading'
    },
    valueLabel: {
      mr: 'साखरेची पातळी (mg/dL)',
      hi: 'शुगर स्तर (mg/dL)',
      en: 'Blood Glucose Level (mg/dL)'
    },
    contextLabel: {
      mr: 'वेळ / संदर्भ (Context)',
      hi: 'समय / संदर्भ (Context)',
      en: 'Timing / Context'
    },
    saveBtn: {
      mr: 'नोंदवा (Save Reading)',
      hi: 'सुरक्षित करें (Save Reading)',
      en: 'Save Reading'
    }
  };

  const handleSave = () => {
    onSaveReading(value, context);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-teal-500 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
            <Droplet className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {labels.title[language]}
            </h2>
            <p className="text-xs text-slate-500">
              Glucometer Sync / Manual Entry
            </p>
          </div>
        </div>

        {/* Glucose Slider + Input */}
        <div className="mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {labels.valueLabel[language]}
          </label>
          <div className="flex items-center justify-center space-x-3 mb-3">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="text-4xl font-black text-center text-slate-900 w-32 py-1 bg-white border-2 border-teal-500 rounded-2xl shadow-inner focus:outline-none"
            />
            <span className="text-sm font-bold text-slate-500">mg/dL</span>
          </div>

          <input
            type="range"
            min="50"
            max="350"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
            <span>50 (Low)</span>
            <span>120 (Target)</span>
            <span>200 (Elevated)</span>
            <span>350 (High)</span>
          </div>
        </div>

        {/* Context Selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {labels.contextLabel[language]}
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setContext('FASTING')}
              className={`p-2.5 rounded-xl border transition ${context === 'FASTING' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            >
              Fasting (सकाळी उपाशी)
            </button>
            <button
              type="button"
              onClick={() => setContext('POST_BREAKFAST')}
              className={`p-2.5 rounded-xl border transition ${context === 'POST_BREAKFAST' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            >
              Post Breakfast (नाश्त्यानंतर)
            </button>
            <button
              type="button"
              onClick={() => setContext('POST_LUNCH')}
              className={`p-2.5 rounded-xl border transition ${context === 'POST_LUNCH' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            >
              Post Lunch (दुपारच्या जेवणानंतर)
            </button>
            <button
              type="button"
              onClick={() => setContext('POST_DINNER')}
              className={`p-2.5 rounded-xl border transition ${context === 'POST_DINNER' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            >
              Post Dinner (रात्रीच्या जेवणानंतर)
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-base rounded-2xl shadow-lg transition flex items-center justify-center space-x-2"
        >
          <Check className="w-5 h-5" />
          <span>{labels.saveBtn[language]}</span>
        </button>
      </div>
    </div>
  );
};
