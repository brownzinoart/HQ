'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { PRODUCTS } from '@/lib/constants';
import OverviewTab from '@/components/features/carms-corner/OverviewTab';
import ProductTab from '@/components/features/carms-corner/ProductTab';

type ActiveTab = 'overview' | keyof typeof PRODUCTS;

export default function CarmsCornerPage() {
  const { isViewer } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTabChange = (newTab: ActiveTab) => {
    if (newTab === activeTab) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getProductGradient = (product: keyof typeof PRODUCTS) => {
    const productConfig = PRODUCTS[product];
    switch (productConfig.color) {
      case 'blue': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'green': return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'purple': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'orange': return 'bg-gradient-to-r from-orange-500 to-orange-600';
      case 'teal': return 'bg-gradient-to-r from-teal-500 to-teal-600';
      default: return 'bg-gradient-to-r from-slate-500 to-slate-600';
    }
  };

  const getDotColor = (product: keyof typeof PRODUCTS) => {
    const productConfig = PRODUCTS[product];
    switch (productConfig.color) {
      case 'blue': return 'bg-blue-400 group-hover:bg-blue-500';
      case 'green': return 'bg-green-400 group-hover:bg-green-500';
      case 'purple': return 'bg-purple-400 group-hover:bg-purple-500';
      case 'orange': return 'bg-orange-400 group-hover:bg-orange-500';
      case 'teal': return 'bg-teal-400 group-hover:bg-teal-500';
      default: return 'bg-slate-400 group-hover:bg-slate-500';
    }
  };

  const getTabDescription = (tab: ActiveTab) => {
    if (tab === 'overview') return "Complete overview of all products, tasks, and recent activity";
    const product = PRODUCTS[tab as keyof typeof PRODUCTS];
    return product.description;
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">👑</span>
          </div>
          <h1 className="text-5xl font-bold gradient-text">
            Carm&apos;s Corner
          </h1>
        </div>
        <p className="text-slate-600 text-xl max-w-3xl mx-auto">
          {isViewer 
            ? "Your dedicated space to review products, respond to questions, and guide development decisions" 
            : "Submit questions and updates for Carm to review across all products"
          }
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-6 text-slate-500 text-lg">Loading Carm&apos;s Corner...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Enhanced Tabbed Navigation */}
          <div className="mb-8 px-2 sm:px-0">
            <div className="glass rounded-2xl p-3 max-w-6xl mx-auto shadow-lg border border-white/20">
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full gap-2">
                  {/* Overview Tab */}
                  <button
                    onClick={() => handleTabChange('overview')}
                    className={`relative px-3 sm:px-4 py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 hover-lift group ${
                      activeTab === 'overview' 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105' 
                        : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
                    }`}
                    disabled={isTransitioning}
                  >
                    <div className="relative z-10 flex items-center justify-center space-x-1">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                        activeTab === 'overview' 
                          ? 'bg-white shadow-sm' 
                          : 'bg-orange-400 group-hover:bg-orange-500'
                      }`}></div>
                      <span className="hidden xs:inline">Overview</span>
                      <span className="xs:hidden">All</span>
                    </div>
                    {activeTab === 'overview' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 rounded-xl animate-fadeIn"></div>
                    )}
                  </button>

                  {/* Product Tabs */}
                  {Object.entries(PRODUCTS).map(([key, product]) => (
                    <button
                      key={key}
                      onClick={() => handleTabChange(key as keyof typeof PRODUCTS)}
                      className={`relative px-3 sm:px-4 py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 hover-lift group ${
                        activeTab === key 
                          ? `${getProductGradient(key as keyof typeof PRODUCTS)} text-white shadow-lg scale-105` 
                          : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
                      }`}
                      disabled={isTransitioning}
                    >
                      <div className="relative z-10 flex items-center justify-center space-x-1">
                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                          activeTab === key 
                            ? 'bg-white shadow-sm' 
                            : getDotColor(key as keyof typeof PRODUCTS)
                        }`}></div>
                        <span className="truncate">{product.name}</span>
                      </div>
                      {activeTab === key && (
                        <div className={`absolute inset-0 bg-gradient-to-r from-${product.color}-400/20 to-${product.color === 'blue' ? 'cyan' : product.color}-400/20 rounded-xl animate-fadeIn`}></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Tab Description */}
            <div className="text-center mt-4 px-4">
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl mx-auto">
                {getTabDescription(activeTab)}
              </p>
            </div>
          </div>

          {/* Tab Content */}
          <div className="relative overflow-hidden min-h-[600px]">
            {/* Transition Loading State */}
            {isTransitioning && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
                  <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse animation-delay-100"></div>
                  <div className="w-4 h-4 bg-orange-600 rounded-full animate-pulse animation-delay-200"></div>
                </div>
              </div>
            )}
            
            <div className={`transition-all duration-300 ${
              isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
            }`}>
              {activeTab === 'overview' ? (
                <OverviewTab />
              ) : (
                <ProductTab product={activeTab} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}