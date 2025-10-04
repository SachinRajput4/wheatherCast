// frontend/src/components/AuraCastComponents/TripResults.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Location Weather Card Component
const LocationWeatherCard = ({ location, type, weather }) => {
  if (!location || !weather) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800">{location.name}</h4>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          type === 'DEPARTURE' ? 'bg-blue-100 text-blue-800' :
          type === 'DESTINATION' ? 'bg-green-100 text-green-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {type}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Rain:</span>
            <span className="font-semibold">{weather.basicWeather?.rainProbability || 0}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Temperature:</span>
            <span className="font-semibold">{weather.basicWeather?.avgTemperature ? Math.round(weather.basicWeather.avgTemperature) : 'N/A'}°C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Humidity:</span>
            <span className="font-semibold">{weather.basicWeather?.avgHumidity || 'N/A'}%</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Wind:</span>
            <span className="font-semibold">{weather.basicWeather?.avgWindSpeed || 'N/A'} m/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Heat Risk:</span>
            <span className="font-semibold">{weather.extremeConditions?.veryHot || 0}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Data Years:</span>
            <span className="font-semibold">{weather.totalYearsAnalyzed || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Daily Breakdown Component
const DailyBreakdown = ({ dailyBreakdown }) => {
  if (!dailyBreakdown || dailyBreakdown.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg">
      <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <span className="mr-2">📅</span>
        Daily Weather Breakdown
      </h4>
      <div className="space-y-4">
        {dailyBreakdown.map((day, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h5 className="font-semibold text-gray-800">{day.location}</h5>
                <p className="text-sm text-gray-600">{day.date} • {day.type}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                day.type === 'DEPARTURE' ? 'bg-blue-100 text-blue-800' :
                day.type === 'DESTINATION' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {day.type}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{day.weather.rainProbability}%</div>
                <div className="text-xs text-gray-600">Rain Chance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {day.weather.temperature?.value ? Math.round(day.weather.temperature.value) : 'N/A'}°C
                </div>
                <div className="text-xs text-gray-600">Temperature</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{day.weather.conditions?.veryHot || 0}%</div>
                <div className="text-xs text-gray-600">Heat Risk</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-600">{day.weather.conditions?.veryWet || 0}%</div>
                <div className="text-xs text-gray-600">Heavy Rain</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Risk Analysis Component
const RiskAnalysis = ({ tripAnalysis }) => {
  if (!tripAnalysis) return null;

  const riskData = [
    { name: 'Overall Risk', value: tripAnalysis.overallRisk || 0 },
    { name: 'Heat Risk', value: Math.max(
      tripAnalysis.dailyBreakdown?.[0]?.weather.conditions?.veryHot || 0,
      tripAnalysis.dailyBreakdown?.[1]?.weather.conditions?.veryHot || 0,
      tripAnalysis.dailyBreakdown?.[2]?.weather.conditions?.veryHot || 0
    )},
    { name: 'Rain Risk', value: Math.max(
      tripAnalysis.dailyBreakdown?.[0]?.weather.rainProbability || 0,
      tripAnalysis.dailyBreakdown?.[1]?.weather.rainProbability || 0,
      tripAnalysis.dailyBreakdown?.[2]?.weather.rainProbability || 0
    )}
  ];

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 shadow-lg">
      <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <span className="mr-2">⚠️</span>
        Risk Analysis
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h5 className="font-semibold text-gray-700 mb-3">Risk Levels</h5>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <span className="text-gray-700">Overall Trip Risk</span>
            <span className={`text-lg font-bold ${
              tripAnalysis.overallRisk > 50 ? 'text-red-600' :
              tripAnalysis.overallRisk > 25 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {tripAnalysis.overallRisk}%
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <span className="text-gray-700">Risk Level</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              tripAnalysis.tripSummary?.overallRiskLevel === 'HIGH' ? 'bg-red-100 text-red-800' :
              tripAnalysis.tripSummary?.overallRiskLevel === 'MODERATE' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {tripAnalysis.tripSummary?.overallRiskLevel || 'LOW'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <span className="text-gray-700">Highest Rain</span>
            <span className="text-lg font-bold text-blue-600">
              {tripAnalysis.weatherSummary?.highestRainProbability || 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Enhancements Component
const AIEnhancements = ({ aiEnhancements }) => {
  if (!aiEnhancements) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg">
      <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <span className="mr-2">🤖</span>
        AI Travel Insights
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiEnhancements.trip_specific_recommendations && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="text-green-500 mr-2">🎯</span>
              Trip Recommendations
            </h5>
            <ul className="space-y-2 text-sm">
              {aiEnhancements.trip_specific_recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {aiEnhancements.route_optimization_tips && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="text-blue-500 mr-2">🛣️</span>
              Route Tips
            </h5>
            <ul className="space-y-2 text-sm">
              {aiEnhancements.route_optimization_tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {aiEnhancements.contingency_plans && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="text-orange-500 mr-2">🛡️</span>
              Backup Plans
            </h5>
            <ul className="space-y-2 text-sm">
              {aiEnhancements.contingency_plans.map((plan, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-500 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{plan}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Packing Recommendations Component
const PackingRecommendations = ({ packingList, tripType }) => {
  if (!packingList || packingList.length === 0) return null;

  const tripIcons = {
    beach: '🏖️',
    hiking: '🥾',
    city: '🏙️',
    roadtrip: '🚗',
    camping: '⛺',
    ski: '⛷️',
    cruise: '🚢',
    adventure: '🧗',
    vacation: '✈️',
    business: '💼'
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 shadow-lg">
      <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <span className="mr-2">{tripIcons[tripType] || '🎒'}</span>
        Smart Packing List
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packingList.map((item, index) => (
          <div key={index} className="flex items-center bg-white rounded-lg p-3 shadow-sm">
            <span className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
              📦
            </span>
            <span className="text-gray-700 font-medium">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Trip Results Component
const TripResults = ({ data }) => {
  if (!data) return null;

  const tripAnalysis = data.tripAnalysis || {};
  const recommendations = data.recommendations || [];

  // Trip type display
  const tripTypeDisplay = {
    beach: { icon: '🏖️', name: 'Beach Vacation' },
    hiking: { icon: '🥾', name: 'Hiking Trip' },
    city: { icon: '🏙️', name: 'City Break' },
    roadtrip: { icon: '🚗', name: 'Road Trip' },
    camping: { icon: '⛺', name: 'Camping Trip' },
    ski: { icon: '⛷️', name: 'Ski Trip' },
    cruise: { icon: '🚢', name: 'Cruise' },
    adventure: { icon: '🧗', name: 'Adventure Trip' },
    vacation: { icon: '✈️', name: 'Vacation' },
    business: { icon: '💼', name: 'Business Trip' }
  };

  const currentTrip = tripTypeDisplay[data.tripType] || tripTypeDisplay.vacation;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-4">
      {/* Trip Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl mr-4">{currentTrip.icon}</span>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">Trip Weather Analysis</h3>
            <p className="text-lg text-gray-600">
              {data.origin?.name} → {data.destination?.name} • {data.travelMode?.toUpperCase()} • {currentTrip.name}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold border border-blue-200">
            <span className="text-lg mr-2">📅</span>
            {data.departureDate} to {data.returnDate}
          </div>
          
          {tripAnalysis.overallRisk && (
            <div className={`inline-flex items-center px-4 py-2 rounded-full font-semibold border ${
              tripAnalysis.overallRisk > 50 ? 'bg-red-100 text-red-700 border-red-200' :
              tripAnalysis.overallRisk > 25 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
              'bg-green-100 text-green-700 border-green-200'
            }`}>
              <span className="text-lg mr-2">⚠️</span>
              Overall Risk: {tripAnalysis.overallRisk}%
            </div>
          )}
          
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold border border-green-200">
            <span className="text-lg mr-2">🤖</span>
            AI Enhanced: {data.analysisMetadata?.aiEnhanced ? 'Yes' : 'No'}
          </div>
        </div>
      </div>

      {/* Location Weather Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LocationWeatherCard 
          location={data.origin} 
          type="ORIGIN" 
          weather={data.origin?.weather} 
        />
        <LocationWeatherCard 
          location={data.destination} 
          type="DESTINATION" 
          weather={data.destination?.weather} 
        />
        {data.return && (
          <LocationWeatherCard 
            location={data.return} 
            type="RETURN" 
            weather={data.return?.weather} 
          />
        )}
      </div>

      {/* Risk Analysis */}
      <RiskAnalysis tripAnalysis={tripAnalysis} />

      {/* Daily Breakdown */}
      <DailyBreakdown dailyBreakdown={tripAnalysis.dailyBreakdown} />

      {/* AI Enhancements */}
      {tripAnalysis.aiEnhancements && (
        <AIEnhancements aiEnhancements={tripAnalysis.aiEnhancements} />
      )}

      {/* Packing Recommendations */}
      <PackingRecommendations 
        packingList={tripAnalysis.packingList} 
        tripType={data.tripType} 
      />

      {/* All Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 shadow-lg">
          <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <span className="mr-2">💡</span>
            All Travel Recommendations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
                  ✓
                </span>
                <span className="text-gray-700 text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Metadata */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 shadow-lg">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Analysis Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {data.origin?.weather?.totalYearsAnalyzed || 0}
              </div>
              <div className="text-sm text-gray-600">Years of Historical Data</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-lg font-bold text-teal-600 mb-1">NASA POWER</div>
              <div className="text-sm text-gray-600">Weather Data Source</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-lg font-bold text-purple-600 mb-1">
                v{data.analysisMetadata?.version}
              </div>
              <div className="text-sm text-gray-600">Analysis Version</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Analyzed on {new Date(data.analysisMetadata?.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripResults;








// // frontend/src/components/AuraCastComponents/TripResults.jsx
// import React from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// // Trip-specific components
// const PackingRecommendations = ({ recommendations, tripType }) => {
//   if (!recommendations || recommendations.length === 0) return null;

//   const tripIcons = {
//     beach: '🏖️',
//     hiking: '🥾',
//     city: '🏙️',
//     roadtrip: '🚗',
//     camping: '⛺',
//     ski: '⛷️',
//     cruise: '🚢',
//     adventure: '🧗'
//   };

//   return (
//     <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 shadow-lg">
//       <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
//         <span className="mr-2">{tripIcons[tripType] || '🎒'}</span>
//         Packing Recommendations
//       </h4>
//       <ul className="space-y-3">
//         {recommendations.map((rec, index) => (
//           <li key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm">
//             <span className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
//               📦
//             </span>
//             <span className="text-gray-700">{rec}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const ActivityPlanning = ({ weatherData, tripType }) => {
//   const getActivityRecommendations = () => {
//     const { rainProbability, avgTemperature } = weatherData;
    
//     const recommendations = [];
    
//     if (rainProbability < 20) {
//       recommendations.push('Perfect conditions for outdoor activities');
//     } else if (rainProbability < 40) {
//       recommendations.push('Good for outdoor activities with backup plans');
//     } else {
//       recommendations.push('Consider indoor alternatives');
//     }
    
//     if (avgTemperature > 25) {
//       recommendations.push('Great for water activities and beach days');
//     } else if (avgTemperature < 10) {
//       recommendations.push('Ideal for indoor cultural activities');
//     }
    
//     return recommendations;
//   };

//   const activities = getActivityRecommendations();

//   return (
//     <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg">
//       <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
//         <span className="mr-2">🎯</span>
//         Activity Planning
//       </h4>
//       <ul className="space-y-2">
//         {activities.map((activity, index) => (
//           <li key={index} className="flex items-center text-gray-700">
//             <span className="text-green-500 mr-2">✓</span>
//             {activity}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const TripResults = ({ data }) => {
//   if (!data) return null;

//   // Extract data with proper fallbacks for trip analysis
//   const tripAnalysis = data.tripAnalysis || {};
//   const basicWeather = data.origin?.weather?.basicWeather || {};
//   const rainProbability = basicWeather.rainProbability || 0;
//   const avgTemperature = basicWeather.avgTemperature;
//   const recommendations = data.recommendations || [];
//   const totalYearsAnalyzed = data.origin?.weather?.totalYearsAnalyzed || 0;

//   const rainData = [
//     { name: 'Rain Chance', value: rainProbability },
//     { name: 'No Rain', value: 100 - rainProbability }
//   ];

//   const COLORS = ['#EF4444', '#10B981'];

//   const getTripComfort = () => {
//     if (rainProbability < 20) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
//     if (rainProbability < 40) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
//     if (rainProbability < 60) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
//     return { level: 'Challenging', color: 'text-red-600', bg: 'bg-red-100' };
//   };

//   const comfort = getTripComfort();

//   // Trip type display
//   const tripTypeDisplay = {
//     beach: { icon: '🏖️', name: 'Beach Vacation' },
//     hiking: { icon: '🥾', name: 'Hiking Trip' },
//     city: { icon: '🏙️', name: 'City Break' },
//     roadtrip: { icon: '🚗', name: 'Road Trip' },
//     camping: { icon: '⛺', name: 'Camping Trip' },
//     ski: { icon: '⛷️', name: 'Ski Trip' },
//     cruise: { icon: '🚢', name: 'Cruise' },
//     adventure: { icon: '🧗', name: 'Adventure Trip' },
//     vacation: { icon: '✈️', name: 'Vacation' },
//     business: { icon: '💼', name: 'Business Trip' }
//   };

//   const currentTrip = tripTypeDisplay[data.tripType] || tripTypeDisplay.vacation;

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-4">
//       {/* Trip Header */}
//       <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
//         <div className="flex items-center justify-center mb-4">
//           <span className="text-4xl mr-4">{currentTrip.icon}</span>
//           <div>
//             <h3 className="text-3xl font-bold text-gray-800 mb-2">Trip Weather Analysis</h3>
//             <p className="text-lg text-gray-600">for your {currentTrip.name}</p>
//           </div>
//         </div>
        
//         <div className="flex flex-wrap justify-center gap-4 mt-4">
//           <div className={`inline-flex items-center px-4 py-2 rounded-full ${comfort.bg} ${comfort.color} font-semibold border`}>
//             <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
//             {comfort.level} Travel Conditions
//           </div>
          
//           <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold border border-green-200">
//             <span className="text-lg mr-2">🌡️</span>
//             {avgTemperature ? Math.round(avgTemperature) : 'N/A'}°C
//           </div>

//           {tripAnalysis.overallRisk && (
//             <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-semibold border border-orange-200">
//               <span className="text-lg mr-2">⚠️</span>
//               Risk Level: {tripAnalysis.overallRisk}%
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Main Trip Metrics */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Rain Probability */}
//         <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg">
//           <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">
//             Rain Probability
//           </h4>
//           <div className="relative">
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie
//                   data={rainData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={70}
//                   outerRadius={90}
//                   fill="#8884d8"
//                   dataKey="value"
//                   startAngle={90}
//                   endAngle={-270}
//                 >
//                   {rainData.map((entry, index) => (
//                     <Cell 
//                       key={`cell-${index}`} 
//                       fill={COLORS[index % COLORS.length]} 
//                       strokeWidth={0}
//                     />
//                   ))}
//                 </Pie>
//                 <Legend 
//                   verticalAlign="bottom" 
//                   height={36}
//                   formatter={(value, entry) => (
//                     <span className="text-sm text-gray-600">{value}</span>
//                   )}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-gray-800">{rainProbability}%</div>
//                 <div className="text-sm text-gray-500 mt-1">chance of rain during trip</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Activity Planning */}
//         <ActivityPlanning weatherData={{ rainProbability, avgTemperature }} tripType={data.tripType} />
//       </div>

//       {/* Trip Summary */}
//       {tripAnalysis.tripSummary && (
//         <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg">
//           <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
//             <span className="mr-2">📊</span>
//             Trip Summary
//           </h4>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <h5 className="font-semibold text-gray-700 mb-2">Risk Assessment</h5>
//               <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                 tripAnalysis.tripSummary.overallRiskLevel === 'HIGH' ? 'bg-red-100 text-red-800' :
//                 tripAnalysis.tripSummary.overallRiskLevel === 'MODERATE' ? 'bg-yellow-100 text-yellow-800' :
//                 'bg-green-100 text-green-800'
//               }`}>
//                 {tripAnalysis.tripSummary.overallRiskLevel} Risk
//               </div>
//             </div>
//             <div>
//               <h5 className="font-semibold text-gray-700 mb-2">Temperature</h5>
//               <div className="text-sm text-gray-600">
//                 {tripAnalysis.tripSummary.temperatureSummary?.origin} → {tripAnalysis.tripSummary.temperatureSummary?.destination}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Packing Recommendations */}
//       <PackingRecommendations recommendations={recommendations} tripType={data.tripType} />

//       {/* Data Source */}
//       <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-6 shadow-lg">
//         <div className="text-center">
//           <h4 className="text-lg font-semibold text-gray-700 mb-4">Trip Analysis Summary</h4>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <div className="text-2xl font-bold text-green-600 mb-1">{totalYearsAnalyzed}</div>
//               <div className="text-sm text-gray-600">Years of Travel Data</div>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <div className="text-lg font-bold text-teal-600 mb-1">NASA POWER</div>
//               <div className="text-sm text-gray-600">Travel Weather Source</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TripResults;