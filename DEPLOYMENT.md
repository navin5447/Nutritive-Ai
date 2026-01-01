# 🚀 Deployment Guide - Nutrition AI

## Quick Deployment Options

### 🎯 Recommended (Easiest & Free)

**Frontend**: Vercel  
**Backend**: Railway or Render

Both offer free tiers perfect for this app!

---

## 📦 Backend Deployment

### Option 1: Railway (Recommended - Easiest)

**1. Prepare Backend**
```bash
cd backend
```

**2. Deploy to Railway**
1. Visit https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repo → Choose `backend` folder
5. Add environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: `AIzaSyAcdLeDLwqFAp12xyZqW_XwSsSx-Cy83PQ`
6. Railway auto-detects Python and deploys!

**3. Get Backend URL**
- Railway provides: `https://your-app.railway.app`
- Copy this URL for frontend configuration

---

### Option 2: Render

**1. Deploy to Render**
1. Visit https://render.com
2. Sign in with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Name**: nutrition-ai-backend
   - **Root Directory**: backend
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable:
   - `GEMINI_API_KEY` = `AIzaSyAcdLeDLwqFAp12xyZqW_XwSsSx-Cy83PQ`
7. Click "Create Web Service"

**2. Get Backend URL**
- Render provides: `https://nutrition-ai-backend.onrender.com`

---

### Option 3: Heroku

**1. Install Heroku CLI**
```bash
# Download from: https://devcenter.heroku.com/articles/heroku-cli
```

**2. Deploy**
```bash
cd backend
heroku login
heroku create nutrition-ai-backend
heroku config:set GEMINI_API_KEY=AIzaSyAcdLeDLwqFAp12xyZqW_XwSsSx-Cy83PQ
git init
git add .
git commit -m "Deploy backend"
heroku git:remote -a nutrition-ai-backend
git push heroku main
```

**3. Get Backend URL**
- Heroku provides: `https://nutrition-ai-backend.herokuapp.com`

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended - Easiest)

**1. Update API URL**
First, update the frontend to use your deployed backend URL:

```javascript
// frontend/services/api.js
const API_BASE_URL = 'https://your-backend-url.railway.app';
```

**2. Deploy to Vercel**
1. Visit https://vercel.com
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repo
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

**3. Your App is Live! 🎉**
- Vercel provides: `https://nutrition-ai.vercel.app`

---

### Option 2: Netlify

**1. Update API URL**
```javascript
// frontend/services/api.js
const API_BASE_URL = 'https://your-backend-url.railway.app';
```

**2. Deploy to Netlify**
1. Visit https://netlify.com
2. Sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub → Select your repo
5. Configure:
   - **Base directory**: frontend
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. Click "Deploy site"

**3. Your App is Live! 🎉**
- Netlify provides: `https://nutrition-ai.netlify.app`

---

## 🔧 Update Frontend API URL

After deploying backend, update the frontend API URL:

**File**: `frontend/services/api.js`

```javascript
// Change from:
const API_BASE_URL = 'http://localhost:8000';

// To your deployed backend:
const API_BASE_URL = 'https://your-backend-url.railway.app';
// or
const API_BASE_URL = 'https://nutrition-ai-backend.onrender.com';
```

Then redeploy the frontend (or it will auto-deploy if using Git integration).

---

## 🌍 Environment Variables

### Backend Environment Variables:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `PORT`: Auto-set by hosting platform

### Frontend Environment Variables:
Create `frontend/.env.production`:
```bash
VITE_API_URL=https://your-backend-url.railway.app
```

Then update `frontend/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

---

## ✅ Deployment Checklist

### Backend:
- [ ] All dependencies in `requirements.txt`
- [ ] `GEMINI_API_KEY` environment variable set
- [ ] CORS configured for frontend domain
- [ ] Backend accessible via HTTPS

### Frontend:
- [ ] API URL updated to backend URL
- [ ] Build succeeds locally: `npm run build`
- [ ] Environment variables set
- [ ] Frontend accessible via HTTPS

---

## 🎯 Recommended Setup (Free Tier)

**Best combination for free deployment:**

1. **Backend**: Railway
   - 500 hours/month free
   - Auto-deploys from Git
   - Easy environment variables

2. **Frontend**: Vercel
   - Unlimited bandwidth
   - Auto-deploys from Git
   - Global CDN
   - Custom domains

**Total Cost**: $0/month for personal use! 🎉

---

## 🔒 Update CORS for Production

In `backend/main.py`, update CORS to allow your frontend domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://nutrition-ai.vercel.app",  # Add your frontend URL
        "https://your-custom-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🚀 Quick Deploy Commands

**Backend (Railway CLI)**:
```bash
cd backend
railway login
railway init
railway up
railway variables set GEMINI_API_KEY=AIzaSyAcdLeDLwqFAp12xyZqW_XwSsSx-Cy83PQ
```

**Frontend (Vercel CLI)**:
```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

---

## 📱 Test Your Deployment

After deploying:

1. Visit your frontend URL
2. Complete onboarding (welcome screen + questions)
3. Upload a food image
4. Verify AI recognition works
5. Check nutrition analysis is accurate

**Expected**: Food is correctly identified with accurate protein/nutrition data!

---

## 🆘 Troubleshooting

**Backend not starting?**
- Check logs in Railway/Render dashboard
- Verify `GEMINI_API_KEY` is set
- Check `requirements.txt` has all dependencies

**CORS errors?**
- Update `allow_origins` in `main.py` with your frontend URL
- Redeploy backend

**Frontend can't reach backend?**
- Verify API URL in `api.js`
- Check backend is running (visit backend URL)
- Check browser console for errors

**API key errors?**
- Verify key is correct in backend environment variables
- Check Gemini API quota at https://makersuite.google.com

---

## 🎉 Done!

Your Nutrition AI app is now live and accessible worldwide! Share the link and let others analyze their food nutrition! 🥗🤖

---

Need help? Check platform-specific docs:
- Railway: https://docs.railway.app
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
