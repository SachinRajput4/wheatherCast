 const CostOptimizationRecommendations = ({ recommendations }) => {
  const costRecs = recommendations.filter(rec => 
    rec.includes('BUDGET') || rec.includes('COST') || rec.includes('SAVING') ||
    rec.includes('DISCOUNT') || rec.includes('RENTAL') || rec.includes('CONTINGENCY')
  );

  if (costRecs.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg">
      <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <span className="mr-2">💰</span>
        Cost Optimization
      </h4>
      <ul className="space-y-3">
        {costRecs.map((rec, index) => (
          <li key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm">
            <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
              💰
            </span>
            <span className="text-gray-700">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CostOptimizationRecommendations;
// frontend/src/components/AuraCastComponents/TripPlanner.jsx
import React, { useState } from 'react';