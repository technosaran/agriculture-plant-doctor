'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CropRecommendation, WeatherData, LocationData } from '@/types';
import { cropService } from '@/services/cropService';

interface CropRecommendationsProps {
  weatherData: WeatherData | null;
  location: LocationData | null;
}

const CropRecommendations: React.FC<CropRecommendationsProps> = ({ weatherData, location }) => {
  const [crops, setCrops] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedProfitability, setSelectedProfitability] = useState<string>('all');

  const loadCropRecommendations = useCallback(async () => {
    if (!location) {
      setError('Location data not available. Please enable location services.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const recommendations = await cropService.getCropRecommendations(
        weatherData, 
        undefined, // soilData
        { latitude: location.latitude, longitude: location.longitude }
      );
      setCrops(recommendations);
    } catch (error) {
      console.error('Error loading crop recommendations:', error);
      setError('Failed to load crop recommendations. Please check your API configuration.');
    } finally {
      setLoading(false);
    }
  }, [weatherData, location]);

  useEffect(() => {
    loadCropRecommendations();
  }, [loadCropRecommendations]);

  const filteredCrops = crops.filter((crop) => {
    const seasonMatch = selectedSeason === 'all' || crop.season.toLowerCase().includes(selectedSeason.toLowerCase());
    const profitabilityMatch = selectedProfitability === 'all' || crop.profitability === selectedProfitability;
    return seasonMatch && profitabilityMatch;
  });

  const getProfitabilityColor = (profitability: string) => {
    switch (profitability) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeasonColor = (season: string) => {
    if (season.toLowerCase().includes('kharif')) return 'text-blue-600 bg-blue-100';
    if (season.toLowerCase().includes('rabi')) return 'text-orange-600 bg-orange-100';
    if (season.toLowerCase().includes('zaid')) return 'text-green-600 bg-green-100';
    return 'text-gray-600 bg-gray-100';
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🌾 Crop Recommendations</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🌾 Crop Recommendations</h2>
        <p className="text-gray-600 mb-6">
          Get personalized crop recommendations based on your location, weather conditions, and soil data.
        </p>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Seasons</option>
              <option value="kharif">Kharif (June-October)</option>
              <option value="rabi">Rabi (October-March)</option>
              <option value="zaid">Zaid (March-June)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profitability</label>
            <select
              value={selectedProfitability}
              onChange={(e) => setSelectedProfitability(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading crop recommendations...</p>
          </div>
        ) : filteredCrops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => (
              <div key={crop.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{crop.name}</h3>
                    <p className="text-sm text-gray-600 italic">{crop.scientificName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProfitabilityColor(crop.profitability)}`}>
                    {crop.profitability.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSeasonColor(crop.season)}`}>
                      {crop.season}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p><strong>Growth Period:</strong> {crop.growthPeriod} days</p>
                    <p><strong>Expected Yield:</strong> {crop.expectedYield}</p>
                    <p><strong>Market Price:</strong> ₹{crop.marketPrice}/kg</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-800 mb-1">Soil Types:</h4>
                    <div className="flex flex-wrap gap-1">
                      {crop.soilType.map((type, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-800 mb-1">Climate Requirements:</h4>
                    <div className="text-xs text-gray-600">
                      <p>Temperature: {crop.climateRequirements.temperature.min}°C - {crop.climateRequirements.temperature.max}°C</p>
                      <p>Humidity: {crop.climateRequirements.humidity.min}% - {crop.climateRequirements.humidity.max}%</p>
                      <p>Rainfall: {crop.climateRequirements.rainfall.min}mm - {crop.climateRequirements.rainfall.max}mm</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No crops found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendations; 