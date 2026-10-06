import { PersonalBaseline, GlucoseReading, Medication, Meal, ActivityData, CompoundRiskAssessment, TelemetryEvent } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface BackendHealthStatus {
  status: string;
  fastapi: boolean;
  groq_configured: boolean;
  supabase_configured: boolean;
  python_ml_engine: string;
}

export class SugarSenseApiClient {
  /**
   * Check FastAPI Backend & AI service connectivity
   */
  public static async checkHealth(): Promise<BackendHealthStatus | null> {
    try {
      const res = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend offline or spinning up
    }
    return null;
  }

  /**
   * Run Python Analytics & ML Multi-Variate Compound Risk Assessment
   */
  public static async evaluateRisk(
    baseline: PersonalBaseline,
    latestGlucose: GlucoseReading | null,
    medications: Medication[],
    meals: Meal[],
    activity: ActivityData,
    symptoms: string[]
  ): Promise<CompoundRiskAssessment | null> {
    try {
      const payload = {
        patient_id: baseline.patientId,
        age: baseline.age,
        diabetes_type: baseline.diabetesType,
        latest_glucose: latestGlucose ? {
          value: latestGlucose.value,
          context: latestGlucose.context,
          timestamp: latestGlucose.timestamp
        } : null,
        medications: medications.map(m => ({
          id: m.id,
          name: m.name,
          dosage: m.dosage,
          taken: m.taken,
          scheduled_time: m.scheduledTime,
          criticality: m.criticality
        })),
        meals: meals.map(m => ({
          id: m.id,
          name: m.name,
          status: m.status,
          food_items: m.foodItems || []
        })),
        activity: {
          steps_today: activity.stepsToday,
          step_target: activity.stepTarget,
          walk_minutes_today: activity.walkMinutesToday,
          mobility_status: activity.mobilityStatus
        },
        symptoms,
        weight_kg: baseline.baselineWeightKg
      };

      const res = await fetch(`${API_BASE}/analyze-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4000)
      });

      if (res.ok) {
        const data = await res.json();
        return {
          status: data.status,
          score: data.score,
          title: data.title,
          summary: data.subtitle,
          whyExplanation: {
            en: data.reasons.map((r: any) => r.en),
            hi: data.reasons.map((r: any) => r.hi),
            mr: data.reasons.map((r: any) => r.mr)
          },
          recommendedActions: {
            en: [data.next_best_action?.title || "Check Glucose & Drink Warm Water"],
            hi: [data.next_best_action?.title || "शुगर जांचें और गुनगुना पानी पिएं"],
            mr: [data.next_best_action?.title || "साखर तपासा आणि कोमट पाणी प्या"]
          },
          caregiverAlertRecommended: data.should_alert_caregiver,
          caregiverAlertReason: data.should_alert_caregiver ? data.reasons[0] : undefined,
          factors: {
            glucoseRisk: data.factors.glucose_risk,
            medicationRisk: data.factors.medication_risk,
            mealRisk: data.factors.meal_risk,
            activityRisk: data.factors.activity_risk,
            symptomRisk: data.factors.symptom_risk
          }
        };
      }
    } catch {
      // Graceful fallback to client engine
    }
    return null;
  }

  /**
   * Ask AI Diabetes Assistant using Groq LLM API
   */
  public static async askAssistant(
    query: string,
    language: string,
    patientContext?: Record<string, any>,
    history?: Array<{ role: string; content: string }>
  ): Promise<{ reply: string; model: string; sources: string[]; followups: string[] } | null> {
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language,
          patient_id: "patient-senior-101",
          context: patientContext,
          history
        }),
        signal: AbortSignal.timeout(8000)
      });

      if (res.ok) {
        const data = await res.json();
        return {
          reply: data.reply,
          model: data.model_used,
          sources: data.grounded_sources,
          followups: data.suggested_followups
        };
      }
    } catch {
      // Fallback to local
    }
    return null;
  }

  /**
   * Save Telemetry Entry to Supabase via FastAPI Backend
   */
  public static async logTelemetry(event: TelemetryEvent): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: event.id,
          patient_id: "patient-aai-101",
          category: event.category,
          title: event.title,
          detail: event.detail,
          value: event.value,
          status_tag: event.statusTag,
          source: event.source,
          timestamp: event.timestamp
        }),
        signal: AbortSignal.timeout(3000)
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Fetch 14-Day TIR Analytics from Python NumPy service
   */
  public static async getTimeInRangeMetrics(): Promise<any | null> {
    try {
      const res = await fetch(`${API_BASE}/analytics/tir`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return null;
  }
}
