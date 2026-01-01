"""Meal Model - Stores meal history and nutrition tracking"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum
from .food import NutritionInfo, DetectedFood

class MealType(str, Enum):
    """Type of meal"""
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"

class MealEntry(BaseModel):
    """Single meal entry in user's history"""
    meal_id: str = Field(..., description="Unique meal identifier")
    user_id: str = Field(..., description="User who logged this meal")
    meal_type: MealType = Field(..., description="Type of meal")
    detected_foods: List[DetectedFood] = Field(..., description="Foods detected in this meal")
    total_nutrition: NutritionInfo = Field(..., description="Total nutrition for this meal")
    image_path: Optional[str] = Field(None, description="Path to uploaded image")
    notes: Optional[str] = Field(None, max_length=500, description="User notes")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    alerts: Optional[List[str]] = Field(default_factory=list)

class DailyNutritionSummary(BaseModel):
    """Daily nutrition summary for a user"""
    user_id: str
    date: str = Field(..., description="Date in YYYY-MM-DD format")
    total_calories: float = Field(0, ge=0)
    total_protein: float = Field(0, ge=0)
    total_carbs: float = Field(0, ge=0)
    total_fat: float = Field(0, ge=0)
    total_fiber: float = Field(0, ge=0)
    meals_count: int = Field(0, ge=0)
    breakfast_calories: float = Field(0, ge=0)
    lunch_calories: float = Field(0, ge=0)
    dinner_calories: float = Field(0, ge=0)
    snack_calories: float = Field(0, ge=0)

class MealCreate(BaseModel):
    """Model for creating a new meal entry"""
    user_id: str
    meal_type: MealType
    detected_foods: List[DetectedFood]
    total_nutrition: NutritionInfo
    image_path: Optional[str] = None
    notes: Optional[str] = None

class MealHistory(BaseModel):
    """Meal history for a user"""
    user_id: str
    meals: List[MealEntry] = Field(default_factory=list)
    total_meals: int = Field(0)

class HealthAlert(BaseModel):
    """Health alert based on nutrition analysis"""
    alert_type: str
    title: str
    message: str
    nutrient: Optional[str] = None

# Legacy models for backward compatibility
class MealLog(BaseModel):
    meal_id: Optional[int]
    user_id: int
    foods: List[Dict]
    timestamp: datetime
    nutrition_summary: Dict
    alerts: Optional[List[str]] = []

class MealHistoryResponse(BaseModel):
    logs: List[MealLog]


