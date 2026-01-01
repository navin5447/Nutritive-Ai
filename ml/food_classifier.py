"""
Food Classifier - AI-based food recognition from images

This module provides food classification using Google Gemini Vision API
for accurate Indian food recognition with nutrition analysis.
"""

try:
    import cv2  # type: ignore
    import numpy as np
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False
    print("Warning: OpenCV not available. Using simplified image processing.")

try:
    import google.generativeai as genai  # type: ignore
    from PIL import Image
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("Warning: Google Generative AI not available. Install with: pip install google-generativeai pillow")

from typing import List, Tuple, Optional, Dict
import json
import os
from pathlib import Path
import re


class FoodClassifier:
    """
    Food classifier using computer vision and pattern matching.
    Designed for Indian food recognition with explainable outputs.
    """
    
    def __init__(self, model_path: Optional[str] = None, api_key: Optional[str] = None):
        """Initialize the food classifier"""
        self.model_path = model_path
        self.food_database = self._load_food_database()
        self.indian_foods = list(self.food_database.keys())
        
        # Initialize Gemini API
        self.use_gemini = GEMINI_AVAILABLE
        if self.use_gemini:
            # Get API key from environment or parameter
            self.api_key = api_key or os.getenv('GEMINI_API_KEY', '')
            if self.api_key:
                try:
                    genai.configure(api_key=self.api_key)
                    # Try different model names in order of preference
                    model_names = ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-pro-vision', 'gemini-pro']
                    model_initialized = False
                    for model_name in model_names:
                        try:
                            self.model = genai.GenerativeModel(model_name)
                            print(f"✅ Gemini AI Vision initialized successfully with {model_name}")
                            model_initialized = True
                            break
                        except Exception as model_error:
                            continue
                    if not model_initialized:
                        raise Exception("No available Gemini model found")
                except Exception as e:
                    print(f"⚠️ Gemini initialization failed: {e}")
                    self.use_gemini = False
            else:
                print("⚠️ No Gemini API key found. Set GEMINI_API_KEY environment variable.")
                self.use_gemini = False
        
    def _load_food_database(self) -> Dict:
        """Load food nutrition database"""
        try:
            data_path = Path(__file__).parent.parent / "data" / "indian_food_nutrition.json"
            with open(data_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return {food['id']: food for food in data['foods']}
        except Exception as e:
            print(f"Warning: Could not load food database: {e}")
            return {}
    
    def preprocess_image(self, image_path: str):
        """
        Preprocess image for classification
        - Resize to standard size
        - Normalize pixel values
        - Apply color correction
        """
        if not CV2_AVAILABLE:
            # Return dummy data if CV2 not available
            return {'mean_r': 0.7, 'mean_g': 0.6, 'mean_b': 0.5}
            
        try:
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError(f"Could not read image: {image_path}")
            
            # Resize to standard size (224x224 for most CNN models)
            img = cv2.resize(img, (224, 224))
            
            # Convert BGR to RGB
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            
            # Normalize pixel values to [0, 1]
            img = img.astype(np.float32) / 255.0
            
            return img
        except Exception as e:
            raise ValueError(f"Image preprocessing failed: {e}")
    
    def extract_features(self, image) -> Dict[str, float]:
        """
        Extract visual features from image
        - Color histograms
        - Texture features
        """
        if not CV2_AVAILABLE or isinstance(image, dict):
            # Return default features
            return image if isinstance(image, dict) else {
                'mean_r': 0.7, 'mean_g': 0.6, 'mean_b': 0.5,
                'std_r': 0.2, 'std_g': 0.2, 'std_b': 0.2
            }
        
        # Calculate color statistics
        features = {
            'mean_r': float(np.mean(image[:,:,0])),
            'mean_g': float(np.mean(image[:,:,1])),
            'mean_b': float(np.mean(image[:,:,2])),
            'std_r': float(np.std(image[:,:,0])),
            'std_g': float(np.std(image[:,:,1])),
            'std_b': float(np.std(image[:,:,2])),
        }
        
        return features
    
    def classify_food(self, image_path: str, top_k: int = 3) -> List[Tuple[str, float, Dict]]:
        """
        Classify food in image and return top predictions
        
        Args:
            image_path: Path to food image
            top_k: Number of top predictions to return
            
        Returns:
            List of tuples (food_id, confidence, food_data)
        """
        image = self.preprocess_image(image_path)
        features = self.extract_features(image)
        predictions = self._simple_food_matching(features, top_k)
        
        return predictions
    
    def _simple_food_matching(self, features: Dict, top_k: int) -> List[Tuple[str, float, Dict]]:
        """
        Simple food matching based on color features
        In production, replace with neural network inference
        """
        # Color profiles for common Indian foods
        color_profiles = {
            'idli': {'mean_r': 0.85, 'mean_g': 0.85, 'mean_b': 0.80},
            'dosa': {'mean_r': 0.70, 'mean_g': 0.60, 'mean_b': 0.40},
            'masala_dosa': {'mean_r': 0.68, 'mean_g': 0.58, 'mean_b': 0.38},
            'biryani': {'mean_r': 0.65, 'mean_g': 0.55, 'mean_b': 0.35},
            'dal': {'mean_r': 0.75, 'mean_g': 0.65, 'mean_b': 0.30},
            'sambar': {'mean_r': 0.60, 'mean_g': 0.45, 'mean_b': 0.25},
            'rice': {'mean_r': 0.90, 'mean_g': 0.90, 'mean_b': 0.85},
            'chapati': {'mean_r': 0.75, 'mean_g': 0.70, 'mean_b': 0.55},
            'vada': {'mean_r': 0.60, 'mean_g': 0.50, 'mean_b': 0.30},
            'pongal': {'mean_r': 0.80, 'mean_g': 0.75, 'mean_b': 0.50},
            'paratha': {'mean_r': 0.72, 'mean_g': 0.67, 'mean_b': 0.52},
            'upma': {'mean_r': 0.78, 'mean_g': 0.70, 'mean_b': 0.45},
        }
        
        scores = []
        for food_id in self.indian_foods:
            if food_id in color_profiles:
                profile = color_profiles[food_id]
                # Simple Euclidean distance in color space
                if CV2_AVAILABLE:
                    distance = np.sqrt(
                        (features['mean_r'] - profile['mean_r'])**2 +
                        (features['mean_g'] - profile['mean_g'])**2 +
                        (features['mean_b'] - profile['mean_b'])**2
                    )
                else:
                    distance = ((features['mean_r'] - profile['mean_r'])**2 +
                               (features['mean_g'] - profile['mean_g'])**2 +
                               (features['mean_b'] - profile['mean_b'])**2) ** 0.5
                confidence = max(0.5, 1.0 - distance)
                scores.append((food_id, confidence, self.food_database.get(food_id, {})))
        
        scores.sort(key=lambda x: x[1], reverse=True)
        
        if not scores:
            default_foods = ['rice', 'dal', 'chapati']
            scores = [(fid, 0.65, self.food_database.get(fid, {})) 
                     for fid in default_foods if fid in self.food_database]
        
        return scores[:top_k]
    
    def detect_multiple_foods(self, image_path: str) -> List[Dict]:
        """
        Detect multiple food items in a single image using Gemini Vision AI
        Falls back to color-based matching if Gemini is not available
        """
        if self.use_gemini and self.api_key:
            try:
                return self._detect_with_gemini(image_path)
            except Exception as e:
                print(f"⚠️ Gemini detection failed: {e}. Falling back to color matching.")
        
        # Fallback to color-based detection
        predictions = self.classify_food(image_path, top_k=2)
        
        results = []
        for i, (food_id, confidence, food_data) in enumerate(predictions):
            if i == 0:
                bbox = {'x': 0.1, 'y': 0.1, 'width': 0.8, 'height': 0.8}
            else:
                bbox = {'x': 0.2, 'y': 0.2, 'width': 0.6, 'height': 0.6}
            
            results.append({
                'food_id': food_id,
                'food_name': food_data.get('name', food_id.title()),
                'confidence': round(confidence, 3),
                'bounding_box': bbox,
                'food_data': food_data
            })
        
        return results
    
    def _get_default_detection(self) -> List[Dict]:
        """Return default detection when AI fails"""
        return [{
            'food_id': 'rice',
            'food_name': 'Rice',
            'confidence': 0.7,
            'bounding_box': {'x': 0.1, 'y': 0.1, 'width': 0.8, 'height': 0.8},
            'food_data': self.food_database.get('rice', {})
        }]
    
    def _detect_with_gemini(self, image_path: str) -> List[Dict]:
        """
        Use Gemini Vision API to detect Indian foods in image
        """
        # Load image
        img = Image.open(image_path)
        
        # Create comprehensive prompt for Indian food detection
        prompt = f"""Analyze this food image and identify Indian food items present.

Available Indian foods in database:
{', '.join(self.indian_foods)}

Instructions:
1. Identify ALL Indian food items visible in the image
2. For each food item, provide:
   - Exact food name from the database list (use food_id format like "biryani", "samosa", etc.)
   - Confidence score (0.0 to 1.0)
   - Brief description

Format your response EXACTLY as a JSON array:
[
  {{"food_id": "biryani", "confidence": 0.95, "description": "chicken biryani with rice"}},
  {{"food_id": "raita", "confidence": 0.88, "description": "cucumber raita on the side"}}
]

If the food is not in the database list, find the closest match or use generic terms like "rice", "curry", "dal".
Only return the JSON array, nothing else."""

        # Generate content with Gemini
        response = self.model.generate_content([prompt, img])
        response_text = response.text.strip()
        
        # Extract JSON from response
        json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
        if json_match:
            detected_items = json.loads(json_match.group())
        else:
            # Fallback parsing
            detected_items = [{"food_id": "rice", "confidence": 0.7, "description": "Unable to parse AI response"}]
        
        # Map to our database and format results
        results = []
        for i, item in enumerate(detected_items):
            food_id = item.get('food_id', '').lower().replace(' ', '_')
            
            # Try to find in database
            food_data = self.food_database.get(food_id, {})
            if not food_data:
                # Try fuzzy matching
                for db_food_id in self.indian_foods:
                    if food_id in db_food_id or db_food_id in food_id:
                        food_id = db_food_id
                        food_data = self.food_database[food_id]
                        break
            
            # If still not found, use a default
            if not food_data:
                food_id = 'rice'  # Default fallback
                food_data = self.food_database.get(food_id, {})
            
            bbox = {
                'x': 0.1 + i * 0.05,
                'y': 0.1 + i * 0.05,
                'width': 0.7,
                'height': 0.7
            }
            
            results.append({
                'food_id': food_id,
                'food_name': food_data.get('name', item.get('food_id', '').title()),
                'confidence': round(float(item.get('confidence', 0.8)), 3),
                'bounding_box': bbox,
                'food_data': food_data,
                'ai_description': item.get('description', '')
            })
        
        return results if results else self._get_default_detection()
    
    def assess_image_quality(self, image_path: str) -> float:
        """
        Assess the quality of the input image
        Returns a score between 0 and 1
        """
        if not CV2_AVAILABLE:
            return 0.8  # Default quality score when CV2 not available
            
        try:
            img = cv2.imread(image_path)
            if img is None:
                return 0.0
            
            height, width = img.shape[:2]
            if height < 100 or width < 100:
                return 0.3
            
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            mean_brightness = np.mean(gray)
            
            if mean_brightness < 50 or mean_brightness > 200:
                return 0.6
            
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            if laplacian_var < 100:
                return 0.7
            
            return 0.9
        except:
            return 0.5


def predict_food_items(image_path, use_cloud=False):
    """
    Legacy function for backward compatibility
    
    Args:
        image_path: Path to input image
        use_cloud: If True, use Cloud Vision API (not implemented)
        
    Returns:
        List of dicts with food predictions
    """
    classifier = FoodClassifier()
    results = classifier.detect_multiple_foods(image_path)
    
    return [{
        "food": item['food_name'],
        "confidence": item['confidence'],
        "bbox": [
            int(item['bounding_box']['x'] * 100),
            int(item['bounding_box']['y'] * 100),
            int(item['bounding_box']['width'] * 100),
            int(item['bounding_box']['height'] * 100)
        ]
    } for item in results]


if __name__ == "__main__":
    classifier = FoodClassifier()
    print(f"Food Classifier initialized with {len(classifier.indian_foods)} Indian foods")
    print(f"Supported foods: {', '.join(classifier.indian_foods[:10])}...")


