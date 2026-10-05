import React from 'react';
import { NextBestAction, Language } from '../types';
import { Sparkles, ArrowRight, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface SmartNextActionCardProps {
  action: NextBestAction;
  onExecute: () => void;
  language: Language;
}

export const SmartNextActionCard: React.FC<SmartNextActionCardProps> = ({
  action,
  onExecute,
  language,
}) => {
  const urgencyTheme = {
    CRITICAL: 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200',
    MEDIUM: 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200',
    LOW: 'bg-teal-500/10 border-teal-500/30 text-teal-950 dark:text-teal-200',
  }[action.urgency];

  const btnTheme = {
    CRITICAL: 'bg-rose-600 hover:bg-rose-700 text-white',
    MEDIUM: 'bg-amber-600 hover:bg-amber-700 text-white',
    LOW: 'bg-teal-600 hover:bg-teal-700 text-white',
  }[action.urgency];

  return (
    <div className={`p-4 sm:p-5 rounded-3xl border ${urgencyTheme} backdrop-blur-xs shadow-xs transition-all relative overflow-hidden`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300">
              Smart Next Best Action
            </span>
            {action.urgency === 'CRITICAL' && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                Priority
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
            {action.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
            {action.subtitle}
          </p>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <strong>Why it matters:</strong> {action.whyItMatters}
          </p>
        </div>

        <button
          onClick={onExecute}
          className={`py-3 px-5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 flex-shrink-0 ${btnTheme}`}
        >
          <span>{action.actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
