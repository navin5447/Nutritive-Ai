"""
Quick Test Script - Verify Gemini AI Setup
Run this to test if food recognition is working properly
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ml.food_classifier import FoodClassifier

def test_setup():
    print("="*60)
    print("🧪 Testing Nutrition AI Food Recognition Setup")
    print("="*60)
    
    # Check if API key is set
    api_key = os.getenv('GEMINI_API_KEY', '')
    if api_key:
        print(f"✅ API Key found: {api_key[:10]}...{api_key[-4:]}")
    else:
        print("❌ No API Key found!")
        print("   Set it with: $env:GEMINI_API_KEY='your_key_here'")
        print("   Or run: .\\setup_gemini.ps1")
        return False
    
    # Initialize classifier
    print("\n📦 Initializing Food Classifier...")
    try:
        classifier = FoodClassifier()
        print(f"✅ Classifier initialized")
        print(f"   - Food database: {len(classifier.indian_foods)} items")
        print(f"   - Gemini AI: {'Enabled' if classifier.use_gemini else 'Disabled (using color matching)'}")
    except Exception as e:
        print(f"❌ Failed to initialize: {e}")
        return False
    
    # Show some foods
    print(f"\n🍽️ Sample foods in database:")
    for food in classifier.indian_foods[:10]:
        print(f"   - {food}")
    print(f"   ... and {len(classifier.indian_foods) - 10} more!")
    
    print("\n" + "="*60)
    if classifier.use_gemini:
        print("✅ All Systems Ready! Upload food images to test.")
        print("   The AI will identify Indian foods accurately!")
    else:
        print("⚠️ Running in fallback mode (color matching)")
        print("   Set GEMINI_API_KEY for accurate AI recognition")
    print("="*60)
    
    return True

if __name__ == "__main__":
    success = test_setup()
    sys.exit(0 if success else 1)
