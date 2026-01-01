import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OnboardingWizard from './components/OnboardingWizard';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import UploadCard from './components/UploadCard';
import ResultDashboard from './components/ResultDashboard';
import ProfilePage from './components/ProfilePage';
import HistoryPage from './components/HistoryPage';

function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if onboarding is complete
    const isComplete = localStorage.getItem('onboardingComplete') === 'true';
    setOnboardingComplete(isComplete);
    setLoading(false);
  }, []);

  const handleOnboardingComplete = (userData) => {
    setOnboardingComplete(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!onboardingComplete) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardWrapper />} />
          <Route path="/upload" element={<UploadCard />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

// Wrapper component to show either hero or results
function DashboardWrapper() {
  const [hasResult, setHasResult] = useState(false);

  useEffect(() => {
    const result = localStorage.getItem('latestScanResult');
    setHasResult(!!result);
  }, []);

  return hasResult ? <ResultDashboard /> : <HeroSection />;
}

export default App;


