import React, { useState, useEffect, useRef } from 'react';
import { NavigationTab, Language, ThemeMode, DensityMode } from '../types';
import { 
  Search, 
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
  Plus, 
  Sun, 
  Moon, 
  Globe, 
  FileSpreadsheet, 
  Zap, 
  Maximize2, 
  X,
  ArrowRight,
  Sliders
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onOpenVoice: () => void;
  onOpenQuickAction: () => void;
  onApplyScenario: (scenario: string) => void;
  onLanguageChange: (lang: Language) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onToggleFocusMode: () => void;
  onExportCSV: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: JSX.Element;
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenVoice,
  onOpenQuickAction,
  onApplyScenario,
  onLanguageChange,
  theme,
  onToggleTheme,
  onToggleFocusMode,
  onExportCSV,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allCommands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dash',
      title: 'Go to Senior Dashboard',
      category: 'Navigation',
      icon: <LayoutDashboard className="w-4 h-4 text-teal-500" />,
      shortcut: 'G D',
      action: () => onNavigate('dashboard')
    },
    {
      id: 'nav-assistant',
      title: 'Open AI Diabetes Assistant (Chat)',
      category: 'Navigation',
      icon: <Bot className="w-4 h-4 text-teal-500" />,
      shortcut: 'G A',
      action: () => onNavigate('assistant')
    },
    {
      id: 'nav-reminders',
      title: 'Open Reminders & Schedule (Meds, Sugar, Doctor)',
      category: 'Navigation',
      icon: <Bell className="w-4 h-4 text-teal-500" />,
      shortcut: 'G M',
      action: () => onNavigate('reminders')
    },
    {
      id: 'nav-lifestyle',
      title: 'View Lifestyle Guidance & Senior Fitness',
      category: 'Navigation',
      icon: <Activity className="w-4 h-4 text-teal-500" />,
      shortcut: 'G L',
      action: () => onNavigate('lifestyle')
    },
    {
      id: 'nav-analytics',
      title: 'Open Health Analytics & Multi-Metric Trends',
      category: 'Navigation',
      icon: <BarChart3 className="w-4 h-4 text-teal-500" />,
      shortcut: 'G T',
      action: () => onNavigate('analytics')
    },
    {
      id: 'nav-insights',
      title: 'View AI Routine Insights & Correlation',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4 text-teal-500" />,
      shortcut: 'G I',
      action: () => onNavigate('insights')
    },
    {
      id: 'nav-history',
      title: 'Open Telemetry Logs & Activity Ledger',
      category: 'Navigation',
      icon: <History className="w-4 h-4 text-teal-500" />,
      shortcut: 'G H',
      action: () => onNavigate('history')
    },
    {
      id: 'nav-caregiver',
      title: 'Open Caregiver Safety Net & Family Portal',
      category: 'Navigation',
      icon: <HeartHandshake className="w-4 h-4 text-teal-500" />,
      shortcut: 'G C',
      action: () => onNavigate('caregiver')
    },
    {
      id: 'nav-doctor',
      title: 'View Clinical Doctor Report (14-Day TIR)',
      category: 'Navigation',
      icon: <Stethoscope className="w-4 h-4 text-teal-500" />,
      shortcut: 'G R',
      action: () => onNavigate('doctor')
    },
    {
      id: 'nav-privacy',
      title: 'Open Privacy, RBAC & Supabase Security',
      category: 'Navigation',
      icon: <ShieldCheck className="w-4 h-4 text-teal-500" />,
      shortcut: 'G P',
      action: () => onNavigate('privacy')
    },
    {
      id: 'nav-settings',
      title: 'Open Settings & Baseline Calibration',
      category: 'Navigation',
      icon: <Settings className="w-4 h-4 text-teal-500" />,
      shortcut: 'G S',
      action: () => onNavigate('settings')
    },

    // Actions
    {
      id: 'act-voice',
      title: 'Start Voice Assistant (Marathi / Hindi / English)',
      category: 'Quick Actions',
      icon: <Mic className="w-4 h-4 text-emerald-500" />,
      shortcut: 'V',
      action: onOpenVoice
    },
    {
      id: 'act-log',
      title: 'Log Telemetry (Glucose, Meds, Indian Meal, Steps)',
      category: 'Quick Actions',
      icon: <Plus className="w-4 h-4 text-emerald-500" />,
      shortcut: 'L',
      action: onOpenQuickAction
    },
    {
      id: 'act-export',
      title: 'Export Telemetry Log to CSV',
      category: 'Quick Actions',
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-500" />,
      action: onExportCSV
    },
    {
      id: 'act-focus',
      title: 'Toggle Minimalist Focus Mode',
      category: 'Appearance',
      icon: <Maximize2 className="w-4 h-4 text-purple-500" />,
      shortcut: 'F',
      action: onToggleFocusMode
    },
    {
      id: 'act-theme',
      title: theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      category: 'Appearance',
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />,
      shortcut: 'T',
      action: onToggleTheme
    },

    // Simulations
    {
      id: 'sim-norm',
      title: 'Simulate Scenario: 🟢 Normal Baseline Routine',
      category: 'Demo Simulation',
      icon: <Zap className="w-4 h-4 text-emerald-500" />,
      action: () => onApplyScenario('normal')
    },
    {
      id: 'sim-dev',
      title: 'Simulate Scenario: 🟡 Routine Timing Shift',
      category: 'Demo Simulation',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      action: () => onApplyScenario('deviation')
    },
    {
      id: 'sim-risk',
      title: 'Simulate Scenario: 🔴 Multi-Factor Compound Alert',
      category: 'Demo Simulation',
      icon: <Zap className="w-4 h-4 text-rose-500" />,
      action: () => onApplyScenario('compound_risk')
    },
    {
      id: 'sim-hypo',
      title: 'Simulate Scenario: 🟣 Hypoglycemia Vulnerability',
      category: 'Demo Simulation',
      icon: <Zap className="w-4 h-4 text-purple-500" />,
      action: () => onApplyScenario('hypo_alert')
    },

    // Languages
    {
      id: 'lang-en',
      title: 'Set Language to English (India)',
      category: 'Language',
      icon: <Globe className="w-4 h-4 text-blue-500" />,
      action: () => onLanguageChange('en')
    },
    {
      id: 'lang-mr',
      title: 'Set Language to मराठी (Marathi)',
      category: 'Language',
      icon: <Globe className="w-4 h-4 text-blue-500" />,
      action: () => onLanguageChange('mr')
    },
    {
      id: 'lang-hi',
      title: 'Set Language to हिंदी (Hindi)',
      category: 'Language',
      icon: <Globe className="w-4 h-4 text-blue-500" />,
      action: () => onLanguageChange('hi')
    }
  ];

  const filteredCommands = allCommands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 sm:pt-28 p-4 animate-in fade-in duration-100">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-100"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3 bg-slate-50 dark:bg-slate-900">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, feature name, or search..."
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm font-medium focus:outline-hidden"
          />
          <kbd className="hidden sm:inline px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching commands or actions found.
            </div>
          ) : (
            filteredCommands.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-100 border border-teal-200 dark:border-teal-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="shrink-0">{item.icon}</span>
                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-bold truncate">{item.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{item.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {item.shortcut && (
                      <kbd className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700">
                        {item.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className={`w-3.5 h-3.5 text-teal-500 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="font-semibold text-teal-600 dark:text-teal-400">SugarSense Pro</span>
        </div>
      </div>
    </div>
  );
};
