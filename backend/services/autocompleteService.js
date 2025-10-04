// backend/services/autocompleteService.js
import axios from 'axios';

class AutocompleteService {
  constructor() {
    this.baseUrl = 'https://nominatim.openstreetmap.org/search';
  }

  async getLocationSuggestions(query) {
    try {
      console.log('🔍 Fetching location suggestions for:', query);
      
      if (!query || query.length < 2) {
        return [];
      }

      const response = await axios.get(this.baseUrl, {
        params: {
          q: query,
          format: 'json',
          limit: 8,
          addressdetails: 1,
          'accept-language': 'en'
        },
        headers: {
          'User-Agent': 'WeatherParadeApp/1.0'
        }
      });

      const suggestions = response.data.map(place => ({
        display_name: place.display_name,
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lon),
        type: place.type,
        importance: place.importance,
        address: place.address
      }));

      console.log(`✅ Found ${suggestions.length} suggestions`);
      return suggestions;

    } catch (error) {
      console.error('❌ Autocomplete error:', error.message);
      return [];
    }
  }

  // Fallback for common cities
  getFallbackSuggestions(query) {
    const commonCities = [
      { display_name: "New York, USA", lat: 40.7128, lon: -74.0060 },
      { display_name: "London, UK", lat: 51.5074, lon: -0.1278 },
      { display_name: "Paris, France", lat: 48.8566, lon: 2.3522 },
      { display_name: "Tokyo, Japan", lat: 35.6762, lon: 139.6503 },
      { display_name: "Delhi, India", lat: 28.6139, lon: 77.2090 },
      { display_name: "Sydney, Australia", lat: -33.8688, lon: 151.2093 },
      { display_name: "Mumbai, India", lat: 19.0760, lon: 72.8777 },
      { display_name: "Berlin, Germany", lat: 52.5200, lon: 13.4050 },
      { display_name: "Dubai, UAE", lat: 25.2048, lon: 55.2708 },
      { display_name: "Singapore", lat: 1.3521, lon: 103.8198 }
    ];

    const normalizedQuery = query.toLowerCase();
    return commonCities.filter(city => 
      city.display_name.toLowerCase().includes(normalizedQuery)
    ).slice(0, 5);
  }
}

export default new AutocompleteService();