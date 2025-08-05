import { CropRecommendation, WeatherData, SoilData } from '@/types';

class CropService {
  private mockCrops: CropRecommendation[] = [
    {
      id: 'crop_1',
      name: 'Tomato',
      scientificName: 'Solanum lycopersicum',
      season: 'Spring/Summer',
      soilType: ['Loamy', 'Sandy loam', 'Well-drained'],
      climateRequirements: {
        temperature: { min: 18, max: 30 },
        rainfall: { min: 500, max: 1000 },
        humidity: { min: 50, max: 80 },
      },
      growthPeriod: 70,
      expectedYield: '15-25 kg per plant',
      marketPrice: 2.5,
      profitability: 'high',
    },
    {
      id: 'crop_2',
      name: 'Cucumber',
      scientificName: 'Cucumis sativus',
      season: 'Spring/Summer',
      soilType: ['Sandy loam', 'Loamy', 'Well-drained'],
      climateRequirements: {
        temperature: { min: 20, max: 35 },
        rainfall: { min: 600, max: 1200 },
        humidity: { min: 60, max: 85 },
      },
      growthPeriod: 55,
      expectedYield: '8-12 kg per plant',
      marketPrice: 1.8,
      profitability: 'medium',
    },
    {
      id: 'crop_3',
      name: 'Spinach',
      scientificName: 'Spinacia oleracea',
      season: 'Fall/Winter',
      soilType: ['Loamy', 'Clay loam', 'Rich in organic matter'],
      climateRequirements: {
        temperature: { min: 10, max: 25 },
        rainfall: { min: 400, max: 800 },
        humidity: { min: 40, max: 70 },
      },
      growthPeriod: 45,
      expectedYield: '2-3 kg per square meter',
      marketPrice: 3.2,
      profitability: 'high',
    },
    {
      id: 'crop_4',
      name: 'Carrot',
      scientificName: 'Daucus carota',
      season: 'Spring/Fall',
      soilType: ['Sandy', 'Loamy', 'Well-drained'],
      climateRequirements: {
        temperature: { min: 15, max: 25 },
        rainfall: { min: 500, max: 900 },
        humidity: { min: 50, max: 75 },
      },
      growthPeriod: 75,
      expectedYield: '3-5 kg per square meter',
      marketPrice: 1.5,
      profitability: 'medium',
    },
    {
      id: 'crop_5',
      name: 'Bell Pepper',
      scientificName: 'Capsicum annuum',
      season: 'Spring/Summer',
      soilType: ['Loamy', 'Sandy loam', 'Well-drained'],
      climateRequirements: {
        temperature: { min: 20, max: 30 },
        rainfall: { min: 600, max: 1000 },
        humidity: { min: 55, max: 80 },
      },
      growthPeriod: 80,
      expectedYield: '5-8 kg per plant',
      marketPrice: 4.0,
      profitability: 'high',
    },
    {
      id: 'crop_6',
      name: 'Lettuce',
      scientificName: 'Lactuca sativa',
      season: 'Spring/Fall',
      soilType: ['Loamy', 'Rich in organic matter', 'Well-drained'],
      climateRequirements: {
        temperature: { min: 12, max: 22 },
        rainfall: { min: 400, max: 700 },
        humidity: { min: 45, max: 70 },
      },
      growthPeriod: 60,
      expectedYield: '1-2 kg per square meter',
      marketPrice: 2.8,
      profitability: 'medium',
    },
  ];

  async getCropRecommendations(
    weatherData: WeatherData | null,
    soilData?: SoilData
  ): Promise<CropRecommendation[]> {
    try {
      // Filter crops based on current weather conditions
      let recommendedCrops = this.mockCrops;

      if (weatherData) {
        recommendedCrops = this.filterCropsByWeather(recommendedCrops, weatherData);
      }

      if (soilData) {
        recommendedCrops = this.filterCropsBySoil(recommendedCrops, soilData);
      }

      // Sort by profitability and market price
      recommendedCrops.sort((a, b) => {
        const aScore = this.getProfitabilityScore(a);
        const bScore = this.getProfitabilityScore(b);
        return bScore - aScore;
      });

      return recommendedCrops.slice(0, 6); // Return top 6 recommendations
    } catch (error) {
      console.error('Crop recommendation error:', error);
      return this.mockCrops.slice(0, 3); // Return fallback recommendations
    }
  }

  private filterCropsByWeather(
    crops: CropRecommendation[],
    weather: WeatherData
  ): CropRecommendation[] {
    return crops.filter((crop) => {
      const { temperature, humidity } = weather;
      const { climateRequirements } = crop;

      const tempInRange = 
        temperature >= climateRequirements.temperature.min &&
        temperature <= climateRequirements.temperature.max;

      const humidityInRange =
        humidity >= climateRequirements.humidity.min &&
        humidity <= climateRequirements.humidity.max;

      return tempInRange && humidityInRange;
    });
  }

  private filterCropsBySoil(
    crops: CropRecommendation[],
    soil: SoilData
  ): CropRecommendation[] {
    return crops.filter((crop) => {
      // Simple soil type matching
      const soilTypeMatch = crop.soilType.some(type => 
        soil.type.toLowerCase().includes(type.toLowerCase())
      );

      // pH compatibility (most crops prefer 6.0-7.0)
      const phCompatible = soil.ph >= 5.5 && soil.ph <= 7.5;

      return soilTypeMatch && phCompatible;
    });
  }

  private getProfitabilityScore(crop: CropRecommendation): number {
    const profitabilityMultiplier = {
      high: 1.5,
      medium: 1.0,
      low: 0.5,
    };

    return crop.marketPrice * profitabilityMultiplier[crop.profitability];
  }

  async getCropDetails(cropId: string): Promise<CropRecommendation | null> {
    try {
      const crop = this.mockCrops.find(c => c.id === cropId);
      return crop || null;
    } catch (error) {
      console.error('Error fetching crop details:', error);
      return null;
    }
  }

  getSeasonalCrops(season: string): CropRecommendation[] {
    return this.mockCrops.filter(crop => 
      crop.season.toLowerCase().includes(season.toLowerCase())
    );
  }
}

export const cropService = new CropService(); 