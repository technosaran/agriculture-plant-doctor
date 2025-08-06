export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  location: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  };
  preferences: {
    language: 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa';
    units: 'metric' | 'imperial';
    notifications: {
      weather: boolean;
      cropAlerts: boolean;
      diseaseAlerts: boolean;
      marketUpdates: boolean;
    };
  };
  farmDetails: {
    farmSize: number; // in acres
    soilType: string;
    irrigationType: 'rainfed' | 'irrigated' | 'mixed';
    crops: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  location: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  };
  farmDetails: {
    farmSize: number;
    soilType: string;
    irrigationType: 'rainfed' | 'irrigated' | 'mixed';
    crops: string[];
  };
}

export interface UserPreferences {
  language: 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa';
  units: 'metric' | 'imperial';
  notifications: {
    weather: boolean;
    cropAlerts: boolean;
    diseaseAlerts: boolean;
    marketUpdates: boolean;
  };
}

export interface FarmDetails {
  farmSize: number;
  soilType: string;
  irrigationType: 'rainfed' | 'irrigated' | 'mixed';
  crops: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  password: string;
}

export interface ProfileUpdate {
  name?: string;
  phone?: string;
  location?: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  };
  preferences?: Partial<UserPreferences>;
  farmDetails?: Partial<FarmDetails>;
} 