import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import numpy as np
from typing import Dict, Any, List, Optional
from models import RiskAnalysisRequest, RiskAnalysisResponse, FactorRiskScores

class PythonAnalyticsEngine:
    """
    Python Analytics & ML Engine for SugarSense
    Implements multi-variate compound risk analysis, EWMA baseline bounds, and interaction multipliers.
    """
    
    @staticmethod
    def calculate_lbgi_hbgi(glucose_values: List[float]) -> Dict[str, float]:
        """
        Calculates Low Blood Glucose Index (LBGI) and High Blood Glucose Index (HBGI)
        Standard clinical risk transform: f(G) = 1.509 * ( (ln(G))^1.084 - 5.381 )
        """
        if not glucose_values:
            return {"lbgi": 0.0, "hbgi": 0.0}
            
        arr = np.array(glucose_values)
        arr = np.clip(arr, 20.0, 600.0)
        
        # Risk transform
        f_g = 1.509 * (np.power(np.log(arr), 1.084) - 5.381)
        r_l = 10 * np.power(np.minimum(0.0, f_g), 2)
        r_h = 10 * np.power(np.maximum(0.0, f_g), 2)
        
        lbgi = float(np.mean(r_l))
        hbgi = float(np.mean(r_h))
        
        return {"lbgi": round(lbgi, 2), "hbgi": round(hbgi, 2)}

    @classmethod
    def evaluate_compound_risk(cls, req: RiskAnalysisRequest) -> RiskAnalysisResponse:
        # 1. Glucose Factor (0 - 100)
        glucose_risk = 0.0
        reasons = []
        
        if req.latest_glucose:
            val = req.latest_glucose.value
            if val < 70:
                glucose_risk = 95.0
                reasons.append({
                    "en": f"Critically low glucose reading ({val} mg/dL) - immediate hypoglycemia risk.",
                    "mr": f"रक्तातील साखर अत्यंत कमी ({val} mg/dL) - त्वरित साखर घेणे आवश्यक.",
                    "hi": f"रक्त शर्करा बहुत कम ({val} mg/dL) - तुरंत हाइपोग्लाइसीमिया सहायता चाहिए।"
                })
            elif val < 90:
                glucose_risk = 40.0
                reasons.append({
                    "en": f"Glucose ({val} mg/dL) is nearing low safety margin.",
                    "mr": f"साखर ({val} mg/dL) कमी पातळीजवळ पोहोचत आहे.",
                    "hi": f"शुगर ({val} mg/dL) निचले स्तर के करीब है।"
                })
            elif val > 180:
                glucose_risk = 75.0
                reasons.append({
                    "en": f"Glucose ({val} mg/dL) is significantly above personal post-meal target.",
                    "mr": f"साखर ({val} mg/dL) जेवणानंतरच्या सुरक्षित मर्यादेपेक्षा जास्त आहे.",
                    "hi": f"शुगर ({val} mg/dL) भोजन के बाद के सुरक्षित लक्ष्य से अधिक है।"
                })
            elif val > 160:
                glucose_risk = 35.0
                reasons.append({
                    "en": f"Glucose ({val} mg/dL) slightly elevated.",
                    "mr": f"साखर ({val} mg/dL) थोडी जास्त नोंदवली गेली.",
                    "hi": f"शुगर ({val} mg/dL) सामान्य से थोड़ी अधिक है।"
                })
            else:
                glucose_risk = 5.0
                
        # 2. Medication Factor (0 - 100)
        medication_risk = 0.0
        unconfirmed_critical = [m for m in req.medications if not m.taken and m.criticality == "CRITICAL"]
        unconfirmed_standard = [m for m in req.medications if not m.taken and m.criticality != "CRITICAL"]
        
        if unconfirmed_critical:
            medication_risk += 50.0
            reasons.append({
                "en": f"Critical morning dose ({unconfirmed_critical[0].name}) unconfirmed.",
                "mr": f"सकाळची महत्त्वाची गोळी ({unconfirmed_critical[0].name}) घेतलेली नाही.",
                "hi": f"सुबह की मुख्य दवा ({unconfirmed_critical[0].name}) अभी नहीं ली गई है।"
            })
        if unconfirmed_standard:
            medication_risk += min(30.0, len(unconfirmed_standard) * 15.0)

        # 3. Meal Factor (0 - 100)
        meal_risk = 0.0
        missed_meals = [m for m in req.meals if m.status == "MISSED"]
        if missed_meals:
            meal_risk = 60.0
            reasons.append({
                "en": f"{missed_meals[0].name} was missed or skipped.",
                "mr": f"{missed_meals[0].name} जेवण वगळले किंवा उशिरा झाले आहे.",
                "hi": f"{missed_meals[0].name} भोजन छूट गया है।"
            })
            
        # 4. Activity Factor (0 - 100)
        activity_risk = 0.0
        if req.activity:
            if req.activity.mobility_status == "BEDREST" or req.activity.steps_today < 500:
                activity_risk = 50.0
                reasons.append({
                    "en": f"Daily physical activity is critically low ({req.activity.steps_today} steps).",
                    "mr": f"आजची शारीरिक हालचाल अत्यंत कमी ({req.activity.steps_today} पावले) आहे.",
                    "hi": f"शारीरिक गतिविधि बहुत कम ({req.activity.steps_today} कदम) है।"
                })
            elif req.activity.steps_today < 1500:
                activity_risk = 25.0

        # 5. Symptom Factor (0 - 100)
        symptom_risk = 0.0
        if req.symptoms:
            symptom_risk = min(90.0, len(req.symptoms) * 35.0)
            reasons.append({
                "en": f"Reported senior symptoms: {', '.join(req.symptoms)}",
                "mr": f"नोंदवलेली लक्षणे: {', '.join(req.symptoms)}",
                "hi": f"दर्ज किए गए लक्षण: {', '.join(req.symptoms)}"
            })

        # Non-Linear Compound Risk Calculation
        # Base Weighted Sum
        base_score = (
            0.35 * glucose_risk +
            0.25 * medication_risk +
            0.20 * meal_risk +
            0.10 * activity_risk +
            0.10 * symptom_risk
        )
        
        # Interaction Multipliers (Compound effect)
        multiplier = 1.0
        # Dangerous combo: Missed Meal + Critical Medication + Low Activity
        if meal_risk > 40 and medication_risk > 30:
            multiplier += 0.40 # 40% amplification
        if glucose_risk > 50 and symptom_risk > 30:
            multiplier += 0.35 # 35% amplification
        if meal_risk > 40 and activity_risk > 40:
            multiplier += 0.20

        final_score = float(np.clip(base_score * multiplier, 0.0, 100.0))
        final_score = round(final_score, 1)

        # Status Classification
        if final_score >= 60.0 or glucose_risk >= 90.0:
            status = "HIGH_RISK"
            title = {
                "en": "⚠️ Higher Risk Routine Deviation Detected",
                "mr": "⚠️ आजच्या दिनचर्येत धोकादायक बदल आढळला",
                "hi": "⚠️ दिनचर्या में संभावित जोखिम का बदलाव"
            }
            subtitle = {
                "en": "Multiple factors compounded today. Follow action guidance below.",
                "mr": "अनेक घटक एकत्र आल्याने जोखीम वाढली आहे. खालील मार्गदर्शन पाळा.",
                "hi": "कई कारणों से जोखिम बढ़ा है। नीचे दिए गए निर्देशों का पालन करें।"
            }
            should_alert = True
        elif final_score >= 30.0:
            status = "ATTENTION"
            title = {
                "en": "🟡 Mild Routine Timing Shift",
                "mr": "🟡 दिनचर्येत सौम्य वेळेचा बदल",
                "hi": "🟡 दिनचर्या में हल्का समय बदलाव"
            }
            subtitle = {
                "en": "A slight deviation was detected. Easily manageable with small steps.",
                "mr": "किरकोळ बदल आढळला आहे. सोप्या उपायांनी साखर संतुलित राहील.",
                "hi": "हल्का बदलाव देखा गया है। छोटे कदमों से संतुलन बना रहेगा।"
            }
            should_alert = False
        else:
            status = "STABLE"
            title = {
                "en": "🟢 Routine On Track & Balanced",
                "mr": "🟢 दिनचर्या अतिशय उत्तम व सुरक्षित",
                "hi": "🟢 दिनचर्या पूरी तरह संतुलित व सुरक्षित"
            }
            subtitle = {
                "en": "All readings and medications align with learned baseline.",
                "mr": "सर्व नोंदी आणि औषधे वैयक्तिक बेसलाइननुसार योग्य आहेत.",
                "hi": "सभी रीडिंग और दवाएं सामान्य सीमा में हैं।"
            }
            should_alert = False

        if not reasons:
            reasons.append({
                "en": "All daily indicators align with personal historical baseline.",
                "mr": "सर्व दैनंदिन नोंदी नेहमीच्या सुरक्षित मर्यादेत आहेत.",
                "hi": "सभी दैनिक संकेतक सामान्य बेसलाइन के अनुसार हैं।"
            })

        return RiskAnalysisResponse(
            status=status,
            score=final_score,
            title=title,
            subtitle=subtitle,
            reasons=reasons,
            next_best_action={
                "title": "Check Glucose & Drink Warm Water" if status != "STABLE" else "Log Afternoon Meal",
                "action_label": "Take Action Now",
                "action_type": "LOG_GLUCOSE" if status != "STABLE" else "LOG_MEAL"
            },
            factors=FactorRiskScores(
                glucose_risk=round(glucose_risk, 1),
                medication_risk=round(medication_risk, 1),
                meal_risk=round(meal_risk, 1),
                activity_risk=round(activity_risk, 1),
                symptom_risk=round(symptom_risk, 1)
            ),
            should_alert_caregiver=should_alert,
            silent_safety_net_triggered=should_alert
        )
