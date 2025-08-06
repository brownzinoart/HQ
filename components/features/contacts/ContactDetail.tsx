'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ContactActivities from './ContactActivities';
import PhotoUpload from '@/components/ui/PhotoUpload';

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

interface DetailedContact extends Contact {
  activities?: Array<{
    id: string;
    content: string;
    type: string;
    createdAt: string;
    user: {
      name: string;
      role: string;
    };
    project?: {
      title: string;
      status: string;
    };
    resource?: {
      title: string;
      type: string;
      url: string;
    };
    comments: Array<{
      id: string;
      content: string;
      createdAt: string;
      user: {
        name: string;
        role: string;
      };
    }>;
  }>;
}

interface ContactDetailProps {
  contact: Contact;
  onContactUpdate: (contactId: string, updates: Partial<Contact>) => void;
  onContactDelete: (contactId: string) => void;
  loading?: boolean;
}

export default function ContactDetail({ 
  contact, 
  onContactUpdate, 
  onContactDelete, 
  loading = false 
}: ContactDetailProps) {
  const { isContributor } = useAuth();
  const [detailedContact, setDetailedContact] = useState<DetailedContact | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(contact);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const fetchContactDetails = useCallback(async () => {
    try {
      setIsLoadingDetails(true);
      const response = await fetch(`/api/contacts/${contact.id}`);
      if (response.ok) {
        const data = await response.json();
        setDetailedContact(data);
      }
    } catch (error) {
      console.error('Error fetching contact details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  }, [contact.id]);

  useEffect(() => {
    fetchContactDetails();
  }, [fetchContactDetails]);

  useEffect(() => {
    setEditForm(contact);
  }, [contact]);

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'HOT': return { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 border-red-200', dot: 'bg-red-400' };
      case 'WARM': return { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 border-amber-200', dot: 'bg-amber-400' };
      case 'COLD': return { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 border-blue-200', dot: 'bg-blue-400' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', badge: 'bg-slate-100 border-slate-200', dot: 'bg-slate-400' };
    }
  };

  const handleSave = async () => {
    try {
      await onContactUpdate(contact.id, editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handlePhotoChange = (photoPath: string | null) => {
    setEditForm(prev => ({ ...prev, photo: photoPath }));
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      await onContactDelete(contact.id);
    }
  };

  const statusColors = getLeadStatusColor(contact.leadStatus);

  return (
    <div className="space-y-6">
      {/* Contact Header Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-6">
                {/* Photo Upload Section */}
                <div className="text-center border-b border-slate-100 pb-6">
                  <PhotoUpload
                    currentPhoto={editForm.photo || undefined}
                    onPhotoChange={handlePhotoChange}
                    contactName={editForm.name}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                    <input
                      type="text"
                      value={editForm.position}
                      onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Lead Status</label>
                    <select
                      value={editForm.leadStatus}
                      onChange={(e) => setEditForm({ ...editForm, leadStatus: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="COLD">Cold</option>
                      <option value="WARM">Warm</option>
                      <option value="HOT">Hot</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={editForm.linkedinUrl}
                    onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                {/* Contact Photo and Basic Info */}
                <div className="flex items-start gap-6 mb-6">
                  <div className="flex-shrink-0">
                    {contact.photo ? (
                      <img
                        src={contact.photo}
                        alt={contact.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{contact.name}</h1>
                    {contact.company && (
                      <p className="text-lg text-slate-600 mb-1">
                        {contact.position ? `${contact.position} at ` : ''}{contact.company}
                      </p>
                    )}
                    {contact.position && !contact.company && (
                      <p className="text-lg text-slate-600 mb-1">{contact.position}</p>
                    )}
                  </div>
                </div>

                {/* Lead Status Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors.badge} ${statusColors.text}`}>
                    <div className={`w-2 h-2 ${statusColors.dot} rounded-full mr-2`}></div>
                    {contact.leadStatus} Lead
                  </span>
                </div>

                {/* Contact Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {contact.email && (
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-bold">@</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Email</p>
                        <a href={`mailto:${contact.email}`} className="text-sm text-slate-900 hover:text-primary-600">
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact.phone && (
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-sm font-bold">📞</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Phone</p>
                        <a href={`tel:${contact.phone}`} className="text-sm text-slate-900 hover:text-primary-600">
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact.linkedinUrl && (
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg md:col-span-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-bold">in</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">LinkedIn</p>
                        <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-900 hover:text-primary-600">
                          View Profile
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {contact.notes && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="text-sm font-medium text-slate-700 mb-2">Notes</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{contact.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isContributor && (
            <div className="flex gap-2 ml-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading || !editForm.name.trim()}
                    className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm(contact);
                    }}
                    className="px-4 py-2 text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm bg-white/80 hover:bg-white text-slate-700 border border-slate-200 rounded-lg transition-all duration-300 hover-lift"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-all duration-300 hover-lift"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {!isEditing && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{contact._count.activities}</div>
              <div className="text-xs text-slate-500 font-medium">Total Activities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">
                {detailedContact?.activities?.filter(a => a.comments.length > 0).length || 0}
              </div>
              <div className="text-xs text-slate-500 font-medium">With Comments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600">
                {Math.ceil((new Date().getTime() - new Date(contact.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-xs text-slate-500 font-medium">Days Since Added</div>
            </div>
          </div>
        )}
      </div>

      {/* Activities Timeline */}
      {!isEditing && (
        <div className="card">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <div className="w-4 h-4 bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-full mr-3 shadow-sm"></div>
            Activity Timeline
          </h2>
          
          {isLoadingDetails ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4 text-slate-500">Loading activities...</p>
            </div>
          ) : detailedContact?.activities ? (
            <ContactActivities activities={detailedContact.activities} />
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg font-medium mb-2">No activities yet</p>
              <p className="text-sm text-slate-400">Activities related to this contact will appear here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}