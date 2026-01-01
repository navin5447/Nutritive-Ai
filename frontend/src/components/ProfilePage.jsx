import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Save, User, Target, Activity, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    healthGoal: '',
    dietaryPreference: '',
    activityLevel: ''
  });

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    setProfile(savedProfile);
  }, []);

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const calculateBMI = () => {
    if (profile.height && profile.weight) {
      const heightM = profile.height / 100;
      return (profile.weight / (heightM * heightM)).toFixed(1);
    }
    return 'N/A';
  };

  const getBMICategory = (bmi) => {
    if (bmi === 'N/A') return { text: 'N/A', color: 'gray' };
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) return { text: 'Underweight', color: 'blue' };
    if (bmiNum < 25) return { text: 'Normal', color: 'green' };
    if (bmiNum < 30) return { text: 'Overweight', color: 'yellow' };
    return { text: 'Obese', color: 'red' };
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 relative overflow-hidden">
      {/* Split background - nutrition and fitness */}
      <div className="absolute inset-0">
        <div 
          className="absolute left-0 top-0 bottom-0 w-1/2 opacity-5"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/2 opacity-5"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
            <p className="text-gray-400">Manage your health information</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-2 border-gray-700 text-white rounded-lg hover:border-green-500 transition"
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-md hover:shadow-lg transition"
              style={{
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Save size={18} />
              Save Changes
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
          >
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <User size={24} className="mb-3 relative z-10" />
            <div className="text-3xl font-bold mb-1 relative z-10">{profile.age || '--'}</div>
            <div className="text-blue-100 relative z-10">Years Old</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
          >
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <Activity size={24} className="mb-3 relative z-10" />
            <div className="text-3xl font-bold mb-1 relative z-10">{bmi}</div>
            <div className="text-purple-100 relative z-10">BMI - {bmiCategory.text}</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
          >
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <Target size={24} className="mb-3 relative z-10" />
            <div className="text-xl font-bold mb-1 relative z-10">{profile.healthGoal?.replace('_', ' ') || 'Not set'}</div>
            <div className="text-green-100 relative z-10">Health Goal</div>
          </motion.div>
        </div>

        {/* Profile Form */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Age</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 bg-gray-900 border-gray-700 rounded-xl focus:border-green-500 text-white focus:outline-none transition disabled:bg-gray-800 disabled:text-gray-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Gender</label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 bg-gray-900 border-gray-700 rounded-xl focus:border-green-500 text-white focus:outline-none transition disabled:bg-gray-800 disabled:text-gray-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Height (cm)</label>
              <input
                type="number"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 bg-gray-900 border-gray-700 rounded-xl focus:border-green-500 text-white focus:outline-none transition disabled:bg-gray-800 disabled:text-gray-500"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Weight (kg)</label>
              <input
                type="number"
                value={profile.weight}
                onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 bg-gray-900 border-gray-700 rounded-xl focus:border-green-500 text-white focus:outline-none transition disabled:bg-gray-800 disabled:text-gray-500"
              />
            </div>

            {/* Health Goal */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Health Goal</label>
              <select
                value={profile.healthGoal}
                onChange={(e) => setProfile({ ...profile, healthGoal: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 bg-gray-900 border-gray-700 rounded-xl focus:border-green-500 text-white focus:outline-none transition disabled:bg-gray-800 disabled:text-gray-500"
              >
                <option value="">Select goal</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="diabetes_control">Diabetes Control</option>
              </select>
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Dietary Preference</label>
              <select
                value={profile.dietaryPreference}
                onChange={(e) => setProfile({ ...profile, dietaryPreference: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 bg-gray-900 border-gray-700 rounded-xl focus:border-green-500 text-white focus:outline-none transition disabled:bg-gray-800 disabled:text-gray-500"
              >
                <option value="">Select preference</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            {/* Activity Level */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Activity Level</label>
              <select
                value={profile.activityLevel}
                onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 bg-gray-900 border-gray-700 rounded-xl focus:border-green-500 text-white focus:outline-none transition disabled:bg-gray-800 disabled:text-gray-500"
              >
                <option value="">Select activity level</option>
                <option value="sedentary">Sedentary - Little or no exercise</option>
                <option value="light">Light - Exercise 1-3 days/week</option>
                <option value="moderate">Moderate - Exercise 3-5 days/week</option>
                <option value="active">Active - Exercise 6-7 days/week</option>
                <option value="very_active">Very Active - Intense exercise daily</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 mt-6 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-400" />
            Personalized Recommendations
          </h3>
          <div className="space-y-3">
            {profile.healthGoal === 'weight_loss' && (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                <p className="text-gray-300">💡 Focus on high protein, low carb meals to support weight loss</p>
              </div>
            )}
            {profile.healthGoal === 'muscle_gain' && (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                <p className="text-gray-300">💡 Increase protein intake to 1.6-2.2g per kg body weight</p>
              </div>
            )}
            {profile.dietaryPreference === 'vegetarian' && (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                <p className="text-gray-300">🥬 Include lentils, paneer, and nuts for protein</p>
              </div>
            )}
            {profile.activityLevel === 'very_active' && (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                <p className="text-gray-300">⚡ Your high activity level requires more calories and carbs</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 px-6 py-3 bg-gray-800 border-2 border-gray-700 text-white rounded-xl font-semibold hover:border-green-500 transition"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset your profile?')) {
                localStorage.removeItem('userProfile');
                localStorage.removeItem('onboardingComplete');
                window.location.reload();
              }
            }}
            className="px-6 py-3 bg-red-900/50 border-2 border-red-800 text-red-400 rounded-xl font-semibold hover:bg-red-900 transition"
          >
            Reset Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
