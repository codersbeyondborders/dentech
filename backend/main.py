from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import asyncio
import uvicorn
import json
import base64
from huggingface_hub import hf_hub_download
from llama_cpp import Llama

app = FastAPI()

# Allow CORS for local frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Model Initialization
# NOTE: llama-cpp-python v0.3.23 does not yet have a Gemma 4-compatible vision
# chat handler. Llava16ChatHandler is LLaVA-specific and crashes with Gemma 4.
# We use plain Llama for all inference — streaming + JSON mode work perfectly.
# True pixel-level vision can be re-enabled once a Gemma4ChatHandler lands.
# ─────────────────────────────────────────────────────────────────────────────
print("Initializing Gemma 4 E2B model (llama.cpp / text mode)...")

model_loaded = False
model = None

try:
    print("Downloading/Checking language model GGUF...")
    model_path = hf_hub_download(
        repo_id="unsloth/gemma-4-E2B-it-GGUF",
        filename="gemma-4-E2B-it-Q4_K_M.gguf"
    )
    print(f"Model path: {model_path}")

    model = Llama(
        model_path=model_path,
        n_ctx=1024,   # Prompts are short — 1024 is plenty, saves KV-cache RAM
        n_threads=8,  # All logical cores on this Mac
        n_batch=512,  # Process prompt tokens in larger batches (faster prefill)
        verbose=False,
    )
    print("Model loaded successfully!")
    model_loaded = True

except Exception as e:
    print(f"Failed to load model: {e}")
    model_loaded = False


# ─────────────────────────────────────────────────────────────────────────────
# Shared prompt / helpers
# ─────────────────────────────────────────────────────────────────────────────
SYSTEM_INSTRUCTIONS = (
    "Dental patient monitor. Output JSON: {\"reasoning\": string, \"function_calls\": array}. "
    "reasoning: ONE short clinical sentence describing the patient state in the context of their medical history. "
    "function_calls items: {\"name\": string, \"arguments\": object}. "
    "Names: triggerBreathingExercise({intensity:low|moderate|high}), "
    "changeAmbientLighting({color:string}), playSoothingAudio({volume:low|medium|high}). "
    "Stressed patient: include interventions. Calm patient: empty function_calls."
)


def build_user_prompt(data: dict, history_data: list, patient_history: str, has_image: bool) -> str:
    """Construct a rich, structured prompt for Context-Aware Medical RAG."""
    hr         = data.get("hr", 75)
    expression = data.get("expression", "Neutral")
    movement   = data.get("movement", "Stable")
    skin_temp  = data.get("skinTemp", 98.6)

    prompt = f"MEDICAL HISTORY (RAG CONTEXT):\n{patient_history}\n\n"
    
    prompt += "30-SECOND BIOMETRIC TREND:\n"
    if history_data and len(history_data) > 0:
        start_hr = history_data[0].get("hr", hr)
        end_hr = history_data[-1].get("hr", hr)
        prompt += f"  Heart rate changed from {start_hr} to {end_hr} BPM.\n"
    else:
        prompt += "  No recent history available.\n"

    prompt += (
        f"\nLIVE ANOMALY DETECTED (LITERT EDGE TRIGGER):\n"
        f"  Current Heart Rate:  {hr} BPM\n"
        f"  Facial Expression:   {expression}\n"
        f"  Body Movement:       {movement}\n"
        f"  Skin Temperature:    {skin_temp} °F\n"
    )
    
    if has_image:
        prompt += "  Camera Frame:        Received\n"

    prompt += "\nBased on the live anomaly and the patient's medical history context, provide your clinical assessment and any recommended interventions. Be sure to reference their history if it is relevant to the anomaly."
    return prompt


def validate_response(data: dict) -> dict:
    """Ensure the required schema keys are always present."""
    if not isinstance(data.get("reasoning"), str) or not data["reasoning"]:
        data["reasoning"] = "Analysis complete."
    if not isinstance(data.get("function_calls"), list):
        data["function_calls"] = []
    return data


# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": "Gemma 4 E2B Q4_K_M" if model_loaded else "Model Load Failed",
        "streaming": True,
        "multimodal": "text-based (pixel vision pending Gemma4ChatHandler)",
    }


@app.post("/api/analyze")
async def analyze(
    image: UploadFile = File(None),
    biometrics: str = Form(...),
    biometrics_history: str = Form("[]"),
    patient_history: str = Form("No history provided.")
):
    """Blocking JSON endpoint — guaranteed valid JSON via response_format."""
    try:
        data = json.loads(biometrics)
        has_image = image is not None

        if not model_loaded or model is None:
            return {
                "reasoning": f"[Fallback] Model not loaded. HR={data.get('hr', '?')}.",
                "function_calls": [],
            }

        user_prompt = build_user_prompt(data, json.loads(biometrics_history), patient_history, has_image)

        response = model.create_chat_completion(
            messages=[
                {"role": "system", "content": SYSTEM_INSTRUCTIONS},
                {"role": "user",   "content": user_prompt},
            ],
            max_tokens=96,
            temperature=0.2,
            response_format={"type": "json_object"},
        )

        response_text = response["choices"][0]["message"]["content"]
        return validate_response(json.loads(response_text))

    except Exception as e:
        return {"error": str(e), "reasoning": str(e), "function_calls": []}


@app.post("/api/analyze/stream")
async def analyze_stream(
    image: UploadFile = File(None),
    biometrics: str = Form(...),
    biometrics_history: str = Form("[]"),
    patient_history: str = Form("No history provided.")
):
    """SSE streaming endpoint — yields tokens in real time, then a 'done' event."""
    data = json.loads(biometrics)
    has_image = image is not None
    user_prompt = build_user_prompt(data, json.loads(biometrics_history), patient_history, has_image)

    async def event_generator():
        if not model_loaded or model is None:
            fallback = {"reasoning": "Model not loaded.", "function_calls": []}
            yield f"data: {json.dumps({'type': 'done', 'payload': fallback})}\n\n"
            return

        accumulated = ""
        for chunk in model.create_chat_completion(
            messages=[
                {"role": "system", "content": SYSTEM_INSTRUCTIONS},
                {"role": "user",   "content": user_prompt},
            ],
            max_tokens=512,
            temperature=0.2,
            response_format={"type": "json_object"},
            stream=True,
        ):
            token = chunk["choices"][0]["delta"].get("content", "")
            if token:
                accumulated += token
                yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"
                await asyncio.sleep(0)  # Flush to browser

        try:
            result = validate_response(json.loads(accumulated))
        except Exception:
            result = {"reasoning": accumulated, "function_calls": []}

        yield f"data: {json.dumps({'type': 'done', 'payload': result})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


# --- STATE SYNCING ENDPOINTS ---
global_state = {
    "current_case": "normal",
    "last_intervention": None
}

@app.get("/api/state")
async def get_state():
    return global_state

@app.post("/api/state")
async def set_state(request: Request):
    data = await request.json()
    global_state.update(data)
    return global_state

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
