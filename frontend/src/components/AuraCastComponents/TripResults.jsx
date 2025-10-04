// frontend/src/components/AuraCastComponents/TripResults.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// Trip-specific components
const PackingRecommendations = ({ recommendations, tripType }) => {
  if (!recommendations || recommendations.length === 0) return null;

  const tripIcons = {
    beach: '🏖️',
    hiking: '🥾',
    city: '🏙️',
    roadtrip: '🚗',
    camping: '⛺',
    ski: '⛷️',
    cruise: '🚢',
    adventure: '🧗'
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 shadow-lg">
      <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <span className="mr-2">{tripIcons[tripType] || '🎒'}</span>
        Packing Recommendations
      </h4>
      <ul className="space-y-3">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
              📦
            </span>
            <span className="text-gray-700">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ActivityPlanning = ({ weatherData, tripType }) => {
  const getActivityRecommendations = () => {
    const { rainProbability, avgTemperature } = weatherData;
    
    const recommendations = [];
    
    if (rainProbability < 20) {
      recommendations.push('Perfect conditions for outdoor activities');
    } else if (rainProbability < 40) {
      recommendations.push('Good for outdoor activities with backup plans');
    } else {
      recommendations.push('Consider indoor alternatives');
    }
    
    if (avgTemperature > 25) {
      recommendations.push('Great for water activities and beach days');
    } else if (avgTemperature < 10) {
      recommendations.push('Ideal for indoor cultural activities');
    }
    
    return recommendations;
  };

  const activities = getActivityRecommendations();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg">
      <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <span className="mr-2">🎯</span>
        Activity Planning
      </h4>
      <ul className="space-y-2">
        {activities.map((activity, index) => (
          <li key={index} className="flex items-center text-gray-700">
            <span className="text-green-500 mr-2">✓</span>
            {activity}
          </li>
        ))}
      </ul>
    </div>
  );
};

const TripResults = ({ data }) => {
  if (!data) return null;

  // Extract data with proper fallbacks
  const basicWeather = data.basicWeather || data;
  const rainProbability = basicWeather.rainProbability || 0;
  const avgTemperature = basicWeather.avgTemperature;
  const recommendations = data.recommendations || [];
  const totalYearsAnalyzed = data.totalYearsAnalyzed || 0;

  const rainData = [
    { name: 'Rain Chance', value: rainProbability },
    { name: 'No Rain', value: 100 - rainProbability }
  ];

  const COLORS = ['#EF4444', '#10B981'];

  const getTripComfort = () => {
    if (rainProbability < 20) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (rainProbability < 40) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (rainProbability < 60) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Challenging', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const comfort = getTripComfort();

  // Trip type display
  const tripTypeDisplay = {
    beach: { icon: '🏖️', name: 'Beach Vacation' },
    hiking: { icon: '🥾', name: 'Hiking Trip' },
    city: { icon: '🏙️', name: 'City Break' },
    roadtrip: { icon: '🚗', name: 'Road Trip' },
    camping: { icon: '⛺', name: 'Camping Trip' },
    ski: { icon: '⛷️', name: 'Ski Trip' },
    cruise: { icon: '🚢', name: 'Cruise' },
    adventure: { icon: '🧗', name: 'Adventure Trip' }
  };

  const currentTrip = tripTypeDisplay[data.tripType] || tripTypeDisplay.adventure;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-4">
      {/* Trip Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl mr-4">{currentTrip.icon}</span>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">Trip Weather Analysis</h3>
            <p className="text-lg text-gray-600">for your {currentTrip.name}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${comfort.bg} ${comfort.color} font-semibold border`}>
            <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
            {comfort.level} Travel Conditions
          </div>
          
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold border border-green-200">
            <span className="text-lg mr-2">🌡️</span>
            {avgTemperature ? Math.round(avgTemperature) : 'N/A'}°C
          </div>
        </div>
      </div>

      {/* Main Trip Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rain Probability */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Rain Probability
          </h4>
          <div className="relative">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={rainData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {rainData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => (
                    <span className="text-sm text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800">{rainProbability}%</div>
                <div className="text-sm text-gray-500 mt-1">chance of rain during trip</div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Planning */}
        <ActivityPlanning weatherData={{ rainProbability, avgTemperature }} tripType={data.tripType} />
      </div>

      {/* Packing Recommendations */}
      <PackingRecommendations recommendations={recommendations} tripType={data.tripType} />

      {/* Data Source */}
      <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-6 shadow-lg">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Trip Analysis Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600 mb-1">{totalYearsAnalyzed}</div>
              <div className="text-sm text-gray-600">Years of Travel Data</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-lg font-bold text-teal-600 mb-1">NASA POWER</div>
              <div className="text-sm text-gray-600">Travel Weather Source</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripResults;