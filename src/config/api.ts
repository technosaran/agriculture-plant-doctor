// API Configuration - Add your API keys here
export const API_CONFIG = {
  // Weather API (OpenWeatherMap - Free tier available)
  WEATHER_API_KEY: process.env.NEXT_PUBLIC_WEATHER_API_KEY || '',
  WEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5',

  // Plant Disease Detection API (PlantNet or custom ML API)
  PLANT_DISEASE_API_KEY: process.env.NEXT_PUBLIC_PLANT_DISEASE_API_KEY || '',
  PLANT_DISEASE_BASE_URL: 'https://my-api.plantnet.org/v2/identify',

  // Soil Data API (SoilGrids - Free)
  SOIL_API_BASE_URL: 'https://rest.soilgrids.org',

  // Crop Recommendation API (Custom or agricultural data API)
  CROP_API_KEY: process.env.NEXT_PUBLIC_CROP_API_KEY || '',
  CROP_API_BASE_URL: 'https://api.agromonitoring.com/agro/1.0',

  // Fertilizer API (Custom or agricultural database)
  FERTILIZER_API_KEY: process.env.NEXT_PUBLIC_FERTILIZER_API_KEY || '',
  FERTILIZER_API_BASE_URL: 'https://api.fertilizer-db.com/v1',

  // Location API (OpenCage Geocoding - Free tier)
  LOCATION_API_KEY: process.env.NEXT_PUBLIC_LOCATION_API_KEY || '',
  LOCATION_BASE_URL: 'https://api.opencagedata.com/geocode/v1',
};

// API Endpoints
export const API_ENDPOINTS = {
  WEATHER: {
    CURRENT: '/weather',
    FORECAST: '/forecast',
  },
  PLANT_DISEASE: {
    IDENTIFY: '/identify',
    DISEASES: '/diseases',
  },
  SOIL: {
    PROPERTIES: '/properties/query',
  },
  CROP: {
    RECOMMENDATIONS: '/recommendations',
    SEASONS: '/seasons',
  },
  FERTILIZER: {
    SEARCH: '/search',
    RECOMMENDATIONS: '/recommendations',
  },
  LOCATION: {
    GEOCODE: '/json',
  },
};

// Rate limiting and request configuration
export const REQUEST_CONFIG = {
  timeout: 10000,
  retries: 3,
  rateLimit: {
    requests: 60,
    window: 60000, // 1 minute
  },
};