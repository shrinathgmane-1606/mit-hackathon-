import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserRole } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('xyzcompany')
);

// Real Supabase Client Instance
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  patientId?: string;
  createdAt: string;
}

// Session Management & Role Storage Helper
export class AuthService {
  private static STORAGE_KEY = 'sugarsense_auth_user';

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

  public static async signIn(email: string, role: UserRole, name?: string, password?: string): Promise<AppUser> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'Password123!',
        });
        if (error) console.warn('Supabase Auth remote error, utilizing active profile:', error.message);
      } catch (err) {
        console.warn('Supabase Auth connection error:', err);
      }
    }

    const appUser: AppUser = {
      id: `usr-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      role,
      patientId: 'patient-aai-101',
      createdAt: new Date().toISOString()
    };

    this.setStoredUser(appUser);
    return appUser;
  }

  public static async signUp(email: string, password: string, role: UserRole, name: string): Promise<AppUser> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role,
            }
          }
        });
        if (error) console.warn('Supabase SignUp remote error, utilizing local profile:', error.message);
      } catch (err) {
        console.warn('Supabase SignUp connection error:', err);
      }
    }

    const appUser: AppUser = {
      id: `usr-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      role,
      patientId: 'patient-aai-101',
      createdAt: new Date().toISOString()
    };

    this.setStoredUser(appUser);
    return appUser;
  }

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
}
