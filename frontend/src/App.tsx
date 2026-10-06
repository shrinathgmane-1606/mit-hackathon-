import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  Language, 
  NavigationTab, 
  SeniorStatus, 
  GlucoseReading, 
  Medication, 
  Meal, 
  ActivityData, 
  CaregiverAlert, 
  TelemetryEvent, 
  AppSettings, 
  IndianFoodItem, 
  ToastNotification,
  ThemeMode,
  DensityMode,
  SelectedDetailItem,
  ReminderItem,
  HydrationData,
  SleepData,
  SystemBroadcast
} from './types';
import { 
  MOCK_BASELINE_AAI, 
  MOCK_MEDICATIONS_DEFAULT, 
  MOCK_MEALS_DEFAULT, 
  MOCK_ACTIVITY_DEFAULT, 
  MOCK_GLUCOSE_DEFAULT, 
  MOCK_CAREGIVER_ALERTS_INITIAL,
  MOCK_TELEMETRY_EVENTS_INITIAL,
  MOCK_DEFAULT_SETTINGS,
  MOCK_REMINDERS_DEFAULT,
  MOCK_HYDRATION_DEFAULT,
  MOCK_SLEEP_DEFAULT
} from './data/mockProfiles';
import { PersonalBaselineEngine } from './engine/PersonalBaselineEngine';
import { VoiceIntentResult } from './engine/VoiceEngine';
import { AuthService, SugarSenseDatabaseService, AppUser } from './lib/supabase';
import { DataService } from './services/dataService';
import { SugarSenseApiClient } from './services/api';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { SeniorView } from './components/SeniorView';
import { AssistantView } from './components/AssistantView';
import { RemindersView } from './components/RemindersView';
import { LifestyleView } from './components/LifestyleView';
import { AnalyticsView } from './components/AnalyticsView';
import { PrivacyView } from './components/PrivacyView';
import { InsightsView } from './components/InsightsView';
import { HistoryLogView } from './components/HistoryLogView';
import { CaregiverView } from './components/CaregiverView';
import { DoctorDashboard } from './components/DoctorDashboard';
import { SettingsView } from './components/SettingsView';
import { AdminDashboard } from './components/AdminDashboard';
import { WhyModal } from './components/WhyModal';
import { TellMeWhatToDoModal } from './components/TellMeWhatToDoModal';
import { VoiceModal } from './components/VoiceModal';
import { GlucoseModal } from './components/GlucoseModal';
import { QuickActionModal } from './components/QuickActionModal';
import { CommandPalette } from './components/CommandPalette';
import { DetailDrawer } from './components/DetailDrawer';
import { FocusModeView } from './components/FocusModeView';
import { ToastContainer } from './components/ToastContainer';
import { AuthModal } from './components/AuthModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { ShareableReportModal } from './components/ShareableReportModal';
import { LandingView } from './components/LandingView';
import { Radio, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  // Product Memory Initializers
  const [currentTab, setCurrentTab] = useState<NavigationTab>(() => {
    const storedTab = localStorage.getItem('sugarsense_tab') as NavigationTab;
    const storedUser = AuthService.getStoredUser();
    if (!storedUser) return 'landing';
    return storedTab || 'landing';
  });
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('sugarsense_lang') as Language) || 'en';
  });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('sugarsense_theme') as ThemeMode) || 'light';
  });
  const [density, setDensity] = useState<DensityMode>(() => {
    return (localStorage.getItem('sugarsense_density') as DensityMode) || 'comfortable';
  });
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // Authentication & Role State (Supabase Auth)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    return AuthService.getStoredUser() || null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);

  // Shell State
  const [activeScenario, setActiveScenario] = useState<string>('normal');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Core Telemetry & Profile Data
  const [baseline, setBaseline] = useState(MOCK_BASELINE_AAI);
  const [latestGlucose, setLatestGlucose] = useState<GlucoseReading | null>(MOCK_GLUCOSE_DEFAULT);
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS_DEFAULT);
  const [meals, setMeals] = useState<Meal[]>(MOCK_MEALS_DEFAULT);
  const [activity, setActivity] = useState<ActivityData>(MOCK_ACTIVITY_DEFAULT);
  const [reportedSymptoms, setReportedSymptoms] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<CaregiverAlert[]>(MOCK_CAREGIVER_ALERTS_INITIAL);
  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryEvent[]>(MOCK_TELEMETRY_EVENTS_INITIAL);
  const [settings, setSettings] = useState<AppSettings>(MOCK_DEFAULT_SETTINGS);
  const [reminders, setReminders] = useState<ReminderItem[]>(MOCK_REMINDERS_DEFAULT);
  const [hydration, setHydration] = useState<HydrationData>(MOCK_HYDRATION_DEFAULT);
  const [sleep, setSleep] = useState<SleepData>(MOCK_SLEEP_DEFAULT);
  const [activeBroadcasts, setActiveBroadcasts] = useState<SystemBroadcast[]>([]);

  // Modals & Panels
  const [isWhyOpen, setIsWhyOpen] = useState(false);
  const [isTellMeOpen, setIsTellMeOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isGlucoseModalOpen, setIsGlucoseModalOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isEmergencySOSOpen, setIsEmergencySOSOpen] = useState(false);
  const [isShareReportOpen, setIsShareReportOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<SelectedDetailItem | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((type: 'success' | 'warning' | 'error' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastNotification = { id, type, title, message };
    setToasts(prev => [...prev.slice(-3), newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Real-time Supabase Auth & Live Database Synchronization
  useEffect(() => {
    // 1. Supabase Auth State Change Listener
    const authSub = AuthService.onAuthStateChange((user) => {
      if (user) {
        setCurrentUser(user);
        setBaseline(prev => ({ ...prev, patientName: user.name }));
        setSettings(prev => ({ ...prev, activeRole: user.role }));
      }
    });

    const patientId = currentUser?.patientId || 'patient-senior-101';

    // 2. Fetch & Subscribe to Active Broadcasts
    SugarSenseDatabaseService.fetchActiveBroadcasts().then(b => {
      if (b && b.length > 0) setActiveBroadcasts(b);
    });

    // 3. Fetch Initial Data from Supabase
    DataService.fetchUserGlucose(patientId).then(readings => {
      if (readings && readings.length > 0) {
        setLatestGlucose(readings[0]);
      }
    });

    DataService.fetchMedications(patientId).then(meds => {
      if (meds && meds.length > 0) {
        setMedications(meds);
      }
    });

    DataService.fetchAlerts(patientId).then(alertsData => {
      if (alertsData && alertsData.length > 0) {
        setAlerts(alertsData);
      }
    });

    DataService.fetchMeals(patientId).then(mealsData => {
      if (mealsData && mealsData.length > 0) {
        setMeals(mealsData);
      }
    });

    // 4. Real-time Channel Subscriptions across tables
    const unsubscribeRealtime = DataService.subscribeToRealtime(patientId, (type, payload) => {
      if (type === 'glucose' && payload) {
        const newReading: GlucoseReading = {
          timestamp: new Date(payload.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: Number(payload.value),
          context: payload.meal_tag || 'RANDOM',
          isDeviation: Number(payload.value) > 160 || Number(payload.value) < 70,
          deviationDelta: Number(payload.value) > 160 ? Number(payload.value) - 145 : 0
        };
        setLatestGlucose(newReading);
        addToast('info', 'Live Glucose Sync', `New reading: ${newReading.value} mg/dL (${newReading.context})`);
      } else if (type === 'medication') {
        DataService.fetchMedications(patientId).then(m => {
          if (m && m.length > 0) setMedications(m);
        });
      } else if (type === 'alert' && payload) {
        DataService.fetchAlerts(patientId).then(a => {
          if (a && a.length > 0) setAlerts(a);
        });
      } else if (type === 'broadcast' && payload && payload.active) {
        setActiveBroadcasts(prev => [{
          id: payload.id,
          authorId: payload.author_id,
          title: payload.title,
          message: payload.message,
          targetRole: payload.target_role || 'ALL',
          urgency: payload.urgency || 'INFO',
          active: Boolean(payload.active),
          createdAt: payload.created_at
        }, ...prev.filter(b => b.id !== payload.id)]);
        addToast('warning', `Broadcast: ${payload.title}`, payload.message);
      }
    });

    return () => {
      authSub?.data?.subscription?.unsubscribe();
      unsubscribeRealtime();
    };
  }, [currentUser?.patientId, addToast]);

  // Sync dark theme with HTML class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sugarsense_theme', theme);
  }, [theme]);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('sugarsense_tab', currentTab);
  }, [currentTab]);

  useEffect(() => {
    localStorage.setItem('sugarsense_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('sugarsense_density', density);
  }, [density]);

  // Check Backend Connectivity on load
  useEffect(() => {
    SugarSenseApiClient.checkHealth().then((health) => {
      if (health) {
        setIsBackendOnline(true);
      }
    });
  }, []);

  // Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute Compound Risk Assessment
  const assessment = useMemo(() => {
    return PersonalBaselineEngine.evaluateRisk(
      baseline,
      latestGlucose,
      medications,
      meals,
      activity,
      reportedSymptoms
    );
  }, [baseline, latestGlucose, medications, meals, activity, reportedSymptoms]);

  // Actions & Telemetry Mutators
  const handleToggleMedication = useCallback((id: string) => {
    setMedications(prev => {
      const updated = prev.map(m => {
        if (m.id === id) {
          const nextState = !m.taken;
          return {
            ...m,
            taken: nextState,
            takenAt: nextState ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
          };
        }
        return m;
      });

      const toggledMed = updated.find(m => m.id === id);
      if (toggledMed) {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newEvent: TelemetryEvent = {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toISOString(),
          timeDisplay: `Today, ${timeNow}`,
          category: 'MEDICATION',
          title: `${toggledMed.name} ${toggledMed.taken ? 'Confirmed Taken' : 'Marked Skipped'}`,
          detail: toggledMed.taken ? `Dose ${toggledMed.dosage} verified.` : 'Dosage unmarked.',
          statusTag: toggledMed.taken ? 'CONFIRMED' : 'ATTENTION',
          source: 'MANUAL'
        };
        setTelemetryEvents(curr => [newEvent, ...curr]);
        SugarSenseApiClient.logTelemetry(newEvent);
        DataService.toggleMedication(id, toggledMed.taken, currentUser?.patientId);

        addToast(
          toggledMed.taken ? 'success' : 'warning',
          toggledMed.taken ? 'Medication Logged' : 'Medication Unchecked',
          `${toggledMed.name} status updated successfully.`
        );
      }
      return updated;
    });
  }, [currentUser?.patientId, addToast]);

  const handleLogIndianFood = useCallback((food: IndianFoodItem) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const displayName = language === 'mr' ? food.nameMr : language === 'hi' ? food.nameHi : food.nameEn;
    setMeals(prev => prev.map(m => {
      if (m.id === 'meal-breakfast' || m.id === 'meal-lunch' || m.id === 'meal-dinner') {
        return {
          ...m,
          status: 'LOGGED',
          loggedAt: timeNow,
          foodItems: [food.nameEn, ...(m.foodItems || [])]
        };
      }
      return m;
    }));

    const newEvent: TelemetryEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeDisplay: `Today, ${timeNow}`,
      category: 'MEAL',
      title: `${food.nameEn} Logged`,
      detail: `Glycemic Index: ${food.glycemicIndex}. Recommended tip: ${food.smartTip[language] || food.smartTip.en}`,
      statusTag: food.glycemicIndex === 'LOW' ? 'NORMAL' : 'ATTENTION',
      source: 'MANUAL'
    };
    setTelemetryEvents(curr => [newEvent, ...curr]);
    SugarSenseApiClient.logTelemetry(newEvent);
    DataService.logMeal({ name: food.nameEn, patientId: currentUser?.patientId });

    addToast('success', 'Food Recorded', `${displayName} added to daily diet log.`);
  }, [language, currentUser?.patientId, addToast]);

  const handleSaveGlucose = useCallback((value: number, context: GlucoseReading['context']) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isDeviation = value > baseline.postPrandialBaseline.max || value < 70;
    const deviationDelta = value > baseline.postPrandialBaseline.max 
      ? value - baseline.postPrandialBaseline.avg 
      : 0;

    const newReading: GlucoseReading = {
      timestamp: timeNow,
      value,
      context,
      isDeviation,
      deviationDelta
    };

    setLatestGlucose(newReading);

    const newEvent: TelemetryEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeDisplay: `Today, ${timeNow}`,
      category: 'GLUCOSE',
      title: `${context.replace('_', ' ')} Reading Logged`,
      detail: `Value recorded at ${value} mg/dL. Baseline expectation: ${baseline.postPrandialBaseline.min}-${baseline.postPrandialBaseline.max} mg/dL.`,
      value: `${value} mg/dL`,
      statusTag: isDeviation ? (value < 70 ? 'ALERT' : 'ATTENTION') : 'NORMAL',
      source: 'MANUAL'
    };
    setTelemetryEvents(curr => [newEvent, ...curr]);
    SugarSenseApiClient.logTelemetry(newEvent);
    DataService.logGlucose({ value, context, patientId: currentUser?.patientId });

    addToast(
      isDeviation ? 'warning' : 'success',
      'Glucose Reading Logged',
      `${value} mg/dL recorded. ${isDeviation ? 'Deviation flagged against personal baseline.' : 'Comfortably within target corridor.'}`
    );
  }, [baseline, currentUser?.patientId, addToast]);

  const handleLogSteps = useCallback((steps: number) => {
    const minutes = Math.round(steps / 100);
    setActivity(prev => ({
      ...prev,
      walkMinutesToday: prev.walkMinutesToday + minutes,
      stepsToday: prev.stepsToday + steps
    }));

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEvent: TelemetryEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeDisplay: `Today, ${timeNow}`,
      category: 'ACTIVITY',
      title: 'Physical Activity Recorded',
      detail: `Walked for ${minutes} minutes (+${steps} steps).`,
      value: `+${steps} steps`,
      statusTag: 'NORMAL',
      source: 'MANUAL'
    };
    setTelemetryEvents(curr => [newEvent, ...curr]);
    SugarSenseApiClient.logTelemetry(newEvent);

    addToast('success', 'Activity Logged', `${steps} steps recorded toward 3,500 daily goal.`);
  }, [addToast]);

  const handleReportSymptoms = useCallback((symptoms: string[]) => {
    setReportedSymptoms(symptoms);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEvent: TelemetryEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeDisplay: `Today, ${timeNow}`,
      category: 'SYMPTOM',
      title: 'Senior Symptom Check Logged',
      detail: `Reported: ${symptoms.join(', ')}`,
      statusTag: symptoms.length > 0 ? 'ATTENTION' : 'NORMAL',
      source: 'MANUAL'
    };
    setTelemetryEvents(curr => [newEvent, ...curr]);
    SugarSenseApiClient.logTelemetry(newEvent);

    addToast('info', 'Symptoms Recorded', 'AI risk engine updated with symptom telemetry.');
  }, [addToast]);

  const handleToggleReminder = useCallback((id: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const next = !r.isCompleted;
        addToast('success', next ? 'Reminder Completed' : 'Reminder Reset', `${r.title} updated.`);
        return { ...r, isCompleted: next };
      }
      return r;
    }));
  }, [addToast]);

  const handleSnoozeReminder = useCallback((id: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        addToast('info', 'Reminder Snoozed', `${r.title} postponed by 15 minutes.`);
        return { ...r, snoozedUntil: 'In 15 mins' };
      }
      return r;
    }));
  }, [addToast]);

  const handleAddReminder = useCallback((rem: ReminderItem) => {
    setReminders(prev => [rem, ...prev]);
    addToast('success', 'Reminder Added', `"${rem.title}" added to daily schedule.`);
  }, [addToast]);

  const handleUpdateHydration = useCallback((data: HydrationData) => {
    setHydration(data);
    if (data.glassesDrunk >= data.targetGlasses) {
      addToast('success', 'Hydration Goal Reached! 🎉', 'You have completed 8 glasses of water today.');
    }
  }, [addToast]);

  const handleAuthSuccess = useCallback((user: AppUser) => {
    setCurrentUser(user);
    setBaseline(prev => ({ ...prev, patientName: user.name }));
    setSettings(prev => ({ ...prev, activeRole: user.role }));
    addToast('success', 'Authenticated with Supabase', `Logged in as ${user.name} (${user.role}).`);
    if (user.role === 'CAREGIVER') setCurrentTab('caregiver');
    else if (user.role === 'DOCTOR') setCurrentTab('doctor');
    else setCurrentTab('dashboard');
  }, [addToast]);

  const handleSignOut = useCallback(() => {
    AuthService.signOut();
    setCurrentUser(null);
    addToast('info', 'Signed Out', 'You have been signed out successfully.');
    setCurrentTab('landing');
  }, [addToast]);

  const handleNavigateTab = useCallback((tab: NavigationTab) => {
    if (tab !== 'landing' && !currentUser) {
      setAuthInitialMode('signin');
      setIsAuthModalOpen(true);
      addToast('info', 'Authentication Required', 'Please sign in or create an account with email verification to access health dashboards.');
      return;
    }
    setCurrentTab(tab);
  }, [currentUser, addToast]);

  // Voice Interaction Handler
  const handleVoiceSuccess = useCallback((res: VoiceIntentResult) => {
    addToast('success', 'Voice Command Processed', res.speechResponse[language] || res.speechResponse.en);

    if (res.intent === 'NAVIGATE' && res.targetTab) {
      handleNavigateTab(res.targetTab);
    } else if (res.intent === 'LOG_MEDICATION' && res.extractedValue) {
      const valStr = String(res.extractedValue).toLowerCase();
      const match = medications.find(m => m.name.toLowerCase().includes(valStr));
      if (match) {
        handleToggleMedication(match.id);
      }
    } else if (res.intent === 'LOG_GLUCOSE' && typeof res.extractedValue === 'number') {
      handleSaveGlucose(res.extractedValue, 'RANDOM');
    } else if (res.intent === 'ASK_STATUS') {
      setCurrentTab('assistant');
    }
  }, [language, medications, handleToggleMedication, handleSaveGlucose, addToast]);

  // Scenario Simulator
  const handleApplyScenario = useCallback((scenarioKey: string) => {
    setActiveScenario(scenarioKey);

    if (scenarioKey === 'normal') {
      setLatestGlucose({
        timestamp: '09:15',
        value: 128,
        context: 'POST_BREAKFAST',
        isDeviation: false,
        deviationDelta: 0
      });
      setMedications(prev => prev.map(m => m.id === 'med-1' || m.id === 'med-2' || m.id === 'med-3' ? { ...m, taken: true } : m));
      setMeals(prev => prev.map(m => m.id === 'meal-breakfast' ? { ...m, status: 'LOGGED', foodItems: ['Kande Pohe', 'Chai'] } : m));
      setActivity({ stepsToday: 2450, stepTarget: 3500, walkMinutesToday: 18, walkMinutesTarget: 30, mobilityStatus: 'NORMAL' });
      setReportedSymptoms([]);
      addToast('success', 'Scenario Applied: Normal Routine', 'All biomarkers reset to healthy baseline corridor.');
    } else if (scenarioKey === 'deviation') {
      setLatestGlucose({
        timestamp: '11:45',
        value: 168,
        context: 'POST_BREAKFAST',
        isDeviation: true,
        deviationDelta: 23
      });
      setMedications(prev => prev.map(m => m.id === 'med-1' ? { ...m, taken: false } : m));
      setMeals(prev => prev.map(m => m.id === 'meal-breakfast' ? { ...m, status: 'MISSED', loggedAt: undefined } : m));
      setActivity({ stepsToday: 850, stepTarget: 3500, walkMinutesToday: 5, walkMinutesTarget: 30, mobilityStatus: 'REDUCED' });
      setReportedSymptoms([]);
      addToast('warning', 'Scenario Applied: Routine Shift', 'Breakfast missed + Glimepiride taken late. Mild attention flagged.');
    } else if (scenarioKey === 'compound_risk') {
      setLatestGlucose({
        timestamp: '12:30',
        value: 195,
        context: 'POST_BREAKFAST',
        isDeviation: true,
        deviationDelta: 50
      });
      setMedications(prev => prev.map(m => ({ ...m, taken: false })));
      setMeals(prev => prev.map(m => m.id === 'meal-breakfast' ? { ...m, status: 'MISSED' } : m));
      setActivity({ stepsToday: 320, stepTarget: 3500, walkMinutesToday: 0, walkMinutesTarget: 30, mobilityStatus: 'BEDREST' });
      setReportedSymptoms(['Dizziness (चक्कर)', 'Extreme Fatigue (खूप थकवा)']);
      
      const newAlert: CaregiverAlert = {
        id: `alert-${Date.now()}`,
        timestamp: 'Just now',
        severity: 'CRITICAL',
        title: 'Compound Deviation Detected',
        message: 'Aai missed breakfast, morning medicine is unconfirmed, and steps are extremely low.',
        detailedPattern: 'Risk Score: 78/100. Non-linear compound pattern matches hypoglycemia risk window.',
        acknowledged: false
      };
      setAlerts(prev => [newAlert, ...prev]);

      addToast('error', 'Scenario Applied: High Risk Alert', 'Multi-factor compound risk triggered. Caregiver silent safety net notified.');
    } else if (scenarioKey === 'hypo_alert') {
      setLatestGlucose({
        timestamp: '11:00',
        value: 64,
        context: 'POST_BREAKFAST',
        isDeviation: true,
        deviationDelta: -41
      });
      setMedications(prev => prev.map(m => m.id === 'med-1' ? { ...m, taken: true } : m));
      setMeals(prev => prev.map(m => m.id === 'meal-breakfast' ? { ...m, status: 'MISSED' } : m));
      setActivity({ stepsToday: 410, stepTarget: 3500, walkMinutesToday: 0, walkMinutesTarget: 30, mobilityStatus: 'REDUCED' });
      setReportedSymptoms(['Sweating (घाम)', 'Shakiness (थरथर)']);

      addToast('error', 'Hypoglycemia Warning (64 mg/dL)', 'Immediate fast-acting glucose required (15g rule).');
    }
  }, [addToast]);

  const handleExportCSV = useCallback(() => {
    const headers = ['Timestamp', 'Category', 'Title', 'Detail', 'Status', 'Source'];
    const rows = telemetryEvents.map(e => [
      `"${e.timeDisplay}"`,
      `"${e.category}"`,
      `"${e.title}"`,
      `"${e.detail.replace(/"/g, '""')}"`,
      `"${e.statusTag}"`,
      `"${e.source}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SugarSense_Telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Export Successful', 'Telemetry CSV downloaded for doctor review.');
  }, [telemetryEvents, addToast]);

  const handleApplySimulatedActions = useCallback((actionNames: string[]) => {
    setMedications(prev => prev.map(m => ({ 
      ...m, 
      taken: true, 
      takenAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) 
    })));
    setActivity(prev => ({ ...prev, stepsToday: Math.min(prev.stepTarget, prev.stepsToday + 1200) }));
    setHydration(prev => ({ ...prev, glassesDrunk: Math.min(prev.targetGlasses, prev.glassesDrunk + 2) }));
    
    const newEvent: TelemetryEvent = {
      id: `evt-sim-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeDisplay: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      category: 'MEDICATION',
      title: 'Counterfactual Routine Recovery Actions Executed',
      detail: `Applied actions: ${actionNames.join(', ')}`,
      statusTag: 'CONFIRMED',
      source: 'MANUAL'
    };
    setTelemetryEvents(prev => [newEvent, ...prev]);
    addToast('success', 'Micro-Interventions Applied!', `Applied: ${actionNames.join(', ')}. Horizon risk dropping toward stable baseline.`);
  }, [addToast]);

  const handleLogEmergencyEvent = useCallback((note: string) => {
    const newEvent: TelemetryEvent = {
      id: `evt-sos-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeDisplay: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      category: 'ALERT',
      title: 'Emergency SOS & Rule of 15 Protocol Triggered',
      detail: note,
      statusTag: 'ALERT',
      source: 'MANUAL'
    };
    setTelemetryEvents(prev => [newEvent, ...prev]);
    addToast('warning', 'Emergency SOS Dispatched', 'Caregiver alerted with live glucose reading.');
  }, [addToast]);

  // Dynamic Density Styling
  const densityPadding = {
    compact: 'p-3 sm:p-4',
    comfortable: 'p-4 sm:p-6 lg:p-8',
    spacious: 'p-6 sm:p-8 lg:p-12'
  }[density];

  // Minimalist Focus Mode View
  if (isFocusMode) {
    return (
      <FocusModeView
        baseline={baseline}
        assessment={assessment}
        medications={medications}
        onToggleMedication={handleToggleMedication}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenWhy={() => setIsWhyOpen(true)}
        onExitFocusMode={() => setIsFocusMode(false)}
        language={language}
        onOpenEmergencySOS={() => setIsEmergencySOSOpen(true)}
      />
    );
  }

  return (
    <div className={`min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 antialiased`}>
      {/* 1. Left Slide-Over Sidebar Drawer */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleNavigateTab}
        baseline={baseline}
        language={language}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenVoiceModal={() => setIsVoiceOpen(true)}
        status={assessment.status}
        currentUser={currentUser}
        onOpenSignIn={() => {
          setAuthInitialMode('signin');
          setIsAuthModalOpen(true);
        }}
        onOpenSignUp={() => {
          setAuthInitialMode('signup');
          setIsAuthModalOpen(true);
        }}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Product Header (Only rendered on non-landing views; on Product Home, LandingView renders the Single Main Menu Bar) */}
        {currentTab !== 'landing' && (
          <TopHeader
            language={language}
            onLanguageChange={setLanguage}
            activeScenario={activeScenario}
            onApplyScenario={handleApplyScenario}
            alerts={alerts}
            onOpenQuickAction={() => setIsQuickActionOpen(true)}
            onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
            onNavigateTab={handleNavigateTab}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            theme={theme}
            onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            density={density}
            onChangeDensity={setDensity}
            onToggleFocusMode={() => setIsFocusMode(prev => !prev)}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenSignIn={() => {
              setAuthInitialMode('signin');
              setIsAuthModalOpen(true);
            }}
            onOpenSignUp={() => {
              setAuthInitialMode('signup');
              setIsAuthModalOpen(true);
            }}
            isBackendOnline={isBackendOnline}
            onOpenEmergencySOS={() => setIsEmergencySOSOpen(true)}
            onOpenShareReport={() => setIsShareReportOpen(true)}
            onSignOut={handleSignOut}
          />
        )}

        {/* Active System Broadcast Notices */}
        {activeBroadcasts.filter(b => b.active && (b.targetRole === 'ALL' || b.targetRole === currentUser?.role)).map(b => (
          <div 
            key={b.id} 
            className={`px-4 py-2.5 text-xs font-bold flex items-center justify-between transition shadow-inner ${
              b.urgency === 'CRITICAL'
                ? 'bg-rose-600 text-white'
                : b.urgency === 'WARNING'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-indigo-600 text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 shrink-0 animate-pulse" />
              <span><strong>[{b.urgency} NOTICE]</strong> {b.title}: {b.message}</span>
            </div>
            <button 
              onClick={() => setActiveBroadcasts(prev => prev.filter(x => x.id !== b.id))} 
              className="text-[11px] underline opacity-90 hover:opacity-100 cursor-pointer ml-3 shrink-0"
            >
              Dismiss
            </button>
          </div>
        ))}

        {/* Dynamic Scrollable Page Content */}
        <main className={`flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 ${currentTab === 'landing' ? 'p-0' : densityPadding}`}>
          {currentTab === 'landing' && (
            <LandingView
              baseline={baseline}
              language={language}
              currentUser={currentUser}
              assessment={assessment}
              latestGlucose={latestGlucose}
              medications={medications}
              activity={activity}
              onNavigate={handleNavigateTab}
              onOpenVoice={() => setIsVoiceOpen(true)}
              onOpenEmergencySOS={() => setIsEmergencySOSOpen(true)}
              onOpenShareReport={() => setIsShareReportOpen(true)}
              onOpenSignIn={() => {
                setAuthInitialMode('signin');
                setIsAuthModalOpen(true);
              }}
              onOpenSignUp={() => {
                setAuthInitialMode('signup');
                setIsAuthModalOpen(true);
              }}
              onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
              onSignOut={handleSignOut}
            />
          )}

          {currentTab === 'dashboard' && (
            <SeniorView
              baseline={baseline}
              latestGlucose={latestGlucose}
              medications={medications}
              meals={meals}
              activity={activity}
              assessment={assessment}
              language={language}
              onOpenVoice={() => setIsVoiceOpen(true)}
              onOpenWhy={() => setIsWhyOpen(true)}
              onOpenTellMeWhatToDo={() => setIsTellMeOpen(true)}
              onToggleMedication={handleToggleMedication}
              onLogMeal={handleLogIndianFood}
              onLogGlucoseModal={() => setIsGlucoseModalOpen(true)}
              onSelectDetailItem={(item) => setSelectedDetailItem(item)}
              recentEvents={telemetryEvents.slice(0, 4)}
              onOpenEmergencySOS={() => setIsEmergencySOSOpen(true)}
              onOpenShareReport={() => setIsShareReportOpen(true)}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {currentTab === 'assistant' && (
            <AssistantView
              baseline={baseline}
              latestGlucose={latestGlucose}
              medications={medications}
              meals={meals}
              activity={activity}
              assessment={assessment}
              language={language}
            />
          )}

          {currentTab === 'reminders' && (
            <RemindersView
              reminders={reminders}
              onToggleReminder={handleToggleReminder}
              onSnoozeReminder={handleSnoozeReminder}
              onAddReminder={handleAddReminder}
              baseline={baseline}
              language={language}
            />
          )}

          {currentTab === 'lifestyle' && (
            <LifestyleView
              hydration={hydration}
              onUpdateHydration={handleUpdateHydration}
              sleep={sleep}
              baseline={baseline}
              language={language}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              baseline={baseline}
              latestGlucose={latestGlucose}
              assessment={assessment}
              language={language}
            />
          )}

          {currentTab === 'insights' && (
            <InsightsView
              baseline={baseline}
              latestGlucose={latestGlucose}
              medications={medications}
              meals={meals}
              activity={activity}
              assessment={assessment}
              language={language}
              onOpenWhy={() => setIsWhyOpen(true)}
              onOpenTellMeWhatToDo={() => setIsTellMeOpen(true)}
            />
          )}

          {currentTab === 'history' && (
            <HistoryLogView
              events={telemetryEvents}
              language={language}
              onExportCSV={handleExportCSV}
              searchQuery={globalSearchQuery}
            />
          )}

          {currentTab === 'caregiver' && (
            <CaregiverView
              baseline={baseline}
              latestGlucose={latestGlucose}
              medications={medications}
              meals={meals}
              activity={activity}
              assessment={assessment}
              alerts={alerts}
              language={language}
              onAcknowledgeAlert={(id) => {
                setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
                DataService.acknowledgeAlert(id, currentUser?.name || 'Caregiver', currentUser?.patientId);
                addToast('info', 'Alert Acknowledged', 'Caregiver safety net updated in database.');
              }}
              onOpenEmergencySOS={() => setIsEmergencySOSOpen(true)}
              onOpenShareReport={() => setIsShareReportOpen(true)}
            />
          )}

          {currentTab === 'doctor' && (
            <DoctorDashboard
              baseline={baseline}
              latestGlucose={latestGlucose}
              assessment={assessment}
              language={language}
              onOpenShareReport={() => setIsShareReportOpen(true)}
            />
          )}

          {currentTab === 'privacy' && (
            <PrivacyView
              settings={settings}
              onUpdateSettings={(s) => {
                setSettings(s);
                addToast('success', 'Security Policy Updated', 'Role permissions and encryption verified.');
              }}
              language={language}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              baseline={baseline}
              onUpdateBaseline={(b) => {
                setBaseline(b);
                addToast('success', 'Profile Updated', 'Personal baseline calibration saved.');
              }}
              settings={settings}
              onUpdateSettings={(s) => {
                setSettings(s);
                addToast('success', 'Preferences Updated', 'Accessibility and contact settings updated.');
              }}
              language={language}
              onLanguageChange={setLanguage}
              theme={theme}
              onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              currentUser={currentUser}
              onSignOut={handleSignOut}
            />
          )}

          {currentTab === 'admin' && (
            <AdminDashboard
              currentUser={currentUser}
              onUpdateCurrentUser={(updated) => {
                setCurrentUser(updated);
                setBaseline(prev => ({ ...prev, patientName: updated.name }));
                setSettings(prev => ({ ...prev, activeRole: updated.role }));
              }}
              language={language}
              onNavigateTab={handleNavigateTab}
            />
          )}
        </main>
      </div>

      {/* 3. Global Interactive Modals & Drawers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        language={language}
        initialMode={authInitialMode}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigateTab}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenQuickAction={() => setIsQuickActionOpen(true)}
        onApplyScenario={handleApplyScenario}
        onLanguageChange={setLanguage}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        onToggleFocusMode={() => setIsFocusMode(prev => !prev)}
        onExportCSV={handleExportCSV}
        onOpenEmergencySOS={() => setIsEmergencySOSOpen(true)}
        onOpenShareReport={() => setIsShareReportOpen(true)}
      />

      <DetailDrawer
        item={selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        language={language}
      />

      <VoiceModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        onVoiceSuccess={handleVoiceSuccess}
      />

      <WhyModal
        isOpen={isWhyOpen}
        onClose={() => setIsWhyOpen(false)}
        assessment={assessment}
        language={language}
        onApplySimulatedActions={handleApplySimulatedActions}
      />

      <TellMeWhatToDoModal
        isOpen={isTellMeOpen}
        onClose={() => setIsTellMeOpen(false)}
        assessment={assessment}
        language={language}
      />

      <GlucoseModal
        isOpen={isGlucoseModalOpen}
        onClose={() => setIsGlucoseModalOpen(false)}
        language={language}
        onSaveReading={handleSaveGlucose}
      />

      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        language={language}
        medications={medications}
        onLogGlucose={handleSaveGlucose}
        onToggleMedication={handleToggleMedication}
        onLogMeal={handleLogIndianFood}
        onLogActivity={handleLogSteps}
        onReportSymptoms={handleReportSymptoms}
      />

      <EmergencySOSModal
        isOpen={isEmergencySOSOpen}
        onClose={() => setIsEmergencySOSOpen(false)}
        baseline={baseline}
        latestGlucose={latestGlucose}
        language={language}
        onLogEmergencyEvent={handleLogEmergencyEvent}
      />

      <ShareableReportModal
        isOpen={isShareReportOpen}
        onClose={() => setIsShareReportOpen(false)}
        baseline={baseline}
        latestGlucose={latestGlucose}
        assessment={assessment}
        language={language}
      />

      {/* 4. Global Toast Notification Layer */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
};
