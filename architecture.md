# Nutrition AI: System Architecture

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Component Details](#component-details)
4. [Data Flow](#data-flow)
5. [API Contracts](#api-contracts)
6. [Database Schema](#database-schema)
7. [ML Pipeline](#ml-pipeline)
8. [Security & Performance](#security--performance)

---

## System Overview

**Nutrition AI** is a three-tier architecture system comprising:

1. **Frontend Layer**: React-based web interface for user interactions
2. **Backend Layer**: FastAPI REST API server with business logic
3. **ML Layer**: Computer vision and nutrition calculation modules

### Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
│  React 18.2 + Vite + Tailwind CSS + Axios              │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST (JSON)
┌────────────────────▼────────────────────────────────────┐
│                    BACKEND LAYER                         │
│  FastAPI + Uvicorn + Pydantic Models                    │
│  ┌──────────┬──────────┬──────────┬─────────────┐      │
│  │  Food    │   User   │   Meal   │  Analytics  │      │
│  │  Routes  │  Routes  │  Routes  │   Routes    │      │
│  └────┬─────┴─────┬────┴─────┬────┴──────┬──────┘      │
└───────┼───────────┼──────────┼───────────┼─────────────┘
        │           │          │           │
┌───────▼───────────▼──────────▼───────────▼─────────────┐
│                     ML LAYER                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │   Food     │  │  Portion   │  │ Nutrition  │       │
│  │ Classifier │  │ Estimator  │  │   Mapper   │       │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘       │
└─────────┼────────────────┼────────────────┼─────────────┘
          │                │                │
          └────────────────┴────────────────┘
                           │
          ┌────────────────▼────────────────┐
          │   Indian Food Nutrition DB      │
          │   (JSON - 15+ foods)           │
          └─────────────────────────────────┘
```

---

## Architecture Diagram

### High-Level System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      USER INTERFACE                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │   Upload   │  │ Dashboard  │  │  Profile   │        │
│  │   Image    │  │ Analytics  │  │   Page     │        │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘        │
└────────┼───────────────┼───────────────┼────────────────┘
         │               │               │
         │        REST API (HTTP/JSON)   │
         │               │               │
┌────────▼───────────────▼───────────────▼────────────────┐
│                    API GATEWAY                           │
│              FastAPI Application                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Route Handlers                      │   │
│  │  /food/*  │  /user/*  │  /meal/*  │ /analytics/* │   │
│  └────┬──────┴────┬──────┴────┬──────┴─────┬────────┘   │
│       │           │           │            │            │
│  ┌────▼───────────▼───────────▼────────────▼────────┐   │
│  │           Business Logic Layer                   │   │
│  │  - Request validation (Pydantic)                 │   │
│  │  - Authentication (Future)                       │   │
│  │  - Error handling                                │   │
│  └────┬───────────┬───────────┬────────────┬────────┘   │
└───────┼───────────┼───────────┼────────────┼────────────┘
        │           │           │            │
┌───────▼───────────▼───────────▼────────────▼────────────┐
│                  SERVICE LAYER                           │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────┐       │
│  │ ML Service  │  │   User   │  │     Meal     │       │
│  │  (OpenCV,   │  │ Service  │  │   Service    │       │
│  │   NumPy)    │  │          │  │              │       │
│  └──────┬──────┘  └─────┬────┘  └──────┬───────┘       │
└─────────┼───────────────┼───────────────┼───────────────┘
          │               │               │
┌─────────▼───────────────▼───────────────▼───────────────┐
│                  DATA LAYER                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │  Nutrition │  │   Users    │  │   Meals    │        │
│  │     DB     │  │    Dict    │  │    Dict    │        │
│  │  (JSON)    │  │  (Memory)  │  │  (Memory)  │        │
│  └────────────┘  └────────────┘  └────────────┘        │
└──────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. Frontend Layer

**Purpose**: User interface for image upload, result display, and analytics

**Components**:
- `App.js`: Main application component
  - Image upload handling
  - Food recognition display
  - Nutrition results visualization
  - Error handling

**State Management**:
- React Hooks (useState for local state)
- Image preview
- Loading states
- API response data

**Styling**: Tailwind CSS utility classes with responsive design

**API Communication**: Axios HTTP client with FormData for file uploads

---

### 2. Backend Layer

**Purpose**: REST API server with business logic and ML orchestration

#### 2.1 Main Application (`main.py`)
```python
FastAPI() instance with:
- CORS middleware (allow localhost:3000)
- Router registration for all modules
- Exception handlers
- Health check endpoint
```

#### 2.2 Route Modules

**Food Routes** (`routes/food.py`)
- `POST /food/recognize`: Image upload → ML pipeline → nutrition response
- `GET /food/supported-foods`: List all 15+ supported Indian foods
- `GET /food/food-info/{food_id}`: Get detailed nutrition for specific food

**User Routes** (`routes/user.py`)
- `POST /user/`: Create user profile with health metrics
- `GET /user/{user_id}`: Retrieve user profile
- `PUT /user/{user_id}`: Update profile (weight, goals, etc.)
- `DELETE /user/{user_id}`: Remove user
- `GET /user/{user_id}/health-metrics`: Calculate BMI, daily targets

**Meal Routes** (`routes/meal.py`)
- `POST /meal/log`: Log meal with detected foods
- `GET /meal/history`: Query meals with filters (date range, meal type)
- `GET /meal/daily-summary`: Aggregate daily nutrition totals
- `DELETE /meal/{meal_id}`: Remove meal entry

**Analytics Routes** (`routes/analytics.py`)
- `GET /analytics/weekly-summary`: 7-day nutrition trends
- `GET /analytics/macro-distribution`: Protein/carbs/fat percentages
- `GET /analytics/goal-progress`: Progress toward daily targets
- `GET /analytics/food-frequency`: Most consumed foods ranking

#### 2.3 Models Layer (Pydantic)

**User Models** (`models/user.py`)
```python
class UserProfile:
    user_id: str
    age: int
    weight_kg: float
    height_cm: float
    gender: Gender (enum)
    health_goal: HealthGoal (enum)
    activity_level: str
    
    @property
    def bmi(self) -> float
        # BMI calculation
    
    @property
    def daily_calorie_target(self) -> float
        # Mifflin-St Jeor equation
```

**Food Models** (`models/food.py`)
```python
class NutritionInfo:
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float
    sodium: float
    
class DetectedFood:
    food_name: str
    estimated_grams: float
    confidence: float
    nutrition: NutritionInfo
```

**Meal Models** (`models/meal.py`)
```python
class MealEntry:
    meal_id: str
    user_id: str
    meal_type: MealType (enum)
    timestamp: datetime
    detected_foods: List[DetectedFood]
    total_nutrition: NutritionInfo
    health_alerts: List[str]
```

---

### 3. ML Layer

#### 3.1 Food Classifier (`ml/food_classifier.py`)

**Purpose**: Identify food items from images

**Algorithm**: Color histogram matching with multi-feature extraction

**Process**:
1. **Preprocessing**:
   - Resize to 224x224
   - Gaussian blur (reduce noise)
   - Color space conversion (RGB, HSV, LAB)

2. **Feature Extraction**:
   - RGB histograms: 8 bins per channel (24 total)
   - HSV statistics: mean hue, saturation, value
   - LAB color moments: L*, a*, b* distributions

3. **Matching**:
   - Compare against 15+ Indian food signatures
   - Calculate similarity scores (cosine similarity)
   - Return top N matches with confidence

4. **Multi-Food Detection**:
   - Divide image into regions
   - Detect multiple items per image
   - Aggregate results

**Confidence Scoring**:
- 0.9-1.0: High confidence (strong match)
- 0.7-0.9: Medium confidence (probable match)
- <0.7: Low confidence (uncertain)

#### 3.2 Portion Estimator (`ml/portion_estimator.py`)

**Purpose**: Estimate food quantity in grams

**Algorithm**: Plate detection + area ratio calculation

**Process**:
1. **Plate Detection**:
   - Convert to grayscale
   - Apply Hough Circle Transform
   - Detect circular plate boundary
   - Calculate diameter in pixels

2. **Reference Calculation**:
   - Assume 25cm standard plate diameter
   - Compute pixels-per-cm ratio
   - Scale food dimensions

3. **Food Area Calculation**:
   - Detect food bounding boxes
   - Calculate area coverage
   - Apply category-specific density factors:
     - Liquid (dal, sambar): 0.8 (high volume)
     - Dense (biryani, rice): 1.0 (medium)
     - Solid (idli, dosa): 1.2 (low volume)

4. **Gram Estimation**:
   ```
   grams = bbox_area × plate_scale × density_factor × category_multiplier
   ```

**Accuracy**: ±15-20g for standard portions

#### 3.3 Nutrition Mapper (`ml/nutrition_mapper.py`)

**Purpose**: Calculate nutrition and generate health insights

**Process**:
1. **Database Lookup**:
   - Load `indian_food_nutrition.json`
   - Match detected food to nutrition entry
   - Retrieve per-100g values

2. **Portion Scaling**:
   ```
   actual_nutrition = (per_100g_value × estimated_grams) / 100
   ```

3. **Total Calculation**:
   - Sum all foods in meal
   - Calculate total calories, macros, micros

4. **Alert Generation**:
   - Compare to user health goals
   - Check daily targets (calories, protein)
   - Identify warnings:
     - High sodium (>500mg per meal)
     - High sugar (>20g per meal)
     - Low protein (<15g for muscle gain)
     - Excess calories (>700kcal for weight loss)

5. **Explanation**:
   - Generate human-readable breakdown
   - Show calculation steps
   - Provide transparency

**Example Output**:
```json
{
  "total_nutrition": {
    "calories": 450,
    "protein": 12,
    "carbs": 78,
    "fat": 9
  },
  "health_alerts": [
    "Great protein content for muscle building!",
    "⚠️ High carbs - may exceed daily target"
  ],
  "explanation": "2 idlis (120g): 187 kcal + 1 bowl sambar (200g): 150 kcal..."
}
```

---

## Data Flow

### End-to-End Food Recognition Flow

```
1. USER ACTION
   ↓
   Upload food image (JPG/PNG)
   ↓

2. FRONTEND (React)
   ↓
   - Validate file type/size
   - Create FormData with file + user_id
   - POST /food/recognize
   ↓

3. BACKEND (FastAPI)
   ↓
   - Receive multipart/form-data
   - Validate request (Pydantic)
   - Read image bytes
   ↓

4. ML PIPELINE
   ↓
   [Food Classifier]
   - Preprocess image
   - Extract features
   - Match to database
   - Return: ["idli", "sambar"] with confidence
   ↓
   [Portion Estimator]
   - Detect plate size
   - Calculate food areas
   - Estimate: idli=120g, sambar=200g
   ↓
   [Nutrition Mapper]
   - Lookup nutrition DB
   - Calculate: idli(120g) + sambar(200g)
   - Generate alerts based on user profile
   ↓

5. RESPONSE ASSEMBLY
   ↓
   {
     "detected_foods": [...],
     "total_nutrition": {...},
     "health_alerts": [...],
     "explanation": "..."
   }
   ↓

6. FRONTEND DISPLAY
   ↓
   - Show detected foods with confidence
   - Display nutrition cards (calories, macros)
   - Highlight health alerts
   - Render explanation
```

### User Profile Flow

```
1. Create Profile
   POST /user/
   ↓
   - Calculate BMI = weight / (height²)
   - Calculate daily calorie target (Mifflin-St Jeor)
   - Store in users_db dict
   ↓
   Return: UserProfile with calculated metrics

2. Get Health Metrics
   GET /user/{id}/health-metrics
   ↓
   - Retrieve user from memory
   - Calculate current BMI
   - Get daily targets (calories, protein, carbs, fat)
   - Return JSON response
```

### Meal Logging Flow

```
1. Log Meal
   POST /meal/log
   ↓
   - Validate meal_type (breakfast/lunch/dinner/snack)
   - Calculate total nutrition from foods
   - Generate timestamp
   - Create meal_id (UUID)
   - Store in meals_db
   ↓
   Return: MealEntry

2. Daily Summary
   GET /meal/daily-summary?user_id=X&date=Y
   ↓
   - Filter meals by user and date
   - Aggregate nutrition totals
   - Count meals by type
   ↓
   Return: DailyNutritionSummary
```

---

## API Contracts

### Request/Response Schemas

#### POST /food/recognize

**Request**:
```http
POST /food/recognize
Content-Type: multipart/form-data

file: [binary image data]
user_id: "demo-user"
```

**Response** (200 OK):
```json
{
  "detected_foods": [
    {
      "food_name": "Idli",
      "estimated_grams": 120.0,
      "confidence": 0.92,
      "nutrition": {
        "calories": 187,
        "protein": 4.7,
        "carbs": 31.8,
        "fat": 3.8,
        "fiber": 2.4,
        "sodium": 288
      }
    }
  ],
  "total_nutrition": {
    "calories": 187,
    "protein": 4.7,
    "carbs": 31.8,
    "fat": 3.8
  },
  "health_alerts": [
    "Good protein source!",
    "Low in fat - excellent choice for weight loss"
  ],
  "explanation": "2 medium idlis detected (120g total). Calculated nutrition per 100g scaled to portion size. Idlis are steamed rice cakes with moderate calories."
}
```

#### POST /user/

**Request**:
```json
{
  "user_id": "user123",
  "name": "John Doe",
  "age": 30,
  "weight_kg": 75.0,
  "height_cm": 175.0,
  "gender": "male",
  "health_goal": "weight_loss",
  "activity_level": "moderate"
}
```

**Response** (201 Created):
```json
{
  "user_id": "user123",
  "name": "John Doe",
  "age": 30,
  "weight_kg": 75.0,
  "height_cm": 175.0,
  "gender": "male",
  "health_goal": "weight_loss",
  "activity_level": "moderate",
  "bmi": 24.49,
  "daily_calorie_target": 2295.0,
  "daily_protein_target": 150.0,
  "daily_carbs_target": 230.0,
  "daily_fat_target": 64.0
}
```

#### GET /analytics/weekly-summary

**Request**:
```http
GET /analytics/weekly-summary?user_id=user123
```

**Response** (200 OK):
```json
{
  "week_start": "2024-01-08",
  "week_end": "2024-01-14",
  "daily_breakdown": [
    {
      "date": "2024-01-08",
      "total_calories": 1950,
      "total_protein": 85,
      "total_carbs": 220,
      "total_fat": 55,
      "meals_logged": 4
    },
    // ... 6 more days
  ],
  "weekly_averages": {
    "avg_calories": 2050,
    "avg_protein": 90,
    "avg_carbs": 230,
    "avg_fat": 58
  },
  "goal_adherence": {
    "days_on_target": 5,
    "days_over_target": 2,
    "adherence_percentage": 71.4
  }
}
```

---

## Database Schema

### Indian Food Nutrition Database (JSON)

**File**: `data/indian_food_nutrition.json`

**Structure**:
```json
[
  {
    "id": "idli",
    "name": "Idli",
    "category": "south_indian",
    "per_100g": {
      "calories": 156,
      "protein": 3.9,
      "carbs": 26.5,
      "fat": 3.2,
      "fiber": 2.0,
      "sodium": 240,
      "sugar": 1.5
    },
    "standard_serving": {
      "amount": 60,
      "unit": "grams",
      "description": "1 medium idli"
    },
    "health_tags": ["low_fat", "vegetarian", "fermented"],
    "allergens": [],
    "warnings": []
  }
]
```

**Current Foods** (15+):
- idli, dosa, biryani, dal, sambar
- rice, chapati, vada, pongal
- paneer curry, chicken curry
- samosa, paratha, upma

### In-Memory Data Structures

**Users Database**:
```python
users_db: Dict[str, UserProfile] = {}
# Key: user_id
# Value: UserProfile object
```

**Meals Database**:
```python
meals_db: Dict[str, MealEntry] = {}
# Key: meal_id (UUID)
# Value: MealEntry object

user_meals_index: Dict[str, List[str]] = defaultdict(list)
# Key: user_id
# Value: List of meal_ids
```

---

## ML Pipeline

### Feature Extraction Details

**Color Histograms** (24 features):
```
RGB: 8 bins × 3 channels = 24 bins
Range: 0-255 divided into 8 segments
Output: Normalized histogram values
```

**HSV Statistics** (3 features):
```
Hue: mean_hue (color tone)
Saturation: mean_saturation (color intensity)
Value: mean_value (brightness)
```

**LAB Color Moments** (3 features):
```
L*: Lightness (0-100)
a*: Green-Red axis (-128 to 127)
b*: Blue-Yellow axis (-128 to 127)
```

### Similarity Calculation

```python
def calculate_similarity(features_a, features_b):
    # Cosine similarity
    dot_product = np.dot(features_a, features_b)
    norm_a = np.linalg.norm(features_a)
    norm_b = np.linalg.norm(features_b)
    return dot_product / (norm_a * norm_b)
```

### Plate Detection Algorithm

```python
1. Convert image to grayscale
2. Apply Gaussian blur (kernel 9x9)
3. Hough Circle Transform:
   - dp = 1.2 (accumulator resolution)
   - minDist = image.rows / 8
   - param1 = 50 (Canny edge threshold)
   - param2 = 30 (circle detection threshold)
   - minRadius = image.rows / 10
   - maxRadius = image.rows / 2
4. Select largest circle as plate
5. Calculate diameter in pixels
6. Return plate_diameter_cm = 25 (standard)
```

---

## Security & Performance

### Security Measures

1. **Input Validation**:
   - Pydantic models enforce types
   - File size limits (10MB max)
   - Allowed file types: JPG, PNG, JPEG

2. **CORS Configuration**:
   - Frontend: `http://localhost:3000`
   - Methods: GET, POST, PUT, DELETE
   - Headers: Content-Type, Authorization

3. **Error Handling**:
   - Custom exception handlers
   - No stack traces in production
   - Sanitized error messages

4. **Future Enhancements**:
   - JWT authentication
   - Rate limiting (API throttling)
   - HTTPS enforcement
   - Input sanitization (SQL injection, XSS)

### Performance Optimizations

1. **Image Processing**:
   - Resize to 224x224 (reduce computation)
   - Asynchronous file handling
   - In-memory caching of nutrition DB

2. **API Response Times**:
   - Food recognition: ~2-3 seconds
   - User CRUD: <100ms
   - Analytics queries: <200ms

3. **Scalability Considerations**:
   - In-memory storage (demo only)
   - Future: PostgreSQL/MongoDB
   - Redis caching layer
   - Load balancing (multiple workers)

4. **Frontend Optimization**:
   - Vite build tool (fast HMR)
   - Code splitting
   - Lazy loading components
   - Image compression before upload

---

## Deployment Architecture (Future)

```
┌─────────────┐
│   Nginx     │  (Reverse Proxy + SSL)
└──────┬──────┘
       │
┌──────▼──────────────────┐
│   Load Balancer         │
└──┬────────────────────┬─┘
   │                    │
┌──▼────────┐    ┌──────▼──┐
│  FastAPI  │    │ FastAPI │  (Multiple workers)
│  Worker 1 │    │ Worker 2│
└──┬────────┘    └──────┬──┘
   │                    │
   └──────────┬─────────┘
              │
┌─────────────▼──────────┐
│    PostgreSQL DB       │
│   (Users, Meals)       │
└────────────────────────┘
              │
┌─────────────▼──────────┐
│    Redis Cache         │
│  (Session, Nutrition)  │
└────────────────────────┘
```

---

## Conclusion

This architecture provides:
- **Modularity**: Separate concerns (UI, API, ML)
- **Scalability**: Can add workers, caching, DB
- **Maintainability**: Clear separation of layers
- **Extensibility**: Easy to add new foods, features
- **Transparency**: Explainable AI with calculation breakdowns

For questions or improvements, see the main README.md.


