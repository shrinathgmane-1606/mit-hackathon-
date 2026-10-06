import React, { useState, useEffect, useRef } from 'react';
import { UserRole, Language } from '../types';
import { 
  AuthService, 
  AppUser, 
  isSupabaseConfigured, 
  saveSupabaseConfig, 
  getSupabaseConfig 
} from '../lib/supabase';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  UserCheck, 
  X, 
  CheckCircle2, 
  Key, 
  User, 
  HeartHandshake, 
  Stethoscope, 
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Send,
  AlertCircle,
  Database,
  Globe,
  HelpCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AppUser) => void;
  language: Language;
  initialMode?: 'signin' | 'signup' | 'config';
}

type AuthFlow = 'signin' | 'signup' | 'forgot_password' | 'config';
type SignUpStep = 'credentials' | 'otp' | 'profile_setup';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  language,
  initialMode = 'signin'
}) => {
  const [flow, setFlow] = useState<AuthFlow>(initialMode);
  const [signUpStep, setSignUpStep] = useState<SignUpStep>('credentials');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Profile Setup Fields
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('SENIOR');
  const [age, setAge] = useState<number>(68);
  const [userLanguage, setUserLanguage] = useState<Language>(language);

  // Supabase Live Config Fields
  const [customSupabaseUrl, setCustomSupabaseUrl] = useState('');
  const [customSupabaseKey, setCustomSupabaseKey] = useState('');

  // 6-Digit OTP State & Verification Options
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [showManualCodeInput, setShowManualCodeInput] = useState<boolean>(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setFlow(initialMode);
    setSignUpStep('credentials');
    setOtpDigits(['', '', '', '', '', '']);
    setShowManualCodeInput(false);
    setAuthError(null);
    setAuthNotice(null);
    setPassword('');
    setConfirmPassword('');
  }, [initialMode, isOpen]);

  // Real 60-second Resend Countdown Timer
  useEffect(() => {
    let timer: any;
    if (signUpStep === 'otp' && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [signUpStep, resendCooldown]);

  if (!isOpen) return null;

  // 1. Handle Sign-Up Submission (Step 1: Credentials -> Trigger Real Email OTP)
  const handleSignUpCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthNotice(null);

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setAuthError('Please enter a valid email address (e.g. name@gmail.com).');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.signUp(cleanEmail, password, selectedRole, fullName);
      if (result.requiresOtp) {
        setSignUpStep('otp');
        setResendCooldown(60);
        setCanResend(false);
        setAuthNotice(result.message);
        setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
      } else {
        // Automatically confirmed
        setSignUpStep('profile_setup');
      }
    } catch (err: any) {
      console.error('Sign Up Error:', err);
      const msg = (err?.message || '').toLowerCase();
      if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit')) {
        setAuthError(
          'Email Rate Limit Exceeded: Supabase free tier limits built-in emails to 3-4 per hour. To fix this instantly: in your Supabase Dashboard -> Authentication -> Providers -> Email, toggle "Confirm email" OFF so you can register and log in immediately without waiting!'
        );
      } else if (msg.includes('already registered') || msg.includes('user already exists')) {
        setAuthError('An account with this email already exists. Please switch to "Log In" tab.');
      } else {
        setAuthError(err?.message || 'Failed to create account. Please verify details.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Real 6-Digit OTP Verification (Step 2)
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setAuthNotice(null);

    const token = otpDigits.join('').trim();
    if (token.length !== 6 || !/^\d{6}$/.test(token)) {
      setAuthError('Please enter all 6 digits of the verification code.');
      return;
    }

    setLoading(true);
    try {
      const user = await AuthService.verifyOtp(email.trim().toLowerCase(), token, 'signup', {
        name: fullName.trim() || email.split('@')[0],
        role: selectedRole
      });

      // Advance to Step 3: Profile Setup or launch
      setSignUpStep('profile_setup');
      setAuthNotice('Email verified successfully! Complete your health profile.');
    } catch (err: any) {
      console.error('OTP Verification Error:', err);
      setAuthError(err?.message || 'Incorrect verification code. Please check your inbox and try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Profile Setup Submission (Step 3)
  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    try {
      const storedUser = AuthService.getStoredUser();
      if (!storedUser) {
        throw new Error('Active session not found. Please log in again.');
      }

      const activeName = fullName.trim() || email.split('@')[0];
      await AuthService.upsertProfile({
        id: storedUser.id,
        email: storedUser.email,
        name: activeName,
        role: selectedRole,
        patientId: `patient-${storedUser.id.slice(0, 8)}`
      });

      const updatedUser: AppUser = {
        ...storedUser,
        name: activeName,
        role: selectedRole
      };
      AuthService.setStoredUser(updatedUser);
      onAuthSuccess(updatedUser);
      onClose();
    } catch (err: any) {
      console.error('Profile Update Error:', err);
      setAuthError(err?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Real Sign In with Email & Password
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthNotice(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError('Please enter your registered email address.');
      return;
    }

    if (!password) {
      setAuthError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const user = await AuthService.signInWithPassword(cleanEmail, password);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      console.error('Login Error:', err);
      setAuthError(err?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // 4b. Check if email was confirmed and log in
  const handleCheckConfirmedAndLogin = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const user = await AuthService.signInWithPassword(email.trim().toLowerCase(), password);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes('email not confirmed')) {
        setAuthError('Email not yet confirmed. Please open your inbox and click "Confirm your mail" first.');
      } else {
        setAuthError(err?.message || 'Please confirm your email before logging in.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 5. Handle Real Password Reset Request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthNotice(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.resetPasswordForEmail(cleanEmail);
      setAuthNotice(result.message);
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to send recovery email.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Handle Real Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    setAuthError(null);
    try {
      const result = await AuthService.resendOtp(email.trim().toLowerCase(), 'signup');
      setResendCooldown(60);
      setCanResend(false);
      setAuthNotice(result.message);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (err: any) {
      const msg = (err?.message || '').toLowerCase();
      if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit')) {
        setAuthError('Email rate limit exceeded by Supabase. Please wait a few minutes before requesting another email, or turn off "Confirm email" in Supabase settings.');
      } else {
        setAuthError(err?.message || 'Unable to resend OTP. Please wait a moment.');
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP Digit Change
  const handleOtpDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    if (value.length <= 1) {
      newDigits[index] = value;
      setOtpDigits(newDigits);
      if (value && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  // OTP Backspace Handling
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // OTP Paste Handling
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setOtpDigits(newDigits);

    const targetIdx = Math.min(pastedData.length, 5);
    otpInputRefs.current[targetIdx]?.focus();
  };

  const handleSaveCustomSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSupabaseUrl || !customSupabaseKey) {
      setAuthError('Please provide both Supabase Project URL and Anon Key.');
      return;
    }
    const success = saveSupabaseConfig(customSupabaseUrl, customSupabaseKey);
    if (!success) {
      setAuthError('Invalid Supabase Project URL. Must start with https://');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-6 bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {flow === 'config'
                  ? 'Supabase Cloud Config'
                  : flow === 'forgot_password'
                  ? 'Password Recovery'
                  : flow === 'signup'
                  ? signUpStep === 'credentials'
                    ? 'Create Account'
                    : signUpStep === 'otp'
                    ? 'Verify Email OTP'
                    : 'Personalize Profile'
                  : 'Account Login'}
              </h3>
              <p className="text-xs text-teal-100/80">
                {flow === 'config'
                  ? 'Connect PostgreSQL & Auth'
                  : flow === 'signup'
                  ? signUpStep === 'credentials'
                    ? 'Step 1 of 3: Credentials'
                    : signUpStep === 'otp'
                    ? 'Step 2 of 3: Check Inbox'
                    : 'Step 3 of 3: Complete Setup'
                  : 'Real Supabase Auth & Session'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Banner if Supabase URL is not configured */}
        {!isSupabaseConfigured && flow !== 'config' && (
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-900/60 flex items-start justify-between gap-2 shrink-0">
            <div className="flex items-start space-x-2 text-xs text-amber-900 dark:text-amber-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold block">Supabase Connection Required</span>
                <span>To send real Email OTPs, configure your project credentials in <code className="font-mono font-bold">frontend/.env</code>.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFlow('config')}
              className="text-[11px] font-bold underline text-amber-800 dark:text-amber-300 hover:text-amber-950 shrink-0 cursor-pointer"
            >
              Configure
            </button>
          </div>
        )}

        {/* Navigation Tabs (For Login / Signup modes) */}
        {flow !== 'forgot_password' && flow !== 'config' && signUpStep === 'credentials' && (
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                setFlow('signin');
                setAuthError(null);
                setAuthNotice(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                flow === 'signin'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setFlow('signup');
                setSignUpStep('credentials');
                setAuthError(null);
                setAuthNotice(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                flow === 'signup'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Global Error Banner */}
          {authError && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-700 dark:text-rose-300 font-medium flex flex-col gap-2 animate-in fade-in">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="flex-1 leading-relaxed">{authError}</span>
              </div>
              {authError.toLowerCase().includes('rate limit') && (
                <div className="mt-1 pt-2 border-t border-rose-200/60 dark:border-rose-800/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-rose-600 dark:text-rose-400">
                    Already registered or want to log in?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFlow('signin');
                      setAuthError(null);
                    }}
                    className="text-[11px] font-bold text-rose-800 dark:text-rose-200 underline hover:text-rose-950 cursor-pointer shrink-0"
                  >
                    Switch to Log In
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Global Notice Banner */}
          {authNotice && (
            <div className="p-3.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900 rounded-2xl text-xs text-teal-700 dark:text-teal-300 font-medium flex items-start space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600 mt-0.5" />
              <span>{authNotice}</span>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* FLOW A: SIGN IN                                               */}
          {/* ------------------------------------------------------------- */}
          {flow === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setFlow('forgot_password');
                      setAuthError(null);
                      setAuthNotice(null);
                    }}
                    className="text-[11px] font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="teal"
                disabled={loading}
                className="w-full h-11 text-xs font-black shadow-md flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Log In to Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* ------------------------------------------------------------- */}
          {/* FLOW B: SIGN UP - STEP 1 (Credentials)                         */}
          {/* ------------------------------------------------------------- */}
          {flow === 'signup' && signUpStep === 'credentials' && (
            <form onSubmit={handleSignUpCredentials} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Your Real Email Address
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  A real 6-digit confirmation OTP will be sent to this email.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Choose Password (Min 6 characters)
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>

              <Button
                type="submit"
                variant="teal"
                disabled={loading}
                className="w-full h-11 text-xs font-black shadow-md flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
              >
                {loading ? (
                  <span>Dispatching Real OTP...</span>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* ------------------------------------------------------------- */}
          {/* FLOW B: SIGN UP - STEP 2 (Email Confirmation & Verification)  */}
          {/* ------------------------------------------------------------- */}
          {flow === 'signup' && signUpStep === 'otp' && (
            <div className="space-y-4">
              {/* Email Sent Header Card */}
              <div className="text-center space-y-2 py-1">
                <div className="w-14 h-14 rounded-3xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-md">
                  <Mail className="w-7 h-7 animate-bounce" />
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  Verification Email Sent!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
                  We sent a confirmation link to <strong className="text-teal-700 dark:text-teal-300 font-bold block mt-0.5">{email}</strong>
                </p>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 text-xs space-y-2.5">
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                  <span className="text-slate-700 dark:text-slate-300">Open your <strong>email inbox</strong> (or spam/junk folder).</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                  <span className="text-slate-700 dark:text-slate-300">Click the <strong>"Confirm your mail"</strong> link sent by Supabase.</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                  <span className="text-slate-700 dark:text-slate-300">Your account will be verified and you can log in immediately!</span>
                </div>
              </div>

              {/* Primary Action: I Have Confirmed / Check Status */}
              <div className="space-y-3 pt-1">
                <Button
                  type="button"
                  variant="teal"
                  disabled={loading}
                  onClick={handleCheckConfirmedAndLogin}
                  className="w-full h-12 text-xs font-black shadow-md flex items-center justify-center space-x-2 cursor-pointer bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
                >
                  {loading ? (
                    <span>Verifying with Supabase...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>I Have Confirmed My Email — Log In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                {/* Manual 6-Digit Code Option toggle */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setShowManualCodeInput(!showManualCodeInput)}
                    className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 underline cursor-pointer"
                  >
                    {showManualCodeInput ? 'Hide manual code entry' : 'Received a 6-digit numeric code instead? Enter code here'}
                  </button>
                </div>

                {showManualCodeInput && (
                  <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                    <p className="text-[11px] font-bold text-center text-slate-600 dark:text-slate-300">
                      Enter the 6-digit code from your email:
                    </p>
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpInputRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={handleOtpPaste}
                          className="w-10 h-12 sm:w-11 sm:h-13 text-center text-lg font-mono font-black rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-teal-500 outline-none"
                        />
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="teal"
                      disabled={loading || otpDigits.join('').length !== 6}
                      onClick={() => handleVerifyOtp()}
                      className="w-full h-10 text-xs font-black shadow-xs cursor-pointer"
                    >
                      Verify 6-Digit Code
                    </Button>
                  </div>
                )}

                {/* Auxiliary Nav */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSignUpStep('credentials');
                      setAuthError(null);
                    }}
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center space-x-1 cursor-pointer font-bold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Email</span>
                  </button>

                  <button
                    type="button"
                    disabled={!canResend || loading}
                    onClick={handleResendOtp}
                    className={`flex items-center space-x-1 font-bold cursor-pointer transition ${
                      canResend
                        ? 'text-teal-600 dark:text-teal-400 hover:underline'
                        : 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{canResend ? 'Resend Email' : `Resend in ${resendCooldown}s`}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* FLOW B: SIGN UP - STEP 3 (Profile Personalization)            */}
          {/* ------------------------------------------------------------- */}
          {flow === 'signup' && signUpStep === 'profile_setup' && (
            <form onSubmit={handleCompleteProfile} className="space-y-4">
              <div className="text-center pb-1">
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  Personalize Your Account Profile
                </h4>
                <p className="text-xs text-slate-500">
                  This connects your real profile data to your authenticated Supabase ID.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <Input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Patil or Dr. Priya Sharma"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Your Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="SENIOR">👴 Senior Patient</option>
                    <option value="CAREGIVER">👨‍👩‍👧 Family Caregiver</option>
                    <option value="DOCTOR">👨‍⚕️ Clinician / Doctor</option>
                    <option value="ADMIN">🛠️ System Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Preferred Language
                  </label>
                  <select
                    value={userLanguage}
                    onChange={(e) => setUserLanguage(e.target.value as Language)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="en">English</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                variant="teal"
                disabled={loading}
                className="w-full h-11 text-xs font-black shadow-md flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
              >
                {loading ? (
                  <span>Saving Profile to PostgreSQL...</span>
                ) : (
                  <>
                    <span>Launch SugarSense AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* ------------------------------------------------------------- */}
          {/* FLOW C: FORGOT PASSWORD                                       */}
          {/* ------------------------------------------------------------- */}
          {flow === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-inner">
                  <Key className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  Reset Account Password
                </h4>
                <p className="text-xs text-slate-500">
                  Enter your registered email to receive a real password reset link.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                />
              </div>

              <Button
                type="submit"
                variant="teal"
                disabled={loading}
                className="w-full h-11 text-xs font-black shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                {loading ? (
                  <span>Sending Recovery Email...</span>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setFlow('signin');
                    setAuthError(null);
                    setAuthNotice(null);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center space-x-1 mx-auto cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* ------------------------------------------------------------- */}
          {/* FLOW D: LIVE SUPABASE CREDENTIAL CONFIGURATION                */}
          {/* ------------------------------------------------------------- */}
          {flow === 'config' && (
            <form onSubmit={handleSaveCustomSupabase} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                  <Database className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  Connect Supabase Cloud Instance
                </h4>
                <p className="text-xs text-slate-500">
                  Enter your Supabase Project URL and Public Anon Key to enable real OTP email delivery.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Project URL (<code className="font-mono text-[10px]">https://...supabase.co</code>)
                </label>
                <Input
                  type="url"
                  required
                  value={customSupabaseUrl}
                  onChange={(e) => setCustomSupabaseUrl(e.target.value)}
                  placeholder="https://yourprojectid.supabase.co"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Public Anon Key (<code className="font-mono text-[10px]">anon public</code>)
                </label>
                <textarea
                  required
                  rows={3}
                  value={customSupabaseKey}
                  onChange={(e) => setCustomSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <Button
                type="submit"
                variant="teal"
                className="w-full h-11 text-xs font-black shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save & Connect Live Supabase</span>
              </Button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setFlow('signin')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-500 shrink-0">
          <span>🛡️ Verified by Supabase PostgreSQL Row Level Security (RLS)</span>
        </div>
      </div>
    </div>
  );
};
