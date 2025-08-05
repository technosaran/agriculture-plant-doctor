import { CropRecommendation, WeatherData, SoilData, KVKCropResponse, KVKCrop, MarketPriceResponse } from '@/types';
import { API_CONFIG, API_ENDPOINTS, INDIAN_SEASONS } from '@/config/api';

class CropService {
  private kvkBaseUrl = API_CONFIG.KVK_BASE_URL;
  private kvkApiKey = API_CONFIG.KVK_API_KEY;
  private marketBaseUrl = API_CONFIG.MARKET_API_BASE_URL;
  private marketApiKey = API_CONFIG.MARKET_API_KEY;

  async getCropRecommendations(
    weatherData: WeatherData | null,
    soilData?: SoilData,
    location?: { latitude: number; longitude: number }
  ): Promise<CropRecommendation[]> {
    try {
      if (!this.kvkApiKey) {
        throw new Error('KVK API key not configured. Please add NEXT_PUBLIC_KVK_API_KEY to your environment variables.');
      }

      const params = new URLSearchParams({
        api_key: this.kvkApiKey,
        ...(location && { lat: location.latitude.toString(), lon: location.longitude.toString() }),
        ...(weatherData && { 
          temperature: weatherData.temperature.toString(),
          humidity: weatherData.humidity.toString(),
          rainfall: weatherData.rainfall.toString()
        }),
        ...(soilData && {
          ph: soilData.ph.toString(),
          fertility: soilData.fertility
        })
      });

      const response = await fetch(
        `${this.kvkBaseUrl}${API_ENDPOINTS.KVK.CROP_RECOMMENDATIONS}?${params}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch crop recommendations from KVK API');
      }

      const data: KVKCropResponse = await response.json();
      
      // Transform KVK API response to our format with parallel market price fetching
      const cropPromises = data.recommendations?.map(async (crop: KVKCrop, index: number) => {
        const marketPrice = await this.getMarketPrice(crop.crop_name);
        return {
          id: `crop_${index}`,
          name: crop.crop_name,
          scientificName: crop.scientific_name,
          season: this.getIndianSeason(crop.season),
          soilType: crop.suitable_soil_types || ['Loamy', 'Well-drained'],
          climateRequirements: {
            temperature: { min: crop.min_temp || 15, max: crop.max_temp || 35 },
            rainfall: { min: crop.min_rainfall || 400, max: crop.max_rainfall || 1200 },
            humidity: { min: crop.min_humidity || 40, max: crop.max_humidity || 80 },
          },
          growthPeriod: crop.growth_period || 90,
          expectedYield: crop.expected_yield || 'Variable based on conditions',
          marketPrice: marketPrice,
          profitability: this.calculateProfitability(crop),
        };
      }) || [];

      return await Promise.all(cropPromises);

    } catch (error) {
      console.error('Crop recommendation error:', error);
      throw new Error('Unable to fetch crop recommendations. Please check your API configuration.');
    }
  }

  async getSeasonalCrops(season: string, location?: { latitude: number; longitude: number }): Promise<CropRecommendation[]> {
    try {
      if (!this.kvkApiKey) {
        throw new Error('KVK API key not configured');
      }

      const params = new URLSearchParams({
        api_key: this.kvkApiKey,
        season: season.toLowerCase(),
        ...(location && { lat: location.latitude.toString(), lon: location.longitude.toString() })
      });

      const response = await fetch(
        `${this.kvkBaseUrl}${API_ENDPOINTS.KVK.SEASONAL_CROPS}?${params}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch seasonal crops from KVK API');
      }

      const data: KVKCropResponse = await response.json();
      
      // Transform with parallel market price fetching
      const cropPromises = data.crops?.map(async (crop: KVKCrop, index: number) => {
        const marketPrice = await this.getMarketPrice(crop.crop_name);
        return {
          id: `seasonal_${index}`,
          name: crop.crop_name,
          scientificName: crop.scientific_name,
          season: this.getIndianSeason(crop.season),
          soilType: crop.suitable_soil_types || ['Loamy', 'Well-drained'],
          climateRequirements: {
            temperature: { min: crop.min_temp || 15, max: crop.max_temp || 35 },
            rainfall: { min: crop.min_rainfall || 400, max: crop.max_rainfall || 1200 },
            humidity: { min: crop.min_humidity || 40, max: crop.max_humidity || 80 },
          },
          growthPeriod: crop.growth_period || 90,
          expectedYield: crop.expected_yield || 'Variable based on conditions',
          marketPrice: marketPrice,
          profitability: this.calculateProfitability(crop),
        };
      }) || [];

      return await Promise.all(cropPromises);

    } catch (error) {
      console.error('Seasonal crops error:', error);
      throw new Error('Unable to fetch seasonal crops. Please check your API configuration.');
    }
  }

