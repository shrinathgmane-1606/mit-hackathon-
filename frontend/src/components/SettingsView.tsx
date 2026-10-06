import React, { useState } from 'react';
import { PersonalBaseline, AppSettings, Language, ThemeMode } from '../types';
import { AppUser } from '../lib/supabase';
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
  Sparkles,
  Globe,
  Sun,
  Moon,
  Trash2,
  LogOut,
  Clock,
  Heart,
  Activity
} from 'lucide-react';

interface SettingsViewProps {
  baseline: PersonalBaseline;
  onUpdateBaseline: (newBaseline: PersonalBaseline) => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  currentUser?: AppUser | null;
  onSignOut?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  baseline,
  onUpdateBaseline,
  settings,
  onUpdateSettings,
  language,
  onLanguageChange,
  theme = 'light',
  onToggleTheme,
  currentUser,
  onSignOut
}) => {
  const [localBaseline, setLocalBaseline] = useState<PersonalBaseline>(baseline);
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [savedToast, setSavedToast] = useState(false);
  const [clearedChatToast, setClearedChatToast] = useState(false);

  const handleSave = () => {
    onUpdateBaseline(localBaseline);
    onUpdateSettings(localSettings);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleClearChatHistory = () => {
    localStorage.removeItem('sugarsense_chat_history');
    setClearedChatToast(true);
    setTimeout(() => setClearedChatToast(false), 2500);
  };

  const languagesList: { id: Language; label: string; sub: string; flag: string }[] = [
    { id: 'en', label: 'English', sub: 'Default clinical language', flag: '🇬🇧' },
    { id: 'mr', label: 'मराठी (Marathi)', sub: 'प्रादेशिक भाषा संवाद', flag: '🇮🇳' },
    { id: 'hi', label: 'हिंदी (Hindi)', sub: 'राष्ट्रभाषा संवाद', flag: '🇮🇳' }
  ];

  return (
    <div className="w-full space-y-6 pb-16">
      {/* 1. Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 rounded-2xl border border-teal-200/50 dark:border-teal-800/50">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {language === 'mr' ? 'सेटिंग्ज व वैयक्तिक प्राधान्ये' : language === 'hi' ? 'सेटिंग्स व व्यक्तिगत प्राथमिकताएं' : 'Profile & App Preferences'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'mr' 
                ? 'वैयक्तिक बेसलाइन, भाषा, थीम आणि आपत्कालीन संपर्क सानुकूलित करा.' 
                : language === 'hi' 
                ? 'व्यक्तिगत बेसलाइन, भाषा, थीम और आपातकालीन संपर्क अनुकूलित करें।' 
                : 'Customize personal baseline parameters, language, theme, and emergency contacts.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-2 py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
        >
          {savedToast ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedToast ? 'Settings Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* 2. Patient Identity & Profile */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-black text-base">
            <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Patient Identity & Profile</span>
          </div>
          {currentUser && (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Role: {currentUser.role}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={localBaseline.patientName}
              onChange={(e) => setLocalBaseline({ ...localBaseline, patientName: e.target.value })}
              placeholder="e.g. Ramesh Patil"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
              Age (Years)
            </label>
            <input
              type="number"
              value={localBaseline.age}
              onChange={(e) => setLocalBaseline({ ...localBaseline, age: Number(e.target.value) })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
              Diabetes Condition
            </label>
            <select
              value={localBaseline.diabetesType}
              onChange={(e) => setLocalBaseline({ ...localBaseline, diabetesType: e.target.value as 'Type 2' | 'Type 1' })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-sm"
            >
              <option value="Type 2">Type 2 Diabetes (Adult Onset)</option>
              <option value="Type 1">Type 1 Diabetes (Insulin Dependent)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Language & Visual Theme Switchers */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
          <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span>Language & Visual Theme</span>
        </div>

        <div className="space-y-4">
          {/* Language Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
              Primary System Language (मराठी / हिंदी / English)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {languagesList.map((langItem) => {
                const isSelected = language === langItem.id;
                return (
                  <button
                    key={langItem.id}
                    type="button"
                    onClick={() => onLanguageChange && onLanguageChange(langItem.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-600 ring-2 ring-teal-500/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-teal-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{langItem.flag}</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {langItem.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {langItem.sub}
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
              Appearance & Theme Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (theme === 'dark' && onToggleTheme) onToggleTheme();
                }}
                className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                  theme === 'light'
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-600 ring-2 ring-teal-500/20 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-teal-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Light Mode</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Optimal daytime contrast</span>
                  </div>
                </div>
                {theme === 'light' && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (theme === 'light' && onToggleTheme) onToggleTheme();
                }}
                className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-600 ring-2 ring-teal-500/20 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-teal-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Dark Mode</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Obsidian luxury theme</span>
                  </div>
                </div>
                {theme === 'dark' && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Personal Baseline Calibration Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
          <Sliders className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span>Personal Baseline Calibration (Learned Targets)</span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Unlike static textbook thresholds, SugarSense uses these individualized baseline corridors to detect genuine routine deviations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Fasting Baseline Range */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
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
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-sm"
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
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Post-Prandial Baseline Range */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
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
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-sm"
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
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Caregiver & Emergency Contacts */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
          <Phone className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span>Caregiver Safety Net Contacts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 block">
              Caregiver WhatsApp / Phone
            </label>
            <input
              type="text"
              value={localSettings.caregiverPhone}
              onChange={(e) => setLocalSettings({ ...localSettings, caregiverPhone: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 block">
              Doctor / Clinic Phone
            </label>
            <input
              type="text"
              value={localSettings.doctorPhone}
              onChange={(e) => setLocalSettings({ ...localSettings, doctorPhone: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* 6. Accessibility & Voice Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
          <Eye className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span>Accessibility & Font Preferences</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Font Scaling */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 block">
              Display Text Scaling
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['standard', 'large', 'extra-large'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, fontSize: size })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition border cursor-pointer ${
                    localSettings.fontSize === size
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {size.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 block">
              High Contrast Accessibility
            </label>
            <button
              type="button"
              onClick={() => setLocalSettings({ ...localSettings, highContrast: !localSettings.highContrast })}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between border cursor-pointer ${
                localSettings.highContrast
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs dark:bg-white dark:text-slate-900'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>High-Contrast Mode</span>
              <span>{localSettings.highContrast ? 'Enabled ✅' : 'Off'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7. Data Management & Session Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
          <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span>Data Storage & Account Session</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={handleClearChatHistory}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{clearedChatToast ? 'Chat History Cleared!' : 'Clear AI Chat History'}</span>
          </button>

          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Session</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
