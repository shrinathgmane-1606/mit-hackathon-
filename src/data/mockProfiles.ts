import { 
  PersonalBaseline, 
  Medication, 
  Meal, 
  GlucoseReading, 
  ActivityData, 
  CaregiverAlert, 
  TelemetryEvent, 
  AppSettings,
  WeightRecord,
  HydrationData,
  SleepData,
  ReminderItem,
  ChatMessage,
  FitnessSuggestion
} from '../types';

export const MOCK_BASELINE_AAI: PersonalBaseline = {
  patientId: 'patient-senior-101',
  patientName: 'Senior Patient',
  preferredName: {
    en: 'Parent',
    hi: 'माता-पिता',
    mr: 'आई-बाबा'
  },
  age: 72,
  diabetesType: 'Type 2',
  yearsWithDiabetes: 8,
  fastingGlucoseBaseline: { min: 105, max: 135, avg: 118 },
  postPrandialBaseline: { min: 130, max: 160, avg: 145 },
  baselineWeightKg: 64.5,
  typicalWakeupTime: '06:30',
  typicalBreakfastTime: '08:30',
  typicalLunchTime: '13:00',
  typicalDinnerTime: '20:00',
  typicalBedtime: '22:00',
  baselineDailySteps: 3500,
  hypoVulnerability: true // Takes Glimepiride
};

export const MOCK_MEDICATIONS_DEFAULT: Medication[] = [
  {
    id: 'med-1',
    name: 'Glimepiride 1mg',
    dosage: '1 tablet (Before Breakfast)',
    scheduledTime: '08:15',
    taken: true,
    takenAt: '08:20',
    criticality: 'CRITICAL',
    instructions: {
      en: 'Take before morning breakfast. Helps stimulate insulin secretion.',
      hi: 'सुबह नाश्ते से पहले लें। इंसुलिन संतुलित रखने में मदद करता है।',
      mr: 'सकाळच्या नाश्त्यापूर्वी घ्या. साखर नियंत्रणात ठेवण्यास मदत करते.'
    }
  },
  {
    id: 'med-2',
    name: 'Metformin 500mg (SR)',
    dosage: '1 tablet (After Breakfast)',
    scheduledTime: '09:00',
    taken: true,
    takenAt: '09:05',
    criticality: 'STANDARD',
    instructions: {
      en: 'Take with or immediately after food.',
      hi: 'भोजन के तुरंत बाद लें।',
      mr: 'जेवणानंतर लगेच गोळी घ्यावी.'
    }
  },
  {
    id: 'med-3',
    name: 'Telmisartan 40mg',
    dosage: '1 tablet (Morning)',
    scheduledTime: '09:30',
    taken: true,
    takenAt: '09:30',
    criticality: 'STANDARD',
    instructions: {
      en: 'Blood pressure maintenance.',
      hi: 'ब्लड प्रेशर नियंत्रण के लिए।',
      mr: 'रक्तदाब नियंत्रणासाठी.'
    }
  },
  {
    id: 'med-4',
    name: 'Metformin 500mg (SR)',
    dosage: '1 tablet (After Dinner)',
    scheduledTime: '20:45',
    taken: false,
    criticality: 'STANDARD',
    instructions: {
      en: 'Take with or after dinner.',
      hi: 'रात के भोजन के बाद लें।',
      mr: 'रात्रीच्या जेवणानंतर गोळी घ्यावी.'
    }
  }
];

export const MOCK_MEALS_DEFAULT: Meal[] = [
  {
    id: 'meal-breakfast',
    name: 'Morning Breakfast',
    scheduledTime: '08:30',
    status: 'LOGGED',
    loggedAt: '08:45',
    foodItems: ['Kande Pohe', 'Chai (Less Sugar)'],
    estimatedCarbs: 'MEDIUM',
    glycemicAdvice: {
      en: 'Good balance with peanuts added.',
      hi: 'मूंगफली के साथ अच्छा संतुलन।',
      mr: 'शेंगदाणे घातल्याने पोषण संतुलित आहे.'
    }
  },
  {
    id: 'meal-lunch',
    name: 'Afternoon Lunch',
    scheduledTime: '13:00',
    status: 'DUE',
    foodItems: ['Jowar Bhakri', 'Methi Sabzi', 'Dal'],
    estimatedCarbs: 'LOW',
    glycemicAdvice: {
      en: 'High fiber meal planned.',
      hi: 'फाइबर युक्त आहार निर्धारित।',
      mr: 'फायबरयुक्त चौरस आहार.'
    }
  },
  {
    id: 'meal-dinner',
    name: 'Night Dinner',
    scheduledTime: '20:00',
    status: 'DUE',
    foodItems: ['Moong Dal Khichdi', 'Kadhi'],
    estimatedCarbs: 'LOW'
  }
];

