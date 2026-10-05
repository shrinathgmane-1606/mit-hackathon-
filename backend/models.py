from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class GlucoseInput(BaseModel):
    value: float = Field(..., description="Glucose value in mg/dL")
    context: str = Field("RANDOM", description="FASTING, POST_BREAKFAST, POST_LUNCH, POST_DINNER, RANDOM")
    timestamp: Optional[str] = None

class MedicationItem(BaseModel):
    id: str
    name: str
    dosage: str
    taken: bool
    scheduled_time: str
    criticality: str = "STANDARD"

class MealItem(BaseModel):
    id: str
    name: str
    status: str = "DUE" # DUE, LOGGED, MISSED
    food_items: List[str] = []

class ActivityInput(BaseModel):
    steps_today: int = 0
    step_target: int = 3500
    walk_minutes_today: int = 0
    mobility_status: str = "NORMAL"

class RiskAnalysisRequest(BaseModel):
    patient_id: str = "patient-aai-101"
    age: int = 72
    diabetes_type: str = "Type 2"
    latest_glucose: Optional[GlucoseInput] = None
    medications: List[MedicationItem] = []
    meals: List[MealItem] = []
    activity: Optional[ActivityInput] = None
    symptoms: List[str] = []
    weight_kg: Optional[float] = 64.4

class FactorRiskScores(BaseModel):
    glucose_risk: float
    medication_risk: float
    meal_risk: float
    activity_risk: float
    symptom_risk: float

class RiskAnalysisResponse(BaseModel):
    status: str # STABLE, ATTENTION, HIGH_RISK
    score: float # 0 - 100
    title: Dict[str, str]
    subtitle: Dict[str, str]
    reasons: List[Dict[str, str]]
    next_best_action: Dict[str, Any]
    factors: FactorRiskScores
    should_alert_caregiver: bool
    silent_safety_net_triggered: bool

class ChatMessageRequest(BaseModel):
    query: str
    language: str = "en" # en, mr, hi
    patient_id: str = "patient-aai-101"
    context: Optional[Dict[str, Any]] = None

class ChatMessageResponse(BaseModel):
    reply: str
    model_used: str
    grounded_sources: List[str]
    suggested_followups: List[str]

class TelemetryLogEntry(BaseModel):
    id: Optional[str] = None
    patient_id: str = "patient-aai-101"
    category: str # GLUCOSE, MEDICATION, MEAL, ACTIVITY, WEIGHT, SYMPTOM
    title: str
    detail: str
    value: Optional[str] = None
    status_tag: str = "NORMAL" # NORMAL, ATTENTION, ALERT, CONFIRMED
    source: str = "MANUAL" # MANUAL, VOICE, SENSOR
    timestamp: Optional[str] = None
