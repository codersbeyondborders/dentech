import requests
import json

url = "http://127.0.0.1:8000/api/analyze"
data = {
    "biometrics": json.dumps({"hr": 110, "expression": "Anxious"})
}

response = requests.post(url, data=data)
print(f"Status Code: {response.status_code}")
print(f"Response Body: {json.dumps(response.json(), indent=2)}")
