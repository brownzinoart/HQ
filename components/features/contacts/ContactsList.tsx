'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

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

interface ContactsListProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onContactSelect: (contactId: string) => void;
  onStartAddContact?: () => void;
  onContactUpdate?: (contactId: string, updates: Partial<Contact>) => void;
  loading?: boolean;
  isAddingContact?: boolean;
}

export default function ContactsList({
  contacts,
  selectedContactId,
  onContactSelect,
  onStartAddContact,
  onContactUpdate,
  loading = false,
  isAddingContact = false
}: ContactsListProps) {
  const { isContributor } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'HOT': return { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 border-red-200', dot: 'bg-red-400' };
      case 'WARM': return { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 border-amber-200', dot: 'bg-amber-400' };
      case 'COLD': return { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 border-blue-200', dot: 'bg-blue-400' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', badge: 'bg-slate-100 border-slate-200', dot: 'bg-slate-400' };
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || contact.leadStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    ALL: contacts.length,
    HOT: contacts.filter(c => c.leadStatus === 'HOT').length,
    WARM: contacts.filter(c => c.leadStatus === 'WARM').length,
    COLD: contacts.filter(c => c.leadStatus === 'COLD').length,
  };

  const handleQuickStatusUpdate = async (contactId: string, newStatus: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onContactUpdate) {
      await onContactUpdate(contactId, { leadStatus: newStatus });
    }
  };

  return (
    <div className="card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-3 shadow-sm"></div>
          Contacts
          {isAddingContact && (
            <span className="ml-3 text-sm font-normal text-slate-500 bg-green-100 px-2 py-1 rounded-full">
              Adding Contact
            </span>
          )}
        </h2>
        {isContributor && (
          <button
            onClick={onStartAddContact}
            className={`px-3 py-2 text-sm rounded-lg transition-all duration-300 hover-lift font-medium ${
              isAddingContact 
                ? 'bg-green-600 text-white' 
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
            disabled={loading}
          >
            {isAddingContact ? 'Adding...' : 'Add Contact'}
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-white/60 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-slate-100 rounded-lg">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
              statusFilter === status
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {status} ({count})
          </button>
        ))}
      </div>


      {/* Contacts List */}
      <div className="flex-1 space-y-3 scroll-area overflow-y-auto">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => {
            const statusColors = getLeadStatusColor(contact.leadStatus);
            const isSelected = selectedContactId === contact.id;
            
            return (
              <div
                key={contact.id}
                onClick={() => onContactSelect(contact.id)}
                className={`p-4 bg-white rounded-lg border shadow-sm hover-lift hover:shadow-md transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'border-primary-300 bg-primary-50/50 shadow-md' 
                    : 'border-slate-200 hover:border-slate-300'
                } ${statusColors.bg} border-l-4 border-l-${statusColors.dot.replace('bg-', '')}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 mb-1 text-sm">{contact.name}</h3>
                    {contact.company && (
                      <p className="text-xs text-slate-600 mb-2">{contact.company}</p>
                    )}
                    {contact.position && (
                      <p className="text-xs text-slate-500 mb-2">{contact.position}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {isContributor && (
                      <div className="flex gap-1">
                        {['COLD', 'WARM', 'HOT'].map((status) => (
                          <button
                            key={status}
                            onClick={(e) => handleQuickStatusUpdate(contact.id, status, e)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              contact.leadStatus === status 
                                ? getLeadStatusColor(status).dot 
                                : 'bg-slate-200 hover:bg-slate-300'
                            }`}
                            title={`Mark as ${status}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium border ${statusColors.badge} ${statusColors.text}`}>
                    {contact.leadStatus}
                  </span>
                  <span className="text-xs text-slate-400">
                    {contact._count.activities} activities
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-500">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
            </div>
            <p className="text-lg font-medium mb-2">
              {searchTerm || statusFilter !== 'ALL' ? 'No contacts found' : 'No contacts yet'}
            </p>
            <p className="text-sm text-slate-400 mb-4">
              {searchTerm || statusFilter !== 'ALL' 
                ? 'Try adjusting your search or filter'
                : 'Start building your network'
              }
            </p>
            {isContributor && !searchTerm && statusFilter === 'ALL' && onStartAddContact && (
              <button 
                onClick={onStartAddContact}
                className="btn-primary hover-lift"
              >
                Add First Contact
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}