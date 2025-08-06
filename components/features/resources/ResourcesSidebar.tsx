'use client';

import { useState } from 'react';
import { PRODUCTS } from '@/lib/constants';

interface ResourcesSidebarProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
  resourceCounts: Record<string, number>;
}

export default function ResourcesSidebar({ 
  selectedSection, 
  onSectionChange, 
  resourceCounts 
}: ResourcesSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    products: true,
    custom: true
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const getSectionColor = (section: string) => {
    if (section === 'home') return 'text-primary-600 bg-primary-50';
    if (section === 'general') return 'text-slate-600 bg-slate-50';
    
    const product = PRODUCTS[section as keyof typeof PRODUCTS];
    if (product) {
      switch (product.color) {
        case 'blue': return 'text-blue-600 bg-blue-50';
        case 'green': return 'text-green-600 bg-green-50';
        case 'purple': return 'text-purple-600 bg-purple-50';
        case 'orange': return 'text-orange-600 bg-orange-50';
        case 'teal': return 'text-teal-600 bg-teal-50';
        default: return 'text-slate-600 bg-slate-50';
      }
    }
    
    return 'text-slate-600 bg-slate-50';
  };

  const getProductIcon = (productKey: string) => {
    return `/images/products/${productKey.toLowerCase()}-logo.svg`;
  };

  return (
    <div className="w-80 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg h-fit sticky top-6">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="w-4 h-4 bg-slate-400 rounded-full opacity-60"></div>
          </div>
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          />
        </div>

        {/* Home Section */}
        <div className="space-y-1">
          <button
            onClick={() => onSectionChange('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 hover-lift ${
              selectedSection === 'home'
                ? 'bg-primary-100 text-primary-700 shadow-sm'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-primary-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="font-medium">Home</div>
              <div className="text-xs text-slate-500">Updates & Overview</div>
            </div>
          </button>
        </div>

        {/* Products Section */}
        <div className="space-y-2">
          <button
            onClick={() => toggleGroup('products')}
            className="w-full flex items-center justify-between px-2 py-1 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            <span>Products</span>
            <div className={`w-4 h-4 bg-slate-400 rounded transition-transform ${
              expandedGroups.products ? 'rotate-90' : ''
            }`}></div>
          </button>
          
          {expandedGroups.products && (
            <div className="space-y-1 pl-2">
              {Object.entries(PRODUCTS).map(([key, product]) => (
                <button
                  key={key}
                  onClick={() => onSectionChange(key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all duration-200 hover-lift ${
                    selectedSection === key
                      ? getSectionColor(key) + ' shadow-sm'
                      : 'text-slate-600 hover:bg-white/40'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden ${
                    selectedSection === key ? 'bg-white/60' : 'bg-slate-100'
                  }`}>
                    <img 
                      src={getProductIcon(key)} 
                      alt={`${product.name} logo`}
                      className="w-6 h-3 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs opacity-60">
                      {resourceCounts[key] || 0} resources
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* General Resources */}
        <div className="space-y-1">
          <button
            onClick={() => onSectionChange('general')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all duration-200 hover-lift ${
              selectedSection === 'general'
                ? 'bg-slate-100 text-slate-700 shadow-sm'
                : 'text-slate-600 hover:bg-white/40'
            }`}
          >
            <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-slate-400 rounded"></div>
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">General</div>
              <div className="text-xs opacity-60">
                {resourceCounts.general || 0} resources
              </div>
            </div>
          </button>
        </div>

        {/* Custom Groups (Future Enhancement) */}
        <div className="space-y-2">
          <button
            onClick={() => toggleGroup('custom')}
            className="w-full flex items-center justify-between px-2 py-1 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            <span>Custom Groups</span>
            <div className={`w-4 h-4 bg-slate-400 rounded transition-transform ${
              expandedGroups.custom ? 'rotate-90' : ''
            }`}></div>
          </button>
          
          {expandedGroups.custom && (
            <div className="space-y-1 pl-2">
              <div className="text-xs text-slate-500 px-4 py-2">
                Coming soon - Create custom resource groups
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="pt-4 border-t border-slate-200/50">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white/40 rounded-lg">
              <div className="text-lg font-bold text-primary-600">
                {Object.values(resourceCounts).reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-xs text-slate-500">Total</div>
            </div>
            <div className="text-center p-3 bg-white/40 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {Object.keys(resourceCounts).length}
              </div>
              <div className="text-xs text-slate-500">Categories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}