export const MOCK_ACTIVITY_DEFAULT: ActivityData = {
  stepsToday: 2450,
  stepTarget: 3500,
  walkMinutesToday: 18,
  walkMinutesTarget: 30,
  mobilityStatus: 'NORMAL'
};

export const MOCK_GLUCOSE_DEFAULT: GlucoseReading = {
  timestamp: '09:15',
  value: 128,
  context: 'POST_BREAKFAST',
  isDeviation: false,
  deviationDelta: 0
};

export const MOCK_WEIGHT_RECORDS: WeightRecord[] = [
  { id: 'w-1', date: 'Today', timestamp: '07:00 AM', valueKg: 64.4, deltaKg: -0.1, isFlagged: false },
  { id: 'w-2', date: '3 Days Ago', timestamp: '07:15 AM', valueKg: 64.5, deltaKg: 0.0, isFlagged: false },
  { id: 'w-3', date: '1 Week Ago', timestamp: '07:10 AM', valueKg: 64.6, deltaKg: -0.2, isFlagged: false },
  { id: 'w-4', date: '2 Weeks Ago', timestamp: '07:00 AM', valueKg: 64.8, deltaKg: 0.1, isFlagged: false },
  { id: 'w-5', date: '1 Month Ago', timestamp: '07:30 AM', valueKg: 65.2, deltaKg: -0.4, isFlagged: false },
];

export const MOCK_HYDRATION_DEFAULT: HydrationData = {
  glassesDrunk: 5,
  targetGlasses: 8,
  lastLogTime: '11:15 AM'
};

export const MOCK_SLEEP_DEFAULT: SleepData = {
  hoursSlept: 7.4,
  sleepQuality: 'GOOD',
  deepSleepPercent: 24,
  bedtime: '10:15 PM',
  wakeTime: '06:15 AM'
};

export const MOCK_REMINDERS_DEFAULT: ReminderItem[] = [
  {
    id: 'rem-1',
    type: 'GLUCOSE',
    title: 'Morning Fasting Sugar Check',
    time: '07:30 AM',
    recurring: 'DAILY',
    isCompleted: true,
    note: 'Record reading before tea/breakfast.'
  },
  {
    id: 'rem-2',
    type: 'MEDICATION',
    title: 'Glimepiride 1mg (Pre-breakfast)',
    time: '08:15 AM',
    recurring: 'DAILY',
    isCompleted: true,
    note: 'Take 15-20 minutes before morning breakfast.'
  },
  {
    id: 'rem-3',
    type: 'MEDICATION',
    title: 'Metformin 500mg (SR) with Lunch',
    time: '01:30 PM',
    recurring: 'DAILY',
    isCompleted: false,
    note: 'Take immediately after lunch with water.'
  },
  {
    id: 'rem-4',
    type: 'ACTIVITY',
    title: 'Evening 15-Min Garden Walk',
    time: '05:30 PM',
    recurring: 'DAILY',
    isCompleted: false,
    note: 'Gentle stroll to reach 3,500 daily step target.'
  },
  {
    id: 'rem-5',
    type: 'DOCTOR_APPOINTMENT',
    title: 'Quarterly Checkup with Dr. Mehta (Endocrinologist)',
    time: 'This Friday, 10:30 AM',
    recurring: 'ONCE',
    isCompleted: false,
    doctorName: 'Dr. Rajesh Mehta (MD)',
    clinicAddress: 'Apollo Clinic, Swargate, Pune',
    note: 'Carry 14-day SugarSense visit report export.'
  }
];

