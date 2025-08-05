import { API_CONFIG, API_ENDPOINTS } from '@/config/api';
import { WeatherData, LocationData } from '@/types';

class WeatherService {
  private baseUrl = API_CONFIG.WEATHER_BASE_URL;
  private apiKey = API_CONFIG.WEATHER_API_KEY;

  async getCurrentWeather(location: LocationData): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${this.baseUrl}${API_ENDPOINTS.WEATHER.CURRENT}?lat=${location.latitude}&lon=${location.longitude}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      
      return {
        location: `${location.city}, ${location.state}`,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        rainfall: data.rain?.['1h'] || 0,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        description: data.weather[0].description,
        forecast: [], // Will be populated by forecast API
      };
    } catch (error) {
      console.error('Weather API error:', error);
      throw new Error('Unable to fetch weather data');
    }
  }

  async getWeatherForecast(location: LocationData): Promise<WeatherData> {
    try {
      const [currentWeather, forecastResponse] = await Promise.all([
        this.getCurrentWeather(location),
        fetch(
          `${this.baseUrl}${API_ENDPOINTS.WEATHER.FORECAST}?lat=${location.latitude}&lon=${location.longitude}&appid=${this.apiKey}&units=metric`
        )
      ]);

      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast data');
      }

      const forecastData = await forecastResponse.json();
      
      const forecast = forecastData.list.slice(0, 5).map((item: { dt: number; main: { temp_min: number; temp_max: number; humidity: number }; rain?: { '3h': number } }) => ({
        date: new Date(item.dt * 1000).toLocaleDateString(),
        temp: {
          min: item.main.temp_min,
          max: item.main.temp_max,
        },
        humidity: item.main.humidity,
        rainfall: item.rain?.['3h'] || 0,
      }));

      return {
        ...currentWeather,
        forecast,
      };
    } catch (error) {
      console.error('Weather forecast error:', error);
      throw new Error('Unable to fetch weather forecast');
    }
  }

  // Mock weather data for development/testing
  getMockWeatherData(location: LocationData): WeatherData {
    return {
      location: `${location.city}, ${location.state}`,
      temperature: 28,
      humidity: 65,
      rainfall: 2.5,
      windSpeed: 12,
      pressure: 1013,
      description: 'Partly cloudy',
      forecast: [
        { date: '2025-01-09', temp: { min: 22, max: 30 }, humidity: 60, rainfall: 0 },
        { date: '2025-01-10', temp: { min: 24, max: 32 }, humidity: 70, rainfall: 1.2 },
        { date: '2025-01-11', temp: { min: 23, max: 29 }, humidity: 75, rainfall: 3.5 },
        { date: '2025-01-12', temp: { min: 21, max: 28 }, humidity: 68, rainfall: 0.8 },
        { date: '2025-01-13', temp: { min: 25, max: 31 }, humidity: 62, rainfall: 0 },
      ],
    };
  }
}

export const weatherService = new WeatherService();