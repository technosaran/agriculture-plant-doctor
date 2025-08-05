import { Fertilizer, CropRecommendation, SoilData } from '@/types';

class FertilizerService {
  private mockFertilizers: Fertilizer[] = [
    {
      id: 'fert_1',
      name: 'NPK 20-20-20',
      type: 'inorganic',
      npkRatio: '20-20-20',
      application: 'Apply 1-2 tablespoons per gallon of water every 2-3 weeks during growing season',
      benefits: [
        'Balanced nutrition for all plants',
        'Promotes healthy root development',
        'Enhances flowering and fruiting',
        'Suitable for most crops',
      ],
      suitableCrops: ['Tomato', 'Cucumber', 'Bell Pepper', 'Lettuce', 'Spinach'],
      price: 15.99,
    },
    {
      id: 'fert_2',
      name: 'Fish Emulsion',
      type: 'organic',
      npkRatio: '5-1-1',
      application: 'Dilute 1 tablespoon per gallon of water and apply every 2 weeks',
      benefits: [
        'Natural source of nitrogen',
        'Improves soil microbial activity',
        'Safe for organic gardening',
        'Gentle on plant roots',
      ],
      suitableCrops: ['Lettuce', 'Spinach', 'Herbs', 'Leafy vegetables'],
      price: 12.99,
    },
    {
      id: 'fert_3',
      name: 'Bone Meal',
      type: 'organic',
      npkRatio: '3-15-0',
      application: 'Mix 1-2 cups per square yard into soil before planting',
      benefits: [
        'High phosphorus content',
        'Promotes strong root development',
        'Long-lasting soil amendment',
        'Natural source of calcium',
      ],
      suitableCrops: ['Tomato', 'Bell Pepper', 'Carrot', 'Root vegetables'],
      price: 8.99,
    },
    {
      id: 'fert_4',
      name: 'Compost Tea',
      type: 'organic',
      npkRatio: '1-1-1',
      application: 'Apply as foliar spray or soil drench every 1-2 weeks',
      benefits: [
        'Improves soil structure',
        'Enhances nutrient availability',
        'Suppresses soil-borne diseases',
        'Increases beneficial microorganisms',
      ],
      suitableCrops: ['All crops', 'Especially beneficial for vegetables'],
      price: 0, // Can be made at home
    },
    {
      id: 'fert_5',
      name: 'Calcium Nitrate',
      type: 'inorganic',
      npkRatio: '15-0-0',
      application: 'Apply 1 tablespoon per gallon of water every 2 weeks',
      benefits: [
        'Prevents blossom end rot',
        'Provides quick nitrogen boost',
        'Improves fruit quality',
        'Enhances calcium uptake',
      ],
      suitableCrops: ['Tomato', 'Bell Pepper', 'Cucumber', 'Fruiting vegetables'],
      price: 18.99,
    },
    {
      id: 'fert_6',
      name: 'Seaweed Extract',
      type: 'organic',
      npkRatio: '1-1-2',
      application: 'Dilute 1-2 tablespoons per gallon and apply as foliar spray',
      benefits: [
        'Natural growth stimulant',
        'Improves stress tolerance',
        'Enhances nutrient absorption',
        'Contains trace minerals',
      ],
      suitableCrops: ['All crops', 'Especially beneficial for stressed plants'],
      price: 22.99,
    },
    {
      id: 'fert_7',
      name: 'Epsom Salt',
      type: 'inorganic',
      npkRatio: '0-0-0',
      application: 'Dissolve 1 tablespoon per gallon of water and apply monthly',
      benefits: [
        'Provides magnesium and sulfur',
        'Improves chlorophyll production',
        'Enhances fruit flavor',
        'Prevents magnesium deficiency',
      ],
      suitableCrops: ['Tomato', 'Bell Pepper', 'Cucumber', 'Leafy greens'],
      price: 5.99,
    },
    {
      id: 'fert_8',
      name: 'Worm Castings',
      type: 'organic',
      npkRatio: '2-1-1',
      application: 'Mix 1-2 cups per square foot into soil or use as top dressing',
      benefits: [
        'Rich in beneficial microorganisms',
        'Improves soil structure',
        'Slow-release nutrients',
        'Natural pest deterrent',
      ],
      suitableCrops: ['All crops', 'Excellent for seedlings'],
      price: 14.99,
    },
  ];

