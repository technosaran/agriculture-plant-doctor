import { FertilizerRecommendation, SoilData, CropRecommendation } from '@/types';

class MLFertilizerService {
  private fertilizerDatabase = [
    {
      id: 'urea',
      name: 'Urea',
      type: 'Nitrogen',
      composition: { N: 46, P: 0, K: 0 },
      price: 266, // per 50kg bag
      application: 'Broadcast or side dressing',
      timing: 'Split application - basal and top dressing',
      dosage: '100-150 kg/ha',
      suitableCrops: ['Rice', 'Wheat', 'Maize', 'Sugarcane'],
      soilTypes: ['All soil types'],
      benefits: ['Quick nitrogen release', 'Promotes vegetative growth', 'Cost effective']
    },
    {
      id: 'dap',
      name: 'DAP (Di-Ammonium Phosphate)',
      type: 'Phosphorus',
      composition: { N: 18, P: 46, K: 0 },
      price: 1350,
      application: 'Basal application',
      timing: 'At sowing/planting',
      dosage: '100-125 kg/ha',
      suitableCrops: ['Wheat', 'Rice', 'Cotton', 'Soybean'],
      soilTypes: ['All soil types, especially P-deficient'],
      benefits: ['Root development', 'Early plant establishment', 'Flower and fruit formation']
    },
    {
      id: 'mop',
      name: 'MOP (Muriate of Potash)',
      type: 'Potassium',
      composition: { N: 0, P: 0, K: 60 },
      price: 1700,
      application: 'Basal or split application',
      timing: 'Before flowering/fruiting',
      dosage: '50-100 kg/ha',
      suitableCrops: ['Cotton', 'Sugarcane', 'Potato', 'Tomato'],
      soilTypes: ['All soil types'],
      benefits: ['Disease resistance', 'Quality improvement', 'Water use efficiency']
    },
    {
      id: 'npk_19_19_19',
      name: 'NPK 19:19:19',
      type: 'Complex',
      composition: { N: 19, P: 19, K: 19 },
      price: 850,
      application: 'Basal and top dressing',
      timing: 'Split application',
      dosage: '150-200 kg/ha',
      suitableCrops: ['Vegetables', 'Fruits', 'Flowers'],
      soilTypes: ['All soil types'],
      benefits: ['Balanced nutrition', 'Uniform growth', 'Easy application']
    },
    {
      id: 'ssp',
      name: 'SSP (Single Super Phosphate)',
      type: 'Phosphorus',
      composition: { N: 0, P: 16, K: 0, S: 11 },
      price: 450,
      application: 'Basal application',
      timing: 'At sowing',
      dosage: '200-250 kg/ha',
      suitableCrops: ['Groundnut', 'Mustard', 'Pulses'],
      soilTypes: ['All soil types, especially S-deficient'],
      benefits: ['Phosphorus and sulfur supply', 'Oil content improvement', 'Cost effective']
    },
    {
      id: 'organic_compost',
      name: 'Organic Compost',
      type: 'Organic',
      composition: { N: 1.5, P: 1, K: 1.5 },
      price: 300, // per ton
      application: 'Broadcasting and incorporation',
      timing: 'Before sowing/planting',
      dosage: '5-10 tons/ha',
      suitableCrops: ['All crops'],
      soilTypes: ['All soil types'],
      benefits: ['Soil health improvement', 'Water retention', 'Microbial activity']
    },
    {
      id: 'vermicompost',
      name: 'Vermicompost',
      type: 'Organic',
      composition: { N: 2, P: 1.5, K: 1.8 },
      price: 800, // per ton
      application: 'Broadcasting or pit application',
      timing: 'Before sowing/planting',
      dosage: '2-5 tons/ha',
      suitableCrops: ['Vegetables', 'Fruits', 'Flowers'],
      soilTypes: ['All soil types'],
      benefits: ['Slow nutrient release', 'Soil structure improvement', 'Disease suppression']
    },
    {
      id: 'neem_cake',
      name: 'Neem Cake',
      type: 'Organic',
      composition: { N: 5, P: 1, K: 1.4 },
      price: 1200, // per ton
      application: 'Broadcasting and incorporation',
      timing: 'Before sowing',
      dosage: '200-500 kg/ha',
      suitableCrops: ['All crops'],
      soilTypes: ['All soil types'],
      benefits: ['Pest control', 'Soil conditioning', 'Slow nitrogen release']
    }
  ];

