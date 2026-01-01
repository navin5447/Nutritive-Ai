import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Sparkles, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Hero background with food imagery */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-4"
          >
            <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold border border-green-500/30">
              🇮🇳 Supports Indian Foods
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            AI-Powered Nutrition
            <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Tracking Made Simple
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Snap a photo of your food and get instant nutrition analysis with AI-powered portion estimation
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                ]
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }}
              onClick={() => navigate('/upload')}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg"
              style={{
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Camera size={20} />
              Scan Your Food
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, borderColor: 'rgb(16 185 129)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/upload')}
              className="flex items-center gap-2 px-8 py-4 bg-gray-800 text-white border-2 border-gray-700 rounded-xl font-semibold transition hover:border-green-500"
            >
              <Upload size={20} />
              Upload Image
            </motion.button>
          </motion.div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <Camera className="text-teal-600" size={32} />,
                title: '1. Capture',
                desc: 'Take a photo of your meal or upload from gallery'
              },
              {
                icon: <Sparkles className="text-purple-600" size={32} />,
                title: '2. AI Analysis',
                desc: 'Our AI recognizes food items and portions'
              },
              {
                icon: <Target className="text-blue-600" size={32} />,
                title: '3. Get Insights',
                desc: 'Receive detailed nutrition breakdown instantly'
              },
              {
                icon: <TrendingUp className="text-green-600" size={32} />,
                title: '4. Track Goals',
                desc: 'Monitor your progress towards health goals'
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)' }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + idx * 0.1, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-gray-900 border border-gray-700 rounded-xl flex items-center justify-center mb-4"
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              emoji: '🎯',
              title: 'Accurate Portion Estimation',
              desc: 'AI-powered portion sizing using plate detection'
            },
            {
              emoji: '🧠',
              title: 'Explainable AI',
              desc: 'Understand how we calculate your nutrition'
            },
            {
              emoji: '💡',
              title: 'Personalized Insights',
              desc: 'Get health alerts based on your goals'
            },
            {
              emoji: '📊',
              title: 'Visual Analytics',
              desc: 'Track macros, calories, and eating patterns'
            },
            {
              emoji: '🥘',
              title: 'Indian Food Database',
              desc: '15+ popular Indian foods recognized'
            },
            {
              emoji: '⚡',
              title: 'Instant Results',
              desc: 'Get nutrition breakdown in seconds'
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-md"
            >
              <div className="text-4xl mb-3">{feature.emoji}</div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
