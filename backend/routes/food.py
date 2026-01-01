"""Food Recognition Routes - Handle food image upload and recognition"""
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import shutil
import os
from pathlib import Path
import uuid
from datetime import datetime

# Import ML modules
import sys
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from ml.food_classifier import FoodClassifier
from ml.portion_estimator import PortionEstimator
from ml.nutrition_mapper import NutritionMapper

router = APIRouter(prefix="/food", tags=["Food Recognition"])

# Create upload directory
UPLOAD_DIR = Path(__file__).parent.parent.parent / "temp_uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Initialize ML modules - will use environment variables when available
food_classifier = None
portion_estimator = None
nutrition_mapper = None

def get_ml_modules():
    """Lazy initialization of ML modules to ensure environment variables are loaded"""
    global food_classifier, portion_estimator, nutrition_mapper
    if food_classifier is None:
        food_classifier = FoodClassifier()
        portion_estimator = PortionEstimator()
        nutrition_mapper = NutritionMapper()
        print(f"🤖 ML Modules initialized - Gemini: {'Enabled' if food_classifier.use_gemini else 'Disabled'}")
    return food_classifier, portion_estimator, nutrition_mapper


@router.post("/recognize")
async def recognize_food(
    file: UploadFile = File(..., description="Food image file"),
    user_id: Optional[str] = Form(None, description="User ID for personalized insights")
):
    """
    Recognize food from uploaded image and calculate nutrition
    
    Returns:
        - detected_foods: List of detected foods with confidence
        - total_nutrition: Total calories and macros
        - health_alerts: Personalized health warnings
        - explanation: How nutrition was calculated
    """
    try:
        # Get ML modules (lazy initialization)
        food_classifier, portion_estimator, nutrition_mapper = get_ml_modules()
        
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Save uploaded image with unique filename
        file_extension = Path(file.filename).suffix if file.filename else '.jpg'
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        image_path = UPLOAD_DIR / unique_filename
        
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Step 1: Classify food
        detected_foods = food_classifier.detect_multiple_foods(str(image_path))
        
        if not detected_foods:
            raise HTTPException(status_code=400, detail="No food detected in image")
        
        # Step 2: Estimate portions
        portions = portion_estimator.estimate_multiple_portions(detected_foods, str(image_path))
        
        # Step 3: Add portion estimates to detected foods
        for food in detected_foods:
            food_id = food['food_id']
            if food_id in portions:
                food['estimated_grams'] = portions[food_id]['estimated_grams']
                food['portion_explanation'] = portions[food_id]['explanation']
            else:
                food['estimated_grams'] = 100  # Default
                food['portion_explanation'] = "Standard serving size assumed"
        
        # Step 4: Calculate nutrition for each food
        for food in detected_foods:
            nutrition = nutrition_mapper.calculate_nutrition(
                food['food_id'],
                food['estimated_grams']
            )
            food['nutrition'] = nutrition
        
        # Step 5: Calculate total nutrition
        total_nutrition = nutrition_mapper.calculate_total_nutrition(detected_foods)
        
        # Step 6: Generate health alerts (personalized if user_id provided)
        user_profile = None  # TODO: Fetch from database if user_id provided
        health_alerts = nutrition_mapper.generate_health_alerts(total_nutrition, user_profile)
        
        # Step 7: Generate explanation
        explanation = nutrition_mapper.generate_explanation(detected_foods, portions)
        
        # Step 8: Assess image quality
        image_quality = food_classifier.assess_image_quality(str(image_path))
        
        # Clean up uploaded file (optional - keep for history)
        # image_path.unlink()
        
        return {
            "success": True,
            "detected_foods": detected_foods,
            "total_nutrition": total_nutrition,
            "health_alerts": health_alerts,
            "explanation": explanation,
            "image_quality_score": image_quality,
            "image_path": str(unique_filename),
            "processed_at": datetime.utcnow().isoformat()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


@router.get("/supported-foods")
async def get_supported_foods():
    """
    Get list of all supported Indian foods
    
    Returns:
        List of food items with basic information
    """
    # Get ML modules (lazy initialization)
    _, _, nutrition_mapper = get_ml_modules()
    
    foods = []
    for food_id, food_data in nutrition_mapper.food_database.items():
        foods.append({
            "id": food_id,
            "name": food_data.get('name', food_id.title()),
            "category": food_data.get('category', 'unknown'),
            "calories_per_100g": food_data.get('per_100g', {}).get('calories', 0),
            "health_tags": food_data.get('health_tags', []),
            "warnings": food_data.get('warnings', [])
        })
    
    return {
        "total_foods": len(foods),
        "foods": foods
    }


@router.get("/food-info/{food_id}")
async def get_food_info(food_id: str):
    """
    Get detailed information about a specific food
    
    Args:
        food_id: Food identifier
        
    Returns:
        Complete food nutrition and serving information
    """
    # Get ML modules (lazy initialization)
    _, _, nutrition_mapper = get_ml_modules()
    
    food_data = nutrition_mapper.food_database.get(food_id)
    
    if not food_data:
        raise HTTPException(status_code=404, detail=f"Food '{food_id}' not found")
    
    return {
        "food": food_data
    }


