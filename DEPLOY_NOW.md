# 🚀 Quick Deploy - Choose Your Method

## 🎯 Fastest: Railway + Vercel (5 minutes)

### Step 1: Deploy Backend (2 min)
1. Visit **https://railway.app**
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repo → Choose **backend** folder
4. Add environment variable:
   - `GEMINI_API_KEY` = `AIzaSyAcdLeDLwqFAp12xyZqW_XwSsSx-Cy83PQ`
5. **Copy the Railway URL** (e.g., `https://nutrition-ai-production.up.railway.app`)

### Step 2: Deploy Frontend (3 min)
1. Create `frontend/.env.production`:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app
   ```
   (Use the URL from Step 1)

2. Visit **https://vercel.com**
3. Click "Add New Project" → Import from GitHub
4. Select your repo → Choose **frontend** folder
5. Click "Deploy"

### Step 3: Done! 🎉
Your app is live at `https://nutrition-ai.vercel.app`

---

## 📋 Full Guide

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for:
- Other hosting options (Render, Heroku, Netlify)
- Custom domain setup
- Environment variables
- Troubleshooting
- Production best practices

---

## ⚡ CLI Deployment (Advanced)

### Backend (Railway):
```bash
npm install -g @railway/cli
railway login
railway init
railway up
railway variables set GEMINI_API_KEY=AIzaSyAcdLeDLwqFAp12xyZqW_XwSsSx-Cy83PQ
```

### Frontend (Vercel):
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 🔧 Before Deploying

1. **Test locally first**:
   ```bash
   # Backend
   cd backend
   uvicorn main:app --reload
   
   # Frontend (new terminal)
   cd frontend
   npm run dev
   ```

2. **Build frontend locally**:
   ```bash
   cd frontend
   npm run build
   ```
   If build succeeds, you're ready to deploy!

---

## 🌍 What Gets Deployed

### Backend:
- FastAPI app with Gemini AI
- 36 Indian food database
- Real-time food recognition
- Nutrition calculation API

### Frontend:
- React + Vite app
- Dark gym theme UI
- Animated onboarding
- Food upload & analysis
- Nutrition dashboard

---

## 🆓 Free Tier Limits

**Railway** (Backend):
- 500 hours/month
- 512 MB RAM
- Perfect for this app!

**Vercel** (Frontend):
- Unlimited bandwidth
- 100 GB bandwidth/month
- Way more than needed!

**Total Cost**: **$0/month** 🎉

---

## ✅ Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] `GEMINI_API_KEY` set in backend
- [ ] Frontend `.env.production` has backend URL
- [ ] Frontend deployed and accessible
- [ ] Test food upload on live site
- [ ] Verify AI recognition works
- [ ] Share your live link! 🚀

---

Need help? Check **[DEPLOYMENT.md](DEPLOYMENT.md)** for detailed instructions!
