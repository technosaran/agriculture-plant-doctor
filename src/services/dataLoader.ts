// Advanced Dataset Loader for ML Models
export interface PlantDiseaseData {
  id: string;
  name: string;
  scientific_name: string;
  affected_crops: string[];
  symptoms: string[];
  causes: string[];
  treatment: string[];
  prevention: string[];
  severity_factors: {
    temperature_range: [number, number];
    humidity_threshold: number;
    spread_rate: 'low' | 'medium' | 'high';
  };
  images?: string[];
}

export interface CropData {
  id: string;
  name: string;
  scientific_name: string;
  variety: string;
  season: string;
  climate_requirements: {
    temperature: { min: number; max: number; optimal: number };
    rainfall: { min: number; max: number; optimal: number };
    humidity: { min: number; max: number; optimal: number };
  };
  soil_requirements: {
    ph: { min: number; max: number; optimal: number };
    type: string[];
    drainage: string;
    organic_matter: string;
  };
  growth_data: {
    growth_period: number;
    stages: Array<{
      name: string;
      days: number;
      water_need: 'low' | 'medium' | 'high';
    }>;
  };
  yield_data: {
    average_yield: number;
    max_yield: number;
    unit: string;
    factors: {
      irrigation: number;
      fertilizer: number;
      variety: number;
      weather: number;
    };
  };
  market_data: {
    price_range: [number, number];
    demand: 'low' | 'medium' | 'high';
    export_potential: boolean;
    storage_life: number;
  };
}

export interface WeatherData {
  regions: Array<{
    id: string;
    name: string;
    coordinates: { latitude: number; longitude: number };
    climate_zone: string;
    historical_data: Array<{
      year: number;
      monthly_data: Array<{
        month: number;
        temperature: { min: number; max: number; avg: number };
        rainfall: number;
        humidity: number;
        wind_speed: number;
        sunshine_hours: number;
      }>;
    }>;
    seasonal_patterns: {
      monsoon: {
        start_date: string;
        end_date: string;
        total_rainfall: number;
        rainy_days: number;
      };
      winter: {
        start_date: string;
        end_date: string;
        min_temperature: number;
        frost_days: number;
      };
    };
  }>;
}

export interface FertilizerData {
  fertilizers: Array<{
    id: string;
    name: string;
    type: string;
    composition: {
      N: number;
      P: number;
      K: number;
      S: number;
      secondary_nutrients: Record<string, number>;
    };
    physical_properties: {
      form: string;
      color: string;
      solubility: string;
      ph_effect: string;
    };
    application_data: {
      method: string[];
      timing: string[];
      rate_per_hectare: Record<string, number>;
    };
    economic_data: {
      price_per_50kg: number;
      subsidy_rate: number;
      availability: string;
    };
    compatibility: {
      mix_with: string[];
      avoid_with: string[];
      storage_requirements: string;
    };
  }>;
}

export interface SoilData {
  soil_types: Array<{
    id: string;
    name: string;
    regions: string[];
    characteristics: {
      texture: string;
      drainage: string;
      fertility: string;
      ph_range: [number, number];
      organic_matter: string;
    };
    nutrient_profile: {
      nitrogen: string;
      phosphorus: string;
      potassium: string;
      micronutrients: Record<string, string>;
    };
    suitable_crops: Array<{
      crop: string;
      suitability: number;
    }>;
    management_practices: {
      irrigation: string;
      fertilization: string;
      amendments: string;
    };
  }>;
}

export interface MarketData {
  commodities: Array<{
    id: string;
    name: string;
    variety: string;
    price_history: Array<{
      date: string;
      price: number;
      market: string;
      quality: string;
    }>;
    demand_supply: {
      production: number;
      consumption: number;
      export: number;
      import: number;
      unit: string;
    };
    seasonal_trends: {
      harvest_months: number[];
      price_peak_months: number[];
      volatility_index: number;
    };
  }>;
}

export interface ResearchData {
  experiments: Array<{
    id: string;
    title: string;
    location: string;
    duration: string;
    treatments: Array<{
      treatment_id: string;
      fertilizer_combination: string;
      yield: number;
      cost: number;
      profit: number;
    }>;
    conclusions: string[];
  }>;
}

class DataLoader {
  private static instance: DataLoader;
  private cache: Map<string, any> = new Map();

  static getInstance(): DataLoader {
    if (!DataLoader.instance) {
      DataLoader.instance = new DataLoader();
    }
    return DataLoader.instance;
  }

