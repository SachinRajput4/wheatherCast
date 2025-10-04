// frontend/src/components/AuraCastComponents/EventPlanner.jsx
import React, { useState } from 'react';

const EventPlanner = ({ onTripSelect }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const eventTypes = [
    { id: 'wedding', name: 'Wedding', icon: '💒', description: 'Plan your perfect day with weather confidence' },
    { id: 'concert', name: 'Concert', icon: '🎵', description: 'Outdoor music event planning' },
    { id: 'sports', name: 'Sports Event', icon: '⚽', description: 'Game day weather analysis' },
    { id: 'corporate', name: 'Corporate Event', icon: '🏢', description: 'Business outdoor functions' },
    { id: 'festival', name: 'Festival', icon: '🎪', description: 'Multi-day festival planning' },
    { id: 'party', name: 'Outdoor Party', icon: '🎊', description: 'Social gatherings and parties' }
  ];

  const handleEventSelect = (event) => {
    setSelectedEvent(event.id);
    onTripSelect({ 
      type: 'event', 
      name: `${event.name} Planning`,
      eventType: event.id
    });
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Plan Your Perfect Event</h3>
      <p className="text-gray-600 mb-6 text-sm">
        Select your event type to get started with weather probability analysis.
      </p>

      {/* Compact Category Section */}
      <div className="flex flex-wrap gap-2 mb-6">
        {eventTypes.map((event) => (
          <button
            key={event.id}
            onClick={() => handleEventSelect(event)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
              selectedEvent === event.id
                ? 'bg-blue-500 text-white border-blue-500 shadow-md scale-105'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-300'
            }`}
          >
            <span className="mr-2">{event.icon}</span>
            {event.name}
          </button>
        ))}
      </div>

      {/* Detailed Cards (Optional - can be removed if you want only compact view) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventTypes.map((event) => (
          <div
            key={event.id}
            onClick={() => handleEventSelect(event)}
            className={`bg-white rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer group ${
              selectedEvent === event.id
                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className={`text-3xl mb-3 transition-transform duration-200 ${
              selectedEvent === event.id ? 'scale-110' : 'group-hover:scale-105'
            }`}>
              {event.icon}
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-1">{event.name}</h4>
            <p className="text-gray-600 text-xs mb-3">{event.description}</p>
            <div className={`text-sm font-medium ${
              selectedEvent === event.id ? 'text-blue-600' : 'text-blue-500'
            }`}>
              {selectedEvent === event.id ? '✓ Selected' : 'Start Planning →'}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Event Summary */}
      {selectedEvent && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-blue-500 text-lg mr-2">✅</span>
            <div>
              <span className="font-semibold text-blue-800">
                {eventTypes.find(e => e.id === selectedEvent)?.name} Selected
              </span>
              <p className="text-blue-600 text-sm mt-1">
                Ready to analyze weather patterns for your event
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPlanner;