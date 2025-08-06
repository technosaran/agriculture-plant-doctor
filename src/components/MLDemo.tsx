'use client';

import { useState, useEffect } from 'react';
import { mlPlantDiseaseService } from '@/services/mlPlantDiseaseService';
import { mlCropService } from '@/services/mlCropService';
import { mlWeatherService } from '@/services/mlWeatherService';
import { mlFertilizerService } from '@/services/mlFertilizerService';
import { dataLoader } from '@/services/dataLoader';

export default function MLDemo() {
  const [activeTab, setActiveTab] = useState('disease');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [datasetStatus, setDatasetStatus] = useState<Record<string, boolean>>({});

  const testDiseaseDetection = async () => {
    setLoading(true);
    try {
      // Get disease database instead of image detection for demo
      const diseases = await mlPlantDiseaseService.getDiseaseDatabase();
      setResults({ type: 'diseases', data: diseases.slice(0, 3) });
    } catch (error) {
      console.error('Disease detection error:', error);
      setResults({ type: 'error', data: 'Failed to load disease data' });
    }
    setLoading(false);
  };

  const testCropRecommendations = async () => {
    setLoading(true);
    try {
      const weatherData = {
        temperature: 28,
        humidity: 75,
        rainfall: 800,
        windSpeed: 10,
        pressure: 1013,
        visibility: 10,
        uvIndex: 6,
        timestamp: new Date().toISOString()
      };
      
      const soilData = {
        ph: 6.5,
        fertility: 'medium' as const,
        nitrogen: 250,
        phosphorus: 20,
        potassium: 180
      };

      const crops = await mlCropService.getCropRecommendations(weatherData, soilData);
      setResults({ type: 'crops', data: crops.slice(0, 3) });
    } catch (error) {
      console.error('Crop recommendation error:', error);
      setResults({ type: 'error', data: 'Failed to load crop recommendations' });
    }
    setLoading(false);
  };

  const testWeatherPrediction = async () => {
    setLoading(true);
    try {
      const location = { latitude: 28.6139, longitude: 77.2090 }; // Delhi
      const forecast = await mlWeatherService.getWeatherForecast(location, 5);
      setResults({ type: 'weather', data: forecast });
    } catch (error) {
      console.error('Weather prediction error:', error);
      setResults({ type: 'error', data: 'Failed to load weather forecast' });
    }
    setLoading(false);
  };

  const testFertilizerRecommendations = async () => {
    setLoading(true);
    try {
      const soilData = {
        ph: 6.5,
        fertility: 'medium' as const,
        nitrogen: 250,
        phosphorus: 20,
        potassium: 180
      };

      const recommendations = await mlFertilizerService.getFertilizerRecommendations('Rice', soilData);
      setResults({ type: 'fertilizer', data: recommendations.slice(0, 2) });
    } catch (error) {
      console.error('Fertilizer recommendation error:', error);
      setResults({ type: 'error', data: 'Failed to load fertilizer recommendations' });
    }
    setLoading(false);
  };

  useEffect(() => {
    // Check dataset status on component mount
    const checkDatasetStatus = () => {
      const status = dataLoader.getCacheStatus();
      setDatasetStatus(status);
    };
    
    checkDatasetStatus();
  }, []);

  const renderResults = () => {
    if (loading) {
      return <div className="text-center py-4">Loading ML predictions...</div>;
    }

    if (!results) {
      return <div className="text-center py-4 text-gray-500">Click a button above to test ML models</div>;
    }

    if (results.type === 'error') {
      return <div className="text-red-500 text-center py-4">{results.data}</div>;
    }

    switch (results.type) {
      case 'diseases':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Plant Disease Database (ML Model)</h3>
            {results.data.map((disease: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-green-700">{disease.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{disease.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Symptoms:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {disease.symptoms.slice(0, 2).map((symptom: string, i: number) => (
                        <li key={i}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Treatment:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {disease.treatment.slice(0, 2).map((treatment: string, i: number) => (
                        <li key={i}>{treatment}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'crops':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Crop Recommendations (ML Model)</h3>
            {results.data.map((crop: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-green-700">{crop.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{crop.scientificName}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Season:</strong> {crop.season}
                  </div>
                  <div>
                    <strong>Growth Period:</strong> {crop.growthPeriod} days
                  </div>
                  <div>
                    <strong>Expected Yield:</strong> {crop.expectedYield}
                  </div>
                  <div>
                    <strong>Profitability:</strong> 
                    <span className={`ml-1 px-2 py-1 rounded text-xs ${
                      crop.profitability === 'high' ? 'bg-green-100 text-green-800' :
                      crop.profitability === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {crop.profitability}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'weather':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Weather Forecast (ML Model)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.data.map((forecast: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">{forecast.icon}</div>
                    <div className="font-medium">{forecast.date}</div>
                    <div className="text-sm text-gray-600">{forecast.description}</div>
                    <div className="mt-2">
                      <div className="text-lg font-semibold">
                        {Math.round(forecast.weather.temperature)}°C
                      </div>
                      <div className="text-sm text-gray-500">
                        H: {forecast.high}° L: {forecast.low}°
                      </div>
                      <div className="text-sm mt-1">
                        Humidity: {forecast.weather.humidity}%
                      </div>
                      <div className="text-sm">
                        Rainfall: {forecast.weather.rainfall}mm
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'fertilizer':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Fertilizer Recommendations (ML Model)</h3>
            {results.data.map((rec: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-green-700">{rec.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Cost:</span>
                    <span className="text-green-600">₹{rec.totalCost}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Expected Yield Increase:</span>
                    <span className="text-blue-600">{rec.expectedYieldIncrease}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Soil Health Impact:</span>
                    <span className={rec.soilHealthImpact === 'Positive' ? 'text-green-600' : 'text-gray-600'}>
                      {rec.soilHealthImpact}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <strong className="text-sm">Fertilizers:</strong>
                  <ul className="list-disc list-inside mt-1 text-sm">
                    {rec.fertilizers.slice(0, 3).map((fert: any, i: number) => (
                      <li key={i}>{fert.name} - {fert.quantity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">
          🤖 Advanced ML-Powered Agriculture Assistant
        </h1>
        <p className="text-gray-600">
          Experience cutting-edge AI agriculture solutions with advanced datasets. No APIs required - everything runs locally with your own agricultural data.
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <div className="text-blue-600 text-xl mr-3">📊</div>
            <div>
              <h3 className="font-semibold text-blue-800">Ready for Your Advanced Datasets</h3>
              <p className="text-blue-700 text-sm mt-1">
                This system is designed to work with comprehensive agricultural datasets. 
                <a href="/DATASET_SETUP_GUIDE.md" className="underline ml-1" target="_blank">
                  View setup guide
                </a> to provide your own data for maximum accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Status */}
      <div className="mb-6 bg-white rounded-lg shadow-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3">📊 Dataset Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {Object.entries({
            'Plant Diseases': 'plant_diseases',
            'Crops': 'crops',
            'Weather': 'weather_patterns',
            'Fertilizers': 'fertilizers',
            'Soil Data': 'soil_data',
            'Market Data': 'market_data',
            'Research': 'research_data'
          }).map(([label, key]) => (
            <div key={key} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                datasetStatus[key] ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm text-gray-600">{label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          🟢 Advanced dataset loaded | 🟡 Using fallback data
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => { setActiveTab('disease'); setResults(null); }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'disease' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🦠 Disease Detection
        </button>
        <button
          onClick={() => { setActiveTab('crop'); setResults(null); }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'crop' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🌾 Crop Recommendations
        </button>
        <button
          onClick={() => { setActiveTab('weather'); setResults(null); }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'weather' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🌤️ Weather Prediction
        </button>
        <button
          onClick={() => { setActiveTab('fertilizer'); setResults(null); }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'fertilizer' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🧪 Fertilizer Guide
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mb-6">
        {activeTab === 'disease' && (
          <button
            onClick={testDiseaseDetection}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Load Disease Database'}
          </button>
        )}
        {activeTab === 'crop' && (
          <button
            onClick={testCropRecommendations}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Get Crop Recommendations'}
          </button>
        )}
        {activeTab === 'weather' && (
          <button
            onClick={testWeatherPrediction}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Generate Weather Forecast'}
          </button>
        )}
        {activeTab === 'fertilizer' && (
          <button
            onClick={testFertilizerRecommendations}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Get Fertilizer Recommendations'}
          </button>
        )}
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {renderResults()}
      </div>

      {/* ML Advantages */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-green-800 mb-4">
          🧠 Advanced ML Agriculture Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="text-green-600 text-xl">🔒</div>
            <div>
              <h3 className="font-medium">Complete Privacy</h3>
              <p className="text-sm text-gray-600">All ML processing happens locally on your device</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-green-600 text-xl">⚡</div>
            <div>
              <h3 className="font-medium">Lightning Fast</h3>
              <p className="text-sm text-gray-600">Sub-100ms predictions with advanced ML models</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-green-600 text-xl">📊</div>
            <div>
              <h3 className="font-medium">Advanced Datasets</h3>
              <p className="text-sm text-gray-600">Support for comprehensive agricultural databases</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-green-600 text-xl">🌐</div>
            <div>
              <h3 className="font-medium">Offline Ready</h3>
              <p className="text-sm text-gray-600">Works perfectly without internet connection</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-green-600 text-xl">🎯</div>
            <div>
              <h3 className="font-medium">Precision Agriculture</h3>
              <p className="text-sm text-gray-600">Highly accurate, data-driven recommendations</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-green-600 text-xl">🔧</div>
            <div>
              <h3 className="font-medium">Fully Customizable</h3>
              <p className="text-sm text-gray-600">Train models with your own agricultural data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}