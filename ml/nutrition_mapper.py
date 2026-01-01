"""
Nutrition Mapper - Maps detected foods to nutrition values and generates health insights

This module provides:
1. Complete nutrition breakdown
2. Health alerts based on user profile
3. Explainable AI outputs
4. Personalized recommendations
"""

import json
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import sys

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))


class NutritionInfo:
    """Nutrition information structure"""
    def __init__(self, calories=0, protein=0, carbs=0, fat=0, fiber=0, sugar=0, sodium=0):
        self.calories = calories
        self.protein = protein
        self.carbs = carbs
        self.fat = fat
        self.fiber = fiber
        self.sugar = sugar
        self.sodium = sodium


class NutritionMapper:
    """
    Maps detected foods to nutrition values and provides health insights
    """
    
    def __init__(self, nutrition_db_path: Optional[str] = None):
        """Initialize nutrition mapper with food database"""
        if nutrition_db_path is None:
            db_path = Path(__file__).parent.parent / "data" / "indian_food_nutrition.json"
        else:
            db_path = Path(nutrition_db_path)
        
        self.food_database = self._load_nutrition_database(db_path)
    
    def _load_nutrition_database(self, db_path: Path) -> Dict:
        """Load nutrition database from JSON file"""
        try:
            with open(db_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return {food['id']: food for food in data['foods']}
        except Exception as e:
            print(f"Error loading nutrition database: {e}")
            return {}
    
    def calculate_nutrition(self, 
                          food_id: str,
                          portion_grams: float) -> Dict:
        """
        Calculate nutrition for a specific portion of food
        
        Args:
            food_id: Food identifier
            portion_grams: Portion size in grams
            
        Returns:
            Dictionary with nutrition values
        """
        food_data = self.food_database.get(food_id)
        
        if not food_data:
            return {
                'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0,
                'fiber': 0, 'sugar': 0, 'sodium': 0
            }
        
        nutrition_per_100g = food_data['per_100g']
        factor = portion_grams / 100.0
        
        return {
            'calories': round(nutrition_per_100g['calories'] * factor, 1),
            'protein': round(nutrition_per_100g['protein'] * factor, 1),
            'carbs': round(nutrition_per_100g['carbs'] * factor, 1),
            'fat': round(nutrition_per_100g['fat'] * factor, 1),
            'fiber': round(nutrition_per_100g['fiber'] * factor, 1),
            'sugar': round(nutrition_per_100g['sugar'] * factor, 1),
            'sodium': round(nutrition_per_100g['sodium'] * factor, 1)
        }
    
    def calculate_total_nutrition(self, detected_foods: List[Dict]) -> Dict:
        """
        Calculate total nutrition for all detected foods
        
        Args:
            detected_foods: List of detected food dictionaries with portions
            
        Returns:
            Total nutrition dictionary
        """
        total = {
            'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0,
            'fiber': 0, 'sugar': 0, 'sodium': 0
        }
        
        for food in detected_foods:
            food_nutrition = self.calculate_nutrition(
                food['food_id'],
                food.get('estimated_grams', 100)
            )
            
            for key in total:
                total[key] += food_nutrition[key]
        
        # Round total values
        for key in total:
            total[key] = round(total[key], 1)
        
        return total
    
    def generate_health_alerts(self, 
                              nutrition: Dict,
                              user_profile: Optional[Dict] = None) -> List[str]:
        """
        Generate health alerts based on nutrition values and user profile
        
        Args:
            nutrition: Nutrition information for the meal
            user_profile: User's health profile (optional)
            
        Returns:
            List of alert messages
        """
        alerts = []
        
        # General health alerts
        if nutrition['calories'] > 800:
            alerts.append(
                "⚠️ High Calorie Meal: This meal contains over 800 calories. "
                "Consider balancing with lighter meals today."
            )
        
        if nutrition['fat'] > 30:
            alerts.append(
                "🚨 High Fat Content: This meal contains significant fat. "
                "Excessive fat intake may impact heart health."
            )
        
        if nutrition['sodium'] > 1000:
            alerts.append(
                "⚠️ High Sodium: This meal exceeds 1000mg of sodium. "
                "High sodium intake can raise blood pressure."
            )
        
        if nutrition['sugar'] > 15:
            alerts.append(
                "🍭 High Sugar: This meal contains significant sugar. "
                "Monitor your sugar intake throughout the day."
            )
        
        # Personalized alerts
        if user_profile:
            daily_target = user_profile.get('daily_calorie_target', 2000)
            
            if nutrition['calories'] > daily_target * 0.4:
                alerts.append(
                    f"🎯 This meal is {int(nutrition['calories']/daily_target*100)}% of your daily calorie target "
                    f"({daily_target} calories)."
                )
            
            health_goal = user_profile.get('health_goal', 'maintenance')
            
            if health_goal == 'weight_loss':
                if nutrition['carbs'] > 60:
                    alerts.append(
                        "🎯 Weight Loss Goal: Consider reducing carbohydrate portions for better results."
                    )
            
            if health_goal == 'muscle_gain':
                protein_target = user_profile.get('daily_protein_target_g', 120) * 0.3
                if nutrition['protein'] < protein_target:
                    alerts.append(
                        f"💪 Muscle Gain Goal: This meal has {nutrition['protein']}g protein. "
                        f"Consider adding {int(protein_target - nutrition['protein'])}g more protein."
                    )
        
        if not alerts:
            alerts.append("✅ This meal looks balanced and healthy!")
        
        return alerts
    
    def generate_explanation(self, 
                           detected_foods: List[Dict],
                           portions: Dict[str, Dict]) -> str:
        """
        Generate explainable AI output describing how nutrition was calculated
        
        Args:
            detected_foods: List of detected foods
            portions: Portion estimation results
            
        Returns:
            Explanation string
        """
        explanation_parts = []
        
        explanation_parts.append(
            "📊 **Nutrition Calculation Methodology:**\n"
        )
        
        for food in detected_foods:
            food_id = food['food_id']
            food_name = food['food_name']
            portion_info = portions.get(food_id, {})
            estimated_grams = portion_info.get('estimated_grams', 100)
            
            food_data = self.food_database.get(food_id, {})
            cal_per_100g = food_data.get('per_100g', {}).get('calories', 0)
            actual_calories = cal_per_100g * (estimated_grams / 100)
            
            explanation_parts.append(
                f"• **{food_name}**: Estimated portion {estimated_grams}g "
                f"({cal_per_100g} cal/100g) = {actual_calories:.0f} calories"
            )
        
        explanation_parts.append(
            "\n🧠 **Portion Estimation Method**: "
            "Based on visual plate coverage analysis, bounding box area calculation, "
            "and standard serving size references from Indian food nutrition database."
        )
        
        return "\n".join(explanation_parts)
    
    def get_food_health_tags(self, food_id: str) -> Tuple[List[str], List[str]]:
        """
        Get health tags and warnings for a specific food
        
        Returns:
            Tuple of (health_tags, warnings)
        """
        food_data = self.food_database.get(food_id, {})
        return (
            food_data.get('health_tags', []),
            food_data.get('warnings', [])
        )
    
    def get_nutritional_advice(self, 
                              nutrition: Dict,
                              user_profile: Optional[Dict] = None) -> List[str]:
        """
        Provide nutritional advice based on meal composition
        
        Returns:
            List of advice strings
        """
        advice = []
        
        protein_ratio = (nutrition['protein'] * 4) / max(nutrition['calories'], 1)
        
        if protein_ratio < 0.15:
            advice.append(
                "🥚 Consider adding more protein sources (dal, paneer, chicken, eggs) to this meal."
            )
        
        if nutrition['fiber'] < 5:
            advice.append(
                "🥗 Add more fiber with vegetables, whole grains, or lentils for better digestion."
            )
        
        if nutrition['fat'] > nutrition['protein'] * 2:
            advice.append(
                "⚖️ This meal is high in fat relative to protein. Balance with lean proteins."
            )
        
        return advice


if __name__ == "__main__":
    mapper = NutritionMapper()
    print(f"Nutrition Mapper initialized with {len(mapper.food_database)} foods")

