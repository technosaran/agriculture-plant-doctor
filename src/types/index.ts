// Core data types
export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  pressure: number;
  description: string;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: string;
  temp: {
    min: number;
    max: number;
  };
  humidity: number;
  rainfall: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
}

export interface PlantDisease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  causes: string[];
  treatment: string[];
  prevention: string[];
  severity: 'low' | 'medium' | 'high';
  affectedCrops: string[];
}

export interface CropRecommendation {
  id: string;
  name: string;
  scientificName: string;
  season: string;
  soilType: string[];
  climateRequirements: {
    temperature: { min: number; max: number };
    rainfall: { min: number; max: number };
    humidity: { min: number; max: number };
  };
  growthPeriod: number;
  expectedYield: string;
  marketPrice: number;
  profitability: 'low' | 'medium' | 'high';
}

export interface Fertilizer {
  id: string;
  name: string;
  type: 'organic' | 'inorganic' | 'bio';
  npkRatio: string;
  application: string;
  benefits: string[];
  suitableCrops: string[];
  price?: number;
}

export interface SoilData {
  type: string;
  ph: number;
  fertility: 'low' | 'medium' | 'high';
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

// API Response types
export interface KVKCropResponse {
  recommendations?: KVKCrop[];
  crops?: KVKCrop[];
}

export interface KVKCrop {
  crop_name: string;
  scientific_name: string;
  season: string;
  suitable_soil_types?: string[];
  min_temp?: number;
  max_temp?: number;
  min_rainfall?: number;
  max_rainfall?: number;
  min_humidity?: number;
  max_humidity?: number;
  growth_period?: number;
  expected_yield?: string;
  market_price?: number;
  expected_yield_value?: number;
  input_cost?: number;
  crop_id?: string;
}

export interface PlantNetResponse {
  results?: PlantNetResult[];
}

export interface PlantNetResult {
  species?: {
    scientificNameWithoutAuthor?: string;
    commonNames?: string[];
  };
  score?: number;
}

export interface DiseaseDatabaseResponse {
  diseases?: DiseaseData[];
}

export interface DiseaseData {
  name: string;
  description: string;
  symptoms?: string[];
  causes?: string[];
  treatment?: string[];
  prevention?: string[];
  severity?: string;
  affected_crops?: string[];
  disease_id?: string;
}

export interface FertilizerResponse {
  recommendations?: FertilizerData[];
  fertilizers?: FertilizerData[];
  prices?: FertilizerPrice[];
  dealers?: FertilizerDealer[];
}

export interface FertilizerData {
  name: string;
  type?: string;
  npk_ratio?: string;
  application_method?: string;
  benefits?: string[];
  suitable_crops?: string[];
  price?: number;
  fertilizer_id?: string;
}

export interface FertilizerPrice {
  name: string;
  price: number;
  location: string;
}

export interface FertilizerDealer {
  name: string;
  address: string;
  phone: string;
  distance: number;
}

export interface MarketPriceResponse {
  prices?: MarketPrice[];
}

export interface MarketPrice {
  commodity: string;
  modal_price: number;
  location: string;
  date: string;
}

export interface IMDWeatherResponse {
  current?: {
    temp?: number;
    humidity?: number;
    rainfall?: number;
    wind_speed?: number;
    pressure?: number;
    description?: string;
  };
  forecast?: IMDWeatherForecast[];
}

export interface IMDWeatherForecast {
  date: string;
  temp_min: number;
  temp_max: number;
  humidity: number;
  rainfall: number;
}

export interface OpenWeatherMapResponse {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  weather: Array<{
    description: string;
  }>;
}

export interface OpenWeatherMapForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    rain?: {
      '3h': number;
    };
  }>;
}

export interface SoilHealthResponse {
  properties?: {
    ph: number;
    fertility: string;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  recommendations?: string[];
}

export interface AgroAdvisoryResponse {
  advisory?: string;
}

export interface ClimateDataResponse {
  temperature?: {
    average: number;
    min: number;
    max: number;
  };
  rainfall?: {
    annual: number;
    seasonal: Record<string, number>;
  };
  humidity?: {
    average: number;
    seasonal: Record<string, number>;
  };
}