import React, { useState, useEffect, useRef } from 'react';
import { 
  NavigationTab, 
  Language, 
  PersonalBaseline, 
  GlucoseReading, 
  Medication, 
  ActivityData, 
  CompoundRiskAssessment 
} from '../types';
import { AppUser } from '../lib/supabase';
import { INDIAN_FOOD_DATABASE } from '../engine/IndianFoodAI';
import { MOCK_HISTORICAL_14_DAYS } from '../data/mockProfiles';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceArea 
} from 'recharts';
import { 
  Sparkles, 
  ArrowRight, 
  Mic, 
  ShieldCheck, 
  Activity, 
  HeartHandshake, 
  Stethoscope, 
  Clock, 
  Sun, 
  Sunrise, 
  Sunset, 
  Moon, 
  Pill, 
  Utensils, 
  CheckCircle2, 
  TrendingUp, 
  Bot, 
  ChevronRight, 
  Zap, 
  Lock, 
  Check, 
  Play, 
  Pause,
  User,
  Heart,
  Footprints,
  Eye,
  FileSpreadsheet,
  LogIn,
  UserPlus,
  Compass,
  Layers,
  PhoneCall,
  Info,
  Sliders,
  Cpu,
  Radio,
  Share2,
  CheckCircle,
  HelpCircle,
  ArrowUpRight,
  Volume2,
  Atom,
  Flame,
  Menu,
  Search,
  AlertOctagon,
  Plus,
  ChevronDown,
  LogOut,
  Settings
} from 'lucide-react';

