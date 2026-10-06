# 🩺 SugarSense AI — Enterprise Monorepo Architecture

> **AI-Powered Senior Diabetes Companion & Silent Caregiver Safety Net**  
> Built for eldercare in India with culturally grounded meal guidance, multilingual voice intelligence (Marathi, Hindi, English), and personalized EWMA baseline anomaly detection.

---

## 🏗️ Monorepo Architecture Overview

```text
MIT_Hackethon/
├── frontend/                     # React + Vite + TypeScript + Tailwind Client
│   ├── public/                   # Static assets, icons, manifest
│   ├── src/
│   │   ├── components/           # UI Views, Dashboards, Modals, Bento Cards
│   │   │   ├── ui/               # Core primitives (button, badge, input, card)
│   │   │   ├── LandingView.tsx   # Interactive 3D Companion Hero & Landing
│   │   │   ├── SeniorView.tsx    # Senior Citizen Companion & Daily Loggers
│   │   │   ├── CaregiverView.tsx # Silent Caregiver Safety Net & Alerts
│   │   │   ├── DoctorDashboard.tsx # 14-Day TIR & EHR Visit Summary
│   │   │   ├── AdminDashboard.tsx# User Registry, Live DB Stream & Broadcasts
│   │   │   ├── AssistantView.tsx # Multi-Turn Multilingual AI Assistant
│   │   │   ├── RemindersView.tsx # Daily Medication & Glucose Reminders
│   │   │   ├── LifestyleView.tsx # Hydration & Sleep Tracking
│   │   │   ├── AnalyticsView.tsx # 14-Day Trends & LBGI/HBGI Analytics
│   │   │   ├── InsightsView.tsx  # Counterfactual Interventions & What-To-Do
│   │   │   ├── HistoryLogView.tsx# Telemetry History & CSV Exporter
│   │   │   ├── PrivacyView.tsx   # Supabase RLS & RBAC Security Matrix
│   │   │   ├── SettingsView.tsx  # Baseline Calibration & Accessibility
│   │   │   ├── TopHeader.tsx     # Global Header & Scenario Simulator
│   │   │   ├── Sidebar.tsx       # Primary Application Navigation
│   │   │   ├── AuthModal.tsx     # Supabase Auth & Role Selector
│   │   │   └── ...
│   │   ├── engine/               # Client AI & Baseline Engines
│   │   │   ├── PersonalBaselineEngine.ts # EWMA Learned Corridor Math
│   │   │   ├── IndianFoodAI.ts   # ICMR Indian Food Database
│   │   │   └── VoiceEngine.ts    # Multilingual Speech Synthesis
│   │   ├── hooks/                # Custom React Hooks
│   │   │   └── useSpeechRecognition.ts # Web Speech API (mr-IN, hi-IN, en-IN)
│   │   ├── lib/                  # Library instances & helpers
│   │   │   ├── supabase.ts       # Supabase Client, Auth & Realtime Services
│   │   │   └── utils.ts          # Classname & styling utilities
│   │   ├── services/             # API & Real-time Database Services
│   │   │   ├── api.ts            # Python FastAPI Client
│   │   │   └── dataService.ts    # Offline Fallbacks
│   │   ├── types/                # TypeScript Interfaces & Enums
│   │   │   └── index.ts          # Central Type Definitions
│   │   ├── data/                 # Fallback calibration profiles & initial states
│   │   │   └── mockProfiles.ts   # Senior Baseline Profiles
│   │   ├── App.tsx               # Main Application Orchestrator & Router
│   │   ├── main.tsx              # React Entrypoint
│   │   └── index.css             # Tailwind & Luxury Animations
│   ├── index.html                # HTML Entrypoint
│   ├── package.json              # Frontend Dependencies
│   ├── tsconfig.json             # TypeScript Compiler Options & Aliases
│   ├── tsconfig.node.json        # Node TypeScript Config
│   ├── vite.config.ts            # Vite Configuration & Dev Server
│   ├── tailwind.config.js        # Tailwind Theme & Bioluminescent Palette
│   ├── postcss.config.js         # PostCSS Plugins
│   └── .env.example              # Frontend Environment Template
│
├── backend/                      # Python FastAPI Analytical & AI Microservice
│   ├── config.py                 # Pydantic Settings & Environment Variables
│   ├── main.py                   # FastAPI Application & API Routes
│   ├── models.py                 # Pydantic Request/Response Schemas
│   ├── analytics_engine.py       # NumPy/SciPy Compound Risk & Glycemic Analytics
│   ├── groq_service.py           # Groq Llama-3.3 LLM Multilingual AI Engine
│   ├── supabase_service.py       # Supabase PostgreSQL Service Connector
│   ├── requirements.txt          # Python Dependencies
│   └── Dockerfile                # Production Container Definition
│
├── database/                     # Supabase & PostgreSQL Schema Migrations
│   ├── schema.sql                # Complete Table Definitions, Constraints & Triggers
│   ├── policies.sql              # Row Level Security (RLS) Policies
│   ├── seed.sql                  # Initial Calibration & Demo Data
│   └── README.md                 # Database Setup & Supabase Migration Guide
│
├── .gitignore                    # Git Ignore Rules
├── .env.example                  # Consolidated Environment Template
├── package.json                  # Root Monorepo Scripts
└── README.md                     # Project Documentation
```

---

## ⚡ Quick Start & Development

### 1. Prerequisites
- **Node.js**: v18.0+
- **Python**: v3.10+
- **npm**: v9.0+

### 2. Install Dependencies

```bash
# Install frontend packages
npm --prefix frontend install

# Set up Python backend virtual environment
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your API keys (optional — the app runs gracefully with offline engines):
- `GROQ_API_KEY`: Groq Cloud API Key for Llama-3.3 inference
- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`: Supabase Project credentials

### 4. Run Development Servers

Run frontend and backend simultaneously or independently:

```bash
# Start Frontend Dev Server (http://localhost:3000)
npm run frontend:dev

# Start Backend API Server (http://localhost:8000)
npm run backend:dev
```

---

## 🗄️ Database Setup (Supabase PostgreSQL)

Execute the migration scripts in the **[Supabase SQL Editor](https://supabase.com/dashboard)**:

1. **Table Schema**: Run [`database/schema.sql`](database/schema.sql)
2. **Security Policies (RLS)**: Run [`database/policies.sql`](database/policies.sql)
3. **Demo Seed Data**: Run [`database/seed.sql`](database/seed.sql)

---

## 🌐 Endpoints & Ports

| Service | Port / URL | Description |
| :--- | :--- | :--- |
| **Frontend Web App** | `http://localhost:3000/` | React 18 SPA + Motion UI + Tailwind |
| **Backend API Docs** | `http://localhost:8000/docs` | FastAPI Interactive Swagger UI |
| **Backend Health** | `http://localhost:8000/api/health` | Service & ML Engine Status Check |
| **Supabase PostgreSQL** | `https://*.supabase.co` | Remote PostgreSQL Database & Auth |

---

## 📦 Building for Production

```bash
# Compile TypeScript & bundle frontend
npm run frontend:build
```
