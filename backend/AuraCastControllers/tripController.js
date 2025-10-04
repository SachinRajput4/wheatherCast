// backend/controllers/tripController.js
import nasaService from "../services/nasaService.js";
import aiEnhancementService from "../services/aiEnhancementService.js";
import { geocodeLocation } from "./weatherController.js";

const analyzeTrip = async (req, res) => {
  try {
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      tripType = "vacation",
      travelMode = "road",
      enableAI = false
    } = req.body;

    console.log("🎯 Received trip request:", {
      origin,
      destination,
      departureDate,
      returnDate,
      tripType,
      travelMode,
      enableAI
    });

    if (!origin || !destination || !departureDate) {
      return res.status(400).json({
        error: "Origin, destination, and departure date are required"
      });
    }

    // Geocode locations
    const originCoords = await geocodeLocation(origin);
    const destinationCoords = await geocodeLocation(destination);

    const departureDateObj = new Date(departureDate);
    const returnDateObj = returnDate ? new Date(returnDate) : null;

    // Get weather for all locations/dates with better error handling
    let originWeather, destinationWeather, returnWeather;

    try {
      originWeather = await nasaService.getHistoricalWeather(
        originCoords.lat,
        originCoords.lon,
        departureDateObj.getMonth() + 1,
        departureDateObj.getDate()
      );
    } catch (error) {
      console.error(`Error fetching origin weather for ${origin}:`, error);
      originWeather = getFallbackWeatherData(departureDateObj.getMonth() + 1, departureDateObj.getDate());
    }

    try {
      destinationWeather = await nasaService.getHistoricalWeather(
        destinationCoords.lat,
        destinationCoords.lon,
        departureDateObj.getMonth() + 1,
        departureDateObj.getDate()
      );
    } catch (error) {
      console.error(`Error fetching destination weather for ${destination}:`, error);
      destinationWeather = getFallbackWeatherData(departureDateObj.getMonth() + 1, departureDateObj.getDate());
    }

    if (returnDateObj) {
      try {
        returnWeather = await nasaService.getHistoricalWeather(
          originCoords.lat,
          originCoords.lon,
          returnDateObj.getMonth() + 1,
          returnDateObj.getDate()
        );
      } catch (error) {
        console.error(`Error fetching return weather for ${origin}:`, error);
        returnWeather = getFallbackWeatherData(returnDateObj.getMonth() + 1, returnDateObj.getDate());
      }
    }

    // Ensure all weather data has the required structure
    const processedOriginWeather = ensureWeatherStructure(originWeather, originCoords.display_name || origin);
    const processedDestinationWeather = ensureWeatherStructure(destinationWeather, destinationCoords.display_name || destination);
    const processedReturnWeather = returnWeather ? ensureWeatherStructure(returnWeather, originCoords.display_name || origin) : null;

    // Trip-specific analysis
    const tripAnalysis = {
      overallRisk: calculateOverallTripRisk([processedOriginWeather, processedDestinationWeather, processedReturnWeather].filter(Boolean)),
      dailyBreakdown: generateTripDailyBreakdown({
        origin: processedOriginWeather,
        destination: processedDestinationWeather,
        return: processedReturnWeather
      }, departureDate, returnDate),
      recommendations: generateTripRecommendations(tripType, travelMode, [processedOriginWeather, processedDestinationWeather, processedReturnWeather].filter(Boolean)),
      packingList: generateSmartPackingList(tripType, travelMode, [processedOriginWeather, processedDestinationWeather, processedReturnWeather].filter(Boolean)),
      tripSummary: generateTripSummary({
        origin: { weather: processedOriginWeather, coordinates: originCoords },
        destination: { weather: processedDestinationWeather, coordinates: destinationCoords },
        return: processedReturnWeather ? { weather: processedReturnWeather, coordinates: originCoords } : null
      })
    };

    // 🌟 AI Enhancement for Trips
    let aiEnhancements = null;
    if (enableAI) {
      console.log("🤖 Attempting AI enhancement for trip...");
      aiEnhancements = await aiEnhancementService.enhanceTripRecommendations(
        {
          origin: processedOriginWeather,
          destination: processedDestinationWeather,
          return: processedReturnWeather,
          tripType,
          travelMode
        },
        departureDate,
        returnDate
      );

      if (!aiEnhancements) {
        console.log("🤖 Using AI fallback enhancements for trip");
        aiEnhancements = aiEnhancementService.getTripFallbackEnhancements(
          [processedOriginWeather, processedDestinationWeather, processedReturnWeather].filter(Boolean),
          tripType
        );
      }
    }

    // Remove duplicate recommendations - FIXED VERSION
    const allRecommendations = [
      ...tripAnalysis.recommendations,
      ...tripAnalysis.packingList,
      ...(aiEnhancements ? [
        ...(aiEnhancements.trip_specific_recommendations || []),
        ...(aiEnhancements.route_optimization_tips || []),
        ...(aiEnhancements.packing_enhancements || []),
        ...(aiEnhancements.contingency_plans || []),
        ...(aiEnhancements.local_insights || [])
      ] : [])
    ];

    // Use Set for proper duplicate removal
    const uniqueRecommendations = [...new Set(allRecommendations)];

    // Calculate weather summary with proper null checks
    const weatherSummary = {
      highestRainProbability: Math.max(
        processedOriginWeather.basicWeather?.rainProbability || 0,
        processedDestinationWeather.basicWeather?.rainProbability || 0,
        processedReturnWeather?.basicWeather?.rainProbability || 0
      ),
      temperatureRange: {
        min: Math.min(
          processedOriginWeather.basicWeather?.avgTemperature || Infinity,
          processedDestinationWeather.basicWeather?.avgTemperature || Infinity,
          processedReturnWeather?.basicWeather?.avgTemperature || Infinity
        ),
        max: Math.max(
          processedOriginWeather.basicWeather?.avgTemperature || -Infinity,
          processedDestinationWeather.basicWeather?.avgTemperature || -Infinity,
          processedReturnWeather?.basicWeather?.avgTemperature || -Infinity
        )
      }
    };

    const finalAnalysis = {
      // Trip basic info
      tripType: tripType,
      travelMode: travelMode,
      origin: {
        name: originCoords.display_name || origin,
        coordinates: { lat: originCoords.lat, lon: originCoords.lon },
        weather: processedOriginWeather
      },
      destination: {
        name: destinationCoords.display_name || destination,
        coordinates: { lat: destinationCoords.lat, lon: destinationCoords.lon },
        weather: processedDestinationWeather
      },
      return: processedReturnWeather ? {
        name: originCoords.display_name || origin,
        coordinates: { lat: originCoords.lat, lon: originCoords.lon },
        weather: processedReturnWeather
      } : null,

      // Departure and return dates
      departureDate: departureDate,
      returnDate: returnDate,

      // Trip analysis
      tripAnalysis: {
        ...tripAnalysis,
        aiEnhancements: aiEnhancements,
        weatherSummary: weatherSummary
      },

      // Combined recommendations (without duplicates)
      recommendations: uniqueRecommendations,

      // Metadata
      analysisMetadata: {
        version: "trip-v1.0",
        enhanced: true,
        aiEnhanced: !!aiEnhancements,
        timestamp: new Date().toISOString()
      }
    };

    console.log("🏆 Final trip analysis:", {
      locations: 2 + (returnDate ? 1 : 0),
      recommendationCount: finalAnalysis.recommendations.length,
      aiEnhanced: !!aiEnhancements,
      highestRain: weatherSummary.highestRainProbability,
      overallRisk: tripAnalysis.overallRisk
    });

    res.json(finalAnalysis);

  } catch (error) {
    console.error("💥 Trip controller error:", error);
    res.status(500).json({
      error: error.message,
      details: "Internal server error in trip analysis"
    });
  }
};