  async loadPlantDiseases(): Promise<PlantDiseaseData[]> {
    if (this.cache.has('plant_diseases')) {
      return this.cache.get('plant_diseases');
    }

    try {
      const response = await fetch('/data/plant_diseases.json');
      if (!response.ok) {
        throw new Error('Plant diseases dataset not found');
      }
      const data = await response.json();
      this.cache.set('plant_diseases', data.diseases);
      return data.diseases;
    } catch (error) {
      console.warn('Using fallback plant disease data');
      return this.getFallbackPlantDiseases();
    }
  }

  async loadCrops(): Promise<CropData[]> {
    if (this.cache.has('crops')) {
      return this.cache.get('crops');
    }

    try {
      const response = await fetch('/data/crops.json');
      if (!response.ok) {
        throw new Error('Crops dataset not found');
      }
      const data = await response.json();
      this.cache.set('crops', data.crops);
      return data.crops;
    } catch (error) {
      console.warn('Using fallback crop data');
      return this.getFallbackCrops();
    }
  }

  async loadWeatherPatterns(): Promise<WeatherData> {
    if (this.cache.has('weather_patterns')) {
      return this.cache.get('weather_patterns');
    }

    try {
      const response = await fetch('/data/weather_patterns.json');
      if (!response.ok) {
        throw new Error('Weather patterns dataset not found');
      }
      const data = await response.json();
      this.cache.set('weather_patterns', data);
      return data;
    } catch (error) {
      console.warn('Using fallback weather data');
      return this.getFallbackWeatherData();
    }
  }

  async loadFertilizers(): Promise<FertilizerData> {
    if (this.cache.has('fertilizers')) {
      return this.cache.get('fertilizers');
    }

    try {
      const response = await fetch('/data/fertilizers.json');
      if (!response.ok) {
        throw new Error('Fertilizers dataset not found');
      }
      const data = await response.json();
      this.cache.set('fertilizers', data);
      return data;
    } catch (error) {
      console.warn('Using fallback fertilizer data');
      return this.getFallbackFertilizerData();
    }
  }

  async loadSoilData(): Promise<SoilData> {
    if (this.cache.has('soil_data')) {
      return this.cache.get('soil_data');
    }

    try {
      const response = await fetch('/data/soil_data.json');
      if (!response.ok) {
        throw new Error('Soil data dataset not found');
      }
      const data = await response.json();
      this.cache.set('soil_data', data);
      return data;
    } catch (error) {
      console.warn('Using fallback soil data');
      return this.getFallbackSoilData();
    }
  }

  async loadMarketData(): Promise<MarketData> {
    if (this.cache.has('market_data')) {
      return this.cache.get('market_data');
    }

    try {
      const response = await fetch('/data/market_data.json');
      if (!response.ok) {
        throw new Error('Market data dataset not found');
      }
      const data = await response.json();
      this.cache.set('market_data', data);
      return data;
    } catch (error) {
      console.warn('Using fallback market data');
      return this.getFallbackMarketData();
    }
  }

  async loadResearchData(): Promise<ResearchData> {
    if (this.cache.has('research_data')) {
      return this.cache.get('research_data');
    }

    try {
      const response = await fetch('/data/research_data.json');
      if (!response.ok) {
        throw new Error('Research data dataset not found');
      }
      const data = await response.json();
      this.cache.set('research_data', data);
      return data;
    } catch (error) {
      console.warn('Using fallback research data');
      return this.getFallbackResearchData();
    }
  }

  // Fallback data methods (minimal data for demo purposes)
  private getFallbackPlantDiseases(): PlantDiseaseData[] {
    return [
      {
        id: 'disease_001',
        name: 'Late Blight',
        scientific_name: 'Phytophthora infestans',
        affected_crops: ['Potato', 'Tomato'],
        symptoms: ['Dark brown spots on leaves', 'White fuzzy growth on leaf undersides'],
        causes: ['High humidity', 'Cool temperatures'],
        treatment: ['Apply copper-based fungicide', 'Remove affected plant parts'],
        prevention: ['Maintain proper plant spacing', 'Ensure good drainage'],
        severity_factors: {
          temperature_range: [15, 25],
          humidity_threshold: 85,
          spread_rate: 'high'
        }
      }
    ];
  }

  private getFallbackCrops(): CropData[] {
    return [
      {
        id: 'crop_001',
        name: 'Basmati Rice',
        scientific_name: 'Oryza sativa',
        variety: 'Basmati 370',
        season: 'Kharif',
        climate_requirements: {
          temperature: { min: 20, max: 35, optimal: 28 },
          rainfall: { min: 1000, max: 2000, optimal: 1200 },
          humidity: { min: 70, max: 90, optimal: 80 }
        },
        soil_requirements: {
          ph: { min: 5.5, max: 7.0, optimal: 6.5 },
          type: ['Clay', 'Loamy', 'Alluvial'],
          drainage: 'Poor to moderate',
          organic_matter: '>2%'
        },
        growth_data: {
          growth_period: 120,
          stages: [
            { name: 'Germination', days: 7, water_need: 'high' },
            { name: 'Tillering', days: 30, water_need: 'high' }
          ]
        },
        yield_data: {
          average_yield: 4.5,
          max_yield: 8.0,
          unit: 'tons/hectare',
          factors: { irrigation: 0.3, fertilizer: 0.25, variety: 0.2, weather: 0.25 }
        },
        market_data: {
          price_range: [2200, 2800],
          demand: 'high',
          export_potential: true,
          storage_life: 12
        }
      }
    ];
  }

