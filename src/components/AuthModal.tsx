import React, { useState, useEffect } from 'react';
import { UserRole, Language } from '../types';
import { AuthService, AppUser } from '../lib/supabase';
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
  ShieldAlert,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AppUser) => void;
  language: Language;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  language,
  initialMode = 'signin'
}) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('patient@sugarsense.in');
  const [password, setPassword] = useState('SeniorCare2026!');
  const [name, setName] = useState('Senior Patient');
  const [selectedRole, setSelectedRole] = useState<UserRole>('SENIOR');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setIsSignUp(initialMode === 'signup');
    if (initialMode === 'signup') {
      setName('');
    }
  }, [initialMode]);

  if (!isOpen) return null;

  const roleOptions: { role: UserRole; title: string; subtitle: string; icon: JSX.Element; defaultEmail: string; defaultName: string }[] = [
    {
      role: 'SENIOR',
      title: '👴 Senior Patient',
      subtitle: 'Primary health tracker & voice assistant',
      icon: <User className="w-4 h-4 text-emerald-500" />,
      defaultEmail: 'patient@sugarsense.in',
      defaultName: 'Senior Patient'
    },
    {
      role: 'CAREGIVER',
      title: '👨‍👩‍👧 Caregiver',
      subtitle: 'Silent safety net & critical alerts',
      icon: <HeartHandshake className="w-4 h-4 text-indigo-500" />,
      defaultEmail: 'caregiver@sugarsense.in',
      defaultName: 'Family Caregiver'
    },
    {
      role: 'DOCTOR',
      title: '👨‍⚕️ Clinician / MD',
      subtitle: '14-Day TIR & EHR visit summaries',
      icon: <Stethoscope className="w-4 h-4 text-teal-500" />,
      defaultEmail: 'doctor@sugarsense.in',
      defaultName: 'Attending Physician'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    const activeName = name.trim() || (selectedRole === 'SENIOR' ? 'Senior Patient' : selectedRole === 'CAREGIVER' ? 'Family Caregiver' : 'Attending Physician');

    try {
      let user: AppUser;
      if (isSignUp) {
        user = await AuthService.signUp(email, password, selectedRole, activeName);
      } else {
        user = await AuthService.signIn(email, selectedRole, activeName, password);
      }
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      console.error(err);
      setAuthError(err?.message || 'Authentication error. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = (role: UserRole, defaultEmail: string, defaultName: string) => {
    setSelectedRole(role);
    setEmail(defaultEmail);
    if (!isSignUp) {
      setName(defaultName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {isSignUp ? 'Create SugarSense Account' : 'Role-Based Authentication'}
              </h3>
              <p className="text-xs text-teal-100/80">
                Supabase Auth & Row Level Security
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

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-1">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              !isSignUp
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In with Existing Account
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              isSignUp
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Create New Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Role Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Select Your User Persona
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roleOptions.map((opt) => {
                const isSelected = selectedRole === opt.role;
                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => handleSelectRole(opt.role, opt.defaultEmail, opt.defaultName)}
                    className={`p-2.5 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-600 ring-2 ring-teal-500/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {opt.icon}
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-2">
                      {opt.title}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-medium">
              {authError}
            </div>
          )}

          {/* Form Inputs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anusuya Deshmukh"
            />
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
              placeholder="name@sugarsense.in"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Password
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

          <div className="pt-2">
            <Button
              type="submit"
              variant="teal"
              disabled={loading}
              className="w-full h-11 text-xs font-black shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              {loading ? (
                <span>Authenticating with Supabase...</span>
              ) : isSignUp ? (
                <>
                  <span>Create Account as {selectedRole}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Sign In as {selectedRole}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>🛡️ Protected by Supabase Row Level Security & AES-256</span>
          </div>
        </form>
      </div>
    </div>
  );
};
