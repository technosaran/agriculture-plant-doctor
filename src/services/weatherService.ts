import { API_CONFIG, API_ENDPOINTS } from '@/config/api';
import { WeatherData, LocationData, IMDWeatherResponse, IMDWeatherForecast, OpenWeatherMapResponse, OpenWeatherMapForecastResponse, AgroAdvisoryResponse, ClimateDataResponse } from '@/types';

class WeatherService {
  private weatherBaseUrl = API_CONFIG.WEATHER_BASE_URL;
  private weatherApiKey = API_CONFIG.WEATHER_API_KEY;
  private imdBaseUrl = API_CONFIG.IMD_BASE_URL;
  private imdApiKey = API_CONFIG.IMD_API_KEY;

  async getCurrentWeather(location: LocationData): Promise<WeatherData> {
    try {
      // Try IMD API first (Indian Meteorological Department)
      if (this.imdApiKey) {
        return await this.getIMDWeather(location);
      }
      
      // Fallback to OpenWeatherMap
      if (this.weatherApiKey) {
        return await this.getOpenWeatherMapData(location);
      }
      
      throw new Error('No weather API keys configured');
    } catch (error) {
      console.error('Weather API error:', error);
      throw new Error('Unable to fetch weather data. Please check your API keys.');
    }
  }

  private async getIMDWeather(location: LocationData): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${this.imdBaseUrl}${API_ENDPOINTS.IMD.WEATHER_FORECAST}?lat=${location.latitude}&lon=${location.longitude}&api_key=${this.imdApiKey}`
      );

      if (!response.ok) {
        throw new Error('IMD API request failed');
      }

      const data: IMDWeatherResponse = await response.json();
      
      return {
        location: `${location.city}, ${location.state}`,
        temperature: data.current?.temp || 0,
        humidity: data.current?.humidity || 0,
        rainfall: data.current?.rainfall || 0,
        windSpeed: data.current?.wind_speed || 0,
        pressure: data.current?.pressure || 0,
        description: data.current?.description || 'Weather data unavailable',
        forecast: data.forecast?.slice(0, 5).map((day: IMDWeatherForecast) => ({
          date: day.date,
          temp: { min: day.temp_min, max: day.temp_max },
          humidity: day.humidity,
          rainfall: day.rainfall,
        })) || [],
      };
    } catch (error) {
      console.error('IMD API error:', error);
      throw error;
    }
  }

  private async getOpenWeatherMapData(location: LocationData): Promise<WeatherData> {
    const response = await fetch(
      `${this.weatherBaseUrl}${API_ENDPOINTS.WEATHER.CURRENT}?lat=${location.latitude}&lon=${location.longitude}&appid=${this.weatherApiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error('OpenWeatherMap API request failed');
    }

    const data: OpenWeatherMapResponse = await response.json();
    
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
  }

  async getWeatherForecast(location: LocationData): Promise<WeatherData> {
    try {
      const [currentWeather, forecastResponse] = await Promise.all([
        this.getCurrentWeather(location),
        this.getForecastData(location)
      ]);

      return {
        ...currentWeather,
        forecast: forecastResponse,
      };
    } catch (error) {
      console.error('Weather forecast error:', error);
      throw new Error('Unable to fetch weather forecast. Please check your API keys.');
    }
  }

  private async getForecastData(location: LocationData): Promise<WeatherData['forecast']> {
    try {
      // Try IMD forecast first
      if (this.imdApiKey) {
        const response = await fetch(
          `${this.imdBaseUrl}${API_ENDPOINTS.IMD.WEATHER_FORECAST}?lat=${location.latitude}&lon=${location.longitude}&api_key=${this.imdApiKey}`
        );

        if (response.ok) {
          const data: IMDWeatherResponse = await response.json();
          return data.forecast?.slice(0, 5).map((day: IMDWeatherForecast) => ({
            date: day.date,
            temp: { min: day.temp_min, max: day.temp_max },
            humidity: day.humidity,
            rainfall: day.rainfall,
          })) || [];
        }
      }

      // Fallback to OpenWeatherMap
      if (this.weatherApiKey) {
        const response = await fetch(
          `${this.weatherBaseUrl}${API_ENDPOINTS.WEATHER.FORECAST}?lat=${location.latitude}&lon=${location.longitude}&appid=${this.weatherApiKey}&units=metric`
        );

        if (response.ok) {
          const data: OpenWeatherMapForecastResponse = await response.json();
          return data.list.slice(0, 5).map((item) => ({
            date: new Date(item.dt * 1000).toLocaleDateString(),
            temp: {
              min: item.main.temp_min,
              max: item.main.temp_max,
            },
            humidity: item.main.humidity,
            rainfall: item.rain?.['3h'] || 0,
          }));
        }
      }

      return [];
    } catch (error) {
      console.error('Forecast API error:', error);
      return [];
    }
  }

  async getAgroAdvisory(location: LocationData): Promise<string> {
    try {
      if (!this.imdApiKey) {
        return 'Agro advisory not available. Please configure IMD API key.';
      }

      const response = await fetch(
        `${this.imdBaseUrl}${API_ENDPOINTS.IMD.AGRO_ADVISORY}?lat=${location.latitude}&lon=${location.longitude}&api_key=${this.imdApiKey}`
      );

      if (response.ok) {
        const data: AgroAdvisoryResponse = await response.json();
        return data.advisory || 'No agro advisory available for this location.';
      }

      return 'Unable to fetch agro advisory.';
    } catch (error) {
      console.error('Agro advisory error:', error);
      return 'Agro advisory service temporarily unavailable.';
    }
  }

  async getClimateData(location: LocationData): Promise<ClimateDataResponse | null> {
    try {
      if (!this.imdApiKey) {
        return null;
      }

      const response = await fetch(
        `${this.imdBaseUrl}${API_ENDPOINTS.IMD.CLIMATE_DATA}?lat=${location.latitude}&lon=${location.longitude}&api_key=${this.imdApiKey}`
      );

      if (response.ok) {
        return await response.json() as ClimateDataResponse;
      }

      return null;
    } catch (error) {
      console.error('Climate data error:', error);
      return null;
    }
  }
}

export const weatherService = new WeatherService();