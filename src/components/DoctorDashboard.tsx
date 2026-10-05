import React, { useState } from 'react';
import { 
  PersonalBaseline, 
  GlucoseReading, 
  CompoundRiskAssessment, 
  Language 
} from '../types';
import { MOCK_HISTORICAL_14_DAYS } from '../data/mockProfiles';
import { 
  FileText, 
  TrendingUp, 
  Calendar, 
  Activity, 
  Pill, 
  Clock, 
  Download, 
  Check, 
  Copy, 
  Printer, 
  Stethoscope,
  Sparkles,
  AlertCircle,
  Share2
} from 'lucide-react';

interface DoctorDashboardProps {
  baseline: PersonalBaseline;
  latestGlucose: GlucoseReading | null;
  assessment: CompoundRiskAssessment;
  language: Language;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  baseline,
  latestGlucose,
  assessment,
}) => {
  const [copied, setCopied] = useState(false);
  const [timeRange, setTimeRange] = useState<'7D' | '14D' | '30D'>('14D');
  const [hoveredDay, setHoveredDay] = useState<any>(null);

  const displayedHistory = React.useMemo(() => {
    if (timeRange === '7D') {
      return MOCK_HISTORICAL_14_DAYS.slice(-7);
    }
    return MOCK_HISTORICAL_14_DAYS;
  }, [timeRange]);

  const clinicalSummaryNote = `CLINICAL VISIT SUMMARY — SUGARSENSE AI PLATFORM
Patient Name: ${baseline.patientName} (Age: ${baseline.age}, ${baseline.diabetesType})
Evaluation Window: Last 14 Days
Generated At: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}

1. PERSONALIZED BASELINE PROFILE:
- Fasting Glucose Learned Baseline: ${baseline.fastingGlucoseBaseline.min} - ${baseline.fastingGlucoseBaseline.max} mg/dL (Mean: ${baseline.fastingGlucoseBaseline.avg} mg/dL)
- Post-Prandial Learned Baseline: ${baseline.postPrandialBaseline.min} - ${baseline.postPrandialBaseline.max} mg/dL (Mean: ${baseline.postPrandialBaseline.avg} mg/dL)
- Daily Mobility Baseline: ${baseline.baselineDailySteps.toLocaleString()} steps/day
- Hypoglycemia Vulnerability Flag: ${baseline.hypoVulnerability ? 'ACTIVE (Prescribed Secretagogue/Glimepiride)' : 'LOW'}

2. 14-DAY TELEMETRY & ADHERENCE METRICS:
- Time-in-Range (Personal Baseline): 86.4%
- Time-Above-Baseline (>160 mg/dL): 10.2%
- Time-Below-Baseline (<70 mg/dL): 3.4%
- Medication Adherence Rate: 93.8% (Missed 2 evening doses coinciding with delayed dinner schedules)
- Mean Daily Steps: 3,540 steps/day (Target: ${baseline.baselineDailySteps})

3. MULTI-FACTOR PATTERN RECOGNITION:
- Primary Correlation: Elevated post-dinner glucose readings (170-195 mg/dL) directly correlate with delayed dinner timing (>21:15 vs usual 20:00) and missed post-meal walks.
- Recent 24-hr Horizon: ${assessment.doctorSummaryNote}

4. AI DECISION-SUPPORT RECOMMENDATIONS:
- Reinforce dinner timing consistency (target < 20:15) to minimize late-evening insulin resistance spikes.
- Review evening Metformin 500mg SR adherence reminders.
- Continue encouraging post-prandial 10-15 min gentle indoor movement.`;

  const handleCopyNote = () => {
    navigator.clipboard.writeText(clinicalSummaryNote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 1. Header with Physician Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 rounded-2xl">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Clinical Visit Report & Longitudinal Review
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Patient: <strong>{baseline.patientName}</strong> • Age: {baseline.age} • {baseline.diabetesType} ({baseline.yearsWithDiabetes} yrs)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyNote}
              className="flex items-center space-x-1.5 py-2 px-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy EHR Note'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 py-2 px-3.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Visit PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top-Level Clinical KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Personal Time-In-Range</p>
          <p className="text-3xl font-black text-emerald-600 font-mono mt-1">86.4%</p>
          <p className="text-[11px] text-slate-500 mt-1">Target: {baseline.postPrandialBaseline.min}–{baseline.postPrandialBaseline.max} mg/dL</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rx Adherence</p>
          <p className="text-3xl font-black text-teal-600 font-mono mt-1">93.8%</p>
          <p className="text-[11px] text-slate-500 mt-1">28/30 doses taken on-time</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Meal Timing Drift</p>
          <p className="text-3xl font-black text-amber-600 font-mono mt-1">± 22m</p>
          <p className="text-[11px] text-slate-500 mt-1">Stable circadian cadence</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mean Mobility</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">3,540</p>
          <p className="text-[11px] text-slate-500 mt-1">Steps / day (Target: {baseline.baselineDailySteps})</p>
        </div>
      </div>

      {/* 3. Longitudinal Glucose Baseline Visualization */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Glucose Telemetry vs Personalized Baseline Corridor
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Learned Corridor: {baseline.fastingGlucoseBaseline.min}–{baseline.postPrandialBaseline.max} mg/dL (Individualized Model)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Time range pills */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              {(['7D', '14D', '30D'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg transition ${
                    timeRange === range
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs font-bold mb-3">
          <span className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" /> Fasting Glucose
          </span>
          <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Post-Meal Glucose
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-3 h-0.5 bg-slate-300 dark:bg-slate-600 inline-block" /> Baseline Limits
          </span>
        </div>

        {/* Custom SVG Longitudinal Chart */}
        <div className="w-full h-60 bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 relative overflow-hidden border border-slate-100 dark:border-slate-800 flex items-end justify-between gap-1">
          {displayedHistory.map((item, idx) => {
            const fastingHeight = Math.max(10, Math.min(90, ((item.fasting - 70) / 180) * 100));
            const postMealHeight = Math.max(15, Math.min(95, ((item.postMeal - 70) / 180) * 100));

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredDay(item)}
                onMouseLeave={() => setHoveredDay(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
              >
                {/* Hover Tooltip */}
                <div className="absolute -top-12 bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 whitespace-nowrap shadow-xl border border-slate-700">
                  {item.day}: Fasting {item.fasting} | Post-Meal {item.postMeal} mg/dL ({item.adherence}% Rx)
                </div>

                {/* Bars */}
                <div className="w-full flex justify-center items-end gap-1 h-44">
                  <div
                    style={{ height: `${fastingHeight}%` }}
                    className="w-2 sm:w-3 bg-teal-500 rounded-t-sm group-hover:bg-teal-400 transition"
                  />
                  <div
                    style={{ height: `${postMealHeight}%` }}
                    className="w-2 sm:w-3 bg-amber-500 rounded-t-sm group-hover:bg-amber-400 transition"
                  />
                </div>
                <span className="text-[9px] font-bold text-slate-400 mt-2 truncate w-full text-center">
                  {item.day.replace('Day ', 'D')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Structured AI Visit Summary Note (Formatted for EHR / Print) */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-teal-400 font-bold text-sm">
            <Sparkles className="w-5 h-5" />
            <span>AI Clinical Consultation Summary (EHR Export Format)</span>
          </div>
          <button
            onClick={handleCopyNote}
            className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl text-slate-300 font-medium transition active:scale-95"
          >
            {copied ? 'Copied ✅' : 'Copy Text'}
          </button>
        </div>

        <pre className="text-xs sm:text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800 overflow-x-auto">
          {clinicalSummaryNote}
        </pre>
      </div>
    </div>
  );
};
