"""
SugarSense AI Risk Engine
Personalized Baseline Modeling and Multi-Variate Compound Anomaly Detection
for Elderly Diabetes Companionship.
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
import math
from datetime import datetime, time

@dataclass
class PersonalBaseline:
    patient_id: str
    patient_name: str
    age: int
    diabetes_type: str
    fasting_min: float
    fasting_max: float
    fasting_avg: float
    post_prandial_min: float
    post_prandial_max: float
    post_prandial_avg: float
    typical_breakfast_time: str  # "08:30"
    typical_dinner_time: str     # "20:00"
    baseline_daily_steps: int
    hypo_vulnerability: bool = True  # e.g., on sulfonylureas (Glimepiride) or Insulin

@dataclass
class DailyTelemetry:
    latest_glucose: Optional[float]
    glucose_context: str  # "FASTING" | "POST_BREAKFAST" | "POST_LUNCH" | "POST_DINNER"
    medications_scheduled: int
    medications_taken: int
    critical_medication_missed: bool
    meal_delayed_minutes: int
    meal_skipped: bool
    steps_today: int
    reported_symptoms: List[str] = field(default_factory=list)

@dataclass
class RiskEvaluationResult:
    status: str  # "STABLE" | "ATTENTION" | "HIGH_RISK"
    compound_risk_score: int  # 0 to 100
    why_explanation: List[str]
    recommended_actions: List[str]
    caregiver_escalation_required: bool
    caregiver_alert_reason: Optional[str]
    factor_breakdown: Dict[str, float]

class SugarSenseRiskEngine:
    @staticmethod
    def evaluate(baseline: PersonalBaseline, telemetry: DailyTelemetry) -> RiskEvaluationResult:
        glucose_risk = 0.0
        medication_risk = 0.0
        meal_risk = 0.0
        activity_risk = 0.0
        symptom_risk = 0.0

        why_bullets: List[str] = []
        actions: List[str] = []

        # 1. Glucose deviation from learned baseline
        if telemetry.latest_glucose is not None:
            val = telemetry.latest_glucose
            expected_min = baseline.fasting_min if telemetry.glucose_context == "FASTING" else baseline.post_prandial_min
            expected_max = baseline.fasting_max if telemetry.glucose_context == "FASTING" else baseline.post_prandial_max
            expected_avg = baseline.fasting_avg if telemetry.glucose_context == "FASTING" else baseline.post_prandial_avg

            if val < 70.0:
                glucose_risk = 95.0
                why_bullets.append(f"Glucose reading ({val} mg/dL) is below safe threshold (<70 mg/dL).")
                actions.append("Take 15g of fast-acting carbs (half cup juice or 3 glucose biscuits). Recheck in 15 mins.")
            elif val > expected_max:
                delta = val - expected_max
                if delta > 45.0:
                    glucose_risk = 80.0
                    why_bullets.append(f"Glucose ({val} mg/dL) is {delta:.0f} mg/dL above your personal post-meal baseline (max: {expected_max:.0f}).")
                else:
                    glucose_risk = 45.0
                    why_bullets.append(f"Glucose is mildly higher than your 14-day average ({val} vs {expected_avg:.0f} mg/dL).")
            else:
                glucose_risk = 5.0

        # 2. Medication adherence & timing
        if telemetry.critical_medication_missed:
            medication_risk = 85.0
            why_bullets.append("Key prescribed diabetes medication was missed or significantly delayed.")
            actions.append("Take your prescribed dosage as guided by your doctor's plan.")
        elif telemetry.medications_taken < telemetry.medications_scheduled:
            medication_risk = 40.0
            why_bullets.append("One scheduled medication dose is pending past its normal window.")
        else:
            medication_risk = 5.0

        # 3. Meal timing & skips
        if telemetry.meal_skipped:
            meal_risk = 65.0
            why_bullets.append("A scheduled meal was skipped.")
            actions.append("Have a light, diabetic-friendly snack to maintain energy stability.")
        elif telemetry.meal_delayed_minutes > 60:
            meal_risk = 40.0
            why_bullets.append(f"Meal timing shifted by {telemetry.meal_delayed_minutes} minutes from your routine.")

        # 4. Activity drop
        step_ratio = telemetry.steps_today / max(1, baseline.baseline_daily_steps)
        if step_ratio < 0.30:
            activity_risk = 50.0
            why_bullets.append(f"Physical activity is lower than usual ({telemetry.steps_today} vs {baseline.baseline_daily_steps} steps).")

        # 5. Reported Symptoms
        if len(telemetry.reported_symptoms) > 0:
            symptom_risk = 75.0
            symptoms_str = ", ".join(telemetry.reported_symptoms)
            why_bullets.append(f"Reported symptoms: {symptoms_str}.")
            actions.append("Sit down in a comfortable area, drink water, and rest.")

        # Non-linear Compound Score Formula
        raw_score = (
            glucose_risk * 0.35 +
            medication_risk * 0.30 +
            meal_risk * 0.15 +
            activity_risk * 0.10 +
            symptom_risk * 0.10
        )

        # Compounding interactions
        if telemetry.critical_medication_missed and (telemetry.latest_glucose or 0) > baseline.post_prandial_max:
            raw_score *= 1.35
        if len(telemetry.reported_symptoms) > 0 and (glucose_risk > 50 or medication_risk > 50):
            raw_score *= 1.25

        final_score = min(100, int(round(raw_score)))

        # Triage determination
        if final_score >= 68 or (telemetry.latest_glucose and telemetry.latest_glucose < 70) or (len(telemetry.reported_symptoms) > 0 and final_score >= 50):
            status = "HIGH_RISK"
            caregiver_alert = True
        elif final_score >= 35:
            status = "ATTENTION"
            caregiver_alert = False  # Prevents alert fatigue for mild isolated deviations
        else:
            status = "STABLE"
            caregiver_alert = False

        if status == "STABLE":
            why_bullets.append("Daily glucose, medications, meals, and steps closely match your personalized baseline.")
            actions.append("Maintain good hydration and continue your normal daily routine.")

        alert_reason = f"Compound multi-factor risk detected: {' '.join(why_bullets[:2])}" if caregiver_alert else None

        return RiskEvaluationResult(
            status=status,
            compound_risk_score=final_score,
            why_explanation=why_bullets,
            recommended_actions=actions,
            caregiver_escalation_required=caregiver_alert,
            caregiver_alert_reason=alert_reason,
            factor_breakdown={
                "glucose": glucose_risk,
                "medication": medication_risk,
                "meals": meal_risk,
                "activity": activity_risk,
                "symptoms": symptom_risk
            }
        )

if __name__ == "__main__":
    # Test execution
    aai_baseline = PersonalBaseline(
        patient_id="aai-01",
        patient_name="Mrs. Anusuya Deshmukh",
        age=72,
        diabetes_type="Type 2",
        fasting_min=105, fasting_max=135, fasting_avg=118,
        post_prandial_min=130, post_prandial_max=160, post_prandial_avg=145,
        typical_breakfast_time="08:30",
        typical_dinner_time="20:00",
        baseline_daily_steps=3500
    )

    sample_day = DailyTelemetry(
        latest_glucose=218.0,
        glucose_context="POST_BREAKFAST",
        medications_scheduled=3,
        medications_taken=1,
        critical_medication_missed=True,
        meal_delayed_minutes=90,
        meal_skipped=False,
        steps_today=420,
        reported_symptoms=["Dizziness"]
    )

    result = SugarSenseRiskEngine.evaluate(aai_baseline, sample_day)
    print("Status:", result.status)
    print("Risk Score:", result.compound_risk_score)
    print("Caregiver Alert:", result.caregiver_escalation_required)
    print("Why Rationale:", result.why_explanation)
