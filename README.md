# 🩸 SugarSense — AI-Powered Elderly Diabetes Companion

> **"Don't just track diabetes. Predict when a senior citizen is likely to have a problem and make the next action extremely simple."**

SugarSense learns each senior's personal baseline routine, detects compounded multi-factor deviations across glucose, medication, meals, and mobility, explains *why* the deviation matters in plain language, and intelligently escalates only when caregiver attention is genuinely needed.

---

## 🌟 Key Features

1. **Personal Baseline AI**:
   - Learns what is NORMAL for each senior citizen rather than relying on generic population averages.
   - 14-day rolling corridor with EWMA and IQR outlier dampening.
2. **Multi-Factor Routine Deviation Engine**:
   - Non-linear compounding algorithm combining Glucose Delta + Missed Critical Meds + Meal Delays + Activity Deficit + Reported Symptoms.
3. **Explainable AI ("Why?" Button)**:
   - 1-Click transparent explanation of why the status is 🟢 Stable, 🟡 Attention, or 🔴 Caregiver Escalated.
4. **Elderly-First Experience ("Aai / Dadi Mode")**:
   - High contrast, 4 large glanceable cards, Marathi (मराठी), Hindi (हिंदी), and English.
   - Native Web Speech API voice interaction + 1-tap demo voice chips.
   - **Indian Food AI**: Recognizes Poha, Bhakri, Khichdi, Roti-Sabzi, Idli, Chai, Mithai with food sequencing guidance.
5. **Caregiver "Silent Safety Net"**:
   - Zero alert fatigue — filters single-event noise and only pings family on multi-factor compound risk.
   - 1-Click WhatsApp & Phone check-in.
6. **Doctor Visit-Ready Dashboard**:
   - 14-Day Time-in-Range (TIR) gauge based on personal baseline.
   - SVG baseline corridor trend chart.
   - 1-Click exportable AI Physician Visit Note.

---

## 🚀 Quick Start

### 1. Run the Web Application
```bash
# In project root
npm run dev
```
Open `http://localhost:3000` in your browser.

### 2. Run the Python Risk Engine
```bash
python3 backend/risk_engine.py
```

### 3. Build for Production
```bash
npm run build
```

---

## 🧪 Hackathon Demo Controls
The top bar includes a live **Scenario Switcher** to demonstrate all edge cases live to judges:
- 🟢 **Normal Baseline**: Balanced routine, green status.
- 🟡 **Routine Shift**: Late breakfast + missed morning walk.
- 🔴 **Compound Risk**: Missed Glimepiride + late breakfast + sugar 218 + dizziness $\rightarrow$ Caregiver escalation triggered.
- 🟣 **Hypo Vulnerability**: Medicine taken on time + skipped meal $\rightarrow$ sugar 64 $\rightarrow$ Emergency 15g carb guidance.
- 🌐 **Language Switcher**: Toggle between **मराठी**, **हिंदी**, and **English**.
- 👤 **Role Switcher**: Toggle between **Senior Mode**, **Caregiver Safety Net**, and **Doctor Dashboard**.
