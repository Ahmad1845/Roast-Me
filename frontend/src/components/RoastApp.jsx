import React, { useState } from 'react';
import RoastForm from './RoastForm';
import RoastResult from './RoastResult';
import { mockRoasts } from '../utils/mockData';

const RoastApp = () => {
  const [currentRoast, setCurrentRoast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleRoastSubmit = async (formData) => {
    setIsLoading(true);
    setShowForm(false);
    
    // Simulate API call with mock data
    setTimeout(() => {
      const randomRoast = mockRoasts[Math.floor(Math.random() * mockRoasts.length)];
      setCurrentRoast({
        ...randomRoast,
        userData: formData
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleNewRoast = () => {
    setCurrentRoast(null);
    setShowForm(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="text-center py-8 px-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-4 animate-pulse">
            🔥 AI ROAST ME 🔥
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Ready to get absolutely obliterated by AI? Fill out the form and prepare for digital destruction! 
            <span className="text-red-400 font-semibold">⚠️ No feelings will be spared ⚠️</span>
          </p>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 pb-8">
          {showForm && (
            <RoastForm onSubmit={handleRoastSubmit} isLoading={isLoading} />
          )}
          
          {(currentRoast || isLoading) && (
            <RoastResult 
              roast={currentRoast} 
              isLoading={isLoading}
              onNewRoast={handleNewRoast}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="text-center py-6 px-4 text-gray-500">
          <p>Built with 💀 and a lot of sass • All roasts are AI-generated and meant for fun!</p>
        </footer>
      </div>
    </div>
  );
};

export default RoastApp;