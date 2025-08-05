// API Configuration for Indian Agriculture Focus
export const API_CONFIG = {
  // Weather API (OpenWeatherMap - Free tier available)
  WEATHER_API_KEY: process.env.NEXT_PUBLIC_WEATHER_API_KEY || '',
  WEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5',

  // Indian Agricultural APIs
  // Krishi Vigyan Kendra (KVK) API for crop recommendations
  KVK_API_KEY: process.env.NEXT_PUBLIC_KVK_API_KEY || '',
  KVK_BASE_URL: 'https://kvk.icar.gov.in/api',

  // Indian Meteorological Department (IMD) API
  IMD_API_KEY: process.env.NEXT_PUBLIC_IMD_API_KEY || '',
  IMD_BASE_URL: 'https://mausam.imd.gov.in/api',

  // Plant Disease Detection API (PlantNet or custom ML API)
  PLANT_DISEASE_API_KEY: process.env.NEXT_PUBLIC_PLANT_DISEASE_API_KEY || '',
  PLANT_DISEASE_BASE_URL: 'https://my-api.plantnet.org/v2/identify',

  // Indian Soil Data API (ICAR-NBSS&LUP)
  SOIL_API_KEY: process.env.NEXT_PUBLIC_SOIL_API_KEY || '',
  SOIL_API_BASE_URL: 'https://soilhealth.dac.gov.in/api',

  // Indian Fertilizer Database API
  FERTILIZER_API_KEY: process.env.NEXT_PUBLIC_FERTILIZER_API_KEY || '',
  FERTILIZER_API_BASE_URL: 'https://fert.nic.in/api',

  // Location API (OpenCage Geocoding - Free tier)
  LOCATION_API_KEY: process.env.NEXT_PUBLIC_LOCATION_API_KEY || '',
  LOCATION_BASE_URL: 'https://api.opencagedata.com/geocode/v1',

  // Indian Agricultural Market Prices API
  MARKET_API_KEY: process.env.NEXT_PUBLIC_MARKET_API_KEY || '',
  MARKET_API_BASE_URL: 'https://agmarknet.gov.in/api',
};

// API Endpoints
export const API_ENDPOINTS = {
  WEATHER: {
    CURRENT: '/weather',
    FORECAST: '/forecast',
  },
  KVK: {
    CROP_RECOMMENDATIONS: '/crop-recommendations',
    SEASONAL_CROPS: '/seasonal-crops',
    SOIL_ADVISORY: '/soil-advisory',
  },
  IMD: {
    WEATHER_FORECAST: '/weather-forecast',
    AGRO_ADVISORY: '/agro-advisory',
    CLIMATE_DATA: '/climate-data',
  },
  PLANT_DISEASE: {
    IDENTIFY: '/identify',
    DISEASES: '/diseases',
  },
  SOIL: {
    PROPERTIES: '/properties/query',
    HEALTH_CARD: '/health-card',
    RECOMMENDATIONS: '/recommendations',
  },
  FERTILIZER: {
    SEARCH: '/search',
    RECOMMENDATIONS: '/recommendations',
    PRICES: '/prices',
  },
  LOCATION: {
    GEOCODE: '/json',
  },
  MARKET: {
    PRICES: '/prices',
    MANDIS: '/mandis',
    COMMODITIES: '/commodities',
  },
};

// Rate limiting and request configuration
export const REQUEST_CONFIG = {
  timeout: 15000,
  retries: 3,
  rateLimit: {
    requests: 60,
    window: 60000, // 1 minute
  },
};

// Indian States and Union Territories
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Dadra and Nagar Haveli',
  'Daman and Diu', 'Lakshadweep', 'Puducherry', 'Andaman and Nicobar Islands'
];

// Indian Agricultural Seasons
export const INDIAN_SEASONS = {
  KHARIF: {
    name: 'Kharif',
    months: ['June', 'July', 'August', 'September', 'October'],
    crops: ['Rice', 'Maize', 'Cotton', 'Soybean', 'Groundnut', 'Pulses']
  },
  RABI: {
    name: 'Rabi',
    months: ['October', 'November', 'December', 'January', 'February', 'March'],
    crops: ['Wheat', 'Barley', 'Mustard', 'Peas', 'Gram', 'Lentil']
  },
  ZAID: {
    name: 'Zaid',
    months: ['March', 'April', 'May', 'June'],
    crops: ['Cucumber', 'Watermelon', 'Muskmelon', 'Bitter Gourd', 'Pumpkin']
  }
};