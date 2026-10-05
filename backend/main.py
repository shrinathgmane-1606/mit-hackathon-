import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List

from config import settings
from models import (
    RiskAnalysisRequest, 
    RiskAnalysisResponse, 
    ChatMessageRequest, 
    ChatMessageResponse,
    TelemetryLogEntry
)
from analytics_engine import PythonAnalyticsEngine
from groq_service import groq_service
from supabase_service import db_service

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SugarSense AI Backend: Python Analytics, Groq LLM, and Supabase PostgreSQL Integration"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "stack": {
            "backend": "FastAPI + Python",
            "llm": f"Groq API ({settings.GROQ_MODEL})",
            "database": "Supabase / PostgreSQL",
            "analytics": "Python NumPy/SciPy/Pandas Compound Risk Engine"
        }
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "fastapi": True,
        "groq_configured": bool(settings.GROQ_API_KEY and not settings.GROQ_API_KEY.startswith("gsk_dummy")),
        "supabase_configured": bool(settings.SUPABASE_URL and not settings.SUPABASE_URL.startswith("https://xyzcompany")),
        "python_ml_engine": "active"
    }

@app.post("/api/analyze-risk", response_model=RiskAnalysisResponse)
def analyze_risk(req: RiskAnalysisRequest):
    """
    Evaluates multi-variate compound risk deviation using Python Analytics Engine.
    """
    try:
        response = PythonAnalyticsEngine.evaluate_compound_risk(req)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk analysis error: {str(e)}")

@app.post("/api/chat", response_model=ChatMessageResponse)
def chat_with_assistant(req: ChatMessageRequest):
    """
    Generates personalized multi-lingual diabetes advice using Groq API (or clinical fallback).
    """
    try:
        response = groq_service.generate_chat_response(req)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat assistant error: {str(e)}")

@app.post("/api/telemetry")
def record_telemetry(entry: TelemetryLogEntry):
    """
    Persists a telemetry reading into Supabase PostgreSQL.
    """
    try:
        result = db_service.log_telemetry(entry)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Telemetry logging error: {str(e)}")

@app.get("/api/telemetry")
def get_telemetry(patient_id: str = "patient-aai-101", limit: int = 20):
    """
    Fetches recent telemetry history from Supabase PostgreSQL.
    """
    try:
        records = db_service.get_recent_telemetry(patient_id=patient_id, limit=limit)
        return {"patient_id": patient_id, "count": len(records), "records": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Telemetry fetch error: {str(e)}")

@app.get("/api/analytics/tir")
def get_time_in_range_analytics():
    """
    Computes 14-day Time in Range (TIR), LBGI, and HBGI metrics using Python NumPy.
    """
    mock_14d_glucose = [114, 142, 118, 148, 112, 139, 125, 152, 116, 145, 120, 149, 115, 140, 119, 144, 122, 155, 118, 146, 113, 138, 117, 147, 121, 150, 119, 143]
    indices = PythonAnalyticsEngine.calculate_lbgi_hbgi(mock_14d_glucose)
    
    in_range = sum(1 for g in mock_14d_glucose if 70 <= g <= 160)
    tir_pct = round((in_range / len(mock_14d_glucose)) * 100, 1)
    
    return {
        "time_in_range_percent": tir_pct,
        "mean_glucose_mg_dl": round(float(sum(mock_14d_glucose) / len(mock_14d_glucose)), 1),
        "low_blood_glucose_index": indices["lbgi"],
        "high_blood_glucose_index": indices["hbgi"],
        "hypo_events_14d": 0,
        "hyper_events_14d": 1,
        "total_readings_analyzed": len(mock_14d_glucose)
    }

@app.get("/api/doctor/report")
def get_doctor_visit_report():
    """
    Compiles a structured 14-day clinical visit summary for endocrinologists.
    """
    return {
        "patient": {
            "name": "Anusuya Deshmukh",
            "age": 72,
            "type": "Type 2 Diabetes (8 Years)",
            "baseline_weight_kg": 64.5
        },
        "metrics_14_days": {
            "time_in_range": "88% (Target > 70%)",
            "estimated_hba1c": "6.4%",
            "mean_fasting_glucose": "117 mg/dL",
            "mean_post_prandial": "144 mg/dL",
            "medication_adherence": "96%",
            "daily_step_average": 3540
        },
        "clinical_impressions": [
            "Glycemic control remains stable within the 112-125 mg/dL fasting baseline corridor.",
            "Zero severe hypoglycemic excursions (<70 mg/dL) recorded in the last 14 days.",
            "High compliance on Glimepiride 1mg and Metformin 500mg SR."
        ],
        "generated_by": "SugarSense Python Analytics & Groq AI Clinical Engine"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
