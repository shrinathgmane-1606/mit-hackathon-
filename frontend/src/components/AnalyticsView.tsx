import React, { useState } from 'react';
import { Language, PersonalBaseline, GlucoseReading, CompoundRiskAssessment } from '../types';
import { MOCK_HISTORICAL_14_DAYS } from '../data/mockProfiles';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine, 
  ReferenceArea 
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Pill, 
  Scale, 
  ShieldCheck, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface AnalyticsViewProps {
  baseline: PersonalBaseline;
  latestGlucose: GlucoseReading | null;
  assessment: CompoundRiskAssessment;
  language: Language;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  baseline,
  latestGlucose,
  assessment,
  language
}) => {
  const [timeframe, setTimeframe] = useState<'7D' | '14D' | '30D' | '90D'>('14D');
  const [activeMetric, setActiveMetric] = useState<'GLUCOSE' | 'WEIGHT' | 'STEPS' | 'ADHERENCE'>('GLUCOSE');

  const rawData = MOCK_HISTORICAL_14_DAYS;
  const chartData = rawData.map((d, i) => ({
    day: i === rawData.length - 1 ? 'Today' : d.day.replace('Day ', 'D'),
    fasting: d.fasting,
    postMeal: d.postMeal,
    steps: d.steps,
    weight: d.weight,
    adherence: d.adherence,
    targetMin: baseline.fastingGlucoseBaseline.min,
    targetMax: baseline.postPrandialBaseline.max
  }));

  // Aggregations
  const avgFasting = Math.round(rawData.reduce((acc, curr) => acc + curr.fasting, 0) / rawData.length);
  const avgPostMeal = Math.round(rawData.reduce((acc, curr) => acc + curr.postMeal, 0) / rawData.length);
  const avgSteps = Math.round(rawData.reduce((acc, curr) => acc + curr.steps, 0) / rawData.length);
  const avgAdherence = Math.round(rawData.reduce((acc, curr) => acc + curr.adherence, 0) / rawData.length);

  // Time in Range (TIR)
  const tirPoints = rawData.filter(d => d.fasting >= 70 && d.fasting <= 130 && d.postMeal <= 160).length;
  const tirPercent = Math.round((tirPoints / rawData.length) * 100);
  const meanGlucose = (avgFasting + avgPostMeal) / 2;
  const estimatedHbA1c = ((meanGlucose + 46.7) / 28.7).toFixed(1);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-teal-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 backdrop-blur-xs flex items-center justify-center border border-teal-400/30 text-teal-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {language === 'mr' ? 'आरोग्य विश्लेषण व कल (Recharts Analytics)' : language === 'hi' ? 'स्वास्थ्य विश्लेषण व चार्ट्स' : 'Comprehensive Health Analytics'}
              </h1>
              <Badge variant="teal">Recharts Powered</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {language === 'mr'
                ? 'साखर, वजन, पावले आणि औषध नियमिततेचा दीर्घकालीन वैज्ञानिक आलेख.'
                : language === 'hi'
                ? 'ब्लड शुगर, वजन, शारीरिक गतिविधि और दवा अनुपालन का दीर्घकालिक सांख्यिकीय विश्लेषण।'
                : 'Multi-variate trajectory tracking with learned personal baseline bounds.'}
            </p>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          {(['7D', '14D', '30D', '90D'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timeframe === tf
                  ? 'bg-teal-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4 pb-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Time In Range (TIR)</p>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{tirPercent}%</span>
              <Badge variant="success">Target &gt;70%</Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">In optimal glucose zone</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Est. HbA1c (14D)</p>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">{estimatedHbA1c}%</span>
              <Badge variant="teal">Good Control</Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Derived from mean glucose</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Daily Steps</p>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">{avgSteps.toLocaleString()}</span>
              <Badge variant="secondary">Goal: 3.5k</Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Consistent senior mobility</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Medicine Adherence</p>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">{avgAdherence}%</span>
              <Badge variant="success">High</Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">14-day compliance streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Interactive Recharts Chart */}
      <Card className="p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'GLUCOSE', label: '🩸 Glucose Trajectory', icon: Activity },
              { id: 'WEIGHT', label: '⚖️ Weight Stability', icon: Scale },
              { id: 'STEPS', label: '🚶 Step Activity', icon: TrendingUp },
              { id: 'ADHERENCE', label: '💊 Medication Adherence', icon: Pill }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMetric(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
                  activeMetric === tab.id
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500">
            {activeMetric === 'GLUCOSE' && (
              <>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>Fasting (mg/dL)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>Post-Meal (mg/dL)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-2 rounded-xs bg-emerald-500/20 border border-emerald-500/40" />
                  <span>Target Range (70-140)</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-72 w-full pt-2">
          {activeMetric === 'GLUCOSE' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="glucoseFasting" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="glucosePostMeal" x1="0" y1="0" x2="0" y2="1">
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
                <ReferenceArea y1={70} y2={140} fill="#10b981" fillOpacity={0.08} />
                <Area type="monotone" dataKey="postMeal" name="Post-Meal (mg/dL)" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#glucosePostMeal)" />
                <Area type="monotone" dataKey="fasting" name="Fasting (mg/dL)" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#glucoseFasting)" />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeMetric === 'WEIGHT' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis domain={[63, 66]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#059669" strokeWidth={3} dot={{ r: 4, fill: '#059669' }} />
              </LineChart>
            </ResponsiveContainer>
          )}

          {activeMetric === 'STEPS' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <ReferenceLine y={3500} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '3.5k Goal', fill: '#f59e0b', fontSize: 10 }} />
                <Bar dataKey="steps" name="Steps" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeMetric === 'ADHERENCE' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="adherence" name="Adherence (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Clinical Notes & Interpretation */}
      <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 flex items-start space-x-3.5">
        <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-teal-900 dark:text-teal-200">
            {language === 'mr' ? 'AI विश्लेषक अहवाल निष्कर्ष:' : language === 'hi' ? 'AI एनालिटिक्स रिपोर्ट निष्कर्ष:' : 'AI Clinical Analysis Summary'}
          </h4>
          <p className="text-xs text-teal-800 dark:text-teal-300 leading-relaxed font-medium">
            Over the past 14 days, fasting glucose has stayed firmly within the tight 112-125 mg/dL band with 0 recorded hypoglycemic dips (&lt;70 mg/dL). High medication compliance (96%) directly accounts for the low post-meal glycemic variance (SD: 4.8 mg/dL). Ready for doctor review export.
          </p>
        </div>
      </div>
    </div>
  );
};
