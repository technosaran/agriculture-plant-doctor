'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CropRecommendation, WeatherData } from '@/types';
import { cropService } from '@/services/cropService';

interface CropRecommendationsProps {
  weatherData: WeatherData | null;
}

const CropRecommendations: React.FC<CropRecommendationsProps> = ({ weatherData }) => {
  const [crops, setCrops] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedProfitability, setSelectedProfitability] = useState<string>('all');

  const loadCropRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      const recommendations = await cropService.getCropRecommendations(weatherData);
      setCrops(recommendations);
    } catch (error) {
      console.error('Error loading crop recommendations:', error);
    } finally {
      setLoading(false);
    }
  }, [weatherData]);

  useEffect(() => {
    loadCropRecommendations();
  }, [loadCropRecommendations]);

  const getFilteredCrops = () => {
    let filtered = crops;

    if (selectedSeason !== 'all') {
      filtered = filtered.filter(crop => 
        crop.season.toLowerCase().includes(selectedSeason.toLowerCase())
      );
    }

    if (selectedProfitability !== 'all') {
      filtered = filtered.filter(crop => crop.profitability === selectedProfitability);
    }

    return filtered;
  };

  const getProfitabilityColor = (profitability: string) => {
    switch (profitability) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeasonIcon = (season: string) => {
    if (season.includes('Spring')) return '🌸';
    if (season.includes('Summer')) return '☀️';
    if (season.includes('Fall')) return '🍂';
    if (season.includes('Winter')) return '❄️';
    return '🌱';
  };

  const filteredCrops = getFilteredCrops();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
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
          Based on your current weather conditions, here are the best crops to grow right now.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Seasons</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profitability</label>
            <select
              value={selectedProfitability}
              onChange={(e) => setSelectedProfitability(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Weather Context */}
        {weatherData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-800 mb-2">🌤️ Current Conditions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Temperature:</span>
                <span className="ml-1 text-blue-800">{Math.round(weatherData.temperature)}°C</span>
              </div>
              <div>
                <span className="text-blue-600">Humidity:</span>
                <span className="ml-1 text-blue-800">{weatherData.humidity}%</span>
              </div>
              <div>
                <span className="text-blue-600">Rainfall:</span>
                <span className="ml-1 text-blue-800">{weatherData.rainfall}mm</span>
              </div>
              <div>
                <span className="text-blue-600">Conditions:</span>
                <span className="ml-1 text-blue-800">{weatherData.description}</span>
              </div>
            </div>
          </div>
        )}

        {/* Crop Grid */}
        {filteredCrops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => (
              <div key={crop.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{crop.name}</h3>
                    <p className="text-sm text-gray-500 italic">{crop.scientificName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProfitabilityColor(crop.profitability)}`}>
                    {crop.profitability.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">{getSeasonIcon(crop.season)}</span>
                    <span>{crop.season}</span>
                  </div>

                  <div className="text-sm">
                    <div className="text-gray-600 mb-1">Growth Period:</div>
                    <div className="text-gray-800 font-medium">{crop.growthPeriod} days</div>
                  </div>

                  <div className="text-sm">
                    <div className="text-gray-600 mb-1">Expected Yield:</div>
                    <div className="text-gray-800 font-medium">{crop.expectedYield}</div>
                  </div>

                  <div className="text-sm">
                    <div className="text-gray-600 mb-1">Market Price:</div>
                    <div className="text-gray-800 font-medium">${crop.marketPrice}/kg</div>
                  </div>

                  <div className="text-sm">
                    <div className="text-gray-600 mb-1">Soil Types:</div>
                    <div className="flex flex-wrap gap-1">
                      {crop.soilType.slice(0, 2).map((type, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {type}
                        </span>
                      ))}
                      {crop.soilType.length > 2 && (
                        <span className="text-gray-500 text-xs">+{crop.soilType.length - 2} more</span>
                      )}
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="text-gray-600 mb-1">Temperature Range:</div>
                    <div className="text-gray-800 font-medium">
                      {crop.climateRequirements.temperature.min}°C - {crop.climateRequirements.temperature.max}°C
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No crops match your filters</h3>
            <p className="text-gray-600">Try adjusting your season or profitability filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendations; 