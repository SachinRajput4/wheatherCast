// frontend/src/components/LandingPageHeader/LandingPageHeader.jsx
import React from 'react';

const LandingPageHeader = () => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-8 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="text-5xl animate-bounce">🌦️</div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Will It Rain On My Parade?
              </h1>
              <p className="text-blue-100 mt-2 text-lg">
                Plan with confidence using NASA's historical weather data
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
            <span className="text-lg font-semibold text-white">{today}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageHeader;