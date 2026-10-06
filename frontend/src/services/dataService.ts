import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  GlucoseReading, 
  Medication, 
  Meal, 
  CaregiverAlert, 
  ProfileRecord, 
  SystemBroadcast 
} from '../types';

export interface GlucoseInput {
  value: number;
  context: 'FASTING' | 'POST_BREAKFAST' | 'POST_LUNCH' | 'POST_DINNER' | 'RANDOM';
  notes?: string;
  isFasting?: boolean;
  patientId?: string;
  timestamp?: string;
}

export interface MedicationInput {
  name: string;
  dosage: string;
  scheduledTime: string;
  criticality?: 'CRITICAL' | 'STANDARD';
  instructions?: { en: string; hi: string; mr: string };
  patientId?: string;
}

export interface AlertInput {
  title: string;
  detail: string;
  severity?: 'INFO' | 'WARNING' | 'CRITICAL';
  patientId?: string;
}

export class DataService {
  /**
   * 1. GLUCOSE READINGS CRUD
   */
  public static async fetchUserGlucose(patientId: string = 'patient-senior-101', limit: number = 50): Promise<GlucoseReading[]> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(`sugarsense_glucose_${patientId}`);
      if (stored) {
        try { return JSON.parse(stored); } catch { /* ignore */ }
      }
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('glucose_readings')
        .select('*')
        .eq('patient_id', patientId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error || !data) return [];

