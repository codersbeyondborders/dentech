# Dentech — Bio-Responsive Dental Interventions Powered by Gemma 4

> **Real-time, context-aware biometric monitoring that synchronizes patient stress detection with automated, AI-driven environmental interventions across multiple devices — fully offline.**

Dentech tackles one of the most overlooked challenges in dentistry: **patient anxiety**. By fusing live biometric data, in-browser computer vision, and on-device Gemma 4 inference, it monitors patient stress and automatically triggers personalized visual and audio interventions — before distress escalates into an interrupted procedure.

---

## Why It Matters

Children with Autism Spectrum Disorder (ASD) are a particularly underserved population in dentistry:

- **68%** exhibit elevated dental anxiety
- Treatment success climbs from **20% → 68%** in a sensory-adapted environment
- **30%** require general anaesthesia even for routine cleaning

The same gap applies to millions of broader anxious patients globally. Dentech's **Curb-Cut Effect** means that solving for the most extreme case benefits everyone. And because it runs entirely offline on commodity hardware, it's deployable in LMIC clinics with limited connectivity.

---

## Key Features

### 🧠 Gemma 4 Clinical Intelligence
- **Context-Aware Medical RAG** — patient medical history is injected as context into every Gemma 4 inference call. The model cross-references live anomalies (e.g. a sudden HR spike) against a specific patient's history ("currently on Beta-blockers") to produce clinically grounded assessments.
- **Structured JSON Function Calls** — Gemma 4 outputs deterministic `triggerBreathingExercise`, `changeAmbientLighting`, and `playSoothingAudio` calls. The Patient View automatically interprets these to escalate its visual state with zero manual intervention.
- **Real-time SSE Streaming** — the dashboard streams Gemma's reasoning token-by-token via Server-Sent Events, giving the dentist a live "thinking" view before the final assessment is committed.

### 💓 Biometric Monitoring
- **Web Bluetooth** streams real-time heart rate from paired wearables directly in the browser — no drivers, no native code.
- **MediaPipe Face Landmarker** runs in-browser via WebGL to detect facial expressions (Neutral / Frowning / Panic) and body movement (Stable / Tense / Erratic) without sending any video over the network.
- **Anomaly detection** at the edge: only significant threshold crossings are routed to the backend for Gemma 4 analysis, eliminating redundant inference cycles.

### 🌍 Demographic-Aware Localization
The Patient View adapts dynamically to the profile entered at intake:

| Profile | Language | Age Group | UI Mode |
|---------|----------|-----------|---------|
| John Doe | English | Adult | Calm, clinical copy |
| Aarav Patel | Hindi | Child (≤12) | Playful Hindi + English mix |
| Maria Garcia | Spanish | Senior (72) | Calm Spanish copy |

Language and age automatically resolve to the correct copy. The Dentist Hub re-syncs the patient profile to the backend every **5 seconds**, so the Patient Screen always recovers the correct context — even if it connected late or the backend restarted.

### 🎨 Bio-Responsive Patient View
- **Background pulse** synchronized to heart rate: `animationDuration = 240 / HR` seconds
- **Stress tiers**: Normal → Medium → Extreme, each with distinct color palettes, animations, and copy
- **Guided breathing circle** in Extreme mode: full-screen 4–3–4 inhale/hold/exhale cycle with phase labels in the patient's native language
- **Procedure progress bar** with localized labels

### 📡 Dual-Device Real-Time State Sync
- Dentist laptop (hub) and patient tablet communicate exclusively through the FastAPI `/api/state` endpoint over a local Wi-Fi hotspot — **no internet required**
- Case changes (Normal → Medium → Extreme) propagate to the patient screen within ~1 second
- Manual override buttons on both devices for demo flexibility

---

## Architecture

```
┌─────────────────────────────┐     Wi-Fi Hotspot      ┌──────────────────────────────┐
│       DENTIST HUB           │ ◄──── /api/state ─────► │      PATIENT SCREEN          │
│                             │                          │                              │
│  ┌─────────────────────┐    │                          │  ┌────────────────────────┐  │
│  │  Dentist Dashboard  │    │                          │  │     Patient View       │  │
│  │  (React 19 + Vite)  │    │                          │  │  (React 19 + Vite)     │  │
│  └──────┬──────────────┘    │                          │  └──────┬─────────────────┘  │
│         │ anomaly trigger    │                          │         │ 1s polling          │
│  ┌──────▼──────────────┐    │                          │  ┌──────▼─────────────────┐  │
│  │  FastAPI Backend    │    │                          │  │  Web Bluetooth         │  │
│  │  + Gemma 4 E2B      │    │                          │  │  MediaPipe Vision      │  │
│  │  (llama-cpp-python) │    │                          │  └────────────────────────┘  │
│  └─────────────────────┘    │                          │                              │
└─────────────────────────────┘                          └──────────────────────────────┘
         Tauri Sidecar                                          Tauri App
```

