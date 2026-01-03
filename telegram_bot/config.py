import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL")
