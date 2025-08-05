// Core types for the agriculture system
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
  growthPeriod: number; // in days
  expectedYield: string;
  marketPrice: number;
  profitability: 'low' | 'medium' | 'high';
}

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  pressure: number;
  description: string;
  forecast: {
    date: string;
    temp: { min: number; max: number };
    humidity: number;
    rainfall: number;
  }[];
}

export interface SoilData {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  moisture: number;
  type: string;
  fertility: 'low' | 'medium' | 'high';
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
}

export interface ApiConfig {
  weatherApiKey: string;
  plantDiseaseApiKey: string;
  soilApiKey: string;
  cropApiKey: string;
  fertilizerApiKey: string;
}