// Helper function to ensure weather data has proper structure
const ensureWeatherStructure = (weatherData, locationName) => {
  if (!weatherData) {
    return {
      location: locationName,
      basicWeather: {
        rainProbability: 0,
        avgTemperature: null,
        avgWindSpeed: null,
        avgHumidity: null
      },
      extremeConditions: {
        veryHot: 0,
        veryCold: 0,
        veryWindy: 0,
        veryWet: 0,
        veryUncomfortable: 0
      },
      isFallbackData: true
    };
  }

  return {
    ...weatherData,
    location: locationName,
    basicWeather: weatherData.basicWeather || {
      rainProbability: weatherData.rainProbability || 0,
      avgTemperature: weatherData.avgTemperature || null,
      avgWindSpeed: weatherData.avgWindSpeed || null,
      avgHumidity: weatherData.avgHumidity || null
    },
    extremeConditions: weatherData.extremeConditions || {
      veryHot: 0,
      veryCold: 0,
      veryWindy: 0,
      veryWet: 0,
      veryUncomfortable: 0
    }
  };
};

// Fallback weather data generator
const getFallbackWeatherData = (month, day) => {
  console.log('🔄 Using fallback weather data for trip analysis');
  
  // Simple seasonal fallback
  let baseTemp, rainProb;
  if (month >= 3 && month <= 5) {
    baseTemp = 18 + (Math.random() * 10);
    rainProb = 25 + (Math.random() * 20);
  } else if (month >= 6 && month <= 8) {
    baseTemp = 28 + (Math.random() * 8);
    rainProb = 35 + (Math.random() * 25);
  } else if (month >= 9 && month <= 11) {
    baseTemp = 20 + (Math.random() * 12);
    rainProb = 30 + (Math.random() * 20);
  } else {
    baseTemp = 12 + (Math.random() * 10);
    rainProb = 20 + (Math.random() * 15);
  }
  
  return {
    rainProbability: Math.min(100, Math.round(rainProb)),
    avgTemperature: Math.round(baseTemp * 10) / 10,
    avgWindSpeed: 2 + (Math.random() * 8),
    avgHumidity: 40 + (Math.random() * 40),
    extremeConditions: {
      veryHot: Math.round(Math.random() * 15),
      veryCold: Math.round(Math.random() * 10),
      veryWindy: Math.round(Math.random() * 20),
      veryWet: Math.round(Math.random() * 12),
      veryUncomfortable: Math.round(Math.random() * 18)
    },
    totalYearsAnalyzed: 15,
    isFallbackData: true
  };
};

// Enhanced Trip-specific analysis functions
const calculateOverallTripRisk = (weatherDataArray) => {
  if (!weatherDataArray.length) return 0;

  const risks = weatherDataArray.map(data => {
    if (!data) return 0;
    
    const extremes = data.extremeConditions || {};
    const basic = data.basicWeather || {};
    
    // Enhanced risk calculation with better weighting for high rain
    const rainWeight = basic.rainProbability > 60 ? 0.5 : 0.35;
    const riskScore = (
      (basic.rainProbability || 0) * rainWeight +      // Rain has highest impact, more for heavy rain
      (extremes.veryHot || 0) * 0.25 +                // Extreme heat
      (extremes.veryWindy || 0) * 0.20 +              // Wind
      (extremes.veryWet || 0) * 0.15 +                // Heavy precipitation
      (extremes.veryUncomfortable || 0) * 0.05        // Discomfort
    );
    
    return Math.min(100, riskScore); // Cap at 100%
  });

  return Math.round(Math.max(...risks));
};

