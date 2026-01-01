import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, User, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/history', label: 'History', icon: BarChart3 },
    { path: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-gray-900 border-b border-gray-700 shadow-2xl sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center"
            >
              <span className="text-2xl">🥗</span>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Nutrition AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <motion.div
                  key={path}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                      isActive
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Upload Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/upload"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition"
              style={{
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Camera size={18} />
              <span className="hidden sm:inline">Scan Food</span>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around py-2 border-t">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <motion.div
                key={path}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={path}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
                    isActive
                      ? 'text-green-400'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
