export type Language = 'mr' | 'hi' | 'en';

export type SeniorStatus = 'STABLE' | 'ATTENTION' | 'HIGH_RISK';

export type NavigationTab = 
  | 'landing'
  | 'dashboard' 
  | 'assistant' 
  | 'reminders' 
  | 'lifestyle' 
  | 'analytics' 
  | 'insights' 
  | 'history' 
  | 'caregiver' 
  | 'doctor' 
  | 'privacy' 
  | 'settings';

export type ThemeMode = 'light' | 'dark' | 'system';

export type DensityMode = 'compact' | 'comfortable' | 'spacious';

export type UserRole = 'SENIOR' | 'CAREGIVER' | 'DOCTOR';

export interface NextBestAction {
  id: string;
  title: string;
  subtitle: string;
  whyItMatters: string;
  actionLabel: string;
  actionType: 'LOG_MED' | 'LOG_GLUCOSE' | 'LOG_MEAL' | 'LOG_WALK' | 'VIEW_INSIGHTS' | 'WHATSAPP_PARENT' | 'LOG_WATER';
  urgency: 'CRITICAL' | 'MEDIUM' | 'LOW';
  targetId?: string;
}

export interface SelectedDetailItem {
  type: 'GLUCOSE' | 'MEDICATION' | 'MEAL' | 'ACTIVITY' | 'ALERT' | 'INSIGHT' | 'WEIGHT' | 'REMINDER';
  title: string;
  subtitle: string;
  timestamp: string;
  statusTag: 'NORMAL' | 'ATTENTION' | 'ALERT' | 'CONFIRMED';
  details: Record<string, string | number | boolean | undefined>;
  whyItMatters: string;
  clinicalNote?: string;
  recommendations: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  scheduledTime: string; // e.g. "08:30"
  taken: boolean;
  takenAt?: string;
  criticality: 'CRITICAL' | 'STANDARD';
  instructions: {
    en: string;
    hi: string;
    mr: string;
  };
}

export interface Meal {
  id: string;
  name: string;
  scheduledTime: string;
  status: 'DUE' | 'LOGGED' | 'MISSED';
  loggedAt?: string;
  foodItems?: string[];
  estimatedCarbs?: 'LOW' | 'MEDIUM' | 'HIGH';
  glycemicAdvice?: {
    en: string;
    hi: string;
    mr: string;
  };
}

export interface GlucoseReading {
  timestamp: string;
  value: number; // mg/dL
  context: 'FASTING' | 'POST_BREAKFAST' | 'POST_LUNCH' | 'POST_DINNER' | 'RANDOM';
  isDeviation: boolean;
  deviationDelta: number; // difference from personal baseline
}

export interface ActivityData {
  stepsToday: number;
  stepTarget: number;
  walkMinutesToday: number;
  walkMinutesTarget: number;
  mobilityStatus: 'NORMAL' | 'REDUCED' | 'BEDREST';
}

export interface WeightRecord {
  id: string;
  date: string;
  timestamp: string;
  valueKg: number;
  deltaKg: number;
  isFlagged: boolean;
  note?: string;
}

export interface HydrationData {
  glassesDrunk: number;
  targetGlasses: number;
  lastLogTime: string;
}

export interface SleepData {
  hoursSlept: number;
  sleepQuality: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
  deepSleepPercent: number;
  bedtime: string;
  wakeTime: string;
}

export interface ReminderItem {
  id: string;
  type: 'MEDICATION' | 'GLUCOSE' | 'MEAL' | 'ACTIVITY' | 'HYDRATION' | 'DOCTOR_APPOINTMENT';
  title: string;
  time: string;
  recurring: 'DAILY' | 'TWICE_DAILY' | 'WEEKLY' | 'ONCE';
  isCompleted: boolean;
  snoozedUntil?: string;
  note?: string;
  doctorName?: string;
  clinicAddress?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
  suggestedFollowups?: string[];
}

export interface FitnessSuggestion {
  id: string;
  title: string;
  category: 'MOBILITY' | 'STRETCHING' | 'POST_MEAL' | 'CHAIR_YOGA';
  durationMin: number;
  intensity: 'GENTLE' | 'LOW_IMPACT' | 'MODERATE';
  instructions: {
    en: string;
    mr: string;
    hi: string;
  };
  benefits: string;
}

export interface PersonalBaseline {
  patientId: string;
  patientName: string;
  preferredName: {
    en: string;
    hi: string;
    mr: string;
  };
  age: number;
  diabetesType: 'Type 2' | 'Type 1';
  yearsWithDiabetes: number;
  fastingGlucoseBaseline: { min: number; max: number; avg: number };
  postPrandialBaseline: { min: number; max: number; avg: number };
  baselineWeightKg: number;
  typicalWakeupTime: string;
  typicalBreakfastTime: string;
  typicalLunchTime: string;
  typicalDinnerTime: string;
  typicalBedtime: string;
  baselineDailySteps: number;
  hypoVulnerability: boolean;
}

export interface CompoundRiskAssessment {
  status: SeniorStatus;
  score: number; // 0 to 100 risk score
  title: {
    en: string;
    hi: string;
    mr: string;
  };
  summary: {
    en: string;
    hi: string;
    mr: string;
  };
  whyExplanation: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  recommendedActions: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  caregiverAlertRecommended: boolean;
  caregiverAlertReason?: {
    en: string;
    hi: string;
    mr: string;
  };
  doctorSummaryNote?: string;
  factors: {
    glucoseRisk: number; // 0 - 100
    medicationRisk: number; // 0 - 100
    mealRisk: number; // 0 - 100
    activityRisk: number; // 0 - 100
    symptomRisk: number; // 0 - 100
    weightRisk?: number;
  };
}

export interface CaregiverAlert {
  id: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
  detailedPattern: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  parentResponseReceived?: boolean;
}

export interface IndianFoodItem {
  id: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  category: 'BREAKFAST' | 'MEAL' | 'SNACK' | 'SWEET' | 'BEVERAGE';
  glycemicIndex: 'LOW' | 'MEDIUM' | 'HIGH';
  portionRecommendation: {
    en: string;
    hi: string;
    mr: string;
  };
  smartTip: {
    en: string;
    hi: string;
    mr: string;
  };
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  timeDisplay: string;
  category: 'GLUCOSE' | 'MEDICATION' | 'MEAL' | 'ACTIVITY' | 'SYMPTOM' | 'ALERT' | 'WEIGHT' | 'REMINDER';
  title: string;
  detail: string;
  value?: string | number;
  statusTag: 'NORMAL' | 'ATTENTION' | 'ALERT' | 'CONFIRMED';
  source: 'MANUAL' | 'VOICE' | 'AUTOMATED' | 'SENSOR';
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface AppSettings {
  fontSize: 'standard' | 'large' | 'extra-large';
  highContrast: boolean;
  speechSpeed: number;
  caregiverPhone: string;
  caregiverEmail: string;
  doctorPhone: string;
  soundEnabled: boolean;
  dailyNotificationReminder: boolean;
  theme: ThemeMode;
  density: DensityMode;
  focusMode: boolean;
  activeRole: UserRole;
  supabaseRlsEnabled: boolean;
  cloudSyncStatus: 'SYNCED' | 'PENDING' | 'OFFLINE';
}
