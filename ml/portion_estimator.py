"""
Portion Estimator - Estimate food portion sizes from images

This module provides portion estimation using:
1. Plate size detection
2. Bounding box area ratio
3. Standard serving size assumptions
"""

try:
    import cv2  # type: ignore
    import numpy as np
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False
    print("Warning: OpenCV not available. Using simplified portion estimation.")

from typing import Dict, Tuple, Optional


class PortionEstimator:
    """
    Estimates food portion sizes using visual analysis and heuristics
    """
    
    def __init__(self):
        """Initialize portion estimator with standard references"""
        self.STANDARD_PLATE_DIAMETER = 25  # cm
        self.STANDARD_BOWL_DIAMETER = 15  # cm
        
    def detect_plate_size(self, image_path: str) -> float:
        """
        Detect plate in image and estimate its diameter
        Returns diameter in cm (or uses standard size as fallback)
        """
        if not CV2_AVAILABLE:
            # Return standard plate diameter as fallback
            return self.STANDARD_PLATE_DIAMETER
        
        try:
            img = cv2.imread(image_path)
            if img is None:
                return self.STANDARD_PLATE_DIAMETER
            
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (9, 9), 2)
            
            circles = cv2.HoughCircles(
                blurred,
                cv2.HOUGH_GRADIENT,
                dp=1,
                minDist=50,
                param1=100,
                param2=30,
                minRadius=50,
                maxRadius=400
            )
            
            if circles is not None:
                circles = np.round(circles[0, :]).astype("int")
                largest_circle = max(circles, key=lambda c: c[2])
                radius_pixels = largest_circle[2]
                
                image_height = img.shape[0]
                estimated_diameter = (radius_pixels * 2 / image_height) * self.STANDARD_PLATE_DIAMETER * 1.5
                
                return min(estimated_diameter, 30)
            
            return self.STANDARD_PLATE_DIAMETER
        except:
            return self.STANDARD_PLATE_DIAMETER
    
    def calculate_bbox_area_ratio(self, bbox: Dict[str, float]) -> float:
        """
        Calculate the ratio of bounding box area
        
        Args:
            bbox: Bounding box {'x': x, 'y': y, 'width': w, 'height': h} (normalized 0-1)
            
        Returns:
            Area ratio (0-1)
        """
        return bbox['width'] * bbox['height']
    
    def estimate_portion_grams(self, 
                                food_id: str,
                                bbox: Dict[str, float],
                                image_path: str,
                                food_category: str = 'main_course',
                                standard_serving_grams: float = 100) -> Tuple[float, str]:
        """
        Estimate portion size in grams
        
        Args:
            food_id: Food identifier
            bbox: Bounding box of detected food
            image_path: Path to image
            food_category: Category of food
            standard_serving_grams: Standard serving size in grams
            
        Returns:
            Tuple of (estimated_grams, explanation)
        """
        plate_diameter = self.detect_plate_size(image_path)
        area_ratio = self.calculate_bbox_area_ratio(bbox)
        category_factor = self._get_category_factor(food_category)
        
        # Base estimation on standard serving size and area coverage
        coverage_factor = area_ratio / 0.5  # 0.5 = 50% coverage baseline
        
        estimated_grams = standard_serving_grams * coverage_factor * category_factor
        
        # Apply reasonable bounds
        estimated_grams = max(20, min(estimated_grams, 500))
        
        explanation = (
            f"Portion estimated based on visual coverage (≈{int(area_ratio*100)}% of plate) "
            f"and standard serving size. Plate diameter: {plate_diameter:.0f}cm."
        )
        
        return round(estimated_grams, 1), explanation
    
    def _get_category_factor(self, category: str) -> float:
        """Get portion estimation factor based on food category"""
        category_map = {
            'breakfast': 0.9,
            'main_course': 1.0,
            'curry': 0.8,
            'bread': 1.2,
            'snack': 0.6,
            'side_dish': 0.5,
        }
        return category_map.get(category, 1.0)
    
    def estimate_multiple_portions(self, 
                                  detected_foods: list,
                                  image_path: str) -> Dict[str, Dict]:
        """
        Estimate portions for multiple detected foods
        
        Args:
            detected_foods: List of detected food dictionaries
            image_path: Path to image
            
        Returns:
            Dictionary mapping food_id to portion estimation results
        """
        results = {}
        
        for food in detected_foods:
            food_id = food['food_id']
            bbox = food['bounding_box']
            food_data = food.get('food_data', {})
            
            category = food_data.get('category', 'main_course')
            standard_grams = food_data.get('standard_serving', {}).get('grams', 100)
            
            estimated_grams, explanation = self.estimate_portion_grams(
                food_id=food_id,
                bbox=bbox,
                image_path=image_path,
                food_category=category,
                standard_serving_grams=standard_grams
            )
            
            results[food_id] = {
                'estimated_grams': estimated_grams,
                'explanation': explanation,
                'bbox': bbox,
                'category': category
            }
        
        return results


if __name__ == "__main__":
    estimator = PortionEstimator()
    print("Portion Estimator initialized")
    print(f"Standard plate diameter: {estimator.STANDARD_PLATE_DIAMETER}cm")

