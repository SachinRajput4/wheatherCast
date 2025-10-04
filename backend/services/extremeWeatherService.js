// backend/services/extremeWeatherService.js
class ExtremeWeatherService {
  
  calculateExtremeProbabilities(weatherData, targetMonth, targetDay) {
    const extremes = {
      // "Very Hot" - Temperature above 35°C (95°F)
      veryHot: this.calculateExtremeProbability(weatherData.T2M_MAX, 35, 'above'),
      
      // "Very Cold" - Temperature below 0°C (32°F)
      veryCold: this.calculateExtremeProbability(weatherData.T2M_MIN, 0, 'below'),
      
      // "Very Windy" - Wind speed above 25 km/h (15.5 mph)
      veryWindy: this.calculateExtremeProbability(weatherData.WS2M, 6.94, 'above'), // 25 km/h in m/s
      
      // "Very Wet" - Heavy rain above 10mm
      veryWet: this.calculateExtremeProbability(weatherData.PRECTOTCORR, 10, 'above'),
      
      // "Very Uncomfortable" - Heat Index above 40°C (104°F)
      veryUncomfortable: this.calculateDiscomfortProbability(weatherData)
    };
    
    return extremes;
  }
  
  calculateExtremeProbability(data, threshold, condition = 'above') {
    let extremeDays = 0;
    let totalDays = 0;
    
    Object.values(data).forEach(value => {
      if (value !== null && !isNaN(value)) {
        totalDays++;
        if (condition === 'above' && value > threshold) {
          extremeDays++;
        } else if (condition === 'below' && value < threshold) {
          extremeDays++;
        }
      }
    });
    
    return totalDays > 0 ? (extremeDays / totalDays) * 100 : 0;
  }
  
  calculateDiscomfortProbability(weatherData) {
    // Calculate Heat Index (feels-like temperature)
    let uncomfortableDays = 0;
    let totalDays = 0;
    
    Object.keys(weatherData.T2M).forEach(date => {
      const temp = weatherData.T2M[date];
      const humidity = weatherData.RH2M[date];
      
      if (temp && humidity) {
        const heatIndex = this.calculateHeatIndex(temp, humidity);
        if (heatIndex > 40) { // Very uncomfortable threshold
          uncomfortableDays++;
        }
        totalDays++;
      }
    });
    
    return totalDays > 0 ? (uncomfortableDays / totalDays) * 100 : 0;
  }
  
  calculateHeatIndex(temperature, humidity) {
    // Simplified heat index calculation
    // This is what makes conditions "feel" uncomfortable
    return temperature + 0.1 * humidity; // Simplified version
  }
}

export default new ExtremeWeatherService();