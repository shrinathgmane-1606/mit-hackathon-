import React from 'react';
import { SelectedDetailItem, Language } from '../types';
import { 
  X, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';

interface DetailDrawerProps {
  item: SelectedDetailItem | null;
  onClose: () => void;
  language: Language;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  item,
  onClose,
  language,
}) => {
  if (!item) return null;

  const statusTheme = {
    NORMAL: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    CONFIRMED: 'bg-teal-50 text-teal-800 border-teal-200',
    ATTENTION: 'bg-amber-50 text-amber-800 border-amber-200',
    ALERT: 'bg-rose-50 text-rose-800 border-rose-200'
  }[item.statusTag] || 'bg-slate-50 text-slate-800 border-slate-200';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-in Panel */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col justify-between animate-slideInRight">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusTheme}`}>
                {item.statusTag}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {item.timestamp}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Subtitle */}
          <div className="py-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
              {item.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {item.subtitle}
            </p>
          </div>

          {/* Key Attributes Table */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 mb-5 space-y-2">
            {Object.entries(item.details).map(([key, value]) => {
              if (value === undefined) return null;
              return (
                <div key={key} className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{String(value)}</span>
                </div>
              );
            })}
          </div>

          {/* "Why This Matters" Section */}
          <div className="mb-5 bg-teal-50/50 dark:bg-teal-950/30 rounded-2xl p-4 border border-teal-200/60 dark:border-teal-800/50">
            <div className="flex items-center space-x-1.5 text-teal-800 dark:text-teal-300 font-bold text-xs uppercase tracking-wider mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Why This Matters (Contextual AI)</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {item.whyItMatters}
            </p>
          </div>

          {/* Recommendations List */}
          {item.recommendations.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Recommended Action Protocol
              </p>
              <ul className="space-y-2">
                {item.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start space-x-2 text-xs text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
