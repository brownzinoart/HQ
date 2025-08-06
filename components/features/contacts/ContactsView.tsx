'use client';

import { useState, useEffect } from 'react';
import ContactsList from './ContactsList';
import ContactDetail from './ContactDetail';
import NewContactForm from './NewContactForm';

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

interface ContactsViewProps {
  initialContacts: Contact[];
  onContactUpdate?: (contactId: string, updates: Partial<Contact>) => void;
  onContactCreate?: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'user' | '_count'>) => void;
  onContactDelete?: (contactId: string) => void;
}

export default function ContactsView({ 
  initialContacts, 
  onContactUpdate, 
  onContactCreate, 
  onContactDelete 
}: ContactsViewProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setContacts(initialContacts);
  }, [initialContacts]);

  const handleContactSelect = (contactId: string) => {
    setSelectedContactId(contactId);
    setIsAddingContact(false);
  };

  const handleStartAddContact = () => {
    setIsAddingContact(true);
    setSelectedContactId(null);
  };

  const handleCancelAddContact = () => {
    setIsAddingContact(false);
  };

  const handleContactUpdate = async (contactId: string, updates: Partial<Contact>) => {
    try {
      setLoading(true);
      
      // Optimistically update the local state
      setContacts(prev => 
        prev.map(contact => 
          contact.id === contactId ? { ...contact, ...updates } : contact
        )
      );

      // Call the parent handler if provided
      if (onContactUpdate) {
        await onContactUpdate(contactId, updates);
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      // Revert optimistic update on error
      setContacts(initialContacts);
    } finally {
      setLoading(false);
    }
  };

  const handleContactCreate = async (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'user' | '_count'>) => {
    try {
      setLoading(true);
      
      if (onContactCreate) {
        await onContactCreate(contactData);
        // After successful creation, exit add mode and the parent will update the list
        setIsAddingContact(false);
        // The parent will handle selecting the new contact if needed
      }
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error; // Re-throw so the form can handle the error
    } finally {
      setLoading(false);
    }
  };

  const handleContactDelete = async (contactId: string) => {
    try {
      setLoading(true);
      
      // Optimistically remove from local state
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      
      // Clear selection if deleted contact was selected
      if (selectedContactId === contactId) {
        setSelectedContactId(null);
      }

      if (onContactDelete) {
        await onContactDelete(contactId);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      // Revert optimistic update on error
      setContacts(initialContacts);
    } finally {
      setLoading(false);
    }
  };

  const selectedContact = contacts.find(contact => contact.id === selectedContactId);

  return (
    <div className="min-h-[calc(100vh-400px)] animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 h-full">
        {/* Left Panel - Contacts List */}
        <div className="lg:col-span-4 xl:col-span-3">
          <ContactsList
            contacts={contacts}
            selectedContactId={selectedContactId}
            onContactSelect={handleContactSelect}
            onStartAddContact={handleStartAddContact}
            onContactUpdate={handleContactUpdate}
            loading={loading}
            isAddingContact={isAddingContact}
          />
        </div>

        {/* Right Panel - Contact Details or Add Form */}
        <div className="lg:col-span-8 xl:col-span-9">
          {isAddingContact ? (
            <NewContactForm
              onSubmit={handleContactCreate}
              onCancel={handleCancelAddContact}
              loading={loading}
            />
          ) : selectedContact ? (
            <ContactDetail
              contact={selectedContact}
              onContactUpdate={handleContactUpdate}
              onContactDelete={handleContactDelete}
              loading={loading}
            />
          ) : (
            <div className="card h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-12 h-12 bg-primary-200 rounded-xl"></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Select a Contact</h3>
                <p className="text-slate-600">Choose a contact from the list to view their details, activities, and related information.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}