  async getFertilizerRecommendations(
    crop?: CropRecommendation,
    soilData?: SoilData,
    growthStage?: 'seedling' | 'vegetative' | 'flowering' | 'fruiting'
  ): Promise<Fertilizer[]> {
    try {
      let recommendations = this.mockFertilizers;

      // Filter by crop type if specified
      if (crop) {
        recommendations = this.filterByCrop(recommendations, crop);
      }

      // Filter by soil conditions if available
      if (soilData) {
        recommendations = this.filterBySoil(recommendations, soilData);
      }

      // Filter by growth stage if specified
      if (growthStage) {
        recommendations = this.filterByGrowthStage(recommendations, growthStage);
      }

      // Sort by relevance and price
      recommendations.sort((a, b) => {
        const aScore = this.getRelevanceScore(a, crop, soilData);
        const bScore = this.getRelevanceScore(b, crop, soilData);
        return bScore - aScore;
      });

      return recommendations.slice(0, 5); // Return top 5 recommendations
    } catch (error) {
      console.error('Fertilizer recommendation error:', error);
      return this.mockFertilizers.slice(0, 3); // Return fallback recommendations
    }
  }

  private filterByCrop(fertilizers: Fertilizer[], crop: CropRecommendation): Fertilizer[] {
    return fertilizers.filter(fertilizer => 
      fertilizer.suitableCrops.includes(crop.name) ||
      fertilizer.suitableCrops.includes('All crops')
    );
  }

  private filterBySoil(fertilizers: Fertilizer[], soil: SoilData): Fertilizer[] {
    return fertilizers.filter(fertilizer => {
      // Low pH soil needs more organic matter
      if (soil.ph < 6.0) {
        return fertilizer.type === 'organic';
      }
      
      // Low fertility soil needs balanced NPK
      if (soil.fertility === 'low') {
        return fertilizer.npkRatio.includes('20-20-20') || fertilizer.type === 'organic';
      }

      return true;
    });
  }

  private filterByGrowthStage(
    fertilizers: Fertilizer[], 
    stage: 'seedling' | 'vegetative' | 'flowering' | 'fruiting'
  ): Fertilizer[] {
    switch (stage) {
      case 'seedling':
        return fertilizers.filter(f => 
          f.name.includes('Compost') || 
          f.name.includes('Worm') || 
          f.npkRatio.includes('1-1-1')
        );
      case 'vegetative':
        return fertilizers.filter(f => 
          f.npkRatio.includes('20-20-20') || 
          f.name.includes('Fish') ||
          f.name.includes('Seaweed')
        );
      case 'flowering':
        return fertilizers.filter(f => 
          f.npkRatio.includes('3-15-0') || 
          f.name.includes('Bone')
        );
      case 'fruiting':
        return fertilizers.filter(f => 
          f.name.includes('Calcium') || 
          f.name.includes('Epsom') ||
          f.npkRatio.includes('20-20-20')
        );
      default:
        return fertilizers;
    }
  }

  private getRelevanceScore(
    fertilizer: Fertilizer, 
    crop?: CropRecommendation, 
    soilData?: SoilData
  ): number {
    let score = 0;

    // Crop compatibility
    if (crop && fertilizer.suitableCrops.includes(crop.name)) {
      score += 10;
    } else if (fertilizer.suitableCrops.includes('All crops')) {
      score += 5;
    }

    // Organic preference for low pH soils
    if (soilData && soilData.ph < 6.0 && fertilizer.type === 'organic') {
      score += 5;
    }

    // Price consideration (lower price gets higher score)
    if (fertilizer.price && fertilizer.price > 0) {
      score += (50 - fertilizer.price) / 10;
    } else {
      score += 10; // Free options get bonus
    }

    return score;
  }

  async getFertilizerDetails(fertilizerId: string): Promise<Fertilizer | null> {
    try {
      const fertilizer = this.mockFertilizers.find(f => f.id === fertilizerId);
      return fertilizer || null;
    } catch (error) {
      console.error('Error fetching fertilizer details:', error);
      return null;
    }
  }

  getFertilizersByType(type: 'organic' | 'inorganic' | 'bio'): Fertilizer[] {
    return this.mockFertilizers.filter(f => f.type === type);
  }

  getNPKExplanation(npkRatio: string): string {
    const [n, p, k] = npkRatio.split('-').map(Number);
    return `Nitrogen (${n}%): Promotes leaf growth. Phosphorus (${p}%): Supports root development and flowering. Potassium (${k}%): Enhances fruit quality and disease resistance.`;
  }
}

export const fertilizerService = new FertilizerService(); 