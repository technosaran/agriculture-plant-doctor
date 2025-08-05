# 🌱 Agriculture Plant Doctor

A comprehensive AI-powered agriculture assistant that helps farmers and gardeners with plant disease detection, crop recommendations, weather monitoring, and fertilizer guidance.

## ✨ Features

### 🔍 Plant Disease Detection
- Upload plant images for AI-powered disease identification
- Get detailed symptoms, causes, and treatment recommendations
- Severity assessment and prevention strategies
- Support for multiple plant types and diseases

### 🌾 Crop Recommendations
- Weather-based crop suggestions
- Seasonal planting guidance
- Profitability analysis and market prices
- Soil compatibility checking
- Growth period and yield expectations

### 🌤️ Weather Monitoring
- Real-time weather data integration
- Agricultural advice based on conditions
- 5-day weather forecast
- Location-based recommendations

### 🌱 Fertilizer Guide
- Personalized fertilizer recommendations
- NPK ratio explanations
- Growth stage-specific suggestions
- Organic and inorganic options
- Application instructions and pricing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

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

3. Set up environment variables (optional):
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
NEXT_PUBLIC_PLANT_DISEASE_API_KEY=your_plantnet_api_key
NEXT_PUBLIC_LOCATION_API_KEY=your_opencage_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
│   ├── weatherService.ts  # Weather data handling
│   ├── plantDiseaseService.ts # Disease detection
│   ├── cropService.ts     # Crop recommendations
│   └── fertilizerService.ts # Fertilizer data
├── types/                 # TypeScript type definitions
│   └── index.ts          # Core type interfaces
└── config/               # Configuration files
    └── api.ts            # API configuration
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks
- **APIs**: OpenWeatherMap, PlantNet (configurable)

## 📱 Features in Detail

### Disease Detection
- Drag-and-drop image upload
- Real-time image preview
- AI-powered disease identification
- Comprehensive treatment plans
- Prevention strategies

### Weather Integration
- Current weather conditions
- Agricultural advice based on weather
- 5-day forecast
- Location-based recommendations

### Crop Recommendations
- Weather-optimized suggestions
- Seasonal filtering
- Profitability analysis
- Soil compatibility
- Market price information

### Fertilizer Guide
- NPK ratio explanations
- Growth stage recommendations
- Organic and inorganic options
- Application instructions
- Price comparison

## 🔧 Configuration

### API Keys (Optional)
The application works with mock data by default. For production use, add these API keys:

1. **OpenWeatherMap API**: For real weather data
2. **PlantNet API**: For plant disease identification
3. **OpenCage API**: For location services

### Customization
- Modify crop data in `src/services/cropService.ts`
- Update fertilizer information in `src/services/fertilizerService.ts`
- Add new disease types in `src/services/plantDiseaseService.ts`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

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

- OpenWeatherMap for weather data
- PlantNet for plant identification
- Agricultural research databases
- The farming community for feedback and testing

## 📞 Support

For support, email support@agriculture-plant-doctor.com or create an issue in this repository.

---

**Made with ❤️ for the agricultural community**
