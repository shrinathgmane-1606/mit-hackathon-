import React, { useEffect } from 'react';
import { NavigationTab, PersonalBaseline, Language, SeniorStatus } from '../types';
import { AppUser } from '../lib/supabase';
import { 
  Home,
  LayoutDashboard, 
  Bot,
  Bell,
  Activity,
  BarChart3,
  Sparkles, 
  History, 
  HeartHandshake, 
  Stethoscope, 
  ShieldCheck, 
  Settings, 
  Mic, 
  X, 
  AlertTriangle, 
  AlertCircle,
  Radio,
  ChevronRight,
  LogIn,
  UserPlus,
  User,
  Menu
} from 'lucide-react';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  baseline: PersonalBaseline;
  language: Language;
  isOpen?: boolean;
  onClose?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenVoiceModal: () => void;
  status: SeniorStatus;
  currentUser?: AppUser | null;
  onOpenSignIn?: () => void;
  onOpenSignUp?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  baseline,
  language,
  isOpen,
  onClose,
  isOpenMobile,
  onCloseMobile,
  onOpenVoiceModal,
  status,
  currentUser,
  onOpenSignIn,
  onOpenSignUp
}) => {
  const isDrawerOpen = isOpen !== undefined ? isOpen : Boolean(isOpenMobile);
  const handleClose = onClose || onCloseMobile || (() => {});

  // Global ESC Key Listener to dismiss Sidebar Drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, handleClose]);

  const navItems = [
    {
      id: 'landing' as NavigationTab,
      label: {
        en: 'Product Home',
        mr: 'मुख्य परिचय (Home)',
        hi: 'मुख्य परिचय (Home)'
      },
      icon: <Home className="w-4 h-4" />,
      badge: 'Overview'
    },
    {
      id: 'dashboard' as NavigationTab,
      label: {
        en: 'Senior Dashboard',
        mr: 'मुख्य डॅशबोर्ड',
        hi: 'मुख्य डैशबोर्ड'
      },
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: 'Live'
    },
    {
      id: 'assistant' as NavigationTab,
      label: {
        en: 'AI Diabetes Assistant',
        mr: 'AI मधुमेह सहाय्यक',
        hi: 'AI डायबिटीज असिस्टेंट'
      },
      icon: <Bot className="w-4 h-4" />,
      badge: 'AI'
    },
    {
      id: 'reminders' as NavigationTab,
      label: {
        en: 'Reminders & Schedule',
        mr: 'आठवणी व वेळापत्रक',
        hi: 'रिमाइंडर व समय'
      },
      icon: <Bell className="w-4 h-4" />
    },
    {
      id: 'lifestyle' as NavigationTab,
      label: {
        en: 'Lifestyle & Fitness',
        mr: 'जीवनशैली व व्यायाम',
        hi: 'लाइफस्टाइल व फिटनेस'
      },
      icon: <Activity className="w-4 h-4" />
    },
    {
      id: 'analytics' as NavigationTab,
      label: {
        en: 'Health Analytics',
        mr: 'आरोग्य विश्लेषण',
        hi: 'स्वास्थ्य विश्लेषण'
      },
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'insights' as NavigationTab,
      label: {
        en: 'Risk & Pattern Detection',
        mr: 'जोखीम व दिनचर्या बदल',
        hi: 'जोखिम व पैटर्न पहचान'
      },
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      id: 'history' as NavigationTab,
      label: {
        en: 'Telemetry Logs',
        mr: 'सर्व नोंदी व इतिहास',
        hi: 'इतिहास व लॉग्स'
      },
      icon: <History className="w-4 h-4" />
    },
    {
      id: 'caregiver' as NavigationTab,
      label: {
        en: 'Caregiver Dashboard',
        mr: 'काळजीवाहू सुरक्षा डॅशबोर्ड',
        hi: 'देखभालकर्ता डैशबोर्ड'
      },
      icon: <HeartHandshake className="w-4 h-4" />
    },
    {
      id: 'doctor' as NavigationTab,
      label: {
        en: 'Doctor / Clinician Mode',
        mr: 'डॉक्टर क्लिनिकल व्हिजिट',
        hi: 'डॉक्टर क्लिनिकल मोड'
      },
      icon: <Stethoscope className="w-4 h-4" />
    },
    {
      id: 'privacy' as NavigationTab,
      label: {
        en: 'Privacy & RBAC Security',
        mr: 'सुरक्षा व प्रवेश हक्क',
        hi: 'सुरक्षा व एक्सेस कंट्रोल'
      },
      icon: <ShieldCheck className="w-4 h-4" />
    },
    {
      id: 'settings' as NavigationTab,
      label: {
        en: 'Profile & Calibration',
        mr: 'प्रोफाइल व कॅलिब्रेशन',
        hi: 'प्रोफाइल व सेटिंग्स'
      },
      icon: <Settings className="w-4 h-4" />
    },
    {
      id: 'admin' as NavigationTab,
      label: {
        en: 'Admin Control Panel',
        mr: 'प्रशासक नियंत्रण (Admin)',
        hi: 'एडमिन कंट्रोल पैनल'
      },
      icon: <Radio className="w-4 h-4" />,
      badge: 'Root'
    }
  ];

  const statusDot = {
    STABLE: 'bg-emerald-400',
    ATTENTION: 'bg-amber-400',
    HIGH_RISK: 'bg-rose-500 animate-ping'
  }[status];

  // Derive User Initials (e.g. "Shrinath Mane" -> "SM")
  const getUserInitials = (user?: AppUser | null, fallbackName?: string): string => {
    const raw = user?.name || fallbackName || user?.email?.split('@')[0] || '';
    const clean = raw.trim();
    if (!clean) return 'SS';
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const userInitials = getUserInitials(currentUser, baseline.patientName);

  return (
    <>
      {/* Backdrop for all viewports when Drawer is open */}
      {isDrawerOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 transition-opacity animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo & Product Name + Close Button */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-xl shadow-md">
              🩸
            </span>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-black tracking-tight text-white">
                  SUGARSENSE
                </span>
                <span className={`w-2 h-2 rounded-full ${statusDot}`} />
              </div>
              <p className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase">
                Elderly Companion AI
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close Navigation Menu"
            title="Close Menu (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Trigger Banner Button */}
        <div className="p-3 shrink-0">
          <button
            onClick={() => {
              onOpenVoiceModal();
              handleClose();
            }}
            className="w-full p-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 active:scale-95 group cursor-pointer"
          >
            <div className="p-1 rounded-lg bg-white/20 text-white group-hover:scale-110 transition">
              <Mic className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span>{language === 'mr' ? 'माझ्याशी बोला (व्हॉइस AI)' : language === 'hi' ? 'मुझसे बात करें (वॉयस AI)' : 'Talk to AI Companion'}</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  handleClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label[language] || item.label.en}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Patient Profile / Authentication Footer Widget */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          {currentUser ? (
            <button
              onClick={() => {
                onSelectTab('settings');
                handleClose();
              }}
              className="w-full text-left p-2.5 bg-slate-800/90 hover:bg-slate-750 hover:border-teal-500/50 rounded-2xl border border-slate-700/80 transition-all cursor-pointer group shadow-sm flex items-center justify-between"
              title="Open Real Profile & Calibration Settings"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-md shrink-0 ring-2 ring-teal-400/20 group-hover:scale-105 transition-transform">
                  {userInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate group-hover:text-teal-300 transition-colors">
                    {currentUser.name || currentUser.email.split('@')[0]}
                  </p>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase bg-teal-900/60 text-teal-300 border border-teal-700/40">
                      {currentUser.role}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      {currentUser.email}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-center space-y-2">
              <p className="text-[11px] font-semibold text-slate-400">
                {language === 'mr' ? 'आरोग्य डॅशबोर्डसाठी साइन इन करा' : language === 'hi' ? 'स्वास्थ्य डैशबोर्ड के लिए साइन इन करें' : 'Sign in for Health Dashboard'}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onOpenSignIn && onOpenSignIn();
                    handleClose();
                  }}
                  className="flex-1 py-2 px-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center space-x-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenSignUp && onOpenSignUp();
                    handleClose();
                  }}
                  className="flex-1 py-2 px-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center space-x-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
