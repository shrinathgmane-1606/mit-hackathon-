import React from 'react';
import { NavigationTab, PersonalBaseline, Language, SeniorStatus } from '../types';
import { 
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
  AlertCircle
} from 'lucide-react';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  baseline: PersonalBaseline;
  language: Language;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenVoiceModal: () => void;
  status: SeniorStatus;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  baseline,
  language,
  isOpenMobile,
  onCloseMobile,
  onOpenVoiceModal,
  status
}) => {
  const navItems = [
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
    }
  ];

  const statusDot = {
    STABLE: 'bg-emerald-400',
    ATTENTION: 'bg-amber-400',
    HIGH_RISK: 'bg-rose-500 animate-ping'
  }[status];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo & Product Name */}
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
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Trigger Banner Button */}
        <div className="p-3 shrink-0">
          <button
            onClick={() => {
              onOpenVoiceModal();
              onCloseMobile();
            }}
            className="w-full p-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 active:scale-95 group"
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
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-xs transition-all ${
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

        {/* Patient Profile Footer Widget */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-300 font-black text-xs flex items-center justify-center border border-teal-500/40">
                AD
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {baseline.patientName}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {baseline.age}y • {baseline.diabetesType}
                </p>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-800 flex justify-between items-center">
              <span>Target:</span>
              <strong className="text-teal-300 font-mono">
                {baseline.postPrandialBaseline.min}-{baseline.postPrandialBaseline.max} mg/dL
              </strong>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