const generateTripDailyBreakdown = (locations, departureDate, returnDate) => {
  const breakdown = [];

  // Departure day
  breakdown.push({
    date: departureDate,
    location: locations.origin.location,
    type: "DEPARTURE",
    weather: {
      rainProbability: locations.origin.basicWeather?.rainProbability || 0,
      temperature: {
        value: locations.origin.basicWeather?.avgTemperature || null,
        unit: "°C"
      },
      temperatureRange: {
        max: locations.origin.avgMaxTemperature || null,
        min: locations.origin.avgMinTemperature || null,
        unit: "°C"
      },
      conditions: locations.origin.extremeConditions || {}
    }
  });

  // Destination day
  breakdown.push({
    date: departureDate,
    location: locations.destination.location,
    type: "DESTINATION",
    weather: {
      rainProbability: locations.destination.basicWeather?.rainProbability || 0,
      temperature: {
        value: locations.destination.basicWeather?.avgTemperature || null,
        unit: "°C"
      },
      temperatureRange: {
        max: locations.destination.avgMaxTemperature || null,
        min: locations.destination.avgMinTemperature || null,
        unit: "°C"
      },
      conditions: locations.destination.extremeConditions || {}
    }
  });

  // Return day if available
  if (locations.return) {
    breakdown.push({
      date: returnDate,
      location: locations.return.location,
      type: "RETURN",
      weather: {
        rainProbability: locations.return.basicWeather?.rainProbability || 0,
        temperature: {
          value: locations.return.basicWeather?.avgTemperature || null,
          unit: "°C"
        },
        temperatureRange: {
          max: locations.return.avgMaxTemperature || null,
          min: locations.return.avgMinTemperature || null,
          unit: "°C"
        },
        conditions: locations.return.extremeConditions || {}
      }
    });
  }

  return breakdown;
};

const generateTripRecommendations = (tripType, travelMode, weatherDataArray) => {
  const recommendations = [];
  
  const validWeatherData = weatherDataArray.filter(data => data && data.basicWeather && data.extremeConditions);
  
  if (validWeatherData.length === 0) {
    return getBasicTripRecommendations(tripType, travelMode);
  }

  const maxRain = Math.max(...validWeatherData.map(data => data.basicWeather.rainProbability || 0));
  const maxHeat = Math.max(...validWeatherData.map(data => data.extremeConditions.veryHot || 0));
  const maxWind = Math.max(...validWeatherData.map(data => data.extremeConditions.veryWindy || 0));
  const avgTemp = validWeatherData.reduce((sum, data) => sum + (data.basicWeather.avgTemperature || 0), 0) / validWeatherData.length;

  // Enhanced recommendation logic with better thresholds
  if (maxRain > 70) {
    recommendations.push("HIGH_RAIN_RISK_CONSIDER_RESCHEDULING");
    recommendations.push("WATERPROOF_EQUIPMENT_ESSENTIAL");
    recommendations.push("EXPECT_MAJOR_TRAVEL_DISRUPTIONS");
  } else if (maxRain > 50) {
    recommendations.push("PACK_WATERPROOF_GEAR_ESSENTIAL");
    recommendations.push("ALLOW_EXTRA_TRAVEL_TIME_FOR_RAIN");
    recommendations.push("PLAN_INDOOR_ACTIVITY_BACKUPS");
  } else if (maxRain > 30) {
    recommendations.push("PACK_RAIN_GEAR");
    recommendations.push("CHECK_WEATHER_UPDATES_REGULARLY");
  }

  if (maxHeat > 35) {
    recommendations.push("EXTREME_HEAT_AVOID_OUTDOOR_ACTIVITIES");
    recommendations.push("HYDRATION_CRITICAL_FOR_TRAVEL");
    recommendations.push("PLAN_ACTIVITIES_DURING_COOLER_HOURS");
  } else if (maxHeat > 25) {
    recommendations.push("PACK_COOLING_ACCESSORIES");
    recommendations.push("PLAN_FOR_SUN_PROTECTION");
    recommendations.push("STAY_HYDRATED_DURING_TRAVEL");
  }

  if (maxWind > 30) {
    recommendations.push("HIGH_WIND_EXPECT_DELAYS");
    recommendations.push("SECURE_ALL_LUGGAGE_AND_EQUIPMENT");
  } else if (maxWind > 20) {
    recommendations.push("SECURE_LOOSE_ITEMS_DURING_TRAVEL");
  }

  // Temperature-based recommendations
  if (avgTemp < 10) {
    recommendations.push("PACK_WARM_CLOTHING_ESSENTIAL");
    recommendations.push("PROTECT_ELECTRONICS_FROM_COLD");
  } else if (avgTemp > 28) {
    recommendations.push("PACK_LIGHT_BREATHABLE_CLOTHING");
    recommendations.push("PLAN_FOR_AIR_CONDITIONED_SPACES");
  }

  // Mode-specific recommendations
  if (travelMode === "road") {
    if (maxRain > 40) {
      recommendations.push("CHECK_VEHICLE_WIPERS_AND_TIRES");
      recommendations.push("DRIVE_CAUTIOUSLY_IN_WET_CONDITIONS");
      recommendations.push("AVOID_FLOOD_PRONE_ROUTES");
    }
    if (maxWind > 20) {
      recommendations.push("BE_CAUTIOUS_ON_BRIDGES_AND_OPEN_ROADS");
    }
    recommendations.push("MAINTAIN_SAFE_FOLLOWING_DISTANCE");
  } else if (travelMode === "flight") {
    if (maxWind > 25) {
      recommendations.push("EXPECT_POSSIBLE_FLIGHT_DELAYS");
    }
    recommendations.push("ARRIVE_EARLY_FOR_SECURITY_CHECKS");
  }

  // Trip-type specific recommendations
  if (tripType === "vacation") {
    recommendations.push("PACK_FOR_VARIABLE_CONDITIONS");
    recommendations.push("RESEARCH_WEATHER_APPROPRIATE_ACTIVITIES");
    if (maxRain > 40) {
      recommendations.push("BOOK_FLEXIBLE_ACCOMMODATION");
    }
  } else if (tripType === "business") {
    recommendations.push("PACK_EXTRA_BUSINESS_ATTIRE");
    recommendations.push("PROTECT_BUSINESS_EQUIPMENT");
    recommendations.push("ALLOW_BUFFER_TIME_FOR_MEETINGS");
  } else if (tripType === "hiking" || tripType === "outdoor") {
    if (maxRain > 40) {
      recommendations.push("RECONSIDER_HIKING_ROUTES_FOR_SAFETY");
      recommendations.push("CHECK_TRAIL_CONDITIONS_BEFORE_GOING");
    }
    recommendations.push("PACK_EMERGENCY_WEATHER_GEAR");
    recommendations.push("SHARE_ITINERARY_WITH_CONTACTS");
  }

  return recommendations;
};

