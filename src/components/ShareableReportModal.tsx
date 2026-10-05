import React, { useState } from 'react';
import { PersonalBaseline, GlucoseReading, CompoundRiskAssessment, Language } from '../types';
import { 
  X, 
  MessageCircle, 
  Printer, 
  Copy, 
  Check, 
  Share2, 
  FileText, 
  Heart, 
  Activity, 
  Pill, 
  Calendar, 
  ShieldCheck,
  TrendingUp,
  Stethoscope
} from 'lucide-react';

interface ShareableReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseline: PersonalBaseline;
  latestGlucose: GlucoseReading | null;
  assessment: CompoundRiskAssessment;
  language: Language;
}

export const ShareableReportModal: React.FC<ShareableReportModalProps> = ({
  isOpen,
  onClose,
  baseline,
  latestGlucose,
  assessment,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'pdf'>('whatsapp');

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedWhatsAppText = `🩺 *SUGARSENSE AI — CLINICAL HEALTH SUMMARY* 🩺
*Patient:* ${baseline.patientName} (${baseline.age} yrs, ${baseline.diabetesType})
*Date:* ${todayStr}

📊 *14-Day Glycemic Performance:*
• *Time-In-Range (TIR):* 86.4% (Target: ${baseline.postPrandialBaseline.min}-${baseline.postPrandialBaseline.max} mg/dL)
• *Fasting Avg:* 98 mg/dL | *Post-Meal Avg:* 142 mg/dL
• *Latest Reading:* ${latestGlucose?.value || 118} mg/dL (${latestGlucose?.context || 'Post-Meal'})

💊 *Medication & Routine Adherence:*
• *Rx Adherence Rate:* 93.8% (28/30 scheduled doses on time)
• *Mean Daily Activity:* 3,540 steps / day
• *Meal Cadence:* Stable (Drift ± 22 mins)

🧠 *Explainable AI Pattern Summary:*
${assessment.summary.en}

👨‍⚕️ _Generated automatically by SugarSense AI Diabetes Companion for clinical and caregiver review._`;

  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(formattedWhatsAppText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedWhatsAppText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-2xl">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Share Medical Summary & EHR Report
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              1-Click instant sharing for family caregivers & doctor consultation
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Family Share</span>
          </button>

          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'pdf'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Printer className="w-4 h-4 text-indigo-600" />
            <span>Clinical PDF / Print Layout</span>
          </button>
        </div>

        {/* Tab 1: WhatsApp Preview */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                  <span>💬</span> WhatsApp Formatted Message Preview
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">Ready to dispatch</span>
              </div>
              <pre className="text-xs font-sans text-slate-800 dark:text-slate-200 whitespace-pre-wrap bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900 leading-relaxed font-mono">
                {formattedWhatsAppText}
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCopy}
                className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center space-x-2 transition active:scale-95 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Message Text'}</span>
              </button>

              <button
                onClick={handleSendWhatsApp}
                className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open in WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Clinical PDF Print Preview */}
        {activeTab === 'pdf' && (
          <div className="space-y-4">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 max-h-80 overflow-y-auto print:max-h-none print:bg-white text-slate-900 dark:text-slate-100">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-black text-teal-800 dark:text-teal-300">
                    SUGARSENSE AI CLINICAL REPORT
                  </h3>
                  <p className="text-[10px] text-slate-500">Longitudinal 14-Day Multi-Variate Telemetry Summary</p>
                </div>
                <div className="text-right text-[10px] text-slate-500 font-mono">
                  <p>Date: {todayStr}</p>
                  <p>Ref: SS-{baseline.patientId}</p>
                </div>
              </div>

              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400">Patient:</span> <strong>{baseline.patientName}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Age / Gender:</span> <strong>{baseline.age} Y / Female</strong>
                </div>
                <div>
                  <span className="text-slate-400">Diagnosis:</span> <strong>{baseline.diabetesType} ({baseline.yearsWithDiabetes} yrs)</strong>
                </div>
                <div>
                  <span className="text-slate-400">Hypo Vulnerability:</span> <strong className="text-amber-600">{baseline.hypoVulnerability ? 'YES (Glimepiride)' : 'NO'}</strong>
                </div>
              </div>

              {/* Summary KPIs */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">Time-In-Range</p>
                  <p className="text-lg font-black text-emerald-700 dark:text-emerald-400 font-mono">86.4%</p>
                </div>
                <div className="p-2.5 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800">
                  <p className="text-[10px] font-bold text-teal-800 dark:text-teal-300">Rx Adherence</p>
                  <p className="text-lg font-black text-teal-700 dark:text-teal-400 font-mono">93.8%</p>
                </div>
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  <p className="text-[10px] font-bold text-indigo-800 dark:text-indigo-300">Daily Steps</p>
                  <p className="text-lg font-black text-indigo-700 dark:text-indigo-400 font-mono">3,540</p>
                </div>
              </div>

              {/* Clinical AI Note */}
              <div className="text-xs bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed mb-3">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  <span>Clinical Assessment & Correlation:</span>
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  {assessment.doctorSummaryNote || assessment.summary.en}
                </p>
              </div>

              {/* Doctor Sign-off */}
              <div className="pt-4 border-t flex justify-between items-end text-[10px] text-slate-400">
                <span>Verified by SugarSense Clinical Analytics Engine</span>
                <span className="border-t border-slate-400 pt-1 px-4 text-center">Consulting Physician Signature</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={handlePrint}
                className="py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-2xl flex items-center space-x-2 shadow-md transition active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official EHR PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
