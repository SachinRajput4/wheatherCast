import React from 'react';
const GuestComfortRecommendations = ({ recommendations }) => {
  const comfortRecs = recommendations.filter(rec => 
    rec.includes('UMBRELLA') || rec.includes('SHADE') || rec.includes('COOLING') ||
    rec.includes('HYDRATION') || rec.includes('COMFORT') || rec.includes('PROTECTION')
  );

  if (comfortRecs.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg">
      <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <span className="mr-2">😊</span>
        Guest Comfort
      </h4>
      <ul className="space-y-3">
        {comfortRecs.map((rec, index) => (
          <li key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
              😊
            </span>
            <span className="text-gray-700">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default GuestComfortRecommendations;