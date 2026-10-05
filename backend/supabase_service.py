import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from typing import List, Dict, Any, Optional
from datetime import datetime
from config import settings
from models import TelemetryLogEntry

class SupabaseDatabaseService:
    """
    Supabase PostgreSQL Service for SugarSense
    Manages telemetry records, caregiver alerts, and user profiles.
    """
    
    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_KEY
        self.client = None
        self._local_telemetry: List[Dict[str, Any]] = []
        self._local_alerts: List[Dict[str, Any]] = []
        
        if self.url and self.key and not self.url.startswith("https://xyzcompany"):
            try:
                from supabase import create_client
                self.client = create_client(self.url, self.key)
                print("Connected to Supabase PostgreSQL database successfully.")
            except Exception as e:
                print(f"Warning: Could not connect to Supabase: {e}")

    def log_telemetry(self, entry: TelemetryLogEntry) -> Dict[str, Any]:
        data = {
            "id": entry.id or f"evt-{int(datetime.now().timestamp()*1000)}",
            "patient_id": entry.patient_id,
            "category": entry.category,
            "title": entry.title,
            "detail": entry.detail,
            "value": entry.value,
            "status_tag": entry.status_tag,
            "source": entry.source,
            "created_at": entry.timestamp or datetime.now().isoformat()
        }
        
        if self.client:
            try:
                res = self.client.table("telemetry_readings").insert(data).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"Supabase write error: {e}. Storing locally.")
                
        self._local_telemetry.insert(0, data)
        return data

    def get_recent_telemetry(self, patient_id: str = "patient-aai-101", limit: int = 20) -> List[Dict[str, Any]]:
        if self.client:
            try:
                res = (
                    self.client.table("telemetry_readings")
                    .select("*")
                    .eq("patient_id", patient_id)
                    .order("created_at", desc=True)
                    .limit(limit)
                    .execute()
                )
                if res.data:
                    return res.data
            except Exception as e:
                print(f"Supabase read error: {e}. Reading from local memory.")
                
        return self._local_telemetry[:limit]

    def log_caregiver_alert(self, alert_data: Dict[str, Any]) -> Dict[str, Any]:
        if self.client:
            try:
                res = self.client.table("caregiver_alerts").insert(alert_data).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"Supabase alert log error: {e}")
                
        self._local_alerts.insert(0, alert_data)
        return alert_data

db_service = SupabaseDatabaseService()
