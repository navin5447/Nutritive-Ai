import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const HistoryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 relative overflow-hidden">
      {/* Background food pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-white mb-2">Meal History</h1>
        <p className="text-gray-400 mb-8">Track your nutrition over time</p>

        {/* Coming Soon */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-12 shadow-lg text-center relative overflow-hidden"
        >
          {/* Food diary illustration background */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80')",
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10"
          >
            <Calendar className="text-green-400" size={48} />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-3 relative z-10">Coming Soon</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto relative z-10">
            We're building a comprehensive history feature to track your meals, analyze patterns, and show your nutrition trends over time.
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto relative z-10">
            {[
              { icon: '📊', text: 'Weekly summaries', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80' },
              { icon: '📅', text: 'Calendar view', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80' },
              { icon: '📈', text: 'Progress charts', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80' }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-900 border border-gray-700 rounded-xl p-4 relative overflow-hidden"
              >
                {/* Feature image background */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url('${feature.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div className="text-3xl mb-2 relative z-10">{feature.icon}</div>
                <p className="text-sm text-gray-300 font-medium relative z-10">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HistoryPage;
