// backend/services/nasaService.js
import axios from "axios";

class NasaService {
  // NASA Parameters Configuration
  NASA_PARAMETERS = {
    T2M: "Temperature at 2m",
    PRECTOTCORR: "Precipitation",
    T2M_MAX: "Maximum Temperature",
    T2M_MIN: "Minimum Temperature",
    WS2M: "Wind Speed at 2m",
    ALLSKY_SFC_SW_DWN: "Solar Radiation",
    RH2M: "Relative Humidity",
    PS: "Surface Pressure",
    CLOUD_AMT: "Cloud Cover",
  };

  async getHistoricalWeather(lat, lon, month, day) {
    // Calculate date range for 30 years
    const endYear = new Date().getFullYear() - 1;
    const startYear = endYear - 30;

    const startDate = `${startYear}0101`;
    const endDate = `${endYear}1231`;

    console.log("🔍 NASA API Parameters:", {
      lat,
      lon,
      month,
      day,
      startDate,
      endYear,
    });

    // Use all parameters for comprehensive analysis
    const parameters = Object.keys(this.NASA_PARAMETERS).join(",");

    const baseUrl = "https://power.larc.nasa.gov/api/temporal/daily/point";
    const params = {
      parameters: parameters,
      community: "SB",
      longitude: lon,
      latitude: lat,
      start: startDate,
      end: endDate,
      format: "JSON",
    };

    try {
      console.log("📡 Making NASA DAILY API call with enhanced parameters...");
      console.log("📊 Parameters included:", parameters);

      const response = await axios.get(baseUrl, { params });
      console.log("✅ NASA API Response Status:", response.status);

      // Check if we have valid data
      if (!response.data.properties || !response.data.properties.parameter) {
        console.error("❌ NASA API returned empty data");
        return this.getFallbackWeatherData(month, day);
      }

      return this.processEnhancedWeatherData(response.data, month, day);
    } catch (error) {
      console.error("❌ NASA API Error:", error.message);
      if (error.response) {
        console.error("❌ Response Status:", error.response.status);
      }
      return this.getFallbackWeatherData(month, day);
    }
  }

