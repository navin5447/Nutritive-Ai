# 🥗 Nutrition AI - AI-Powered Food Recognition & Nutrition Tracking

> An intelligent nutrition tracking system that recognizes Indian foods from images using **Google Gemini Vision API**, calculates accurate nutrition, and provides personalized health insights with a modern gym-inspired UI.

[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)
[![Gemini](https://img.shields.io/badge/AI-Gemini%20Vision-purple.svg)](https://ai.google.dev)

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

## 🎯 Overview

**Nutrition AI** is an end-to-end AI-powered system for accurate nutrition tracking with focus on Indian cuisine. Upload a food image, and the system will:

1. **Recognize** Indian foods using Google Gemini Vision AI (36+ supported foods)
2. **Estimate** portion sizes using computer vision
3. **Calculate** detailed nutrition (calories, protein, carbs, fats)
4. **Generate** personalized health insights and alerts
5. **Track** daily nutrition and goals with animated dashboard

## ✨ Features

### 🤖 Real AI-Powered Recognition
- **Google Gemini Vision API** integration for accurate food identification
- Supports 36+ Indian foods across all categories
- Multi-food detection in single image
- Confidence scoring for each detection

### 🖼️ Image-Based Food Recognition
- Upload food images via web interface
- Supports 15+ Indian foods (idli, dosa, biryani, dal, sambar, rice, chapati, etc.)
- Multi-food detection in single image
- Confidence scoring for each detection

### 📏 Intelligent Portion Estimation
- Automatic plate size detection
- Reference object-based calculation
- Gram-level accuracy

### 🧠 Explainable AI
- Transparent calculation breakdowns
- Color histogram-based matching
- Visual confidence indicators

### 💡 Personalized Health Insights
- BMI calculation and tracking
- Daily calorie recommendations (Mifflin-St Jeor equation)
- Macro distribution analysis
- Health goal-based alerts (weight loss, muscle gain, maintenance)
- Dietary warnings (high sodium, sugar, allergens)

### 📊 Analytics Dashboard
- Weekly nutrition summaries
- Macro distribution charts
- Goal progress tracking
- Most consumed foods analysis

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python async web framework)
- **Server**: Uvicorn (ASGI server)
- **Validation**: Pydantic models
- **ML**: OpenCV, NumPy, Pillow
- **Storage**: JSON files + in-memory

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.3
- **HTTP Client**: Axios

## 📦 Installation

### Prerequisites
- Python 3.10+ (3.14 recommended)
- Node.js 16+ and npm

### Backend Setup

```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Start server
uvicorn main:app --reload --port 8000
```

Backend: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:3000`

## 🚀 Usage

1. Start both backend (port 8000) and frontend (port 3000)
2. Open browser to `http://localhost:3000`
3. Upload a food image
4. View nutrition analysis results with:
   - Detected foods with confidence
   - Estimated portions (grams)
   - Complete nutrition breakdown
   - Health alerts and recommendations

## 📚 API Documentation

### Key Endpoints

#### Food Recognition
```bash
POST /food/recognize
- Upload image with user_id
- Returns detected foods, portions, nutrition, alerts
```

#### User Management
```bash
POST /user/          # Create profile
GET /user/{id}       # Get profile
PUT /user/{id}       # Update profile
GET /user/{id}/health-metrics  # Get BMI, targets
```

#### Meal Logging
```bash
POST /meal/log                 # Log meal
GET /meal/history              # Get history
GET /meal/daily-summary        # Daily totals
```

#### Analytics
```bash
GET /analytics/weekly-summary      # 7-day trends
GET /analytics/macro-distribution  # Macro %
GET /analytics/goal-progress       # Target progress
GET /analytics/food-frequency      # Top foods
```

Interactive docs: `http://localhost:8000/docs`

## 📁 Project Structure

```
nutrition-ai/
├── backend/
│   ├── main.py                 # FastAPI entry
│   ├── cv2.py                  # Mock OpenCV (demo)
│   ├── models/                 # Pydantic models
│   │   ├── user.py
│   │   ├── food.py
│   │   └── meal.py
│   └── routes/                 # API endpoints
│       ├── food.py
│       ├── user.py
│       ├── meal.py
│       └── analytics.py
├── ml/
│   ├── food_classifier.py      # AI recognition
│   ├── portion_estimator.py   # Size estimation
│   └── nutrition_mapper.py    # Nutrition calc
├── data/
│   └── indian_food_nutrition.json  # 15+ foods
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   └── App.js              # Main UI
│   └── package.json
└── README.md
```

## 🤖 ML Models

### Food Classifier
- Color histogram matching
- 8-bin RGB histograms
- HSV and LAB color features
- 15+ Indian foods supported

### Portion Estimator
- Hough Circle Transform for plate detection
- 25cm standard plate reference
- Area ratio calculation
- ±15-20g accuracy

### Nutrition Mapper
- Per-100g database lookup
- Portion-scaled calculations
- Personalized alert generation
- Explainable breakdowns

## 🗄️ Supported Foods

idli • dosa • biryani • dal • sambar • rice • chapati • vada • pongal • paneer curry • chicken curry • samosa • paratha • upma • and more

Each with complete nutrition data:
- Calories, protein, carbs, fat
- Fiber, sodium, sugar
- Health tags and allergen info
- Standard serving sizes

## 🔮 Future Enhancements

- Deep learning CNN models
- Mobile app (React Native)
- Recipe suggestions
- Fitness tracker integration
- Restaurant menu lookup
- Barcode scanning
- Offline mode

## 📧 Contact

For questions or support, open an issue on GitHub.

---

**Made with ❤️ for health-conscious food lovers**

