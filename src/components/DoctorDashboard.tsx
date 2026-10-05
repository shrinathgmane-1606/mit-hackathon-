import React, { useState } from 'react';
import { 
  PersonalBaseline, 
  GlucoseReading, 
  CompoundRiskAssessment, 
  Language 
} from '../types';
import { MOCK_HISTORICAL_14_DAYS } from '../data/mockProfiles';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceArea, 
  ReferenceLine 
} from 'recharts';
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
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface DoctorDashboardProps {
  baseline: PersonalBaseline;
  latestGlucose: GlucoseReading | null;
  assessment: CompoundRiskAssessment;
  language: Language;
  onOpenShareReport?: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  baseline,
  latestGlucose,
  assessment,
  onOpenShareReport
}) => {
  const [copied, setCopied] = useState(false);
  const [timeRange, setTimeRange] = useState<'7D' | '14D' | '30D'>('14D');

  const displayedHistory = React.useMemo(() => {
    const list = timeRange === '7D' ? MOCK_HISTORICAL_14_DAYS.slice(-7) : MOCK_HISTORICAL_14_DAYS;
    return list.map((item, idx) => ({
      day: idx === list.length - 1 ? 'Today' : item.day.replace('Day ', 'D'),
      fasting: item.fasting,
      postMeal: item.postMeal,
      adherence: item.adherence,
      steps: item.steps,
      targetMin: baseline.fastingGlucoseBaseline.min,
      targetMax: baseline.postPrandialBaseline.max
    }));
  }, [timeRange, baseline]);

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
- Recent 24-hr Horizon: ${assessment.doctorSummaryNote || "Steady routine observed."}

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
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* 1. Header with Physician Overview */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 rounded-2xl">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Clinical Visit Report & Longitudinal Review
                </h2>
                <Badge variant="teal">Doctor Portal</Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Patient: <strong>{baseline.patientName}</strong> • Age: {baseline.age} • {baseline.diabetesType} ({baseline.yearsWithDiabetes} yrs)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenShareReport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenShareReport}
                className="flex items-center space-x-1.5"
              >
                <Share2 className="w-4 h-4 text-teal-600" />
                <span>Share Summary</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print EHR</span>
            </Button>

            <Button
              variant="teal"
              size="sm"
              onClick={handleCopyNote}
              className="flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Summary' : 'Copy Clinical Note'}</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. Top-Level Clinical KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Personal Time-In-Range</p>
          <p className="text-3xl font-black text-emerald-600 font-mono mt-1">86.4%</p>
          <p className="text-[11px] text-slate-500 mt-1">Target: {baseline.postPrandialBaseline.min}–{baseline.postPrandialBaseline.max} mg/dL</p>
        </Card>

        <Card className="p-5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rx Adherence</p>
          <p className="text-3xl font-black text-teal-600 font-mono mt-1">93.8%</p>
          <p className="text-[11px] text-slate-500 mt-1">28/30 doses taken on-time</p>
        </Card>

        <Card className="p-5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Meal Timing Drift</p>
          <p className="text-3xl font-black text-amber-600 font-mono mt-1">± 22m</p>
          <p className="text-[11px] text-slate-500 mt-1">Stable circadian cadence</p>
        </Card>

        <Card className="p-5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mean Mobility</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">3,540</p>
          <p className="text-[11px] text-slate-500 mt-1">Steps / day (Target: {baseline.baselineDailySteps})</p>
        </Card>
      </div>

      {/* 3. Longitudinal Glucose Baseline Recharts Visualization */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Glucose Telemetry vs Personalized Baseline Corridor
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Learned Corridor: {baseline.fastingGlucoseBaseline.min}–{baseline.postPrandialBaseline.max} mg/dL (Individualized EWMA Model)
            </p>
          </div>

          <div className="flex items-center space-x-2">
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
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" /> Fasting (mg/dL)
          </span>
          <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Post-Meal (mg/dL)
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-3 h-2 rounded-xs bg-emerald-500/20 border border-emerald-500/40 inline-block" /> Target Baseline
          </span>
        </div>

        {/* Recharts Longitudinal Chart */}
        <div className="w-full h-72 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="docFasting" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="docPostMeal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis domain={[70, 180]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <ReferenceArea y1={baseline.fastingGlucoseBaseline.min} y2={baseline.postPrandialBaseline.max} fill="#10b981" fillOpacity={0.08} />
              <Area type="monotone" dataKey="postMeal" name="Post-Meal (mg/dL)" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#docPostMeal)" />
              <Area type="monotone" dataKey="fasting" name="Fasting (mg/dL)" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#docFasting)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 4. Structured Clinical Note (EHR Exportable) */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              AI Decision-Support Visit Note (EHR Exportable)
            </h3>
          </div>
          <Badge variant="teal">Ready for Review</Badge>
        </div>

        <pre className="p-4 bg-slate-900 text-slate-200 text-xs font-mono rounded-2xl overflow-x-auto leading-relaxed border border-slate-800">
          {clinicalSummaryNote}
        </pre>
      </Card>
    </div>
  );
};
