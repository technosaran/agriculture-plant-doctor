'use client';

import React, { useState } from 'react';

interface ApiKeySetupProps {
  onSetupComplete: () => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onSetupComplete }) => {
  const [apiKeys, setApiKeys] = useState({
    weather: '',
    imd: '',
    kvk: '',
    soil: '',
    fertilizer: '',
    market: '',
    plantDisease: '',
    location: ''
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  const steps = [
    {
      title: 'Weather APIs',
      description: 'Configure weather data sources for accurate agricultural recommendations',
      keys: [
        { name: 'weather', label: 'OpenWeatherMap API Key', required: false },
        { name: 'imd', label: 'Indian Meteorological Department API Key', required: true }
      ]
    },
    {
      title: 'Agricultural Data',
      description: 'Set up Indian agricultural database connections',
      keys: [
        { name: 'kvk', label: 'Krishi Vigyan Kendra API Key', required: true },
        { name: 'soil', label: 'ICAR-NBSS&LUP Soil API Key', required: false },
        { name: 'fertilizer', label: 'Indian Fertilizer Database API Key', required: true },
        { name: 'market', label: 'Agmarknet Market API Key', required: false }
      ]
    },
    {
      title: 'Plant Analysis',
      description: 'Configure plant disease detection capabilities',
      keys: [
        { name: 'plantDisease', label: 'PlantNet API Key', required: true },
        { name: 'location', label: 'OpenCage Geocoding API Key', required: false }
      ]
    }
  ];

  const handleInputChange = (key: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [key]: value }));
  };

  const validateApiKeys = async () => {
    setIsValidating(true);
    // Simulate API key validation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsValidating(false);
    onSetupComplete();
  };

  const getApiKeyInstructions = (keyName: string) => {
    const instructions = {
      weather: 'Get free API key from openweathermap.org',
      imd: 'Contact IMD at mausam.imd.gov.in for API access',
      kvk: 'Contact ICAR for KVK API access',
      soil: 'Contact ICAR-NBSS&LUP for soil data access',
      fertilizer: 'Contact Department of Fertilizers for API access',
      market: 'Contact Agmarknet for market price data access',
      plantDisease: 'Get free API key from my.plantnet.org',
      location: 'Get free API key from opencagedata.com'
    };
    return instructions[keyName as keyof typeof instructions] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🌱 API Configuration</h1>
          <p className="text-gray-600">Set up your API keys to unlock full functionality</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Step */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600 mb-6">{steps[currentStep].description}</p>

          <div className="space-y-4">
            {steps[currentStep].keys.map((key) => (
              <div key={key.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {key.label}
                  {key.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="password"
                  value={apiKeys[key.name as keyof typeof apiKeys]}
                  onChange={(e) => handleInputChange(key.name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={`Enter your ${key.label.toLowerCase()}`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 {getApiKeyInstructions(key.name)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={validateApiKeys}
              disabled={isValidating}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isValidating ? 'Validating...' : 'Complete Setup'}
            </button>
          )}
        </div>

        {/* Skip Option */}
        <div className="mt-6 text-center">
          <button
            onClick={onSetupComplete}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Skip for now (limited functionality)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup; 