// frontend/src/components/WeatherResults.js
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

// Daily Forecast Component
const DailyForecastDisplay = ({ dailyForecast, isDateRange }) => {
  if (!isDateRange || !dailyForecast || dailyForecast.length <= 1) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-lg">
      <h4 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
        <span className="mr-2">📅</span>
        Daily Forecast Breakdown
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dailyForecast.map((day, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="text-center mb-3">
              <div className="font-semibold text-gray-800">
                {new Date(day.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rain:</span>
                <span className="font-semibold">{day.rainProbability || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Temp:</span>
                <span className="font-semibold">{day.avgTemperature ? Math.round(day.avgTemperature) : 'N/A'}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Very Hot:</span>
                <span className="font-semibold text-red-600">{day.extremeConditions?.veryHot || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Very Wet:</span>
                <span className="font-semibold text-blue-600">{day.extremeConditions?.veryWet || 0}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Extreme Conditions Component
const ExtremeConditionsDisplay = ({ extremes }) => {
  const conditions = [
    { key: 'veryHot', label: 'Very Hot', icon: '🔥', threshold: '>35°C', color: '#ff6b35' },
    { key: 'veryCold', label: 'Very Cold', icon: '❄️', threshold: '<0°C', color: '#4dc6ff' },
    { key: 'veryWindy', label: 'Very Windy', icon: '💨', threshold: '>25 km/h', color: '#8e44ad' },
    { key: 'veryWet', label: 'Very Wet', icon: '🌧️', threshold: '>10mm rain', color: '#3498db' },
    { key: 'veryUncomfortable', label: 'Very Uncomfortable', icon: '😫', threshold: 'Heat Index >40°C', color: '#e74c3c' }
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg">
      <h4 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
        <span className="mr-2">🌪️</span>
        Extreme Condition Probabilities
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {conditions.map(condition => (
          <div key={condition.key} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-xl mr-2">{condition.icon}</span>
                <span className="font-semibold text-gray-800 text-sm">{condition.label}</span>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {condition.threshold}
              </span>
            </div>
            
            <div className="text-center mb-2">
              <div 
                className="text-3xl font-bold mb-1" 
                style={{ color: condition.color }}
              >
                {extremes?.[condition.key] || 0}%
              </div>
              <div className="text-xs text-gray-500">probability</div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${extremes?.[condition.key] || 0}%`,
                  backgroundColor: condition.color
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Climate Trends Component
const ClimateTrendsDisplay = ({ climateTrends }) => {
  if (!climateTrends) return null;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg">
      <h4 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
        <span className="mr-2">📈</span>
        Climate Trends & Analysis
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">🌡️</span>
              <h5 className="font-semibold text-gray-800">Temperature Trend</h5>
            </div>
            <p className="text-gray-700">{climateTrends.temperatureTrend}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">🌧️</span>
              <h5 className="font-semibold text-gray-800">Precipitation Trend</h5>
            </div>
            <p className="text-gray-700">{climateTrends.precipitationTrend}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">🔥</span>
              <h5 className="font-semibold text-gray-800">Extreme Heat</h5>
            </div>
            <p className="text-gray-700">{climateTrends.extremeHeatIncrease}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">📊</span>
              <h5 className="font-semibold text-gray-800">Analysis</h5>
            </div>
            <p className="text-gray-700">{climateTrends.analysis}</p>
            {climateTrends.note && (
              <p className="text-sm text-gray-500 mt-2">{climateTrends.note}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Event Risk Assessment Component
const EventRiskAssessment = ({ eventSpecific, preparationLevel }) => {
  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPreparationColor = (level) => {
    switch (level) {
      case 'HIGH_PREPARATION_NEEDED': return 'bg-red-100 text-red-800 border-red-200';
      case 'MODERATE_PREPARATION_NEEDED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW_PREPARATION_NEEDED': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg">
      <h4 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
        <span className="mr-2">🛡️</span>
        Event Risk Assessment
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Level */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-semibold text-gray-800">Overall Risk Level</h5>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(eventSpecific?.riskLevel)}`}>
              {eventSpecific?.riskLevel || 'UNKNOWN'}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Based on extreme weather probabilities and event type analysis
          </p>
        </div>

        {/* Preparation Level */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-semibold text-gray-800">Preparation Level</h5>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPreparationColor(preparationLevel)}`}>
              {preparationLevel ? preparationLevel.replace(/_/g, ' ') : 'UNKNOWN'}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Recommended level of contingency planning
          </p>
        </div>

        {/* Confidence Score - FIXED: Always show if data exists */}
        <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-semibold text-gray-800">Analysis Confidence</h5>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                {eventSpecific?.confidenceScore || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${eventSpecific?.confidenceScore || 0}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Confidence level based on data quality and historical coverage
          </p>
        </div>
      </div>
    </div>
  );
};

// Critical Concerns Component
const CriticalConcernsDisplay = ({ criticalConcerns }) => {
  if (!criticalConcerns || criticalConcerns.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 shadow-lg">
      <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <span className="mr-2">⚠️</span>
        Critical Concerns
      </h4>
      <ul className="space-y-3">
        {criticalConcerns.map((concern, index) => (
          <li key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm border border-red-100">
            <span className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
              !
            </span>
            <span className="text-gray-700 font-medium">{concern}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const WeatherResults = ({ data }) => {
  if (!data) return null;

  console.log('📊 Frontend received data:', data);

  // Extract all data with proper fallbacks for date range
  const basicWeather = data.basicWeather || data;
  const rainProbability = basicWeather.rainProbability || 0;
  const avgTemperature = basicWeather.avgTemperature;
  const avgWindSpeed = basicWeather.avgWindSpeed;
  const avgHumidity = basicWeather.avgHumidity || basicWeather.humidity;
  
  const locationName = data.location?.name || data.location || 'Unknown Location';
  const coordinates = data.location?.coordinates || data.coordinates;
  const extremeConditions = data.extremeConditions || {};
  const recommendations = data.recommendations || [];
  const criticalConcerns = data.eventSpecific?.criticalConcerns || [];
  const preparationAdvice = data.eventSpecific?.preparationAdvice || [];
  const totalYearsAnalyzed = data.totalYearsAnalyzed || data.dataPoints || 0;
  const analysisPeriod = data.analysisPeriod || 'Unknown period';

  // Date range specific data - FIXED: Use correct field names from backend
  const isDateRange = data.isDateRange || false;
  const dateRange = data.dateRange || 1; // Backend sends "dateRange": 2
  const startDate = data.date; // Backend sends "date"
  const endDate = data.endDate; // Backend sends "endDate"
  const dailyForecast = data.dailyForecast || [];

  const rainData = [
    { name: 'Rain Chance', value: rainProbability },
    { name: 'No Rain', value: 100 - rainProbability }
  ];

  const COLORS = ['#EF4444', '#10B981'];

  const getRiskLevel = (probability) => {
    if (probability < 20) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
    if (probability < 50) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
  };

  const risk = getRiskLevel(rainProbability);

  // Event type display mapping
  const eventTypeDisplay = {
    wedding: { icon: '💒', name: 'Wedding' },
    concert: { icon: '🎵', name: 'Concert' },
    sports: { icon: '⚽', name: 'Sports Event' },
    picnic: { icon: '🧺', name: 'Picnic' },
    vacation: { icon: '✈️', name: 'Vacation' },
    hiking: { icon: '🥾', name: 'Hiking' },
    fishing: { icon: '🎣', name: 'Fishing' },
    parade: { icon: '🎉', name: 'Parade' },
    outdoor_party: { icon: '🎊', name: 'Outdoor Party' },
    photoshoot: { icon: '📸', name: 'Photoshoot' },
    gardening: { icon: '🌻', name: 'Gardening' },
    other: { icon: '📅', name: 'Other Event' }
  };

  const currentEvent = eventTypeDisplay[data.eventType?.toLowerCase()] || eventTypeDisplay.other;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-4">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl mr-4">{currentEvent.icon}</span>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">Weather Analysis Results</h3>
            <p className="text-lg text-gray-600">for your {currentEvent.name}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${risk.bg} ${risk.color} font-semibold border ${risk.border}`}>
            <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
            {risk.level} Rain Risk
          </div>
          
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold border border-blue-200">
            <span className="mr-2">📍</span>
            {typeof locationName === 'string' ? locationName : 'Selected Location'}
          </div>
          
          {/* Date Display - FIXED: Use correct date fields */}
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold border border-purple-200">
            <span className="mr-2">📅</span>
            {isDateRange ? (
              `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
            ) : (
              new Date(startDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })
            )}
          </div>

          {/* Date Range Badge */}
          {isDateRange && (
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold border border-green-200">
              <span className="mr-2">⏱️</span>
              {dateRange} day{dateRange > 1 ? 's' : ''}
            </div>
          )}

          {/* Coordinates - FIXED: Added optional chaining */}
          {coordinates && (
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-semibold border border-gray-200">
              <span className="mr-2">🌐</span>
              {coordinates?.lat?.toFixed(4) || coordinates?.[0]?.toFixed(4)}, {coordinates?.lon?.toFixed(4) || coordinates?.[1]?.toFixed(4)}
            </div>
          )}
        </div>
      </div>

      {/* Event Risk Assessment */}
      <EventRiskAssessment 
        eventSpecific={data.eventSpecific} 
        preparationLevel={data.preparationLevel} 
      />

      {/* Critical Concerns */}
      <CriticalConcernsDisplay criticalConcerns={criticalConcerns} />

      {/* Daily Forecast for Date Range */}
      <DailyForecastDisplay 
        dailyForecast={dailyForecast} 
        isDateRange={isDateRange} 
      />

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rain Probability Gauge */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            {isDateRange ? 'Average Rain Probability' : 'Rain Probability'}
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
                <div className="text-sm text-gray-500 mt-1">
                  {isDateRange ? 'average chance of rain' : 'chance of rain'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Temperature & Additional Metrics */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg">
            <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              {isDateRange ? 'Average Temperature' : 'Temperature'}
            </h4>
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-800 mb-2">
                  {avgTemperature ? Math.round(avgTemperature) : 'N/A'}°C
                </div>
                <div className="text-sm text-gray-500">
                  {isDateRange ? 'Average expected temperature' : 'Expected temperature'}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Weather Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">💨</div>
              <div className="text-lg font-semibold text-gray-800">
                {avgWindSpeed ? Math.round(avgWindSpeed) : 'N/A'} km/h
              </div>
              <div className="text-xs text-gray-600">Wind Speed</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">💧</div>
              <div className="text-lg font-semibold text-gray-800">
                {avgHumidity ? Math.round(avgHumidity) : 'N/A'}%
              </div>
              <div className="text-xs text-gray-600">Humidity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Extreme Conditions */}
      {extremeConditions && Object.keys(extremeConditions).length > 0 && (
        <ExtremeConditionsDisplay extremes={extremeConditions} />
      )}

      {/* Climate Trends */}
      {data.climateTrends && (
        <ClimateTrendsDisplay climateTrends={data.climateTrends} />
      )}

      {/* Preparation Advice */}
      {preparationAdvice.length > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 shadow-lg">
          <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <span className="mr-2">🛠️</span>
            Preparation Advice
          </h4>
          <ul className="space-y-3">
            {preparationAdvice.map((advice, index) => (
              <li key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm">
                <span className="flex-shrink-0 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
                  💡
                </span>
                <span className="text-gray-700">{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg">
        <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <span className="mr-2">📋</span>
          Event-Specific Recommendations
        </h4>
        <ul className="space-y-3">
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <li key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
                  ✓
                </span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))
          ) : (
            <li className="flex items-start bg-white rounded-lg p-3 shadow-sm">
              <span className="flex-shrink-0 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
                ℹ️
              </span>
              <span className="text-gray-700">No specific recommendations needed. Weather conditions appear favorable!</span>
            </li>
          )}
        </ul>
      </div>
      
      {/* Data Source Info */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 shadow-lg">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-center">
            <span className="mr-2">🔬</span>
            Data Analysis Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600 mb-1">{totalYearsAnalyzed}</div>
              <div className="text-sm text-gray-600">Years Analyzed</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-lg font-bold text-green-600 mb-1">{analysisPeriod}</div>
              <div className="text-sm text-gray-600">Analysis Period</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-lg font-bold text-purple-600 mb-1">NASA POWER</div>
              <div className="text-sm text-gray-600">Data Source</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Analysis generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            {isDateRange && ` • ${dateRange}-day analysis`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherResults;








// // frontend/src/components/WeatherResults.js
// import React from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

// // Daily Forecast Component
// const DailyForecastDisplay = ({ dailyForecast, isDateRange }) => {
//   if (!isDateRange || !dailyForecast || dailyForecast.length <= 1) return null;

//   return (
//     <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-lg">
//       <h4 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
//         <span className="mr-2">📅</span>
//         Daily Forecast Breakdown
//       </h4>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {dailyForecast.map((day, index) => (
//           <div key={index} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
//             <div className="text-center mb-3">
//               <div className="font-semibold text-gray-800">
//                 {new Date(day.date).toLocaleDateString('en-US', { 
//                   weekday: 'short', 
//                   month: 'short', 
//                   day: 'numeric' 
//                 })}
//               </div>
//             </div>
            
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Rain:</span>
//                 <span className="font-semibold">{day.rainProbability || 0}%</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Temp:</span>
//                 <span className="font-semibold">{day.avgTemperature ? Math.round(day.avgTemperature) : 'N/A'}°C</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Very Hot:</span>
//                 <span className="font-semibold text-red-600">{day.extremeConditions?.veryHot || 0}%</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Very Wet:</span>
//                 <span className="font-semibold text-blue-600">{day.extremeConditions?.veryWet || 0}%</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Extreme Conditions Component
// const ExtremeConditionsDisplay = ({ extremes }) => {
//   const conditions = [
//     { key: 'veryHot', label: 'Very Hot', icon: '🔥', threshold: '>35°C', color: '#ff6b35' },
//     { key: 'veryCold', label: 'Very Cold', icon: '❄️', threshold: '<0°C', color: '#4dc6ff' },
//     { key: 'veryWindy', label: 'Very Windy', icon: '💨', threshold: '>25 km/h', color: '#8e44ad' },
//     { key: 'veryWet', label: 'Very Wet', icon: '🌧️', threshold: '>10mm rain', color: '#3498db' },
//     { key: 'veryUncomfortable', label: 'Very Uncomfortable', icon: '😫', threshold: 'Heat Index >40°C', color: '#e74c3c' }
//   ];

//   return (
//     <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg">
//       <h4 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
//         <span className="mr-2">🌪️</span>
//         Extreme Condition Probabilities
//       </h4>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {conditions.map(condition => (
//           <div key={condition.key} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center">
//                 <span className="text-xl mr-2">{condition.icon}</span>
//                 <span className="font-semibold text-gray-800 text-sm">{condition.label}</span>
//               </div>
//               <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
//                 {condition.threshold}
//               </span>
//             </div>
            
//             <div className="text-center mb-2">
//               <div 
//                 className="text-3xl font-bold mb-1" 
//                 style={{ color: condition.color }}
//               >
//                 {extremes?.[condition.key] || 0}%
//               </div>
//               <div className="text-xs text-gray-500">probability</div>
//             </div>
            
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="h-2 rounded-full transition-all duration-1000 ease-out"
//                 style={{ 
//                   width: `${extremes?.[condition.key] || 0}%`,
//                   backgroundColor: condition.color
//                 }}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Climate Trends Component
// const ClimateTrendsDisplay = ({ climateTrends }) => {
//   if (!climateTrends) return null;

//   return (
//     <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg">
//       <h4 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
//         <span className="mr-2">📈</span>
//         Climate Trends & Analysis
//       </h4>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-4">
//           <div className="bg-white rounded-lg p-4 shadow-sm">
//             <div className="flex items-center mb-2">
//               <span className="text-lg mr-2">🌡️</span>
//               <h5 className="font-semibold text-gray-800">Temperature Trend</h5>
//             </div>
//             <p className="text-gray-700">{climateTrends.temperatureTrend}</p>
//           </div>
          
//           <div className="bg-white rounded-lg p-4 shadow-sm">
//             <div className="flex items-center mb-2">
//               <span className="text-lg mr-2">🌧️</span>
//               <h5 className="font-semibold text-gray-800">Precipitation Trend</h5>
//             </div>
//             <p className="text-gray-700">{climateTrends.precipitationTrend}</p>
//           </div>
//         </div>
        
//         <div className="space-y-4">
//           <div className="bg-white rounded-lg p-4 shadow-sm">
//             <div className="flex items-center mb-2">
//               <span className="text-lg mr-2">🔥</span>
//               <h5 className="font-semibold text-gray-800">Extreme Heat</h5>
//             </div>
//             <p className="text-gray-700">{climateTrends.extremeHeatIncrease}</p>
//           </div>
          
//           <div className="bg-white rounded-lg p-4 shadow-sm">
//             <div className="flex items-center mb-2">
//               <span className="text-lg mr-2">📊</span>
//               <h5 className="font-semibold text-gray-800">Analysis</h5>
//             </div>
//             <p className="text-gray-700">{climateTrends.analysis}</p>
//             {climateTrends.note && (
//               <p className="text-sm text-gray-500 mt-2">{climateTrends.note}</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Event Risk Assessment Component
// const EventRiskAssessment = ({ eventSpecific, preparationLevel }) => {
//   const getRiskColor = (level) => {
//     switch (level) {
//       case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
//       case 'MODERATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getPreparationColor = (level) => {
//     switch (level) {
//       case 'HIGH_PREPARATION_NEEDED': return 'bg-red-100 text-red-800 border-red-200';
//       case 'MODERATE_PREPARATION_NEEDED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'LOW_PREPARATION_NEEDED': return 'bg-green-100 text-green-800 border-green-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   return (
//     <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg">
//       <h4 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
//         <span className="mr-2">🛡️</span>
//         Event Risk Assessment
//       </h4>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Risk Level */}
//         <div className="bg-white rounded-lg p-4 shadow-sm">
//           <div className="flex items-center justify-between mb-3">
//             <h5 className="font-semibold text-gray-800">Overall Risk Level</h5>
//             <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(eventSpecific?.riskLevel)}`}>
//               {eventSpecific?.riskLevel || 'UNKNOWN'}
//             </span>
//           </div>
//           <p className="text-sm text-gray-600">
//             Based on extreme weather probabilities and event type analysis
//           </p>
//         </div>

//         {/* Preparation Level */}
//         <div className="bg-white rounded-lg p-4 shadow-sm">
//           <div className="flex items-center justify-between mb-3">
//             <h5 className="font-semibold text-gray-800">Preparation Level</h5>
//             <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPreparationColor(preparationLevel)}`}>
//               {preparationLevel?.replace(/_/g, ' ') || 'UNKNOWN'}
//             </span>
//           </div>
//           <p className="text-sm text-gray-600">
//             Recommended level of contingency planning
//           </p>
//         </div>

//         {/* Confidence Score */}
//         {eventSpecific?.confidenceScore && (
//           <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2">
//             <div className="flex items-center justify-between mb-3">
//               <h5 className="font-semibold text-gray-800">Analysis Confidence</h5>
//               <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
//                 {eventSpecific.confidenceScore}%
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="h-2 rounded-full bg-blue-500 transition-all duration-1000"
//                 style={{ width: `${eventSpecific.confidenceScore}%` }}
//               ></div>
//             </div>
//             <p className="text-xs text-gray-500 mt-2">
//               Confidence level based on data quality and historical coverage
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Critical Concerns Component
// const CriticalConcernsDisplay = ({ criticalConcerns }) => {
//   if (!criticalConcerns || criticalConcerns.length === 0) return null;

//   return (
//     <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 shadow-lg">
//       <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
//         <span className="mr-2">⚠️</span>
//         Critical Concerns
//       </h4>
//       <ul className="space-y-3">
//         {criticalConcerns.map((concern, index) => (
//           <li key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm border border-red-100">
//             <span className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
//               !
//             </span>
//             <span className="text-gray-700 font-medium">{concern}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const WeatherResults = ({ data }) => {
//   if (!data) return null;

//   console.log('📊 Frontend received data:', data);

//   // Extract all data with proper fallbacks for date range
//   const basicWeather = data.basicWeather || data;
//   const rainProbability = basicWeather.rainProbability || 0;
//   const avgTemperature = basicWeather.avgTemperature;
//   const avgWindSpeed = basicWeather.avgWindSpeed;
//   const avgHumidity = basicWeather.avgHumidity || basicWeather.humidity;
  
//   const locationName = data.location?.name || data.location || 'Unknown Location';
//   const coordinates = data.location?.coordinates || data.coordinates;
//   const extremeConditions = data.extremeConditions || {};
//   const recommendations = data.recommendations || [];
//   const criticalConcerns = data.eventSpecific?.criticalConcerns || [];
//   const preparationAdvice = data.eventSpecific?.preparationAdvice || [];
//   const totalYearsAnalyzed = data.totalYearsAnalyzed || data.dataPoints || 0;
//   const analysisPeriod = data.analysisPeriod || 'Unknown period';

//   // Date range specific data
//   const isDateRange = data.isDateRange || false;
//   const dateRange = data.dateRange?.totalDays || 1;
//   const startDate = data.dateRange?.startDate || data.date;
//   const endDate = data.dateRange?.endDate;
//   const dailyForecast = data.dailyForecast || [];

//   const rainData = [
//     { name: 'Rain Chance', value: rainProbability },
//     { name: 'No Rain', value: 100 - rainProbability }
//   ];

//   const COLORS = ['#EF4444', '#10B981'];

//   const getRiskLevel = (probability) => {
//     if (probability < 20) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
//     if (probability < 50) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' };
//     return { level: 'High', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
//   };

//   const risk = getRiskLevel(rainProbability);

//   // Event type display mapping
//   const eventTypeDisplay = {
//     wedding: { icon: '💒', name: 'Wedding' },
//     concert: { icon: '🎵', name: 'Concert' },
//     sports: { icon: '⚽', name: 'Sports Event' },
//     picnic: { icon: '🧺', name: 'Picnic' },
//     vacation: { icon: '✈️', name: 'Vacation' },
//     hiking: { icon: '🥾', name: 'Hiking' },
//     fishing: { icon: '🎣', name: 'Fishing' },
//     parade: { icon: '🎉', name: 'Parade' },
//     outdoor_party: { icon: '🎊', name: 'Outdoor Party' },
//     photoshoot: { icon: '📸', name: 'Photoshoot' },
//     gardening: { icon: '🌻', name: 'Gardening' },
//     other: { icon: '📅', name: 'Other Event' }
//   };

//   const currentEvent = eventTypeDisplay[data.eventType] || eventTypeDisplay.other;

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-4">
//       {/* Header Section */}
//       <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
//         <div className="flex items-center justify-center mb-4">
//           <span className="text-4xl mr-4">{currentEvent.icon}</span>
//           <div>
//             <h3 className="text-3xl font-bold text-gray-800 mb-2">Weather Analysis Results</h3>
//             <p className="text-lg text-gray-600">for your {currentEvent.name}</p>
//           </div>
//         </div>
        
//         <div className="flex flex-wrap justify-center gap-4 mt-4">
//           <div className={`inline-flex items-center px-4 py-2 rounded-full ${risk.bg} ${risk.color} font-semibold border ${risk.border}`}>
//             <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
//             {risk.level} Rain Risk
//           </div>
          
//           <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold border border-blue-200">
//             <span className="mr-2">📍</span>
//             {typeof locationName === 'string' ? locationName : 'Selected Location'}
//           </div>
          
//           {/* Date Display - Updated for date range */}
//           <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold border border-purple-200">
//             <span className="mr-2">📅</span>
//             {isDateRange ? (
//               `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
//             ) : (
//               new Date(startDate).toLocaleDateString('en-US', { 
//                 weekday: 'long', 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric' 
//               })
//             )}
//           </div>

//           {/* Date Range Badge */}
//           {isDateRange && (
//             <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold border border-green-200">
//               <span className="mr-2">⏱️</span>
//               {dateRange} day{dateRange > 1 ? 's' : ''}
//             </div>
//           )}

//           {/* Coordinates */}
//           {coordinates && (
//             <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-semibold border border-gray-200">
//               <span className="mr-2">🌐</span>
//               {coordinates.lat?.toFixed(4) || coordinates[0]?.toFixed(4)}, {coordinates.lon?.toFixed(4) || coordinates[1]?.toFixed(4)}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Event Risk Assessment */}
//       <EventRiskAssessment 
//         eventSpecific={data.eventSpecific} 
//         preparationLevel={data.preparationLevel} 
//       />

//       {/* Critical Concerns */}
//       <CriticalConcernsDisplay criticalConcerns={criticalConcerns} />

//       {/* Daily Forecast for Date Range */}
//       <DailyForecastDisplay 
//         dailyForecast={dailyForecast} 
//         isDateRange={isDateRange} 
//       />

//       {/* Main Metrics Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Rain Probability Gauge */}
//         <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg">
//           <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">
//             {isDateRange ? 'Average Rain Probability' : 'Rain Probability'}
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
//                 <div className="text-sm text-gray-500 mt-1">
//                   {isDateRange ? 'average chance of rain' : 'chance of rain'}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Temperature & Additional Metrics */}
//         <div className="space-y-6">
//           <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg">
//             <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">
//               {isDateRange ? 'Average Temperature' : 'Temperature'}
//             </h4>
//             <div className="flex items-center justify-center h-32">
//               <div className="text-center">
//                 <div className="text-5xl font-bold text-gray-800 mb-2">
//                   {avgTemperature ? Math.round(avgTemperature) : 'N/A'}°C
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   {isDateRange ? 'Average expected temperature' : 'Expected temperature'}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Additional Weather Metrics */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
//               <div className="text-2xl mb-2">💨</div>
//               <div className="text-lg font-semibold text-gray-800">
//                 {avgWindSpeed ? Math.round(avgWindSpeed) : 'N/A'} km/h
//               </div>
//               <div className="text-xs text-gray-600">Wind Speed</div>
//             </div>
//             <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 text-center">
//               <div className="text-2xl mb-2">💧</div>
//               <div className="text-lg font-semibold text-gray-800">
//                 {avgHumidity ? Math.round(avgHumidity) : 'N/A'}%
//               </div>
//               <div className="text-xs text-gray-600">Humidity</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Extreme Conditions */}
//       {extremeConditions && Object.keys(extremeConditions).length > 0 && (
//         <ExtremeConditionsDisplay extremes={extremeConditions} />
//       )}

//       {/* Climate Trends */}
//       {data.climateTrends && (
//         <ClimateTrendsDisplay climateTrends={data.climateTrends} />
//       )}

//       {/* Preparation Advice */}
//       {preparationAdvice.length > 0 && (
//         <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 shadow-lg">
//           <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
//             <span className="mr-2">🛠️</span>
//             Preparation Advice
//           </h4>
//           <ul className="space-y-3">
//             {preparationAdvice.map((advice, index) => (
//               <li key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm">
//                 <span className="flex-shrink-0 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
//                   💡
//                 </span>
//                 <span className="text-gray-700">{advice}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Recommendations */}
//       <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg">
//         <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
//           <span className="mr-2">📋</span>
//           Event-Specific Recommendations
//         </h4>
//         <ul className="space-y-3">
//           {recommendations.length > 0 ? (
//             recommendations.map((rec, index) => (
//               <li key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm">
//                 <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
//                   ✓
//                 </span>
//                 <span className="text-gray-700">{rec}</span>
//               </li>
//             ))
//           ) : (
//             <li className="flex items-start bg-white rounded-lg p-3 shadow-sm">
//               <span className="flex-shrink-0 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
//                 ℹ️
//               </span>
//               <span className="text-gray-700">No specific recommendations needed. Weather conditions appear favorable!</span>
//             </li>
//           )}
//         </ul>
//       </div>
      
//       {/* Data Source Info */}
//       <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 shadow-lg">
//         <div className="text-center">
//           <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-center">
//             <span className="mr-2">🔬</span>
//             Data Analysis Summary
//           </h4>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <div className="text-2xl font-bold text-blue-600 mb-1">{totalYearsAnalyzed}</div>
//               <div className="text-sm text-gray-600">Years Analyzed</div>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <div className="text-lg font-bold text-green-600 mb-1">{analysisPeriod}</div>
//               <div className="text-sm text-gray-600">Analysis Period</div>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <div className="text-lg font-bold text-purple-600 mb-1">NASA POWER</div>
//               <div className="text-sm text-gray-600">Data Source</div>
//             </div>
//           </div>
//           <p className="text-xs text-gray-500 mt-4">
//             Analysis generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
//             {isDateRange && ` • ${dateRange}-day analysis`}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WeatherResults;





// // frontend/src/components/WeatherResults.js
// import React from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

// // Extreme Conditions Component
// const ExtremeConditionsDisplay = ({ extremes }) => {
//   const conditions = [
//     { key: 'veryHot', label: 'Very Hot', icon: '🔥', threshold: '>35°C', color: '#ff6b35' },
//     { key: 'veryCold', label: 'Very Cold', icon: '❄️', threshold: '<0°C', color: '#4dc6ff' },
//     { key: 'veryWindy', label: 'Very Windy', icon: '💨', threshold: '>25 km/h', color: '#8e44ad' },
//     { key: 'veryWet', label: 'Very Wet', icon: '🌧️', threshold: '>10mm rain', color: '#3498db' },
//     { key: 'veryUncomfortable', label: 'Very Uncomfortable', icon: '😫', threshold: 'Heat Index >40°C', color: '#e74c3c' }
//   ];

//   return (
//     <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg">
//       <h4 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
//         <span className="mr-2">🌪️</span>
//         Extreme Condition Probabilities
//       </h4>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {conditions.map(condition => (
//           <div key={condition.key} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center">
//                 <span className="text-xl mr-2">{condition.icon}</span>
//                 <span className="font-semibold text-gray-800 text-sm">{condition.label}</span>
//               </div>
//               <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
//                 {condition.threshold}
//               </span>
//             </div>
            
//             <div className="text-center mb-2">
//               <div 
//                 className="text-3xl font-bold mb-1" 
//                 style={{ color: condition.color }}
//               >
//                 {extremes?.[condition.key] || 0}%
//               </div>
//               <div className="text-xs text-gray-500">probability</div>
//             </div>
            
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="h-2 rounded-full transition-all duration-1000 ease-out"
//                 style={{ 
//                   width: `${extremes?.[condition.key] || 0}%`,
//                   backgroundColor: condition.color
//                 }}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Climate Trends Component
// const ClimateTrendsDisplay = ({ climateTrends }) => {
//   if (!climateTrends) return null;

//   return (
//     <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg">
//       <h4 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
//         <span className="mr-2">📈</span>
//         Climate Trends & Analysis
//       </h4>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-4">
//           <div className="bg-white rounded-lg p-4 shadow-sm">
//             <div className="flex items-center mb-2">
//               <span className="text-lg mr-2">🌡️</span>
//               <h5 className="font-semibold text-gray-800">Temperature Trend</h5>
//             </div>
//             <p className="text-gray-700">{climateTrends.temperatureTrend}</p>
//           </div>
          
//           <div className="bg-white rounded-lg p-4 shadow-sm">
//             <div className="flex items-center mb-2">
//               <span className="text-lg mr-2">🌧️</span>
//               <h5 className="font-semibold text-gray-800">Precipitation Trend</h5>
//             </div>
//             <p className="text-gray-700">{climateTrends.precipitationTrend}</p>
//           </div>
//         </div>
        
//         <div className="space-y-4">
//           <div className="bg-white rounded-lg p-4 shadow-sm">
//             <div className="flex items-center mb-2">
//               <span className="text-lg mr-2">🔥</span>
//               <h5 className="font-semibold text-gray-800">Extreme Heat</h5>
//             </div>
//             <p className="text-gray-700">{climateTrends.extremeHeatIncrease}</p>
//           </div>
          
//           <div className="bg-white rounded-lg p-4 shadow-sm">
//             <div className="flex items-center mb-2">
//               <span className="text-lg mr-2">📊</span>
//               <h5 className="font-semibold text-gray-800">Analysis</h5>
//             </div>
//             <p className="text-gray-700">{climateTrends.analysis}</p>
//             {climateTrends.note && (
//               <p className="text-sm text-gray-500 mt-2">{climateTrends.note}</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Event Risk Assessment Component
// const EventRiskAssessment = ({ eventSpecific, preparationLevel }) => {
//   const getRiskColor = (level) => {
//     switch (level) {
//       case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
//       case 'MODERATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getPreparationColor = (level) => {
//     switch (level) {
//       case 'HIGH_PREPARATION_NEEDED': return 'bg-red-100 text-red-800 border-red-200';
//       case 'MODERATE_PREPARATION_NEEDED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'LOW_PREPARATION_NEEDED': return 'bg-green-100 text-green-800 border-green-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   return (
//     <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg">
//       <h4 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
//         <span className="mr-2">🛡️</span>
//         Event Risk Assessment
//       </h4>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Risk Level */}
//         <div className="bg-white rounded-lg p-4 shadow-sm">
//           <div className="flex items-center justify-between mb-3">
//             <h5 className="font-semibold text-gray-800">Overall Risk Level</h5>
//             <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(eventSpecific?.riskLevel)}`}>
//               {eventSpecific?.riskLevel || 'UNKNOWN'}
//             </span>
//           </div>
//           <p className="text-sm text-gray-600">
//             Based on extreme weather probabilities and event type analysis
//           </p>
//         </div>

//         {/* Preparation Level */}
//         <div className="bg-white rounded-lg p-4 shadow-sm">
//           <div className="flex items-center justify-between mb-3">
//             <h5 className="font-semibold text-gray-800">Preparation Level</h5>
//             <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPreparationColor(preparationLevel)}`}>
//               {preparationLevel?.replace(/_/g, ' ') || 'UNKNOWN'}
//             </span>
//           </div>
//           <p className="text-sm text-gray-600">
//             Recommended level of contingency planning
//           </p>
//         </div>

//         {/* Confidence Score */}
//         {eventSpecific?.confidenceScore && (
//           <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2">
//             <div className="flex items-center justify-between mb-3">
//               <h5 className="font-semibold text-gray-800">Analysis Confidence</h5>
//               <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
//                 {eventSpecific.confidenceScore}%
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="h-2 rounded-full bg-blue-500 transition-all duration-1000"
//                 style={{ width: `${eventSpecific.confidenceScore}%` }}
//               ></div>
//             </div>
//             <p className="text-xs text-gray-500 mt-2">
//               Confidence level based on data quality and historical coverage
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Critical Concerns Component
// const CriticalConcernsDisplay = ({ criticalConcerns }) => {
//   if (!criticalConcerns || criticalConcerns.length === 0) return null;

//   return (
//     <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 shadow-lg">
//       <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
//         <span className="mr-2">⚠️</span>
//         Critical Concerns
//       </h4>
//       <ul className="space-y-3">
//         {criticalConcerns.map((concern, index) => (
//           <li key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm border border-red-100">
//             <span className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
//               !
//             </span>
//             <span className="text-gray-700 font-medium">{concern}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const WeatherResults = ({ data }) => {
//   if (!data) return null;

//   console.log('📊 Frontend received data:', data);

//   // Extract all data with proper fallbacks
//   const basicWeather = data.basicWeather || {};
//   const rainProbability = basicWeather.rainProbability || 0;
//   const avgTemperature = basicWeather.avgTemperature;
//   const avgWindSpeed = basicWeather.avgWindSpeed;
//   const avgHumidity = basicWeather.humidity;
  
//   const locationName = data.location?.name || 'Unknown Location';
//   const coordinates = data.location?.coordinates;
//   const extremeConditions = data.extremeConditions || {};
//   const recommendations = data.recommendations || [];
//   const criticalConcerns = data.eventSpecific?.criticalConcerns || [];
//   const preparationAdvice = data.eventSpecific?.preparationAdvice || [];
//   const totalYearsAnalyzed = data.dataPoints || 0;
//   const analysisPeriod = data.analysisPeriod || 'Unknown period';

//   const rainData = [
//     { name: 'Rain Chance', value: rainProbability },
//     { name: 'No Rain', value: 100 - rainProbability }
//   ];

//   const COLORS = ['#EF4444', '#10B981'];

//   const getRiskLevel = (probability) => {
//     if (probability < 20) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
//     if (probability < 50) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' };
//     return { level: 'High', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
//   };

//   const risk = getRiskLevel(rainProbability);

//   // Event type display mapping
//   const eventTypeDisplay = {
//     wedding: { icon: '💒', name: 'Wedding' },
//     concert: { icon: '🎵', name: 'Concert' },
//     sports: { icon: '⚽', name: 'Sports Event' },
//     picnic: { icon: '🧺', name: 'Picnic' },
//     vacation: { icon: '✈️', name: 'Vacation' },
//     hiking: { icon: '🥾', name: 'Hiking' },
//     fishing: { icon: '🎣', name: 'Fishing' },
//     parade: { icon: '🎉', name: 'Parade' },
//     outdoor_party: { icon: '🎊', name: 'Outdoor Party' },
//     photoshoot: { icon: '📸', name: 'Photoshoot' },
//     gardening: { icon: '🌻', name: 'Gardening' },
//     other: { icon: '📅', name: 'Other Event' }
//   };

//   const currentEvent = eventTypeDisplay[data.eventType] || eventTypeDisplay.other;

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-4">
//       {/* Header Section */}
//       <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
//         <div className="flex items-center justify-center mb-4">
//           <span className="text-4xl mr-4">{currentEvent.icon}</span>
//           <div>
//             <h3 className="text-3xl font-bold text-gray-800 mb-2">Weather Analysis Results</h3>
//             <p className="text-lg text-gray-600">for your {currentEvent.name}</p>
//           </div>
//         </div>
        
//         <div className="flex flex-wrap justify-center gap-4 mt-4">
//           <div className={`inline-flex items-center px-4 py-2 rounded-full ${risk.bg} ${risk.color} font-semibold border ${risk.border}`}>
//             <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
//             {risk.level} Rain Risk
//           </div>
          
//           <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold border border-blue-200">
//             <span className="mr-2">📍</span>
//             {locationName}
//           </div>
          
//           <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold border border-purple-200">
//             <span className="mr-2">📅</span>
//             {data.date ? new Date(data.date).toLocaleDateString('en-US', { 
//               weekday: 'long', 
//               year: 'numeric', 
//               month: 'long', 
//               day: 'numeric' 
//             }) : 'Date not available'}
//           </div>

//           {/* Coordinates */}
//           {coordinates && (
//             <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-semibold border border-gray-200">
//               <span className="mr-2">🌐</span>
//               {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Event Risk Assessment */}
//       <EventRiskAssessment 
//         eventSpecific={data.eventSpecific} 
//         preparationLevel={data.preparationLevel} 
//       />

//       {/* Critical Concerns */}
//       <CriticalConcernsDisplay criticalConcerns={criticalConcerns} />

//       {/* Main Metrics Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Rain Probability Gauge */}
//         <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg">
//           <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">Rain Probability</h4>
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
//                 <div className="text-sm text-gray-500 mt-1">chance of rain</div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Temperature & Additional Metrics */}
//         <div className="space-y-6">
//           <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg">
//             <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">Temperature</h4>
//             <div className="flex items-center justify-center h-32">
//               <div className="text-center">
//                 <div className="text-5xl font-bold text-gray-800 mb-2">
//                   {avgTemperature ? Math.round(avgTemperature) : 'N/A'}°C
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   Average expected temperature
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Additional Weather Metrics */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
//               <div className="text-2xl mb-2">💨</div>
//               <div className="text-lg font-semibold text-gray-800">
//                 {avgWindSpeed ? Math.round(avgWindSpeed) : 'N/A'} km/h
//               </div>
//               <div className="text-xs text-gray-600">Wind Speed</div>
//             </div>
//             <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 text-center">
//               <div className="text-2xl mb-2">💧</div>
//               <div className="text-lg font-semibold text-gray-800">
//                 {avgHumidity ? Math.round(avgHumidity) : 'N/A'}%
//               </div>
//               <div className="text-xs text-gray-600">Humidity</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Extreme Conditions */}
//       {extremeConditions && Object.keys(extremeConditions).length > 0 && (
//         <ExtremeConditionsDisplay extremes={extremeConditions} />
//       )}

//       {/* Climate Trends */}
//       {data.climateTrends && (
//         <ClimateTrendsDisplay climateTrends={data.climateTrends} />
//       )}

//       {/* Preparation Advice */}
//       {preparationAdvice.length > 0 && (
//         <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 shadow-lg">
//           <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
//             <span className="mr-2">🛠️</span>
//             Preparation Advice
//           </h4>
//           <ul className="space-y-3">
//             {preparationAdvice.map((advice, index) => (
//               <li key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm">
//                 <span className="flex-shrink-0 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
//                   💡
//                 </span>
//                 <span className="text-gray-700">{advice}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Recommendations */}
//       <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg">
//         <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
//           <span className="mr-2">📋</span>
//           Event-Specific Recommendations
//         </h4>
//         <ul className="space-y-3">
//           {recommendations.length > 0 ? (
//             recommendations.map((rec, index) => (
//               <li key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm">
//                 <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
//                   ✓
//                 </span>
//                 <span className="text-gray-700">{rec}</span>
//               </li>
//             ))
//           ) : (
//             <li className="flex items-start bg-white rounded-lg p-3 shadow-sm">
//               <span className="flex-shrink-0 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
//                 ℹ️
//               </span>
//               <span className="text-gray-700">No specific recommendations needed. Weather conditions appear favorable!</span>
//             </li>
//           )}
//         </ul>
//       </div>
      
//       {/* Data Source Info */}
//       <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 shadow-lg">
//         <div className="text-center">
//           <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-center">
//             <span className="mr-2">🔬</span>
//             Data Analysis Summary
//           </h4>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <div className="text-2xl font-bold text-blue-600 mb-1">{totalYearsAnalyzed}</div>
//               <div className="text-sm text-gray-600">Years Analyzed</div>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <div className="text-lg font-bold text-green-600 mb-1">{analysisPeriod}</div>
//               <div className="text-sm text-gray-600">Analysis Period</div>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <div className="text-lg font-bold text-purple-600 mb-1">NASA POWER</div>
//               <div className="text-sm text-gray-600">Data Source</div>
//             </div>
//           </div>
//           <p className="text-xs text-gray-500 mt-4">
//             Analysis generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WeatherResults;







// // frontend/src/components/WeatherResults.js
// import React from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// // Extreme Conditions Component
// const ExtremeConditionsDisplay = ({ extremes }) => {
//   const conditions = [
//     { key: 'veryHot', label: 'Very Hot', icon: '🔥', threshold: '>35°C', color: '#ff6b35' },
//     { key: 'veryCold', label: 'Very Cold', icon: '❄️', threshold: '<0°C', color: '#4dc6ff' },
//     { key: 'veryWindy', label: 'Very Windy', icon: '💨', threshold: '>25 km/h', color: '#8e44ad' },
//     { key: 'veryWet', label: 'Very Wet', icon: '🌧️', threshold: '>10mm rain', color: '#3498db' },
//     { key: 'veryUncomfortable', label: 'Very Uncomfortable', icon: '😫', threshold: 'Heat Index >40°C', color: '#e74c3c' }
//   ];

//   return (
//     <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg">
//       <h4 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
//         <span className="mr-2">🌪️</span>
//         Extreme Condition Probabilities
//       </h4>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {conditions.map(condition => (
//           <div key={condition.key} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center">
//                 <span className="text-xl mr-2">{condition.icon}</span>
//                 <span className="font-semibold text-gray-800 text-sm">{condition.label}</span>
//               </div>
//               <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
//                 {condition.threshold}
//               </span>
//             </div>
            
//             <div className="text-center mb-2">
//               <div 
//                 className="text-3xl font-bold mb-1" 
//                 style={{ color: condition.color }}
//               >
//                 {extremes?.[condition.key] || 0}%
//               </div>
//               <div className="text-xs text-gray-500">probability</div>
//             </div>
            
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="h-2 rounded-full transition-all duration-1000 ease-out"
//                 style={{ 
//                   width: `${extremes?.[condition.key] || 0}%`,
//                   backgroundColor: condition.color
//                 }}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const WeatherResults = ({ data }) => {
//   if (!data) return null;

//   console.log('📊 Frontend received data:', data); // Debug log

//   // FIX: Use direct properties instead of data.basicWeather
//   const rainProbability = data.rainProbability || data.basicWeather?.rainProbability || 0;
//   const avgTemperature = data.avgTemperature || data.basicWeather?.avgTemperature;
//   const avgWindSpeed = data.avgWindSpeed || data.basicWeather?.avgWindSpeed;
//   const avgHumidity = data.avgHumidity || data.basicWeather?.humidity;
  
//   const locationName = data.location?.name || data.location || 'Unknown Location';
//   const extremeConditions = data.extremeConditions || {};
//   const recommendations = data.recommendations || [];
//   const totalYearsAnalyzed = data.dataPoints || 0;

//   const rainData = [
//     { name: 'Rain Chance', value: rainProbability },
//     { name: 'No Rain', value: 100 - rainProbability }
//   ];

//   const COLORS = ['#EF4444', '#10B981'];

//   const getRiskLevel = (probability) => {
//     if (probability < 20) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
//     if (probability < 50) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' };
//     return { level: 'High', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
//   };

//   const risk = getRiskLevel(rainProbability);

//   // Event type display mapping
//   const eventTypeDisplay = {
//     wedding: { icon: '💒', name: 'Wedding' },
//     concert: { icon: '🎵', name: 'Concert' },
//     sports: { icon: '⚽', name: 'Sports Event' },
//     picnic: { icon: '🧺', name: 'Picnic' },
//     vacation: { icon: '✈️', name: 'Vacation' },
//     hiking: { icon: '🥾', name: 'Hiking' },
//     fishing: { icon: '🎣', name: 'Fishing' },
//     parade: { icon: '🎉', name: 'Parade' },
//     outdoor_party: { icon: '🎊', name: 'Outdoor Party' },
//     photoshoot: { icon: '📸', name: 'Photoshoot' },
//     gardening: { icon: '🌻', name: 'Gardening' },
//     other: { icon: '📅', name: 'Other Event' }
//   };

//   const currentEvent = eventTypeDisplay[data.eventType] || eventTypeDisplay.other;

//   return (
//     <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
//       {/* Header Section */}
//       <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
//         <div className="flex items-center justify-center mb-4">
//           <span className="text-4xl mr-4">{currentEvent.icon}</span>
//           <div>
//             <h3 className="text-3xl font-bold text-gray-800 mb-2">Weather Analysis Results</h3>
//             <p className="text-lg text-gray-600">for your {currentEvent.name}</p>
//           </div>
//         </div>
        
//         <div className="flex flex-wrap justify-center gap-4 mt-4">
//           <div className={`inline-flex items-center px-4 py-2 rounded-full ${risk.bg} ${risk.color} font-semibold border ${risk.border}`}>
//             <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
//             {risk.level} Rain Risk
//           </div>
          
//           <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold border border-blue-200">
//             <span className="mr-2">📍</span>
//             {locationName}
//           </div>
          
//           <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold border border-purple-200">
//             <span className="mr-2">📅</span>
//             {data.date ? new Date(data.date).toLocaleDateString('en-US', { 
//               weekday: 'long', 
//               year: 'numeric', 
//               month: 'long', 
//               day: 'numeric' 
//             }) : 'Date not available'}
//           </div>
//         </div>
//       </div>

//       {/* Main Metrics Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Rain Probability Gauge */}
//         <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg">
//           <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">Rain Probability</h4>
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
//                 <div className="text-sm text-gray-500 mt-1">chance of rain</div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Temperature & Additional Metrics */}
//         <div className="space-y-6">
//           <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg">
//             <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">Temperature</h4>
//             <div className="flex items-center justify-center h-32">
//               <div className="text-center">
//                 <div className="text-5xl font-bold text-gray-800 mb-2">
//                   {avgTemperature ? Math.round(avgTemperature) : 'N/A'}°C
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   Average expected temperature
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Additional Weather Metrics */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
//               <div className="text-2xl mb-2">💨</div>
//               <div className="text-lg font-semibold text-gray-800">
//                 {avgWindSpeed ? Math.round(avgWindSpeed) : 'N/A'} km/h
//               </div>
//               <div className="text-xs text-gray-600">Wind Speed</div>
//             </div>
//             <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 text-center">
//               <div className="text-2xl mb-2">💧</div>
//               <div className="text-lg font-semibold text-gray-800">
//                 {avgHumidity ? Math.round(avgHumidity) : 'N/A'}%
//               </div>
//               <div className="text-xs text-gray-600">Humidity</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Extreme Conditions */}
//       {extremeConditions && Object.keys(extremeConditions).length > 0 && (
//         <ExtremeConditionsDisplay extremes={extremeConditions} />
//       )}

//       {/* Recommendations */}
//       <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg">
//         <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
//           <span className="mr-2">📋</span>
//           Event-Specific Recommendations
//         </h4>
//         <ul className="space-y-3">
//           {recommendations.length > 0 ? (
//             recommendations.map((rec, index) => (
//               <li key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm">
//                 <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
//                   ✓
//                 </span>
//                 <span className="text-gray-700">{rec}</span>
//               </li>
//             ))
//           ) : (
//             <li className="flex items-start bg-white rounded-lg p-3 shadow-sm">
//               <span className="flex-shrink-0 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs mt-0.5 mr-3">
//                 ℹ️
//               </span>
//               <span className="text-gray-700">No specific recommendations needed. Weather conditions appear favorable!</span>
//             </li>
//           )}
//         </ul>
//       </div>
      
//       {/* Data Source Info */}
//       <div className="bg-gray-50 rounded-xl p-4 text-center">
//         <p className="text-sm text-gray-600">
//           📊 Based on analysis of <span className="font-semibold">{totalYearsAnalyzed} years</span> of historical NASA data
//         </p>
//         <p className="text-xs text-gray-500 mt-1">
//           Analysis generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default WeatherResults;