interface LandingViewProps {
  baseline: PersonalBaseline;
  language: Language;
  currentUser?: AppUser | null;
  assessment?: CompoundRiskAssessment;
  latestGlucose?: GlucoseReading | null;
  medications?: Medication[];
  activity?: ActivityData;
  onNavigate: (tab: NavigationTab) => void;
  onOpenVoice: () => void;
  onOpenEmergencySOS?: () => void;
  onOpenShareReport?: () => void;
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
  onToggleSidebar?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenQuickAction?: () => void;
  onSignOut?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  baseline,
  language,
  currentUser,
  assessment,
  latestGlucose,
  medications,
  activity,
  onNavigate,
  onOpenVoice,
  onOpenEmergencySOS,
  onOpenShareReport,
  onOpenSignIn,
  onOpenSignUp,
  onToggleSidebar,
  onOpenCommandPalette,
  onOpenQuickAction,
  onSignOut
}) => {
  // Single Entry Auth Dropdown State (Logged-Out)
  const [showAuthDropdown, setShowAuthDropdown] = useState<boolean>(false);
  const authDropdownRef = useRef<HTMLDivElement>(null);

  // WhatsApp-Style Action Menu Dropdown State (Logged-In)
  const [showAccountDropdown, setShowAccountDropdown] = useState<boolean>(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (authDropdownRef.current && !authDropdownRef.current.contains(e.target as Node)) {
        setShowAuthDropdown(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target as Node)) {
        setShowAccountDropdown(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAuthDropdown(false);
        setShowAccountDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 1. HTML5 CANVAS BIOLUMINESCENT PARTICLE VORTEX PHYSICS (60 FPS)
  // ─────────────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tiltAngle, setTiltAngle] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const heroContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 160 Bioluminescent metabolic particles
    const particleCount = 160;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      color: ['#14b8a6', '#10b981', '#2dd4bf', '#06b6d4', '#6366f1'][Math.floor(Math.random() * 5)],
      alpha: Math.random() * 0.7 + 0.3,
      angle: Math.random() * Math.PI * 2,
      angularVelocity: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      distance: Math.random() * (Math.min(width, height) * 0.42) + 20,
      baseDistance: Math.random() * (Math.min(width, height) * 0.42) + 20,
      pulseSpeed: Math.random() * 0.03 + 0.01
    }));

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      time += 0.02;

      // Draw particle vortex
      particles.forEach((p) => {
        p.angle += p.angularVelocity;
        
        // Gentle cursor attraction/repulsion
        const targetX = centerX + Math.cos(p.angle) * p.distance;
        const targetY = centerY + Math.sin(p.angle) * p.distance;

        // Interactive mouse gravity offset
        const dx = mousePos.x - targetX;
        const dy = mousePos.y - targetY;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        
        let offsetX = 0;
        let offsetY = 0;
        if (distToMouse < 140 && distToMouse > 0) {
          const force = (140 - distToMouse) / 140;
          offsetX = (dx / distToMouse) * force * 25;
          offsetY = (dy / distToMouse) * force * 25;
        }

        const renderX = targetX + offsetX;
        const renderY = targetY + offsetY;

        // Draw glowing particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(renderX, renderY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.6 + Math.sin(time * 3 + p.distance) * 0.4);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroContainerRef.current) return;
    const rect = heroContainerRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    setMousePos({ x: relX, y: relY });

    const tiltX = ((relX / rect.width) - 0.5) * 22; // -11 to +11 deg
    const tiltY = ((relY / rect.height) - 0.5) * -22;
    setTiltAngle({ x: tiltX, y: tiltY });
  };

  // ─────────────────────────────────────────────────────────────
  // 2. THE 24-HOUR CIRCADIAN TIME MACHINE (DAY-TO-NIGHT ENGINE)
  // ─────────────────────────────────────────────────────────────
  const [circadianHourIndex, setCircadianHourIndex] = useState<number>(0);
  const [isScrubbingAuto, setIsScrubbingAuto] = useState<boolean>(true);

  useEffect(() => {
    if (!isScrubbingAuto) return;
    const interval = setInterval(() => {
      setCircadianHourIndex(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, [isScrubbingAuto]);

  const circadianPhases = [
    {
      id: 0,
      time: '07:30 AM',
      phaseName: 'Dawn Fasting & Secretagogues',
      icon: <Sunrise className="w-5 h-5 text-amber-400" />,
      glucose: '118 mg/dL',
      glucoseStatus: 'Within Learned Fasting Corridor (95–125 mg/dL) 🟢',
      medication: 'Glimepiride 1mg — Verified Taken 10m Prior ✅',
      activity: 'Morning corridor stretch (350 steps)',
      routineTip: 'Fasting glucose is calm. Remind Aai to have breakfast with roasted peanuts within 25 minutes.',
      bgGlow: 'from-amber-500/20 via-teal-500/10 to-transparent',
      borderColor: 'border-amber-500/40'
    },
    {
      id: 1,
      time: '01:30 PM',
      phaseName: 'Chrono-Lunch Sequencing',
      icon: <Sun className="w-5 h-5 text-emerald-400" />,
      glucose: '138 mg/dL',
      glucoseStatus: 'Smooth Post-Prandial Rise (<160 ceiling) 🥗',
      medication: 'Metformin 500mg — Take with first bite of lunch',
      activity: '5-minute post-meal indoor corridor stroll',
      routineTip: 'Step 1: Cucumber Salad → Step 2: Moong Dal → Step 3: 1 Jowar Bhakri blunts spike by 35%.',
      bgGlow: 'from-emerald-500/20 via-cyan-500/10 to-transparent',
      borderColor: 'border-emerald-500/40'
    },
    {
      id: 2,
      time: '05:30 PM',
      phaseName: 'Golden Hour Garden Mobility',
      icon: <Sunset className="w-5 h-5 text-orange-400" />,
      glucose: '112 mg/dL',
      glucoseStatus: 'Active Muscular Glucose Uptake 🚶',
      medication: 'No meds scheduled for late afternoon',
      activity: '3,200 / 3,500 Steps Completed (91% Goal)',
      routineTip: 'Evening walk completed. Insulin sensitivity peaked. Risk of nocturnal hypoglycemia: Very Low (6%).',
      bgGlow: 'from-orange-500/20 via-rose-500/10 to-transparent',
      borderColor: 'border-orange-500/40'
    },
    {
      id: 3,
      time: '10:00 PM',
      phaseName: 'Restorative Sleep & Silent Net',
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      glucose: '126 mg/dL',
      glucoseStatus: 'Overnight Basal Stability Verified 🌙',
      medication: 'Bedtime Atorvastatin 10mg — Confirmed Taken',
      activity: 'Sleep mode activated (7.4 hrs target)',
      routineTip: 'Circadian stability minimizes dawn phenomenon. Caregiver silent safety score: 94/100.',
      bgGlow: 'from-indigo-500/20 via-purple-500/10 to-transparent',
      borderColor: 'border-indigo-500/40'
    }
  ];

  // ─────────────────────────────────────────────────────────────
  // 3. INTERACTIVE GLYCEMIC SPIKE DESTROYER (BEFORE VS AFTER)
  // ─────────────────────────────────────────────────────────────
  const [selectedFoodIndex, setSelectedFoodIndex] = useState<number>(0);
  const [isSequencingApplied, setIsSequencingApplied] = useState<boolean>(true);

  const spikeLabFoods = [
    {
      name: 'Kande Pohe (कांदे पोहे)',
      category: 'Breakfast',
      standardSpike: 215,
      sequencedSpike: 138,
      delta: '-36%',
      fiberTip: 'Pre-load with 1 cup sliced cucumber & roasted peanuts before eating Pohe.',
      color: 'text-amber-400'
    },
    {
      name: 'Jowar Bhakri + Pithla (भाकरी व पिठलं)',
      category: 'Lunch',
      standardSpike: 195,
      sequencedSpike: 132,
      delta: '-32%',
      fiberTip: 'Eat raw onion & tomato salad first, followed by protein-rich Besan Pithla.',
      color: 'text-emerald-400'
    },
    {
      name: 'Moong Dal Khichdi (मूग डाळ खिचडी)',
      category: 'Dinner',
      standardSpike: 180,
      sequencedSpike: 124,
      delta: '-31%',
      fiberTip: 'Add 1 teaspoon pure cow ghee & probiotic curd to lower overall glycemic index.',
      color: 'text-teal-400'
    },
    {
      name: 'Chai + Sugar (मसाला चहा)',
      category: 'Beverage',
      standardSpike: 190,
      sequencedSpike: 130,
      delta: '-32%',
      fiberTip: 'Switch to cardamom/ginger brew after meals rather than on an empty stomach.',
      color: 'text-orange-400'
    },
    {
      name: 'Gulab Jamun (सणासुदीची मिठाई)',
      category: 'Festival Treat',
      standardSpike: 240,
      sequencedSpike: 155,
      delta: '-35%',
      fiberTip: 'Never eat on empty stomach. Pre-load with 5 soaked almonds and walk for 10 mins.',
      color: 'text-rose-400'
    }
  ];

  const currentSpikeFood = spikeLabFoods[selectedFoodIndex];

  // ─────────────────────────────────────────────────────────────
  // 4. LIVE MULTILINGUAL VOICE SOUNDWAVE SPECTRUM
  // ─────────────────────────────────────────────────────────────
  const [activeVoicePromptIndex, setActiveVoicePromptIndex] = useState<number>(0);
  const [isVoiceWaveActive, setIsVoiceWaveActive] = useState<boolean>(true);

  const voicePrompts = [
    {
      lang: 'मराठी',
      flag: '🇮🇳',
      prompt: 'आई, आज सकाळची गोळी घेतली का?',
      meaning: 'Did Aai take her morning pill?',
      response: 'होय! अनुसूया यांनी सकाळी ८:१५ वाजता ग्लिमेपिराइड १mg गोळी घेतली आहे. साखर ११८ mg/dL असून सुरक्षित कक्षेत आहे.',
      accent: 'text-amber-400 border-amber-500/30'
    },
    {
      lang: 'हिंदी',
      flag: '🇮🇳',
      prompt: 'आज नाश्ते में पोहा खा सकते हैं क्या?',
      meaning: 'Can we have Poha for breakfast today?',
      response: 'हाँ बिल्कुल! पोहा खाने से पहले आधा कप ककड़ी का सलाद और थोड़े मूंगफली के दाने ज़रूर लें ताकि शुगर स्पाइक नियंत्रित रहे।',
      accent: 'text-emerald-400 border-emerald-500/30'
    },
    {
      lang: 'English',
      flag: '🇬🇧',
      prompt: 'Show my 14-day Time-In-Range trend.',
      meaning: 'Clinical ambulatory glucose overview',
      response: 'Your 14-day Time-In-Range is 86.4% (Goal >70%). Estimated HbA1c is 6.8% with zero severe hypoglycemia incidents.',
      accent: 'text-teal-400 border-teal-500/30'
    }
  ];

  // Derive User Initials (e.g. "Shrinath Mane" -> "SM")
  const getUserInitials = (user?: AppUser | null, fallbackName?: string): string => {
    const raw = user?.name || fallbackName || user?.email?.split('@')[0] || '';
    const clean = raw.trim();
    if (!clean) return 'SM';
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const userInitials = getUserInitials(currentUser, baseline?.patientName);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white antialiased overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          1. SINGLE MAIN MENU BAR (STICKY GLASSMORPHIC TOPBAR)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-2xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          
          {/* Left: 3-Lines Menu Trigger + Brand Identity */}
          <div className="flex items-center space-x-3 shrink-0">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-teal-500/60 transition cursor-pointer flex items-center space-x-1.5 shadow-sm active:scale-95 group"
                aria-label="Toggle Navigation Menu"
                title="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-200 hidden sm:inline">Menu</span>
              </button>
            )}

            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-cyan-500 p-[1.5px] shadow-lg shadow-teal-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <span className="text-lg font-black bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">S</span>
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-75" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-black tracking-tight text-white">SugarSense AI</span>
                  <span className="px-2 py-0.5 text-[9px] font-bold text-teal-300 bg-teal-500/10 border border-teal-500/30 rounded-full uppercase tracking-wider">
                    Senior Care
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  Personalized Diabetes Management for Seniors
                </p>
              </div>
            </div>
          </div>

          {/* Search Commands Trigger — Authenticated Users Only */}
          {currentUser && onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="hidden lg:flex max-w-xs w-full pl-3 pr-2 py-1.5 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/50 rounded-xl text-xs text-slate-400 flex items-center justify-between transition group cursor-pointer shadow-xs"
            >
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-teal-400" />
                <span className="truncate">Search commands, medicines...</span>
              </div>
              <kbd className="inline-flex items-center space-x-1 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-800 border border-slate-700 rounded">
                <span>⌘</span>
                <span>K</span>
              </kbd>
            </button>
          )}

          {/* Middle: Feature Jump Pills — Shown Before Login, or on 2XL screens when Logged In */}
          <nav aria-label="Feature navigation" className={`${currentUser ? 'hidden 2xl:flex' : 'hidden xl:flex'} items-center gap-2 text-xs font-semibold`}>
            <a 
              href="#biosphere" 
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-teal-500/60 transition-all flex items-center space-x-1.5 shadow-xs"
            >
              <Atom className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Metabolic Biosphere</span>
            </a>
            <a 
              href="#circadian" 
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-amber-500/60 transition-all flex items-center space-x-1.5 shadow-xs"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Time Machine</span>
            </a>
            <a 
              href="#spike-lab" 
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-emerald-500/60 transition-all flex items-center space-x-1.5 shadow-xs"
            >
              <Flame className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Spike Destroyer</span>
            </a>
            <a 
              href="#voice-spectrum" 
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/60 transition-all flex items-center space-x-1.5 shadow-xs"
            >
              <Mic className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Voice Soundwave</span>
            </a>
            <a 
              href="#tele-tether" 
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-rose-500/60 transition-all flex items-center space-x-1.5 shadow-xs"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Caregiver Tether</span>
            </a>
          </nav>

          {/* Right Action Controls: Before Login vs After Login */}
          <div className="flex items-center space-x-2 shrink-0">
            {currentUser ? (
              /* Authenticated Controls */
              <>
                {onOpenEmergencySOS && (
                  <button
                    onClick={onOpenEmergencySOS}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black tracking-wide transition shadow-xs cursor-pointer active:scale-95 animate-pulse"
                    title="Emergency SOS & Rule of 15"
                  >
                    <AlertOctagon className="w-4 h-4" />
                    <span className="hidden sm:inline">SOS</span>
                  </button>
                )}

                {onOpenShareReport && (
                  <button
                    onClick={onOpenShareReport}
                    className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-teal-500/50 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                    title="Share Medical Summary"
                  >
                    <Share2 className="w-3.5 h-3.5 text-teal-400" />
                    <span className="hidden md:inline">Share</span>
                  </button>
                )}

                {onOpenQuickAction && (
                  <button
                    onClick={onOpenQuickAction}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs font-black tracking-wide shadow-md shadow-teal-600/25 transition-all active:scale-95 cursor-pointer ring-1 ring-white/20"
                    title="Log Glucose Reading, Meal or Medication"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span className="hidden sm:inline">Log</span>
                  </button>
                )}

                <button
                  onClick={onOpenVoice}
                  className="px-2.5 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 text-xs font-bold transition-all flex items-center space-x-1 active:scale-95 cursor-pointer"
                  title="Voice AI"
                >
                  <Mic className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                  <span className="hidden sm:inline">Voice</span>
                </button>

                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 rounded-xl shadow-md shadow-teal-500/20 transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* User Profile Avatar Pill - WhatsApp-Style Action Menu */}
                <div className="relative" ref={accountDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowAccountDropdown(prev => !prev)}
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-md ring-2 transition-all cursor-pointer active:scale-95 ${
                      showAccountDropdown ? 'ring-teal-400 ring-offset-2 ring-offset-slate-950 scale-105' : 'ring-teal-400/20 hover:scale-105'
                    }`}
                    title={`Account: ${currentUser.name || currentUser.email}`}
                    aria-label="Account Action Menu"
                    aria-expanded={showAccountDropdown}
                    aria-haspopup="true"
                  >
                    {userInitials}
                  </button>

                  {/* WhatsApp-Style Action Menu Popup (Opens Below Icon) */}
                  {showAccountDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {/* Account Profile Summary Header */}
                      <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 mb-1.5 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-md shrink-0 ring-2 ring-teal-400/20">
                          {userInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-bold text-white truncate">
                              {currentUser.name || currentUser.email.split('@')[0]}
                            </p>
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase bg-teal-950/80 text-teal-300 border border-teal-800 shrink-0">
                              {currentUser.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {currentUser.email}
                          </p>
                        </div>
                      </div>

                      {/* Existing Account Action Options */}
                      <div className="space-y-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAccountDropdown(false);
                            onNavigate('settings');
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left hover:bg-slate-800 text-slate-200 hover:text-white transition group cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                              Profile & Calibration
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              Baseline targets & emergency contacts
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowAccountDropdown(false);
                            onNavigate('caregiver');
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left hover:bg-slate-800 text-slate-200 hover:text-white transition group cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition shrink-0">
                            <HeartHandshake className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                              Caregiver Safety Net
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              Family telemetry & critical alerts
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowAccountDropdown(false);
                            onNavigate('doctor');
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left hover:bg-slate-800 text-slate-200 hover:text-white transition group cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition shrink-0">
                            <Stethoscope className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                              Doctor Portal & Summary
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              Clinical telemetry & report export
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowAccountDropdown(false);
                            onNavigate('privacy');
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left hover:bg-slate-800 text-slate-200 hover:text-white transition group cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition shrink-0">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                              Privacy & Security
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              Data permissions & encryption policies
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </button>
                      </div>

                      {/* Sign Out / End Session Option */}
                      {onSignOut && (
                        <>
                          <div className="h-[1px] bg-slate-800/80 my-1.5" />
                          <button
                            type="button"
                            onClick={() => {
                              setShowAccountDropdown(false);
                              onSignOut();
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left hover:bg-rose-950/40 text-slate-200 hover:text-rose-300 transition group cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-rose-900/60 border border-slate-700 group-hover:border-rose-800 flex items-center justify-center text-slate-400 group-hover:text-rose-300 transition shrink-0">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold group-hover:text-rose-300 transition-colors">
                                Sign Out
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                Safely end active account session
                              </p>
                            </div>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Public Controls (Before Login) */
              <>
                <button
                  onClick={onOpenVoice}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 text-xs font-bold transition-all flex items-center space-x-1.5 active:scale-95 cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                  <span className="hidden sm:inline">Try Voice AI 🎤</span>
                </button>

                {/* WhatsApp-Style Account / Auth Action Icon Button */}
                <div className="relative" ref={authDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowAuthDropdown((prev) => !prev)}
                    className={`w-9 h-9 rounded-xl transition-all flex items-center justify-center shadow-xs cursor-pointer active:scale-95 border ${
                      showAuthDropdown 
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/60 ring-2 ring-teal-500/20' 
                        : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800 hover:border-teal-500/50'
                    }`}
                    title="Account & Authentication"
                    aria-label="Account & Authentication Menu"
                    aria-expanded={showAuthDropdown}
                    aria-haspopup="true"
                  >
                    <User className="w-4 h-4 text-teal-400" />
                  </button>

                  {/* Native-Style Authentication Dropdown Popover (Opens Below Icon) */}
                  {showAuthDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAuthDropdown(false);
                          onOpenSignIn();
                        }}
                        className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-left hover:bg-slate-800 text-slate-200 hover:text-white transition group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 group-hover:scale-105 transition shrink-0">
                          <LogIn className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">Log In</p>
                          <p className="text-[10px] text-slate-400 truncate">Access existing patient profile</p>
                        </div>
                      </button>

                      <div className="h-[1px] bg-slate-800/80 my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          setShowAuthDropdown(false);
                          onOpenSignUp();
                        }}
                        className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-left hover:bg-teal-950/40 border border-transparent hover:border-teal-500/30 text-slate-200 hover:text-white transition group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-slate-950 group-hover:scale-105 transition shrink-0 shadow-xs">
                          <UserPlus className="w-4 h-4 font-black" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">Sign Up</p>
                          <p className="text-[10px] text-slate-400 truncate">New patient or caregiver</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. CINEMATIC HERO: "THE 3D BIOLUMINESCENT METABOLIC BIO-SPHERE"
      ───────────────────────────────────────────────────────────── */}
      <section 
        id="biosphere" 
        ref={heroContainerRef}
        onMouseMove={handleHeroMouseMove}
        className="relative pt-8 sm:pt-12 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
      >
        {/* Dynamic Multi-Color Atmosphere Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] bg-gradient-to-tr from-teal-500/15 via-emerald-500/10 to-indigo-500/15 blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Narrative */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>🇮🇳 Built Exclusively for Indian Senior Citizens & Families</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Diabetes care, <br />
              <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                that understands the person
              </span>{' '}
              behind the numbers.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              SugarSense connects glucose logs, morning secretagogue pills, and Indian food timing into 
              <strong className="text-white font-semibold"> calm daily guidance for seniors</strong> and a 
              <strong className="text-white font-semibold"> silent safety net for their children</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-teal-500/25 hover:shadow-teal-500/35 transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>Launch Senior Aai Mode</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenVoice}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm rounded-2xl border border-slate-700/80 transition-all flex items-center justify-center space-x-2"
              >
                <Mic className="w-4 h-4 text-teal-400" />
                <span>Test Voice AI (मराठी / हिंदी)</span>
              </button>
            </div>

            {/* Quick Stats Ribbon */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
              <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 text-center">
                <span className="text-lg sm:text-xl font-black font-mono text-teal-300">86.4%</span>
                <p className="text-[11px] text-slate-400 font-medium">14-Day TIR</p>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 text-center">
                <span className="text-lg sm:text-xl font-black font-mono text-emerald-300">-35%</span>
                <p className="text-[11px] text-slate-400 font-medium">Spike Blunting</p>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 text-center">
                <span className="text-lg sm:text-xl font-black font-mono text-amber-300">60 BPM</span>
                <p className="text-[11px] text-slate-400 font-medium">Circadian Heartbeat</p>
              </div>
            </div>

          </div>

          {/* Right Hero: 3D Bioluminescent Metabolic Bio-Sphere with Canvas Particle Physics */}
          <div className="lg:col-span-6 flex justify-center perspective-1200">
            <div 
              style={{
                transform: `rotateY(${tiltAngle.x}deg) rotateX(${tiltAngle.y}deg)`,
                transition: 'transform 0.15s ease-out'
              }}
              className="w-full max-w-lg bg-slate-900/95 rounded-3xl border border-slate-800 p-6 shadow-2xl relative preserve-3d overflow-hidden"
            >
              
              {/* HTML5 Canvas GPU Particle Vortex Layer */}
              <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full pointer-events-none z-0" 
              />

              {/* 3D Gyroscopic Concentric Glass Rings & Central Core */}
              <div className="relative z-10 py-6 flex flex-col items-center justify-center">
                
                {/* Central Biomorphic Heartbeat Sphere (60 BPM) */}
                <div className="relative w-48 h-48 rounded-full flex items-center justify-center">
                  
                  {/* Concentric Rotating Orbital Rings */}
                  <div className="absolute inset-[-15px] rounded-full border border-teal-500/30 border-dashed animate-celestialOrbit pointer-events-none" />
                  <div className="absolute inset-[-30px] rounded-full border border-emerald-500/20 border-dotted animate-reverseOrbit pointer-events-none" />

                  {/* Pulsing Resting Heartbeat Sphere */}
                  <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-teal-400 via-emerald-600 to-teal-950 p-[2px] shadow-2xl shadow-teal-500/40 animate-heartbeat">
                    <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center p-3 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                        Metabolic Core
                      </span>
                      <div className="text-3xl font-black text-white font-mono my-0.5">
                        118
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Corridor 95–125
                      </span>
                    </div>
                  </div>

                  {/* Embedded Floating Orbital Node 1: Fasting Glucose */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 p-1.5 px-3 rounded-full bg-slate-900/90 border border-teal-500/50 shadow-lg text-[10px] font-bold text-teal-300 flex items-center space-x-1 animate-floatSlow">
                    <Activity className="w-3 h-3 text-teal-400" />
                    <span>Fasting Stable 🟢</span>
                  </div>

                  {/* Embedded Floating Orbital Node 2: Morning Pill */}
                  <div className="absolute top-1/2 -right-7 -translate-y-1/2 p-1.5 px-3 rounded-full bg-slate-900/90 border border-emerald-500/50 shadow-lg text-[10px] font-bold text-emerald-300 flex items-center space-x-1 animate-floatSlow">
                    <Pill className="w-3 h-3 text-emerald-400" />
                    <span>Glimepiride ✅</span>
                  </div>

                  {/* Embedded Floating Orbital Node 3: Daily Steps */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 p-1.5 px-3 rounded-full bg-slate-900/90 border border-cyan-500/50 shadow-lg text-[10px] font-bold text-cyan-300 flex items-center space-x-1 animate-floatSlow">
                    <Footprints className="w-3 h-3 text-cyan-400" />
                    <span>3,500 Steps 🚶</span>
                  </div>

                  {/* Embedded Floating Orbital Node 4: Sleep Quality */}
                  <div className="absolute top-1/2 -left-7 -translate-y-1/2 p-1.5 px-3 rounded-full bg-slate-900/90 border border-indigo-500/50 shadow-lg text-[10px] font-bold text-indigo-300 flex items-center space-x-1 animate-floatSlow">
                    <Moon className="w-3 h-3 text-indigo-400" />
                    <span>7.4 hrs Sleep 🌙</span>
                  </div>

                </div>

                {/* Live ECG / Glycemic Pulse Sine-Wave Animation */}
                <div className="w-full mt-6 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="flex items-center space-x-1.5 text-teal-400 font-bold">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Live Circadian ECG & Glycemic Waveform</span>
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">60 BPM Resting Pulse</span>
                  </div>

                  <svg className="w-full h-12 overflow-visible" viewBox="0 0 300 40">
                    <defs>
                      <linearGradient id="ecgGlowGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#10B981" stopOpacity="1" />
                        <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 20 L 50 20 L 60 5 L 70 35 L 80 15 L 90 20 L 140 20 L 150 5 L 160 35 L 170 15 L 180 20 L 230 20 L 240 5 L 250 35 L 260 15 L 270 20 L 300 20"
                      fill="none"
                      stroke="url(#ecgGlowGrad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="animate-ecgLine"
                    />
                  </svg>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. THE 24-HOUR CIRCADIAN TIME MACHINE (DAY-TO-NIGHT ENGINE)
      ───────────────────────────────────────────────────────────── */}
      <section id="circadian" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Chrono-Nutrition & Metabolic Orbit</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            The 24-Hour Circadian Time Machine
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Interactive day-to-night engine showing how SugarSense synchronizes medication timing, Indian meals, and sleep quality.
          </p>
        </div>

        {/* Circadian Scrubber Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-6">
          {circadianPhases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => {
                setCircadianHourIndex(phase.id);
                setIsScrubbingAuto(false);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center space-x-3 ${
                circadianHourIndex === phase.id 
                  ? 'bg-slate-900 border-teal-500 shadow-lg shadow-teal-500/10 ring-2 ring-teal-500/20' 
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                {phase.icon}
              </div>
              <div>
                <p className="font-mono text-[10px] text-slate-400">{phase.time}</p>
                <p className={`text-xs font-bold ${circadianHourIndex === phase.id ? 'text-teal-300' : 'text-slate-300'}`}>
                  {phase.phaseName.split(' ')[0]}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Atmosphere Live Preview Card */}
        <div className={`max-w-4xl mx-auto bg-gradient-to-br ${circadianPhases[circadianHourIndex].bgGlow} bg-slate-900/90 rounded-3xl border ${circadianPhases[circadianHourIndex].borderColor} p-6 sm:p-8 shadow-2xl transition-all duration-500 space-y-5 animate-fadeIn`}>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                {circadianPhases[circadianHourIndex].icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{circadianPhases[circadianHourIndex].phaseName}</h3>
                <p className="text-xs text-teal-400 font-mono">{circadianPhases[circadianHourIndex].time} IST</p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              {circadianPhases[circadianHourIndex].glucose}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400">Medication Adherence:</span>
              <p className="font-bold text-white">{circadianPhases[circadianHourIndex].medication}</p>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400">Mobility Sync:</span>
              <p className="font-bold text-white">{circadianPhases[circadianHourIndex].activity}</p>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400">Status Verification:</span>
              <p className="font-bold text-emerald-300">{circadianPhases[circadianHourIndex].glucoseStatus}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-teal-500/20 text-xs text-slate-300 flex items-start space-x-3">
            <Bot className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-teal-300 font-bold block mb-0.5">Circadian AI Guidance:</span>
              <p className="leading-relaxed">{circadianPhases[circadianHourIndex].routineTip}</p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. INTERACTIVE GLYCEMIC SPIKE DESTROYER (BEFORE VS AFTER)
      ───────────────────────────────────────────────────────────── */}
      <section id="spike-lab" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Glycemic Spike Destroyer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Before vs. After Food Sequencing AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Click any authentic Indian food to observe how the clinically validated 3-Step eating sequence blunts glucose spikes by 35%.
          </p>
        </div>

        {/* Interactive Food Tray */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-4xl mx-auto">
          {spikeLabFoods.map((food, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFoodIndex(idx)}
              className={`px-4 py-2 rounded-2xl border text-xs font-bold transition-all ${
                selectedFoodIndex === idx 
                  ? 'bg-slate-900 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/20' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {food.name}
            </button>
          ))}
        </div>

        {/* The Spike Simulation Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{currentSpikeFood.name}</h3>
                <p className="text-xs text-slate-400">{currentSpikeFood.category}</p>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                {currentSpikeFood.delta} Spike Reduction
              </span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="text-teal-300 font-bold block">Clinically Validated 3-Step Sequencing Rule:</span>
              <p className="text-slate-300 leading-relaxed">{currentSpikeFood.fiberTip}</p>
            </div>

            <button
              onClick={() => setIsSequencingApplied(prev => !prev)}
              className={`w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                isSequencingApplied 
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                  : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSequencingApplied ? 'SugarSense AI Sequencing Active (-35% Spike)' : 'Standard Chaotic Diet (+85 mg/dL Spike)'}</span>
            </button>
          </div>

          {/* Spike Wave Visualizer */}
          <div className="lg:col-span-6 p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Simulated Bloodstream Excursion
            </span>

            <div className="flex items-baseline justify-center space-x-2">
              <span className={`text-4xl font-black font-mono transition-all ${isSequencingApplied ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isSequencingApplied ? currentSpikeFood.sequencedSpike : currentSpikeFood.standardSpike}
              </span>
              <span className="text-xs text-slate-400 font-mono">mg/dL peak</span>
            </div>

            <div className="h-24 w-full flex items-end justify-center space-x-2 pt-2">
              {[40, 65, 85, 120, 160, 190, 140, 95, 60, 45].map((h, i) => {
                const scaledHeight = isSequencingApplied ? h * 0.65 : h;
                const barColor = isSequencingApplied ? 'bg-gradient-to-t from-teal-500 to-emerald-400' : 'bg-gradient-to-t from-orange-500 to-rose-500';
                return (
                  <div
                    key={i}
                    className={`w-4 rounded-t-lg transition-all duration-500 ${barColor}`}
                    style={{ height: `${scaledHeight}%` }}
                  />
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400">
              {isSequencingApplied 
                ? '🟢 Smooth glycemic entry blunts insulin spike and protects beta-cells.' 
                : '🔴 Steep carbohydrate surge triggers reactive fatigue and arterial inflammation.'}
            </p>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. LIVE MULTILINGUAL VOICE SOUNDWAVE SPECTRUM
      ───────────────────────────────────────────────────────────── */}
      <section id="voice-spectrum" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span>Voice-First Elderly Interaction</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Live Multilingual Voice Soundwave Spectrum
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Seniors shouldn't struggle with complex smartphone keyboards. SugarSense answers in Marathi, Hindi, and English.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Prompt Selection Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {voicePrompts.map((vp, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveVoicePromptIndex(idx);
                  setIsVoiceWaveActive(true);
                }}
                className={`px-4 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeVoicePromptIndex === idx 
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20' 
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span>{vp.flag}</span>
                <span>{vp.lang}</span>
              </button>
            ))}
          </div>

          {/* Soundwave Visualizer Canvas Box */}
          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-5 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Senior Spoke:</span>
                <p className="text-base font-bold text-white mt-0.5">"{voicePrompts[activeVoicePromptIndex].prompt}"</p>
                <p className="text-[11px] text-slate-500 italic">({voicePrompts[activeVoicePromptIndex].meaning})</p>
              </div>
              <span className="font-mono text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                16-Band Spectrum Active
              </span>
            </div>

            {/* 16-Bar Animated Glowing Audio Spectrum Analyzer */}
            <div className="py-2 flex items-center justify-center space-x-1.5 h-10">
              {[8, 16, 26, 12, 32, 22, 14, 28, 18, 10, 24, 16, 12, 20, 28, 14].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-full animate-soundWave"
                  style={{ height: `${h}px`, animationDelay: `${i * 0.08}s` }}
                />
              ))}
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl space-y-1">
              <span className="text-teal-400 font-bold flex items-center space-x-1">
                <Bot className="w-3.5 h-3.5" />
                <span>SugarSense AI Voice Output:</span>
              </span>
              <p className="text-slate-200 text-xs leading-relaxed font-medium">
                {voicePrompts[activeVoicePromptIndex].response}
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onOpenVoice}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-400 transition-all flex items-center space-x-2 mx-auto active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span>Talk to Voice AI Microphone Now</span>
            </button>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. DUAL-HEARTBEAT TELE-TETHER (MOTHER IN PUNE ↔ DAUGHTER IN MUMBAI)
      ───────────────────────────────────────────────────────────── */}
      <section id="tele-tether" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
            <span>Caregiver Silent Safety Net</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Dual-Heartbeat Tele-Tether
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            A continuous glowing data helix connecting aging parents in Pune with working children in Mumbai without alert fatigue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center max-w-5xl mx-auto bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Animated Glowing Laser Connection */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-helix-gradient -translate-y-1/2 opacity-40 pointer-events-none hidden md:block" />

          {/* Left Node: Aai in Pune */}
          <div className="md:col-span-5 p-5 bg-slate-950 rounded-2xl border border-amber-500/30 space-y-3 relative z-10 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-lg flex items-center justify-center border border-amber-500/30">
                  👵
                </div>
                <div>
                  <h3 className="font-bold text-white text-xs">Aai (Senior Parent)</h3>
                  <p className="text-[10px] text-amber-300">Pune • Home Dashboard</p>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                118 mg/dL 🟢
              </span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl space-y-1 text-xs">
              <span className="text-teal-400 font-bold text-[10px]">Voice Verified Telemetry:</span>
              <p className="text-white font-medium">"मी आजची सकाळची गोळी घेतली."</p>
              <p className="text-[10px] text-slate-400 italic">"I took my morning pill."</p>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Glimepiride 1mg verified logged at 08:15 AM</span>
            </div>
          </div>

          {/* Center Laser Telemetry Pulse */}
          <div className="md:col-span-2 text-center py-2 relative z-10">
            <div className="w-10 h-10 mx-auto rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center animate-signalPulse">
              <Zap className="w-5 h-5 text-teal-400" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-1 block">Silent Sync</span>
          </div>

          {/* Right Node: Priya in Mumbai */}
          <div className="md:col-span-5 p-5 bg-slate-950 rounded-2xl border border-teal-500/30 space-y-3 relative z-10 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-lg flex items-center justify-center border border-teal-500/30">
                  👩‍💼
                </div>
                <div>
                  <h3 className="font-bold text-white text-xs">Priya (Caregiver Child)</h3>
                  <p className="text-[10px] text-teal-300">Mumbai • Office Desk</p>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded border border-teal-500/20">
                PEACE OF MIND 94%
              </span>
            </div>

            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 space-y-1 text-xs">
              <div className="flex items-center justify-between text-emerald-400 text-[10px] font-bold">
                <span>WhatsApp Telemetry Check:</span>
                <span>08:21 AM</span>
              </div>
              <p className="text-slate-200 text-[11px]">
                ✅ Aai took morning Glimepiride. Glucose corridor nominal. Zero disturbing alerts required.
              </p>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Anti-Alert Fatigue Triage Active</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. 1-CLICK ROLE-BASED DIRECT DEMO LAUNCHERS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hackathon Direct Launchers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            1-Click Multi-Role Workspaces
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Explore each specialized persona with genuine live telemetry and clinical engines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* Launcher 1: Senior Mode */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="p-6 bg-slate-900 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-2xl flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform">
                  👵
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  LARGE TEXT
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                Senior Citizen Mode (Aai Mode)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Large 24px typography, 4 glanceable status cards, Marathi/Hindi voice prompts, and simple one-tap food logging.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>Launch Senior Dashboard</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Launcher 2: Caregiver Safety Net */}
          <div 
            onClick={() => onNavigate('caregiver')}
            className="p-6 bg-slate-900 rounded-3xl border border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer group space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-2xl flex items-center justify-center border border-teal-500/30 group-hover:scale-110 transition-transform">
                  👨‍👩‍👧
                </div>
                <span className="text-[10px] font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  REMOTE NET
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                Caregiver Safety Net
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                94.2% adherence compliance scorecard, WhatsApp status dispatch, and emergency Rule-of-15 fast assistance protocols.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-teal-300 font-bold">
              <span>Launch Caregiver Portal</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Launcher 3: Doctor Longitudinal Portal */}
          <div 
            onClick={() => onNavigate('doctor')}
            className="p-6 bg-slate-900 rounded-3xl border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-2xl flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition-transform">
                  👨‍⚕️
                </div>
                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  14-DAY TIR
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                Clinician & Diabetologist Portal
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                14-Day Ambulatory Glucose Profile (AGP), estimated HbA1c 6.8%, variability CV 16.4%, and 1-click printable clinical notes.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-300 font-bold">
              <span>Launch Doctor Portal</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. HIGH-IMPACT FINAL CALL TO ACTION & FOOTER
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-emerald-950/60 rounded-3xl border border-teal-500/30 p-8 sm:p-12 text-center space-y-5 shadow-2xl">
          
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Experience the Future of Senior Diabetes Care
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Transform senior diabetes management today with personalized circadian corridors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-teal-500/25 hover:shadow-teal-500/35 transition-all active:scale-95"
            >
              Enter Living Dashboard 🚀
            </button>
            <button
              onClick={onOpenSignUp}
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl border border-slate-700 transition-all"
            >
              Create Account Free
            </button>
          </div>

        </div>
      </section>

      {/* MINIMAL FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span className="font-bold text-slate-400">SugarSense AI • Senior Diabetes Companion</span>
          </div>
          <p className="text-center sm:text-right text-[11px] text-slate-500">
            Medical Disclaimer: Assistive companion only; does not replace registered physician advice. In emergency, call 108 / 112.
          </p>
        </div>
      </footer>

    </div>
  );
};