const generateSmartPackingList = (tripType, travelMode, weatherDataArray) => {
  const packingList = [];
  
  const validWeatherData = weatherDataArray.filter(data => data && data.basicWeather && data.extremeConditions);
  
  if (validWeatherData.length === 0) {
    return getBasicPackingList(tripType, travelMode);
  }

  const maxRain = Math.max(...validWeatherData.map(data => data.basicWeather.rainProbability || 0));
  const maxHeat = Math.max(...validWeatherData.map(data => data.extremeConditions.veryHot || 0));
  const maxCold = Math.max(...validWeatherData.map(data => data.extremeConditions.veryCold || 0));
  const avgTemp = validWeatherData.reduce((sum, data) => sum + (data.basicWeather.avgTemperature || 0), 0) / validWeatherData.length;

  // Essential items based on weather
  if (maxRain > 40) {
    packingList.push("WATERPROOF_JACKET");
    packingList.push("UMBRELLA");
    packingList.push("WATERPROOF_BAG_COVERS");
    packingList.push("QUICK_DRY_CLOTHING");
  } else if (maxRain > 20) {
    packingList.push("LIGHT_RAIN_JACKET");
    packingList.push("COMPACT_UMBRELLA");
  }

  if (maxHeat > 30) {
    packingList.push("LIGHTWEIGHT_CLOTHING");
    packingList.push("SUN_HAT_AND_SUNGLASSES");
    packingList.push("SUNSCREEN_SPF50");
    packingList.push("REUSABLE_WATER_BOTTLE");
    packingList.push("COOLING_NECK_WRAP");
  } else if (maxHeat > 20) {
    packingList.push("BREATHABLE_FABRICS");
    packingList.push("SUNSCREEN_SPF30");
  }

  if (maxCold > 15 || avgTemp < 15) {
    packingList.push("WARM_LAYERS");
    packingList.push("INSULATED_JACKET");
    packingList.push("GLOVES_AND_HAT");
    packingList.push("THERMAL_UNDERWEAR");
  }

  // Mode-specific items
  if (travelMode === "road") {
    packingList.push("ROADSIDE_EMERGENCY_KIT");
    packingList.push("PHONE_CHARGER");
    if (maxRain > 40) {
      packingList.push("EXTRA_WIPER_FLUID");
    }
  }

  // Trip-type specific items
  if (tripType === "hiking" || tripType === "outdoor") {
    packingList.push("HIKING_BOOTS");
    packingList.push("FIRST_AID_KIT");
    packingList.push("NAVIGATION_TOOLS");
    packingList.push("EMERGENCY_WHISTLE");
    if (maxRain > 30) {
      packingList.push("QUICK_DRY_CLOTHING");
      packingList.push("WATERPROOF_HIKING_BOOTS");
    }
  } else if (tripType === "business") {
    packingList.push("FORMAL_ATTIRE");
    packingList.push("BUSINESS_CARDS");
    packingList.push("PORTABLE_CHARGER");
  } else if (tripType === "vacation") {
    packingList.push("CAMERA");
    packingList.push("COMFORTABLE_WALKING_SHOES");
    packingList.push("TRAVEL_GUIDE");
  }

  return packingList;
};

