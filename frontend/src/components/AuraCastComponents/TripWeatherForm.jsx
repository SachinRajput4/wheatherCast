// frontend/src/components/AuraCastComponents/TripWeatherForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const url = import.meta.env.VITE_BACKEND_API_URL;

const TripWeatherForm = ({ onAnalysis }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [tripType, setTripType] = useState('vacation');
  const [travelMode, setTravelMode] = useState('road');
  const [enableAI, setEnableAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [originGpsLoading, setOriginGpsLoading] = useState(false);
  const [destinationGpsLoading, setDestinationGpsLoading] = useState(false);
  
  const originInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const originSuggestionsRef = useRef(null);
  const destinationSuggestionsRef = useRef(null);

  const tripTypes = [
    { id: 'vacation', name: 'Vacation', icon: '✈️' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'hiking', name: 'Hiking', icon: '🥾' },
    { id: 'beach', name: 'Beach', icon: '🏖️' },
    { id: 'city', name: 'City Break', icon: '🏙️' },
    { id: 'roadtrip', name: 'Road Trip', icon: '🚗' },
    { id: 'camping', name: 'Camping', icon: '⛺' },
    { id: 'adventure', name: 'Adventure', icon: '🧗' }
  ];

  const travelModes = [
    { id: 'road', name: 'Road', icon: '🚗' },
    { id: 'flight', name: 'Flight', icon: '✈️' },
    { id: 'train', name: 'Train', icon: '🚆' },
    { id: 'bus', name: 'Bus', icon: '🚌' }
  ];

  // Fetch suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async (query, setSuggestions) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `${url}/api/locations/suggestions?query=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      if (origin.length >= 2) {
        fetchSuggestions(origin, setOriginSuggestions);
      }
      if (destination.length >= 2) {
        fetchSuggestions(destination, setDestinationSuggestions);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [origin, destination]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (originSuggestionsRef.current && !originSuggestionsRef.current.contains(event.target) &&
          originInputRef.current && !originInputRef.current.contains(event.target)) {
        setShowOriginSuggestions(false);
      }
      if (destinationSuggestionsRef.current && !destinationSuggestionsRef.current.contains(event.target) &&
          destinationInputRef.current && !destinationInputRef.current.contains(event.target)) {
        setShowDestinationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get current location using GPS
  const getCurrentLocation = (setLocation, setSelectedLocation, setGpsLoading) => {
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
  const handleSuggestionSelect = (suggestion, setLocation, setSelectedLocation, setShowSuggestions) => {
    setLocation(suggestion.display_name);
    setSelectedLocation(suggestion);
    setShowSuggestions(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedOrigin || !selectedDestination || !departureDate) {
      alert('Please select origin, destination, and departure date');
      return;
    }
    
    if (returnDate && returnDate < departureDate) {
      alert('Return date cannot be before departure date');
      return;
    }
    
    const tripDuration = returnDate ? 
      Math.ceil((returnDate - departureDate) / (1000 * 60 * 60 * 24)) + 1 : 1;
    
    if (tripDuration > 30) {
      alert('Trip duration cannot exceed 30 days');
      return;
    }
    
    setLoading(true);
    try {
      const requestBody = {
        origin: selectedOrigin.display_name,
        destination: selectedDestination.display_name,
        departureDate: departureDate.toISOString().split('T')[0],
        tripType: tripType,
        travelMode: travelMode,
        enableAI: enableAI
      };
      
      // Add returnDate only if provided (make it required as per your API)
      if (returnDate) {
        requestBody.returnDate = returnDate.toISOString().split('T')[0];
      }
      
      console.log('Sending trip analysis request:', requestBody);
      
      const response = await fetch(`${url}/api/weather/trip/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Trip analysis failed');
      }
      
      onAnalysis(data);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error analyzing trip: ${error.message}`);
    }
    setLoading(false);
  };

  // Calculate trip duration
  const getTripDuration = () => {
    if (!departureDate || !returnDate) return '';
    
    const days = Math.ceil((returnDate - departureDate) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Trip Weather Planning ✈️
        </h2>
        <p className="text-gray-600">Plan your adventure with perfect weather insights</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Type Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Trip Type:
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {tripTypes.map(trip => (
              <button
                key={trip.id}
                type="button"
                onClick={() => setTripType(trip.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border flex items-center gap-2 ${
                  tripType === trip.id
                    ? 'bg-green-500 text-white border-green-500 shadow-md scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-green-300'
                }`}
              >
                <span>{trip.icon}</span>
                <span>{trip.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Travel Mode Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Travel Mode:
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {travelModes.map(mode => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setTravelMode(mode.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border flex items-center gap-2 ${
                  travelMode === mode.id
                    ? 'bg-blue-500 text-white border-blue-500 shadow-md scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-300'
                }`}
              >
                <span>{mode.icon}</span>
                <span>{mode.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Travel Dates */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Travel Dates:
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-2">
                Departure Date *
              </label>
              <DatePicker
                selected={departureDate}
                onChange={setDepartureDate}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                placeholderText="YYYY-MM-DD"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-2">
                Return Date *
              </label>
              <DatePicker
                selected={returnDate}
                onChange={setReturnDate}
                minDate={departureDate || new Date()}
                dateFormat="yyyy-MM-dd"
                placeholderText="YYYY-MM-DD"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
              />
            </div>
          </div>

          {departureDate && returnDate && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center text-sm text-green-800">
                <span className="mr-2">⏱️</span>
                <strong>Trip Duration:</strong> 
                <span className="ml-1">{getTripDuration()}</span>
                <span className="mx-2">•</span>
                <span>{departureDate.toISOString().split('T')[0]} to {returnDate.toISOString().split('T')[0]}</span>
              </div>
            </div>
          )}
        </div>

        {/* Origin Location Input */}
        <div className="space-y-2">
          <label htmlFor="origin-input" className="block text-sm font-semibold text-gray-700">
            Origin: *
          </label>
          <div className="relative">
            <input
              id="origin-input"
              ref={originInputRef}
              type="text"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                setSelectedOrigin(null);
              }}
              onFocus={() => origin.length >= 2 && setShowOriginSuggestions(true)}
              placeholder="Enter origin city or address"
              required
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
            />
            
            <button 
              type="button" 
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition duration-200 ${
                originGpsLoading 
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
              onClick={() => getCurrentLocation(setOrigin, setSelectedOrigin, setOriginGpsLoading)}
              disabled={originGpsLoading}
              title="Use current location"
            >
              {originGpsLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                '📍'
              )}
            </button>
          </div>

          {/* Origin Autocomplete Suggestions */}
          {showOriginSuggestions && originSuggestions.length > 0 && (
            <div ref={originSuggestionsRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {originSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-green-50 cursor-pointer transition duration-150"
                  onClick={() => handleSuggestionSelect(suggestion, setOrigin, setSelectedOrigin, setShowOriginSuggestions)}
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
        </div>

        {/* Selected Origin Display */}
        {selectedOrigin && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center text-sm text-blue-800">
              <span className="mr-2">📍</span>
              <strong>Origin Selected:</strong> 
              <span className="ml-1">{selectedOrigin.display_name}</span>
            </div>
          </div>
        )}

        {/* Destination Location Input */}
        <div className="space-y-2">
          <label htmlFor="destination-input" className="block text-sm font-semibold text-gray-700">
            Destination: *
          </label>
          <div className="relative">
            <input
              id="destination-input"
              ref={destinationInputRef}
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setSelectedDestination(null);
              }}
              onFocus={() => destination.length >= 2 && setShowDestinationSuggestions(true)}
              placeholder="Enter destination city or address"
              required
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
            />
            
            <button 
              type="button" 
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition duration-200 ${
                destinationGpsLoading 
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
              onClick={() => getCurrentLocation(setDestination, setSelectedDestination, setDestinationGpsLoading)}
              disabled={destinationGpsLoading}
              title="Use current location"
            >
              {destinationGpsLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                '📍'
              )}
            </button>
          </div>

          {/* Destination Autocomplete Suggestions */}
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div ref={destinationSuggestionsRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {destinationSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-green-50 cursor-pointer transition duration-150"
                  onClick={() => handleSuggestionSelect(suggestion, setDestination, setSelectedDestination, setShowDestinationSuggestions)}
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
        </div>

        {/* Selected Destination Display */}
        {selectedDestination && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center text-sm text-purple-800">
              <span className="mr-2">🎯</span>
              <strong>Destination Selected:</strong> 
              <span className="ml-1">{selectedDestination.display_name}</span>
            </div>
          </div>
        )}

        {/* AI Enhancement Toggle */}
        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
          <input
            type="checkbox"
            id="enableAI"
            checked={enableAI}
            onChange={(e) => setEnableAI(e.target.checked)}
            className="w-5 h-5 text-green-600 bg-white border-green-300 rounded focus:ring-green-500 focus:ring-2"
          />
          <label htmlFor="enableAI" className="flex items-center space-x-2 text-sm font-medium text-green-800 cursor-pointer">
            <span className="text-lg">🤖</span>
            <div>
              <div className="font-semibold">Enable AI Enhancement</div>
              <div className="text-green-600 text-xs">Get smarter recommendations and travel insights</div>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading || !selectedOrigin || !selectedDestination || !departureDate || !returnDate || !tripType}
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Trip Weather...
            </span>
          ) : (
            `Analyze Trip Weather ${enableAI ? 'with AI 🤖' : ''}`
          )}
        </button>
      </form>
    </div>
  );
};

export default TripWeatherForm;