  async getSoilAdvisory(location: { latitude: number; longitude: number }): Promise<unknown> {
    try {
      if (!this.kvkApiKey) {
        throw new Error('KVK API key not configured');
      }

      const params = new URLSearchParams({
        api_key: this.kvkApiKey,
        lat: location.latitude.toString(),
        lon: location.longitude.toString()
      });

      const response = await fetch(
        `${this.kvkBaseUrl}${API_ENDPOINTS.KVK.SOIL_ADVISORY}?${params}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch soil advisory from KVK API');
      }

      return await response.json();

    } catch (error) {
      console.error('Soil advisory error:', error);
      throw new Error('Unable to fetch soil advisory. Please check your API configuration.');
    }
  }

  private async getMarketPrice(cropName: string): Promise<number> {
    try {
      if (!this.marketApiKey) {
        return 0; // Return 0 if no market API key
      }

      const params = new URLSearchParams({
        api_key: this.marketApiKey,
        commodity: cropName,
        limit: '1'
      });

      const response = await fetch(
        `${this.marketBaseUrl}${API_ENDPOINTS.MARKET.PRICES}?${params}`
      );

      if (response.ok) {
        const data: MarketPriceResponse = await response.json();
        return data.prices?.[0]?.modal_price || 0;
      }

      return 0;
    } catch (error) {
      console.error('Market price error:', error);
      return 0;
    }
  }

  private getIndianSeason(season: string): string {
    const seasonLower = season.toLowerCase();
    if (seasonLower.includes('kharif')) return 'Kharif (June-October)';
    if (seasonLower.includes('rabi')) return 'Rabi (October-March)';
    if (seasonLower.includes('zaid')) return 'Zaid (March-June)';
    return season;
  }

  private calculateProfitability(crop: KVKCrop): 'low' | 'medium' | 'high' {
    // Calculate profitability based on market price, yield, and input costs
    const marketPrice = crop.market_price || 0;
    const expectedYield = crop.expected_yield_value || 1;
    const inputCost = crop.input_cost || 0;

    const potentialRevenue = marketPrice * expectedYield;
    const profit = potentialRevenue - inputCost;
    const profitMargin = inputCost > 0 ? (profit / inputCost) * 100 : 0;

    if (profitMargin > 50) return 'high';
    if (profitMargin > 20) return 'medium';
    return 'low';
  }

  getCurrentSeason(): string {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    
    if (currentMonth >= 6 && currentMonth <= 10) return 'Kharif';
    if (currentMonth >= 10 || currentMonth <= 3) return 'Rabi';
    return 'Zaid';
  }

  getSeasonCrops(season: string): string[] {
    switch (season.toLowerCase()) {
      case 'kharif':
        return INDIAN_SEASONS.KHARIF.crops;
      case 'rabi':
        return INDIAN_SEASONS.RABI.crops;
      case 'zaid':
        return INDIAN_SEASONS.ZAID.crops;
      default:
        return [];
    }
  }

  async getCropDetails(cropId: string): Promise<CropRecommendation | null> {
    try {
      if (!this.kvkApiKey) {
        throw new Error('KVK API key not configured');
      }

      const params = new URLSearchParams({
        api_key: this.kvkApiKey,
        crop_id: cropId
      });

      const response = await fetch(
        `${this.kvkBaseUrl}/crop-details?${params}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch crop details from KVK API');
      }

      const crop: KVKCrop = await response.json();
      const marketPrice = await this.getMarketPrice(crop.crop_name);
      
      return {
        id: crop.crop_id || cropId,
        name: crop.crop_name,
        scientificName: crop.scientific_name,
        season: this.getIndianSeason(crop.season),
        soilType: crop.suitable_soil_types || ['Loamy', 'Well-drained'],
        climateRequirements: {
          temperature: { min: crop.min_temp || 15, max: crop.max_temp || 35 },
          rainfall: { min: crop.min_rainfall || 400, max: crop.max_rainfall || 1200 },
          humidity: { min: crop.min_humidity || 40, max: crop.max_humidity || 80 },
        },
        growthPeriod: crop.growth_period || 90,
        expectedYield: crop.expected_yield || 'Variable based on conditions',
        marketPrice: marketPrice,
        profitability: this.calculateProfitability(crop),
      };

    } catch (error) {
      console.error('Error fetching crop details:', error);
      return null;
    }
  }
}

export const cropService = new CropService(); 