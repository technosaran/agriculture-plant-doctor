import { CropRecommendation, WeatherData, SoilData } from '@/types';
import { dataLoader, CropData, WeatherData as WeatherPatternData, SoilData as SoilDataAdvanced } from './dataLoader';

class MLCropService {
  private cropData: CropData[] = [];
  private weatherPatterns: WeatherPatternData | null = null;
  private soilData: SoilDataAdvanced | null = null;
  private isInitialized = false;

  async initializeModel(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load advanced datasets
      this.cropData = await dataLoader.loadCrops();
      this.weatherPatterns = await dataLoader.loadWeatherPatterns();
      this.soilData = await dataLoader.loadSoilData();

      this.isInitialized = true;
      console.log(`Advanced crop model initialized with ${this.cropData.length} crop varieties`);
    } catch (error) {
      console.error('Error initializing crop model:', error);
      throw new Error('Failed to initialize advanced crop recommendation model');
    }
  }

  async getCropRecommendations(
    weatherData: WeatherData | null,
    soilData?: SoilData,
    location?: { latitude: number; longitude: number }
  ): Promise<CropRecommendation[]> {
    try {
      await this.initializeModel();

      if (!weatherData) {
        return this.getSeasonalRecommendations();
      }

      // Advanced suitability analysis
      const recommendations = this.cropData.map(crop => {
        const suitabilityScore = this.calculateAdvancedSuitability(crop, {
          weather: weatherData,
          soil: soilData,
          location
        });

        return {
          id: `advanced_crop_${crop.id}`,
          name: crop.name,
          scientificName: crop.scientific_name,
          variety: crop.variety,
          season: crop.season,
          soilType: crop.soil_requirements.type,
          climateRequirements: {
            temperature: crop.climate_requirements.temperature,
            rainfall: crop.climate_requirements.rainfall,
            humidity: crop.climate_requirements.humidity
          },
          growthPeriod: crop.growth_data.growth_period,
          expectedYield: `${crop.yield_data.average_yield}-${crop.yield_data.max_yield} ${crop.yield_data.unit}`,
          marketPrice: this.calculateMarketPrice(crop),
          profitability: this.calculateProfitability(crop, suitabilityScore),
          suitabilityScore,
          growthStages: crop.growth_data.stages,
          yieldFactors: crop.yield_data.factors,
          marketDemand: crop.market_data.demand,
          exportPotential: crop.market_data.export_potential
        };
      });

      // Sort by suitability and return top recommendations
      return recommendations
        .sort((a, b) => (b.suitabilityScore || 0) - (a.suitabilityScore || 0))
        .slice(0, 8)
        .map(({ suitabilityScore, ...crop }) => crop);

    } catch (error) {
      console.error('Advanced crop recommendation error:', error);
      throw new Error('Unable to generate crop recommendations using advanced ML model');
    }
  }

  private calculateAdvancedSuitability(
    crop: CropData,
    conditions: {
      weather: WeatherData;
      soil?: SoilData;
      location?: { latitude: number; longitude: number };
    }
  ): number {
    let totalScore = 0;
    let maxScore = 0;

    // Climate suitability (40% weight)
    const climateScore = this.calculateClimateScore(crop, conditions.weather);
    totalScore += climateScore * 0.4;
    maxScore += 0.4;

    // Soil suitability (25% weight)
    if (conditions.soil) {
      const soilScore = this.calculateSoilScore(crop, conditions.soil);
      totalScore += soilScore * 0.25;
      maxScore += 0.25;
    }

    // Seasonal appropriateness (20% weight)
    const seasonScore = this.calculateSeasonScore(crop);
    totalScore += seasonScore * 0.2;
    maxScore += 0.2;

    // Market viability (15% weight)
    const marketScore = this.calculateMarketScore(crop);
    totalScore += marketScore * 0.15;
    maxScore += 0.15;

    return maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  }

  private calculateClimateScore(crop: CropData, weather: WeatherData): number {
    const tempReq = crop.climate_requirements.temperature;
    const rainReq = crop.climate_requirements.rainfall;
    const humidReq = crop.climate_requirements.humidity;

    // Temperature score
    const tempScore = this.getParameterScore(
      weather.temperature,
      tempReq.min,
      tempReq.max,
      tempReq.optimal
    );

    // Rainfall score (assuming annual rainfall)
    const rainfallScore = this.getParameterScore(
      weather.rainfall * 365, // Convert daily to annual
      rainReq.min,
      rainReq.max,
      rainReq.optimal
    );

    // Humidity score
    const humidityScore = this.getParameterScore(
      weather.humidity,
      humidReq.min,
      humidReq.max,
      humidReq.optimal
    );

    return (tempScore + rainfallScore + humidityScore) / 3;
  }

  private calculateSoilScore(crop: CropData, soil: SoilData): number {
    const soilReq = crop.soil_requirements;

    // pH score
    const phScore = this.getParameterScore(
      soil.ph,
      soilReq.ph.min,
      soilReq.ph.max,
      soilReq.ph.optimal
    );

    // Fertility score
    const fertilityScore = this.getFertilityScore(soil.fertility);

    return (phScore + fertilityScore) / 2;
  }

  private calculateSeasonScore(crop: CropData): number {
    const currentMonth = new Date().getMonth() + 1;
    const season = this.getCurrentSeason();
    
    // Check if current season matches crop season
    if (crop.season.toLowerCase().includes(season.toLowerCase())) {
      return 1.0;
    }
    
    // Partial score for year-round crops
    if (crop.season.toLowerCase().includes('year-round')) {
      return 0.8;
    }
    
    return 0.3; // Lower score for off-season
  }

  private calculateMarketScore(crop: CropData): number {
    const market = crop.market_data;
    let score = 0;

    // Demand score
    switch (market.demand) {
      case 'high': score += 0.4; break;
      case 'medium': score += 0.25; break;
      case 'low': score += 0.1; break;
    }

    // Export potential
    if (market.export_potential) score += 0.3;

    // Price stability (based on price range)
    const priceRange = market.price_range[1] - market.price_range[0];
    const avgPrice = (market.price_range[0] + market.price_range[1]) / 2;
    const volatility = priceRange / avgPrice;
    
    if (volatility < 0.2) score += 0.3; // Low volatility
    else if (volatility < 0.4) score += 0.2; // Medium volatility
    else score += 0.1; // High volatility

    return Math.min(score, 1.0);
  }

  private getParameterScore(value: number, min: number, max: number, optimal?: number): number {
    if (value < min || value > max) {
      // Calculate how far outside the range
      const distance = value < min ? min - value : value - max;
      const range = max - min;
      return Math.max(0, 1 - (distance / range));
    }

    if (optimal) {
      // Calculate score based on distance from optimal
      const distanceFromOptimal = Math.abs(value - optimal);
      const maxDistance = Math.max(optimal - min, max - optimal);
      return 1 - (distanceFromOptimal / maxDistance);
    }

    return 1.0; // Perfect score if within range and no optimal specified
  }

  private getFertilityScore(fertility: string): number {
    switch (fertility.toLowerCase()) {
      case 'high': return 1.0;
      case 'medium': return 0.7;
      case 'low': return 0.4;
      default: return 0.5;
    }
  }

  private calculateMarketPrice(crop: CropData): number {
    const priceRange = crop.market_data.price_range;
    return Math.round((priceRange[0] + priceRange[1]) / 2);
  }

  private calculateProfitability(crop: CropData, suitabilityScore: number): 'low' | 'medium' | 'high' {
    const marketDemand = crop.market_data.demand;
    const avgPrice = this.calculateMarketPrice(crop);
    
    let profitabilityScore = suitabilityScore / 100;
    
    // Adjust based on market demand
    if (marketDemand === 'high') profitabilityScore += 0.2;
    else if (marketDemand === 'medium') profitabilityScore += 0.1;
    
    // Adjust based on export potential
    if (crop.market_data.export_potential) profitabilityScore += 0.15;
    
    // Adjust based on price level
    if (avgPrice > 3000) profitabilityScore += 0.1;
    else if (avgPrice > 2000) profitabilityScore += 0.05;
    
    if (profitabilityScore > 0.7) return 'high';
    if (profitabilityScore > 0.4) return 'medium';
    return 'low';
  }

  private getSeasonalRecommendations(): CropRecommendation[] {
    const currentSeason = this.getCurrentSeason();
    return this.cropData
      .filter(crop => 
        crop.season.toLowerCase().includes(currentSeason.toLowerCase()) || 
        crop.season.toLowerCase().includes('year-round')
      )
      .slice(0, 6)
      .map(crop => ({
        id: `seasonal_${crop.id}`,
        name: crop.name,
        scientificName: crop.scientific_name,
        variety: crop.variety,
        season: crop.season,
        soilType: crop.soil_requirements.type,
        climateRequirements: {
          temperature: crop.climate_requirements.temperature,
          rainfall: crop.climate_requirements.rainfall,
          humidity: crop.climate_requirements.humidity
        },
        growthPeriod: crop.growth_data.growth_period,
        expectedYield: `${crop.yield_data.average_yield}-${crop.yield_data.max_yield} ${crop.yield_data.unit}`,
        marketPrice: this.calculateMarketPrice(crop),
        profitability: crop.market_data.demand as 'low' | 'medium' | 'high'
      }));
  }

  async getSeasonalCrops(season: string, location?: { latitude: number; longitude: number }): Promise<CropRecommendation[]> {
    await this.initializeModel();
    
    const seasonalCrops = this.cropData.filter(crop => 
      crop.season.toLowerCase().includes(season.toLowerCase()) || 
      crop.season.toLowerCase().includes('year-round')
    );

    return seasonalCrops.map(crop => ({
      id: `seasonal_${crop.id}`,
      name: crop.name,
      scientificName: crop.scientific_name,
      variety: crop.variety,
      season: crop.season,
      soilType: crop.soil_requirements.type,
      climateRequirements: {
        temperature: crop.climate_requirements.temperature,
        rainfall: crop.climate_requirements.rainfall,
        humidity: crop.climate_requirements.humidity
      },
      growthPeriod: crop.growth_data.growth_period,
      expectedYield: `${crop.yield_data.average_yield}-${crop.yield_data.max_yield} ${crop.yield_data.unit}`,
      marketPrice: this.calculateMarketPrice(crop),
      profitability: crop.market_data.demand as 'low' | 'medium' | 'high'
    }));
  }

  getCurrentSeason(): string {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    
    if (currentMonth >= 6 && currentMonth <= 10) return 'Kharif';
    if (currentMonth >= 10 || currentMonth <= 3) return 'Rabi';
    return 'Zaid';
  }

  getSeasonCrops(season: string): string[] {
    const seasonCrops = this.cropData
      .filter(crop => crop.season.toLowerCase().includes(season.toLowerCase()))
      .map(crop => crop.name);
    
    return [...new Set(seasonCrops)]; // Remove duplicates
  }

  async getCropDetails(cropId: string): Promise<CropRecommendation | null> {
    await this.initializeModel();
    
    const crop = this.cropData.find(c => 
      c.id === cropId.replace('advanced_crop_', '').replace('seasonal_', '')
    );

    if (!crop) return null;

    return {
      id: cropId,
      name: crop.name,
      scientificName: crop.scientific_name,
      variety: crop.variety,
      season: crop.season,
      soilType: crop.soil_requirements.type,
      climateRequirements: {
        temperature: crop.climate_requirements.temperature,
        rainfall: crop.climate_requirements.rainfall,
        humidity: crop.climate_requirements.humidity
      },
      growthPeriod: crop.growth_data.growth_period,
      expectedYield: `${crop.yield_data.average_yield}-${crop.yield_data.max_yield} ${crop.yield_data.unit}`,
      marketPrice: this.calculateMarketPrice(crop),
      profitability: crop.market_data.demand as 'low' | 'medium' | 'high',
      growthStages: crop.growth_data.stages,
      yieldFactors: crop.yield_data.factors,
      soilRequirements: crop.soil_requirements,
      marketData: crop.market_data
    };
  }

  async getSoilAdvisory(location: { latitude: number; longitude: number }): Promise<any> {
    await this.initializeModel();
    
    // Find nearest region based on location
    const nearestRegion = this.findNearestRegion(location);
    
    return {
      region: nearestRegion?.name || 'Unknown Region',
      climateZone: nearestRegion?.climate_zone || 'Tropical',
      recommendations: [
        'Conduct comprehensive soil testing',
        'Maintain optimal pH levels for selected crops',
        'Implement precision fertilization',
        'Practice sustainable crop rotation',
        'Monitor soil health indicators regularly',
        'Use organic amendments to improve soil structure'
      ],
      soilTypes: this.soilData?.soil_types.map(soil => ({
        name: soil.name,
        suitability: soil.characteristics.fertility,
        regions: soil.regions
      })) || []
    };
  }

  private findNearestRegion(location: { latitude: number; longitude: number }) {
    if (!this.weatherPatterns) return null;
    
    let nearestRegion = null;
    let minDistance = Infinity;
    
    for (const region of this.weatherPatterns.regions) {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        region.coordinates.latitude,
        region.coordinates.longitude
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestRegion = region;
      }
    }
    
    return nearestRegion;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  async getAdvancedAnalytics(): Promise<any> {
    await this.initializeModel();
    
    return {
      totalCrops: this.cropData.length,
      cropsBySeasons: this.groupCropsBySeasons(),
      yieldAnalysis: this.analyzeYieldPotential(),
      marketTrends: this.analyzeMarketTrends(),
      climateAdaptation: this.analyzeClimateAdaptation()
    };
  }

  private groupCropsBySeasons(): any {
    const seasons = { Kharif: 0, Rabi: 0, Zaid: 0, 'Year-round': 0 };
    this.cropData.forEach(crop => {
      const season = crop.season;
      if (season.includes('Kharif')) seasons.Kharif++;
      else if (season.includes('Rabi')) seasons.Rabi++;
      else if (season.includes('Zaid')) seasons.Zaid++;
      else seasons['Year-round']++;
    });
    return seasons;
  }

  private analyzeYieldPotential(): any {
    const yields = this.cropData.map(crop => crop.yield_data.max_yield);
    return {
      averageMaxYield: yields.reduce((sum, yieldValue) => sum + yieldValue, 0) / yields.length,
      highestYieldCrop: this.cropData.find(crop => 
        crop.yield_data.max_yield === Math.max(...yields)
      )?.name,
      yieldDistribution: {
        high: yields.filter(y => y > 10).length,
        medium: yields.filter(y => y >= 5 && y <= 10).length,
        low: yields.filter(y => y < 5).length
      }
    };
  }

  private analyzeMarketTrends(): any {
    const demands = this.cropData.map(crop => crop.market_data.demand);
    const exportCrops = this.cropData.filter(crop => crop.market_data.export_potential);
    
    return {
      demandDistribution: {
        high: demands.filter(d => d === 'high').length,
        medium: demands.filter(d => d === 'medium').length,
        low: demands.filter(d => d === 'low').length
      },
      exportPotentialCrops: exportCrops.length,
      topExportCrops: exportCrops.slice(0, 5).map(crop => crop.name)
    };
  }

  private analyzeClimateAdaptation(): any {
    const tempRanges = this.cropData.map(crop => ({
      name: crop.name,
      range: crop.climate_requirements.temperature.max - crop.climate_requirements.temperature.min
    }));
    
    return {
      mostAdaptable: tempRanges
        .sort((a, b) => b.range - a.range)
        .slice(0, 5)
        .map(item => item.name),
      averageTemperatureTolerance: tempRanges.reduce((sum, item) => sum + item.range, 0) / tempRanges.length
    };
  }
}

export const mlCropService = new MLCropService();