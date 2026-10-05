import React from 'react';
import { ToastNotification } from '../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-600 flex-shrink-0" />,
  };

  const bgMap = {
    success: 'bg-white border-emerald-300 text-slate-800 shadow-emerald-100',
    warning: 'bg-white border-amber-300 text-slate-800 shadow-amber-100',
    error: 'bg-white border-rose-300 text-slate-800 shadow-rose-100',
    info: 'bg-white border-teal-300 text-slate-800 shadow-teal-100',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl border-2 shadow-xl flex items-start space-x-3 transition-all duration-300 animate-slideDown ${bgMap[toast.type]}`}
        >
          {iconMap[toast.type]}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              {toast.title}
            </h4>
            <p className="text-xs font-semibold text-slate-600 mt-0.5 leading-snug">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 text-slate-400 hover:text-slate-700 transition rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