export const MOCK_FITNESS_SUGGESTIONS: FitnessSuggestion[] = [
  {
    id: 'fit-1',
    title: 'Post-Meal 10-Minute Gentle Stroll',
    category: 'POST_MEAL',
    durationMin: 10,
    intensity: 'GENTLE',
    instructions: {
      en: 'Walk slowly inside the house or veranda 20 minutes after finishing lunch or dinner.',
      mr: 'दुपारच्या किंवा रात्रीच्या जेवणानंतर २० मिनिटांनी घरातच १० मिनिटे सावकाश फिरा.',
      hi: 'दोपहर या रात के भोजन के 20 मिनट बाद घर के अंदर ही 10 मिनट आराम से टहलें।'
    },
    benefits: 'Stimulates glucose transport into muscles without insulin resistance spike.'
  },
  {
    id: 'fit-2',
    title: 'Seated Ankle Rotations & Calf Raises',
    category: 'CHAIR_YOGA',
    durationMin: 8,
    intensity: 'LOW_IMPACT',
    instructions: {
      en: 'Sit comfortably on a sturdy chair. Rotate each ankle 10 times, then lift heels 15 times.',
      mr: 'खुर्चीवर शांत बसा. दोन्ही घोटे गोलाकार फिरवा आणि टाचा १५ वेळा वर-खाली करा.',
      hi: 'कुर्सी पर आराम से बैठें। दोनों टखनों को 10 बार घुमाएं और एड़ियों को 15 बार ऊपर उठाएं।'
    },
    benefits: 'Boosts lower extremity venous return and protects diabetic foot micro-circulation.'
  },
  {
    id: 'fit-3',
    title: 'Gentle Pranayamic Deep Breathing (Anulom Vilom)',
    category: 'MOBILITY',
    durationMin: 10,
    intensity: 'GENTLE',
    instructions: {
      en: 'Sit with back straight. Inhale calmly through left nostril, exhale through right. Repeat slowly.',
      mr: 'पाठ सरळ ठेवून बसा. डाव्या नाकपुडीने शांतपणे श्वास घ्या व उजवीकडून सोडा.',
      hi: 'कमर सीधी रखकर बैठें। बाईं नाक से सांस लें और दाईं ओर से धीरे-धीरे छोड़ें।'
    },
    benefits: 'Reduces cortisol levels, which helps stabilize basal hepatic glucose production.'
  }
];

export const MOCK_CHAT_CONVERSATION_INITIAL: ChatMessage[] = [
  {
    id: 'chat-1',
    sender: 'assistant',
    text: "Hello Aai! I am SugarSense, your personal elderly diabetes companion. You can ask me anything about your glucose readings, medications, Indian food advice, or how your routine is going today.",
    timestamp: '09:00 AM',
    suggestedFollowups: [
      'How was my blood sugar this morning?',
      'Can I eat Poha with tea for breakfast?',
      'What is my next medicine schedule?',
      'Why is my health status green today?'
    ]
  }
];

export const MOCK_HISTORICAL_14_DAYS = [
  { day: 'Day -14', fasting: 114, postMeal: 142, adherence: 100, steps: 3600, weight: 64.9 },
  { day: 'Day -13', fasting: 118, postMeal: 148, adherence: 100, steps: 3400, weight: 64.8 },
  { day: 'Day -12', fasting: 112, postMeal: 139, adherence: 100, steps: 3750, weight: 64.8 },
  { day: 'Day -11', fasting: 125, postMeal: 152, adherence: 90, steps: 3200, weight: 64.7 },
  { day: 'Day -10', fasting: 116, postMeal: 145, adherence: 100, steps: 3550, weight: 64.7 },
  { day: 'Day -9',  fasting: 120, postMeal: 149, adherence: 100, steps: 3800, weight: 64.6 },
  { day: 'Day -8',  fasting: 115, postMeal: 140, adherence: 100, steps: 3600, weight: 64.6 },
  { day: 'Day -7',  fasting: 119, postMeal: 144, adherence: 100, steps: 3450, weight: 64.6 },
  { day: 'Day -6',  fasting: 122, postMeal: 155, adherence: 90, steps: 3100, weight: 64.5 },
  { day: 'Day -5',  fasting: 118, postMeal: 146, adherence: 100, steps: 3500, weight: 64.5 },
  { day: 'Day -4',  fasting: 113, postMeal: 138, adherence: 100, steps: 3900, weight: 64.5 },
  { day: 'Day -3',  fasting: 117, postMeal: 147, adherence: 100, steps: 3650, weight: 64.4 },
  { day: 'Day -2',  fasting: 121, postMeal: 150, adherence: 100, steps: 3400, weight: 64.4 },
  { day: 'Yesterday', fasting: 119, postMeal: 143, adherence: 100, steps: 3520, weight: 64.4 },
];

