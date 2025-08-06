# 📊 Advanced Agricultural Datasets

This directory contains the datasets for training and running our ML models. Please provide the following datasets:

## 🦠 Plant Disease Dataset
**File**: `plant_diseases.json`
**Format**:
```json
{
  "diseases": [
    {
      "id": "disease_001",
      "name": "Late Blight",
      "scientific_name": "Phytophthora infestans",
      "affected_crops": ["Potato", "Tomato"],
      "symptoms": [
        "Dark brown spots on leaves",
        "White fuzzy growth on leaf undersides",
        "Rapid wilting of affected areas"
      ],
      "causes": [
        "High humidity (>90%)",
        "Cool temperatures (60-70°F)",
        "Poor air circulation"
      ],
      "treatment": [
        "Apply copper-based fungicide immediately",
        "Remove all affected plant parts",
        "Improve air circulation around plants"
      ],
      "prevention": [
        "Maintain proper plant spacing",
        "Ensure good drainage",
        "Use disease-resistant varieties"
      ],
      "severity_factors": {
        "temperature_range": [15, 25],
        "humidity_threshold": 85,
        "spread_rate": "high"
      },
      "images": [
        "disease_001_leaf_1.jpg",
        "disease_001_stem_1.jpg"
      ]
    }
  ]
}
```

## 🌾 Crop Dataset
**File**: `crops.json`
**Format**:
```json
{
  "crops": [
    {
      "id": "crop_001",
      "name": "Basmati Rice",
      "scientific_name": "Oryza sativa",
      "variety": "Basmati 370",
      "season": "Kharif",
      "climate_requirements": {
        "temperature": {
          "min": 20,
          "max": 35,
          "optimal": 28
        },
        "rainfall": {
          "min": 1000,
          "max": 2000,
          "optimal": 1200
        },
        "humidity": {
          "min": 70,
          "max": 90,
          "optimal": 80
        }
      },
      "soil_requirements": {
        "ph": {
          "min": 5.5,
          "max": 7.0,
          "optimal": 6.5
        },
        "type": ["Clay", "Loamy", "Alluvial"],
        "drainage": "Poor to moderate",
        "organic_matter": ">2%"
      },
      "growth_data": {
        "growth_period": 120,
        "stages": [
          {"name": "Germination", "days": 7, "water_need": "high"},
          {"name": "Tillering", "days": 30, "water_need": "high"},
          {"name": "Panicle", "days": 35, "water_need": "medium"},
          {"name": "Flowering", "days": 25, "water_need": "high"},
          {"name": "Maturity", "days": 23, "water_need": "low"}
        ]
      },
      "yield_data": {
        "average_yield": 4.5,
        "max_yield": 8.0,
        "unit": "tons/hectare",
        "factors": {
          "irrigation": 0.3,
          "fertilizer": 0.25,
          "variety": 0.2,
          "weather": 0.25
        }
      },
      "market_data": {
        "price_range": [2200, 2800],
        "demand": "high",
        "export_potential": true,
        "storage_life": 12
      }
    }
  ]
}
```

## 🌤️ Weather Dataset
**File**: `weather_patterns.json`
**Format**:
```json
{
  "regions": [
    {
      "id": "region_001",
      "name": "Punjab Plains",
      "coordinates": {
        "latitude": 30.7333,
        "longitude": 76.7794
      },
      "climate_zone": "Subtropical",
      "historical_data": [
        {
          "year": 2023,
          "monthly_data": [
            {
              "month": 1,
              "temperature": {"min": 5, "max": 20, "avg": 12.5},
              "rainfall": 25,
              "humidity": 65,
              "wind_speed": 8,
              "sunshine_hours": 6.5
            }
          ]
        }
      ],
      "seasonal_patterns": {
        "monsoon": {
          "start_date": "2023-06-15",
          "end_date": "2023-09-30",
          "total_rainfall": 800,
          "rainy_days": 45
        },
        "winter": {
          "start_date": "2023-12-01",
          "end_date": "2024-02-28",
          "min_temperature": 2,
          "frost_days": 15
        }
      }
    }
  ]
}
```

