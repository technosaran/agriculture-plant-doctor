import { Fertilizer, CropRecommendation, SoilData, FertilizerResponse, FertilizerData, SoilHealthResponse } from '@/types';
import { API_CONFIG, API_ENDPOINTS } from '@/config/api';

class FertilizerService {
  private fertilizerBaseUrl = API_CONFIG.FERTILIZER_API_BASE_URL;
  private fertilizerApiKey = API_CONFIG.FERTILIZER_API_KEY;
  private soilBaseUrl = API_CONFIG.SOIL_API_BASE_URL;
  private soilApiKey = API_CONFIG.SOIL_API_KEY;

  async getFertilizerRecommendations(
    crop?: CropRecommendation,
    soilData?: SoilData,
    growthStage?: 'seedling' | 'vegetative' | 'flowering' | 'fruiting',
    location?: { latitude: number; longitude: number }
  ): Promise<Fertilizer[]> {
    try {
      if (!this.fertilizerApiKey) {
        throw new Error('Fertilizer API key not configured. Please add NEXT_PUBLIC_FERTILIZER_API_KEY to your environment variables.');
      }

      const params = new URLSearchParams({
        api_key: this.fertilizerApiKey,
        ...(crop && { crop_name: crop.name }),
        ...(soilData && {
          ph: soilData.ph.toString(),
          fertility: soilData.fertility,
          nitrogen: soilData.nitrogen.toString(),
          phosphorus: soilData.phosphorus.toString(),
          potassium: soilData.potassium.toString()
        }),
        ...(growthStage && { growth_stage: growthStage }),
        ...(location && { 
          lat: location.latitude.toString(), 
          lon: location.longitude.toString() 
        })
      });

      const response = await fetch(
        `${this.fertilizerBaseUrl}${API_ENDPOINTS.FERTILIZER.RECOMMENDATIONS}?${params}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch fertilizer recommendations from API');
      }

      const data: FertilizerResponse = await response.json();
      
      // Transform API response to our format
      return data.recommendations?.map((fertilizer: FertilizerData, index: number) => ({
        id: `fert_${index}`,
        name: fertilizer.name,
        type: (fertilizer.type as 'organic' | 'inorganic' | 'bio') || 'inorganic',
        npkRatio: fertilizer.npk_ratio || '0-0-0',
        application: fertilizer.application_method || 'Apply as directed',
        benefits: fertilizer.benefits || ['Provides essential nutrients'],
        suitableCrops: fertilizer.suitable_crops || ['All crops'],
        price: fertilizer.price || 0,
      })) || [];

    } catch (error) {
      console.error('Fertilizer recommendation error:', error);
      throw new Error('Unable to fetch fertilizer recommendations. Please check your API configuration.');
    }
  }

  async getFertilizerPrices(location?: { latitude: number; longitude: number }): Promise<unknown[]> {
    try {
      if (!this.fertilizerApiKey) {
        throw new Error('Fertilizer API key not configured');
      }

      const params = new URLSearchParams({
        api_key: this.fertilizerApiKey,
        ...(location && { 
          lat: location.latitude.toString(), 
          lon: location.longitude.toString() 
        })
      });

      const response = await fetch(
        `${this.fertilizerBaseUrl}${API_ENDPOINTS.FERTILIZER.PRICES}?${params}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch fertilizer prices from API');
      }

      const data: FertilizerResponse = await response.json();
      return data.prices || [];

    } catch (error) {
      console.error('Fertilizer prices error:', error);
      throw new Error('Unable to fetch fertilizer prices. Please check your API configuration.');
    }
  }

  async searchFertilizers(query: string): Promise<Fertilizer[]> {
    try {
      if (!this.fertilizerApiKey) {
        throw new Error('Fertilizer API key not configured');
      }

      const params = new URLSearchParams({
        api_key: this.fertilizerApiKey,
        query: query
      });

      const response = await fetch(
        `${this.fertilizerBaseUrl}${API_ENDPOINTS.FERTILIZER.SEARCH}?${params}`
      );

      if (!response.ok) {
        throw new Error('Failed to search fertilizers from API');
      }

      const data: FertilizerResponse = await response.json();
      
      return data.fertilizers?.map((fertilizer: FertilizerData, index: number) => ({
        id: `search_${index}`,
        name: fertilizer.name,
        type: (fertilizer.type as 'organic' | 'inorganic' | 'bio') || 'inorganic',
        npkRatio: fertilizer.npk_ratio || '0-0-0',
        application: fertilizer.application_method || 'Apply as directed',
        benefits: fertilizer.benefits || ['Provides essential nutrients'],
        suitableCrops: fertilizer.suitable_crops || ['All crops'],
        price: fertilizer.price || 0,
      })) || [];

    } catch (error) {
      console.error('Fertilizer search error:', error);
      throw new Error('Unable to search fertilizers. Please check your API configuration.');
    }
  }

