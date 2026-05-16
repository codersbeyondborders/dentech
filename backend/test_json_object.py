import time
from llama_cpp import Llama
import json

model = Llama(
    model_path="/Users/awparray/.cache/huggingface/hub/models--unsloth--gemma-4-E2B-it-GGUF/snapshots/90f9618340396838ee7ff5b0ba2da27da62953d3/gemma-4-E2B-it-Q4_K_M.gguf",
    n_ctx=2048,
    verbose=False
)

start_time = time.time()
response = model.create_chat_completion(
    messages=[
        {"role": "system", "content": "You MUST output a JSON object with 'reasoning' and 'function_calls' keys."},
        {"role": "user", "content": "HR is 110, they are anxious."}
    ],
    response_format={"type": "json_object"},
    max_tokens=256
)
print("Time taken:", time.time() - start_time)
print(response['choices'][0]['message']['content'])
