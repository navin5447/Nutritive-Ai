# Nutrition AI Backend Entrypoint
# Run this file using: uvicorn main:app --reload

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).parent / '.env'
    load_dotenv(dotenv_path=env_path)
    print(f"🔑 Environment loaded from: {env_path}")
    if os.getenv('GEMINI_API_KEY'):
        print(f"✅ GEMINI_API_KEY found: {os.getenv('GEMINI_API_KEY')[:10]}...")
    else:
        print("⚠️ GEMINI_API_KEY not found in environment")
except ImportError:
    print("⚠️ python-dotenv not installed. Install with: pip install python-dotenv")

app = FastAPI(title="Nutrition AI")

# CORS config for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "http://localhost:3000",
        "https://nutritive-ai.vercel.app",
        "https://*.vercel.app"
    ],  # Update this with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers to be included here
from routes import food, user, meal, analytics
app.include_router(food.router, tags=["food"])
app.include_router(user.router, tags=["user"])
app.include_router(meal.router, tags=["meal"])
app.include_router(analytics.router, tags=["analytics"])

@app.get("/")
def read_root():
    return {"msg": "Nutrition AI backend is running!"}

