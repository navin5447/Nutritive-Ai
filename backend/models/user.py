"""User Model - Stores user profile and health information"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class HealthGoal(str, Enum):
    """User health goals"""
    WEIGHT_LOSS = "weight_loss"
    MUSCLE_GAIN = "muscle_gain"
    MAINTENANCE = "maintenance"

class Gender(str, Enum):
    """User gender"""
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class UserProfile(BaseModel):
    """User profile with health information"""
    user_id: str = Field(..., description="Unique user identifier")
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(...)
    age: int = Field(..., ge=10, le=120, description="Age in years")
    gender: Gender
    height_cm: float = Field(..., ge=50, le=300, description="Height in centimeters")
    weight_kg: float = Field(..., ge=20, le=300, description="Weight in kilograms")
    health_goal: HealthGoal
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    @property
    def bmi(self) -> float:
        """Calculate BMI (Body Mass Index)"""
        height_m = self.height_cm / 100
        return round(self.weight_kg / (height_m ** 2), 2)
    
    @property
    def daily_calorie_target(self) -> int:
        """
        Calculate daily calorie target based on Mifflin-St Jeor equation
        BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + s
        where s = +5 for males and -161 for females
        """
        # Calculate BMR (Basal Metabolic Rate)
        bmr = (10 * self.weight_kg) + (6.25 * self.height_cm) - (5 * self.age)
        
        if self.gender == Gender.MALE:
            bmr += 5
        elif self.gender == Gender.FEMALE:
            bmr -= 161
        else:
            bmr -= 80  # Average for other
        
        # Activity factor (assuming moderate activity)
        tdee = bmr * 1.55
        
        # Adjust based on health goal
        if self.health_goal == HealthGoal.WEIGHT_LOSS:
            target = tdee - 500  # 500 cal deficit for weight loss
        elif self.health_goal == HealthGoal.MUSCLE_GAIN:
            target = tdee + 300  # 300 cal surplus for muscle gain
        else:
            target = tdee  # Maintenance
        
        return int(target)
    
    @property
    def daily_protein_target_g(self) -> int:
        """Calculate daily protein target in grams"""
        if self.health_goal == HealthGoal.MUSCLE_GAIN:
            return int(self.weight_kg * 2.0)
        return int(self.weight_kg * 1.6)

class UserCreate(BaseModel):
    """Model for creating a new user"""
    name: str
    email: str
    age: int
    gender: Gender
    height_cm: float
    weight_kg: float
    health_goal: HealthGoal