const generateTripSummary = (locations) => {
  const risks = [];
  const insights = [];
  
  // Enhanced risk detection with better thresholds - FIXED property access
  const originRain = locations.origin?.weather?.basicWeather?.rainProbability || 0;
  const destRain = locations.destination?.weather?.basicWeather?.rainProbability || 0;
  const originHeat = locations.origin?.weather?.extremeConditions?.veryHot || 0;
  const destHeat = locations.destination?.weather?.extremeConditions?.veryHot || 0;

  if (originRain > 40) {
    risks.push(`High departure rain risk: ${originRain}%`);
  }
  
  if (destRain > 40) {
    risks.push(`High destination rain risk: ${destRain}%`);
  }
  
  if (originHeat > 20) {
    risks.push(`Heat risk at origin: ${originHeat}%`);
  }
  
  if (destHeat > 20) {
    risks.push(`Heat risk at destination: ${destHeat}%`);
  }

  // Add temperature insights - FIXED property access
  const originTemp = locations.origin?.weather?.basicWeather?.avgTemperature;
  const destTemp = locations.destination?.weather?.basicWeather?.avgTemperature;
  
  if (originTemp && destTemp && Math.abs(originTemp - destTemp) > 5) {
    insights.push(`Temperature difference: ${Math.round(originTemp)}°C → ${Math.round(destTemp)}°C`);
  }

  // Enhanced overall risk level calculation
  let overallRiskLevel = "LOW";
  const maxRain = Math.max(originRain, destRain);
  const maxHeat = Math.max(originHeat, destHeat);
  
  if (maxRain > 70 || maxHeat > 40 || risks.length >= 3) {
    overallRiskLevel = "HIGH";
  } else if (maxRain > 50 || maxHeat > 25 || risks.length >= 2) {
    overallRiskLevel = "MODERATE";
  } else if (maxRain > 30 || risks.length >= 1) {
    overallRiskLevel = "LOW";
  }

  return {
    primaryRisks: risks,
    travelInsights: insights,
    overallRiskLevel: overallRiskLevel,
    confidence: "Based on 30-year historical weather analysis",
    temperatureSummary: {
      origin: originTemp ? `${Math.round(originTemp)}°C` : "N/A",
      destination: destTemp ? `${Math.round(destTemp)}°C` : "N/A",
      difference: originTemp && destTemp ? `${Math.round(Math.abs(originTemp - destTemp))}°C` : "N/A"
    }
  };
};

// Helper functions for fallback recommendations
const getBasicTripRecommendations = (tripType, travelMode) => {
  const recommendations = [];
  
  if (travelMode === "road") {
    recommendations.push("CHECK_VEHICLE_CONDITION_BEFORE_DEPARTURE");
    recommendations.push("PLAN_REST_STOPS_EVERY_2_HOURS");
  } else if (travelMode === "flight") {
    recommendations.push("ARRIVE_AT_AIRPORT_EARLY");
    recommendations.push("CHECK_FLIGHT_STATUS_BEFORE_DEPARTURE");
  }
  
  if (tripType === "vacation") {
    recommendations.push("PACK_FOR_VARIABLE_CONDITIONS");
    recommendations.push("RESEARCH_LOCAL_ATTRACTIONS_IN_ADVANCE");
  } else if (tripType === "business") {
    recommendations.push("PACK_EXTRA_BUSINESS_ATTIRE");
    recommendations.push("KEEP_IMPORTANT_DOCUMENTS_SECURE");
  }
  
  return recommendations;
};

const getBasicPackingList = (tripType, travelMode) => {
  const packingList = ["ESSENTIAL_TOILETRIES", "FIRST_AID_KIT", "EMERGENCY_CONTACTS_LIST"];
  
  if (travelMode === "road") {
    packingList.push("ROADSIDE_EMERGENCY_KIT");
    packingList.push("PHONE_CHARGER");
  }
  
  if (tripType === "vacation") {
    packingList.push("CAMERA");
    packingList.push("COMFORTABLE_WALKING_SHOES");
  } else if (tripType === "business") {
    packingList.push("BUSINESS_CARDS");
    packingList.push("FORMAL_ATTIRE");
  }
  
  return packingList;
};

export { analyzeTrip };



// // backend/controllers/tripController.js
// import nasaService from "../services/nasaService.js";
// import aiEnhancementService from "../services/aiEnhancementService.js";
// import { geocodeLocation } from "./weatherController.js";

// const analyzeTrip = async (req, res) => {
//   try {
//     const {
//       origin,
//       destination,
//       departureDate,
//       returnDate,
//       tripType = "generic",
//       travelMode = "road",
//       enableAI = false
//     } = req.body;

//     console.log("🎯 Received trip request:", {
//       origin,
//       destination,
//       departureDate,
//       returnDate,
//       tripType,
//       travelMode,
//       enableAI
//     });

//     if (!origin || !destination || !departureDate) {
//       return res.status(400).json({
//         error: "Origin, destination, and departure date are required"
//       });
//     }

//     // Geocode locations
//     const originCoords = await geocodeLocation(origin);
//     const destinationCoords = await geocodeLocation(destination);

//     const departureDateObj = new Date(departureDate);
//     const returnDateObj = returnDate ? new Date(returnDate) : null;

//     // Get weather for all locations/dates with better error handling
//     let originWeather, destinationWeather, returnWeather;

//     try {
//       originWeather = await nasaService.getHistoricalWeather(
//         originCoords.lat,
//         originCoords.lon,
//         departureDateObj.getMonth() + 1,
//         departureDateObj.getDate()
//       );
//     } catch (error) {
//       console.error(`Error fetching origin weather for ${origin}:`, error);
//       originWeather = getFallbackWeatherData(departureDateObj.getMonth() + 1, departureDateObj.getDate());
//     }

//     try {
//       destinationWeather = await nasaService.getHistoricalWeather(
//         destinationCoords.lat,
//         destinationCoords.lon,
//         departureDateObj.getMonth() + 1,
//         departureDateObj.getDate()
//       );
//     } catch (error) {
//       console.error(`Error fetching destination weather for ${destination}:`, error);
//       destinationWeather = getFallbackWeatherData(departureDateObj.getMonth() + 1, departureDateObj.getDate());
//     }

//     if (returnDateObj) {
//       try {
//         returnWeather = await nasaService.getHistoricalWeather(
//           originCoords.lat,
//           originCoords.lon,
//           returnDateObj.getMonth() + 1,
//           returnDateObj.getDate()
//         );
//       } catch (error) {
//         console.error(`Error fetching return weather for ${origin}:`, error);
//         returnWeather = getFallbackWeatherData(returnDateObj.getMonth() + 1, returnDateObj.getDate());
//       }
//     }

