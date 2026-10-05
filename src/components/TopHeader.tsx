import React, { useState, useRef, useEffect } from 'react';
import { Language, CaregiverAlert, NavigationTab, ThemeMode, DensityMode } from '../types';
import { AppUser } from '../lib/supabase';
import { 
  Home,
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
  Command,
  UserCheck,
  Server,
  AlertOctagon,
  Share2
} from 'lucide-react';
import { Badge } from './ui/badge';

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
  currentUser?: AppUser | null;
  onOpenAuthModal?: () => void;
  isBackendOnline?: boolean;
  onOpenEmergencySOS?: () => void;
  onOpenShareReport?: () => void;
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
  currentUser,
  onOpenAuthModal,
  isBackendOnline = true,
  onOpenEmergencySOS,
  onOpenShareReport
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
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => onNavigateTab('landing')}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          title="Product Home & Interactive Living Orbit (Landing)"
        >
          <Home className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        </button>

        {/* Command Palette Search Trigger Button */}
        <button
          onClick={onOpenCommandPalette}
          className="w-full pl-3 pr-2 py-1.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between transition group cursor-pointer"
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
        {[
          { id: 'normal', label: '🟢 Normal' },
          { id: 'deviation', label: '🟡 Timing Shift' },
          { id: 'compound_risk', label: '🔴 Compound Alert' },
          { id: 'hypo_alert', label: '🟣 Hypo Risk' }
        ].map((sc) => (
          <button
            key={sc.id}
            onClick={() => onApplyScenario(sc.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              activeScenario === sc.id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* Right: Quick Action, Backend Badge, Auth & Utilities */}
      <div className="flex items-center space-x-2">
        {/* Backend API status */}
        <div className="hidden md:flex items-center space-x-1 text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
          <span>{isBackendOnline ? 'FastAPI & Groq' : 'Local Engine'}</span>
        </div>

        {/* Emergency SOS Button */}
        {onOpenEmergencySOS && (
          <button
            onClick={onOpenEmergencySOS}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black tracking-wide transition shadow-xs cursor-pointer active:scale-95 animate-pulse"
            title="Emergency SOS & Rule of 15"
          >
            <AlertOctagon className="w-4 h-4" />
            <span className="hidden sm:inline">SOS</span>
          </button>
        )}

        {/* Share Clinical Report Button */}
        {onOpenShareReport && (
          <button
            onClick={onOpenShareReport}
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            title="Share Medical Summary (WhatsApp & PDF)"
          >
            <Share2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden md:inline">Share</span>
          </button>
        )}

        {/* Global Quick Action (+) Button */}
        <button
          onClick={onOpenQuickAction}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Log</span>
        </button>

        {/* Auth / Role Button */}
        {onOpenAuthModal && (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center space-x-1.5 p-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer"
            title="Role-Based Supabase Authentication"
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden md:inline">{currentUser?.role || 'SENIOR'}</span>
          </button>
        )}

        {/* Focus Mode Button */}
        <button
          onClick={onToggleFocusMode}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          title="Fullscreen Focus Mode"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Density Selector */}
        <div className="relative" ref={densityRef}>
          <button
            onClick={() => setShowDensityMenu(!showDensityMenu)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            title="Adjust Layout Density"
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl capitalize transition cursor-pointer ${
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
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 relative transition cursor-pointer"
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
                  className="text-[11px] font-bold text-teal-600 hover:underline cursor-pointer"
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
            className="flex items-center space-x-1 p-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
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
