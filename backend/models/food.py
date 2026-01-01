"""Food Model - Represents detected food items and nutrition information"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class NutritionInfo(BaseModel):
    """Nutrition information per 100g"""
    calories: float = Field(..., ge=0, description="Calories in kcal")
    protein: float = Field(..., ge=0, description="Protein in grams")
    carbs: float = Field(..., ge=0, description="Carbohydrates in grams")
    fat: float = Field(..., ge=0, description="Fat in grams")
    fiber: float = Field(0, ge=0, description="Fiber in grams")
    sugar: float = Field(0, ge=0, description="Sugar in grams")
    sodium: float = Field(0, ge=0, description="Sodium in mg")

class ServingInfo(BaseModel):
    """Standard serving information"""
    size: str = Field(..., description="Serving size description")
    grams: float = Field(..., gt=0, description="Weight in grams")
    calories: float = Field(..., ge=0, description="Calories per serving")

class FoodItem(BaseModel):
    """Food item with complete nutrition data"""
    id: str = Field(..., description="Unique food identifier")
    name: str = Field(..., description="Food name")
    category: str = Field(..., description="Food category")
    per_100g: NutritionInfo = Field(..., description="Nutrition per 100g")
    standard_serving: ServingInfo = Field(..., description="Standard serving info")
    health_tags: List[str] = Field(default_factory=list, description="Health tags")
    warnings: List[str] = Field(default_factory=list, description="Health warnings")

class DetectedFood(BaseModel):
    """Food detected from image with confidence and portion"""
    food_id: str = Field(..., description="Food identifier from database")
    food_name: str = Field(..., description="Detected food name")
    confidence: float = Field(..., ge=0, le=1, description="Detection confidence (0-1)")
    estimated_portion_g: float = Field(..., gt=0, description="Estimated portion in grams")
    bounding_box: Optional[Dict[str, float]] = Field(None, description="Bounding box coordinates")
    nutrition: NutritionInfo = Field(..., description="Calculated nutrition for this portion")
    
class FoodRecognitionResult(BaseModel):
    """Complete food recognition result"""
    detected_foods: List[DetectedFood] = Field(..., description="List of detected foods")
    total_nutrition: NutritionInfo = Field(..., description="Total nutrition for all detected foods")
    health_alerts: List[str] = Field(default_factory=list, description="Health warnings and alerts")
    explanation: str = Field(..., description="Explanation of how nutrition was calculated")
    image_quality_score: float = Field(..., ge=0, le=1, description="Image quality score")
    processed_at: datetime = Field(default_factory=datetime.utcnow)

class FoodPrediction(BaseModel):
    """Legacy model for backward compatibility"""
    food: str
    confidence: float
    bbox: Optional[List[int]] = None
    portion_grams: Optional[float] = None
    nutrition: Optional[Dict] = None

class FoodRecognitionRequest(BaseModel):
    user_id: Optional[str] = None

class FoodRecognitionResponse(BaseModel):
    foods: List[FoodPrediction]
    explainable_outputs: str
    nutrition_summary: Dict
    health_alerts: List[str] = []