  async getSoilHealthData(location: { latitude: number; longitude: number }): Promise<SoilHealthResponse | null> {
    try {
      if (!this.soilApiKey) {
        throw new Error('Soil API key not configured');
      }

      const params = new URLSearchParams({
        api_key: this.soilApiKey,
        lat: location.latitude.toString(),
        lon: location.longitude.toString()
      });

      const response = await fetch(
        `${this.soilBaseUrl}${API_ENDPOINTS.SOIL.HEALTH_CARD}?${params}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch soil health data from API');
      }

      return await response.json() as SoilHealthResponse;

    } catch (error) {
      console.error('Soil health data error:', error);
      throw new Error('Unable to fetch soil health data. Please check your API configuration.');
    }
  }

  async getSoilRecommendations(location: { latitude: number; longitude: number }): Promise<unknown> {
    try {
      if (!this.soilApiKey) {
        throw new Error('Soil API key not configured');
      }

      const params = new URLSearchParams({
        api_key: this.soilApiKey,
        lat: location.latitude.toString(),
        lon: location.longitude.toString()
      });

      const response = await fetch(
        `${this.soilBaseUrl}${API_ENDPOINTS.SOIL.RECOMMENDATIONS}?${params}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch soil recommendations from API');
      }

      return await response.json();

    } catch (error) {
      console.error('Soil recommendations error:', error);
      throw new Error('Unable to fetch soil recommendations. Please check your API configuration.');
    }
  }

  async getFertilizerDetails(fertilizerId: string): Promise<Fertilizer | null> {
    try {
      if (!this.fertilizerApiKey) {
        throw new Error('Fertilizer API key not configured');
      }

      const params = new URLSearchParams({
        api_key: this.fertilizerApiKey,
        fertilizer_id: fertilizerId
      });

      const response = await fetch(
        `${this.fertilizerBaseUrl}/fertilizer-details?${params}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch fertilizer details from API');
      }

      const fertilizer: FertilizerData = await response.json();
      
      return {
        id: fertilizer.fertilizer_id || fertilizerId,
        name: fertilizer.name,
        type: (fertilizer.type as 'organic' | 'inorganic' | 'bio') || 'inorganic',
        npkRatio: fertilizer.npk_ratio || '0-0-0',
        application: fertilizer.application_method || 'Apply as directed',
        benefits: fertilizer.benefits || ['Provides essential nutrients'],
        suitableCrops: fertilizer.suitable_crops || ['All crops'],
        price: fertilizer.price || 0,
      };

    } catch (error) {
      console.error('Error fetching fertilizer details:', error);
      return null;
    }
  }

  getFertilizersByType(type: 'organic' | 'inorganic' | 'bio'): Promise<Fertilizer[]> {
    return this.searchFertilizers(`type:${type}`);
  }

  getNPKExplanation(npkRatio: string): string {
    const [n, p, k] = npkRatio.split('-').map(Number);
    return `Nitrogen (${n}%): Promotes leaf growth and green color. Phosphorus (${p}%): Supports root development and flowering. Potassium (${k}%): Enhances fruit quality and disease resistance.`;
  }

  // Indian fertilizer subsidy information
  async getFertilizerSubsidyInfo(): Promise<unknown> {
    try {
      if (!this.fertilizerApiKey) {
        throw new Error('Fertilizer API key not configured');
      }

      const response = await fetch(
        `${this.fertilizerBaseUrl}/subsidy-info?api_key=${this.fertilizerApiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch fertilizer subsidy information');
      }

      return await response.json();

    } catch (error) {
      console.error('Fertilizer subsidy error:', error);
      throw new Error('Unable to fetch fertilizer subsidy information. Please check your API configuration.');
    }
  }

  // Get nearby fertilizer dealers
  async getNearbyDealers(location: { latitude: number; longitude: number }, radius: number = 50): Promise<unknown[]> {
    try {
      if (!this.fertilizerApiKey) {
        throw new Error('Fertilizer API key not configured');
      }

      const params = new URLSearchParams({
        api_key: this.fertilizerApiKey,
        lat: location.latitude.toString(),
        lon: location.longitude.toString(),
        radius: radius.toString()
      });

      const response = await fetch(
        `${this.fertilizerBaseUrl}/nearby-dealers?${params}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch nearby dealers');
      }

      const data: FertilizerResponse = await response.json();
      return data.dealers || [];

    } catch (error) {
      console.error('Nearby dealers error:', error);
      throw new Error('Unable to fetch nearby dealers. Please check your API configuration.');
    }
  }
}

export const fertilizerService = new FertilizerService(); 