Both devices run the **same Tauri `.app` / `.dmg`** — the user selects their role (Hub or Patient Screen) on first launch.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop Shell | Tauri 2 (Rust) |
| Frontend | React 19 + TypeScript, Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM v7 |
| Computer Vision | Google MediaPipe (`@mediapipe/tasks-vision`) |
| Hardware | Web Bluetooth API |
| Data Visualization | Recharts |
| Backend | Python, FastAPI, Uvicorn |
| AI Inference | Gemma 4 E2B Q4_K_M (`llama-cpp-python`, `huggingface-hub`) |

---

## Project Structure

```
dentech/
├── frontend/               # Tauri + React app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Registration.tsx    # Role selection (Hub / Patient Screen)
│   │   │   ├── PatientIntake.tsx   # Clinical intake form + presets
│   │   │   ├── DentistDashboard.tsx
│   │   │   ├── PatientView.tsx
│   │   │   └── PatientConnect.tsx  # Hub IP entry for remote client
│   │   ├── hooks/
│   │   │   ├── useDemoSync.ts      # Shared case state (normal/medium/extreme)
│   │   │   ├── useComputerVision.ts
│   │   │   └── useGemmaAnalysis.ts # SSE streaming hook
│   │   └── contexts/
│   │       └── BiometricsContext.tsx
│   └── src-tauri/
│       ├── tauri.conf.json
│       ├── src/lib.rs              # Sidecar spawn logic
│       └── bin/
│           └── backend-x86_64-apple-darwin  # Pre-compiled Python backend
├── backend/
│   ├── main.py             # FastAPI + Gemma 4 inference
│   └── requirements.txt
└── README.md
```

---

## Getting Started

### Prerequisites
- [Rust + Cargo](https://rustup.rs/) (`stable`, `x86_64-apple-darwin`)
- [Node.js](https://nodejs.org/) ≥ 20
- Python ≥ 3.10 (for standalone backend dev only)

### Running in Development

**1. Install frontend dependencies**
```bash
cd frontend
npm install
```

**2. Start the Tauri dev server** (launches browser UI + native shell)
```bash
cd frontend
npx tauri dev
```

**3. Run the backend independently** (for web-only dev / API testing)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

> On first run, the backend will automatically download the `gemma-4-E2B-it-Q4_K_M.gguf` model (~2.5 GB) from Hugging Face. Subsequent runs use the local cache.

### Building the Distributable DMG

```bash
cd frontend
npx tauri build --target x86_64-apple-darwin
```

Output bundles:
- `src-tauri/target/x86_64-apple-darwin/release/bundle/macos/dentech.app`
- `src-tauri/target/x86_64-apple-darwin/release/bundle/dmg/dentech_0.1.0_x64.dmg`

---

## Demo Setup (Two Devices)

1. **Network** — Enable Mobile Hotspot on the dentist's laptop. Connect the patient tablet to it.
2. **Hub** — Open Dentech on the laptop → select **Main Hub** → note the local IP (e.g. `192.168.x.x`).
3. **Patient Screen** — Open Dentech on the tablet → select **Patient Screen** → enter the Hub IP.
4. **Intake** — On the Hub, fill in patient details or click a quick-load preset (John Doe / Aarav Patel / Maria Garcia).
5. **Monitor** — The Patient View auto-updates language, age-appropriate copy, and stress visuals within ~1 second of any change on the Hub.

---

## Demo Presets

| Preset | Age | Language | Scenario |
|--------|-----|----------|----------|
| **John Doe** | 35 | English | Routine cleaning, no anxiety history |
| **Aarav Patel** | 8 | Hindi | First dental visit, very anxious child |
| **Maria Garcia** | 72 | Spanish | Root canal, severe dental trauma history, Beta-blocker medication |

---

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Model status and version |
| `/api/analyze` | POST | Blocking JSON inference (biometrics + optional image + history) |
| `/api/analyze/stream` | POST | SSE streaming inference — yields tokens in real time |
| `/api/state` | GET | Read shared case state + patient profile |
| `/api/state` | POST | Write case state / patient profile (used by Hub to sync) |

---

## Available Scripts

```bash
# Development
npx tauri dev          # Tauri desktop app (hot reload)
npm run dev            # Vite web-only server (browser testing)

# Production
npx tauri build        # Package .app + .dmg for macOS
npm run build          # Build Vite bundle only
```

---

## Challenges Overcome

**Performance Stability** — Early builds crashed from continuous MediaPipe frame capture and overlapping backend requests on every frame. Restructured to an event-driven edge-to-core model: throttled capture, threshold-based anomaly gating, and single-cycle inference guards eliminated all instability.

**Cross-Device Profile Sync** — The patient profile was originally POSTed once on Dashboard mount. If the patient tablet connected after that single POST, it never received the profile. Solved by continuous 5-second re-sync from the Hub, ensuring the Patient Screen always recovers correct language/age context.

**Gemma 4 Vision** — `llama-cpp-python` does not yet ship a `Gemma4ChatHandler`. Rather than emitting broken multimodal calls, we structured the prompt to carry the computer vision labels (expression, movement) as structured text, achieving the same clinical interpretability without native pixel-level vision.
