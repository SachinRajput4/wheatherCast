// frontend/src/components/AuraCastComponents/EventWeatherForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const url = import.meta.env.VITE_BACKEND_API_URL;

const EventWeatherForm = ({ onAnalysis }) => {
  const [location, setLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [eventType, setEventType] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [isDateRange, setIsDateRange] = useState(false);
  const [enableAI, setEnableAI] = useState(false);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const eventTypes = [
    { id: 'wedding', name: 'Wedding', icon: '💒', supportsRange: true },
    { id: 'concert', name: 'Concert', icon: '🎵', supportsRange: true },
    { id: 'sports', name: 'Sports Event', icon: '⚽', supportsRange: true },
    { id: 'picnic', name: 'Picnic', icon: '🧺', supportsRange: true },
    { id: 'festival', name: 'Festival', icon: '🎪', supportsRange: true },
    { id: 'corporate_event', name: 'Corporate Event', icon: '🏢', supportsRange: true },
    { id: 'outdoor_party', name: 'Outdoor Party', icon: '🎊', supportsRange: true },
    { id: 'photoshoot', name: 'Photoshoot', icon: '📸', supportsRange: true },
    { id: 'parade', name: 'Parade', icon: '🎉', supportsRange: false },
    { id: 'other', name: 'Other Event', icon: '📅', supportsRange: true }
  ];

  // Fetch suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (location.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await fetch(
          `${url}/api/locations/suggestions?query=${encodeURIComponent(location)}`
        );
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [location]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get current location using GPS
  const getCurrentLocation = () => {
    setGpsLoading(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const locationName = data.display_name || `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          
          setLocation(locationName);
          setSelectedLocation({
            display_name: locationName,
            lat: latitude,
            lon: longitude
          });
          setShowSuggestions(false);
        } catch (error) {
          const locationName = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          setLocation(locationName);
          setSelectedLocation({
            display_name: locationName,
            lat: latitude,
            lon: longitude
          });
        }
        
        setGpsLoading(false);
      },
      (error) => {
        console.error('GPS Error:', error);
        let errorMessage = 'Unable to retrieve your location. ';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
        
        alert(errorMessage);
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setLocation(suggestion.display_name);
    setSelectedLocation(suggestion);
    setShowSuggestions(false);
  };

  // Handle event type selection
  const handleEventTypeSelect = (eventId) => {
    setEventType(eventId);
    const selectedEvent = eventTypes.find(event => event.id === eventId);
    if (selectedEvent && selectedEvent.supportsRange) {
      setIsDateRange(true);
    } else {
      setIsDateRange(false);
      setEndDate(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLocation || !startDate) {
      alert('Please select a location and start date');
      return;
    }
    
    if (isDateRange && !endDate) {
      alert('Please select an end date for multi-day events');
      return;
    }
    
    if (isDateRange && endDate < startDate) {
      alert('End date cannot be before start date');
      return;
    }
    
    const dateRange = isDateRange ? 
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1 : 1;
    
    if (dateRange > 30) {
      alert('Date range cannot exceed 30 days');
      return;
    }
    
    setLoading(true);
    try {
      const requestBody = {
        location: selectedLocation.display_name,
        coordinates: {
          lat: selectedLocation.lat,
          lon: selectedLocation.lon
        },
        date: startDate.toISOString(),
        eventType: eventType,
        enableAI: true
      };
      
      // Add endDate only for date ranges
      if (isDateRange && endDate) {
        requestBody.endDate = endDate.toISOString();
      }
      
      const response = await fetch(`${url}/api/weather/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }
      
      onAnalysis(data);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error analyzing weather: ${error.message}`);
    }
    setLoading(false);
  };

  // Calculate date range display
  const getDateRangeText = () => {
    if (!isDateRange || !startDate || !endDate) return '';
    
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Event Weather Analysis 🎉
        </h2>
        <p className="text-gray-600">Plan your perfect event with weather confidence</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Type Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Event Type:
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {eventTypes.map(event => (
              <button
                key={event.id}
                type="button"
                onClick={() => handleEventTypeSelect(event.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border flex items-center gap-2 ${
                  eventType === event.id
                    ? 'bg-blue-500 text-white border-blue-500 shadow-md scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-300'
                } ${!event.supportsRange ? 'opacity-70' : ''}`}
                title={!event.supportsRange ? 'Single day event only' : 'Supports multi-day events'}
              >
                <span>{event.icon}</span>
                <span>{event.name}</span>
              </button>
            ))}
          </div>
          {!eventType && (
            <p className="text-sm text-orange-600">Please select your event type</p>
          )}
        </div>
        

        {/* Date Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700">
              Event Dates:
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Multi-day event</span>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDateRange ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                onClick={() => {
                  setIsDateRange(!isDateRange);
                  if (isDateRange) setEndDate(null);
                }}
                disabled={eventType && !eventTypes.find(e => e.id === eventType)?.supportsRange}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDateRange ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-2">
                Start Date {isDateRange && '*'}
              </label>
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select start date"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            {isDateRange && (
              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  End Date *
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={setEndDate}
                  minDate={startDate || new Date()}
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Select end date"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>
            )}
          </div>

          {isDateRange && startDate && endDate && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center text-sm text-blue-800">
                <span className="mr-2">📅</span>
                <strong>Event Duration:</strong> 
                <span className="ml-1">{getDateRangeText()}</span>
                <span className="mx-2">•</span>
                <span>{startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Location Input with Autocomplete */}
        <div className="space-y-2">
          <label htmlFor="location-input" className="block text-sm font-semibold text-gray-700">
            Event Location:
          </label>
          <div className="relative">
            <input
              id="location-input"
              ref={inputRef}
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setSelectedLocation(null);
              }}
              onFocus={() => location.length >= 2 && setShowSuggestions(true)}
              placeholder="Search for a city, address, or use current location"
              required
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
            
            <button 
              type="button" 
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition duration-200 ${
                gpsLoading 
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
              onClick={getCurrentLocation}
              disabled={gpsLoading}
              title="Use current location"
            >
              {gpsLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                '📍'
              )}
            </button>
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div ref={suggestionsRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-blue-50 cursor-pointer transition duration-150"
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <div className="font-medium text-gray-800">
                    {suggestion.display_name}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {suggestion.type} • {suggestion.address?.country || ''}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500">
            Start typing to see suggestions, or click the location pin for GPS
          </p>
        </div>

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-sm text-green-800">
              <span className="mr-2">✅</span>
              <strong>Selected:</strong> 
              <span className="ml-1">{selectedLocation.display_name}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading || !selectedLocation || !startDate || (isDateRange && !endDate) || !eventType}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isDateRange ? 'Analyzing Event Date Range...' : 'Analyzing Event Weather...'}
            </span>
          ) : (
            `Check Event Weather Risk${isDateRange ? ' for Date Range' : ''}`
          )}
        </button>
        <div className="flex items-center space-x-2 mb-4">
  <input
    type="checkbox"
    id="enableAI"
    checked={enableAI}
    onChange={(e) => setEnableAI(e.target.checked)}
    className="rounded border-gray-300"
  />
  <label htmlFor="enableAI" className="text-sm font-medium">
    🤖 Enable AI Enhancement (Better recommendations)
  </label>
</div>
      </form>
    </div>
  );
};

export default EventWeatherForm;