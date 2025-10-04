// frontend/src/components/AuraCastComponents/TripPlanner.jsx
import React, { useState } from 'react';

const TripPlanner = ({ onTripSelect }) => {
  const [selectedTrip, setSelectedTrip] = useState(null);

  const tripTypes = [
    { id: 'vacation', name: 'Vacation', icon: '✈️', description: 'Leisure travel planning' },
    { id: 'hiking', name: 'Hiking', icon: '🥾', description: 'Outdoor adventure planning' },
    { id: 'beach', name: 'Beach', icon: '🏖️', description: 'Coastal weather analysis' },
    { id: 'roadtrip', name: 'Road Trip', icon: '🚗', description: 'Multi-destination travel' },
    { id: 'camping', name: 'Camping', icon: '⛺', description: 'Outdoor accommodation planning' },
    { id: 'city', name: 'City Break', icon: '🏙️', description: 'Urban travel planning' }
  ];

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip.id);
    onTripSelect({ 
      type: 'trip', 
      name: `${trip.name} Planning`,
      tripType: trip.id
    });
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Plan Your Next Adventure</h3>
      <p className="text-gray-600 mb-6 text-sm">
        Choose your trip type to analyze weather patterns and get travel recommendations.
      </p>

      {/* Compact Category Section */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tripTypes.map((trip) => (
          <button
            key={trip.id}
            onClick={() => handleTripSelect(trip)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
              selectedTrip === trip.id
                ? 'bg-green-500 text-white border-green-500 shadow-md scale-105'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-green-300'
            }`}
          >
            <span className="mr-2">{trip.icon}</span>
            {trip.name}
          </button>
        ))}
      </div>

      {/* Detailed Cards (Optional - can be removed if you want only compact view) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tripTypes.map((trip) => (
          <div
            key={trip.id}
            onClick={() => handleTripSelect(trip)}
            className={`bg-white rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer group ${
              selectedTrip === trip.id
                ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                : 'border-gray-200 hover:border-green-300 hover:shadow-md'
            }`}
          >
            <div className={`text-3xl mb-3 transition-transform duration-200 ${
              selectedTrip === trip.id ? 'scale-110' : 'group-hover:scale-105'
            }`}>
              {trip.icon}
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-1">{trip.name}</h4>
            <p className="text-gray-600 text-xs mb-3">{trip.description}</p>
            <div className={`text-sm font-medium ${
              selectedTrip === trip.id ? 'text-green-600' : 'text-green-500'
            }`}>
              {selectedTrip === trip.id ? '✓ Selected' : 'Start Planning →'}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Trip Summary */}
      {selectedTrip && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-green-500 text-lg mr-2">✅</span>
            <div>
              <span className="font-semibold text-green-800">
                {tripTypes.find(t => t.id === selectedTrip)?.name} Selected
              </span>
              <p className="text-green-600 text-sm mt-1">
                Ready to analyze weather patterns for your trip
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;