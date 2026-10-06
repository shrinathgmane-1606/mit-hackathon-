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
  Check, 
  Menu, 
  ChevronDown,
  Command,
  UserCheck,
  Server,
  AlertOctagon,
  Share2,
  LogIn,
  UserPlus,
  User,
  LogOut,
  HeartHandshake,
  Stethoscope,
  ShieldCheck,
  ChevronRight,
  Settings
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
  onOpenSignIn?: () => void;
  onOpenSignUp?: () => void;
  isBackendOnline?: boolean;
  onOpenEmergencySOS?: () => void;
  onOpenShareReport?: () => void;
  onSignOut?: () => void;
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
  onOpenSignIn,
  onOpenSignUp,
  isBackendOnline = true,
  onOpenEmergencySOS,
  onOpenShareReport,
  onSignOut
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const authDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  const unreadAlerts = alerts.filter(a => !a.acknowledged);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLanguageMenu(false);
      }
      if (authDropdownRef.current && !authDropdownRef.current.contains(e.target as Node)) {
        setShowAuthDropdown(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target as Node)) {
        setShowAccountDropdown(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAuthDropdown(false);
        setShowAccountDropdown(false);
        setShowNotifications(false);
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSignInClick = onOpenSignIn || onOpenAuthModal || (() => {});
  const handleSignUpClick = onOpenSignUp || onOpenAuthModal || (() => {});

  const getUserInitials = (user?: AppUser | null): string => {
    const raw = user?.name || user?.email?.split('@')[0] || '';
    const clean = raw.trim();
    if (!clean) return 'SM';
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const userInitials = getUserInitials(currentUser);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-subtle transition-colors">
      {/* Left: 3-Lines Menu Trigger + Home + Command Search (Auth Only) */}
      <div className="flex items-center space-x-2.5 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center space-x-1.5 shadow-xs"
          aria-label="Toggle Navigation Menu"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden sm:inline">Menu</span>
        </button>

        <button
          onClick={() => onNavigateTab('landing')}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          title="Product Home (Landing)"
        >
          <Home className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        </button>

        {/* Command Palette Search Trigger Button — Authenticated Users Only */}
        {currentUser && (
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
        )}
      </div>

      {/* Middle: Scenario Simulator Pills — Authenticated Users Only */}
      {currentUser && (
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
      )}

      {/* Right: Emergency SOS, Share Report, Quick Action & Utilities */}
      <div className="flex items-center space-x-2">

        {/* Authenticated Controls */}
        {currentUser ? (
          <>
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
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs font-black tracking-wide shadow-md shadow-teal-600/25 transition-all active:scale-95 cursor-pointer ring-1 ring-white/20"
              title="Quick Log: Glucose, Meal, Medication or Walk"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Log</span>
            </button>
          </>
        ) : (
          /* Public Controls (Before Login) - WhatsApp-Style Auth Icon */
          <div className="relative" ref={authDropdownRef}>
            <button
              type="button"
              onClick={() => setShowAuthDropdown((prev) => !prev)}
              className={`w-9 h-9 rounded-xl transition-all flex items-center justify-center shadow-xs cursor-pointer active:scale-95 border ${
                showAuthDropdown 
                  ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-300 border-teal-500/60 ring-2 ring-teal-500/20' 
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-teal-500/50'
              }`}
              title="Account & Authentication"
              aria-label="Account & Authentication Menu"
              aria-expanded={showAuthDropdown}
              aria-haspopup="true"
            >
              <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </button>

            {/* Premium Compact Dropdown Popover (Opens Below Icon) */}
            {showAuthDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthDropdown(false);
                    handleSignInClick();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">Log In</p>
                    <p className="text-[10px] text-slate-500 truncate">Existing account</p>
                  </div>
                </button>

                <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setShowAuthDropdown(false);
                    handleSignUpClick();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left hover:bg-teal-50/50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-slate-950 shrink-0 shadow-xs">
                    <UserPlus className="w-4 h-4 font-black" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">Sign Up</p>
                    <p className="text-[10px] text-slate-500 truncate">Create new account</p>
                  </div>
                </button>
              </div>
            )}
          </div>
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

        {/* Authenticated User WhatsApp-Style Action / Account Icon */}
        {currentUser && (
          <div className="relative" ref={accountDropdownRef}>
            <button
              type="button"
              onClick={() => setShowAccountDropdown(prev => !prev)}
              className={`w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-md ring-2 transition-all cursor-pointer active:scale-95 ${
                showAccountDropdown ? 'ring-teal-400 ring-offset-2 dark:ring-offset-slate-900 scale-105' : 'ring-teal-400/20 hover:scale-105'
              }`}
              title={`Account: ${currentUser.name || currentUser.email}`}
              aria-label="Account Action Menu"
              aria-expanded={showAccountDropdown}
              aria-haspopup="true"
            >
              {userInitials}
            </button>

            {/* WhatsApp-Style Action Menu Popup (Opens Below Icon) */}
            {showAccountDropdown && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Account Profile Summary Header */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-100 dark:border-slate-800/80 mb-1.5 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-md shrink-0 ring-2 ring-teal-400/20">
                    {userInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {currentUser.name || currentUser.email.split('@')[0]}
                      </p>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shrink-0">
                        {currentUser.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                {/* Existing Account Action Options */}
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountDropdown(false);
                      onNavigateTab('settings');
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-105 transition shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                        Profile & Calibration
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        Baseline targets & emergency contacts
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountDropdown(false);
                      onNavigateTab('caregiver');
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-105 transition shrink-0">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
                        Caregiver Safety Net
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        Family telemetry & critical alerts
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountDropdown(false);
                      onNavigateTab('doctor');
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition shrink-0">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                        Doctor Portal & Summary
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        Clinical telemetry & report export
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountDropdown(false);
                      onNavigateTab('privacy');
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                        Privacy & Security
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        Data permissions & encryption policies
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                </div>

                {/* Sign Out / End Session Option */}
                {onSignOut && (
                  <>
                    <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1.5" />
                    <button
                      type="button"
                      onClick={() => {
                        setShowAccountDropdown(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-300 transition group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/60 border border-slate-200 dark:border-slate-700 group-hover:border-rose-300 dark:group-hover:border-rose-800 flex items-center justify-center text-slate-500 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition shrink-0">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
                          Sign Out
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          Safely end active account session
                        </p>
                      </div>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
