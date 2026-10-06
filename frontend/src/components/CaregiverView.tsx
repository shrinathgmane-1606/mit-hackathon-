import React, { useState } from 'react';
import { 
  PersonalBaseline, 
  GlucoseReading, 
  Medication, 
  Meal, 
  ActivityData, 
  CompoundRiskAssessment, 
  CaregiverAlert,
  Language 
} from '../types';
import { 
  ShieldAlert, 
  Bell, 
  PhoneCall, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  Sliders, 
  Heart, 
  AlertTriangle, 
  Sparkles, 
  Eye, 
  Check, 
  Info,
  Calendar,
  Share2,
  AlertOctagon
} from 'lucide-react';

interface CaregiverViewProps {
  baseline: PersonalBaseline;
  latestGlucose: GlucoseReading | null;
  medications: Medication[];
  meals: Meal[];
  activity: ActivityData;
  assessment: CompoundRiskAssessment;
  alerts: CaregiverAlert[];
  language: Language;
  onAcknowledgeAlert: (alertId: string) => void;
  onOpenShareReport?: () => void;
  onOpenEmergencySOS?: () => void;
}

export const CaregiverView: React.FC<CaregiverViewProps> = ({
  baseline,
  latestGlucose,
  medications,
  meals,
  activity,
  assessment,
  alerts,
  language,
  onAcknowledgeAlert,
  onOpenShareReport,
  onOpenEmergencySOS
}) => {
  const [filterLevel, setFilterLevel] = useState<'SMART' | 'ALL'>('SMART');
  const [whatsappSent, setWhatsappSent] = useState(false);

  const getWhatsAppMessage = () => {
    if (assessment.status === 'HIGH_RISK') {
      return `Hi ${baseline.preferredName.en}, just checked SugarSense. Please take your prescribed medicine, drink some water, and relax. Calling you in 5 mins! ❤️`;
    }
    return `Hi ${baseline.preferredName.en}, hope you're having a lovely morning! Just saw your readings are well on track. Take care! ❤️`;
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(getWhatsAppMessage());
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setWhatsappSent(true);
    setTimeout(() => setWhatsappSent(false), 3000);
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Caregiver Header & Silent Net Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 shadow-xl mb-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Caregiver Silent Safety Net • Anti-Alert Fatigue</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {baseline.patientName} ({baseline.preferredName.en})'s Monitor
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              SugarSense filters out noisy single-event notifications and only escalates when multiple routine deviations compound into a genuine risk horizon.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2">
            {onOpenEmergencySOS && (
              <button
                onClick={onOpenEmergencySOS}
                className="flex items-center space-x-1.5 py-3 px-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer animate-pulse"
                title="Emergency SOS & Rule of 15 Protocol"
              >
                <AlertOctagon className="w-4 h-4" />
                <span className="hidden sm:inline">Emergency SOS</span>
              </button>
            )}

            {onOpenShareReport && (
              <button
                onClick={onOpenShareReport}
                className="flex items-center space-x-1.5 py-3 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
                title="Share Medical Summary (WhatsApp & PDF)"
              >
                <Share2 className="w-4 h-4 text-teal-400" />
                <span className="hidden sm:inline">Share Report</span>
              </button>
            )}

            <button
              onClick={handleSendWhatsApp}
              className="flex items-center space-x-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-md transition active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{whatsappSent ? 'Opening WhatsApp...' : 'WhatsApp Mom'}</span>
            </button>
            <a
              href="tel:+919876543210"
              className="flex items-center space-x-2 py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-bold text-sm shadow-md transition active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Mom</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Real-time Status Card with Anti-Fatigue Triage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Left 2 Cols: Horizon Overview */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Live Health Horizon Status
            </h3>
            <span className={`text-xs px-3 py-1 rounded-full font-extrabold uppercase tracking-wider ${
              assessment.status === 'STABLE' ? 'bg-emerald-100 text-emerald-800' :
              assessment.status === 'ATTENTION' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800 animate-pulse'
            }`}>
              {assessment.status === 'STABLE' ? '🟢 Stable Baseline' :
               assessment.status === 'ATTENTION' ? '🟡 Watchlist / Mild Drift' : '🔴 Caregiver Escalation Triggered'}
            </span>
          </div>

          <p className="text-lg font-bold text-slate-900 leading-snug mb-4">
            {assessment.summary.en}
          </p>

          {/* Key Factor Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase">Glucose</p>
              <p className="text-base font-black text-slate-800">
                {latestGlucose?.value || '--'} <span className="text-xs font-normal text-slate-500">mg/dL</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase">Meds Taken</p>
              <p className="text-base font-black text-slate-800">
                {medications.filter(m => m.taken).length} / {medications.length}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase">Meals On-Time</p>
              <p className="text-base font-black text-slate-800">
                {meals.filter(m => m.status === 'LOGGED').length} Logged
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase">Steps</p>
              <p className="text-base font-black text-slate-800">
                {activity.stepsToday} <span className="text-xs font-normal text-slate-500">/ {activity.stepTarget}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Anti-Fatigue Filter Rules */}
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-700 font-bold text-xs uppercase tracking-wider mb-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>Silent Net Filter</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Standard apps trigger 15+ alarms/day. SugarSense AI only notifies you when <strong>2 or more correlated risk factors</strong> cross learned bounds.
            </p>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs text-slate-700">
            <p className="font-bold text-teal-900 mb-1">Active Escalation Rule:</p>
            <p className="text-[11px] text-slate-600">
              `[Missed Critical Med] ∧ [Glucose &gt; Max Baseline] ∧ [Delayed Meal]`
            </p>
          </div>
        </div>
      </div>

      {/* 3. Caregiver Smart Alert Log */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-black text-slate-900">
              Escalated Incident Log & Patterns
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Zero False Alarms
          </span>
        </div>

        <div className="space-y-3.5">
          {/* Active dynamically generated alert if High Risk */}
          {assessment.caregiverAlertRecommended && (
            <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-950 animate-slideDown shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-red-500 text-white rounded-xl flex-shrink-0 mt-0.5">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider bg-red-200 text-red-900 px-2 py-0.5 rounded-full">
                        HIGH ATTENTION NEEDED
                      </span>
                      <span className="text-xs text-red-700 font-medium">Just now</span>
                    </div>
                    <p className="text-sm font-bold text-red-900 mt-1">
                      Compound Routine Deviation Detected for {baseline.preferredName.en}
                    </p>
                    <p className="text-xs text-red-800 mt-1 leading-relaxed">
                      {assessment.caregiverAlertReason?.en}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSendWhatsApp}
                  className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex-shrink-0"
                >
                  Quick Check-in
                </button>
              </div>
            </div>
          )}

          {/* Historical Alerts */}
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 flex items-start justify-between gap-3"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-slate-200 text-slate-700 rounded-xl flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{alert.title}</span>
                    <span className="text-[11px] text-slate-400">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {alert.message}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">
                    Pattern: {alert.detailedPattern}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Verified Safe
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
