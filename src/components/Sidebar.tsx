import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'disease-detection', label: 'Disease Detection', icon: '🔍' },
    { id: 'crop-recommendations', label: 'Crop Recommendations', icon: '🌾' },
    { id: 'weather-analytics', label: 'Weather Analytics', icon: '🌤️' },
    { id: 'crop-analytics', label: 'Crop Analytics', icon: '📈' },
    { id: 'fertilizer-guide', label: 'Fertilizer Guide', icon: '🌱' },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="mt-8">
        <div className="px-4">
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-700 border-r-2 border-green-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-8 px-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Tips</h3>
            <p className="text-xs text-gray-600">
              Upload clear photos of plant leaves for better disease detection accuracy.
            </p>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar; 