  async processDateRangeWeatherData(lat, lon, startDate, endDate) {
    console.log("📅 Processing date range analysis:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    // Make ONE API call for historical data
    const endYear = new Date().getFullYear() - 1;
    const startYear = endYear - 30;

    const startDateStr = `${startYear}0101`;
    const endDateStr = `${endYear}1231`;

    const parameters = Object.keys(this.NASA_PARAMETERS).join(",");
    const baseUrl = "https://power.larc.nasa.gov/api/temporal/daily/point";
    const params = {
      parameters: parameters,
      community: "SB",
      longitude: lon,
      latitude: lat,
      start: startDateStr,
      end: endDateStr,
      format: "JSON",
    };

    try {
      console.log("📡 Making NASA API call for date range analysis...");
      const response = await axios.get(baseUrl, { params });
      console.log("✅ NASA API Response Status:", response.status);

      if (!response.data.properties || !response.data.properties.parameter) {
        console.error("❌ NASA API returned empty data");
        return this.getDefaultRangeResult(startDate, endDate);
      }

      console.log("📊 NASA data received, processing date range...");

      // Process each day in the requested range using the SAME API response
      const analyses = [];
      const currentDate = new Date(startDate);
      const end = new Date(endDate);

      while (currentDate <= end) {
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();

        console.log(
          `📅 Processing: ${currentDate.toISOString().split("T")[0]} (Month: ${month}, Day: ${day})`
        );

        // Process this specific date from the API response
        const dailyAnalysis = this.processEnhancedWeatherData(
          response.data,
          month,
          day
        );
        analyses.push({
          date: currentDate.toISOString().split("T")[0],
          ...dailyAnalysis,
        });

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Pass startYear and endYear to the aggregation method
      return this.aggregateDateRangeAnalysis(analyses, startDate, endDate, startYear, endYear);
    } catch (error) {
      console.error("❌ Error in date range analysis:", error.message);
      return this.getDefaultRangeResult(startDate, endDate);
    }
  }

  // FIXED: Added startYear and endYear as parameters
  aggregateDateRangeAnalysis(analyses, startDate, endDate, startYear, endYear) {
    if (analyses.length === 0) {
      return this.getDefaultRangeResult(startDate, endDate);
    }

    const totalDays = analyses.length;
    const validAnalyses = analyses.filter((day) => day.totalYearsAnalyzed > 0);

    console.log(
      `📊 Aggregating ${totalDays} days of analysis (${validAnalyses.length} valid)`
    );

    if (validAnalyses.length === 0) {
      return this.getDefaultRangeResult(startDate, endDate);
    }

    const aggregated = {
      basicWeather: {
        rainProbability: Math.round(
          validAnalyses.reduce(
            (sum, day) => sum + (day.rainProbability || 0),
            0
          ) / validAnalyses.length
        ),
        avgTemperature:
          validAnalyses.length > 0
            ? Math.round(
                (validAnalyses.reduce(
                  (sum, day) => sum + (day.avgTemperature || 0),
                  0
                ) /
                  validAnalyses.length) *
                  10
              ) / 10
            : null,
        avgWindSpeed:
          validAnalyses.length > 0
            ? Math.round(
                (validAnalyses.reduce(
                  (sum, day) => sum + (day.avgWindSpeed || 0),
                  0
                ) /
                  validAnalyses.length) *
                  10
              ) / 10
            : null,
        humidity:
          validAnalyses.length > 0
            ? Math.round(
                validAnalyses.reduce(
                  (sum, day) => sum + (day.avgHumidity || 0),
                  0
                ) / validAnalyses.length
              )
            : null,
      },

      extremeConditions: {
        veryHot: Math.max(
          ...validAnalyses.map((day) => day.extremeConditions?.veryHot || 0)
        ),
        veryCold: Math.max(
          ...validAnalyses.map((day) => day.extremeConditions?.veryCold || 0)
        ),
        veryWindy: Math.max(
          ...validAnalyses.map((day) => day.extremeConditions?.veryWindy || 0)
        ),
        veryWet: Math.max(
          ...validAnalyses.map((day) => day.extremeConditions?.veryWet || 0)
        ),
        veryUncomfortable: Math.max(
          ...validAnalyses.map(
            (day) => day.extremeConditions?.veryUncomfortable || 0
          )
        ),
      },

      dailyForecast: analyses,
      totalYearsAnalyzed: Math.max(
        ...validAnalyses.map((day) => day.totalYearsAnalyzed || 0)
      ),
      // FIXED: Use the passed startYear and endYear
      analysisPeriod: `${startYear}-${endYear}`,
      dateRange: totalDays,
      isDateRange: totalDays > 1,
      parametersAvailable: validAnalyses[0]?.parametersAvailable || [],
    };

    console.log("✅ Date range analysis completed:", {
      days: totalDays,
      rainProbability: aggregated.basicWeather.rainProbability,
      avgTemperature: aggregated.basicWeather.avgTemperature,
      analysisPeriod: aggregated.analysisPeriod
    });

    return aggregated;
  }

  processEnhancedWeatherData(data, targetMonth, targetDay) {
    console.log("🔧 Processing enhanced weather data...");
    console.log("🎯 Target Date:", { targetMonth, targetDay });

    // Check if we have valid data
    if (!data.properties || !data.properties.parameter || Object.keys(data.properties.parameter).length === 0) {
      console.error("❌ No weather data available from NASA API");
      return this.getFallbackWeatherData(targetMonth, targetDay);
    }

    let parameters = data.properties.parameter;
    
    let rainDays = 0;
    let totalDays = 0;
    const tempReadings = [];
    const maxTempReadings = [];
    const minTempReadings = [];
    const windSpeedReadings = [];
    const humidityReadings = [];

    // Process each date in the data
    Object.keys(parameters.T2M || {}).forEach((dateKey) => {
      try {
        if (dateKey.length !== 8) return;

        const year = parseInt(dateKey.substring(0, 4));
        const month = parseInt(dateKey.substring(4, 6));
        const day = parseInt(dateKey.substring(6, 8));

        if (isNaN(month) || isNaN(day)) return;

        // Check if this matches our target month/day
        if (month === targetMonth && day === targetDay) {
          totalDays++;

          const temp = parameters.T2M?.[dateKey];
          const precip = parameters.PRECTOTCORR?.[dateKey];
          const maxTemp = parameters.T2M_MAX?.[dateKey];
          const minTemp = parameters.T2M_MIN?.[dateKey];
          const windSpeed = parameters.WS2M?.[dateKey];
          const humidity = parameters.RH2M?.[dateKey];

          if (this.isValidValue(temp)) tempReadings.push(temp);
          if (this.isValidValue(maxTemp)) maxTempReadings.push(maxTemp);
          if (this.isValidValue(minTemp)) minTempReadings.push(minTemp);
          if (this.isValidValue(windSpeed)) windSpeedReadings.push(windSpeed);
          if (this.isValidValue(humidity)) humidityReadings.push(humidity);
          if (this.isValidValue(precip) && precip > 0.1) rainDays++;
        }
      } catch (error) {
        console.error(`❌ Error processing date ${dateKey}:`, error.message);
      }
    });

    // Calculate basic probabilities
    const rainProbability = totalDays > 0 ? (rainDays / totalDays) * 100 : 0;

    // Calculate averages
    const avgTemperature = this.calculateAverage(tempReadings);
    const avgMaxTemperature = this.calculateAverage(maxTempReadings);
    const avgMinTemperature = this.calculateAverage(minTempReadings);
    const avgWindSpeed = this.calculateAverage(windSpeedReadings);
    const avgHumidity = this.calculateAverage(humidityReadings);

    // Calculate extreme condition probabilities
    const extremeConditions = {
      veryHot: this.calculateExtremeProbability(maxTempReadings, 35, 'above'),
      veryCold: this.calculateExtremeProbability(minTempReadings, 0, 'below'),
      veryWindy: this.calculateExtremeProbability(windSpeedReadings, 6.94, 'above'),
      veryWet: this.calculateExtremeProbability(
        this.extractTargetDateValues(parameters.PRECTOTCORR, targetMonth, targetDay),
        10,
        'above'
      ),
      veryUncomfortable: this.calculateDiscomfortProbability(tempReadings, humidityReadings)
    };

    const result = {
      rainProbability: Math.round(rainProbability),
      avgTemperature: avgTemperature ? Math.round(avgTemperature * 10) / 10 : null,
      avgWindSpeed: avgWindSpeed ? Math.round(avgWindSpeed * 10) / 10 : null,
      avgHumidity: avgHumidity ? Math.round(avgHumidity) : null,
      avgMaxTemperature: avgMaxTemperature ? Math.round(avgMaxTemperature * 10) / 10 : null,
      avgMinTemperature: avgMinTemperature ? Math.round(avgMinTemperature * 10) / 10 : null,
      extremeConditions,
      totalYearsAnalyzed: totalDays,
      parametersAvailable: Object.keys(parameters),
      analysisPeriod: '1995-2024',
    };

    console.log('✅ Enhanced analysis result:', result);
    return result;
  }

  // Helper methods (keep the same as before)
  calculateExtremeProbability(data, threshold, condition = 'above') {
    const validData = data.filter(val => this.isValidValue(val));
    if (validData.length === 0) return 0;
    
    const extremeCount = validData.filter(val => 
      condition === 'above' ? val > threshold : val < threshold
    ).length;
    
    return Math.round((extremeCount / validData.length) * 100);
  }

  calculateDiscomfortProbability(temperatures, humidities) {
    let uncomfortableDays = 0;
    const minLength = Math.min(temperatures.length, humidities.length);
    
    for (let i = 0; i < minLength; i++) {
      const temp = temperatures[i];
      const humidity = humidities[i];
      if (this.isValidValue(temp) && this.isValidValue(humidity)) {
        const heatIndex = temp + 0.1 * humidity;
        if (heatIndex > 40) uncomfortableDays++;
      }
    }
    
    return minLength > 0 ? Math.round((uncomfortableDays / minLength) * 100) : 0;
  }

  extractTargetDateValues(parameterData, targetMonth, targetDay) {
    const values = [];
    Object.keys(parameterData || {}).forEach((dateKey) => {
      if (dateKey.length === 8) {
        const month = parseInt(dateKey.substring(4, 6));
        const day = parseInt(dateKey.substring(6, 8));
        if (month === targetMonth && day === targetDay) {
          const value = parameterData[dateKey];
          if (this.isValidValue(value)) values.push(value);
        }
      }
    });
    return values;
  }

  isValidValue(value) {
    return value !== undefined && value !== null && !isNaN(value);
  }

  calculateAverage(values) {
    const validValues = values.filter(v => this.isValidValue(v));
    return validValues.length > 0 ? validValues.reduce((a, b) => a + b, 0) / validValues.length : null;
  }

  getFallbackWeatherData(month, day) {
    console.log('🔄 Using fallback weather data');
    
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
      avgMaxTemperature: Math.round((baseTemp + 5) * 10) / 10,
      avgMinTemperature: Math.round((baseTemp - 5) * 10) / 10,
      extremeConditions: {
        veryHot: Math.round(Math.random() * 15),
        veryCold: Math.round(Math.random() * 10),
        veryWindy: Math.round(Math.random() * 20),
        veryWet: Math.round(Math.random() * 12),
        veryUncomfortable: Math.round(Math.random() * 18)
      },
      totalYearsAnalyzed: 15,
      parametersAvailable: ['T2M', 'PRECTOTCORR'],
      isFallbackData: true
    };
  }

  getDefaultRangeResult(startDate, endDate) {
    const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    return {
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
      dailyForecast: [],
      totalYearsAnalyzed: 0,
      analysisPeriod: '1995-2024',
      dateRange: totalDays,
      isDateRange: totalDays > 1,
      parametersAvailable: [],
      isFallbackData: true
    };
  }
}

export default new NasaService();




