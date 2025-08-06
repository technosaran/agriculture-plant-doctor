import { WeatherData, CropRecommendation, Fertilizer, PlantDisease } from '@/types';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheConfig {
  weather: { ttl: number }; // 1 hour
  crops: { ttl: number }; // 24 hours
  fertilizers: { ttl: number }; // 24 hours
  diseases: { ttl: number }; // 7 days
  soil: { ttl: number }; // 30 days
}

class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  private readonly config: CacheConfig = {
    weather: { ttl: 60 * 60 * 1000 }, // 1 hour
    crops: { ttl: 24 * 60 * 60 * 1000 }, // 24 hours
    fertilizers: { ttl: 24 * 60 * 60 * 1000 }, // 24 hours
    diseases: { ttl: 7 * 24 * 60 * 60 * 1000 }, // 7 days
    soil: { ttl: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  };

  constructor() {
    this.loadFromStorage();
    this.cleanup();
  }

  private getKey(type: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${type}:${sortedParams}`;
  }

  set<T>(type: string, params: Record<string, any>, data: T): void {
    const key = this.getKey(type, params);
    const ttl = this.config[type as keyof CacheConfig]?.ttl || 60 * 60 * 1000;
    
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    };

    this.cache.set(key, cacheItem);
    this.saveToStorage();
  }

  get<T>(type: string, params: Record<string, any>): T | null {
    const key = this.getKey(type, params);
    const item = this.cache.get(key) as CacheItem<T> | undefined;

    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }

    return item.data;
  }

  has(type: string, params: Record<string, any>): boolean {
    const key = this.getKey(type, params);
    const item = this.cache.get(key);

    if (!item) {
      return false;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.saveToStorage();
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
    this.saveToStorage();
  }

  clearType(type: string): void {
    const keysToDelete: string[] = [];
    for (const [key] of this.cache) {
      if (key.startsWith(`${type}:`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.cache.delete(key));
    this.saveToStorage();
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, item] of this.cache) {
      if (now > item.expiresAt) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    this.saveToStorage();
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const serialized = JSON.stringify(Array.from(this.cache.entries()));
        localStorage.setItem('agriculture_cache', serialized);
      }
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const serialized = localStorage.getItem('agriculture_cache');
        if (serialized) {
          const entries = JSON.parse(serialized);
          this.cache = new Map(entries);
        }
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
      this.cache = new Map();
    }
  }

  // Specific cache methods for different data types
  setWeather(location: { latitude: number; longitude: number }, data: WeatherData): void {
    this.set('weather', location, data);
  }

  getWeather(location: { latitude: number; longitude: number }): WeatherData | null {
    return this.get<WeatherData>('weather', location);
  }

  setCrops(params: { weather?: WeatherData; location: { latitude: number; longitude: number } }, data: CropRecommendation[]): void {
    this.set('crops', params, data);
  }

  getCrops(params: { weather?: WeatherData; location: { latitude: number; longitude: number } }): CropRecommendation[] | null {
    return this.get<CropRecommendation[]>('crops', params);
  }

  setFertilizers(params: { location: { latitude: number; longitude: number } }, data: Fertilizer[]): void {
    this.set('fertilizers', params, data);
  }

  getFertilizers(params: { location: { latitude: number; longitude: number } }): Fertilizer[] | null {
    return this.get<Fertilizer[]>('fertilizers', params);
  }

  setDiseases(cropName: string, data: PlantDisease[]): void {
    this.set('diseases', { cropName }, data);
  }

  getDiseases(cropName: string): PlantDisease[] | null {
    return this.get<PlantDisease[]>('diseases', { cropName });
  }

  // Cache statistics
  getStats(): { total: number; expired: number; types: Record<string, number> } {
    const now = Date.now();
    let expired = 0;
    const types: Record<string, number> = {};

    for (const [key, item] of this.cache) {
      const type = key.split(':')[0];
      types[type] = (types[type] || 0) + 1;

      if (now > item.expiresAt) {
        expired++;
      }
    }

    return {
      total: this.cache.size,
      expired,
      types,
    };
  }

  // Export cache for backup
  export(): string {
    return JSON.stringify(Array.from(this.cache.entries()));
  }

  // Import cache from backup
  import(backup: string): void {
    try {
      const entries = JSON.parse(backup);
      this.cache = new Map(entries);
      this.saveToStorage();
    } catch (error) {
      console.error('Failed to import cache backup:', error);
    }
  }
}

export const cacheService = new CacheService(); 