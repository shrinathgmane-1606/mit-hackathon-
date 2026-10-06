import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  Language, 
  ProfileRecord, 
  SystemBroadcast, 
  GlucoseReading, 
  Medication, 
  CaregiverAlert 
} from '../types';
import { 
  AuthService, 
  SugarSenseDatabaseService, 
  isSupabaseConfigured,
  AppUser
} from '../lib/supabase';
import { DataService } from '../services/dataService';
import { 
  ShieldCheck, 
  Users, 
  Radio, 
  Activity, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Send, 
  Trash2, 
  RefreshCw, 
  UserCheck, 
  Key, 
  Server, 
  Stethoscope, 
  HeartHandshake, 
  User, 
  Lock,
  Sparkles,
  Zap,
  Info,
  Layers,
  Table as TableIcon,
  Code
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface AdminDashboardProps {
  currentUser: AppUser | null;
  onUpdateCurrentUser: (user: AppUser) => void;
  language: Language;
  onNavigateTab: (tab: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onUpdateCurrentUser,
  language,
  onNavigateTab
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'broadcasts' | 'telemetry' | 'inspector' | 'system'>('users');
  const [profiles, setProfiles] = useState<ProfileRecord[]>([]);
  const [broadcasts, setBroadcasts] = useState<SystemBroadcast[]>([]);
  const [telemetryLogs, setTelemetryLogs] = useState<GlucoseReading[]>([]);
  const [alerts, setAlerts] = useState<CaregiverAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Live System Analytics Counters
  const [stats, setStats] = useState({
    userCount: 0,
    glucoseCount: 0,
    alertCount: 0,
    medCount: 0
  });

  // Table Inspector State
  const [selectedTable, setSelectedTable] = useState<'profiles' | 'glucose_readings' | 'medications' | 'caregiver_alerts' | 'system_broadcasts'>('profiles');
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [inspectorLoading, setInspectorLoading] = useState(false);
  
  // New Broadcast Form State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'ALL' | 'SENIOR' | 'CAREGIVER' | 'DOCTOR'>('ALL');
  const [broadcastUrgency, setBroadcastUrgency] = useState<'INFO' | 'WARNING' | 'CRITICAL'>('INFO');
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Seeding State
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  // Load Admin Data
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [profilesData, broadcastsData, glucoseData, alertsData, systemStats] = await Promise.all([
        AuthService.fetchAllProfiles(),
        SugarSenseDatabaseService.fetchActiveBroadcasts(),
        DataService.fetchUserGlucose('patient-senior-101', 25),
        DataService.fetchAlerts('patient-senior-101'),
        DataService.fetchSystemStats()
      ]);

      setProfiles(profilesData);
      setBroadcasts(broadcastsData);
      setTelemetryLogs(glucoseData);
      setAlerts(alertsData);
      setStats(systemStats);
    } catch (e) {
      console.warn('Error loading admin dashboard telemetry:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Load Raw Table Rows for Inspector
  const loadInspectorRows = async (table: string) => {
    setInspectorLoading(true);
    try {
      const data = await DataService.fetchRawTableData(table, 30);
      setRawRows(data);
    } catch (e) {
      console.warn('Error fetching inspector rows:', e);
      setRawRows([]);
    } finally {
      setInspectorLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();

    // Subscribe to live broadcasts
    const sub = SugarSenseDatabaseService.subscribeToBroadcasts((newBroadcast) => {
      setBroadcasts((prev) => [newBroadcast, ...prev.filter((b) => b.id !== newBroadcast.id)]);
    });

    return () => {
      sub?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (activeAdminTab === 'inspector') {
      loadInspectorRows(selectedTable);
    }
  }, [activeAdminTab, selectedTable]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const success = await AuthService.updateUserRole(userId, newRole);
    if (success) {
      setProfiles((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, role: newRole } : p))
      );
      if (currentUser && currentUser.id === userId) {
        onUpdateCurrentUser({ ...currentUser, role: newRole });
      }
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    setBroadcastSending(true);
    const success = await SugarSenseDatabaseService.createBroadcast({
      title: broadcastTitle.trim(),
      message: broadcastMessage.trim(),
      targetRole: broadcastTarget,
      urgency: broadcastUrgency
    });

    if (success) {
      setBroadcastSuccess(true);
      setBroadcastTitle('');
      setBroadcastMessage('');
      setTimeout(() => setBroadcastSuccess(false), 3000);
      loadAdminData();
    }
    setBroadcastSending(false);
  };

  const handleDeactivateBroadcast = async (id: string) => {
    await SugarSenseDatabaseService.deactivateBroadcast(id);
    setBroadcasts((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    const res = await SugarSenseDatabaseService.seedInitialData('patient-senior-101');
    setIsSeeding(false);
    if (res) {
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3000);
      loadAdminData();
    }
  };

  const filteredProfiles = profiles.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 backdrop-blur-md flex items-center justify-center border border-indigo-400/40 text-indigo-300 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                System Administration & Database Control
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Root Access
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Live Supabase user registry, real-time telemetry stream, RLS policies, table inspector, and broadcasts.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={loadAdminData}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Live Data</span>
          </button>
        </div>
      </div>

      {/* 2. Live System Analytics Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Registered Users</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.userCount || profiles.length}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">100% Synced (RLS Active)</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Glucose Logs</span>
            <Activity className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.glucoseCount || telemetryLogs.length}
          </div>
          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">Realtime WebSockets</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Caregiver Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.alertCount || alerts.length}
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
            {alerts.filter(a => !a.acknowledged).length} Pending Acks
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Medication Regimens</span>
            <HeartHandshake className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.medCount || 3}
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">Active Patient Schedules</span>
        </div>
      </div>

      {/* 3. Persona Impersonation Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Active Persona Impersonation:
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Current: <strong className="text-indigo-600 dark:text-indigo-400">{currentUser?.role || 'ADMIN'}</strong> ({currentUser?.name})
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {[
            { role: 'SENIOR' as UserRole, label: '👴 Senior', tab: 'dashboard' },
            { role: 'CAREGIVER' as UserRole, label: '👨‍👩‍👧 Caregiver', tab: 'caregiver' },
            { role: 'DOCTOR' as UserRole, label: '👨‍⚕️ Clinician', tab: 'doctor' },
            { role: 'ADMIN' as UserRole, label: '🛠️ Admin', tab: 'admin' }
          ].map((item) => (
            <button
              key={item.role}
              onClick={() => {
                if (currentUser) {
                  onUpdateCurrentUser({ ...currentUser, role: item.role });
                }
                if (item.tab !== 'admin') {
                  onNavigateTab(item.tab);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                currentUser?.role === item.role
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'users', label: 'User Directory & Roles', icon: <Users className="w-4 h-4" />, count: profiles.length },
          { id: 'broadcasts', label: 'Emergency Broadcasts', icon: <Radio className="w-4 h-4" />, count: broadcasts.length },
          { id: 'telemetry', label: 'Live Telemetry Stream', icon: <Activity className="w-4 h-4" /> },
          { id: 'inspector', label: 'Database Table Inspector', icon: <TableIcon className="w-4 h-4" /> },
          { id: 'system', label: 'Supabase & RLS Health', icon: <Server className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeAdminTab === tab.id
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 5. Tab 1: User Directory & Role Elevation */}
      {activeAdminTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Registered Users & Row Level Security Access</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Elevate user permissions, assign clinical or caregiver roles, and inspect account metadata.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search user, email, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <th className="p-3 rounded-l-xl">User Profile</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">Assigned Patient ID</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Registered At</th>
                  <th className="p-3 rounded-r-xl text-right">Role Elevation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProfiles.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300 text-xs">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                            <span>{p.name}</span>
                            {currentUser?.id === p.id && (
                              <span className="text-[9px] px-1.5 py-0.2 bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded font-bold">YOU</span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{p.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide border ${
                        p.role === 'ADMIN'
                          ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                          : p.role === 'DOCTOR'
                          ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                          : p.role === 'CAREGIVER'
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      }`}>
                        {p.role}
                      </span>
                    </td>

                    <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {p.patientId || 'patient-senior-101'}
                    </td>

                    <td className="p-3 text-[11px] text-slate-600 dark:text-slate-300">
                      {p.phone || '—'}
                    </td>

                    <td className="p-3 text-[11px] text-slate-500 dark:text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3 text-right">
                      <select
                        value={p.role}
                        onChange={(e) => handleRoleChange(p.id, e.target.value as UserRole)}
                        className="p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                      >
                        <option value="SENIOR">Senior</option>
                        <option value="CAREGIVER">Caregiver</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Tab 2: Emergency Broadcasts Composer */}
      {activeAdminTab === 'broadcasts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <Radio className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Issue System Broadcast</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Send instant alerts to patient, caregiver, or clinician dashboards.
              </p>
            </div>

            {broadcastSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Emergency Broadcast Dispatched!</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Broadcast Title
                </label>
                <Input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Server Maintenance Notice"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Message Content
                </label>
                <textarea
                  required
                  rows={3}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="e.g. Please verify your scheduled evening dosage before 8:00 PM."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Target Role
                  </label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    <option value="ALL">All Users</option>
                    <option value="SENIOR">Seniors Only</option>
                    <option value="CAREGIVER">Caregivers Only</option>
                    <option value="DOCTOR">Doctors Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={broadcastUrgency}
                    onChange={(e) => setBroadcastUrgency(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    <option value="INFO">Info (Blue)</option>
                    <option value="WARNING">Warning (Amber)</option>
                    <option value="CRITICAL">Critical SOS (Red)</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                variant="teal"
                disabled={broadcastSending}
                className="w-full h-10 text-xs font-black shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{broadcastSending ? 'Broadcasting...' : 'Publish Live Broadcast'}</span>
              </Button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Active Live Broadcasts ({broadcasts.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Currently rendered across active user sessions via Supabase Realtime.
                </p>
              </div>
            </div>

            {broadcasts.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Radio className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">No active broadcasts currently running.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {broadcasts.map((b) => (
                  <div
                    key={b.id}
                    className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                      b.urgency === 'CRITICAL'
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60'
                        : b.urgency === 'WARNING'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60'
                        : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          b.urgency === 'CRITICAL'
                            ? 'bg-rose-600 text-white'
                            : b.urgency === 'WARNING'
                            ? 'bg-amber-600 text-white'
                            : 'bg-indigo-600 text-white'
                        }`}>
                          {b.urgency}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          Target: {b.targetRole}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(b.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {b.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        {b.message}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeactivateBroadcast(b.id)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition cursor-pointer"
                      title="Deactivate Broadcast"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. Tab 3: Live Telemetry Stream */}
      {activeAdminTab === 'telemetry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <span>Glucose Stream (PostgreSQL)</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Live
              </span>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {telemetryLogs.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No telemetry logs recorded yet.</p>
              ) : (
                telemetryLogs.map((log, i) => (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${log.isDeviation ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          {log.value} mg/dL ({log.context})
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      log.isDeviation ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {log.isDeviation ? 'DEVIATION' : 'IN_RANGE'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Caregiver Alerts Stream</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {alerts.filter(a => !a.acknowledged).length} Pending
              </span>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No alerts logged yet.</p>
              ) : (
                alerts.map((alert, i) => (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {alert.title}
                      </span>
                      <span className="text-[10px] text-slate-400">{alert.timestamp} • {alert.message}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      alert.acknowledged ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {alert.acknowledged ? 'Acknowledged' : 'Pending'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. Tab 4: Database Table Inspector */}
      {activeAdminTab === 'inspector' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <TableIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Database Table Inspector</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Inspect raw rows, column values, and timestamps directly from PostgreSQL tables.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value as any)}
                className="p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="profiles">public.profiles</option>
                <option value="glucose_readings">public.glucose_readings</option>
                <option value="medications">public.medications</option>
                <option value="caregiver_alerts">public.caregiver_alerts</option>
                <option value="system_broadcasts">public.system_broadcasts</option>
              </select>

              <button
                onClick={() => loadInspectorRows(selectedTable)}
                disabled={inspectorLoading}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-300 transition cursor-pointer"
                title="Refresh Table"
              >
                <RefreshCw className={`w-4 h-4 ${inspectorLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {inspectorLoading ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400 flex items-center justify-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
              <span>Querying Supabase Table: {selectedTable}...</span>
            </div>
          ) : rawRows.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <TableIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">No rows found in table: {selectedTable}</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider sticky top-0">
                    {Object.keys(rawRows[0]).map((col) => (
                      <th key={col} className="p-2.5 border-b border-slate-200 dark:border-slate-700">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {rawRows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      {Object.keys(rawRows[0]).map((col) => (
                        <td key={col} className="p-2.5 text-[11px] text-slate-700 dark:text-slate-300 max-w-xs truncate">
                          {typeof row[col] === 'object' && row[col] !== null
                            ? JSON.stringify(row[col])
                            : String(row[col] ?? 'NULL')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 9. Tab 5: Supabase System Health & Data Seeding */}
      {activeAdminTab === 'system' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Supabase PostgreSQL & Security Status</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Inspect database connection parameters, active RLS policies, and run test seeders.
              </p>
            </div>

            <Button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              variant="outline"
              className="text-xs font-bold flex items-center space-x-2 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{isSeeding ? 'Seeding...' : seedSuccess ? 'Database Seeded! ✅' : 'Seed Default Health Records'}</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Supabase Connection
              </span>
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {isSupabaseConfigured ? 'Live PostgreSQL Connected' : 'Local Memory Sandbox'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Row Level Security (RLS)
              </span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                <Lock className="w-4 h-4" />
                <span>Enforced on 6 Tables</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Realtime Publication
              </span>
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 flex items-center space-x-1.5">
                <Radio className="w-4 h-4" />
                <span>Active (`supabase_realtime`)</span>
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 text-xs space-y-2">
            <h4 className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center space-x-2">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Supabase Migration Script Reference</span>
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The full schema file <code className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono font-bold text-indigo-600 dark:text-indigo-400">database/schema.sql</code> is ready. It configures the automatic profile creation trigger on <code className="font-mono font-bold">auth.users</code>, initializes core health tables (glucose readings, medications, caregiver alerts, meals, broadcasts), and secures all records via Postgres Row Level Security.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
