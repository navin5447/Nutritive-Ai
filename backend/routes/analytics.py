"""Analytics Routes - Provide nutrition analytics and insights"""
from fastapi import APIRouter, HTTPException
from typing import Optional, List
from datetime import datetime, date, timedelta
from collections import defaultdict

router = APIRouter(prefix="/analytics", tags=["Analytics"])

# Import from other routes to access data
from routes.meal import meals_db, user_meals_index
from routes.user import users_db


@router.get("/{user_id}/weekly-summary")
async def get_weekly_summary(user_id: str, weeks: int = 1):
    """
    Get weekly nutrition summary
    
    Args:
        user_id: User identifier
        weeks: Number of weeks to analyze (default: 1)
        
    Returns:
        Weekly nutrition breakdown
    """
    if user_id not in user_meals_index:
        return {
            "user_id": user_id,
            "message": "No meal data found",
            "weekly_data": []
        }
    
    # Get date range
    end_date = date.today()
    start_date = end_date - timedelta(days=weeks * 7)
    
    # Get meals in date range
    meal_ids = user_meals_index[user_id]
    daily_totals = defaultdict(lambda: {
        'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0, 'meals': 0
    })
    
    for meal_id in meal_ids:
        if meal_id in meals_db:
            meal = meals_db[meal_id]
            meal_date = meal.timestamp.date()
            
            if start_date <= meal_date <= end_date:
                nutrition = meal.total_nutrition
                daily_totals[meal_date]['calories'] += nutrition.calories
                daily_totals[meal_date]['protein'] += nutrition.protein
                daily_totals[meal_date]['carbs'] += nutrition.carbs
                daily_totals[meal_date]['fat'] += nutrition.fat
                daily_totals[meal_date]['meals'] += 1
    
    # Format for response
    weekly_data = []
    current_date = start_date
    while current_date <= end_date:
        data = daily_totals.get(current_date, {
            'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0, 'meals': 0
        })
        weekly_data.append({
            'date': current_date.isoformat(),
            'day_name': current_date.strftime('%A'),
            **data
        })
        current_date += timedelta(days=1)
    
    # Calculate averages
    total_days = len([d for d in weekly_data if d['meals'] > 0])
    if total_days > 0:
        avg_calories = sum(d['calories'] for d in weekly_data) / total_days
        avg_protein = sum(d['protein'] for d in weekly_data) / total_days
        avg_carbs = sum(d['carbs'] for d in weekly_data) / total_days
        avg_fat = sum(d['fat'] for d in weekly_data) / total_days
    else:
        avg_calories = avg_protein = avg_carbs = avg_fat = 0
    
    return {
        "user_id": user_id,
        "period": f"{start_date.isoformat()} to {end_date.isoformat()}",
        "total_days": len(weekly_data),
        "days_with_data": total_days,
        "averages": {
            "calories": round(avg_calories, 1),
            "protein": round(avg_protein, 1),
            "carbs": round(avg_carbs, 1),
            "fat": round(avg_fat, 1)
        },
        "daily_breakdown": weekly_data
    }


@router.get("/{user_id}/macro-distribution")
async def get_macro_distribution(user_id: str, days: int = 7):
    """
    Get macronutrient distribution analysis
    
    Args:
        user_id: User identifier
        days: Number of days to analyze
        
    Returns:
        Macro distribution percentages and trends
    """
    if user_id not in user_meals_index:
        raise HTTPException(status_code=404, detail="No data found for user")
    
    # Get meals from last N days
    end_date = date.today()
    start_date = end_date - timedelta(days=days)
    
    meal_ids = user_meals_index[user_id]
    total_protein = 0
    total_carbs = 0
    total_fat = 0
    total_calories = 0
    
    for meal_id in meal_ids:
        if meal_id in meals_db:
            meal = meals_db[meal_id]
            meal_date = meal.timestamp.date()
            
            if start_date <= meal_date <= end_date:
                nutrition = meal.total_nutrition
                total_protein += nutrition.protein
                total_carbs += nutrition.carbs
                total_fat += nutrition.fat
                total_calories += nutrition.calories
    
    if total_calories == 0:
        return {
            "message": "No meal data in the specified period",
            "protein_percent": 0,
            "carbs_percent": 0,
            "fat_percent": 0
        }
    
    # Calculate macro percentages (calories from each macro)
    protein_calories = total_protein * 4  # 4 cal/g
    carbs_calories = total_carbs * 4  # 4 cal/g
    fat_calories = total_fat * 9  # 9 cal/g
    
    total_macro_calories = protein_calories + carbs_calories + fat_calories
    
    if total_macro_calories > 0:
        protein_percent = (protein_calories / total_macro_calories) * 100
        carbs_percent = (carbs_calories / total_macro_calories) * 100
        fat_percent = (fat_calories / total_macro_calories) * 100
    else:
        protein_percent = carbs_percent = fat_percent = 0
    
    # Get user targets if available
    targets = {}
    if user_id in users_db:
        user = users_db[user_id]
        targets = {
            "target_protein_percent": 25,  # Typical: 20-30%
            "target_carbs_percent": 50,  # Typical: 45-55%
            "target_fat_percent": 25,  # Typical: 20-30%
        }
    
    return {
        "user_id": user_id,
        "period_days": days,
        "total_macros_grams": {
            "protein": round(total_protein, 1),
            "carbs": round(total_carbs, 1),
            "fat": round(total_fat, 1)
        },
        "distribution_percent": {
            "protein": round(protein_percent, 1),
            "carbs": round(carbs_percent, 1),
            "fat": round(fat_percent, 1)
        },
        "targets": targets,
        "recommendations": _get_macro_recommendations(protein_percent, carbs_percent, fat_percent)
    }


