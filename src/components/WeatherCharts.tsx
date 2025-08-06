'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { WeatherData, WeatherForecast } from '@/types';
import { format, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeatherChartsProps {
  weatherData: WeatherData;
  forecast: WeatherForecast[];
}

const WeatherCharts: React.FC<WeatherChartsProps> = ({ weatherData, forecast }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Temperature Chart
  const temperatureData = {
    labels: forecast.map((day) => format(parseISO(day.date), 'MMM dd')),
    datasets: [
      {
        label: 'Max Temperature (°C)',
        data: forecast.map((day) => day.temp.max),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Min Temperature (°C)',
        data: forecast.map((day) => day.temp.min),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Rainfall Chart
  const rainfallData = {
    labels: forecast.map((day) => format(parseISO(day.date), 'MMM dd')),
    datasets: [
      {
        label: 'Rainfall (mm)',
        data: forecast.map((day) => day.rainfall),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Humidity Chart
  const humidityData = {
    labels: forecast.map((day) => format(parseISO(day.date), 'MMM dd')),
    datasets: [
      {
        label: 'Humidity (%)',
        data: forecast.map((day) => day.humidity),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const getAgriculturalAdvice = () => {
    const avgTemp = forecast.reduce((sum, day) => sum + (day.temp.max + day.temp.min) / 2, 0) / forecast.length;
    const totalRainfall = forecast.reduce((sum, day) => sum + day.rainfall, 0);
    const avgHumidity = forecast.reduce((sum, day) => sum + day.humidity, 0) / forecast.length;

    let advice = [];

    if (avgTemp > 30) {
      advice.push('High temperatures expected - consider extra irrigation and shade for sensitive crops');
    } else if (avgTemp < 15) {
      advice.push('Cool temperatures - protect frost-sensitive plants and delay planting');
    }

    if (totalRainfall > 50) {
      advice.push('Significant rainfall expected - ensure proper drainage and avoid waterlogging');
    } else if (totalRainfall < 10) {
      advice.push('Low rainfall forecast - prepare for irrigation needs');
    }

    if (avgHumidity > 80) {
      advice.push('High humidity conditions - monitor for fungal diseases and ensure good air circulation');
    }

    if (advice.length === 0) {
      advice.push('Favorable weather conditions for most agricultural activities');
    }

    return advice;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Weather Trends</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature Chart */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Temperature Trend</h3>
            <div className="h-64">
              <Line data={temperatureData} options={chartOptions} />
            </div>
          </div>

          {/* Rainfall Chart */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Rainfall Forecast</h3>
            <div className="h-64">
              <Bar data={rainfallData} options={chartOptions} />
            </div>
          </div>

          {/* Humidity Chart */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Humidity Trend</h3>
            <div className="h-64">
              <Line data={humidityData} options={chartOptions} />
            </div>
          </div>

          {/* Agricultural Advice */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-green-800 mb-3">🌾 Agricultural Advice</h3>
            <div className="space-y-2">
              {getAgriculturalAdvice().map((advice, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <p className="text-sm text-green-700">{advice}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Weather Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(weatherData.temperature)}°C</div>
            <div className="text-sm text-blue-700">Current Temp</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{weatherData.humidity}%</div>
            <div className="text-sm text-green-700">Humidity</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{weatherData.rainfall}mm</div>
            <div className="text-sm text-purple-700">Rainfall</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{weatherData.windSpeed} km/h</div>
            <div className="text-sm text-orange-700">Wind Speed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCharts; 