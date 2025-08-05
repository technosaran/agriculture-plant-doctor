import { API_CONFIG, API_ENDPOINTS } from '@/config/api';
import { PlantDisease, PlantNetResponse, PlantNetResult, DiseaseDatabaseResponse, DiseaseData } from '@/types';

class PlantDiseaseService {
  private baseUrl = API_CONFIG.PLANT_DISEASE_BASE_URL;
  private apiKey = API_CONFIG.PLANT_DISEASE_API_KEY;

  async identifyDisease(imageFile: File): Promise<PlantDisease[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Plant disease API key not configured. Please add NEXT_PUBLIC_PLANT_DISEASE_API_KEY to your environment variables.');
      }

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
        throw new Error('Failed to identify plant disease from API');
      }

      const data: PlantNetResponse = await response.json();
      
      // Transform API response to our PlantDisease format with parallel data fetching
      const diseasePromises = data.results?.map(async (result: PlantNetResult, index: number) => {
        const [symptoms, causes, treatment, prevention] = await Promise.all([
          this.getDiseaseSymptoms(result.species?.scientificNameWithoutAuthor),
          this.getDiseaseCauses(result.species?.scientificNameWithoutAuthor),
          this.getTreatmentRecommendations(result.species?.scientificNameWithoutAuthor),
          this.getPreventionMethods(result.species?.scientificNameWithoutAuthor)
        ]);

        return {
          id: `disease_${index}`,
          name: result.species?.scientificNameWithoutAuthor || 'Unknown Disease',
          description: result.species?.commonNames?.[0] || 'Disease identification',
          symptoms: symptoms,
          causes: causes,
          treatment: treatment,
          prevention: prevention,
          severity: this.calculateSeverity(result.score || 0),
          affectedCrops: result.species?.commonNames || [],
        };
      }) || [];

      return await Promise.all(diseasePromises);
    } catch (error) {
      console.error('Plant disease identification error:', error);
      throw new Error('Unable to identify plant disease. Please check your API configuration.');
    }
  }

  private async getDiseaseSymptoms(diseaseName?: string): Promise<string[]> {
    try {
      if (!diseaseName) {
        return ['Symptoms not available'];
      }

      // This would typically call a disease database API
      // For now, return common symptoms based on disease type
      const diseaseLower = diseaseName.toLowerCase();
      
      if (diseaseLower.includes('blight')) {
        return [
          'Dark brown spots on leaves',
          'White fuzzy growth on leaf undersides',
          'Rapid wilting of affected areas',
          'Brown lesions on stems',
        ];
      } else if (diseaseLower.includes('mildew')) {
        return [
          'White powdery coating on leaves',
          'Yellowing of affected leaves',
          'Stunted plant growth',
          'Premature leaf drop',
        ];
      } else if (diseaseLower.includes('rust')) {
        return [
          'Orange or brown pustules on leaves',
          'Yellow spots on leaf surfaces',
          'Defoliation in severe cases',
          'Reduced plant vigor',
        ];
      } else if (diseaseLower.includes('rot')) {
        return [
          'Soft, mushy areas on plant parts',
          'Foul odor from affected areas',
          'Wilting despite adequate water',
          'Dark, water-soaked lesions',
        ];
      }

      return [
        'Leaf discoloration',
        'Wilting',
        'Spots on leaves',
        'Stunted growth',
      ];
    } catch (error) {
      console.error('Error fetching disease symptoms:', error);
      return ['Symptoms not available'];
    }
  }

  private async getDiseaseCauses(diseaseName?: string): Promise<string[]> {
    try {
      if (!diseaseName) {
        return ['Causes not available'];
      }

      const diseaseLower = diseaseName.toLowerCase();
      
      if (diseaseLower.includes('blight')) {
        return [
          'High humidity (>90%)',
          'Cool temperatures (60-70°F)',
          'Poor air circulation',
          'Overhead watering',
        ];
      } else if (diseaseLower.includes('mildew')) {
        return [
          'High humidity with dry conditions',
          'Poor air circulation',
          'Overcrowded plants',
          'Stress conditions',
        ];
      } else if (diseaseLower.includes('rust')) {
        return [
          'High humidity',
          'Wet foliage for extended periods',
          'Poor air circulation',
          'Infected plant debris',
        ];
      } else if (diseaseLower.includes('rot')) {
        return [
          'Excessive moisture',
          'Poor drainage',
          'Wounded plant tissue',
          'Contaminated soil',
        ];
      }

      return [
        'Fungal infection',
        'Poor drainage',
        'High humidity',
        'Contaminated soil',
      ];
    } catch (error) {
      console.error('Error fetching disease causes:', error);
      return ['Causes not available'];
    }
  }

  private async getTreatmentRecommendations(diseaseName?: string): Promise<string[]> {
    try {
      if (!diseaseName) {
        return ['Treatment recommendations not available'];
      }

      const diseaseLower = diseaseName.toLowerCase();
      
      if (diseaseLower.includes('blight')) {
        return [
          'Apply copper-based fungicide immediately',
          'Remove all affected plant parts',
          'Improve air circulation around plants',
          'Reduce watering frequency',
          'Apply preventive fungicide spray',
        ];
      } else if (diseaseLower.includes('mildew')) {
        return [
          'Apply sulfur-based fungicide',
          'Use baking soda spray (1 tsp per quart water)',
          'Remove affected leaves',
          'Improve air circulation',
        ];
      } else if (diseaseLower.includes('rust')) {
        return [
          'Apply sulfur-based fungicide',
          'Remove infected plant debris',
          'Improve air circulation',
          'Avoid overhead watering',
        ];
      } else if (diseaseLower.includes('rot')) {
        return [
          'Remove affected plant parts',
          'Improve soil drainage',
          'Reduce watering frequency',
          'Apply fungicide to prevent spread',
        ];
      }

      return [
        'Remove affected plant parts',
        'Apply fungicide spray',
        'Improve air circulation',
        'Reduce watering frequency',
        'Use copper-based treatments',
      ];
    } catch (error) {
      console.error('Error fetching treatment recommendations:', error);
      return ['Treatment recommendations not available'];
    }
  }

  private async getPreventionMethods(diseaseName?: string): Promise<string[]> {
    try {
      if (!diseaseName) {
        return ['Prevention methods not available'];
      }

      return [
        'Maintain proper plant spacing',
        'Ensure good drainage',
        'Rotate crops annually',
        'Use disease-resistant varieties',
        'Keep garden clean of debris',
        'Water at soil level',
        'Monitor plants regularly',
        'Apply preventive fungicides',
      ];
    } catch (error) {
      console.error('Error fetching prevention methods:', error);
      return ['Prevention methods not available'];
    }
  }

  private calculateSeverity(score: number): 'low' | 'medium' | 'high' {
    if (score > 0.8) return 'high';
    if (score > 0.5) return 'medium';
    return 'low';
  }

  async getDiseaseDatabase(): Promise<PlantDisease[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Plant disease API key not configured');
      }

      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.PLANT_DISEASE.DISEASES}`, {
        headers: {
          'Api-Key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch disease database from API');
      }

      const data: DiseaseDatabaseResponse = await response.json();
      
      return data.diseases?.map((disease: DiseaseData, index: number) => ({
        id: `db_${index}`,
        name: disease.name,
        description: disease.description,
        symptoms: disease.symptoms || [],
        causes: disease.causes || [],
        treatment: disease.treatment || [],
        prevention: disease.prevention || [],
        severity: (disease.severity as 'low' | 'medium' | 'high') || 'medium',
        affectedCrops: disease.affected_crops || [],
      })) || [];

    } catch (error) {
      console.error('Disease database error:', error);
      throw new Error('Unable to fetch disease database. Please check your API configuration.');
    }
  }

  async getDiseaseByCrop(cropName: string): Promise<PlantDisease[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Plant disease API key not configured');
      }

      const params = new URLSearchParams({
        api_key: this.apiKey,
        crop: cropName
      });

      const response = await fetch(`${this.baseUrl}/diseases-by-crop?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch crop-specific diseases from API');
      }

      const data: DiseaseDatabaseResponse = await response.json();
      
      return data.diseases?.map((disease: DiseaseData, index: number) => ({
        id: `crop_${index}`,
        name: disease.name,
        description: disease.description,
        symptoms: disease.symptoms || [],
        causes: disease.causes || [],
        treatment: disease.treatment || [],
        prevention: disease.prevention || [],
        severity: (disease.severity as 'low' | 'medium' | 'high') || 'medium',
        affectedCrops: disease.affected_crops || [],
      })) || [];

    } catch (error) {
      console.error('Crop-specific diseases error:', error);
      throw new Error('Unable to fetch crop-specific diseases. Please check your API configuration.');
    }
  }

  async getDiseaseDetails(diseaseId: string): Promise<PlantDisease | null> {
    try {
      if (!this.apiKey) {
        throw new Error('Plant disease API key not configured');
      }

      const params = new URLSearchParams({
        api_key: this.apiKey,
        disease_id: diseaseId
      });

      const response = await fetch(`${this.baseUrl}/disease-details?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch disease details from API');
      }

      const disease: DiseaseData = await response.json();
      
      return {
        id: disease.disease_id || diseaseId,
        name: disease.name,
        description: disease.description,
        symptoms: disease.symptoms || [],
        causes: disease.causes || [],
        treatment: disease.treatment || [],
        prevention: disease.prevention || [],
        severity: (disease.severity as 'low' | 'medium' | 'high') || 'medium',
        affectedCrops: disease.affected_crops || [],
      };

    } catch (error) {
      console.error('Error fetching disease details:', error);
      return null;
    }
  }
}

export const plantDiseaseService = new PlantDiseaseService();