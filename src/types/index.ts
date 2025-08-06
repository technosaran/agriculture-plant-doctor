// ML-focused data types for agriculture application

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  timestamp: string;
}

export interface WeatherForecast {
  date: string;
  weather: WeatherData;
  high: number;
  low: number;
  description: string;
  icon: string;
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
  scientificName?: string;
  confidence?: number;
  environmentalFactors?: {
    temperatureRange: [number, number];
    humidityThreshold: number;
    spreadRate: 'low' | 'medium' | 'high';
  };
}

export interface CropRecommendation {
  id: string;
  name: string;
  scientificName: string;
  variety?: string;
  season: string;
  soilType: string[];
  climateRequirements: {
    temperature: { min: number; max: number; optimal?: number };
    rainfall: { min: number; max: number; optimal?: number };
    humidity: { min: number; max: number; optimal?: number };
  };
  growthPeriod: number;
  expectedYield: string;
  marketPrice: number;
  profitability: 'low' | 'medium' | 'high';
  suitabilityScore?: number;
  growthStages?: Array<{
    name: string;
    days: number;
    water_need: 'low' | 'medium' | 'high';
  }>;
  yieldFactors?: {
    irrigation: number;
    fertilizer: number;
    variety: number;
    weather: number;
  };
  soilRequirements?: {
    ph: { min: number; max: number; optimal: number };
    type: string[];
    drainage: string;
    organic_matter: string;
  };
  marketData?: {
    price_range: [number, number];
    demand: 'low' | 'medium' | 'high';
    export_potential: boolean;
    storage_life: number;
  };
  marketDemand?: 'low' | 'medium' | 'high';
  exportPotential?: boolean;
}

export interface FertilizerRecommendation {
  id: string;
  name: string;
  description: string;
  fertilizers: Array<{
    name: string;
    quantity: string;
    timing: string;
    method: string;
    cost: number;
  }>;
  totalCost: number;
  expectedYieldIncrease: string;
  soilHealthImpact: string;
  applicationSchedule: string[];
  benefits: string[];
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
  ph: number;
  fertility: 'low' | 'medium' | 'high';
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}