//     // Ensure all weather data has the required structure
//     const processedOriginWeather = ensureWeatherStructure(originWeather, originCoords.display_name || origin);
//     const processedDestinationWeather = ensureWeatherStructure(destinationWeather, destinationCoords.display_name || destination);
//     const processedReturnWeather = returnWeather ? ensureWeatherStructure(returnWeather, originCoords.display_name || origin) : null;

//     // Trip-specific analysis
//     const tripAnalysis = {
//       overallRisk: calculateOverallTripRisk([processedOriginWeather, processedDestinationWeather, processedReturnWeather].filter(Boolean)),
//       dailyBreakdown: generateTripDailyBreakdown({
//         origin: processedOriginWeather,
//         destination: processedDestinationWeather,
//         return: processedReturnWeather
//       }, departureDate, returnDate),
//       recommendations: generateTripRecommendations(tripType, travelMode, [processedOriginWeather, processedDestinationWeather, processedReturnWeather].filter(Boolean)),
//       packingList: generateSmartPackingList(tripType, travelMode, [processedOriginWeather, processedDestinationWeather, processedReturnWeather].filter(Boolean)),
//       tripSummary: generateTripSummary({
//         origin: { ...processedOriginWeather, coordinates: originCoords },
//         destination: { ...processedDestinationWeather, coordinates: destinationCoords },
//         return: processedReturnWeather ? { ...processedReturnWeather, coordinates: originCoords } : null
//       })
//     };

//     // 🌟 AI Enhancement for Trips
//     let aiEnhancements = null;
//     if (enableAI) {
//       console.log("🤖 Attempting AI enhancement for trip...");
//       aiEnhancements = await aiEnhancementService.enhanceTripRecommendations(
//         {
//           origin: processedOriginWeather,
//           destination: processedDestinationWeather,
//           return: processedReturnWeather,
//           tripType,
//           travelMode
//         },
//         departureDate,
//         returnDate
//       );

//       if (!aiEnhancements) {
//         console.log("🤖 Using AI fallback enhancements for trip");
//         aiEnhancements = aiEnhancementService.getTripFallbackEnhancements(
//           [processedOriginWeather, processedDestinationWeather, processedReturnWeather].filter(Boolean),
//           tripType
//         );
//       }
//     }

//     const finalAnalysis = {
//       // Trip basic info
//       tripType: tripType,
//       travelMode: travelMode,
//       origin: {
//         name: originCoords.display_name || origin,
//         coordinates: { lat: originCoords.lat, lon: originCoords.lon },
//         weather: processedOriginWeather
//       },
//       destination: {
//         name: destinationCoords.display_name || destination,
//         coordinates: { lat: destinationCoords.lat, lon: destinationCoords.lon },
//         weather: processedDestinationWeather
//       },
//       return: processedReturnWeather ? {
//         name: originCoords.display_name || origin,
//         coordinates: { lat: originCoords.lat, lon: originCoords.lon },
//         weather: processedReturnWeather
//       } : null,

//       // Departure and return dates
//       departureDate: departureDate,
//       returnDate: returnDate,

//       // Trip analysis
//       tripAnalysis: {
//         ...tripAnalysis,
//         aiEnhancements: aiEnhancements
//       },

//       // Combined recommendations
//       recommendations: [
//         ...tripAnalysis.recommendations,
//         ...tripAnalysis.packingList,
//         ...(aiEnhancements ? aiEnhancements.trip_specific_recommendations || [] : [])
//       ],

//       // Metadata
//       analysisMetadata: {
//         version: "trip-v1.0",
//         enhanced: true,
//         aiEnhanced: !!aiEnhancements,
//         timestamp: new Date().toISOString()
//       }
//     };

//     console.log("🏆 Final trip analysis:", {
//       locations: 2 + (returnDate ? 1 : 0),
//       recommendationCount: finalAnalysis.recommendations.length,
//       aiEnhanced: !!aiEnhancements
//     });

//     res.json(finalAnalysis);

//   } catch (error) {
//     console.error("💥 Trip controller error:", error);
//     res.status(500).json({
//       error: error.message,
//       details: "Internal server error in trip analysis"
//     });
//   }
// };

// // Helper function to ensure weather data has proper structure
// const ensureWeatherStructure = (weatherData, locationName) => {
//   if (!weatherData) {
//     return {
//       location: locationName,
//       basicWeather: {
//         rainProbability: 0,
//         avgTemperature: null,
//         avgWindSpeed: null,
//         avgHumidity: null
//       },
//       extremeConditions: {
//         veryHot: 0,
//         veryCold: 0,
//         veryWindy: 0,
//         veryWet: 0,
//         veryUncomfortable: 0
//       },
//       isFallbackData: true
//     };
//   }

//   return {
//     ...weatherData,
//     location: locationName,
//     basicWeather: weatherData.basicWeather || {
//       rainProbability: weatherData.rainProbability || 0,
//       avgTemperature: weatherData.avgTemperature || null,
//       avgWindSpeed: weatherData.avgWindSpeed || null,
//       avgHumidity: weatherData.avgHumidity || null
//     },
//     extremeConditions: weatherData.extremeConditions || {
//       veryHot: 0,
//       veryCold: 0,
//       veryWindy: 0,
//       veryWet: 0,
//       veryUncomfortable: 0
//     }
//   };
// };

// // Fallback weather data generator
// const getFallbackWeatherData = (month, day) => {
//   console.log('🔄 Using fallback weather data for trip analysis');
  