  private cropNutrientRequirements = {
    'Rice': { N: 120, P: 60, K: 40 },
    'Wheat': { N: 120, P: 60, K: 40 },
    'Maize': { N: 150, P: 75, K: 50 },
    'Cotton': { N: 150, P: 75, K: 75 },
    'Soybean': { N: 30, P: 75, K: 50 }, // N-fixing crop
    'Sugarcane': { N: 200, P: 100, K: 150 },
    'Groundnut': { N: 25, P: 50, K: 75 },
    'Mustard': { N: 100, P: 50, K: 40 },
    'Tomato': { N: 150, P: 100, K: 100 },
    'Onion': { N: 100, P: 50, K: 100 }
  };

  async getFertilizerRecommendations(
    cropName: string,
    soilData?: SoilData,
    targetYield?: number
  ): Promise<FertilizerRecommendation[]> {
    try {
      // Get crop nutrient requirements
      const nutrientReq = this.cropNutrientRequirements[cropName as keyof typeof this.cropNutrientRequirements] || 
                         { N: 100, P: 50, K: 50 };

      // Adjust for target yield
      const yieldFactor = targetYield ? Math.min(2, targetYield / 100) : 1;
      const adjustedReq = {
        N: nutrientReq.N * yieldFactor,
        P: nutrientReq.P * yieldFactor,
        K: nutrientReq.K * yieldFactor
      };

      // Account for soil nutrient availability
      const soilNutrients = this.estimateSoilNutrients(soilData);
      const netRequirement = {
        N: Math.max(0, adjustedReq.N - soilNutrients.N),
        P: Math.max(0, adjustedReq.P - soilNutrients.P),
        K: Math.max(0, adjustedReq.K - soilNutrients.K)
      };

      // Generate fertilizer combinations
      const recommendations = this.generateFertilizerCombinations(netRequirement, cropName);

      return recommendations.slice(0, 3); // Return top 3 recommendations

    } catch (error) {
      console.error('Fertilizer recommendation error:', error);
      throw new Error('Unable to generate fertilizer recommendations');
    }
  }

  private estimateSoilNutrients(soilData?: SoilData): { N: number; P: number; K: number } {
    if (!soilData) {
      return { N: 20, P: 15, K: 25 }; // Default soil nutrient availability
    }

    // Estimate based on soil fertility and pH
    const fertilityMultiplier = soilData.fertility === 'high' ? 1.5 : 
                               soilData.fertility === 'medium' ? 1.0 : 0.5;

    // pH affects nutrient availability
    const phFactor = soilData.ph >= 6.0 && soilData.ph <= 7.5 ? 1.0 : 0.8;

    return {
      N: Math.round(30 * fertilityMultiplier * phFactor),
      P: Math.round(25 * fertilityMultiplier * phFactor),
      K: Math.round(40 * fertilityMultiplier * phFactor)
    };
  }

  private generateFertilizerCombinations(
    requirement: { N: number; P: number; K: number },
    cropName: string
  ): FertilizerRecommendation[] {
    const combinations = [];

    // Combination 1: Balanced approach with complex fertilizer + organics
    const combo1 = this.createBalancedRecommendation(requirement, cropName);
    combinations.push(combo1);

    // Combination 2: Straight fertilizers approach
    const combo2 = this.createStraightFertilizerRecommendation(requirement, cropName);
    combinations.push(combo2);

    // Combination 3: Organic-focused approach
    const combo3 = this.createOrganicRecommendation(requirement, cropName);
    combinations.push(combo3);

    return combinations;
  }

