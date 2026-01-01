// API request helpers for Nutrition AI
import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

console.log('🌐 API Base URL:', BASE_URL);
console.log('🔍 Environment check:', import.meta.env.VITE_API_URL);

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${BASE_URL}/food/recognize`, formData);
};

// Add more API helpers as backend endpoints are completed