//   // Simple seasonal fallback
//   let baseTemp, rainProb;
//   if (month >= 3 && month <= 5) {
//     baseTemp = 18 + (Math.random() * 10);
//     rainProb = 25 + (Math.random() * 20);
//   } else if (month >= 6 && month <= 8) {
//     baseTemp = 28 + (Math.random() * 8);
//     rainProb = 35 + (Math.random() * 25);
//   } else if (month >= 9 && month <= 11) {
//     baseTemp = 20 + (Math.random() * 12);
//     rainProb = 30 + (Math.random() * 20);
//   } else {
//     baseTemp = 12 + (Math.random() * 10);
//     rainProb = 20 + (Math.random() * 15);
//   }
  
//   return {
//     rainProbability: Math.min(100, Math.round(rainProb)),
//     avgTemperature: Math.round(baseTemp * 10) / 10,
//     avgWindSpeed: 2 + (Math.random() * 8),
//     avgHumidity: 40 + (Math.random() * 40),
//     extremeConditions: {
//       veryHot: Math.round(Math.random() * 15),
//       veryCold: Math.round(Math.random() * 10),
//       veryWindy: Math.round(Math.random() * 20),
//       veryWet: Math.round(Math.random() * 12),
//       veryUncomfortable: Math.round(Math.random() * 18)
//     },
//     totalYearsAnalyzed: 15,
//     isFallbackData: true
//   };
// };

// // Trip-specific analysis functions
// const calculateOverallTripRisk = (weatherDataArray) => {
//   if (!weatherDataArray.length) return 0;

//   const risks = weatherDataArray.map(data => {
//     // Add null checks for data and its properties
//     if (!data) return 0;
    
//     const extremes = data.extremeConditions || {};
//     const basic = data.basicWeather || {};
    
//     return (
//       (basic.rainProbability || 0) * 0.4 +
//       (extremes.veryHot || 0) * 0.3 +
//       (extremes.veryWindy || 0) * 0.2 +
//       (extremes.veryWet || 0) * 0.1
//     );
//   });

//   return Math.round(Math.max(...risks));
// };

// const generateTripDailyBreakdown = (locations, departureDate, returnDate) => {
//   const breakdown = [];

//   // Departure day
//   breakdown.push({
//     date: departureDate,
//     location: locations.origin.location,
//     type: "DEPARTURE",
//     weather: {
//       rainProbability: locations.origin.basicWeather?.rainProbability || 0,
//       temperature: locations.origin.basicWeather?.avgTemperature || null,
//       conditions: locations.origin.extremeConditions || {}
//     }
//   });

//   // Destination days (estimate 1 day at destination for simple trips)
//   breakdown.push({
//     date: departureDate, // Same day arrival for simplicity
//     location: locations.destination.location,
//     type: "DESTINATION",
//     weather: {
//       rainProbability: locations.destination.basicWeather?.rainProbability || 0,
//       temperature: locations.destination.basicWeather?.avgTemperature || null,
//       conditions: locations.destination.extremeConditions || {}
//     }
//   });

//   // Return day if available
//   if (locations.return) {
//     breakdown.push({
//       date: returnDate,
//       location: locations.return.location,
//       type: "RETURN",
//       weather: {
//         rainProbability: locations.return.basicWeather?.rainProbability || 0,
//         temperature: locations.return.basicWeather?.avgTemperature || null,
//         conditions: locations.return.extremeConditions || {}
//       }
//     });
//   }

//   return breakdown;
// };

// const generateTripRecommendations = (tripType, travelMode, weatherDataArray) => {
//   const recommendations = [];
  
//   // Add null checks for the weather data
//   const validWeatherData = weatherDataArray.filter(data => data && data.basicWeather && data.extremeConditions);
  
//   if (validWeatherData.length === 0) {
//     // Return basic recommendations if no weather data
//     return getBasicTripRecommendations(tripType, travelMode);
//   }

//   const maxRain = Math.max(...validWeatherData.map(data => data.basicWeather.rainProbability || 0));
//   const maxHeat = Math.max(...validWeatherData.map(data => data.extremeConditions.veryHot || 0));
//   const maxWind = Math.max(...validWeatherData.map(data => data.extremeConditions.veryWindy || 0));

//   // General travel recommendations
//   if (maxRain > 50) {
//     recommendations.push("PACK_WATERPROOF_GEAR_ESSENTIAL");
//     recommendations.push("ALLOW_EXTRA_TRAVEL_TIME_FOR_RAIN");
//   } else if (maxRain > 25) {
//     recommendations.push("PACK_RAIN_GEAR");
//   }

//   if (maxHeat > 30) {
//     recommendations.push("PACK_COOLING_ACCESSORIES");
//     recommendations.push("HYDRATION_ESSENTIAL_FOR_TRAVEL");
//   }

//   if (maxWind > 25) {
//     recommendations.push("SECURE_LUGGAGE_AND_EQUIPMENT");
//   }

//   // Mode-specific recommendations
//   if (travelMode === "road") {
//     if (maxRain > 30) {
//       recommendations.push("CHECK_VEHICLE_WIPERS_AND_TIRES");
//       recommendations.push("DRIVE_CAUTIOUSLY_IN_WET_CONDITIONS");
//     }
//     if (maxWind > 20) {
//       recommendations.push("BE_CAUTIOUS_ON_BRIDGES_AND_OPEN_ROADS");
//     }
//   } else if (travelMode === "flight") {
//     if (maxWind > 25) {
//       recommendations.push("EXPECT_POSSIBLE_FLIGHT_DELAYS");
//     }
//   }

