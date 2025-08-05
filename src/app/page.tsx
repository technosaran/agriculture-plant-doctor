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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get user location and weather data
    const initializeApp = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const userLocation: LocationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                city: 'Your Location',
                state: 'State',
                country: 'India',
              };
              setLocation(userLocation);
              
              try {
                // Get weather data from real APIs
                const weather = await weatherService.getWeatherForecast(userLocation);
                setWeatherData(weather);
                setError(null);
              } catch (weatherError) {
                console.error('Weather API error:', weatherError);
                setError('Unable to fetch weather data. Please check your API configuration.');
              }
              setLoading(false);
            },
            (geolocationError) => {
              console.error('Geolocation error:', geolocationError);
              setError('Location access denied. Please enable location services for better recommendations.');
              setLoading(false);
            }
          );
        } else {
          setError('Geolocation not supported. Please enable location services for better recommendations.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        setError('Failed to initialize application. Please check your internet connection.');
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
        return <CropRecommendations weatherData={weatherData} location={location} />;
      case 'fertilizer-guide':
        return <FertilizerGuide location={location} />;
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
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">API Configuration Required</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                      <p className="mt-2">
                        Please configure the following API keys in your <code className="bg-red-100 px-1 rounded">.env.local</code> file:
                      </p>
                      <ul className="mt-1 list-disc list-inside">
                        <li>NEXT_PUBLIC_WEATHER_API_KEY (OpenWeatherMap)</li>
                        <li>NEXT_PUBLIC_IMD_API_KEY (Indian Meteorological Department)</li>
                        <li>NEXT_PUBLIC_KVK_API_KEY (Krishi Vigyan Kendra)</li>
                        <li>NEXT_PUBLIC_PLANT_DISEASE_API_KEY (PlantNet)</li>
                        <li>NEXT_PUBLIC_FERTILIZER_API_KEY (Indian Fertilizer Database)</li>
                        <li>NEXT_PUBLIC_SOIL_API_KEY (ICAR-NBSS&LUP)</li>
                        <li>NEXT_PUBLIC_MARKET_API_KEY (Agmarknet)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
