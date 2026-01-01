"""Meal Logging Routes - Handle meal history and tracking"""
from fastapi import APIRouter, HTTPException
from typing import Optional, List
import uuid
from datetime import datetime, date, timedelta
from collections import defaultdict

from models.meal import MealEntry, MealType, DailyNutritionSummary
from models.food import NutritionInfo, DetectedFood

router = APIRouter(prefix="/meals", tags=["Meals"])

# In-memory storage (replace with database in production)
meals_db = {}  # {meal_id: MealEntry}
user_meals_index = defaultdict(list)  # {user_id: [meal_ids]}


@router.post("/")
async def log_meal(
    user_id: str,
    meal_type: MealType,
    detected_foods: List[dict],
    total_nutrition: dict,
    image_path: Optional[str] = None,
    notes: Optional[str] = None
):
    """
    Log a new meal for a user
    
    Args:
        user_id: User identifier
        meal_type: Type of meal (breakfast, lunch, dinner, snack)
        detected_foods: List of detected foods with nutrition
        total_nutrition: Total nutrition for the meal
        image_path: Path to meal image
        notes: Optional user notes
        
    Returns:
        Created meal entry
    """
    meal_id = str(uuid.uuid4())
    
    # Convert detected_foods to DetectedFood models
    foods_list = []
    for food in detected_foods:
        nutrition = NutritionInfo(**food.get('nutrition', {}))
        detected_food = DetectedFood(
            food_id=food['food_id'],
            food_name=food['food_name'],
            confidence=food['confidence'],
            estimated_portion_g=food.get('estimated_grams', 100),
            bounding_box=food.get('bounding_box'),
            nutrition=nutrition
        )
        foods_list.append(detected_food)
    
    # Create meal entry
    meal_entry = MealEntry(
        meal_id=meal_id,
        user_id=user_id,
        meal_type=meal_type,
        detected_foods=foods_list,
        total_nutrition=NutritionInfo(**total_nutrition),
        image_path=image_path,
        notes=notes,
        timestamp=datetime.utcnow()
    )
    
    # Store meal
    meals_db[meal_id] = meal_entry
    user_meals_index[user_id].append(meal_id)
    
    return {
        "message": "Meal logged successfully",
        "meal": meal_entry
    }


@router.get("/{user_id}/history")
async def get_meal_history(
    user_id: str,
    limit: int = 10,
    offset: int = 0,
    meal_type: Optional[MealType] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None
):
    """
    Get meal history for a user
    
    Args:
        user_id: User identifier
        limit: Maximum number of meals to return
        offset: Number of meals to skip
        meal_type: Filter by meal type
        date_from: Filter from date (YYYY-MM-DD)
        date_to: Filter to date (YYYY-MM-DD)
        
    Returns:
        List of meal entries
    """
    if user_id not in user_meals_index:
        return {
            "user_id": user_id,
            "total_meals": 0,
            "meals": []
        }
    
    # Get all meals for user
    meal_ids = user_meals_index[user_id]
    meals = [meals_db[meal_id] for meal_id in meal_ids if meal_id in meals_db]
    
    # Apply filters
    if meal_type:
        meals = [m for m in meals if m.meal_type == meal_type]
    
    if date_from:
        date_from_obj = datetime.fromisoformat(date_from)
        meals = [m for m in meals if m.timestamp >= date_from_obj]
    
    if date_to:
        date_to_obj = datetime.fromisoformat(date_to)
        meals = [m for m in meals if m.timestamp <= date_to_obj]
    
    # Sort by timestamp (newest first)
    meals.sort(key=lambda m: m.timestamp, reverse=True)
    
    # Apply pagination
    total_meals = len(meals)
    meals = meals[offset:offset + limit]
    
    return {
        "user_id": user_id,
        "total_meals": total_meals,
        "returned": len(meals),
        "meals": meals
    }


@router.get("/{user_id}/daily-summary")
async def get_daily_summary(
    user_id: str,
    date_str: Optional[str] = None
):
    """
    Get daily nutrition summary for a user
    
    Args:
        user_id: User identifier
        date_str: Date in YYYY-MM-DD format (default: today)
        
    Returns:
        Daily nutrition summary
    """
    if date_str:
        target_date = datetime.fromisoformat(date_str).date()
    else:
        target_date = date.today()
    
    if user_id not in user_meals_index:
        return DailyNutritionSummary(
            user_id=user_id,
            date=target_date.isoformat(),
            total_calories=0,
            total_protein=0,
            total_carbs=0,
            total_fat=0,
            total_fiber=0,
            meals_count=0,
            breakfast_calories=0,
            lunch_calories=0,
            dinner_calories=0,
            snack_calories=0
        )
    
    # Get meals for the day
    meal_ids = user_meals_index[user_id]
    daily_meals = []
    
    for meal_id in meal_ids:
        if meal_id in meals_db:
            meal = meals_db[meal_id]
            meal_date = meal.timestamp.date()
            if meal_date == target_date:
                daily_meals.append(meal)
    
    # Calculate totals
    total_calories = 0
    total_protein = 0
    total_carbs = 0
    total_fat = 0
    total_fiber = 0
    
    breakfast_calories = 0
    lunch_calories = 0
    dinner_calories = 0
    snack_calories = 0
    
    for meal in daily_meals:
        nutrition = meal.total_nutrition
        total_calories += nutrition.calories
        total_protein += nutrition.protein
        total_carbs += nutrition.carbs
        total_fat += nutrition.fat
        total_fiber += nutrition.fiber
        
        # Categorize by meal type
        if meal.meal_type == MealType.BREAKFAST:
            breakfast_calories += nutrition.calories
        elif meal.meal_type == MealType.LUNCH:
            lunch_calories += nutrition.calories
        elif meal.meal_type == MealType.DINNER:
            dinner_calories += nutrition.calories
        elif meal.meal_type == MealType.SNACK:
            snack_calories += nutrition.calories
    
    summary = DailyNutritionSummary(
        user_id=user_id,
        date=target_date.isoformat(),
        total_calories=round(total_calories, 1),
        total_protein=round(total_protein, 1),
        total_carbs=round(total_carbs, 1),
        total_fat=round(total_fat, 1),
        total_fiber=round(total_fiber, 1),
        meals_count=len(daily_meals),
        breakfast_calories=round(breakfast_calories, 1),
        lunch_calories=round(lunch_calories, 1),
        dinner_calories=round(dinner_calories, 1),
        snack_calories=round(snack_calories, 1)
    )
    
    return summary


@router.get("/{meal_id}")
async def get_meal(meal_id: str):
    """
    Get a specific meal by ID
    
    Args:
        meal_id: Meal identifier
        
    Returns:
        Meal entry details
    """
    if meal_id not in meals_db:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    return meals_db[meal_id]


@router.delete("/{meal_id}")
async def delete_meal(meal_id: str):
    """
    Delete a meal entry
    
    Args:
        meal_id: Meal identifier
        
    Returns:
        Success message
    """
    if meal_id not in meals_db:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    meal = meals_db[meal_id]
    user_id = meal.user_id
    
    # Remove from database
    del meals_db[meal_id]
    
    # Remove from index
    if user_id in user_meals_index:
        user_meals_index[user_id].remove(meal_id)
    
    return {
        "message": "Meal deleted successfully",
        "meal_id": meal_id
    }

