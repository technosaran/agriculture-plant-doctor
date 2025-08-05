'use client';

import React, { useState, useEffect } from 'react';
import { Fertilizer, CropRecommendation, LocationData } from '@/types';
import { fertilizerService } from '@/services/fertilizerService';
import { cropService } from '@/services/cropService';

interface FertilizerGuideProps {
  location: LocationData | null;
}

const FertilizerGuide: React.FC<FertilizerGuideProps> = ({ location }) => {
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const [crops, setCrops] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedGrowthStage, setSelectedGrowthStage] = useState<string>('all');
  const [selectedFertilizer, setSelectedFertilizer] = useState<Fertilizer | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!location) {
        setError('Location data not available. Please enable location services.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Load fertilizers and crops in parallel
        const [fertilizerData, cropData] = await Promise.all([
          fertilizerService.getFertilizerRecommendations(
            undefined, // crop
            undefined, // soilData
            undefined, // growthStage
            { latitude: location.latitude, longitude: location.longitude }
          ),
          cropService.getCropRecommendations(
            null, // weatherData
            undefined, // soilData
            { latitude: location.latitude, longitude: location.longitude }
          )
        ]);

        setFertilizers(fertilizerData);
        setCrops(cropData);
      } catch (error) {
        console.error('Error loading fertilizer data:', error);
        setError('Failed to load fertilizer recommendations. Please check your API configuration.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location]);

  const filteredFertilizers = fertilizers.filter((fertilizer) => {
    const cropMatch = selectedCrop === 'all' || fertilizer.suitableCrops.includes(selectedCrop) || fertilizer.suitableCrops.includes('All crops');
    const typeMatch = selectedType === 'all' || fertilizer.type === selectedType;
    return cropMatch && typeMatch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'organic': return 'text-green-600 bg-green-100';
      case 'inorganic': return 'text-blue-600 bg-blue-100';
      case 'bio': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getNPKColor = (npk: string) => {
    const [n, p, k] = npk.split('-').map(Number);
    if (n > 15 || p > 15 || k > 15) return 'text-red-600 bg-red-100';
    if (n > 10 || p > 10 || k > 10) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🌱 Fertilizer Guide</h2>
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🌱 Fertilizer Guide</h2>
        <p className="text-gray-600 mb-6">
          Get personalized fertilizer recommendations based on your crops, soil conditions, and growth stage.
        </p>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Crops</option>
              {crops.map((crop) => (
                <option key={crop.id} value={crop.name}>{crop.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Types</option>
              <option value="organic">Organic</option>
              <option value="inorganic">Inorganic</option>
              <option value="bio">Bio</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Growth Stage</label>
            <select
              value={selectedGrowthStage}
              onChange={(e) => setSelectedGrowthStage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Stages</option>
              <option value="seedling">Seedling</option>
              <option value="vegetative">Vegetative</option>
              <option value="flowering">Flowering</option>
              <option value="fruiting">Fruiting</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading fertilizer recommendations...</p>
          </div>
        ) : filteredFertilizers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFertilizers.map((fertilizer) => (
              <div key={fertilizer.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{fertilizer.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTypeColor(fertilizer.type)}`}>
                      {fertilizer.type}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getNPKColor(fertilizer.npkRatio)}`}>
                    NPK {fertilizer.npkRatio}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 mb-1">Benefits:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {fertilizer.benefits.slice(0, 2).map((benefit, index) => (
                        <li key={index}>• {benefit}</li>
                      ))}
                      {fertilizer.benefits.length > 2 && (
                        <li className="text-gray-500">+{fertilizer.benefits.length - 2} more benefits</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-800 mb-1">Suitable Crops:</h4>
                    <div className="flex flex-wrap gap-1">
                      {fertilizer.suitableCrops.slice(0, 3).map((crop, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {crop}
                        </span>
                      ))}
                      {fertilizer.suitableCrops.length > 3 && (
                        <span className="text-gray-500 text-xs">+{fertilizer.suitableCrops.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="text-sm">
                      <span className="text-gray-600">Price: </span>
                      <span className="font-medium text-gray-800">
                        {fertilizer.price === 0 ? 'Free (DIY)' : fertilizer.price ? `₹${fertilizer.price}` : 'Price not available'}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedFertilizer(fertilizer)}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No fertilizers found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Fertilizer Details Modal */}
      {selectedFertilizer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{selectedFertilizer.name}</h2>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(selectedFertilizer.type)}`}>
                      {selectedFertilizer.type}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getNPKColor(selectedFertilizer.npkRatio)}`}>
                      NPK {selectedFertilizer.npkRatio}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFertilizer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">NPK Explanation</h3>
                  <p className="text-sm text-gray-600">
                    {fertilizerService.getNPKExplanation(selectedFertilizer.npkRatio)}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Application Method</h3>
                  <p className="text-sm text-gray-600">{selectedFertilizer.application}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Benefits</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedFertilizer.benefits.map((benefit, index) => (
                      <li key={index}>• {benefit}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Suitable Crops</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedFertilizer.suitableCrops.map((crop, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-lg">
                    <span className="text-gray-600">Price: </span>
                    <span className="font-bold text-gray-800">
                      {selectedFertilizer.price === 0 ? 'Free (Can be made at home)' : selectedFertilizer.price ? `₹${selectedFertilizer.price}` : 'Price not available'}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedFertilizer(null)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FertilizerGuide; 