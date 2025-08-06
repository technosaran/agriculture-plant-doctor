# 🌱 Agriculture Plant Doctor - India Focus

A comprehensive AI-powered agriculture assistant specifically designed for Indian farmers and gardeners. This application provides real-time plant disease detection, crop recommendations based on Indian agricultural seasons, weather monitoring using Indian Meteorological Department data, and fertilizer guidance using Indian agricultural databases.

## ✨ Features

### 🔍 Plant Disease Detection
- Upload plant images for AI-powered disease identification
- Real-time analysis using PlantNet API
- Detailed symptoms, causes, and treatment recommendations
- Severity assessment and prevention strategies
- Focus on Indian crop diseases and local treatment methods

### 🌾 Crop Recommendations (Indian Focus)
- Weather-based crop suggestions using IMD data
- Indian agricultural seasons (Kharif, Rabi, Zaid)
- Krishi Vigyan Kendra (KVK) integration for local recommendations
- Profitability analysis with Indian market prices
- Soil compatibility checking using ICAR-NBSS&LUP data
- Growth period and yield expectations for Indian conditions

### 🌤️ Weather Monitoring (Indian Meteorological Department)
- Real-time weather data from IMD
- Agricultural advice based on Indian weather patterns
- 5-day weather forecast for Indian regions
- Location-based recommendations for Indian agriculture
- Agro-advisory services integration

### 🌱 Fertilizer Guide (Indian Database)
- Personalized fertilizer recommendations from Indian fertilizer database
- NPK ratio explanations and educational content
- Growth stage-specific suggestions
- Organic and inorganic options with Indian pricing
- Application instructions in Indian context
- Fertilizer subsidy information

### 📊 Advanced Analytics & Visualization
- Interactive weather trend charts (temperature, rainfall, humidity)
- Crop analytics with market price analysis
- Profitability distribution charts
- Seasonal crop distribution visualization
- Agricultural advice based on data insights
- Real-time market price tracking

### 🔐 User Authentication & Personalization
- Secure user registration and login system
- Personalized recommendations based on farm details
- User preferences and notification settings
- Farm profile management
- Multi-language support (10 Indian languages)
- Offline data access for registered users

### 📱 Mobile-First Design
- Responsive design optimized for mobile devices
- Touch-friendly interface for field use
- Mobile navigation with bottom tab bar
- Offline capability with data caching
- Progressive Web App (PWA) features
- Camera integration for plant disease detection

### 💾 Offline Capability
- Intelligent data caching system
- Offline access to previously loaded data
- Automatic data synchronization when online
- Cache management and cleanup
- Export/import functionality for data backup
- Reduced API calls for better performance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- API keys for various Indian agricultural services

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/agriculture-plant-doctor.git
cd agriculture-plant-doctor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following API keys:

```env
# Weather APIs
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
NEXT_PUBLIC_IMD_API_KEY=your_indian_meteorological_department_api_key

# Indian Agricultural APIs
NEXT_PUBLIC_KVK_API_KEY=your_krishi_vigyan_kendra_api_key
NEXT_PUBLIC_SOIL_API_KEY=your_icar_nbsslup_api_key
NEXT_PUBLIC_FERTILIZER_API_KEY=your_indian_fertilizer_database_api_key
NEXT_PUBLIC_MARKET_API_KEY=your_agmarknet_api_key

# Plant Disease Detection
NEXT_PUBLIC_PLANT_DISEASE_API_KEY=your_plantnet_api_key

# Location Services
NEXT_PUBLIC_LOCATION_API_KEY=your_opencage_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 API Keys Setup

### Required API Keys and How to Get Them

#### 1. Weather APIs
- **OpenWeatherMap API**: Free tier available at [openweathermap.org](https://openweathermap.org/api)
- **Indian Meteorological Department (IMD) API**: Contact IMD for API access at [mausam.imd.gov.in](https://mausam.imd.gov.in)

#### 2. Indian Agricultural APIs
- **Krishi Vigyan Kendra (KVK) API**: Contact ICAR for API access
- **ICAR-NBSS&LUP Soil API**: Contact ICAR-NBSS&LUP for soil data access
- **Indian Fertilizer Database API**: Contact Department of Fertilizers for API access
- **Agmarknet API**: Contact Agmarknet for market price data access

#### 3. Plant Disease Detection
- **PlantNet API**: Free tier available at [my.plantnet.org](https://my.plantnet.org)

#### 4. Location Services
- **OpenCage Geocoding API**: Free tier available at [opencagedata.com](https://opencagedata.com)

### API Configuration Priority

The application uses a priority-based approach for APIs:

1. **Weather Data**: IMD API (primary) → OpenWeatherMap (fallback)
2. **Crop Recommendations**: KVK API (primary)
3. **Soil Data**: ICAR-NBSS&LUP API (primary)
4. **Fertilizer Data**: Indian Fertilizer Database (primary)
5. **Market Prices**: Agmarknet API (primary)
6. **Plant Disease**: PlantNet API (primary)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Application header
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── WeatherWidget.tsx  # Weather display component
│   ├── DiseaseDetection.tsx # Plant disease detection
│   ├── CropRecommendations.tsx # Crop suggestions
│   └── FertilizerGuide.tsx # Fertilizer recommendations
├── services/              # API and business logic
│   ├── weatherService.ts  # Weather data handling (IMD + OpenWeatherMap)
│   ├── plantDiseaseService.ts # Disease detection (PlantNet)
│   ├── cropService.ts     # Crop recommendations (KVK)
│   └── fertilizerService.ts # Fertilizer data (Indian Database)
├── types/                 # TypeScript type definitions
│   └── index.ts          # Core type interfaces
└── config/               # Configuration files
    └── api.ts            # API configuration and endpoints
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks
- **Data Visualization**: Chart.js with React-ChartJS-2
- **Authentication**: JWT-based authentication system
- **Caching**: LocalStorage-based intelligent caching
- **Mobile**: Progressive Web App (PWA) capabilities
- **APIs**: 
  - Indian Meteorological Department (IMD)
  - Krishi Vigyan Kendra (KVK)
  - ICAR-NBSS&LUP (Soil Data)
  - Indian Fertilizer Database
  - Agmarknet (Market Prices)
  - PlantNet (Disease Detection)
  - OpenWeatherMap (Weather Fallback)
  - OpenCage (Geocoding)

## 📱 Features in Detail

### Disease Detection
- Drag-and-drop image upload
- Real-time image preview
- AI-powered disease identification using PlantNet
- Comprehensive treatment plans for Indian conditions
- Prevention strategies adapted for Indian climate

### Weather Integration
- Current weather conditions from IMD
- Agricultural advice based on Indian weather patterns
- 5-day forecast for Indian regions
- Location-based recommendations for Indian agriculture
- Agro-advisory services

### Crop Recommendations
- Weather-optimized suggestions using IMD data
- Indian seasonal filtering (Kharif, Rabi, Zaid)
- Profitability analysis with Indian market prices
- Soil compatibility using ICAR data
- Market price information from Agmarknet

### Fertilizer Guide
- NPK ratio explanations
- Growth stage recommendations
- Organic and inorganic options with Indian pricing
- Application instructions for Indian conditions
- Price comparison with subsidy information

### Analytics & Visualization
- Interactive weather trend charts with agricultural insights
- Crop profitability analysis and market price tracking
- Seasonal distribution visualization
- Real-time data visualization with Chart.js
- Export capabilities for data analysis

### User Authentication
- Secure registration with farm details
- Personalized recommendations based on user profile
- Multi-language support for Indian farmers
- User preferences and notification settings
- Offline data access for registered users

### Mobile Optimization
- Responsive design for all screen sizes
- Touch-friendly interface for field use
- Mobile navigation with drawer and bottom tabs
- Camera integration for plant disease detection
- Offline capability with intelligent caching

### Offline Capability
- Intelligent data caching with TTL-based expiration
- Offline access to weather, crop, and fertilizer data
- Automatic cache cleanup and management
- Export/import functionality for data backup
- Reduced API calls for better performance and cost savings

## 🔧 Configuration

### API Keys (Required)
The application requires API keys for full functionality. Without proper API keys, the application will show error messages and guide users to configure them.

### Customization
- Modify crop data sources in `src/services/cropService.ts`
- Update fertilizer information sources in `src/services/fertilizerService.ts`
- Add new disease types in `src/services/plantDiseaseService.ts`
- Configure additional weather sources in `src/services/weatherService.ts`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Indian Meteorological Department (IMD) for weather data
- Krishi Vigyan Kendra (KVK) for crop recommendations
- ICAR-NBSS&LUP for soil data
- Indian Fertilizer Database for fertilizer information
- Agmarknet for market price data
- PlantNet for plant identification
- The Indian farming community for feedback and testing

## 📞 Support

For support, email support@agriculture-plant-doctor.com or create an issue in this repository.

## 🔍 Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure all required API keys are properly configured in `.env.local`
2. **Location Access**: Enable location services in your browser for better recommendations
3. **Image Upload Issues**: Ensure images are in supported formats (PNG, JPG, JPEG)
4. **Weather Data Not Loading**: Check IMD and OpenWeatherMap API keys

### Error Messages

The application provides clear error messages when:
- API keys are missing or invalid
- Location services are disabled
- Network connectivity issues occur
- API rate limits are exceeded

---

**Made with ❤️ for the Indian agricultural community**