//   // Trip-type specific recommendations
//   if (tripType === "vacation") {
//     recommendations.push("PACK_FOR_VARIABLE_CONDITIONS");
//     if (maxRain > 40) {
//       recommendations.push("PLAN_INDOOR_ACTIVITY_BACKUPS");
//     }
//   } else if (tripType === "business") {
//     recommendations.push("PACK_EXTRA_BUSINESS_ATTIRE");
//     if (maxRain > 30) {
//       recommendations.push("PROTECT_BUSINESS_EQUIPMENT_FROM_RAIN");
//     }
//   } else if (tripType === "hiking" || tripType === "outdoor") {
//     if (maxRain > 40) {
//       recommendations.push("RECONSIDER_HIKING_ROUTES_FOR_SAFETY");
//     }
//     recommendations.push("PACK_EMERGENCY_WEATHER_GEAR");
//   }

//   return recommendations;
// };

// const generateSmartPackingList = (tripType, travelMode, weatherDataArray) => {
//   const packingList = [];
  
//   // Add null checks
//   const validWeatherData = weatherDataArray.filter(data => data && data.basicWeather && data.extremeConditions);
  
//   if (validWeatherData.length === 0) {
//     return getBasicPackingList(tripType, travelMode);
//   }

//   const maxRain = Math.max(...validWeatherData.map(data => data.basicWeather.rainProbability || 0));
//   const maxHeat = Math.max(...validWeatherData.map(data => data.extremeConditions.veryHot || 0));
//   const maxCold = Math.max(...validWeatherData.map(data => data.extremeConditions.veryCold || 0));

//   // Essential items based on weather
//   if (maxRain > 30) {
//     packingList.push("WATERPROOF_JACKET");
//     packingList.push("UMBRELLA");
//     packingList.push("WATERPROOF_BAG_COVERS");
//   }

//   if (maxHeat > 25) {
//     packingList.push("LIGHTWEIGHT_CLOTHING");
//     packingList.push("SUN_HAT_AND_SUNGLASSES");
//     packingList.push("SUNSCREEN");
//     packingList.push("REUSABLE_WATER_BOTTLE");
//   }

//   if (maxCold > 10) {
//     packingList.push("WARM_LAYERS");
//     packingList.push("INSULATED_JACKET");
//     packingList.push("GLOVES_AND_HAT");
//   }

//   // Mode-specific items
//   if (travelMode === "road") {
//     packingList.push("ROADSIDE_EMERGENCY_KIT");
//     if (maxRain > 40) {
//       packingList.push("EXTRA_WIPER_FLUID");
//     }
//   }

//   // Trip-type specific items
//   if (tripType === "hiking" || tripType === "outdoor") {
//     packingList.push("HIKING_BOOTS");
//     packingList.push("FIRST_AID_KIT");
//     packingList.push("NAVIGATION_TOOLS");
//     if (maxRain > 30) {
//       packingList.push("QUICK_DRY_CLOTHING");
//     }
//   }

//   return packingList;
// };

// const generateTripSummary = (locations) => {
//   const risks = [];
  
//   // Add null checks for all weather data accesses
//   if (locations.origin?.weather?.basicWeather?.rainProbability > 40) {
//     risks.push(`High departure rain risk: ${locations.origin.weather.basicWeather.rainProbability}%`);
//   }
  
//   if (locations.destination?.weather?.basicWeather?.rainProbability > 40) {
//     risks.push(`High destination rain risk: ${locations.destination.weather.basicWeather.rainProbability}%`);
//   }
  
//   if (locations.origin?.weather?.extremeConditions?.veryHot > 25) {
//     risks.push(`Heat risk at origin: ${locations.origin.weather.extremeConditions.veryHot}%`);
//   }
  
//   if (locations.destination?.weather?.extremeConditions?.veryHot > 25) {
//     risks.push(`Heat risk at destination: ${locations.destination.weather.extremeConditions.veryHot}%`);
//   }

//   return {
//     primaryRisks: risks,
//     overallRiskLevel: risks.length > 2 ? "HIGH" : risks.length > 1 ? "MODERATE" : "LOW",
//     confidence: "Based on historical weather patterns at all locations"
//   };
// };

// // Helper functions for fallback recommendations
// const getBasicTripRecommendations = (tripType, travelMode) => {
//   const recommendations = [];
  
//   if (travelMode === "road") {
//     recommendations.push("CHECK_VEHICLE_CONDITION_BEFORE_DEPARTURE");
//     recommendations.push("PLAN_REST_STOPS_EVERY_2_HOURS");
//   } else if (travelMode === "flight") {
//     recommendations.push("ARRIVE_AT_AIRPORT_EARLY");
//     recommendations.push("CHECK_FLIGHT_STATUS_BEFORE_DEPARTURE");
//   }
  
//   if (tripType === "vacation") {
//     recommendations.push("PACK_FOR_VARIABLE_CONDITIONS");
//     recommendations.push("RESEARCH_LOCAL_ATTRACTIONS_IN_ADVANCE");
//   } else if (tripType === "business") {
//     recommendations.push("PACK_EXTRA_BUSINESS_ATTIRE");
//     recommendations.push("KEEP_IMPORTANT_DOCUMENTS_SECURE");
//   }
  
//   return recommendations;
// };

// const getBasicPackingList = (tripType, travelMode) => {
//   const packingList = ["ESSENTIAL_TOILETRIES", "FIRST_AID_KIT", "EMERGENCY_CONTACTS_LIST"];
  
//   if (travelMode === "road") {
//     packingList.push("ROADSIDE_EMERGENCY_KIT");
//     packingList.push("PHONE_CHARGER");
//   }
  
//   if (tripType === "vacation") {
//     packingList.push("CAMERA");
//     packingList.push("COMFORTABLE_WALKING_SHOES");
//   } else if (tripType === "business") {
//     packingList.push("BUSINESS_CARDS");
//     packingList.push("FORMAL_ATTIRE");
//   }
  
//   return packingList;
// };

// export { analyzeTrip };




