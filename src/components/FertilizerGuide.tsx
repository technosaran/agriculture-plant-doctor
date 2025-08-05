'use client';

import React, { useState, useEffect } from 'react';
import { Fertilizer, CropRecommendation } from '@/types';
import { fertilizerService } from '@/services/fertilizerService';
import { cropService } from '@/services/cropService';

const FertilizerGuide: React.FC = () => {
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const [crops, setCrops] = useState<CropRecommendation[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedGrowthStage, setSelectedGrowthStage] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedFertilizer, setSelectedFertilizer] = useState<Fertilizer | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fertilizerData, cropData] = await Promise.all([
        fertilizerService.getFertilizerRecommendations(),
        cropService.getCropRecommendations(null)
      ]);
      setFertilizers(fertilizerData);
      setCrops(cropData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredFertilizers = () => {
    let filtered = fertilizers;

    if (selectedCrop) {
      const crop = crops.find(c => c.id === selectedCrop);
      if (crop) {
        filtered = filtered.filter(fertilizer => 
          fertilizer.suitableCrops.includes(crop.name) ||
          fertilizer.suitableCrops.includes('All crops')
        );
      }
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(fertilizer => fertilizer.type === selectedType);
    }

    if (selectedGrowthStage !== 'all') {
      filtered = filtered.filter(fertilizer => {
        switch (selectedGrowthStage) {
          case 'seedling':
            return fertilizer.name.includes('Compost') || fertilizer.name.includes('Worm') || fertilizer.npkRatio.includes('1-1-1');
          case 'vegetative':
            return fertilizer.npkRatio.includes('20-20-20') || fertilizer.name.includes('Fish') || fertilizer.name.includes('Seaweed');
          case 'flowering':
            return fertilizer.npkRatio.includes('3-15-0') || fertilizer.name.includes('Bone');
          case 'fruiting':
            return fertilizer.name.includes('Calcium') || fertilizer.name.includes('Epsom') || fertilizer.npkRatio.includes('20-20-20');
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'organic': return 'text-green-600 bg-green-100';
      case 'inorganic': return 'text-blue-600 bg-blue-100';
      case 'bio': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getNPKColor = (npkRatio: string) => {
    const [n, p, k] = npkRatio.split('-').map(Number);
    if (n > 15) return 'text-red-600';
    if (p > 15) return 'text-blue-600';
    if (k > 15) return 'text-green-600';
    return 'text-gray-600';
  };

  const filteredFertilizers = getFilteredFertilizers();

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
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🌱 Fertilizer Guide</h2>
        <p className="text-gray-600 mb-6">
          Get personalized fertilizer recommendations based on your crops, soil conditions, and growth stages.
        </p>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Crops</option>
              {crops.map((crop) => (
                <option key={crop.id} value={crop.id}>{crop.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fertilizer Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Types</option>
              <option value="organic">Organic</option>
              <option value="inorganic">Inorganic</option>
              <option value="bio">Bio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Growth Stage</label>
            <select
              value={selectedGrowthStage}
              onChange={(e) => setSelectedGrowthStage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Stages</option>
              <option value="seedling">Seedling</option>
              <option value="vegetative">Vegetative</option>
              <option value="flowering">Flowering</option>
              <option value="fruiting">Fruiting</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedCrop('');
                setSelectedType('all');
                setSelectedGrowthStage('all');
              }}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Educational Content */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">📚 Understanding NPK Ratios</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-yellow-700">
            <div>
              <strong>Nitrogen (N):</strong> Promotes leaf growth and green color
            </div>
            <div>
              <strong>Phosphorus (P):</strong> Supports root development and flowering
            </div>
            <div>
              <strong>Potassium (K):</strong> Enhances fruit quality and disease resistance
            </div>
          </div>
        </div>

        {/* Fertilizer Grid */}
        {filteredFertilizers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFertilizers.map((fertilizer) => (
              <div key={fertilizer.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{fertilizer.name}</h3>
                    <p className={`text-lg font-bold ${getNPKColor(fertilizer.npkRatio)}`}>
                      NPK {fertilizer.npkRatio}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(fertilizer.type)}`}>
                    {fertilizer.type.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="text-gray-600 mb-1">Application:</div>
                    <div className="text-gray-800">{fertilizer.application}</div>
                  </div>

                  <div className="text-sm">
                    <div className="text-gray-600 mb-1">Benefits:</div>
                    <ul className="text-gray-800 space-y-1">
                      {fertilizer.benefits.slice(0, 2).map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-1">•</span>
                          {benefit}
                        </li>
                      ))}
                      {fertilizer.benefits.length > 2 && (
                        <li className="text-gray-500 text-xs">+{fertilizer.benefits.length - 2} more benefits</li>
                      )}
                    </ul>
                  </div>

                  <div className="text-sm">
                    <div className="text-gray-600 mb-1">Suitable for:</div>
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
                         {fertilizer.price === 0 ? 'Free (DIY)' : fertilizer.price ? `$${fertilizer.price}` : 'Price not available'}
                       </span>
                     </div>
                    <button
                      onClick={() => setSelectedFertilizer(fertilizer)}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
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
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No fertilizers match your criteria</h3>
            <p className="text-gray-600">Try adjusting your filters to see more options.</p>
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
                  <p className={`text-lg font-bold ${getNPKColor(selectedFertilizer.npkRatio)}`}>
                    NPK {selectedFertilizer.npkRatio}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFertilizer(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Application Instructions</h3>
                  <p className="text-gray-600">{selectedFertilizer.application}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Benefits</h3>
                  <ul className="text-gray-600 space-y-1">
                    {selectedFertilizer.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {benefit}
                      </li>
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

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">NPK Explanation</h3>
                  <p className="text-gray-600">
                    {fertilizerService.getNPKExplanation(selectedFertilizer.npkRatio)}
                  </p>
                </div>

                                 <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                   <div className="text-lg">
                     <span className="text-gray-600">Price: </span>
                     <span className="font-bold text-gray-800">
                       {selectedFertilizer.price === 0 ? 'Free (Can be made at home)' : selectedFertilizer.price ? `$${selectedFertilizer.price}` : 'Price not available'}
                     </span>
                   </div>
                  <button
                    onClick={() => setSelectedFertilizer(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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