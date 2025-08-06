'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import ResourcesSidebar from '@/components/features/resources/ResourcesSidebar';
import ResourcesHomeTab from '@/components/features/resources/ResourcesHomeTab';
import ResourceCard from '@/components/features/resources/ResourceCard';
import { PRODUCTS } from '@/lib/constants';

interface Resource {
  id: string;
  title: string;
  description: string | null;
  type: string;
  product: string | null;
  url: string | null;
  filePath: string | null;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  version: string | null;
  tags: any;
  downloadCount: number;
  lastAccessed: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    role: string;
  };
  _count: {
    activities: number;
  };
}

export default function ResourcesPage() {
  const { isViewer, isContributor } = useAuth();
  const [selectedSection, setSelectedSection] = useState('home');
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [resourceCounts, setResourceCounts] = useState<Record<string, number>>({});

  const resourceTypes = [
    { key: 'ALL', label: 'All Types' },
    { key: 'DOCUMENTATION', label: 'Documentation' },
    { key: 'ASSETS', label: 'Assets' },
    { key: 'TEMPLATES', label: 'Templates' },
    { key: 'LEGAL', label: 'Legal' },
    { key: 'UPDATES', label: 'Updates' },
    { key: 'TRAINING', label: 'Training' }
  ];

  useEffect(() => {
    fetchResources();
  }, [selectedSection]);

  useEffect(() => {
    filterResources();
  }, [resources, selectedSection, selectedType, searchQuery]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      let url = '/api/resources';
      const params = new URLSearchParams();
      
      if (selectedSection !== 'home') {
        if (selectedSection === 'general') {
          params.set('product', 'GENERAL');
        } else {
          params.set('product', selectedSection);
        }
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setResources(data);
        
        // Calculate resource counts by product
        const counts: Record<string, number> = { general: 0 };
        Object.keys(PRODUCTS).forEach(key => {
          counts[key] = 0;
        });
        
        data.forEach((resource: Resource) => {
          if (resource.product) {
            counts[resource.product] = (counts[resource.product] || 0) + 1;
          } else {
            counts.general++;
          }
        });
        
        setResourceCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;
    
    // Filter by type
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(query) ||
        resource.description?.toLowerCase().includes(query) ||
        (Array.isArray(resource.tags) && resource.tags.some((tag: string) => 
          tag.toLowerCase().includes(query)
        ))
      );
    }
    
    setFilteredResources(filtered);
  };

  const handleDownload = (resourceId: string) => {
    // Refresh resources to update download count
    fetchResources();
  };

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
    setSelectedType('ALL');
    setSearchQuery('');
  };

  const getSectionTitle = (section: string) => {
    if (section === 'home') return 'Home';
    if (section === 'general') return 'General Resources';
    const product = PRODUCTS[section as keyof typeof PRODUCTS];
    return product ? product.name : section;
  };

  const getSectionLogo = (section: string) => {
    if (section === 'home' || section === 'general') return null;
    return `/images/products/${section.toLowerCase()}-logo.svg`;
  };

  const getSectionDescription = (section: string) => {
    if (section === 'home') return 'Overview and recent updates';
    if (section === 'general') return 'Shared resources and documentation';
    const product = PRODUCTS[section as keyof typeof PRODUCTS];
    return product ? product.description : '';
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold gradient-text mb-4">
          Resource Hub
        </h1>
        <p className="text-slate-600 text-xl max-w-2xl mx-auto">
          {isViewer 
            ? "Your comprehensive resource library organized by product and type" 
            : "Organize, upload, and share important documents and assets"
          }
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <ResourcesSidebar
            selectedSection={selectedSection}
            onSectionChange={handleSectionChange}
            resourceCounts={resourceCounts}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-9">
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getSectionLogo(selectedSection) ? (
                  <div className="flex items-center gap-4">
                    <img 
                      src={getSectionLogo(selectedSection)!} 
                      alt={`${getSectionTitle(selectedSection)} logo`}
                      className="h-12 w-auto"
                    />
                    <div>
                      <p className="text-slate-600 mt-1">
                        {getSectionDescription(selectedSection)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {getSectionTitle(selectedSection)}
                    </h2>
                    <p className="text-slate-600 mt-1">
                      {getSectionDescription(selectedSection)}
                    </p>
                  </div>
                )}
              </div>
              
              {isContributor && selectedSection !== 'home' && (
                <button className="btn-primary hover-lift">
                  Upload Resource
                </button>
              )}
            </div>

            {selectedSection === 'home' ? (
              <ResourcesHomeTab isViewer={isViewer} isContributor={isContributor} />
            ) : (
              <>
                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {resourceTypes.map((type) => (
                      <button
                        key={type.key}
                        onClick={() => setSelectedType(type.key)}
                        className={`px-4 py-2 text-sm rounded-xl transition-all duration-300 hover-lift ${
                          selectedType === type.key
                            ? 'bg-primary-100 text-primary-700 shadow-sm'
                            : 'text-slate-600 hover:bg-white/60'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search resources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 pl-10 pr-4 py-2 text-sm bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="w-4 h-4 bg-slate-400 rounded-full opacity-60"></div>
                    </div>
                  </div>
                </div>

                {/* Resources Grid */}
                {loading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-6 text-slate-500 text-lg">Loading resources...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filteredResources.length > 0 ? (
                      filteredResources.map((resource) => (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          onDownload={handleDownload}
                          isContributor={isContributor}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-20">
                        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <div className="text-3xl">📁</div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                          {searchQuery || selectedType !== 'ALL' 
                            ? 'No resources found' 
                            : 'No resources yet'
                          }
                        </h3>
                        <p className="text-slate-600 mb-6">
                          {searchQuery || selectedType !== 'ALL'
                            ? 'Try adjusting your search or filters'
                            : `Start building your ${getSectionTitle(selectedSection).toLowerCase()} library`
                          }
                        </p>
                        {isContributor && !searchQuery && selectedType === 'ALL' && (
                          <button className="btn-primary hover-lift">
                            Upload First Resource
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}