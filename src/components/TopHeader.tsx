import React, { useState, useRef, useEffect } from 'react';
import { Language, CaregiverAlert, NavigationTab, ThemeMode, DensityMode } from '../types';
import { 
  Search, 
  Bell, 
  Plus, 
  Globe, 
  Zap, 
  Sun, 
  Moon, 
  Maximize2, 
  Sliders, 
  Check, 
  Menu, 
  ChevronDown,
  Command
} from 'lucide-react';

interface TopHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeScenario: string;
  onApplyScenario: (scenario: string) => void;
  alerts: CaregiverAlert[];
  onOpenQuickAction: () => void;
  onToggleSidebar: () => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenCommandPalette: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  density: DensityMode;
  onChangeDensity: (density: DensityMode) => void;
  onToggleFocusMode: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  language,
  onLanguageChange,
  activeScenario,
  onApplyScenario,
  alerts,
  onOpenQuickAction,
  onToggleSidebar,
  onNavigateTab,
  onOpenCommandPalette,
  theme,
  onToggleTheme,
  density,
  onChangeDensity,
  onToggleFocusMode,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showDensityMenu, setShowDensityMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const densityRef = useRef<HTMLDivElement>(null);

  const unreadAlerts = alerts.filter(a => !a.acknowledged);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLanguageMenu(false);
      }
      if (densityRef.current && !densityRef.current.contains(e.target as Node)) {
        setShowDensityMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-subtle transition-colors">
      {/* Left: Mobile Sidebar Trigger + Command Search Trigger */}
      <div className="flex items-center space-x-3 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Command Palette Search Trigger Button */}
        <button
          onClick={onOpenCommandPalette}
          className="w-full pl-3 pr-2 py-1.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between transition group"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
            <span className="truncate">Search commands, medicines, telemetry...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center space-x-1 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </button>
      </div>

      {/* Middle: Scenario Simulator Pills */}
      <div className="hidden xl:flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
        <span className="text-[10px] font-black uppercase text-slate-400 px-2 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500" /> Demo:
        </span>
        <button
          onClick={() => onApplyScenario('normal')}
          className={`px-2.5 py-1 rounded-lg transition ${
            activeScenario === 'normal'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          🟢 Normal
        </button>
        <button
          onClick={() => onApplyScenario('deviation')}
          className={`px-2.5 py-1 rounded-lg transition ${
            activeScenario === 'deviation'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          🟡 Shift
        </button>
        <button
          onClick={() => onApplyScenario('compound_risk')}
          className={`px-2.5 py-1 rounded-lg transition ${
            activeScenario === 'compound_risk'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          🔴 Alert
        </button>
        <button
          onClick={() => onApplyScenario('hypo_alert')}
          className={`px-2.5 py-1 rounded-lg transition ${
            activeScenario === 'hypo_alert'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          🟣 Hypo
        </button>
      </div>

      {/* Right Controls: Quick Action, Notifications, Focus, Theme, Language */}
      <div className="flex items-center space-x-2">
        {/* "+ Log Entry" CTA */}
        <button
          onClick={onOpenQuickAction}
          className="flex items-center space-x-1.5 py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Log</span>
        </button>

        {/* Focus Mode Button */}
        <button
          onClick={onToggleFocusMode}
          className="hidden sm:flex p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
          title="Toggle Focus Mode (Distraction Free)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
          title="Toggle Light / Dark Mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        {/* Density Selector */}
        <div className="relative hidden md:block" ref={densityRef}>
          <button
            onClick={() => setShowDensityMenu(!showDensityMenu)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
            title="Display Density"
          >
            <Sliders className="w-4 h-4" />
          </button>
          {showDensityMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 text-xs font-semibold">
              {(['compact', 'comfortable', 'spacious'] as DensityMode[]).map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    onChangeDensity(d);
                    setShowDensityMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl capitalize transition ${
                    density === d ? 'bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{d}</span>
                  {density === d && <Check className="w-3.5 h-3.5 text-teal-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 relative transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-50 animate-slideDown">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Caregiver Safety Alerts
                </h4>
                <button
                  onClick={() => {
                    onNavigateTab('caregiver');
                    setShowNotifications(false);
                  }}
                  className="text-[11px] font-bold text-teal-600 hover:underline"
                >
                  View Safety Net
                </button>
              </div>

              <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No active alerts</p>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 dark:text-white">{alert.title}</span>
                        <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-snug">{alert.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center space-x-1 p-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Globe className="w-3.5 h-3.5 text-teal-600" />
            <span className="uppercase">{language}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLanguageMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 text-xs font-semibold">
              {(['en', 'mr', 'hi'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    onLanguageChange(lang);
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                    language === lang ? 'bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-300 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{lang === 'en' ? 'English (IN)' : lang === 'mr' ? 'मराठी (Marathi)' : 'हिंदी (Hindi)'}</span>
                  {language === lang && <Check className="w-3.5 h-3.5 text-teal-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
