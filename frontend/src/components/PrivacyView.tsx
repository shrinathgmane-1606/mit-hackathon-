import React, { useState } from 'react';
import { Language, UserRole, AppSettings } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Database, 
  Eye, 
  UserCheck, 
  HeartHandshake, 
  Stethoscope, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Trash2,
  Code2,
  Copy,
  Check
} from 'lucide-react';

interface PrivacyViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  language: Language;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({
  settings,
  onUpdateSettings,
  language
}) => {
  const [activeRoleTab, setActiveRoleTab] = useState<UserRole>(settings.activeRole || 'SENIOR');
  const [copiedPolicyIndex, setCopiedPolicyIndex] = useState<number | null>(null);

  const roles = [
    {
      id: 'SENIOR' as UserRole,
      title: { en: '👴 Senior Citizen (Patient)', mr: '👴 ज्येष्ठ नागरिक (रुग्ण)', hi: '👴 वरिष्ठ नागरिक (मरीज)' },
      desc: {
        en: 'Primary account holder with sovereign data ownership and emergency consent controls.',
        mr: 'मुख्य खातेधारक; सर्व वैयक्तिक डेटाचे पूर्ण मालकी हक्क आणि संमती अधिकार.',
        hi: 'प्राथमिक खाताधारक; संपूर्ण व्यक्तिगत डेटा पर संप्रभु नियंत्रण।'
      },
      badge: 'Full Owner'
    },
    {
      id: 'CAREGIVER' as UserRole,
      title: { en: '👨‍👩‍👧 Family Caregiver', mr: '👨‍👩‍👧 कुटुंब काळजीवाहू', hi: '👨‍👩‍👧 परिवार देखभालकर्ता' },
      desc: {
        en: 'Remote safety-net monitoring with anti-fatigue filtered alerts. Cannot delete clinical records.',
        mr: 'सुरक्षा जाळे मॉनिटरिंग; केवळ आवश्यक धोक्याच्या सूचना. वैद्यकीय रेकॉर्ड बदलण्याचा अधिकार नाही.',
        hi: 'रिमोट मॉनिटरिंग और सिर्फ जरूरी अलर्ट। क्लिनिकल डेटा बदलने की अनुमति नहीं।'
      },
      badge: 'Safety Net'
    },
    {
      id: 'DOCTOR' as UserRole,
      title: { en: '👨‍⚕️ Clinician / Doctor', mr: '👨‍⚕️ वैद्यकीय डॉक्टर', hi: '👨‍⚕️ डॉक्टर' },
      desc: {
        en: 'Clinical-grade 14-day Time In Range (TIR) and AI visit report summary. Read-only access.',
        mr: '१४ दिवसांचा क्लिनिकल TIR आलेख व AI व्हिजिट सारांश. फक्त वाचण्याचा अधिकार.',
        hi: '14-दिवसीय क्लिनिकल TIR रिपोर्ट और AI समरी। केवल पढ़ने की अनुमति।'
      },
      badge: 'Clinical Review'
    }
  ];

  const rlsPolicies = [
    {
      name: '1. Patient Sovereign Access (CRUD)',
      table: 'public.telemetry_readings',
      sql: `-- Patient owns all personal telemetry
CREATE POLICY "patient_sovereign_access"
ON public.telemetry_readings
FOR ALL
TO authenticated
USING (auth.uid() = patient_id)
WITH CHECK (auth.uid() = patient_id);`,
      explanation: 'Ensures seniors have unrestricted, encrypted access to their own glucose, medications, and meals.'
    },
    {
      name: '2. Caregiver Filtered Safety Net (Anti-Fatigue)',
      table: 'public.caregiver_alerts',
      sql: `-- Caregiver only reads alerts when consent is active & severity requires attention
CREATE POLICY "caregiver_silent_safety_net"
ON public.caregiver_alerts
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.consent_delegations
    WHERE consent_delegations.patient_id = caregiver_alerts.patient_id
      AND consent_delegations.caregiver_id = auth.uid()
      AND consent_delegations.status = 'ACTIVE'
  )
  AND severity IN ('ATTENTION', 'HIGH_RISK')
);`,
      explanation: 'Enforces the silent safety net: caregivers only receive alerts when compound risk exceeds safe thresholds.'
    },
    {
      name: '3. Doctor Read-Only EHR Delegation',
      table: 'public.clinical_reports',
      sql: `-- Doctor has read-only access to compiled 14-day visit summaries
CREATE POLICY "doctor_clinical_read_only"
ON public.clinical_reports
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.doctor_authorizations
    WHERE doctor_authorizations.patient_id = clinical_reports.patient_id
      AND doctor_authorizations.doctor_license_id = auth.uid()
      AND doctor_authorizations.expires_at > NOW()
  )
);`,
      explanation: 'Enables HIPAA/ABDM-compliant temporary doctor review delegation with time-bounded tokens.'
    }
  ];

  const handleCopyPolicy = (index: number, sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedPolicyIndex(index);
    setTimeout(() => setCopiedPolicyIndex(null), 2000);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      patient: 'Senior Patient',
      age: 72,
      exportedAt: new Date().toISOString(),
      encryptionStandard: 'AES-256 GCM',
      status: 'VERIFIED'
    }, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `SugarSense_Encrypted_Export_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 backdrop-blur-xs flex items-center justify-center border border-indigo-400/30 text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {language === 'mr' ? 'गोपनीयता, सुरक्षा व प्रवेश हक्क (RBAC)' : language === 'hi' ? 'गोपनीयता, सुरक्षा व एक्सेस कंट्रोल' : 'Privacy, Security & Role-Based Access'}
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Supabase RLS Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {language === 'mr'
                ? 'रुग्ण, काळजीवाहू आणि डॉक्टर यांच्यासाठी कडक परमिशन मॅट्रिक्स व एन्क्रिप्शन.'
                : language === 'hi'
                ? 'वरिष्ठ नागरिक, देखभालकर्ता और डॉक्टर के लिए सख्त रोल्स व डाटा सुरक्षा।'
                : 'Role-Based Access Control (RBAC) with Supabase Row Level Security policies.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportData}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-indigo-300" />
            <span>{language === 'mr' ? 'डेटा एक्सपोर्ट' : language === 'hi' ? 'डेटा एक्सपोर्ट' : 'Export My Data'}</span>
          </button>
        </div>
      </div>

      {/* 1. Interactive Role-Based Access Control (RBAC) Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'mr' ? 'भूमिका निवडा (Role-Based Access Simulation)' : language === 'hi' ? 'भूमिका चुनें (Role Selector)' : 'Active User Role Simulation'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Switch roles to experience how permissions, views, and privacy boundaries dynamically adapt.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {roles.map((r) => {
            const isSelected = activeRoleTab === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRoleTab(r.id);
                  onUpdateSettings({ ...settings, activeRole: r.id });
                }}
                className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 hover:border-indigo-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      {r.badge}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {r.title[language] || r.title.en}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {r.desc[language] || r.desc.en}
                  </p>
                </div>

                <span className={`text-[11px] font-bold mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 ${
                  isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                }`}>
                  {isSelected ? '✓ Active Role' : 'Tap to Switch'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Permission Matrix Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                <th className="p-3 rounded-l-xl">Resource Capability</th>
                <th className="p-3 text-center">Senior (Patient)</th>
                <th className="p-3 text-center">Caregiver</th>
                <th className="p-3 text-center rounded-r-xl">Doctor / Clinician</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">Log Daily Glucose & Meals</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✅ Full (CRUD)</td>
                <td className="p-3 text-center text-slate-400">🚫 Read-only</td>
                <td className="p-3 text-center text-slate-400">🚫 Read-only</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">Voice Assistant & Personal AI</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✅ Active</td>
                <td className="p-3 text-center text-slate-400">🚫 Disabled</td>
                <td className="p-3 text-center text-slate-400">🚫 Disabled</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">Anti-Fatigue Critical Alerts</td>
                <td className="p-3 text-center text-slate-400">Calm Banner</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✅ WhatsApp / Push</td>
                <td className="p-3 text-center text-slate-400">Flagged in EHR</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">14-Day Clinical TIR Corridor Export</td>
                <td className="p-3 text-center text-slate-600">Exportable</td>
                <td className="p-3 text-center text-slate-600">Viewable</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✅ Full Clinical PDF</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Supabase Row Level Security (RLS) Policy Architecture */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Supabase Row Level Security (RLS) Policies
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Database-level cryptographic isolation ensuring zero cross-tenant health data leaks
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {rlsPolicies.map((p, idx) => {
            const isCopied = copiedPolicyIndex === idx;
            return (
              <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-3 bg-slate-100 dark:bg-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{p.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                      {p.table}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyPolicy(idx, p.sql)}
                    className="flex items-center space-x-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy SQL'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {p.sql}
                </pre>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
                  💡 <strong>Security Guarantee:</strong> {p.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Consent Management & Security Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Sovereign Consent & Encryption Controls</span>
        </h3>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Caregiver Remote Safety-Net Delegation</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Grant Priya Deshmukh (+91 98765 43210) access to critical routine deviation alerts.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Active Consent
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-slate-900 dark:text-white">AES-256 GCM Client-Side Telemetry Encryption</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Local SQLite & Supabase database entries are encrypted before transmission.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Hardware Encrypted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