export const MOCK_CAREGIVER_ALERTS_INITIAL: CaregiverAlert[] = [
  {
    id: 'alert-1',
    timestamp: 'Yesterday, 8:45 PM',
    severity: 'INFO',
    title: 'Routine Verified',
    message: "Aai's evening routine was completed smoothly with normal post-dinner readings.",
    detailedPattern: 'All 3 prescribed doses confirmed. 3,520 steps recorded.',
    acknowledged: true
  }
];

export const MOCK_TELEMETRY_EVENTS_INITIAL: TelemetryEvent[] = [
  {
    id: 'evt-1',
    timestamp: new Date().toISOString(),
    timeDisplay: 'Today, 09:15 AM',
    category: 'GLUCOSE',
    title: 'Post-Breakfast Glucose Logged',
    detail: 'Blood glucose recorded at 128 mg/dL. Within learned baseline corridor (130-160 mg/dL).',
    value: '128 mg/dL',
    statusTag: 'NORMAL',
    source: 'SENSOR'
  },
  {
    id: 'evt-2',
    timestamp: new Date().toISOString(),
    timeDisplay: 'Today, 09:05 AM',
    category: 'MEDICATION',
    title: 'Metformin 500mg (SR) Confirmed',
    detail: 'Morning post-meal dose taken on schedule.',
    statusTag: 'CONFIRMED',
    source: 'VOICE'
  },
  {
    id: 'evt-3',
    timestamp: new Date().toISOString(),
    timeDisplay: 'Today, 08:45 AM',
    category: 'MEAL',
    title: 'Breakfast: Kande Pohe & Tea',
    detail: 'Medium carbohydrate load logged. Peanuts added for healthy fat buffer.',
    statusTag: 'NORMAL',
    source: 'VOICE'
  },
  {
    id: 'evt-4',
    timestamp: new Date().toISOString(),
    timeDisplay: 'Today, 08:20 AM',
    category: 'MEDICATION',
    title: 'Glimepiride 1mg Confirmed',
    detail: 'Critical pre-breakfast dose taken 25 mins prior to meal.',
    statusTag: 'CONFIRMED',
    source: 'MANUAL'
  },
  {
    id: 'evt-5',
    timestamp: new Date().toISOString(),
    timeDisplay: 'Today, 07:00 AM',
    category: 'WEIGHT',
    title: 'Morning Weight Logged',
    detail: 'Recorded 64.4 kg. Stable over 14-day trajectory.',
    value: '64.4 kg',
    statusTag: 'NORMAL',
    source: 'MANUAL'
  },
  {
    id: 'evt-6',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    timeDisplay: 'Yesterday, 08:30 PM',
    category: 'GLUCOSE',
    title: 'Post-Dinner Glucose Logged',
    detail: 'Blood glucose recorded at 143 mg/dL.',
    value: '143 mg/dL',
    statusTag: 'NORMAL',
    source: 'SENSOR'
  },
  {
    id: 'evt-7',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    timeDisplay: 'Yesterday, 06:15 PM',
    category: 'ACTIVITY',
    title: 'Evening Walk Completed',
    detail: '1,840 steps completed during 22-min garden walk.',
    value: '1,840 steps',
    statusTag: 'NORMAL',
    source: 'SENSOR'
  }
];

export const MOCK_DEFAULT_SETTINGS: AppSettings = {
  fontSize: 'standard',
  highContrast: false,
  speechSpeed: 0.9,
  caregiverPhone: '+91 98765 43210',
  caregiverEmail: 'priya.deshmukh@gmail.com',
  doctorPhone: '+91 98230 11223',
  soundEnabled: true,
  dailyNotificationReminder: true,
  theme: 'light',
  density: 'comfortable',
  focusMode: false,
  activeRole: 'SENIOR',
  supabaseRlsEnabled: true,
  cloudSyncStatus: 'SYNCED'
};
