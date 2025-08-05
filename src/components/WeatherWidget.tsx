import React from 'react';
import { WeatherData, LocationData } from '@/types';

interface WeatherWidgetProps {
  weatherData: WeatherData | null;
  location: LocationData | null;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weatherData, location }) => {
  if (!weatherData || !location) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('sun') || desc.includes('clear')) return '☀️';
    if (desc.includes('snow')) return '❄️';
    return '🌤️';
  };

  const getAgriculturalAdvice = (weatherData: WeatherData) => {
    const { temperature, humidity, rainfall } = weatherData;
    
    if (temperature > 30) {
      return 'High temperature - consider extra watering and shade for sensitive crops.';
    } else if (temperature < 10) {
      return 'Low temperature - protect frost-sensitive plants and delay planting.';
    } else if (humidity > 80) {
      return 'High humidity - watch for fungal diseases and ensure good air circulation.';
    } else if (rainfall > 5) {
      return 'Heavy rainfall - check drainage and avoid working in wet soil.';
    }
    return 'Good conditions for most agricultural activities.';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Weather Conditions</h2>
        <span className="text-2xl">{getWeatherIcon(weatherData.description)}</span>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">{weatherData.location}</p>
        <div className="flex items-center">
          <span className="text-3xl font-bold text-gray-900">{Math.round(weatherData.temperature)}°C</span>
          <span className="ml-2 text-gray-600">{weatherData.description}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">Humidity</div>
          <div className="text-lg font-semibold">{weatherData.humidity}%</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">Rainfall</div>
          <div className="text-lg font-semibold">{weatherData.rainfall}mm</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">Wind Speed</div>
          <div className="text-lg font-semibold">{weatherData.windSpeed} km/h</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">Pressure</div>
          <div className="text-lg font-semibold">{weatherData.pressure} hPa</div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-green-800 mb-2">🌾 Agricultural Advice</h3>
        <p className="text-sm text-green-700">{getAgriculturalAdvice(weatherData)}</p>
      </div>

      {weatherData.forecast.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-800 mb-3">5-Day Forecast</h3>
          <div className="space-y-2">
            {weatherData.forecast.slice(0, 5).map((day, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{day.date}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-800">{day.temp.min}° - {day.temp.max}°</span>
                  <span className="text-gray-600">{day.rainfall}mm</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget; 