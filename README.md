# dentech

dentech is an innovative dental platform powered by Gemma 4 that integrates real-time biometric data and computer vision to monitor patient stress levels and synchronize visual and audio interventions. It features dual interfaces: a Dentist Dashboard for clinical monitoring and a Patient View for bio-responsive feedback.

## Unified Dual-Role Architecture

dentech is deployed as a **Tauri-based desktop application** designed for offline, low-resource environments (e.g., LMIC clinics) where internet connectivity may be unreliable. 
Instead of requiring a central cloud server, the system operates locally over a **WiFi Hotspot**. 

The app features a unified installer that allows the user to select their role upon launch:
- **Main Hub (Dentist + AI Backend)**: Runs the Dentist Dashboard and explicitly spawns the intensive Gemma 4 AI backend as a secure sidecar process.
- **Patient Screen (Edge Client)**: Runs the lightweight Patient View and biometric/computer vision ingestion. It connects to the Main Hub over the local network.

### Offline Deployment Instructions

To use dentech offline across two devices:
1. **Network Setup**: Turn on the "Mobile Hotspot" feature on the primary computer (Main Hub). Connect the patient tablet/secondary machine to this hotspot.
2. **Launch Main Hub**: Open the dentech app on the primary computer and select "Main Hub". Note the computer's local network IP address (e.g. `192.168.x.x`).
3. **Launch Patient Screen**: Open the dentech app on the secondary device, select "Patient Screen", and enter the Main Hub's local IP address when prompted.

## Tech Stack

- **Desktop Framework**: Tauri (Rust)
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Computer Vision**: Google MediaPipe (`@mediapipe/tasks-vision`)
- **Routing**: React Router DOM
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Hardware Integration**: Web Bluetooth API
- **Backend API**: Python, FastAPI, Uvicorn
- **AI/LLM**: Gemma 4 (`llama-cpp-python`, `huggingface-hub`)

## Getting Started (Development)

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Tauri development server:
   ```bash
   cd frontend
   npm run tauri dev
   ```

3. The Python backend dependencies and execution are managed via the Tauri sidecar infrastructure, but to run it independently during web-only dev:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

## Available Scripts (Frontend)

- `npm run tauri dev`: Starts the Tauri desktop application in development mode.
- `npm run tauri build`: Packages the app for production distribution.
- `npm run dev`: Starts the Vite web server for browser testing.
