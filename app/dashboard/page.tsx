'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import QuickActivityComposer from '@/components/features/activity/QuickActivityComposer';
import ActivityContent from '@/components/features/activity/ActivityContent';
import KanbanBoard from '@/components/features/projects/KanbanBoard';
import ContactsView from '@/components/features/contacts/ContactsView';
import { Toaster } from 'react-hot-toast';

interface Activity {
  id: string;
  content: string;
  type: string;
  createdAt: string;
  user: {
    name: string;
    role: string;
  };
  contact?: {
    name: string;
    company: string;
    leadStatus: string;
  };
  project?: {
    title: string;
    status: string;
  };
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  linkedinUrl: string;
  leadStatus: string;
  notes: string;
  photo: string | null;
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

interface Project {
  id: string;
  title: string;
  status: string;
  progress: number;
  _count: {
    activities: number;
  };
}

export default function DashboardPage() {
  const { isViewer, isContributor } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'dashboard' | 'kanban' | 'contacts'>('dashboard');

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'EMAIL': return { bg: 'bg-blue-50', border: 'border-l-blue-400', accent: 'text-blue-600' };
      case 'CALL': return { bg: 'bg-green-50', border: 'border-l-green-400', accent: 'text-green-600' };
      case 'LINKEDIN': return { bg: 'bg-purple-50', border: 'border-l-purple-400', accent: 'text-purple-600' };
      case 'PRODUCT_UPDATE': return { bg: 'bg-orange-50', border: 'border-l-orange-400', accent: 'text-orange-600' };
      case 'TEXT': return { bg: 'bg-pink-50', border: 'border-l-pink-400', accent: 'text-pink-600' };
      default: return { bg: 'bg-primary-50', border: 'border-l-primary-400', accent: 'text-primary-600' };
    }
  };

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'HOT': return { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 border-red-200' };
      case 'WARM': return { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 border-amber-200' };
      case 'COLD': return { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 border-blue-200' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', badge: 'bg-slate-100 border-slate-200' };
    }
  };

  const getProjectProgressColor = (status: string, progress: number) => {
    switch (status) {
      case 'COMPLETED': return 'bg-gradient-to-r from-green-400 via-green-500 to-emerald-600';
      case 'IN_PROGRESS': 
        if (progress > 75) return 'bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600';
        if (progress > 50) return 'bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600';
        if (progress > 25) return 'bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600';
        return 'bg-gradient-to-r from-slate-400 via-blue-400 to-blue-500';
      case 'ON_HOLD': return 'bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500';
      case 'NOT_STARTED': return 'bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500';
      case 'CANCELLED': return 'bg-gradient-to-r from-red-400 via-red-500 to-red-600';
      default: return 'bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600';
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [activitiesRes, contactsRes, projectsRes] = await Promise.all([
          fetch('/api/activities'),
          fetch('/api/contacts'),
          fetch('/api/projects'),
        ]);

        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData);
        }

        if (contactsRes.ok) {
          const contactsData = await contactsRes.json();
          setContacts(contactsData);
        }

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleActivityCreated = (newActivity: Activity) => {
    // Add the new activity to the top of the feed
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleProjectUpdate = async (projectId: string, updates: Partial<Project>) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        // Update the local projects state
        setProjects(prev => 
          prev.map(p => p.id === projectId ? updatedProject : p)
        );
      } else {
        throw new Error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const handleProjectCreate = async (projectData: { title: string; description?: string; status: string; progress?: number }) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects(prev => [newProject, ...prev]);
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const handleProjectDelete = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  const handleContactUpdate = async (contactId: string, updates: Partial<Contact>) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedContact = await response.json();
        setContacts(prev => 
          prev.map(c => c.id === contactId ? updatedContact : c)
        );
      } else {
        throw new Error('Failed to update contact');
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  };

  const handleContactCreate = async (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'user' | '_count'>) => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        const newContact = await response.json();
        setContacts(prev => [newContact, ...prev]);
      } else {
        throw new Error('Failed to create contact');
      }
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  };

  const handleContactDelete = async (contactId: string) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContacts(prev => prev.filter(c => c.id !== contactId));
      } else {
        throw new Error('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold gradient-text mb-4">
          Welcome to Wally HQ
        </h1>
        <p className="text-slate-600 text-xl max-w-2xl mx-auto">
          {isViewer 
            ? "Your command center for tracking Wally's activities and progress" 
            : "Your personal headquarters for keeping Carm in the loop"
          }
        </p>
        
        {/* Presence Indicator */}
        {isViewer && (
          <div className="flex items-center justify-center gap-3 mt-6 p-4 bg-white/60 rounded-xl border border-slate-200 max-w-md mx-auto">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-700 font-medium">Wally is active</span>
            <span className="text-xs text-slate-500">Last update: {activities.length > 0 ? new Date(activities[0].createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'No updates yet'}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-6 text-slate-500 text-lg">Loading your dashboard...</p>
        </div>
      ) : (
        <>
          {/* Carm's Daily Brief */}
          {isViewer && activities.length > 0 && (
            <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Today&apos;s Snapshot</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Wally has posted <strong>{activities.length}</strong> updates, 
                    is actively working with <strong>{contacts.filter(c => c.leadStatus === 'HOT').length}</strong> hot leads,
                    and has <strong>{projects.filter(p => p.progress > 75).length}</strong> projects nearing completion.
                    {activities.length > 0 && ` Latest: &ldquo;${activities[0].content.substring(0, 100)}${activities[0].content.length > 100 ? '...' : ''}&rdquo;`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Hero Metrics - Moved to Top */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="metric-card text-center hover-lift group">
              <div className="relative z-10">
                <div className="text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {activities.length}
                </div>
                <div className="text-slate-600 font-medium">Total Activities</div>
                <div className="mt-2 text-xs text-slate-400">This week</div>
              </div>
            </div>
            <div className="metric-card text-center hover-lift group">
              <div className="relative z-10">
                <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {contacts.length}
                </div>
                <div className="text-slate-600 font-medium">Contacts</div>
                <div className="mt-2 text-xs text-slate-400">Total managed</div>
              </div>
            </div>
            <div className="metric-card text-center hover-lift group">
              <div className="relative z-10">
                <div className="text-4xl font-bold text-secondary-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {projects.length}
                </div>
                <div className="text-slate-600 font-medium">Projects</div>
                <div className="mt-2 text-xs text-slate-400">Active</div>
              </div>
            </div>
            <div className="metric-card text-center hover-lift group">
              <div className="relative z-10">
                <div className="text-4xl font-bold text-red-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {contacts.filter(c => c.leadStatus === 'HOT').length}
                </div>
                <div className="text-slate-600 font-medium">Hot Leads</div>
                <div className="mt-2 text-xs text-slate-400">Ready to close</div>
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-end mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-sm border border-slate-200">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'dashboard' 
                    ? 'bg-primary-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard View
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-1 ${
                  viewMode === 'kanban' 
                    ? 'bg-primary-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kanban View
              </button>
              <button
                onClick={() => setViewMode('contacts')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-1 ${
                  viewMode === 'contacts' 
                    ? 'bg-primary-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Contacts View
              </button>
            </div>
          </div>

          {/* Extended Vertical Layout - Activity Feed Prominent */}
          <div className="relative overflow-hidden">
            {viewMode === 'dashboard' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 min-h-[calc(100vh-400px)] animate-fadeIn">
            {/* Left Column - Contacts */}
            <div className="lg:col-span-3 card flex flex-col h-full">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-3 shadow-sm"></div>
                  Contacts
                </h2>
                <span className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full font-semibold shadow-sm">
                  {contacts.length}
                </span>
              </div>
              <div className="flex-1 space-y-4 scroll-area overflow-y-auto max-h-[600px]">
                {contacts.length > 0 ? (
                  contacts.map((contact) => {
                    const statusColors = getLeadStatusColor(contact.leadStatus);
                    return (
                    <div key={contact.id} className={`p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover-lift hover:shadow-md transition-all duration-300 ${statusColors.bg} border-l-4`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-900 mb-1 text-sm">{contact.name}</h3>
                          <p className="text-xs text-slate-600 mb-2">{contact.company}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium border ${statusColors.badge} ${statusColors.text}`}>
                              {contact.leadStatus}
                            </span>
                            <span className="text-xs text-slate-400">
                              {contact._count.activities} activities
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
                    </div>
                    <p className="text-lg font-medium mb-2">No contacts yet</p>
                    <p className="text-sm text-slate-400 mb-4">Start building your network</p>
                    {isContributor && (
                      <button className="btn-primary hover-lift">
                        Add First Contact
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Middle Column - Activity Feed - PROMINENT */}
            <div className="md:col-span-2 lg:col-span-6 flex flex-col h-full">
              <div className="card">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <h2 className="text-3xl font-bold text-slate-900 flex items-center">
                    <div className="w-5 h-5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mr-4 shadow-sm"></div>
                    Activity Feed
                  </h2>
                  <span className="text-sm bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full font-semibold shadow-sm">
                    {activities.length}
                  </span>
                </div>
                
                {/* Quick Activity Composer */}
                <QuickActivityComposer onActivityCreated={handleActivityCreated} />
              </div>
              
              <div className="card flex-1 mt-6">
                <div className="flex-1 space-y-6 scroll-area overflow-y-auto max-h-[600px]">
                {activities.length > 0 ? (
                  activities.map((activity) => {
                    const colors = getActivityTypeColor(activity.type);
                    return (
                    <div key={activity.id} className={`relative p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover-lift hover:shadow-md transition-all duration-300 ${colors.border} border-l-4`}>
                      <div className="ml-4">
                        <div className="flex justify-between items-start mb-3">
                          <span className={`text-xs font-semibold ${colors.accent} uppercase tracking-wider ${colors.bg} px-2 py-1 rounded-md`}>
                            {activity.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <ActivityContent 
                          content={activity.content}
                          className="text-base text-slate-800 mb-4 leading-loose font-medium"
                        />
                        <div className="flex flex-wrap gap-2">
                          {activity.contact && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                              {activity.contact.name}
                            </span>
                          )}
                          {activity.project && (
                            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                              {activity.project.title}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-primary-200 rounded-full"></div>
                    </div>
                    <p className="text-lg font-medium mb-2">No activities yet</p>
                    <p className="text-sm text-slate-400 mb-4">Start by adding your first update!</p>
                    {isContributor && (
                      <button className="btn-primary hover-lift">
                        Add Update
                      </button>
                    )}
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* Right Column - Projects */}
            <div className="lg:col-span-3 card flex flex-col h-full">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-full mr-3 shadow-sm"></div>
                  Projects
                </h2>
                <span className="text-sm bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-3 py-1.5 rounded-full font-semibold shadow-sm">
                  {projects.length}
                </span>
              </div>
              <div className="flex-1 space-y-4 scroll-area overflow-y-auto max-h-[600px]">
                {projects.length > 0 ? (
                  projects.map((project) => {
                    const progressGradient = getProjectProgressColor(project.status, project.progress);
                    return (
                    <div key={project.id} className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover-lift hover:shadow-md transition-all duration-300">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-slate-900 flex-1 text-sm">{project.title}</h3>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full font-medium ml-2">
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span className="font-medium">{project.progress}% complete</span>
                          <span className="text-slate-400 font-medium">{project.status === 'COMPLETED' ? 'DONE' : project.status === 'ON_HOLD' ? 'PAUSED' : 'ACTIVE'}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 shadow-inner">
                          <div 
                            className={`${progressGradient} h-2 rounded-full transition-all duration-700 ease-out shadow-sm`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">
                          {project._count.activities} activities
                        </span>
                        <div className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${project.status === 'COMPLETED' ? 'bg-green-400' : project.status === 'ON_HOLD' ? 'bg-amber-400' : 'bg-blue-400'}`}></div>
                          <span className="text-xs text-slate-600">{project.status === 'COMPLETED' ? 'Done' : project.status === 'ON_HOLD' ? 'Paused' : 'Active'}</span>
                        </div>
                      </div>
                    </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-secondary-200 rounded-full"></div>
                    </div>
                    <p className="text-lg font-medium mb-2">No projects yet</p>
                    <p className="text-sm text-slate-400 mb-4">Create your first project</p>
                    {isContributor && (
                      <button className="btn-outline hover-lift">
                        Add Project
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            </div>
            ) : viewMode === 'kanban' ? (
              <div className="min-h-[calc(100vh-400px)] animate-fadeIn">
                <KanbanBoard 
                  projects={projects} 
                  onProjectUpdate={handleProjectUpdate}
                  onProjectCreate={handleProjectCreate}
                  onProjectDelete={handleProjectDelete}
                />
              </div>
            ) : (
              <ContactsView
                initialContacts={contacts}
                onContactUpdate={handleContactUpdate}
                onContactCreate={handleContactCreate}
                onContactDelete={handleContactDelete}
              />
            )}
          </div>
        </>
      )}
      </div>
    </>
  );
}