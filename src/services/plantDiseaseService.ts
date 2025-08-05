import { API_CONFIG, API_ENDPOINTS } from '@/config/api';
import { PlantDisease } from '@/types';

class PlantDiseaseService {
  private baseUrl = API_CONFIG.PLANT_DISEASE_BASE_URL;
  private apiKey = API_CONFIG.PLANT_DISEASE_API_KEY;

  async identifyDisease(imageFile: File): Promise<PlantDisease[]> {
    try {
      const formData = new FormData();
      formData.append('images', imageFile);
      formData.append('modifiers', JSON.stringify(['crops_fast']));
      formData.append('plant-details', JSON.stringify(['common_names']));

      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.PLANT_DISEASE.IDENTIFY}`, {
        method: 'POST',
        headers: {
          'Api-Key': this.apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to identify plant disease');
      }

      const data = await response.json();
      
      // Transform API response to our PlantDisease format
      return data.results?.map((result: { species?: { scientificNameWithoutAuthor?: string; commonNames?: string[] }; score?: number }, index: number) => ({
        id: `disease_${index}`,
        name: result.species?.scientificNameWithoutAuthor || 'Unknown Disease',
        description: result.species?.commonNames?.[0] || 'Disease identification',
        symptoms: this.extractSymptoms(result),
        causes: this.extractCauses(result),
        treatment: this.getTreatmentRecommendations(result.species?.scientificNameWithoutAuthor),
        prevention: this.getPreventionMethods(result.species?.scientificNameWithoutAuthor),
        severity: this.calculateSeverity(result.score || 0),
        affectedCrops: result.species?.commonNames || [],
      })) || [];
    } catch (error) {
      console.error('Plant disease identification error:', error);
      throw new Error('Unable to identify plant disease');
    }
  }

  private extractSymptoms(result: { species?: { scientificNameWithoutAuthor?: string; commonNames?: string[] }; score?: number }): string[] {
    // Extract symptoms from API response or provide defaults
    return [
      'Leaf discoloration',
      'Wilting',
      'Spots on leaves',
      'Stunted growth',
    ];
  }

  private extractCauses(result: { species?: { scientificNameWithoutAuthor?: string; commonNames?: string[] }; score?: number }): string[] {
    return [
      'Fungal infection',
      'Poor drainage',
      'High humidity',
      'Contaminated soil',
    ];
  }

  private getTreatmentRecommendations(diseaseName?: string): string[] {
    const treatments: { [key: string]: string[] } = {
      default: [
        'Remove affected plant parts',
        'Apply fungicide spray',
        'Improve air circulation',
        'Reduce watering frequency',
        'Use copper-based treatments',
      ],
      'blight': [
        'Apply copper fungicide',
        'Remove infected leaves immediately',
        'Ensure proper spacing between plants',
        'Water at soil level, not on leaves',
      ],
      'rust': [
        'Apply sulfur-based fungicide',
        'Remove infected plant debris',
        'Improve air circulation',
        'Avoid overhead watering',
      ],
    };

    const key = diseaseName?.toLowerCase().includes('blight') ? 'blight' :
                diseaseName?.toLowerCase().includes('rust') ? 'rust' : 'default';
    
    return treatments[key];
  }

  private getPreventionMethods(diseaseName?: string): string[] {
    return [
      'Maintain proper plant spacing',
      'Ensure good drainage',
      'Rotate crops annually',
      'Use disease-resistant varieties',
      'Keep garden clean of debris',
      'Water at soil level',
    ];
  }

  private calculateSeverity(score: number): 'low' | 'medium' | 'high' {
    if (score > 0.8) return 'high';
    if (score > 0.5) return 'medium';
    return 'low';
  }

  // Mock disease data for development/testing
  getMockDiseaseData(): PlantDisease[] {
    return [
      {
        id: 'disease_1',
        name: 'Late Blight',
        description: 'A serious fungal disease affecting tomatoes and potatoes',
        symptoms: [
          'Dark brown spots on leaves',
          'White fuzzy growth on leaf undersides',
          'Rapid wilting of affected areas',
          'Brown lesions on stems',
        ],
        causes: [
          'High humidity (>90%)',
          'Cool temperatures (60-70°F)',
          'Poor air circulation',
          'Overhead watering',
        ],
        treatment: [
          'Apply copper-based fungicide immediately',
          'Remove all affected plant parts',
          'Improve air circulation around plants',
          'Reduce watering frequency',
          'Apply preventive fungicide spray',
        ],
        prevention: [
          'Choose resistant varieties',
          'Ensure proper plant spacing',
          'Water at soil level only',
          'Remove plant debris regularly',
          'Rotate crops annually',
        ],
        severity: 'high',
        affectedCrops: ['Tomato', 'Potato', 'Eggplant'],
      },
      {
        id: 'disease_2',
        name: 'Powdery Mildew',
        description: 'Common fungal disease causing white powdery coating on leaves',
        symptoms: [
          'White powdery coating on leaves',
          'Yellowing of affected leaves',
          'Stunted plant growth',
          'Premature leaf drop',
        ],
        causes: [
          'High humidity with dry conditions',
          'Poor air circulation',
          'Overcrowded plants',
          'Stress conditions',
        ],
        treatment: [
          'Apply sulfur-based fungicide',
          'Use baking soda spray (1 tsp per quart water)',
          'Remove affected leaves',
          'Improve air circulation',
        ],
        prevention: [
          'Maintain proper plant spacing',
          'Ensure good air circulation',
          'Avoid overhead watering',
          'Choose resistant varieties',
        ],
        severity: 'medium',
        affectedCrops: ['Cucumber', 'Squash', 'Pumpkin', 'Melon'],
      },
    ];
  }
}

export const plantDiseaseService = new PlantDiseaseService();