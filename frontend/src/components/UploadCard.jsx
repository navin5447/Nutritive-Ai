import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, Image, CheckCircle, Sparkles } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const UploadCard = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', image);
    
    // Get user profile from localStorage
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    formData.append('user_id', userProfile.age || 'demo-user');

    try {
      const response = await axios.post('http://localhost:8000/food/recognize', formData);
      
      // Save result to localStorage and navigate to dashboard
      localStorage.setItem('latestScanResult', JSON.stringify(response.data));
      navigate('/dashboard', { state: { scanResult: response.data } });
    } catch (err) {
      console.error('Error analyzing food:', err);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 relative overflow-hidden"
    >
      {/* Food scanning background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1505935428862-770b6f24f629?w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 font-semibold"
        >
          ← Back to Dashboard
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl p-8 md:p-12"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-black text-white mb-3 uppercase tracking-tight">
              Scan Your Food 📸
            </h1>
            <p className="text-gray-400 text-lg">
              AI-Powered Vision Recognition • Instant Analysis
            </p>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="inline-block mt-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-black uppercase border border-green-400"
              style={{
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
              }}
            >
              🇮🇳 Indian Food Support
            </motion.div>
          </motion.div>

          {/* Upload Area */}
          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-4 border-dashed rounded-2xl p-12 transition ${
                  dragActive
                    ? 'border-green-500 bg-gray-800'
                    : 'border-gray-600 hover:border-green-500 bg-gray-800'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="text-center pointer-events-none">
                  <motion.div 
                    animate={{ 
                      scale: dragActive ? 1.1 : 1,
                      rotate: dragActive ? 5 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-900 to-emerald-900 rounded-full flex items-center justify-center border-2 border-green-500"
                    style={{
                      boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <Image className="text-green-400" size={48} />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
                    Drop Food Image Here
                  </h3>
                  <p className="text-gray-400 mb-6">
                    AI will detect & analyze nutrition instantly
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pointer-events-auto">
                    <motion.button 
                      whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(16, 185, 129, 0.5)' }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-black uppercase shadow-md border border-green-400"
                    >
                      <Upload size={20} />
                      Choose File
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-xl font-bold uppercase hover:border-blue-500 transition"
                    >
                      <Camera size={20} />
                      Use Camera
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Image Preview */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative rounded-2xl overflow-hidden shadow-lg"
                >
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-96 object-contain bg-gray-100"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setImage(null);
                      setPreview(null);
                    }}
                    className="absolute top-4 right-4 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition"
                  >
                    Change Image
                  </motion.button>
                </motion.div>

                {/* Success Message */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-green-900 to-emerald-900 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3"
                >
                  <CheckCircle className="text-green-400" size={24} />
                  <div>
                    <p className="font-black text-white uppercase">Image Locked!</p>
                    <p className="text-sm text-green-400">Ready for AI analysis</p>
                  </div>
                </motion.div>

                {/* Analyze Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    boxShadow: loading ? '0 10px 15px rgba(0, 0, 0, 0.3)' : [
                      '0 10px 30px rgba(16, 185, 129, 0.4)',
                      '0 20px 50px rgba(16, 185, 129, 0.6)',
                      '0 10px 30px rgba(16, 185, 129, 0.4)'
                    ]
                  }}
                  transition={{ 
                    delay: 0.3,
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }
                  }}
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-black uppercase text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border-2 border-green-400"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Analyze with AI
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Cards */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-3 gap-4 mt-8"
          >
            {[
              { icon: '🎯', text: 'AI Portion Detection' },
              { icon: '⚡', text: 'Instant Analysis' },
              { icon: '🔒', text: 'Private & Secure' }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)' }}
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm text-gray-300 font-bold uppercase">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UploadCard;
