import React from 'react';
import { Language } from '../types';
import { Sparkles, User, HeartHandshake, Stethoscope, AlertTriangle, CheckCircle, ShieldAlert, Zap, Globe } from 'lucide-react';

interface ScenarioSimulatorBarProps {
  currentTab: 'senior' | 'caregiver' | 'doctor';
  onTabChange: (tab: 'senior' | 'caregiver' | 'doctor') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeScenario: string;
  onApplyScenario: (scenarioKey: string) => void;
}

export const ScenarioSimulatorBar: React.FC<ScenarioSimulatorBarProps> = ({
  currentTab,
  onTabChange,
  language,
  onLanguageChange,
  activeScenario,
  onApplyScenario,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Pitch Pill */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-lg shadow-md">
              🩸
            </span>
            <div>
              <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-teal-200 via-emerald-300 to-white bg-clip-text text-transparent leading-none">
                SUGARSENSE
              </h1>
              <p className="text-[10px] text-teal-300 font-medium tracking-wide">
                Personal Baseline AI • Routine Deviation Engine
              </p>
            </div>
          </div>
        </div>

        {/* Live Scenario Quick-Switches (For Hackathon Pitch) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 px-2 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 px-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Scenarios:
          </span>
          <button
            onClick={() => onApplyScenario('normal')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeScenario === 'normal'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'text-slate-300 hover:bg-slate-700/60'
            }`}
          >
            <CheckCircle className="w-3 h-3 text-emerald-300" />
            <span>🟢 Normal Baseline</span>
          </button>

          <button
            onClick={() => onApplyScenario('deviation')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeScenario === 'deviation'
                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                : 'text-slate-300 hover:bg-slate-700/60'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-300" />
            <span>🟡 Routine Shift</span>
          </button>

          <button
            onClick={() => onApplyScenario('compound_risk')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeScenario === 'compound_risk'
                ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-400'
                : 'text-slate-300 hover:bg-slate-700/60'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-red-200" />
            <span>🔴 Compound Risk (Caregiver Alert)</span>
          </button>

          <button
            onClick={() => onApplyScenario('hypo_alert')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeScenario === 'hypo_alert'
                ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                : 'text-slate-300 hover:bg-slate-700/60'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-300" />
            <span>🟣 Hypo Vulnerability</span>
          </button>
        </div>

        {/* View Switcher + Language Selector */}
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            <Globe className="w-3.5 h-3.5 ml-2 text-slate-400" />
            <button
              onClick={() => onLanguageChange('mr')}
              className={`px-2 py-1 rounded-md font-semibold transition-all ${
                language === 'mr' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-1 rounded-md font-semibold transition-all ${
                language === 'hi' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded-md font-semibold transition-all ${
                language === 'en' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Navigation View Tabs */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700 text-xs font-semibold">
            <button
              onClick={() => onTabChange('senior')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                currentTab === 'senior'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>👵 Senior Mode</span>
            </button>
            <button
              onClick={() => onTabChange('caregiver')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                currentTab === 'caregiver'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>👨‍👩‍👧 Caregiver</span>
            </button>
            <button
              onClick={() => onTabChange('doctor')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                currentTab === 'doctor'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>👨‍⚕️ Doctor</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
