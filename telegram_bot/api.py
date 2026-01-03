import requests
from config import BACKEND_BASE_URL

def post(endpoint: str, data: dict):
    url = f"{BACKEND_BASE_URL}{endpoint}"
    response = requests.post(url, json=data, timeout=5)
    response.raise_for_status()
    return response.json()
