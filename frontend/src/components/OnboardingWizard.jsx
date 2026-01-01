import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, Sparkles, Camera, Target, TrendingUp, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OnboardingWizard = ({ onComplete }) => {
  const [step, setStep] = useState(0); // Start at 0 for welcome screen
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    healthGoal: '',
    dietaryPreference: '',
    activityLevel: ''
  });

  const totalSteps = 4;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 0) {
      setStep(1); // Move from welcome to first question
    } else if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save to localStorage and complete onboarding
      localStorage.setItem('userProfile', JSON.stringify(formData));
      localStorage.setItem('onboardingComplete', 'true');
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const isStepValid = () => {
    if (step === 0) return true; // Welcome screen always valid
    switch (step) {
      case 1:
        return formData.age && formData.gender;
      case 2:
        return formData.height && formData.weight;
      case 3:
        return formData.healthGoal;
      case 4:
        return formData.dietaryPreference && formData.activityLevel;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background images */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12 relative z-10"
      >
        {/* Progress Bar - Hide on welcome screen */}
        {step > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-400">Step {step} of {totalSteps}</span>
              <span className="text-sm font-semibold text-green-400">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full"
                style={{
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                }}
              />
            </div>
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[400px]"
          >
            {/* Welcome Screen - Step 0 */}
            {step === 0 && (
              <div className="space-y-8 flex flex-col items-center justify-center text-center">
                {/* Logo/Icon with animation */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2 
                  }}
                  className="relative"
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl"
                    style={{
                      boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)'
                    }}
                  >
                    <span className="text-6xl">🥗</span>
                  </div>
                  {/* Floating particles */}
                  <motion.div
                    animate={{ 
                      y: [-10, 10, -10],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full blur-sm"
                  />
                  <motion.div
                    animate={{ 
                      y: [10, -10, 10],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full blur-sm"
                  />
                </motion.div>

                {/* Title with staggered animation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <h1 className="text-5xl md:text-6xl font-black text-white mb-2">
                    Nutrition AI
                  </h1>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="inline-block"
                  >
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 px-4 py-2 rounded-full">
                      <Sparkles className="text-green-400" size={16} />
                      <span className="text-green-400 font-bold text-sm uppercase tracking-wider">AI-Powered Recognition</span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-xl text-gray-400 max-w-lg"
                >
                  Transform your fitness journey with intelligent nutrition tracking
                </motion.p>

                {/* Feature highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="grid grid-cols-3 gap-4 w-full max-w-md mt-8"
                >
                  {[
                    { icon: Camera, label: 'Scan Food', color: 'from-blue-500 to-blue-600' },
                    { icon: Target, label: 'Track Goals', color: 'from-purple-500 to-purple-600' },
                    { icon: TrendingUp, label: 'See Results', color: 'from-green-500 to-green-600' }
                  ].map((feature, idx) => (
                    <motion.div
                      key={feature.label}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: 1.2 + idx * 0.1,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className={`bg-gradient-to-br ${feature.color} p-4 rounded-xl text-white`}
                    >
                      <feature.icon className="mx-auto mb-2" size={24} />
                      <p className="text-xs font-semibold">{feature.label}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="mt-8"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(16, 185, 129, 0.3)',
                        '0 0 40px rgba(16, 185, 129, 0.6)',
                        '0 0 20px rgba(16, 185, 129, 0.3)'
                      ]
                    }}
                    transition={{
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    onClick={handleNext}
                    className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-black text-lg shadow-2xl uppercase tracking-wider"
                  >
                    <Zap size={24} />
                    Get Started
                    <ArrowRight size={24} />
                  </motion.button>
                </motion.div>

                {/* Bottom info */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  className="text-sm text-gray-500 mt-8"
                >
                  🇮🇳 Supports Indian Foods • 🚀 Instant Analysis • 🎯 Personalized Goals
                </motion.p>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Welcome to Nutrition AI 🥗
                  </h2>
                  <p className="text-gray-400">Let's personalize your fitness journey</p>
                </motion.div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateField('age', e.target.value)}
                    placeholder="Enter your age"
                    className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-white rounded-xl focus:border-green-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Gender</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Male', 'Female', 'Other'].map(gender => (
                      <motion.button
                        key={gender}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateField('gender', gender.toLowerCase())}
                        className={`py-3 px-4 rounded-xl font-medium transition ${
                          formData.gender === gender.toLowerCase()
                            ? 'bg-green-500 text-white shadow-lg border border-green-400'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                        }`}
                      >
                        {gender}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Body Metrics 📏</h2>
                <p className="text-gray-600">Help us calculate your nutritional needs</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => updateField('height', e.target.value)}
                  placeholder="e.g., 170"
                  className="w-full px-4 py-3 border-2 bg-gray-900 border-gray-700 text-white rounded-xl focus:border-green-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => updateField('weight', e.target.value)}
                  placeholder="e.g., 70"
                  className="w-full px-4 py-3 border-2 bg-gray-900 border-gray-700 text-white rounded-xl focus:border-green-500 focus:outline-none transition"
                />
              </div>

              {formData.height && formData.weight && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                  <p className="text-sm text-green-400">
                    <span className="font-semibold">Your BMI:</span> {(formData.weight / ((formData.height / 100) ** 2)).toFixed(1)}
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Your Health Goal 🎯</h2>
                <p className="text-gray-600">What brings you here?</p>
              </div>

              <div className="space-y-3">
                {[
                  { value: 'weight_loss', label: 'Weight Loss', emoji: '⚡', desc: 'Reduce body weight safely' },
                  { value: 'muscle_gain', label: 'Muscle Gain', emoji: '💪', desc: 'Build lean muscle mass' },
                  { value: 'maintenance', label: 'Maintenance', emoji: '⚖️', desc: 'Maintain current weight' },
                  { value: 'diabetes_control', label: 'Diabetes Control', emoji: '🩺', desc: 'Manage blood sugar' }
                ].map(goal => (
                  <button
                    key={goal.value}
                    onClick={() => updateField('healthGoal', goal.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition ${
                      formData.healthGoal === goal.value
                        ? 'border-green-500/50 bg-green-500/20'
                        : 'border-gray-700 hover:border-green-500 bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{goal.emoji} {goal.label}</p>
                        <p className="text-sm text-gray-600">{goal.desc}</p>
                      </div>
                      {formData.healthGoal === goal.value && (
                        <CheckCircle className="text-green-400" size={24} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Lifestyle Details 🍽️</h2>
                <p className="text-gray-600">Almost done!</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Dietary Preference</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
                    { value: 'non_vegetarian', label: 'Non-Veg', emoji: '🍗' },
                    { value: 'vegan', label: 'Vegan', emoji: '🌱' }
                  ].map(diet => (
                    <button
                      key={diet.value}
                      onClick={() => updateField('dietaryPreference', diet.value)}
                      className={`py-3 px-2 rounded-xl font-medium transition ${
                        formData.dietaryPreference === diet.value
                          ? 'bg-green-500 text-white shadow-lg border border-green-400'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">{diet.emoji}</div>
                      <div className="text-xs">{diet.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Activity Level</label>
                <div className="space-y-2">
                  {[
                    { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
                    { value: 'light', label: 'Light', desc: 'Exercise 1-3 days/week' },
                    { value: 'moderate', label: 'Moderate', desc: 'Exercise 3-5 days/week' },
                    { value: 'active', label: 'Active', desc: 'Exercise 6-7 days/week' },
                    { value: 'very_active', label: 'Very Active', desc: 'Intense exercise daily' }
                  ].map(activity => (
                    <button
                      key={activity.value}
                      onClick={() => updateField('activityLevel', activity.value)}
                      className={`w-full text-left p-3 rounded-xl border-2 transition ${
                        formData.activityLevel === activity.value
                          ? 'border-green-500/50 bg-green-500/20'
                          : 'border-gray-700 hover:border-green-500 bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{activity.label}</p>
                          <p className="text-xs text-gray-600">{activity.desc}</p>
                        </div>
                        {formData.activityLevel === activity.value && (
                          <CheckCircle className="text-green-400" size={20} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
          <motion.button
            whileHover={{ scale: step === 1 ? 1 : 1.05 }}
            whileTap={{ scale: step === 1 ? 1 : 0.95 }}
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
              step === 1
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            <ArrowLeft size={20} />
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: isStepValid() ? 1.05 : 1 }}
            whileTap={{ scale: isStepValid() ? 0.95 : 1 }}
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition ${
              isStepValid()
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
            style={isStepValid() ? {
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
            } : {}}
          >
            {step === totalSteps ? 'Complete 🚀' : 'Next'}
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingWizard;
