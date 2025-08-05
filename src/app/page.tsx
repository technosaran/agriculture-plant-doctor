'use client';

import { useState, useEffect } from 'react';
import { WeatherData, LocationData } from '@/types';
import { weatherService } from '@/services/weatherService';
import DiseaseDetection from '@/components/DiseaseDetection';
import WeatherWidget from '@/components/WeatherWidget';
import CropRecommendations from '@/components/CropRecommendations';
import FertilizerGuide from '@/components/FertilizerGuide';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user location and weather data
    const initializeApp = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const mockLocation: LocationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                city: 'Your Location',
                state: 'State',
                country: 'Country',
              };
              setLocation(mockLocation);
              
              // Get weather data
              const weather = await weatherService.getWeatherForecast(mockLocation);
              setWeatherData(weather);
              setLoading(false);
            },
            () => {
              // Fallback to mock data if geolocation fails
              const mockLocation: LocationData = {
                latitude: 40.7128,
                longitude: -74.0060,
                city: 'New York',
                state: 'NY',
                country: 'USA',
              };
              setLocation(mockLocation);
              setWeatherData(weatherService.getMockWeatherData(mockLocation));
              setLoading(false);
            }
          );
        } else {
          // Fallback for browsers without geolocation
          const mockLocation: LocationData = {
            latitude: 40.7128,
            longitude: -74.0060,
            city: 'New York',
            state: 'NY',
            country: 'USA',
          };
          setLocation(mockLocation);
          setWeatherData(weatherService.getMockWeatherData(mockLocation));
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'disease-detection':
        return <DiseaseDetection />;
      case 'crop-recommendations':
        return <CropRecommendations weatherData={weatherData} />;
      case 'fertilizer-guide':
        return <FertilizerGuide />;
      case 'dashboard':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeatherWidget weatherData={weatherData} location={location} />
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <button
                  onClick={() => setActiveTab('disease-detection')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  🔍 Detect Plant Disease
                </button>
                <button
                  onClick={() => setActiveTab('crop-recommendations')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  🌾 Get Crop Recommendations
                </button>
                <button
                  onClick={() => setActiveTab('fertilizer-guide')}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  🌱 Fertilizer Guide
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your agriculture assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