  private getFallbackWeatherData(): WeatherData {
    return {
      regions: [
        {
          id: 'region_001',
          name: 'Punjab Plains',
          coordinates: { latitude: 30.7333, longitude: 76.7794 },
          climate_zone: 'Subtropical',
          historical_data: [],
          seasonal_patterns: {
            monsoon: {
              start_date: '2023-06-15',
              end_date: '2023-09-30',
              total_rainfall: 800,
              rainy_days: 45
            },
            winter: {
              start_date: '2023-12-01',
              end_date: '2024-02-28',
              min_temperature: 2,
              frost_days: 15
            }
          }
        }
      ]
    };
  }

  private getFallbackFertilizerData(): FertilizerData {
    return {
      fertilizers: [
        {
          id: 'fert_001',
          name: 'Urea',
          type: 'Nitrogen',
          composition: { N: 46, P: 0, K: 0, S: 0, secondary_nutrients: {} },
          physical_properties: {
            form: 'Granular',
            color: 'White',
            solubility: 'High',
            ph_effect: 'Acidifying'
          },
          application_data: {
            method: ['Broadcasting', 'Side dressing'],
            timing: ['Basal', 'Top dressing'],
            rate_per_hectare: { rice: 150, wheat: 120, maize: 180 }
          },
          economic_data: {
            price_per_50kg: 266,
            subsidy_rate: 82,
            availability: 'High'
          },
          compatibility: {
            mix_with: ['DAP', 'MOP'],
            avoid_with: ['Lime', 'SSP'],
            storage_requirements: 'Dry, cool place'
          }
        }
      ]
    };
  }

  private getFallbackSoilData(): SoilData {
    return {
      soil_types: [
        {
          id: 'soil_001',
          name: 'Alluvial Soil',
          regions: ['Indo-Gangetic Plains'],
          characteristics: {
            texture: 'Loamy to clayey',
            drainage: 'Good to moderate',
            fertility: 'High',
            ph_range: [6.0, 8.0],
            organic_matter: '2-4%'
          },
          nutrient_profile: {
            nitrogen: 'Medium',
            phosphorus: 'Medium to high',
            potassium: 'High',
            micronutrients: { iron: 'Adequate', zinc: 'Deficient' }
          },
          suitable_crops: [
            { crop: 'Rice', suitability: 95 },
            { crop: 'Wheat', suitability: 90 }
          ],
          management_practices: {
            irrigation: 'Regular flooding for rice',
            fertilization: 'Balanced NPK with micronutrients',
            amendments: 'Organic matter addition'
          }
        }
      ]
    };
  }

  private getFallbackMarketData(): MarketData {
    return {
      commodities: [
        {
          id: 'commodity_001',
          name: 'Rice',
          variety: 'Basmati',
          price_history: [],
          demand_supply: {
            production: 120000,
            consumption: 115000,
            export: 8000,
            import: 500,
            unit: 'tons'
          },
          seasonal_trends: {
            harvest_months: [10, 11, 12],
            price_peak_months: [6, 7, 8],
            volatility_index: 0.15
          }
        }
      ]
    };
  }

  private getFallbackResearchData(): ResearchData {
    return {
      experiments: [
        {
          id: 'exp_001',
          title: 'Effect of NPK on Rice Yield',
          location: 'IARI, New Delhi',
          duration: '2022-2023',
          treatments: [
            {
              treatment_id: 'T1',
              fertilizer_combination: '120-60-40 NPK',
              yield: 6.2,
              cost: 45000,
              profit: 78000
            }
          ],
          conclusions: ['Optimal NPK ratio increases yield by 25%']
        }
      ]
    };
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStatus(): Record<string, boolean> {
    return {
      plant_diseases: this.cache.has('plant_diseases'),
      crops: this.cache.has('crops'),
      weather_patterns: this.cache.has('weather_patterns'),
      fertilizers: this.cache.has('fertilizers'),
      soil_data: this.cache.has('soil_data'),
      market_data: this.cache.has('market_data'),
      research_data: this.cache.has('research_data')
    };
  }
}

export const dataLoader = DataLoader.getInstance();