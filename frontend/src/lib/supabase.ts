import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import { 
  UserRole, 
  GlucoseReading, 
  Medication, 
  Meal, 
  CaregiverAlert, 
  SystemBroadcast, 
  ProfileRecord 
} from '../types';

/**
 * Resolve Supabase configuration dynamically:
 * Checks Vite environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
 * and falls back to user-configured localStorage keys if entered in the live UI.
 */
export const getSupabaseConfig = () => {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
  const localUrl = (localStorage.getItem('sugarsense_supabase_url') || '').trim();
  const localKey = (localStorage.getItem('sugarsense_supabase_anon_key') || '').trim();

  const url = localUrl || envUrl;
  const key = localKey || envKey;

  const isConfigured = Boolean(
    url && key &&
    !url.includes('xyzcompany') &&
    !url.includes('your-project') &&
    !key.includes('dummy') &&
    url.startsWith('https://')
  );

  return {
    url: isConfigured ? url : 'https://placeholder.supabase.co',
    key: isConfigured ? key : 'placeholder-key',
    isConfigured
  };
};

export const saveSupabaseConfig = (url: string, key: string): boolean => {
  if (!url || !key || !url.startsWith('https://')) {
    return false;
  }
  localStorage.setItem('sugarsense_supabase_url', url.trim());
  localStorage.setItem('sugarsense_supabase_anon_key', key.trim());
  window.location.reload();
  return true;
};

export const clearSupabaseConfig = (): void => {
  localStorage.removeItem('sugarsense_supabase_url');
  localStorage.removeItem('sugarsense_supabase_anon_key');
  window.location.reload();
};

const config = getSupabaseConfig();
export const isSupabaseConfigured = config.isConfigured;

