# dentech

dentech is an innovative dental platform powered by Gemma 4 that integrates real-time biometric data and computer vision to monitor patient stress levels and synchronize visual and audio interventions. It features dual interfaces: a Dentist Dashboard for clinical monitoring and a Patient View for bio-responsive feedback.

## Key Features

- **Real-Time Biometric Tracking**: Captures and processes patient stress markers using Web Bluetooth and heart rate data.
- **Live Computer Vision**: Utilizes MediaPipe Face Landmarker to analyze facial expressions and movements.
- **Bio-Responsive Interventions**: Automatically adjusts visual and audio environments in the Patient View based on stress levels.
- **Synchronized Dashboards**: Provides a cohesive experience between the clinical Dentist Dashboard and the relaxing Patient View.
- **Gemma 4 Inference Engine**: Utilizes local Gemma 4 LLM execution for fast clinical text streaming and deterministic JSON output.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Computer Vision**: Google MediaPipe (`@mediapipe/tasks-vision`)
- **Routing**: React Router DOM
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Hardware Integration**: Web Bluetooth API
- **Backend API**: Python, FastAPI, Uvicorn
- **AI/LLM**: Gemma 4 (`llama-cpp-python`, `huggingface-hub`)

## Getting Started

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to the local server URL provided by Vite.

4. In a new terminal, set up and run the Python backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint to check for code issues.
- `npm run preview`: Previews the production build locally.
