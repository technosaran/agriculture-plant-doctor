'use client';

import React, { useState } from 'react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onProfileClick: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ 
  activeTab, 
  setActiveTab, 
  isAuthenticated, 
  onLoginClick, 
  onProfileClick 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'disease-detection', label: 'Disease Detection', icon: '🔍' },
    { id: 'crop-recommendations', label: 'Crop Recommendations', icon: '🌾' },
    { id: 'fertilizer-guide', label: 'Fertilizer Guide', icon: '🌱' },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌱</span>
            </div>
            <h1 className="ml-3 text-lg font-bold text-gray-900">
              Plant Doctor
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <button
                onClick={onProfileClick}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
              >
                <span className="text-gray-600 text-sm">👤</span>
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md"
              >
                Login
              </button>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2 mb-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-700 border-r-2 border-green-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3 text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
                
                <button className="w-full flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                  <span className="mr-3">📸</span>
                  Scan Plant
                </button>
                
                <button className="w-full flex items-center px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100">
                  <span className="mr-3">🌤️</span>
                  Weather Alert
                </button>
                
                <button className="w-full flex items-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
                  <span className="mr-3">📊</span>
                  Market Prices
                </button>
              </div>

              {/* User Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                      <span className="mr-3">⚙️</span>
                      Settings
                    </button>
                    <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                      <span className="mr-3">📚</span>
                      Help & Support
                    </button>
                    <button className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg">
                      <span className="mr-3">🚪</span>
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button 
                      onClick={onLoginClick}
                      className="w-full flex items-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <span className="mr-3">🔐</span>
                      Login / Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar (Alternative) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-3 flex-1 ${
                activeTab === tab.id
                  ? 'text-green-600'
                  : 'text-gray-600'
              }`}
            >
              <span className="text-xl mb-1">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileNav; 