// Production Supabase Client Instance
export const supabase: SupabaseClient = createClient(config.url, config.key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  patientId: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

// ------------------------------------------------------------------------------
// AUTH SERVICE: 100% Genuine Supabase Authentication & Real 6-Digit Email OTP
// ------------------------------------------------------------------------------
export class AuthService {
  private static STORAGE_KEY = 'sugarsense_session_user';

  public static getStoredUser(): AppUser | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public static setStoredUser(user: AppUser | null): void {
    if (!user) {
      localStorage.removeItem(this.STORAGE_KEY);
    } else {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }
  }

  /**
   * Get active Supabase session
   */
  public static async getSession(): Promise<Session | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  }

  /**
   * Subscribe to real Supabase auth state changes
   */
  public static onAuthStateChange(callback: (user: AppUser | null) => void) {
    if (!isSupabaseConfigured) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }

    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const profile = await this.fetchUserProfile(session.user.id);
          const appUser: AppUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            role: (profile?.role || session.user.user_metadata?.role || 'SENIOR') as UserRole,
            patientId: profile?.patientId || session.user.user_metadata?.patient_id || `patient-${session.user.id.slice(0, 8)}`,
            phone: profile?.phone,
            avatarUrl: profile?.avatarUrl,
            createdAt: session.user.created_at || new Date().toISOString()
          };
          this.setStoredUser(appUser);
          callback(appUser);
        } catch {
          const fallbackUser: AppUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            role: (session.user.user_metadata?.role || 'SENIOR') as UserRole,
            patientId: session.user.user_metadata?.patient_id || `patient-${session.user.id.slice(0, 8)}`,
            createdAt: session.user.created_at || new Date().toISOString()
          };
          this.setStoredUser(fallbackUser);
          callback(fallbackUser);
        }
      } else if (event === 'SIGNED_OUT') {
        this.setStoredUser(null);
        callback(null);
      }
    });
  }

  /**
   * 1. Real Sign Up with Email, Password & Metadata -> Triggers Real 6-Digit Email OTP
   */
  public static async signUp(
    email: string, 
    password: string, 
    role: UserRole = 'SENIOR', 
    name?: string
  ): Promise<{ requiresOtp: boolean; message: string; user?: User | null }> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env or configure live credentials.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
    }

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: name || cleanEmail.split('@')[0],
          role: role,
        },
        emailRedirectTo: window.location.origin,
      }
    });

    if (error) {
      throw new Error(error.message || 'Registration failed. Please verify email and password.');
    }

    if (data.user) {
      // If user is returned and session is active (email confirmation disabled in Supabase)
      if (data.session) {
        await this.upsertProfile({
          id: data.user.id,
          email: cleanEmail,
          name: name || cleanEmail.split('@')[0],
          role: role,
          patientId: `patient-${data.user.id.slice(0, 8)}`
        });

        const appUser: AppUser = {
          id: data.user.id,
          email: cleanEmail,
          name: name || cleanEmail.split('@')[0],
          role: role,
          patientId: `patient-${data.user.id.slice(0, 8)}`,
          createdAt: data.user.created_at || new Date().toISOString()
        };
        this.setStoredUser(appUser);
        return { requiresOtp: false, message: 'Account verified and ready!', user: data.user };
      }

      // Email confirmation / 6-digit OTP code dispatched
      return {
        requiresOtp: true,
        message: `A real 6-digit verification OTP has been sent to ${cleanEmail}. Check your inbox or spam folder.`,
        user: data.user
      };
    }

    throw new Error('No user record was returned by the authentication server.');
  }

  /**
   * 2. Real 6-Digit Email OTP Verification
   */
  public static async verifyOtp(
    email: string, 
    token: string, 
    type: 'signup' | 'email' | 'recovery' = 'signup',
    profileData?: { name?: string; role?: UserRole; language?: string }
  ): Promise<AppUser> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please add your credentials.');
    }

    const cleanToken = token.trim();
    if (cleanToken.length !== 6 || !/^\d{6}$/.test(cleanToken)) {
      throw new Error('Please enter a valid 6-digit numeric verification code.');
    }

    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: type as any,
    });

    if (error) {
      if (error.message.toLowerCase().includes('expired')) {
        throw new Error('Your verification code has expired. Please request a new code.');
      }
      throw new Error('Incorrect verification code. Please check your inbox and try again.');
    }

    if (!data.user) {
      throw new Error('Verification failed. Unable to establish user session.');
    }

    // Provision or update user profile in PostgreSQL
    const assignedName = profileData?.name || data.user.user_metadata?.name || cleanEmail.split('@')[0];
    const assignedRole = (profileData?.role || data.user.user_metadata?.role || 'SENIOR') as UserRole;
    const patientId = `patient-${data.user.id.slice(0, 8)}`;

    await this.upsertProfile({
      id: data.user.id,
      email: cleanEmail,
      name: assignedName,
      role: assignedRole,
      patientId: patientId
    });

    const appUser: AppUser = {
      id: data.user.id,
      email: cleanEmail,
      name: assignedName,
      role: assignedRole,
      patientId: patientId,
      createdAt: data.user.created_at || new Date().toISOString()
    };

    this.setStoredUser(appUser);
    return appUser;
  }

  /**
   * 3. Real Resend OTP (with real rate-limiting handled by Supabase)
   */
  public static async resendOtp(email: string, type: 'signup' | 'email_change' = 'signup'): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.resend({
      type: type as any,
      email: cleanEmail,
    });

    if (error) {
      throw new Error(error.message || 'Failed to resend verification code. Please wait for the cooldown timer.');
    }

    return {
      success: true,
      message: `A fresh 6-digit verification code has been dispatched to ${cleanEmail}.`
    };
  }

  /**
   * 4. Real Sign In with Email & Password
   */
  public static async signInWithPassword(email: string, password: string): Promise<AppUser> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      throw new Error(error.message || 'Invalid login credentials. Please verify your email and password.');
    }

    if (!data.user) {
      throw new Error('Failed to retrieve user session.');
    }

    let profile = await this.fetchUserProfile(data.user.id);
    if (!profile) {
      // Auto-provision if missing
      const patientId = `patient-${data.user.id.slice(0, 8)}`;
      await this.upsertProfile({
        id: data.user.id,
        email: cleanEmail,
        name: data.user.user_metadata?.name || cleanEmail.split('@')[0],
        role: (data.user.user_metadata?.role || 'SENIOR') as UserRole,
        patientId: patientId
      });
      profile = await this.fetchUserProfile(data.user.id);
    }

    const appUser: AppUser = {
      id: data.user.id,
      email: cleanEmail,
      name: profile?.name || data.user.user_metadata?.name || cleanEmail.split('@')[0],
      role: (profile?.role || data.user.user_metadata?.role || 'SENIOR') as UserRole,
      patientId: profile?.patientId || `patient-${data.user.id.slice(0, 8)}`,
      phone: profile?.phone,
      avatarUrl: profile?.avatarUrl,
      createdAt: data.user.created_at || new Date().toISOString()
    };

    this.setStoredUser(appUser);
    return appUser;
  }

  /**
   * 5. Real Password Recovery
   */
  public static async resetPasswordForEmail(email: string): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message || 'Unable to dispatch password reset email.');
    }

    return {
      success: true,
      message: `If an account exists for ${cleanEmail}, a real password reset link has been dispatched.`
    };
  }

  /**
   * 6. Real Sign Out
   */
  public static async signOut(): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase SignOut error:', err);
      }
    }
    this.setStoredUser(null);
  }

  /**
   * 7. Real Profile Fetch by User UUID
   */
  public static async fetchUserProfile(userId: string): Promise<ProfileRecord | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role as UserRole,
        patientId: data.patient_id || `patient-${data.id.slice(0, 8)}`,
        phone: data.phone,
        avatarUrl: data.avatar_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch {
      return null;
    }
  }

  /**
   * 8. Real Profile Upsert
   */
  public static async upsertProfile(profile: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    patientId?: string;
    phone?: string;
  }): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        patient_id: profile.patientId || `patient-${profile.id.slice(0, 8)}`,
        phone: profile.phone || null,
        updated_at: new Date().toISOString()
      });
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * 9. Fetch All Profiles (For Admin Dashboard)
   */
  public static async fetchAllProfiles(): Promise<ProfileRecord[]> {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((d: any) => ({
        id: d.id,
        email: d.email,
        name: d.name,
        role: d.role as UserRole,
        patientId: d.patient_id || `patient-${d.id.slice(0, 8)}`,
        phone: d.phone,
        avatarUrl: d.avatar_url,
        createdAt: d.created_at,
        updatedAt: d.updated_at
      }));
    } catch {
      return [];
    }
  }

  /**
   * 10. Update User Role (Admin Action)
   */
  public static async updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      return !error;
    } catch {
      return false;
    }
  }
}