@router.get("/{user_id}/goal-progress")
async def get_goal_progress(user_id: str):
    """
    Track progress towards health goals
    
    Args:
        user_id: User identifier
        
    Returns:
        Progress metrics and insights
    """
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[user_id]
    
    # Get today's summary
    today = date.today()
    daily_calories = 0
    daily_protein = 0
    
    if user_id in user_meals_index:
        meal_ids = user_meals_index[user_id]
        for meal_id in meal_ids:
            if meal_id in meals_db:
                meal = meals_db[meal_id]
                if meal.timestamp.date() == today:
                    nutrition = meal.total_nutrition
                    daily_calories += nutrition.calories
                    daily_protein += nutrition.protein
    
    # Calculate progress
    calorie_target = user.daily_calorie_target
    protein_target = user.daily_protein_target_g
    
    calorie_progress = (daily_calories / calorie_target * 100) if calorie_target > 0 else 0
    protein_progress = (daily_protein / protein_target * 100) if protein_target > 0 else 0
    
    # Determine status
    if calorie_progress < 80:
        calorie_status = "Under target"
    elif calorie_progress <= 110:
        calorie_status = "On target"
    else:
        calorie_status = "Over target"
    
    if protein_progress < 80:
        protein_status = "Needs improvement"
    elif protein_progress <= 120:
        protein_status = "Good"
    else:
        protein_status = "Excellent"
    
    return {
        "user_id": user_id,
        "health_goal": user.health_goal,
        "date": today.isoformat(),
        "calorie_progress": {
            "consumed": round(daily_calories, 1),
            "target": calorie_target,
            "remaining": max(0, calorie_target - daily_calories),
            "percent": round(calorie_progress, 1),
            "status": calorie_status
        },
        "protein_progress": {
            "consumed": round(daily_protein, 1),
            "target": protein_target,
            "remaining": max(0, protein_target - daily_protein),
            "percent": round(protein_progress, 1),
            "status": protein_status
        },
        "bmi": user.bmi
    }


@router.get("/{user_id}/food-frequency")
async def get_food_frequency(user_id: str, days: int = 30):
    """
    Analyze most frequently consumed foods
    
    Args:
        user_id: User identifier
        days: Number of days to analyze
        
    Returns:
        Food frequency analysis
    """
    if user_id not in user_meals_index:
        return {
            "message": "No meal data found",
            "food_frequency": []
        }
    
    # Get meals from last N days
    end_date = date.today()
    start_date = end_date - timedelta(days=days)
    
    food_counts = defaultdict(lambda: {'count': 0, 'total_grams': 0.0, 'name': ''})
    
    meal_ids = user_meals_index[user_id]
    for meal_id in meal_ids:
        if meal_id in meals_db:
            meal = meals_db[meal_id]
            meal_date = meal.timestamp.date()
            
            if start_date <= meal_date <= end_date:
                for food in meal.detected_foods:
                    food_counts[food.food_id]['count'] = int(food_counts[food.food_id]['count']) + 1
                    food_counts[food.food_id]['total_grams'] = float(food_counts[food.food_id]['total_grams']) + float(food.estimated_portion_g)
                    food_counts[food.food_id]['name'] = food.food_name
    
    # Sort by frequency
    frequency_list = [
        {
            'food_id': food_id,
            'food_name': data['name'],
            'times_consumed': int(data['count']),
            'total_grams': round(float(data['total_grams']), 1),
            'avg_portion_g': round(float(data['total_grams']) / float(data['count']), 1)
        }
        for food_id, data in food_counts.items()
    ]
    
    frequency_list.sort(key=lambda x: x['times_consumed'], reverse=True)
    
    return {
        "user_id": user_id,
        "period_days": days,
        "unique_foods": len(frequency_list),
        "food_frequency": frequency_list[:20]  # Top 20
    }


def _get_macro_recommendations(protein_percent: float, carbs_percent: float, fat_percent: float) -> List[str]:
    """Generate recommendations based on macro distribution"""
    recommendations = []
    
    if protein_percent < 20:
        recommendations.append("Increase protein intake with dal, paneer, eggs, or lean meats")
    elif protein_percent > 35:
        recommendations.append("Consider balancing protein with more complex carbs")
    
    if carbs_percent < 40:
        recommendations.append("Add more whole grains, rice, or chapati for energy")
    elif carbs_percent > 60:
        recommendations.append("Reduce simple carbs and increase protein/healthy fats")
    
    if fat_percent < 15:
        recommendations.append("Include healthy fats from nuts, seeds, or ghee")
    elif fat_percent > 35:
        recommendations.append("Reduce fried foods and use healthier cooking methods")
    
    if not recommendations:
        recommendations.append("Your macro balance looks good! Keep it up! 👍")
    
    return recommendations

