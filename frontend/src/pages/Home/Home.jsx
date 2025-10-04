// frontend/src/pages/Home/Home.jsx
import React, { useState } from 'react';
import LandingPageHeader from '../../components/landingPageHeader/landingPageHeader';
import EventPlanner from '../../components/AuraCastComponents/EventPlanner';
import TripPlanner from '../../components/AuraCastComponents/TripPlanner';
import EventWeatherForm from '../../components/AuraCastComponents/EventWeatherForm';
import TripWeatherForm from '../../components/AuraCastComponents/TripWeatherForm';
import EventResults from '../../components/AuraCastComponents/EventResults';
import TripResults from '../../components/AuraCastComponents/TripResults';

const Home = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [currentSelection, setCurrentSelection] = useState(null);

  const handleItemSelect = (item) => {
    setCurrentSelection(item);
    setShowForm(true);
    setAnalysisData(null); // Reset any previous analysis
  };

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    setShowForm(false);
  };

  const handleBackToSelection = () => {
    setShowForm(false);
    setAnalysisData(null);
    setCurrentSelection(null);
  };

  const handleNewAnalysis = () => {
    setShowForm(true);
    setAnalysisData(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedItem(null);
    setShowForm(false);
    setAnalysisData(null);
    setCurrentSelection(null);
  };

  // Get display name for current selection
  const getSelectionDisplayName = () => {
    if (!currentSelection) return '';
    
    if (currentSelection.type === 'event') {
      const eventNames = {
        wedding: 'Wedding',
        concert: 'Concert',
        sports: 'Sports Event',
        picnic: 'Picnic',
        festival: 'Festival',
        corporate_event: 'Corporate Event',
        outdoor_party: 'Outdoor Party',
        photoshoot: 'Photoshoot',
        parade: 'Parade',
        other: 'Event'
      };
      return eventNames[currentSelection.eventType] || 'Event';
    } else {
      const tripNames = {
        beach: 'Beach Vacation',
        hiking: 'Hiking Trip',
        city: 'City Break',
        roadtrip: 'Road Trip',
        camping: 'Camping Trip',
        ski: 'Ski Trip',
        cruise: 'Cruise',
        adventure: 'Adventure Trip'
      };
      return tripNames[currentSelection.tripType] || 'Trip';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <LandingPageHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        {(showForm || analysisData) && (
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className={`flex items-center ${!showForm && !analysisData ? 'text-blue-600 font-semibold' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  !showForm && !analysisData ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="ml-2">Select Type</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center ${showForm && !analysisData ? 'text-blue-600 font-semibold' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  showForm && !analysisData ? 'bg-blue-600 text-white' : 
                  analysisData ? 'bg-green-500 text-white' : 'bg-gray-200'
                }`}>
                  {analysisData ? '✓' : '2'}
                </div>
                <span className="ml-2">Enter Details</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center ${analysisData ? 'text-green-600 font-semibold' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  analysisData ? 'bg-green-500 text-white' : 'bg-gray-200'
                }`}>
                  3
                </div>
                <span className="ml-2">View Results</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {!showForm && !analysisData ? (
          // Step 1: Selection View
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="flex border-b">
              <button
                onClick={() => handleTabChange('events')}
                className={`flex-1 py-4 px-6 text-lg font-semibold text-center transition-all duration-200 ${
                  activeTab === 'events'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                }`}
              >
                🎉 Event Planning
              </button>
              <button
                onClick={() => handleTabChange('trips')}
                className={`flex-1 py-4 px-6 text-lg font-semibold text-center transition-all duration-200 ${
                  activeTab === 'trips'
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-green-500 hover:bg-gray-50'
                }`}
              >
                ✈️ Trip Planning
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'events' ? (
                <EventPlanner onTripSelect={handleItemSelect} />
              ) : (
                <TripPlanner onTripSelect={handleItemSelect} />
              )}
            </div>
          </div>
        ) : showForm ? (
          // Step 2: Form View
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="border-b p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {activeTab === 'events' ? 'Event Weather Analysis' : 'Trip Weather Planning'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Planning your {getSelectionDisplayName().toLowerCase()}
                  </p>
                </div>
                <button
                  onClick={handleBackToSelection}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  ← Back to Selection
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {activeTab === 'events' ? (
                <EventWeatherForm onAnalysis={handleAnalysisComplete} />
              ) : (
                <TripWeatherForm onAnalysis={handleAnalysisComplete} />
              )}
            </div>
          </div>
        ) : (
          // Step 3: Results View
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Weather Analysis Complete
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Results for your {getSelectionDisplayName().toLowerCase()}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleNewAnalysis}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    New Analysis
                  </button>
                  <button
                    onClick={handleBackToSelection}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    ← Back to Selection
                  </button>
                </div>
              </div>
            </div>

            {activeTab === 'events' ? (
              <EventResults data={analysisData} />
            ) : (
              <TripResults data={analysisData} />
            )}
          </div>
        )}

        {/* Empty State - Only show when no selection or form */}
        {!showForm && !analysisData && !currentSelection && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🌤️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {activeTab === 'events' ? 'Plan Your Perfect Event' : 'Plan Your Next Adventure'}
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {activeTab === 'events' 
                ? 'Get detailed weather analysis and recommendations for weddings, concerts, festivals, and more. Make informed decisions with NASA historical data.'
                : 'Analyze weather patterns for your trips and get personalized packing and activity recommendations based on 30+ years of climate data.'
              }
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Select a {activeTab === 'events' ? 'event' : 'trip'} type above to get started
            </div>
          </div>
        )}
      </div>

      {/* Features Section - Only show when in selection view */}
      {!showForm && !analysisData && !currentSelection && (
        <div className="bg-white py-16 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our Weather Planner?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Leverage NASA's historical data and AI-powered insights to make informed decisions about your outdoor events and trips.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">30+ Years of NASA Data</h3>
                <p className="text-gray-600">
                  Access comprehensive historical weather patterns from NASA's Earth observation datasets
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
                <p className="text-gray-600">
                  Get personalized recommendations based on event/trip type and historical probabilities
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Climate Trend Analysis</h3>
                <p className="text-gray-600">
                  Understand how climate change is affecting weather patterns in your chosen location
                </p>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🎉</span>
                  <h3 className="text-xl font-bold text-gray-800">Perfect for Events</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Wedding weather planning</li>
                  <li>• Outdoor concert safety</li>
                  <li>• Festival contingency plans</li>
                  <li>• Corporate event scheduling</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">✈️</span>
                  <h3 className="text-xl font-bold text-gray-800">Ideal for Trips</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Vacation packing guidance</li>
                  <li>• Hiking trail conditions</li>
                  <li>• Road trip route planning</li>
                  <li>• Activity recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;









// // frontend/src/pages/Home/Home.jsx
// import React, { useState } from 'react';
// import LandingPageHeader from '../../components/LandingPageHeader/LandingPageHeader';
// // import WeatherDashboard from '../../components/AuraCastComponents/WeatherDashboard';
// import EventPlanner from '../../components/AuraCastComponents/EventPlanner';
// import TripPlanner from '../../components/AuraCastComponents/TripPlanner';

// const Home = () => {
//   const [activeTab, setActiveTab] = useState('events');
//   const [selectedItem, setSelectedItem] = useState(null);

//   // Sample data for different event and trip types
//   const eventData = {
//     wedding: {
//       name: "Wedding Planning",
//       type: "event",
//       startDate: "2024-06-15",
//       endDate: "2024-06-15",
//       weatherSummary: {
//         rainProbability: 35,
//         avgTemperature: 24,
//         riskLevel: "MODERATE"
//       },
//       extremeConditions: [
//         { icon: '🌧️', name: 'Very Wet', probability: 25 },
//         { icon: '🔥', name: 'Very Hot', probability: 8 },
//         { icon: '💨', name: 'Very Windy', probability: 15 }
//       ],
//       recommendations: [
//         'Consider indoor backup venue for ceremony',
//         'Provide umbrellas for guests',
//         'Have tent backup for outdoor reception',
//         'Plan for potential humidity - consider fans'
//       ],
//       historicalTrends: {
//         analysis: 'Based on 30 years of NASA data, June weddings have a 35% chance of rain. Temperatures are typically pleasant for outdoor celebrations.',
//         note: 'Rain probability has increased by 8% in the last 15 years'
//       }
//     },
//     concert: {
//       name: "Outdoor Concert Planning",
//       type: "event",
//       startDate: "2024-07-20",
//       endDate: "2024-07-20",
//       weatherSummary: {
//         rainProbability: 20,
//         avgTemperature: 28,
//         riskLevel: "LOW"
//       },
//       extremeConditions: [
//         { icon: '🔥', name: 'Very Hot', probability: 18 },
//         { icon: '🌧️', name: 'Very Wet', probability: 12 },
//         { icon: '💨', name: 'Very Windy', probability: 22 }
//       ],
//       recommendations: [
//         'Provide shaded areas for audience',
//         'Have water stations available',
//         'Monitor wind for stage equipment safety',
//         'Sound system backup for potential rain'
//       ],
//       historicalTrends: {
//         analysis: 'July concerts typically enjoy warm evenings with low rain probability. Perfect for outdoor music events.',
//         note: 'Evening temperatures ideal for outdoor entertainment'
//       }
//     },
//     festival: {
//       name: "Music Festival Planning",
//       type: "event",
//       startDate: "2024-08-10",
//       endDate: "2024-08-12",
//       weatherSummary: {
//         rainProbability: 28,
//         avgTemperature: 26,
//         riskLevel: "MODERATE"
//       },
//       extremeConditions: [
//         { icon: '🌧️', name: 'Very Wet', probability: 20 },
//         { icon: '🔥', name: 'Very Hot', probability: 25 },
//         { icon: '💨', name: 'Very Windy', probability: 18 }
//       ],
//       recommendations: [
//         'Multiple covered stages required',
//         'Mud management plan for grounds',
//         'Cooling stations for hot days',
//         'Flexible scheduling for weather changes'
//       ],
//       historicalTrends: {
//         analysis: '3-day festivals in August have varied conditions. Day 2 typically has the best weather patterns.',
//         note: 'Multi-day events require comprehensive contingency planning'
//       }
//     }
//   };

//   const tripData = {
//     vacation: {
//       name: "Beach Vacation Planning",
//       type: "trip",
//       startDate: "2024-07-15",
//       endDate: "2024-07-22",
//       weatherSummary: {
//         rainProbability: 15,
//         avgTemperature: 30,
//         riskLevel: "LOW"
//       },
//       extremeConditions: [
//         { icon: '🔥', name: 'Very Hot', probability: 35 },
//         { icon: '🌧️', name: 'Very Wet', probability: 8 },
//         { icon: '💨', name: 'Very Windy', probability: 12 }
//       ],
//       recommendations: [
//         'High SPF sunscreen essential',
//         'Light rain jacket for occasional showers',
//         'Hydration packs for beach days',
//         'Indoor activity options for hottest days'
//       ],
//       historicalTrends: {
//         analysis: 'Perfect beach weather with minimal rainfall. UV levels typically high during midday hours.',
//         note: 'Water temperatures ideal for swimming and water sports'
//       }
//     },
//     hiking: {
//       name: "Mountain Hiking Trip",
//       type: "trip",
//       startDate: "2024-09-05",
//       endDate: "2024-09-08",
//       weatherSummary: {
//         rainProbability: 40,
//         avgTemperature: 18,
//         riskLevel: "MODERATE"
//       },
//       extremeConditions: [
//         { icon: '🌧️', name: 'Very Wet', probability: 32 },
//         { icon: '❄️', name: 'Very Cold', probability: 15 },
//         { icon: '💨', name: 'Very Windy', probability: 28 }
//       ],
//       recommendations: [
//         'Waterproof gear mandatory',
//         'Layered clothing for temperature changes',
//         'Emergency shelter options',
//         'Check trail conditions daily'
//       ],
//       historicalTrends: {
//         analysis: 'Mountain weather can change rapidly. September offers cooler temperatures but higher precipitation.',
//         note: 'Altitude variations significantly impact weather conditions'
//       }
//     },
//     roadtrip: {
//       name: "Coastal Road Trip",
//       type: "trip",
//       startDate: "2024-06-10",
//       endDate: "2024-06-17",
//       weatherSummary: {
//         rainProbability: 22,
//         avgTemperature: 25,
//         riskLevel: "LOW"
//       },
//       extremeConditions: [
//         { icon: '🌧️', name: 'Very Wet', probability: 18 },
//         { icon: '💨', name: 'Very Windy', probability: 25 },
//         { icon: '☀️', name: 'Very Sunny', probability: 65 }
//       ],
//       recommendations: [
//         'Convertible-friendly weather expected',
//         'Coastal wind protection needed',
//         'Flexible itinerary for scenic stops',
//         'Evening jacket for cooler coastal temps'
//       ],
//       historicalTrends: {
//         analysis: 'Ideal road trip conditions with moderate temperatures and good visibility along coastal routes.',
//         note: 'Morning fog common in coastal areas - clears by midday'
//       }
//     }
//   };

//   const handleItemSelect = (item) => {
//     if (item.type === 'event') {
//       setSelectedItem(eventData[item.eventType] || eventData.wedding);
//     } else if (item.type === 'trip') {
//       setSelectedItem(tripData[item.tripType] || tripData.vacation);
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSelectedItem(null); // Clear selection when switching tabs
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <LandingPageHeader />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Tab Navigation */}
//         <div className="bg-white rounded-2xl shadow-lg mb-8">
//           <div className="flex border-b">
//             <button
//               onClick={() => handleTabChange('events')}
//               className={`flex-1 py-4 px-6 text-lg font-semibold text-center transition-all duration-200 ${
//                 activeTab === 'events'
//                   ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
//                   : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
//               }`}
//             >
//               🎉 Event Planning
//             </button>
//             <button
//               onClick={() => handleTabChange('trips')}
//               className={`flex-1 py-4 px-6 text-lg font-semibold text-center transition-all duration-200 ${
//                 activeTab === 'trips'
//                   ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
//                   : 'text-gray-600 hover:text-green-500 hover:bg-gray-50'
//               }`}
//             >
//               ✈️ Trip Planning
//             </button>
//           </div>

//           {/* Tab Content */}
//           <div className="p-6">
//             {activeTab === 'events' ? (
//               <EventPlanner onTripSelect={handleItemSelect} />
//             ) : (
//               <TripPlanner onTripSelect={handleItemSelect} />
//             )}
//           </div>
//         </div>

//         {/* Dashboard - Only show when an item is selected */}
//         {selectedItem ? (
//           <WeatherDashboard selectedTrip={selectedItem} />
//         ) : (
//           <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
//             <div className="text-6xl mb-4">🌤️</div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">
//               {activeTab === 'events' ? 'Select an Event Type' : 'Select a Trip Type'}
//             </h3>
//             <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//               {activeTab === 'events' 
//                 ? 'Choose from weddings, concerts, festivals, or other events to see detailed weather analysis and recommendations.'
//                 : 'Select your adventure type - beach vacation, hiking trip, road trip, or others - for personalized weather insights.'
//               }
//             </p>
//             <div className="mt-6 text-sm text-gray-500">
//               Click on any {activeTab === 'events' ? 'event' : 'trip'} type above to get started
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Features Section - Only show when no item is selected */}
//       {!selectedItem && (
//         <div className="bg-white py-16 mt-8">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-12">
//               <h2 className="text-4xl font-bold text-gray-900 mb-4">
//                 Why Choose Our Weather Planner?
//               </h2>
//               <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//                 Leverage NASA's historical data and AI-powered insights to make informed decisions about your outdoor events and trips.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div className="text-center">
//                 <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <span className="text-2xl">📊</span>
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">30+ Years of NASA Data</h3>
//                 <p className="text-gray-600">
//                   Access comprehensive historical weather patterns from NASA's Earth observation datasets
//                 </p>
//               </div>

//               <div className="text-center">
//                 <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <span className="text-2xl">🤖</span>
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
//                 <p className="text-gray-600">
//                   Get personalized recommendations based on event type and historical probabilities
//                 </p>
//               </div>

//               <div className="text-center">
//                 <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <span className="text-2xl">🌍</span>
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">Climate Trend Analysis</h3>
//                 <p className="text-gray-600">
//                   Understand how climate change is affecting weather patterns in your chosen location
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;