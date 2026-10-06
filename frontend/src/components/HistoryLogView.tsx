import React, { useState, useMemo } from 'react';
import { TelemetryEvent, Language } from '../types';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  Activity, 
  Pill, 
  Utensils, 
  Footprints, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert,
  Calendar,
  Sparkles
} from 'lucide-react';

interface HistoryLogViewProps {
  events: TelemetryEvent[];
  language: Language;
  onExportCSV: () => void;
  searchQuery?: string;
}

export const HistoryLogView: React.FC<HistoryLogViewProps> = ({
  events,
  language,
  onExportCSV,
  searchQuery = '',
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState<string>('');

  const effectiveSearch = localSearch || searchQuery;

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesFilter = filterType === 'ALL' || e.category === filterType;
      const matchesSearch = 
        !effectiveSearch.trim() ||
        e.title.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        e.detail.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        (e.value && String(e.value).toLowerCase().includes(effectiveSearch.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [events, filterType, effectiveSearch]);

  const categoryIcons: Record<string, JSX.Element> = {
    GLUCOSE: <span className="p-2 rounded-xl bg-rose-50 text-rose-600">🩸</span>,
    MEDICATION: <span className="p-2 rounded-xl bg-teal-50 text-teal-600">💊</span>,
    MEAL: <span className="p-2 rounded-xl bg-amber-50 text-amber-600">🍛</span>,
    ACTIVITY: <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">🚶</span>,
    SYMPTOM: <span className="p-2 rounded-xl bg-purple-50 text-purple-600">⚠️</span>,
    ALERT: <span className="p-2 rounded-xl bg-red-50 text-red-600">🚨</span>,
  };

  const statusBadge = (tag: string) => {
    switch (tag) {
      case 'NORMAL':
      case 'CONFIRMED':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">Normal</span>;
      case 'ATTENTION':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">Deviation</span>;
      case 'ALERT':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800">Critical</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">Logged</span>;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Header & Export Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl">
            <History className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Telemetry & Activity Log
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Comprehensive chronological ledger of all glucose readings, medicines, Indian meals, walks, and voice entries.
            </p>
          </div>
        </div>

        <button
          onClick={onExportCSV}
          className="flex items-center space-x-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV / Data</span>
        </button>
      </div>

      {/* 2. Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filter logs..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto py-1">
          {['ALL', 'GLUCOSE', 'MEDICATION', 'MEAL', 'ACTIVITY', 'SYMPTOM'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterType === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat === 'ALL' ? 'All Logs' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Event Log List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <History className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
            <p className="text-base font-bold text-slate-700">No events matched your filter</p>
            <p className="text-xs text-slate-500 mt-1">Try changing the category or clearing the search box.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/80 transition"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="flex-shrink-0 text-xl">
                    {categoryIcons[event.category] || categoryIcons.GLUCOSE}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {event.title}
                      </h4>
                      {statusBadge(event.statusTag)}
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {event.source}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">
                      {event.detail}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {event.timeDisplay}
                    </p>
                  </div>
                </div>

                {event.value && (
                  <div className="text-right flex-shrink-0">
                    <span className="text-base font-black text-slate-900 font-mono">
                      {event.value}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
