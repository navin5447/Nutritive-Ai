# 🥗 Nutrition AI - Frontend

> Professional, production-ready React frontend for AI-powered nutrition tracking

## ✨ What's New

This is a **complete redesign** from a basic demo to a professional health application with:

- 🎯 **Multi-step onboarding wizard** - Collects user health data
- 🏠 **Professional homepage** - Hero section with "How It Works"
- 📸 **Smart upload experience** - Drag & drop with visual feedback
- 📊 **Results dashboard** - Detailed nutrition breakdown with charts
- 👤 **User profile management** - Edit health goals and preferences
- 🧭 **Navigation system** - Seamless routing between pages

## 🎨 Design System

- **Colors**: Soft pastel health theme (teal, green, blue)
- **Components**: Rounded corners, subtle shadows, gradient buttons
- **Typography**: Clean hierarchy with Inter font
- **Responsive**: Mobile-first design with Tailwind CSS
- **Animations**: Smooth transitions and loading states

## 📁 Component Structure

```
src/
├── components/
│   ├── OnboardingWizard.jsx    # 4-step user onboarding
│   ├── Navbar.jsx               # Top navigation bar
│   ├── HeroSection.jsx          # Landing page hero
│   ├── UploadCard.jsx           # Drag & drop upload
│   ├── ResultDashboard.jsx      # Nutrition results display
│   ├── ProfilePage.jsx          # User profile editor
│   └── HistoryPage.jsx          # Meal history (placeholder)
├── App.js                       # Main router & logic
├── main.jsx                     # React entry point
└── index.css                    # Tailwind + custom styles
```

## 🚀 Features

### 1️⃣ Onboarding Wizard
- **Step 1**: Age & Gender
- **Step 2**: Height & Weight (with BMI calculation)
- **Step 3**: Health Goal selection
- **Step 4**: Dietary preference & Activity level
- **Progress bar** showing completion percentage
- **Validation** on each step before proceeding
- **LocalStorage** persistence for user data

### 2️⃣ Hero/Landing Page
- Eye-catching gradient background
- CTA buttons (Scan Food / Upload Image)
- "How It Works" visual steps (4 cards)
- Features grid showcasing capabilities
- Professional copywriting

### 3️⃣ Smart Upload
- Drag & drop file upload
- Image preview before analysis
- Support badge "🇮🇳 Supports Indian Foods"
- Loading states with spinner
- Success confirmation message
- Info cards (accuracy, speed, privacy)

### 4️⃣ Results Dashboard
- **Macro cards**: Calories, Protein, Carbs, Fat
- **Detected foods** with confidence scores
- **Portion estimation** in grams
- **Pie chart** for macro distribution (using Recharts)
- **Health alerts** personalized to user goals
- **Explainable AI** section showing calculation method
- **Action buttons**: Scan another meal / View history

### 5️⃣ Profile Page
- **Stats cards**: Age, BMI, Health Goal
- **Editable form** for all user data
- **BMI calculator** with category (Normal, Overweight, etc.)
- **Personalized recommendations** based on goals
- **Reset profile** option

### 6️⃣ Navigation
- Sticky top navbar with logo
- Desktop menu: Dashboard, History, Profile
- Mobile bottom navigation
- "Scan Food" CTA button always visible
- Active route highlighting

## 🛠️ Tech Stack

- **React 18.2** - UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS 3.3** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **Axios** - HTTP requests
- **Vite** - Build tool

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🔧 Configuration

### LocalStorage Keys
- `onboardingComplete`: "true" when wizard is done
- `userProfile`: JSON object with user data
- `latestScanResult`: Most recent food scan result

### API Endpoint
Backend URL: `http://localhost:8000`
- POST `/food/recognize` - Food image analysis

## 🎯 User Flow

1. **First Visit** → Onboarding Wizard (4 steps)
2. **Complete Onboarding** → Hero/Landing Page
3. **Click "Scan Food"** → Upload Page
4. **Upload Image** → AI Analysis → Results Dashboard
5. **View Profile** → Edit health data
6. **View History** → Coming soon (placeholder)

## 🧩 Component Details

### OnboardingWizard.jsx
- Multi-step form with validation
- Progress bar animation
- Button states (disabled until valid)
- Saves to localStorage on completion
- Triggers app re-render after completion

### Navbar.jsx
- Responsive design (desktop + mobile)
- Active route styling
- Logo with gradient
- Sticky positioning

### HeroSection.jsx
- Gradient background
- Feature cards grid
- "How It Works" steps
- CTA buttons routing to upload

### UploadCard.jsx
- Drag & drop events (dragenter, dragleave, drop)
- File validation (image types only)
- Preview state management
- Axios POST request to backend
- Navigation to dashboard with results

### ResultDashboard.jsx
- Fetches data from navigation state or localStorage
- Pie chart using Recharts library
- Conditional rendering for health alerts
- Personalized insights based on user profile
- Mobile-responsive grid layout

### ProfilePage.jsx
- Edit mode toggle
- Form validation
- BMI calculation with category
- Conditional recommendations
- Reset profile confirmation

## 🎨 Styling Guidelines

### Colors
```css
Primary: Teal (#14b8a6, #0d9488)
Secondary: Green (#10b981, #059669)
Accent: Blue (#3b82f6), Purple (#8b5cf6)
Warning: Amber (#f59e0b)
Success: Green (#22c55e)
Error: Red (#ef4444)
```

### Spacing
- Container: `max-w-7xl mx-auto px-4`
- Section gaps: `gap-6` (1.5rem)
- Card padding: `p-6` (1.5rem)
- Border radius: `rounded-xl` (0.75rem)

### Shadows
- Cards: `shadow-lg`
- Hover: `hover:shadow-xl`
- Buttons: `shadow-md`

## 📱 Responsive Design

- **Mobile**: Stack cards, bottom navigation
- **Tablet**: 2-column grids
- **Desktop**: 3-4 column grids, top navigation

Breakpoints (Tailwind):
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px

## 🚧 Future Enhancements

- [ ] History page with calendar view
- [ ] Weekly/monthly analytics charts
- [ ] Meal comparison feature
- [ ] Export reports as PDF
- [ ] Dark mode toggle
- [ ] Notifications for goal milestones
- [ ] Social sharing of meals
- [ ] Camera capture (not just upload)

## 🐛 Known Issues

- History page is placeholder (not implemented)
- No offline mode
- Camera capture not yet functional
- No real-time validation for onboarding

## 📄 License

MIT License - See main project README

---

**Built with ❤️ for health-conscious users**
