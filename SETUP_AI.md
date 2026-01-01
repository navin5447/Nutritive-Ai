# 🤖 AI Setup Guide - Real Food Recognition

## Quick Setup (5 minutes)

### Step 1: Get Free Gemini API Key

1. **Visit Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click "Create API Key"**
4. **Copy** the generated key

### Step 2: Configure the API Key

**Option A: Environment Variable (Recommended)**
```powershell
# Windows PowerShell
$env:GEMINI_API_KEY="your_api_key_here"

# Or add permanently to system environment variables
[System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'your_api_key_here', 'User')
```

**Option B: .env File**
```powershell
cd backend
Copy-Item .env.example .env
# Edit .env and add your key
```

**Option C: Direct in Code (Not recommended for production)**
```python
# In backend/main.py, add after imports:
import os
os.environ['GEMINI_API_KEY'] = 'your_api_key_here'
```

### Step 3: Install Dependencies

```powershell
cd backend
pip install google-generativeai pillow
```

### Step 4: Restart Backend

```powershell
cd backend
uvicorn main:app --reload
```

## ✅ Verification

You should see in the backend logs:
```
✅ Gemini AI Vision initialized successfully
```

## 🎯 Features

With Gemini AI Vision, the app can now:
- ✅ Accurately identify Indian foods from images
- ✅ Detect multiple food items in one image
- ✅ Calculate precise protein and nutrition data
- ✅ Work with ANY Indian food (not just predefined items)
- ✅ Provide confidence scores for each detection

## 🆓 Free Tier Limits

Gemini API Free Tier:
- **60 requests per minute**
- **1,500 requests per day**
- More than enough for personal/demo use!

## 🔧 Troubleshooting

**Issue**: "No Gemini API key found"
- **Solution**: Set the GEMINI_API_KEY environment variable

**Issue**: "Gemini initialization failed"
- **Solution**: Check your API key is correct and active

**Issue**: "Falls back to color matching"
- **Solution**: Ensure google-generativeai is installed: `pip install google-generativeai`

## 📚 Supported Indian Foods

The app recognizes 40+ Indian foods including:
- Breakfast: Idli, Dosa, Upma, Poha, Paratha
- Main Course: Biryani, Curry, Dal, Sambar
- Bread: Roti, Chapati, Naan, Puri
- Snacks: Samosa, Vada, Pakora, Bhaji
- Sweets: Gulab Jamun, Jalebi, Ladoo
- And many more!

## 🚀 Next Steps

Once configured, simply upload any Indian food image and watch the AI:
1. Identify the food items
2. Calculate accurate nutrition (protein, carbs, fat)
3. Provide personalized health insights
4. Show portion estimates

Enjoy accurate nutrition tracking! 🎉