// ------------------------------------------------------------------------------
// REALTIME DATABASE SERVICE: Glucose, Medications, Meals, Alerts & Broadcasts
// ------------------------------------------------------------------------------
export class SugarSenseDatabaseService {
  public static async fetchActiveBroadcasts(): Promise<SystemBroadcast[]> {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('system_broadcasts')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        authorId: row.author_id,
        title: row.title,
        message: row.message,
        targetRole: row.target_role || 'ALL',
        urgency: row.urgency || 'INFO',
        active: Boolean(row.active),
        createdAt: row.created_at
      }));
    } catch {
      return [];
    }
  }

  public static async createBroadcast(broadcast: {
    title: string;
    message: string;
    targetRole?: 'ALL' | 'SENIOR' | 'CAREGIVER' | 'DOCTOR';
    urgency?: 'INFO' | 'WARNING' | 'CRITICAL';
  }): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase
        .from('system_broadcasts')
        .insert({
          title: broadcast.title,
          message: broadcast.message,
          target_role: broadcast.targetRole || 'ALL',
          urgency: broadcast.urgency || 'INFO',
          active: true,
          created_at: new Date().toISOString()
        });
      return !error;
    } catch {
      return false;
    }
  }

  public static async deactivateBroadcast(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase
        .from('system_broadcasts')
        .update({ active: false })
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  public static subscribeToBroadcasts(onUpdate: (broadcast: SystemBroadcast) => void) {
    if (!isSupabaseConfigured) return null;
    try {
      return supabase
        .channel('system-broadcasts-stream')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'system_broadcasts' },
          (payload) => {
            if (payload.new && (payload.new as any).active) {
              const d = payload.new as any;
              onUpdate({
                id: d.id,
                authorId: d.author_id,
                title: d.title,
                message: d.message,
                targetRole: d.target_role || 'ALL',
                urgency: d.urgency || 'INFO',
                active: Boolean(d.active),
                createdAt: d.created_at
              });
            }
          }
        )
        .subscribe();
    } catch {
      return null;
    }
  }

  public static async seedInitialData(patientId: string = 'patient-senior-101'): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      await supabase.from('medications').upsert([
        {
          patient_id: patientId,
          name: 'Glimepiride',
          dosage: '1mg',
          scheduled_time: '08:30 AM',
          taken: true,
          criticality: 'CRITICAL',
          instructions: {
            en: 'Take with first bite of breakfast',
            mr: 'सकाळच्या पहिल्या घासासोबत घ्या',
            hi: 'नाश्ते के पहले निवाले के साथ लें'
          }
        },
        {
          patient_id: patientId,
          name: 'Metformin',
          dosage: '500mg',
          scheduled_time: '01:30 PM',
          taken: false,
          criticality: 'STANDARD',
          instructions: {
            en: 'Take after lunch',
            mr: 'दुपारच्या जेवणानंतर घ्या',
            hi: 'दोपहर के भोजन के बाद लें'
          }
        },
        {
          patient_id: patientId,
          name: 'Vildagliptin',
          dosage: '50mg',
          scheduled_time: '08:00 PM',
          taken: false,
          criticality: 'STANDARD',
          instructions: {
            en: 'Take before dinner',
            mr: 'रात्रीच्या जेवणापूर्वी घ्या',
            hi: 'रात के खाने से पहले लें'
          }
        }
      ]);

      await supabase.from('glucose_readings').insert([
        {
          patient_id: patientId,
          value: 128,
          meal_tag: 'POST_BREAKFAST',
          notes: 'Standard morning post-prandial calibration reading',
          is_fasting: false,
          timestamp: new Date().toISOString()
        }
      ]);

      return true;
    } catch {
      return false;
    }
  }
}
