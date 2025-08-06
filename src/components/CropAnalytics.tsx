'use client';

import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { CropRecommendation } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface CropAnalyticsProps {
  crops: CropRecommendation[];
}

const CropAnalytics: React.FC<CropAnalyticsProps> = ({ crops }) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('all');

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const filteredCrops = selectedCrop === 'all' 
    ? crops 
    : crops.filter(crop => crop.name === selectedCrop);

  // Market Price Analysis
  const marketPriceData = {
    labels: filteredCrops.map(crop => crop.name),
    datasets: [
      {
        label: 'Market Price (₹/kg)',
        data: filteredCrops.map(crop => crop.marketPrice),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Growth Period Analysis
  const growthPeriodData = {
    labels: filteredCrops.map(crop => crop.name),
    datasets: [
      {
        label: 'Growth Period (days)',
        data: filteredCrops.map(crop => crop.growthPeriod),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Profitability Distribution
  const profitabilityCounts = {
    high: filteredCrops.filter(crop => crop.profitability === 'high').length,
    medium: filteredCrops.filter(crop => crop.profitability === 'medium').length,
    low: filteredCrops.filter(crop => crop.profitability === 'low').length,
  };

  const profitabilityData = {
    labels: ['High Profitability', 'Medium Profitability', 'Low Profitability'],
    datasets: [
      {
        data: [profitabilityCounts.high, profitabilityCounts.medium, profitabilityCounts.low],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Seasonal Distribution
  const seasonalData = {
    labels: ['Kharif', 'Rabi', 'Zaid'],
    datasets: [
      {
        data: [
          filteredCrops.filter(crop => crop.season.toLowerCase().includes('kharif')).length,
          filteredCrops.filter(crop => crop.season.toLowerCase().includes('rabi')).length,
          filteredCrops.filter(crop => crop.season.toLowerCase().includes('zaid')).length,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const getTopPerformingCrops = () => {
    return filteredCrops
      .filter(crop => crop.profitability === 'high')
      .sort((a, b) => b.marketPrice - a.marketPrice)
      .slice(0, 5);
  };

  const getMarketInsights = () => {
    const avgPrice = filteredCrops.reduce((sum, crop) => sum + crop.marketPrice, 0) / filteredCrops.length;
    const maxPrice = Math.max(...filteredCrops.map(crop => crop.marketPrice));
    const minPrice = Math.min(...filteredCrops.map(crop => crop.marketPrice));
    
    return {
      avgPrice: avgPrice.toFixed(2),
      maxPrice: maxPrice.toFixed(2),
      minPrice: minPrice.toFixed(2),
      priceRange: (maxPrice - minPrice).toFixed(2),
    };
  };

  const insights = getMarketInsights();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">📈 Crop Analytics</h2>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Crops</option>
            {crops.map((crop) => (
              <option key={crop.id} value={crop.name}>{crop.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Price Analysis */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Market Prices</h3>
            <div className="h-64">
              <Bar data={marketPriceData} options={chartOptions} />
            </div>
          </div>

          {/* Growth Period Analysis */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Growth Periods</h3>
            <div className="h-64">
              <Line data={growthPeriodData} options={chartOptions} />
            </div>
          </div>

          {/* Profitability Distribution */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Profitability Distribution</h3>
            <div className="h-64">
              <Doughnut 
                data={profitabilityData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'bottom' as const,
                    },
                  },
                }} 
              />
            </div>
          </div>

          {/* Seasonal Distribution */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Seasonal Distribution</h3>
            <div className="h-64">
              <Doughnut 
                data={seasonalData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'bottom' as const,
                    },
                  },
                }} 
              />
            </div>
          </div>
        </div>

        {/* Market Insights */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">₹{insights.avgPrice}</div>
            <div className="text-sm text-blue-700">Avg Price/kg</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">₹{insights.maxPrice}</div>
            <div className="text-sm text-green-700">Max Price/kg</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">₹{insights.minPrice}</div>
            <div className="text-sm text-yellow-700">Min Price/kg</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">₹{insights.priceRange}</div>
            <div className="text-sm text-purple-700">Price Range</div>
          </div>
        </div>

        {/* Top Performing Crops */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">🏆 Top Performing Crops</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getTopPerformingCrops().map((crop) => (
              <div key={crop.id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{crop.name}</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {crop.profitability.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Price: ₹{crop.marketPrice}/kg</p>
                  <p>Growth: {crop.growthPeriod} days</p>
                  <p>Season: {crop.season}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 mb-3">💡 Recommendations</h3>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <p className="text-sm text-blue-700">
                Focus on high-profitability crops like {getTopPerformingCrops()[0]?.name} for better returns
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <p className="text-sm text-blue-700">
                Consider crop rotation between Kharif and Rabi seasons for soil health
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <p className="text-sm text-blue-700">
                Monitor market price trends and plan harvesting accordingly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropAnalytics; 