## 🧪 Fertilizer Dataset
**File**: `fertilizers.json`
**Format**:
```json
{
  "fertilizers": [
    {
      "id": "fert_001",
      "name": "Urea",
      "type": "Nitrogen",
      "composition": {
        "N": 46,
        "P": 0,
        "K": 0,
        "S": 0,
        "secondary_nutrients": {}
      },
      "physical_properties": {
        "form": "Granular",
        "color": "White",
        "solubility": "High",
        "ph_effect": "Acidifying"
      },
      "application_data": {
        "method": ["Broadcasting", "Side dressing", "Fertigation"],
        "timing": ["Basal", "Top dressing"],
        "rate_per_hectare": {
          "rice": 150,
          "wheat": 120,
          "maize": 180
        }
      },
      "economic_data": {
        "price_per_50kg": 266,
        "subsidy_rate": 82,
        "availability": "High"
      },
      "compatibility": {
        "mix_with": ["DAP", "MOP"],
        "avoid_with": ["Lime", "SSP"],
        "storage_requirements": "Dry, cool place"
      }
    }
  ]
}
```

## 🌱 Soil Dataset
**File**: `soil_data.json`
**Format**:
```json
{
  "soil_types": [
    {
      "id": "soil_001",
      "name": "Alluvial Soil",
      "regions": ["Indo-Gangetic Plains", "Coastal Plains"],
      "characteristics": {
        "texture": "Loamy to clayey",
        "drainage": "Good to moderate",
        "fertility": "High",
        "ph_range": [6.0, 8.0],
        "organic_matter": "2-4%"
      },
      "nutrient_profile": {
        "nitrogen": "Medium",
        "phosphorus": "Medium to high",
        "potassium": "High",
        "micronutrients": {
          "iron": "Adequate",
          "zinc": "Deficient",
          "boron": "Adequate"
        }
      },
      "suitable_crops": [
        {"crop": "Rice", "suitability": 95},
        {"crop": "Wheat", "suitability": 90},
        {"crop": "Sugarcane", "suitability": 85}
      ],
      "management_practices": {
        "irrigation": "Regular flooding for rice",
        "fertilization": "Balanced NPK with micronutrients",
        "amendments": "Organic matter addition"
      }
    }
  ]
}
```

## 📈 Market Dataset
**File**: `market_data.json`
**Format**:
```json
{
  "commodities": [
    {
      "id": "commodity_001",
      "name": "Rice",
      "variety": "Basmati",
      "price_history": [
        {
          "date": "2024-01-01",
          "price": 2500,
          "market": "Delhi",
          "quality": "Grade A"
        }
      ],
      "demand_supply": {
        "production": 120000,
        "consumption": 115000,
        "export": 8000,
        "import": 500,
        "unit": "tons"
      },
      "seasonal_trends": {
        "harvest_months": [10, 11, 12],
        "price_peak_months": [6, 7, 8],
        "volatility_index": 0.15
      }
    }
  ]
}
```

## 🔬 Research Dataset
**File**: `research_data.json`
**Format**:
```json
{
  "experiments": [
    {
      "id": "exp_001",
      "title": "Effect of NPK on Rice Yield",
      "location": "IARI, New Delhi",
      "duration": "2022-2023",
      "treatments": [
        {
          "treatment_id": "T1",
          "fertilizer_combination": "120-60-40 NPK",
          "yield": 6.2,
          "cost": 45000,
          "profit": 78000
        }
      ],
      "conclusions": [
        "Optimal NPK ratio increases yield by 25%",
        "Cost-benefit ratio is favorable"
      ]
    }
  ]
}
```

## 📋 Instructions for Dataset Preparation

1. **Create these JSON files** in the `src/data/` directory
2. **Populate with your agricultural data** - the more comprehensive, the better
3. **Include regional variations** for different climate zones
4. **Add temporal data** for seasonal patterns and trends
5. **Ensure data quality** with proper validation and cleaning

## 🎯 Dataset Requirements

- **Minimum 1000 records** per category for robust ML training
- **Multi-year data** for trend analysis (at least 3 years)
- **Regional diversity** covering different agro-climatic zones
- **Quality validation** with expert verification
- **Regular updates** for current market conditions

Once you provide these datasets, the ML models will be automatically trained and optimized for maximum accuracy and relevance to your specific agricultural context.