      return data.map((row: any) => ({
        timestamp: new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: Number(row.value),
        context: row.meal_tag || 'RANDOM',
        isDeviation: Number(row.value) > 160 || Number(row.value) < 70,
        deviationDelta: Number(row.value) > 160 ? Number(row.value) - 145 : 0
      }));
    } catch (err) {
      console.warn('Error fetching glucose readings:', err);
      return [];
    }
  }

  public static async logGlucose(reading: GlucoseInput): Promise<GlucoseReading | null> {
    const patientId = reading.patientId || 'patient-senior-101';
    const timestampIso = reading.timestamp || new Date().toISOString();

    const formattedReading: GlucoseReading = {
      timestamp: new Date(timestampIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Number(reading.value),
      context: reading.context,
      isDeviation: Number(reading.value) > 160 || Number(reading.value) < 70,
      deviationDelta: Number(reading.value) > 160 ? Number(reading.value) - 145 : 0
    };

    if (!isSupabaseConfigured) {
      const existing = await this.fetchUserGlucose(patientId);
      const updated = [formattedReading, ...existing];
      localStorage.setItem(`sugarsense_glucose_${patientId}`, JSON.stringify(updated));
      return formattedReading;
    }

    try {
      const { error } = await supabase
        .from('glucose_readings')
        .insert({
          patient_id: patientId,
          value: reading.value,
          meal_tag: reading.context,
          notes: reading.notes || null,
          is_fasting: reading.isFasting || reading.context === 'FASTING',
          timestamp: timestampIso
        });

      if (error) {
        console.warn('Error inserting glucose to Supabase:', error.message);
      }
      return formattedReading;
    } catch (err) {
      console.warn('Network exception while logging glucose:', err);
      return formattedReading;
    }
  }

  /**
   * 2. MEDICATIONS CRUD
   */
  public static async fetchMedications(patientId: string = 'patient-senior-101'): Promise<Medication[]> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(`sugarsense_meds_${patientId}`);
      if (stored) {
        try { return JSON.parse(stored); } catch { /* ignore */ }
      }
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('patient_id', patientId)
        .order('scheduled_time', { ascending: true });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        dosage: row.dosage,
        scheduledTime: row.scheduled_time,
        taken: Boolean(row.taken),
        takenAt: row.taken_at ? new Date(row.taken_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
        criticality: row.criticality || 'STANDARD',
        instructions: row.instructions || { en: '', hi: '', mr: '' }
      }));
    } catch (err) {
      console.warn('Error fetching medications:', err);
      return [];
    }
  }

  public static async addMedication(med: MedicationInput): Promise<Medication | null> {
    const patientId = med.patientId || 'patient-senior-101';
    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: med.name,
      dosage: med.dosage,
      scheduledTime: med.scheduledTime,
      taken: false,
      criticality: med.criticality || 'STANDARD',
      instructions: med.instructions || { en: '', hi: '', mr: '' }
    };

    if (!isSupabaseConfigured) {
      const existing = await this.fetchMedications(patientId);
      const updated = [...existing, newMed];
      localStorage.setItem(`sugarsense_meds_${patientId}`, JSON.stringify(updated));
      return newMed;
    }

    try {
      const { data, error } = await supabase
        .from('medications')
        .insert({
          patient_id: patientId,
          name: med.name,
          dosage: med.dosage,
          scheduled_time: med.scheduledTime,
          taken: false,
          criticality: med.criticality || 'STANDARD',
          instructions: med.instructions || { en: '', hi: '', mr: '' }
        })
        .select()
        .single();

      if (error) {
        console.warn('Error inserting med to Supabase:', error.message);
        return newMed;
      }

      return {
        id: data.id,
        name: data.name,
        dosage: data.dosage,
        scheduledTime: data.scheduled_time,
        taken: Boolean(data.taken),
        criticality: data.criticality || 'STANDARD',
        instructions: data.instructions || { en: '', hi: '', mr: '' }
      };
    } catch (err) {
      console.warn('Network exception while adding medication:', err);
      return newMed;
    }
  }

  public static async toggleMedication(id: string, taken: boolean, patientId: string = 'patient-senior-101'): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const meds = await this.fetchMedications(patientId);
      const updated = meds.map(m => m.id === id ? { 
        ...m, 
        taken, 
        takenAt: taken ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined 
      } : m);
      localStorage.setItem(`sugarsense_meds_${patientId}`, JSON.stringify(updated));
      return true;
    }

    try {
      const { error } = await supabase
        .from('medications')
        .update({
          taken,
          taken_at: taken ? new Date().toISOString() : null
        })
        .eq('id', id);

      return !error;
    } catch (err) {
      console.warn('Error toggling medication in Supabase:', err);
      return false;
    }
  }

  /**
   * 3. CAREGIVER ALERTS CRUD
   */
  public static async fetchAlerts(patientId: string = 'patient-senior-101'): Promise<CaregiverAlert[]> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(`sugarsense_alerts_${patientId}`);
      if (stored) {
        try { return JSON.parse(stored); } catch { /* ignore */ }
      }
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('caregiver_alerts')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        timestamp: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        severity: row.severity === 'CRITICAL' ? 'CRITICAL' : row.severity === 'HIGH' || row.severity === 'WARNING' || row.severity === 'ATTENTION' ? 'WARNING' : 'INFO',
        title: row.title,
        message: row.detail || row.title,
        detailedPattern: row.detail || row.title,
        acknowledged: Boolean(row.acknowledged),
        acknowledgedAt: row.acknowledged_at
      }));
    } catch (err) {
      console.warn('Error fetching caregiver alerts:', err);
      return [];
    }
  }

  public static async createAlert(alert: AlertInput): Promise<boolean> {
    const patientId = alert.patientId || 'patient-senior-101';

    if (!isSupabaseConfigured) {
      const newAlert: CaregiverAlert = {
        id: `alert-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        severity: alert.severity || 'WARNING',
        title: alert.title,
        message: alert.detail,
        detailedPattern: alert.detail,
        acknowledged: false
      };
      const existing = await this.fetchAlerts(patientId);
      localStorage.setItem(`sugarsense_alerts_${patientId}`, JSON.stringify([newAlert, ...existing]));
      return true;
    }

    try {
      const { error } = await supabase
        .from('caregiver_alerts')
        .insert({
          patient_id: patientId,
          title: alert.title,
          detail: alert.detail,
          severity: alert.severity || 'MEDIUM',
          created_at: new Date().toISOString()
        });

      return !error;
    } catch (err) {
      console.warn('Error creating alert in Supabase:', err);
      return false;
    }
  }

  public static async acknowledgeAlert(id: string, acknowledgedBy: string = 'Caregiver', patientId: string = 'patient-senior-101'): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const alerts = await this.fetchAlerts(patientId);
      const updated = alerts.map(a => a.id === id ? { ...a, acknowledged: true, acknowledgedAt: new Date().toISOString() } : a);
      localStorage.setItem(`sugarsense_alerts_${patientId}`, JSON.stringify(updated));
      return true;
    }

    try {
      const { error } = await supabase
        .from('caregiver_alerts')
        .update({
          acknowledged: true,
          acknowledged_by: acknowledgedBy,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', id);

      return !error;
    } catch (err) {
      console.warn('Error acknowledging alert in Supabase:', err);
      return false;
    }
  }

  /**
   * 4. MEALS CRUD
   */
  public static async fetchMeals(patientId: string = 'patient-senior-101'): Promise<Meal[]> {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('patient_id', patientId)
        .order('logged_at', { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        scheduledTime: new Date(row.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'LOGGED',
        loggedAt: new Date(row.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        foodItems: Array.isArray(row.items) ? row.items : [row.name],
        estimatedCarbs: Number(row.carbs_g) > 40 ? 'HIGH' : Number(row.carbs_g) > 20 ? 'MEDIUM' : 'LOW'
      }));
    } catch {
      return [];
    }
  }

  public static async logMeal(meal: { name: string; carbsG?: number; items?: string[]; patientId?: string }): Promise<boolean> {
    const patientId = meal.patientId || 'patient-senior-101';
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase
        .from('meals')
        .insert({
          patient_id: patientId,
          name: meal.name,
          carbs_g: meal.carbsG || 25,
          items: meal.items || [meal.name],
          logged_at: new Date().toISOString()
        });
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * 5. REALTIME WEBSOCKET SUBSCRIPTION
   * Listens for any INSERT, UPDATE, DELETE across glucose, medications, caregiver_alerts, and broadcasts
   */
  public static subscribeToRealtime(
    patientId: string = 'patient-senior-101',
    onUpdate: (type: 'glucose' | 'medication' | 'alert' | 'broadcast', payload: any) => void
  ): () => void {
    if (!isSupabaseConfigured) {
      return () => {};
    }

    const channel = supabase
      .channel(`sugarsense-realtime-${patientId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'glucose_readings', filter: `patient_id=eq.${patientId}` },
        (payload) => onUpdate('glucose', payload.new)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'medications', filter: `patient_id=eq.${patientId}` },
        (payload) => onUpdate('medication', payload.new)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'caregiver_alerts', filter: `patient_id=eq.${patientId}` },
        (payload) => onUpdate('alert', payload.new)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'system_broadcasts' },
        (payload) => onUpdate('broadcast', payload.new)
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }

  /**
   * 6. RAW TABLE INSPECTOR (Admin Tool)
   */
  public static async fetchRawTableData(tableName: string, limit: number = 25): Promise<any[]> {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  }

  /**
   * 7. SYSTEM TELEMETRY STATS (Admin Tool)
   */
  public static async fetchSystemStats(): Promise<{
    userCount: number;
    glucoseCount: number;
    alertCount: number;
    medCount: number;
  }> {
    if (!isSupabaseConfigured) {
      return { userCount: 4, glucoseCount: 18, alertCount: 3, medCount: 3 };
    }

    try {
      const [p, g, a, m] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('glucose_readings').select('id', { count: 'exact', head: true }),
        supabase.from('caregiver_alerts').select('id', { count: 'exact', head: true }),
        supabase.from('medications').select('id', { count: 'exact', head: true }),
      ]);

      return {
        userCount: p.count || 0,
        glucoseCount: g.count || 0,
        alertCount: a.count || 0,
        medCount: m.count || 0
      };
    } catch {
      return { userCount: 0, glucoseCount: 0, alertCount: 0, medCount: 0 };
    }
  }
}
