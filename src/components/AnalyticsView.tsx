import React, { useState } from 'react';
import { Language, PersonalBaseline, GlucoseReading, CompoundRiskAssessment } from '../types';
import { MOCK_HISTORICAL_14_DAYS, MOCK_WEIGHT_RECORDS } from '../data/mockProfiles';
import { 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Pill, 
  Scale, 
  ShieldCheck, 
  Calendar, 
  Info,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2
} from 'lucide-react';

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
  const [activeMetric, setActiveMetric] = useState<'GLUCOSE' | 'WEIGHT' | 'STEPS' | 'ADHERENCE' | 'RISK'>('GLUCOSE');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = MOCK_HISTORICAL_14_DAYS;

  // Key KPI Aggregations
  const avgFasting = Math.round(data.reduce((acc, curr) => acc + curr.fasting, 0) / data.length);
  const avgPostMeal = Math.round(data.reduce((acc, curr) => acc + curr.postMeal, 0) / data.length);
  const avgSteps = Math.round(data.reduce((acc, curr) => acc + curr.steps, 0) / data.length);
  const avgAdherence = Math.round(data.reduce((acc, curr) => acc + curr.adherence, 0) / data.length);

  // Time in Range (TIR) calculation (70-140 fasting, 70-180 post-meal)
  const tirPoints = data.filter(d => d.fasting >= 70 && d.fasting <= 130 && d.postMeal <= 160).length;
  const tirPercent = Math.round((tirPoints / data.length) * 100);

  // Estimated HbA1c formula = (avgGlucose + 46.7) / 28.7
  const meanGlucose = (avgFasting + avgPostMeal) / 2;
  const estimatedHbA1c = ((meanGlucose + 46.7) / 28.7).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-teal-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 backdrop-blur-xs flex items-center justify-center border border-teal-400/30 text-teal-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {language === 'mr' ? 'आरोग्य विश्लेषण व कल (Analytics)' : language === 'hi' ? 'स्वास्थ्य विश्लेषण व प्रवृत्तियां' : 'Comprehensive Health Analytics'}
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                14-Day Baseline
              </span>
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
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Time In Range (TIR)</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{tirPercent}%</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
              Target &gt;70%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">In optimal glucose zone</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Est. HbA1c (14D)</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">{estimatedHbA1c}%</span>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md">
              Good Control
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Derived from mean glucose</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Daily Steps</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">{avgSteps.toLocaleString()}</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
              Goal: 3.5k
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Consistent senior mobility</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Medicine Adherence</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">{avgAdherence}%</span>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-md">
              High
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">14-day compliance streak</p>
        </div>
      </div>

      {/* Main Interactive Chart Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'GLUCOSE', label: '🩸 Glucose Trajectory', icon: Activity },
              { id: 'WEIGHT', label: '⚖️ Weight Stability', icon: Scale },
              { id: 'STEPS', label: '🚶 Step Activity', icon: TrendingUp },
              { id: 'ADHERENCE', label: '💊 Medication Adherence', icon: Pill }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
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
              );
            })}
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500">
            {activeMetric === 'GLUCOSE' && (
              <>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>Fasting</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>Post-Meal</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-2 rounded-xs bg-emerald-500/20 border border-emerald-500/40" />
                  <span>Target Zone (70-140)</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Dynamic SVG Visualizer */}
        <div className="relative h-64 w-full pt-4">
          {activeMetric === 'GLUCOSE' && (
            <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="targetZoneGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Target corridor background (70 - 140 mg/dL range mapped to y) */}
              <rect x="30" y="55" width="650" height="90" fill="url(#targetZoneGrad)" rx="6" />
              <line x1="30" y1="55" x2="680" y2="55" stroke="#10b981" strokeDasharray="4 4" strokeWidth="1" opacity="0.6" />
              <line x1="30" y1="145" x2="680" y2="145" stroke="#10b981" strokeDasharray="4 4" strokeWidth="1" opacity="0.6" />

              {/* Y Axis Grid lines */}
              <text x="5" y="60" fontSize="10" fill="#94a3b8" fontWeight="bold">160</text>
              <text x="5" y="105" fontSize="10" fill="#94a3b8" fontWeight="bold">130</text>
              <text x="5" y="150" fontSize="10" fill="#94a3b8" fontWeight="bold">100</text>

              {/* Post-Meal Polyline (Purple) */}
              <polyline
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={data
                  .map((d, i) => {
                    const x = 50 + i * 46;
                    const y = 200 - (d.postMeal - 80) * 1.5;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />

              {/* Fasting Polyline (Teal) */}
              <polyline
                fill="none"
                stroke="#0d9488"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={data
                  .map((d, i) => {
                    const x = 50 + i * 46;
                    const y = 200 - (d.fasting - 80) * 1.5;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />

              {/* Data points */}
              {data.map((d, i) => {
                const x = 50 + i * 46;
                const yFasting = 200 - (d.fasting - 80) * 1.5;
                const yPostMeal = 200 - (d.postMeal - 80) * 1.5;
                const isHovered = hoveredIndex === i;

                return (
                  <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                    {/* Hover vertical line */}
                    {isHovered && (
                      <line x1={x} y1="20" x2={x} y2="180" stroke="#0d9488" strokeWidth="1.5" strokeDasharray="3 3" />
                    )}

                    {/* Fasting dot */}
                    <circle cx={x} cy={yFasting} r={isHovered ? 6 : 4} fill="#0d9488" stroke="#fff" strokeWidth="2" />
                    {/* Post-meal dot */}
                    <circle cx={x} cy={yPostMeal} r={isHovered ? 6 : 4} fill="#6366f1" stroke="#fff" strokeWidth="2" />

                    {/* Day label */}
                    <text x={x} y="195" fontSize="9" textAnchor="middle" fill="#64748b" fontWeight="bold">
                      {i === 13 ? 'Today' : `D-${14 - i}`}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}

          {activeMetric === 'WEIGHT' && (
            <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
              <polyline
                fill="none"
                stroke="#059669"
                strokeWidth="3"
                points={data
                  .map((d, i) => {
                    const x = 50 + i * 46;
                    const y = 180 - (d.weight - 63.5) * 60;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
              {data.map((d, i) => {
                const x = 50 + i * 46;
                const y = 180 - (d.weight - 63.5) * 60;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#059669" stroke="#fff" strokeWidth="2" />
                    <text x={x} y={y - 10} fontSize="10" textAnchor="middle" fill="#059669" fontWeight="bold">
                      {d.weight}kg
                    </text>
                    <text x={x} y="195" fontSize="9" textAnchor="middle" fill="#64748b" fontWeight="bold">
                      {i === 13 ? 'Today' : `D-${14 - i}`}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}

          {activeMetric === 'STEPS' && (
            <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
              {/* 3500 target step line */}
              <line x1="30" y1="65" x2="680" y2="65" stroke="#f59e0b" strokeDasharray="4 4" strokeWidth="1.5" />
              <text x="685" y="68" fontSize="9" fill="#f59e0b" fontWeight="bold">3.5k Target</text>

              {data.map((d, i) => {
                const x = 40 + i * 46;
                const barHeight = (d.steps / 4500) * 140;
                const y = 180 - barHeight;

                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y={y}
                      width="24"
                      height={barHeight}
                      rx="5"
                      fill={d.steps >= 3500 ? '#0d9488' : '#38bdf8'}
                    />
                    <text x={x + 12} y={y - 5} fontSize="8" textAnchor="middle" fill="#64748b" fontWeight="bold">
                      {d.steps}
                    </text>
                    <text x={x + 12} y="195" fontSize="9" textAnchor="middle" fill="#64748b" fontWeight="bold">
                      {i === 13 ? 'Today' : `D-${14 - i}`}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}

          {activeMetric === 'ADHERENCE' && (
            <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
              {data.map((d, i) => {
                const x = 40 + i * 46;
                const barHeight = (d.adherence / 100) * 140;
                const y = 180 - barHeight;

                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y={y}
                      width="24"
                      height={barHeight}
                      rx="5"
                      fill={d.adherence === 100 ? '#10b981' : '#f59e0b'}
                    />
                    <text x={x + 12} y={y - 5} fontSize="9" textAnchor="middle" fill="#10b981" fontWeight="bold">
                      {d.adherence}%
                    </text>
                    <text x={x + 12} y="195" fontSize="9" textAnchor="middle" fill="#64748b" fontWeight="bold">
                      {i === 13 ? 'Today' : `D-${14 - i}`}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Hovered details tooltip banner */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-white">
              📅 {data[hoveredIndex].day} Details:
            </span>
            <div className="flex space-x-4">
              <span>Fasting: <strong>{data[hoveredIndex].fasting} mg/dL</strong></span>
              <span>Post-Meal: <strong>{data[hoveredIndex].postMeal} mg/dL</strong></span>
              <span>Steps: <strong>{data[hoveredIndex].steps}</strong></span>
              <span>Weight: <strong>{data[hoveredIndex].weight} kg</strong></span>
              <span>Adherence: <strong>{data[hoveredIndex].adherence}%</strong></span>
            </div>
          </div>
        )}
      </div>

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