  private createBalancedRecommendation(
    requirement: { N: number; P: number; K: number },
    cropName: string
  ): FertilizerRecommendation {
    const fertilizers = [];
    let totalCost = 0;

    // Base with NPK complex
    const npkQuantity = Math.min(200, Math.max(requirement.N, requirement.P, requirement.K) * 5);
    const npk = this.fertilizerDatabase.find(f => f.id === 'npk_19_19_19')!;
    fertilizers.push({
      name: npk.name,
      quantity: `${npkQuantity} kg/ha`,
      timing: npk.timing,
      method: npk.application,
      cost: (npkQuantity / 50) * npk.price
    });
    totalCost += (npkQuantity / 50) * npk.price;

    // Additional nitrogen if needed
    const additionalN = requirement.N - (npkQuantity * 0.19);
    if (additionalN > 0) {
      const ureaQuantity = Math.round(additionalN / 0.46);
      const urea = this.fertilizerDatabase.find(f => f.id === 'urea')!;
      fertilizers.push({
        name: urea.name,
        quantity: `${ureaQuantity} kg/ha`,
        timing: 'Split application',
        method: urea.application,
        cost: (ureaQuantity / 50) * urea.price
      });
      totalCost += (ureaQuantity / 50) * urea.price;
    }

    // Organic component
    const compost = this.fertilizerDatabase.find(f => f.id === 'organic_compost')!;
    fertilizers.push({
      name: compost.name,
      quantity: '5 tons/ha',
      timing: compost.timing,
      method: compost.application,
      cost: 5 * compost.price
    });
    totalCost += 5 * compost.price;

    return {
      id: 'balanced_approach',
      name: 'Balanced NPK + Organic',
      description: 'Combination of complex fertilizer with organic matter for sustained nutrition',
      fertilizers,
      totalCost: Math.round(totalCost),
      expectedYieldIncrease: '15-25%',
      soilHealthImpact: 'Positive',
      applicationSchedule: this.createApplicationSchedule(fertilizers),
      benefits: [
        'Balanced nutrition supply',
        'Improved soil health',
        'Sustained nutrient release',
        'Cost-effective approach'
      ]
    };
  }

  private createStraightFertilizerRecommendation(
    requirement: { N: number; P: number; K: number },
    cropName: string
  ): FertilizerRecommendation {
    const fertilizers = [];
    let totalCost = 0;

    // Nitrogen source
    if (requirement.N > 0) {
      const ureaQuantity = Math.round(requirement.N / 0.46);
      const urea = this.fertilizerDatabase.find(f => f.id === 'urea')!;
      fertilizers.push({
        name: urea.name,
        quantity: `${ureaQuantity} kg/ha`,
        timing: urea.timing,
        method: urea.application,
        cost: (ureaQuantity / 50) * urea.price
      });
      totalCost += (ureaQuantity / 50) * urea.price;
    }

    // Phosphorus source
    if (requirement.P > 0) {
      const dapQuantity = Math.round(requirement.P / 0.46);
      const dap = this.fertilizerDatabase.find(f => f.id === 'dap')!;
      fertilizers.push({
        name: dap.name,
        quantity: `${dapQuantity} kg/ha`,
        timing: dap.timing,
        method: dap.application,
        cost: (dapQuantity / 50) * dap.price
      });
      totalCost += (dapQuantity / 50) * dap.price;
    }

    // Potassium source
    if (requirement.K > 0) {
      const mopQuantity = Math.round(requirement.K / 0.6);
      const mop = this.fertilizerDatabase.find(f => f.id === 'mop')!;
      fertilizers.push({
        name: mop.name,
        quantity: `${mopQuantity} kg/ha`,
        timing: mop.timing,
        method: mop.application,
        cost: (mopQuantity / 50) * mop.price
      });
      totalCost += (mopQuantity / 50) * mop.price;
    }

    return {
      id: 'straight_fertilizers',
      name: 'Straight Fertilizers',
      description: 'Individual fertilizers for precise nutrient management',
      fertilizers,
      totalCost: Math.round(totalCost),
      expectedYieldIncrease: '20-30%',
      soilHealthImpact: 'Neutral',
      applicationSchedule: this.createApplicationSchedule(fertilizers),
      benefits: [
        'Precise nutrient control',
        'Maximum yield potential',
        'Flexible application timing',
        'Quick nutrient availability'
      ]
    };
  }

