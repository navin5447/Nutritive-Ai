import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Camera, TrendingUp, AlertCircle, Lightbulb, Target, Activity, UtensilsCrossed, PieChart as PieChartIcon, ChevronDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Counter animation hook for numbers
const useCountUp = (end, duration = 1000, delay = 0) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated || !end) return;
    
    const timer = setTimeout(() => {
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Ease out quad
        const easeProgress = 1 - Math.pow(1 - progress, 2);
        setCount(Math.floor(easeProgress * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setHasAnimated(true);
        }
      };
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [end, duration, delay, hasAnimated]);

  return count;
};

const ResultDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    // Get scan result from navigation state or localStorage
    const result = location.state?.scanResult || JSON.parse(localStorage.getItem('latestScanResult') || 'null');
    const profile = JSON.parse(localStorage.getItem('userProfile') || 'null');
    
    setScanResult(result);
    setUserProfile(profile);
  }, [location]);

  // Animated values - MUST be called before any conditional returns
  const calories = useCountUp(scanResult?.total_nutrition?.calories || 0, 1200, 200);
  const protein = useCountUp(scanResult?.total_nutrition?.protein || 0, 1200, 300);
  const carbs = useCountUp(scanResult?.total_nutrition?.carbs || 0, 1200, 400);
  const fat = useCountUp(scanResult?.total_nutrition?.fat || 0, 1200, 500);

  if (!scanResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Scan Results</h2>
          <p className="text-gray-600 mb-6">Upload a food image to get started</p>
          <button
            onClick={() => navigate('/upload')}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl font-semibold"
          >
            Scan Food Now
          </button>
        </div>
      </div>
    );
  }

  const { detected_foods, total_nutrition, health_alerts, explanation } = scanResult;

  // Prepare macro data for pie chart
  const macroData = [
    { name: 'Protein', value: total_nutrition?.protein || 0, color: '#10b981' },
    { name: 'Carbs', value: total_nutrition?.carbs || 0, color: '#f59e0b' },
    { name: 'Fat', value: total_nutrition?.fat || 0, color: '#ef4444' }
  ];

  // Animation variants - AGGRESSIVE ENTRANCE
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20
      }
    }
  };

  const foodItemVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.12,
        type: 'spring',
        stiffness: 150,
        damping: 15
      }
    })
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 relative"
      style={{
        backgroundImage: `
          linear-gradient(rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.95)),
          url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&q=80'),
          radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
        `,
        backgroundSize: 'cover, cover, auto, auto',
        backgroundPosition: 'center, center, center, center',
        backgroundBlendMode: 'normal, overlay, normal, normal'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header - GYM STYLE */}
        <motion.div variants={cardVariants} className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-black text-white mb-1 tracking-tight">
                NUTRITION ANALYSIS
              </h1>
              <div className="flex items-center gap-2">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-green-400 rounded-full"
                />
                <p className="text-gray-400 uppercase tracking-wider text-xs">AI-Powered Recognition</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/upload')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg hover:border-green-500 transition text-gray-300 text-sm font-semibold"
            >
              <Camera size={16} />
              New Scan
            </motion.button>
          </div>
        </motion.div>

        {/* Main Grid - TRANSFORMED GYM LAYOUT */}
        <motion.div variants={containerVariants} className="grid lg:grid-cols-3 gap-4 mb-4">
          
          {/* 1️⃣ ENERGY CORE - CIRCULAR GAUGE */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)' }}
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-4 shadow-2xl border border-gray-700 overflow-hidden"
          >
            {/* Food background - Energy foods */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10" />
            
            {/* Animated particles */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.2) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}
            />
            
            <div className="relative z-10">
              {/* Label */}
              <div className="text-center mb-2">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <span className="text-green-400 font-black text-xs uppercase tracking-widest">⚡ ENERGY CORE</span>
                </motion.div>
              </div>
              
              {/* Circular Gauge */}
              <div className="relative w-32 h-32 mx-auto mb-2">
                {/* Background ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="rgba(75, 85, 99, 0.3)"
                    strokeWidth="8"
                  />
                  {/* Animated ring */}
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="url(#energyGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "352", strokeDashoffset: 352 }}
                    animate={{ strokeDashoffset: 352 - (352 * Math.min(calories / 2000, 1)) }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))'
                    }}
                  />
                  <defs>
                    <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className="text-center"
                  >
                    <div className="text-6xl font-black text-white mb-1 tracking-tighter">
                      {calories}
                    </div>
                    <div className="text-gray-400 text-sm uppercase tracking-wider">kcal</div>
                  </motion.div>
                </div>
                
                {/* Pulsing glow */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-green-400 blur-2xl"
                />
              </div>
              
              {/* Bottom info */}
              <div className="text-center">
                <div className="text-gray-500 text-xs uppercase mb-2">Consumed</div>
                {userProfile?.healthGoal && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full border border-gray-600"
                  >
                    <Target size={12} className="text-green-400" />
                    <span className="text-xs text-gray-300 font-semibold">{userProfile.healthGoal.replace('_', ' ')}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* 2️⃣ MUSCLE FUEL - BARBELL */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-4 shadow-2xl border border-gray-700 overflow-hidden"
          >
            {/* Protein foods background */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="relative z-10">
              {/* Label */}
              <div className="text-center mb-3">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <span className="text-blue-400 font-black text-xs uppercase tracking-widest">💪 MUSCLE FUEL</span>
                </motion.div>
              </div>
              
              {/* Value */}
              <div className="text-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl font-black text-white mb-1"
                >
                  {protein}g
                </motion.div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">PROTEIN</div>
                <div className="text-blue-400 text-[10px] mt-1">of {userProfile?.healthGoal === 'muscle_gain' ? '150g' : '80g'} goal</div>
              </div>
              
              {/* Barbell progress */}
              <div className="flex items-center gap-1.5">
                {/* Weight plate left */}
                <motion.div
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-6 h-8 bg-gray-700 rounded border-2 border-gray-600 flex-shrink-0"
                />
                
                {/* Bar with fill */}
                <div className="flex-1 relative h-4 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((protein / (userProfile?.healthGoal === 'muscle_gain' ? 150 : 80)) * 100, 100)}%` }}
                    transition={{ duration: 2, ease: [0.34, 1.56, 0.64, 1], delay: 0.6 }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    style={{
                      boxShadow: '0 0 15px rgba(59, 130, 246, 0.6)'
                    }}
                  >
                    <motion.div
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 0%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                      className="absolute inset-0"
                      style={{
                        backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                        backgroundSize: '200% 100%'
                      }}
                    />
                  </motion.div>
                </div>
                
                {/* Weight plate right */}
                <motion.div
                  animate={{ rotate: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-6 h-8 bg-gray-700 rounded border-2 border-gray-600 flex-shrink-0"
                />
              </div>
            </div>
          </motion.div>

          {/* 3️⃣ MACRO BREAKDOWN - VERTICAL BARS */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.3)' }}
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-4 shadow-2xl border border-gray-700 overflow-hidden"
          >
            {/* Macro foods background */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="relative z-10">
              <div className="text-center mb-3">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <span className="text-purple-400 font-black text-xs uppercase tracking-widest">📊 MACRO BREAKDOWN</span>
                </motion.div>
              </div>
              
              {/* Vertical bars */}
              <div className="flex items-end justify-between gap-3 mb-3">
                {/* Carbs */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full h-32">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                      className="absolute bottom-0 w-full bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-lg origin-bottom"
                      style={{ 
                        height: `${Math.max(Math.min((carbs / 50) * 100, 100), 20)}%`,
                        boxShadow: '0 -4px 20px rgba(234, 179, 8, 0.5)'
                      }}
                    >
                      <motion.div
                        animate={{
                          backgroundPosition: ['0% 0%', '0% 100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear'
                        }}
                        className="absolute inset-0 opacity-30"
                        style={{
                          backgroundImage: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                          backgroundSize: '100% 200%'
                        }}
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="text-center"
                  >
                    <div className="text-white font-bold text-sm">{carbs}g</div>
                    <div className="text-yellow-400 text-[10px] uppercase">Carbs</div>
                  </motion.div>
                </div>
                
                {/* Fat */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full h-32">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                      className="absolute bottom-0 w-full bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-lg origin-bottom"
                      style={{ 
                        height: `${Math.max(Math.min((fat / 30) * 100, 100), 20)}%`,
                        boxShadow: '0 -4px 20px rgba(249, 115, 22, 0.5)'
                      }}
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                    className="text-center"
                  >
                    <div className="text-white font-bold text-sm">{fat}g</div>
                    <div className="text-orange-400 text-[10px] uppercase">Fat</div>
                  </motion.div>
                </div>
                
                {/* Fiber */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full h-32">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 1.0, duration: 0.8, ease: 'easeOut' }}
                      className="absolute bottom-0 w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-lg origin-bottom"
                      style={{ 
                        height: `${Math.max(Math.min(((total_nutrition?.fiber || 0) / 15) * 100, 100), 20)}%`,
                        boxShadow: '0 -4px 20px rgba(168, 85, 247, 0.5)'
                      }}
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                    className="text-center"
                  >
                    <div className="text-white font-bold text-sm">{total_nutrition?.fiber || 0}g</div>
                    <div className="text-purple-400 text-[10px] uppercase">Fiber</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Training Feedback Cards */}
        <motion.div 
          variants={cardVariants}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 mb-4 relative overflow-hidden"
          style={{
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.15)'
          }}
        >
          {/* Meal prep background */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1547496502-affa22d38842?w=1200&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wide">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-green-400 text-xl"
            >
              💪
            </motion.div>
            Training Feedback
          </h2>
          <div className="space-y-3">
            {detected_foods?.map((food, idx) => (
              <motion.div 
                key={idx}
                custom={idx}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15, type: 'spring', damping: 15, stiffness: 100 }}
                whileHover={{ scale: 1.02, x: 8, boxShadow: '0 8px 40px rgba(16, 185, 129, 0.3)' }}
                className="bg-gradient-to-r from-gray-800 to-gray-900 p-3 rounded-lg border border-gray-700"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-base uppercase tracking-wide">{food.food_name}</h3>
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: idx * 0.15 + 0.3, type: 'spring', stiffness: 200 }}
                  >
                    <div className="relative">
                      <motion.div
                        animate={{
                          boxShadow: [
                            '0 0 10px rgba(16, 185, 129, 0.5)',
                            '0 0 25px rgba(16, 185, 129, 0.8)',
                            '0 0 10px rgba(16, 185, 129, 0.5)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-gradient-to-r from-green-500 to-emerald-400 text-black px-3 py-1 rounded-full text-xs font-black uppercase"
                      >
                        {(food.confidence * 100).toFixed(0)}% Lock
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 + 0.2 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  <div className="text-center">
                    <p className="text-gray-400 text-[10px] uppercase mb-0.5">Weight</p>
                    <p className="font-black text-white text-sm">{food.estimated_grams}<span className="text-gray-500 text-xs">g</span></p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-[10px] uppercase mb-0.5">Energy</p>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-black text-cyan-400 text-sm"
                    >
                      {food.nutrition?.calories || 0}<span className="text-gray-500 text-xs">kcal</span>
                    </motion.p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-[10px] uppercase mb-0.5">Muscle</p>
                    <p className="font-black text-green-400 text-sm">{food.nutrition?.protein || 0}<span className="text-gray-500 text-xs">g</span></p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-[10px] uppercase mb-0.5">Fuel</p>
                    <p className="font-black text-yellow-400 text-sm">{food.nutrition?.carbs || 0}<span className="text-gray-500 text-xs">g</span></p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Two Column Layout - Analytics */}
        <motion.div variants={containerVariants} className="grid lg:grid-cols-2 gap-4">
          {/* Macro Split */}
          <motion.div 
            variants={cardVariants}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4"
            style={{
              boxShadow: '0 0 30px rgba(168, 85, 247, 0.15)'
            }}
          >
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wide">
              <TrendingUp size={16} className="text-purple-400" />
              Macro Split
            </h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-gray-900 rounded-lg p-3"
            >
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    animationBegin={800}
                    animationDuration={1000}
                    stroke="#1f2937"
                    strokeWidth={2}
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="grid grid-cols-3 gap-2 mt-3"
            >
              {macroData.map((macro, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 + idx * 0.1, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center bg-gray-900 rounded-lg p-2 border border-gray-700"
                >
                  <motion.div 
                    animate={{
                      boxShadow: [
                        `0 0 10px ${macro.color}40`,
                        `0 0 20px ${macro.color}80`,
                        `0 0 10px ${macro.color}40`
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 rounded-full mx-auto mb-1" 
                    style={{ backgroundColor: macro.color }} 
                  />
                  <p className="text-[10px] text-gray-400 uppercase">{macro.name}</p>
                  <p className="text-sm font-black text-white">{macro.value}<span className="text-gray-500 text-[10px]">g</span></p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Performance Alerts */}
          <motion.div 
            variants={cardVariants}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4"
            style={{
              boxShadow: '0 0 30px rgba(234, 179, 8, 0.15)'
            }}
          >
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wide">
              <AlertCircle size={16} className="text-yellow-400" />
              Performance Alerts
            </h2>
            {health_alerts && health_alerts.length > 0 ? (
              <div className="space-y-3">
                {health_alerts.map((alert, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15, type: 'spring', damping: 15 }}
                    whileHover={{ x: -4, scale: 1.02 }}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.includes('⚠️') || alert.includes('High')
                        ? 'bg-gradient-to-r from-yellow-900/50 to-gray-800 border-yellow-500'
                        : 'bg-gradient-to-r from-green-900/50 to-gray-800 border-green-500'
                    }`}
                    style={{
                      boxShadow: alert.includes('⚠️') || alert.includes('High')
                        ? '0 4px 20px rgba(234, 179, 8, 0.2)'
                        : '0 4px 20px rgba(16, 185, 129, 0.2)'
                    }}
                  >
                    <p className="text-xs font-bold text-white">{alert}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="text-center py-8 text-gray-400"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <AlertCircle size={48} className="mx-auto mb-2 opacity-50 text-green-500" />
                </motion.div>
                <p className="font-bold uppercase">All Systems Optimal</p>
              </motion.div>
            )}

            {userProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 pt-6 border-t border-gray-700"
              >
                <p className="text-xs text-gray-400 mb-2 uppercase font-bold">Athlete Profile:</p>
                <div className="flex flex-wrap gap-1.5">
                  <motion.span 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)' }}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase border border-blue-400"
                  >
                    {userProfile.age} YRS
                  </motion.span>
                  <motion.span 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1.0, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)' }}
                    className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase border border-purple-400"
                  >
                    {userProfile.healthGoal?.replace('_', ' ')}
                  </motion.span>
                  <motion.span 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)' }}
                    className="bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase border border-green-400"
                  >
                    {userProfile.activityLevel}
                  </motion.span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Coach Panel */}
        {explanation && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 mt-4"
            style={{
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)'
            }}
          >
            <motion.button
              onClick={() => setShowExplanation(!showExplanation)}
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between text-base font-bold text-white mb-3 bg-gray-800 rounded-lg p-3 border border-gray-700"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    boxShadow: [
                      '0 0 10px rgba(234, 179, 8, 0.5)',
                      '0 0 20px rgba(234, 179, 8, 0.8)',
                      '0 0 10px rgba(234, 179, 8, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Lightbulb size={20} className="text-yellow-400" />
                </motion.div>
                <span className="uppercase tracking-wide">Coach's Analysis</span>
              </div>
              <motion.div
                animate={{ rotate: showExplanation ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={20} className="text-blue-400" />
              </motion.div>
            </motion.button>
            
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-300 text-xs leading-relaxed whitespace-pre-line"
                    style={{
                      boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    {explanation}
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-3 flex items-center gap-2 text-xs bg-gray-900 rounded-lg p-2 border border-gray-700"
                  >
                    <span className="font-black text-blue-400 uppercase">AI Engine:</span>
                    <span className="text-gray-300">Color histogram matching + Portion estimation</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Primary Actions - Gym Style */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, type: 'spring', damping: 15 }}
          className="flex flex-col md:flex-row gap-3 mt-6"
        >
          {/* SCAN FOOD - Dominant Action */}
          <motion.button
            onClick={() => navigate('/upload')}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 20px 60px -10px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.6)'
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                '0 10px 40px -5px rgba(16, 185, 129, 0.5)',
                '0 15px 60px -5px rgba(16, 185, 129, 0.8)',
                '0 10px 40px -5px rgba(16, 185, 129, 0.5)'
              ],
              y: [0, -3, 0]
            }}
            transition={{
              boxShadow: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              },
              y: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              },
              scale: {
                duration: 0.2
              }
            }}
            className="relative flex-1 px-6 py-4 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 text-white rounded-xl font-black text-base shadow-2xl overflow-hidden group border-2 border-green-400"
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{
                backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%, transparent 100%)',
                backgroundSize: '200% 100%'
              }}
            />
            {/* Shimmer on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              animate={{
                backgroundPosition: ['200% 0', '-200% 0'],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{
                backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                backgroundSize: '200% 100%'
              }}
            />
            <span className="relative z-10 flex items-center justify-center gap-3 uppercase tracking-wider">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Camera size={20} />
              </motion.div>
              Scan Next Meal
            </span>
          </motion.button>
          
          {/* Secondary Action */}
          <motion.button
            onClick={() => navigate('/history')}
            whileHover={{ 
              scale: 1.05,
              borderColor: 'rgb(59, 130, 246)',
              boxShadow: '0 10px 30px -5px rgba(59, 130, 246, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-6 py-4 bg-gray-900 border-2 border-gray-600 text-white rounded-xl font-black text-base transition-all uppercase tracking-wider"
          >
            Training Log
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultDashboard;
