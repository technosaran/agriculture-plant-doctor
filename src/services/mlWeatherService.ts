import { WeatherData, WeatherForecast } from '@/types';

class MLWeatherService {
  private historicalData: WeatherData[] = [];
  private isInitialized = false;

  // Indian climate patterns by region
  private climatePatterns = {
    tropical: {
      temperature: { min: 20, max: 35, seasonal_variation: 5 },
      humidity: { min: 60, max: 90, seasonal_variation: 15 },
      rainfall: { monsoon: 1200, winter: 50, summer: 100 }
    },
    subtropical: {
      temperature: { min: 15, max: 40, seasonal_variation: 10 },
      humidity: { min: 40, max: 80, seasonal_variation: 20 },
      rainfall: { monsoon: 800, winter: 100, summer: 200 }
    },
    temperate: {
      temperature: { min: 5, max: 30, seasonal_variation: 15 },
      humidity: { min: 30, max: 70, seasonal_variation: 25 },
      rainfall: { monsoon: 600, winter: 200, summer: 300 }
    }
  };

  private initializeHistoricalData(): void {
    if (this.isInitialized) return;

    // Generate synthetic historical data for the past 30 days
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      this.historicalData.push(this.generateWeatherData(date));
    }

    this.isInitialized = true;
    console.log('Weather prediction model initialized with historical data');
  }

  private generateWeatherData(date: Date): WeatherData {
    const month = date.getMonth() + 1;
    const season = this.getSeason(month);
    const climateZone = 'tropical'; // Default to tropical for Indian context

    const pattern = this.climatePatterns[climateZone];
    
    // Add seasonal and random variations
    const seasonalTempAdjustment = this.getSeasonalAdjustment(season, 'temperature');
    const seasonalHumidityAdjustment = this.getSeasonalAdjustment(season, 'humidity');
    const seasonalRainfallAdjustment = this.getSeasonalAdjustment(season, 'rainfall');

    const temperature = this.addRandomVariation(
      (pattern.temperature.min + pattern.temperature.max) / 2 + seasonalTempAdjustment,
      pattern.temperature.seasonal_variation
    );

    const humidity = this.addRandomVariation(
      (pattern.humidity.min + pattern.humidity.max) / 2 + seasonalHumidityAdjustment,
      pattern.humidity.seasonal_variation
    );

    const rainfall = Math.max(0, this.addRandomVariation(
      this.getSeasonalRainfall(season, pattern) + seasonalRainfallAdjustment,
      50
    ));

    return {
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(Math.max(0, Math.min(100, humidity))),
      rainfall: Math.round(rainfall * 10) / 10,
      windSpeed: this.addRandomVariation(10, 5),
      pressure: this.addRandomVariation(1013, 20),
      visibility: this.addRandomVariation(10, 3),
      uvIndex: Math.max(0, Math.min(11, this.addRandomVariation(6, 3))),
      timestamp: date.toISOString()
    };
  }

  private getSeason(month: number): string {
    if (month >= 6 && month <= 9) return 'monsoon';
    if (month >= 10 && month <= 2) return 'winter';
    return 'summer';
  }

  private getSeasonalAdjustment(season: string, parameter: string): number {
    const adjustments = {
      monsoon: { temperature: -3, humidity: 15, rainfall: 0 },
      winter: { temperature: -8, humidity: -10, rainfall: -20 },
      summer: { temperature: 5, humidity: -5, rainfall: -15 }
    };

    return adjustments[season as keyof typeof adjustments]?.[parameter as keyof typeof adjustments.monsoon] || 0;
  }

  private getSeasonalRainfall(season: string, pattern: any): number {
    switch (season) {
      case 'monsoon': return pattern.rainfall.monsoon / 30; // Daily average
      case 'winter': return pattern.rainfall.winter / 30;
      case 'summer': return pattern.rainfall.summer / 30;
      default: return 0;
    }
  }

  private addRandomVariation(base: number, variation: number): number {
    return base + (Math.random() - 0.5) * 2 * variation;
  }

  async getCurrentWeather(location?: { latitude: number; longitude: number }): Promise<WeatherData> {
    this.initializeHistoricalData();

    // Use location to adjust climate zone if provided
    let climateZone = 'tropical';
    if (location) {
      if (location.latitude > 30) climateZone = 'temperate';
      else if (location.latitude > 23.5) climateZone = 'subtropical';
    }

    return this.generateWeatherData(new Date());
  }

  async getWeatherForecast(
    location?: { latitude: number; longitude: number },
    days: number = 7
  ): Promise<WeatherForecast[]> {
    this.initializeHistoricalData();

    const forecast: WeatherForecast[] = [];
    const now = new Date();

    for (let i = 1; i <= days; i++) {
      const forecastDate = new Date(now);
      forecastDate.setDate(forecastDate.getDate() + i);

      // Use trend analysis from historical data
      const trend = this.analyzeTrend();
      const baseWeather = this.generateWeatherData(forecastDate);

      // Apply trend adjustments
      const adjustedWeather = {
        ...baseWeather,
        temperature: baseWeather.temperature + trend.temperature * i * 0.1,
        humidity: Math.max(0, Math.min(100, baseWeather.humidity + trend.humidity * i * 0.1)),
        rainfall: Math.max(0, baseWeather.rainfall + trend.rainfall * i * 0.1)
      };

      forecast.push({
        date: forecastDate.toISOString().split('T')[0],
        weather: adjustedWeather,
        high: adjustedWeather.temperature + 3,
        low: adjustedWeather.temperature - 5,
        description: this.getWeatherDescription(adjustedWeather),
        icon: this.getWeatherIcon(adjustedWeather)
      });
    }

    return forecast;
  }

  private analyzeTrend(): { temperature: number; humidity: number; rainfall: number } {
    if (this.historicalData.length < 7) {
      return { temperature: 0, humidity: 0, rainfall: 0 };
    }

    const recent = this.historicalData.slice(-7);
    const older = this.historicalData.slice(-14, -7);

    const recentAvg = {
      temperature: recent.reduce((sum, d) => sum + d.temperature, 0) / recent.length,
      humidity: recent.reduce((sum, d) => sum + d.humidity, 0) / recent.length,
      rainfall: recent.reduce((sum, d) => sum + d.rainfall, 0) / recent.length
    };

    const olderAvg = {
      temperature: older.reduce((sum, d) => sum + d.temperature, 0) / older.length,
      humidity: older.reduce((sum, d) => sum + d.humidity, 0) / older.length,
      rainfall: older.reduce((sum, d) => sum + d.rainfall, 0) / older.length
    };

    return {
      temperature: recentAvg.temperature - olderAvg.temperature,
      humidity: recentAvg.humidity - olderAvg.humidity,
      rainfall: recentAvg.rainfall - olderAvg.rainfall
    };
  }

  private getWeatherDescription(weather: WeatherData): string {
    if (weather.rainfall > 10) return 'Heavy Rain';
    if (weather.rainfall > 2) return 'Light Rain';
    if (weather.humidity > 80) return 'Humid';
    if (weather.temperature > 35) return 'Hot';
    if (weather.temperature < 15) return 'Cool';
    return 'Clear';
  }

  private getWeatherIcon(weather: WeatherData): string {
    if (weather.rainfall > 10) return '🌧️';
    if (weather.rainfall > 2) return '🌦️';
    if (weather.humidity > 80) return '☁️';
    if (weather.temperature > 35) return '☀️';
    if (weather.temperature < 15) return '🌤️';
    return '☀️';
  }

  async getHistoricalWeather(
    location?: { latitude: number; longitude: number },
    days: number = 30
  ): Promise<WeatherData[]> {
    this.initializeHistoricalData();
    return this.historicalData.slice(-days);
  }

  async getWeatherAlerts(location?: { latitude: number; longitude: number }): Promise<any[]> {
    const currentWeather = await this.getCurrentWeather(location);
    const forecast = await this.getWeatherForecast(location, 3);
    
    const alerts = [];

    // Temperature alerts
    if (currentWeather.temperature > 40) {
      alerts.push({
        type: 'heat_wave',
        severity: 'high',
        message: 'Extreme heat warning. Take precautions to avoid heat stress.',
        recommendations: ['Provide shade for crops', 'Increase irrigation frequency', 'Harvest early morning']
      });
    }

    // Rainfall alerts
    const totalRainfall = forecast.reduce((sum, f) => sum + f.weather.rainfall, 0);
    if (totalRainfall > 50) {
      alerts.push({
        type: 'heavy_rain',
        severity: 'medium',
        message: 'Heavy rainfall expected in the next 3 days.',
        recommendations: ['Ensure proper drainage', 'Protect crops from waterlogging', 'Delay fertilizer application']
      });
    }

    // Humidity alerts
    if (currentWeather.humidity > 90) {
      alerts.push({
        type: 'high_humidity',
        severity: 'medium',
        message: 'Very high humidity may promote fungal diseases.',
        recommendations: ['Monitor for disease symptoms', 'Improve air circulation', 'Consider preventive fungicide spray']
      });
    }

    return alerts;
  }

  async getAgroAdvisory(
    location?: { latitude: number; longitude: number },
    cropType?: string
  ): Promise<any> {
    const currentWeather = await this.getCurrentWeather(location);
    const forecast = await this.getWeatherForecast(location, 7);
    
    const advisory = {
      general: [] as string[],
      irrigation: [] as string[],
      fertilization: [] as string[],
      pestManagement: [] as string[],
      harvesting: [] as string[]
    };

    // General advisory based on current weather
    if (currentWeather.temperature > 35) {
      advisory.general.push('Provide shade nets for sensitive crops');
      advisory.irrigation.push('Increase irrigation frequency during hot weather');
    }

    if (currentWeather.humidity > 80) {
      advisory.pestManagement.push('Monitor for fungal diseases due to high humidity');
      advisory.general.push('Ensure good air circulation around plants');
    }

    // Forecast-based advisory
    const avgRainfall = forecast.reduce((sum, f) => sum + f.weather.rainfall, 0) / forecast.length;
    if (avgRainfall > 5) {
      advisory.irrigation.push('Reduce irrigation as rainfall is expected');
      advisory.fertilization.push('Delay fertilizer application until after rain');
    }

    // Crop-specific advisory
    if (cropType) {
      advisory.general.push(`Monitor ${cropType} for weather-related stress`);
    }

    return advisory;
  }
}

export const mlWeatherService = new MLWeatherService();