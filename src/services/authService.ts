import { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  ProfileUpdate,
  PasswordResetRequest,
  PasswordReset 
} from '@/types/auth';

class AuthService {
  private baseUrl = process.env.NEXT_PUBLIC_AUTH_API_URL || '/api/auth';
  private tokenKey = 'agriculture_auth_token';
  private refreshTokenKey = 'agriculture_refresh_token';

  // Token management
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.refreshTokenKey);
    }
    return null;
  }

  private setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.refreshTokenKey, token);
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
    }
  }

  // API request helper
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the request with new token
          const newToken = this.getToken();
          if (newToken) {
            headers.Authorization = `Bearer ${newToken}`;
            const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
              ...options,
              headers,
            });
            if (retryResponse.ok) {
              return retryResponse.json();
            }
          }
        }
        this.logout();
        throw new Error('Authentication failed');
      }
      throw new Error(`Request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication methods
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.setToken(response.token);
    this.setRefreshToken(response.refreshToken);
    return response;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    this.setToken(response.token);
    this.setRefreshToken(response.refreshToken);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.clearTokens();
    }
  }

  async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.token);
        this.setRefreshToken(data.refreshToken);
        return true;
      }
    } catch (error) {
      console.warn('Token refresh failed:', error);
    }

    return false;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getToken();
      if (!token) {
        return null;
      }

      return await this.makeRequest<User>('/me');
    } catch (error) {
      console.warn('Failed to get current user:', error);
      return null;
    }
  }

  async updateProfile(updates: ProfileUpdate): Promise<User> {
    return await this.makeRequest<User>('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.makeRequest('/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.makeRequest('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await this.makeRequest('/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async verifyEmail(token: string): Promise<void> {
    await this.makeRequest('/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerificationEmail(): Promise<void> {
    await this.makeRequest('/resend-verification', {
      method: 'POST',
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('agriculture_user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          console.warn('Failed to parse stored user:', error);
        }
      }
    }
    return null;
  }

  storeUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agriculture_user', JSON.stringify(user));
    }
  }

  clearStoredUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agriculture_user');
    }
  }

  // Mock methods for development (remove in production)
  async mockLogin(email: string, password: string): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'demo@example.com' && password === 'password') {
      const mockUser: User = {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo Farmer',
        phone: '+91 98765 43210',
        location: {
          latitude: 20.5937,
          longitude: 78.9629,
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
        },
        preferences: {
          language: 'en',
          units: 'metric',
          notifications: {
            weather: true,
            cropAlerts: true,
            diseaseAlerts: true,
            marketUpdates: false,
          },
        },
        farmDetails: {
          farmSize: 5.5,
          soilType: 'Loamy',
          irrigationType: 'irrigated',
          crops: ['Rice', 'Wheat', 'Cotton'],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response: AuthResponse = {
        user: mockUser,
        token: 'mock_jwt_token',
        refreshToken: 'mock_refresh_token',
      };

      this.setToken(response.token);
      this.setRefreshToken(response.refreshToken);
      this.storeUser(mockUser);

      return response;
    }

    throw new Error('Invalid credentials');
  }

  async mockRegister(data: RegisterData): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      phone: data.phone,
      location: data.location,
      preferences: {
        language: 'en',
        units: 'metric',
        notifications: {
          weather: true,
          cropAlerts: true,
          diseaseAlerts: true,
          marketUpdates: true,
        },
      },
      farmDetails: data.farmDetails,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const response: AuthResponse = {
      user: mockUser,
      token: 'mock_jwt_token_new',
      refreshToken: 'mock_refresh_token_new',
    };

    this.setToken(response.token);
    this.setRefreshToken(response.refreshToken);
    this.storeUser(mockUser);

    return response;
  }
}

export const authService = new AuthService(); 