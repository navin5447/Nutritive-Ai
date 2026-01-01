import React, { useState, useRef } from 'react';
import axios from 'axios';

const UploadImage = ({ userId = 'default-user', onFoodRecognized }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setError(null);
      setResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('user_id', userId);

      const response = await axios.post('http://127.0.0.1:8000/food/recognize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
      
      if (onFoodRecognized) {
        onFoodRecognized(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload Food Image</h2>
      
      <div className="mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          {!preview ? (
            <div>
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          ) : (
            <div className="relative">
              <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
              <button onClick={handleReset} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600" type="button">
                <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="mt-4 inline-block cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            {preview ? 'Change Image' : 'Select Image'}
          </label>
        </div>
      </div>

      {selectedImage && !result && (
        <div className="flex gap-4 mb-6">
          <button onClick={handleUpload} disabled={loading} className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            {loading ? <span className="flex items-center justify-center"><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Analyzing...</span> : 'Analyze Food'}
          </button>
          <button onClick={handleReset} disabled={loading} className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors">Cancel</button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Detection Results</h3>
            <p className="text-sm text-green-700">Image quality: {(result.image_quality * 100).toFixed(0)}%</p>
          </div>

          <div className="grid gap-4">
            {result.foods.map((food, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 capitalize">{food.food_name}</h4>
                    <p className="text-sm text-gray-600">Confidence: {(food.confidence * 100).toFixed(1)}% | Portion: {food.portion_grams}g</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-xs text-gray-600">Calories</p>
                    <p className="text-lg font-bold text-blue-600">{food.nutrition.calories}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-xs text-gray-600">Protein</p>
                    <p className="text-lg font-bold text-green-600">{food.nutrition.protein_g}g</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded">
                    <p className="text-xs text-gray-600">Carbs</p>
                    <p className="text-lg font-bold text-yellow-600">{food.nutrition.carbs_g}g</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded">
                    <p className="text-xs text-gray-600">Fat</p>
                    <p className="text-lg font-bold text-red-600">{food.nutrition.fat_g}g</p>
                  </div>
                </div>

                {food.explanation && (
                  <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                    <p className="font-semibold mb-1">Why this food?</p>
                    <p>{food.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {result.health_alerts && result.health_alerts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Health Alerts</h4>
              <ul className="space-y-2">
                {result.health_alerts.map((alert, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-yellow-700"><strong className="capitalize">{alert.severity}:</strong> {alert.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={handleReset} className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">Analyze Another</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadImage;

