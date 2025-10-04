import axios from 'axios';

class AIEnhancementService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.enabled = !!this.openaiApiKey;
  }



// Add to existing AIEnhancementService class
async enhanceTripRecommendations(tripData, departureDate, returnDate) {
  if (!this.enabled) {
    console.log('🤖 AI enhancement disabled - no API key');
    return null;
  }

  try {
    const prompt = this.buildTripEnhancementPrompt(tripData, departureDate, returnDate);
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional travel planner and weather risk analyst. 
            Provide ONLY JSON output with no additional text. 
            Focus on practical, actionable travel recommendations.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 600,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    return JSON.parse(aiResponse);

  } catch (error) {
    console.error('🤖 Trip AI enhancement failed:', error.message);
    return null;
  }
}

buildTripEnhancementPrompt(tripData, departureDate, returnDate) {
  const { origin, destination, return: returnLoc, tripType, travelMode } = tripData;
  
  return `
  Analyze this trip scenario and provide enhanced travel recommendations in JSON format.

  TRIP CONTEXT:
  - Type: ${tripType}
  - Travel Mode: ${travelMode}
  - Departure: ${departureDate}
  - Return: ${returnDate || 'One-way trip'}
  
  ORIGIN (${origin.location}):
  - Rain: ${origin.weather?.rainProbability}%
  - Temperature: ${origin.weather?.avgTemperature}°C
  - Extreme Heat: ${origin.weather?.extremeConditions?.veryHot}%
  
  DESTINATION (${destination.location}):
  - Rain: ${destination.weather?.rainProbability}%
  - Temperature: ${destination.weather?.avgTemperature}°C
  - Extreme Heat: ${destination.weather?.extremeConditions?.veryHot}%
  
  ${returnLoc ? `
  RETURN (${returnLoc.location}):
  - Rain: ${returnLoc.weather?.rainProbability}%
  - Temperature: ${returnLoc.weather?.avgTemperature}°C
  - Extreme Heat: ${returnLoc.weather?.extremeConditions?.veryHot}%
  ` : ''}

  Return JSON in this exact structure:
  {
    "trip_specific_recommendations": ["array of 3-5 travel-specific recommendations"],
    "route_optimization_tips": ["array of 2-3 route/scheduling tips"],
    "packing_enhancements": ["array of 2-3 additional packing suggestions"],
    "contingency_plans": ["array of 2-3 backup plans for weather disruptions"],
    "local_insights": ["array of 2-3 location-specific weather insights"]
  }

  Focus on practical, actionable advice for ${tripType} travel by ${travelMode}.
  `;
}

// Fallback for trip AI enhancements
getTripFallbackEnhancements(weatherDataArray, tripType) {
  return {
    trip_specific_recommendations: [
      "Check road conditions and weather alerts before departure",
      "Have flexible scheduling to accommodate weather delays",
      "Keep important documents and electronics in waterproof containers"
    ],
    route_optimization_tips: [
      "Consider traveling during drier parts of the day if possible",
      "Have alternative routes planned for severe weather"
    ],
    packing_enhancements: [
      "Pack layers for variable temperature conditions",
      "Include emergency snacks and water in your travel kit"
    ],
    contingency_plans: [
      "Identify safe stopping points along your route",
      "Have contact information for accommodations in case of delays"
    ],
    local_insights: [
      "Research local weather patterns for your destinations",
      "Understand how elevation changes might affect weather conditions"
    ]
  };
}
}

export default new AIEnhancementService();




