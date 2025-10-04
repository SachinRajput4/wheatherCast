// services/aiEnhancementService.js
import axios from 'axios';

class AIEnhancementService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.enabled = !!this.openaiApiKey;
  }

  async enhanceRecommendations(weatherData, eventType, dateRangeDays) {
    if (!this.enabled) {
      console.log('🤖 AI enhancement disabled - no API key');
      return null;
    }

    try {
      const prompt = this.buildEnhancementPrompt(weatherData, eventType, dateRangeDays);
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo', // Fast and cheap
          messages: [
            {
              role: 'system',
              content: `You are a professional event planner and weather risk analyst. 
              Provide ONLY JSON output with no additional text. 
              Focus on practical, actionable recommendations.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 500,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      return JSON.parse(aiResponse);

    } catch (error) {
      console.error('🤖 AI enhancement failed:', error.message);
      return null; // Silent fail - don't break the main flow
    }
  }

  buildEnhancementPrompt(weatherData, eventType, dateRangeDays) {
    const { basicWeather, extremeConditions, location } = weatherData;
    
    return `
    Analyze this weather scenario and provide enhanced recommendations in JSON format.

    EVENT CONTEXT:
    - Type: ${eventType}
    - Duration: ${dateRangeDays} day(s)
    - Location: ${location?.name || 'Unknown'}

    WEATHER DATA:
    - Rain Probability: ${basicWeather.rainProbability}%
    - Temperature: ${basicWeather.avgTemperature}°C
    - Wind Speed: ${basicWeather.avgWindSpeed} km/h
    - Humidity: ${basicWeather.avgHumidity}%

    EXTREME CONDITIONS:
    - Very Hot (>35°C): ${extremeConditions.veryHot}%
    - Very Cold (<0°C): ${extremeConditions.veryCold}%
    - Very Windy (>25 km/h): ${extremeConditions.veryWindy}%
    - Very Wet (>10mm rain): ${extremeConditions.veryWet}%
    - Very Uncomfortable: ${extremeConditions.veryUncomfortable}%

    Return JSON in this exact structure:
    {
      "ai_enhanced_recommendations": ["array of 3-5 specific recommendations"],
      "creative_solutions": ["array of 2-3 innovative ideas"],
      "risk_mitigation_strategies": ["array of 2-3 risk reduction tactics"],
      "budget_optimization_tips": ["array of 2-3 cost-saving ideas"],
      "vendor_coordination_advice": ["array of 2-3 vendor-specific tips"]
    }

    Focus on practical, actionable advice for ${eventType}.
    `;
  }

  // Fallback for when AI is not available
  getFallbackEnhancements(weatherData, eventType) {
    return {
      ai_enhanced_recommendations: [
        "Monitor weather forecasts closely as event approaches",
        "Have flexible scheduling options ready"
      ],
      creative_solutions: [
        "Consider weather-themed elements that embrace conditions",
        "Plan interactive indoor-outdoor flow"
      ],
      risk_mitigation_strategies: [
        "Identify backup options for critical event elements",
        "Communicate contingency plans to all stakeholders"
      ],
      budget_optimization_tips: [
        "Prioritize essential weather protections first",
        "Consider rental vs purchase for temporary solutions"
      ],
      vendor_coordination_advice: [
        "Confirm vendor weather policies in advance",
        "Establish clear communication channels for weather updates"
      ]
    };
  }
}

export default new AIEnhancementService();