  private createOrganicRecommendation(
    requirement: { N: number; P: number; K: number },
    cropName: string
  ): FertilizerRecommendation {
    const fertilizers = [];
    let totalCost = 0;

    // Vermicompost as base
    const vermicompost = this.fertilizerDatabase.find(f => f.id === 'vermicompost')!;
    fertilizers.push({
      name: vermicompost.name,
      quantity: '3 tons/ha',
      timing: vermicompost.timing,
      method: vermicompost.application,
      cost: 3 * vermicompost.price
    });
    totalCost += 3 * vermicompost.price;

    // Neem cake for nitrogen and pest control
    const neemCake = this.fertilizerDatabase.find(f => f.id === 'neem_cake')!;
    fertilizers.push({
      name: neemCake.name,
      quantity: '300 kg/ha',
      timing: neemCake.timing,
      method: neemCake.application,
      cost: 0.3 * neemCake.price
    });
    totalCost += 0.3 * neemCake.price;

    // Additional compost
    const compost = this.fertilizerDatabase.find(f => f.id === 'organic_compost')!;
    fertilizers.push({
      name: compost.name,
      quantity: '8 tons/ha',
      timing: compost.timing,
      method: compost.application,
      cost: 8 * compost.price
    });
    totalCost += 8 * compost.price;

    return {
      id: 'organic_approach',
      name: 'Organic Nutrition',
      description: 'Complete organic approach for sustainable farming',
      fertilizers,
      totalCost: Math.round(totalCost),
      expectedYieldIncrease: '10-20%',
      soilHealthImpact: 'Highly Positive',
      applicationSchedule: this.createApplicationSchedule(fertilizers),
      benefits: [
        'Excellent soil health improvement',
        'Sustainable nutrition',
        'Pest and disease suppression',
        'Long-term soil fertility'
      ]
    };
  }

  private createApplicationSchedule(fertilizers: any[]): string[] {
    const schedule = [];
    
    // Pre-planting applications
    const prePlanting = fertilizers.filter(f => 
      f.timing.toLowerCase().includes('before') || 
      f.timing.toLowerCase().includes('basal')
    );
    if (prePlanting.length > 0) {
      schedule.push(`Pre-planting: Apply ${prePlanting.map(f => f.name).join(', ')}`);
    }

    // At sowing applications
    const atSowing = fertilizers.filter(f => 
      f.timing.toLowerCase().includes('sowing') || 
      f.timing.toLowerCase().includes('planting')
    );
    if (atSowing.length > 0) {
      schedule.push(`At sowing: Apply ${atSowing.map(f => f.name).join(', ')}`);
    }

    // Split applications
    const split = fertilizers.filter(f => 
      f.timing.toLowerCase().includes('split')
    );
    if (split.length > 0) {
      schedule.push(`30 days after sowing: Apply 50% of ${split.map(f => f.name).join(', ')}`);
      schedule.push(`60 days after sowing: Apply remaining 50% of ${split.map(f => f.name).join(', ')}`);
    }

    return schedule;
  }

  async getFertilizerDetails(fertilizerId: string): Promise<any> {
    return this.fertilizerDatabase.find(f => f.id === fertilizerId) || null;
  }

  async getFertilizerPrices(): Promise<any[]> {
    return this.fertilizerDatabase.map(f => ({
      id: f.id,
      name: f.name,
      price: f.price,
      unit: f.id.includes('organic') || f.id.includes('vermi') || f.id.includes('neem') ? 'per ton' : 'per 50kg bag'
    }));
  }

  async getSoilTestRecommendations(soilData: SoilData): Promise<any> {
    const recommendations = [];

    // pH recommendations
    if (soilData.ph < 6.0) {
      recommendations.push({
        parameter: 'pH',
        issue: 'Acidic soil',
        recommendation: 'Apply lime @ 2-4 tons/ha to raise pH',
        priority: 'High'
      });
    } else if (soilData.ph > 8.0) {
      recommendations.push({
        parameter: 'pH',
        issue: 'Alkaline soil',
        recommendation: 'Apply gypsum @ 2-3 tons/ha to lower pH',
        priority: 'High'
      });
    }

    // Fertility recommendations
    if (soilData.fertility === 'low') {
      recommendations.push({
        parameter: 'Fertility',
        issue: 'Low soil fertility',
        recommendation: 'Increase organic matter through compost and green manuring',
        priority: 'High'
      });
    }

    return {
      soilStatus: this.assessSoilStatus(soilData),
      recommendations,
      generalAdvice: [
        'Conduct soil test every 2-3 years',
        'Maintain soil organic matter above 2%',
        'Practice crop rotation',
        'Use balanced fertilization'
      ]
    };
  }

  private assessSoilStatus(soilData: SoilData): string {
    const phStatus = soilData.ph >= 6.0 && soilData.ph <= 7.5 ? 'Good' : 'Needs correction';
    const fertilityStatus = soilData.fertility;
    
    if (phStatus === 'Good' && fertilityStatus === 'high') return 'Excellent';
    if (phStatus === 'Good' && fertilityStatus === 'medium') return 'Good';
    return 'Needs improvement';
  }
}

export const mlFertilizerService = new MLFertilizerService();