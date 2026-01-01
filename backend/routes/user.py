"""User Management Routes - Handle user profiles and health calculations"""
from fastapi import APIRouter, HTTPException
from typing import Optional, List
import uuid
from datetime import datetime

from models.user import UserProfile, UserCreate, Gender, HealthGoal

router = APIRouter(prefix="/users", tags=["Users"])

# In-memory storage (replace with database in production)
users_db = {}


@router.post("/", response_model=UserProfile)
async def create_user(user_data: UserCreate):
    """
    Create a new user profile
    
    Args:
        user_data: User creation data (name, email, age, gender, height, weight, health_goal)
        
    Returns:
        Created user profile with calculated BMI and calorie targets
    """
    user_id = str(uuid.uuid4())
    
    # Check if email already exists
    for existing_user in users_db.values():
        if existing_user.email == user_data.email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    user_profile = UserProfile(
        user_id=user_id,
        name=user_data.name,
        email=user_data.email,
        age=user_data.age,
        gender=user_data.gender,
        height_cm=user_data.height_cm,
        weight_kg=user_data.weight_kg,
        health_goal=user_data.health_goal,
        created_at=datetime.utcnow()
    )
    
    users_db[user_id] = user_profile
    
    return user_profile


@router.get("/{user_id}", response_model=UserProfile)
async def get_user(user_id: str):
    """
    Get user profile by ID
    
    Args:
        user_id: User identifier
        
    Returns:
        User profile with health metrics
    """
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    return users_db[user_id]


@router.put("/{user_id}", response_model=UserProfile)
async def update_user(user_id: str, update_data: dict):
    """
    Update user profile
    
    Args:
        user_id: User identifier
        update_data: Fields to update
        
    Returns:
        Updated user profile
    """
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[user_id]
    
    # Update allowed fields
    if 'name' in update_data:
        user.name = update_data['name']
    if 'age' in update_data:
        user.age = update_data['age']
    if 'height_cm' in update_data:
        user.height_cm = update_data['height_cm']
    if 'weight_kg' in update_data:
        user.weight_kg = update_data['weight_kg']
    if 'health_goal' in update_data:
        user.health_goal = HealthGoal(update_data['health_goal'])
    
    return user


@router.delete("/{user_id}")
async def delete_user(user_id: str):
    """
    Delete user profile
    
    Args:
        user_id: User identifier
        
    Returns:
        Success message
    """
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    del users_db[user_id]
    
    return {"message": "User deleted successfully", "user_id": user_id}


@router.get("/{user_id}/health-metrics")
async def get_health_metrics(user_id: str):
    """
    Get calculated health metrics for user
    
    Args:
        user_id: User identifier
        
    Returns:
        BMI, calorie targets, macro targets, and health status
    """
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[user_id]
    
    # Calculate BMI category
    bmi = user.bmi
    if bmi < 18.5:
        bmi_category = "Underweight"
    elif 18.5 <= bmi < 25:
        bmi_category = "Normal weight"
    elif 25 <= bmi < 30:
        bmi_category = "Overweight"
    else:
        bmi_category = "Obese"
    
    return {
        "user_id": user_id,
        "bmi": {
            "value": bmi,
            "category": bmi_category
        },
        "daily_targets": {
            "calories": user.daily_calorie_target,
            "protein_g": user.daily_protein_target_g,
            "carbs_g": user.daily_carbs_target_g if hasattr(user, 'daily_carbs_target_g') else int(user.daily_calorie_target * 0.475 / 4),
            "fat_g": user.daily_fat_target_g if hasattr(user, 'daily_fat_target_g') else int(user.daily_calorie_target * 0.275 / 9)
        },
        "health_goal": user.health_goal,
        "recommendations": _get_recommendations(user)
    }


def _get_recommendations(user: UserProfile) -> List[str]:
    """Generate personalized recommendations based on user profile"""
    recommendations = []
    
    if user.health_goal == HealthGoal.WEIGHT_LOSS:
        recommendations.append("Focus on high-protein, low-carb meals")
        recommendations.append(f"Aim for {user.daily_calorie_target} calories per day")
        recommendations.append("Include plenty of vegetables and lean proteins")
        
    elif user.health_goal == HealthGoal.MUSCLE_GAIN:
        recommendations.append(f"Consume at least {user.daily_protein_target_g}g of protein daily")
        recommendations.append("Include strength training exercises")
        recommendations.append("Eat protein-rich meals after workouts")
        
    else:  # MAINTENANCE
        recommendations.append("Maintain balanced meals with all food groups")
        recommendations.append("Stay active with regular exercise")
    
    # BMI-based recommendations
    if user.bmi < 18.5:
        recommendations.append("Consider increasing calorie intake gradually")
    elif user.bmi >= 25:
        recommendations.append("Focus on portion control and regular physical activity")
    
    return recommendations


@router.get("/")
async def list_users():
    """
    List all users (for demo purposes)
    
    Returns:
        List of all user profiles
    """
    return {
        "total_users": len(users_db),
        "users": list(users_db.values())
    }

