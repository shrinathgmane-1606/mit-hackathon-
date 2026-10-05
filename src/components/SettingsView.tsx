import React, { useState } from 'react';
import { PersonalBaseline, AppSettings, Language } from '../types';
import { 
  Settings, 
  User, 
  Sliders, 
  Phone, 
  ShieldCheck, 
  Eye, 
  Volume2, 
  Save, 
  Check, 
  Stethoscope, 
  Sparkles 
} from 'lucide-react';

interface SettingsViewProps {
  baseline: PersonalBaseline;
  onUpdateBaseline: (newBaseline: PersonalBaseline) => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  language: Language;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  baseline,
  onUpdateBaseline,
  settings,
  onUpdateSettings,
  language,
}) => {
  const [localBaseline, setLocalBaseline] = useState<PersonalBaseline>(baseline);
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    onUpdateBaseline(localBaseline);
    onUpdateSettings(localSettings);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Profile & App Preferences
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Customize personal baseline parameters, caregiver emergency contacts, and accessibility options.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-2 py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition active:scale-95"
        >
          {savedToast ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedToast ? 'Settings Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* 2. Personal Baseline Calibration Settings */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center space-x-2 text-slate-900 font-black text-base border-b border-slate-100 pb-3">
          <Sliders className="w-5 h-5 text-teal-600" />
          <span>Personal Baseline Calibration (Learned Targets)</span>
        </div>

        <p className="text-xs text-slate-500">
          Unlike static textbook thresholds, SugarSense uses these individualized baseline corridors to detect genuine routine deviations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Fasting Baseline Range */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Fasting Glucose Corridor (mg/dL)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400">Min (mg/dL)</span>
                <input
                  type="number"
                  value={localBaseline.fastingGlucoseBaseline.min}
                  onChange={(e) => setLocalBaseline({
                    ...localBaseline,
                    fastingGlucoseBaseline: {
                      ...localBaseline.fastingGlucoseBaseline,
                      min: Number(e.target.value)
                    }
                  })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-sm"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400">Max (mg/dL)</span>
                <input
                  type="number"
                  value={localBaseline.fastingGlucoseBaseline.max}
                  onChange={(e) => setLocalBaseline({
                    ...localBaseline,
                    fastingGlucoseBaseline: {
                      ...localBaseline.fastingGlucoseBaseline,
                      max: Number(e.target.value)
                    }
                  })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Post-Prandial Baseline Range */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Post-Prandial Corridor (mg/dL)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400">Min (mg/dL)</span>
                <input
                  type="number"
                  value={localBaseline.postPrandialBaseline.min}
                  onChange={(e) => setLocalBaseline({
                    ...localBaseline,
                    postPrandialBaseline: {
                      ...localBaseline.postPrandialBaseline,
                      min: Number(e.target.value)
                    }
                  })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-sm"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400">Max (mg/dL)</span>
                <input
                  type="number"
                  value={localBaseline.postPrandialBaseline.max}
                  onChange={(e) => setLocalBaseline({
                    ...localBaseline,
                    postPrandialBaseline: {
                      ...localBaseline.postPrandialBaseline,
                      max: Number(e.target.value)
                    }
                  })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Caregiver & Emergency Contacts */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 font-black text-base border-b border-slate-100 pb-3">
          <Phone className="w-5 h-5 text-teal-600" />
          <span>Caregiver Safety Net Contacts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">
              Caregiver WhatsApp / Phone
            </label>
            <input
              type="text"
              value={localSettings.caregiverPhone}
              onChange={(e) => setLocalSettings({ ...localSettings, caregiverPhone: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">
              Doctor / Clinic Phone
            </label>
            <input
              type="text"
              value={localSettings.doctorPhone}
              onChange={(e) => setLocalSettings({ ...localSettings, doctorPhone: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm"
            />
          </div>
        </div>
      </div>

      {/* 4. Accessibility & Voice Settings */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 font-black text-base border-b border-slate-100 pb-3">
          <Eye className="w-5 h-5 text-teal-600" />
          <span>Accessibility & Voice Preferences</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Font Scaling */}
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">
              Display Text Scaling
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['standard', 'large', 'extra-large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setLocalSettings({ ...localSettings, fontSize: size })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition border ${
                    localSettings.fontSize === size
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {size.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">
              High Contrast Accessibility
            </label>
            <button
              onClick={() => setLocalSettings({ ...localSettings, highContrast: !localSettings.highContrast })}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                localSettings.highContrast
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <span>High-Contrast Mode</span>
              <span>{localSettings.highContrast ? 'Enabled ✅' : 'Off'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
