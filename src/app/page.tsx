'use client'

import { useState, useEffect } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import AddContactModal from '@/components/AddContactModal'
import ContactCard from '@/components/ContactCard'
import type { Contact } from '@/types'

const STORAGE_KEY = 'visual_dialer_contacts'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  // Load contacts from localStorage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem(STORAGE_KEY)
    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts))
      } catch (error) {
        console.error('Failed to parse saved contacts:', error)
      }
    }
  }, [])

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts))
  }, [contacts])

  const handleAddContact = (contact: Contact) => {
    if (editingContact) {
      setContacts(prev => prev.map(c => c.id === editingContact.id ? contact : c))
      setEditingContact(null)
    } else {
      setContacts(prev => [...prev, contact])
    }
    setIsModalOpen(false)
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setIsModalOpen(true)
  }

  const handleDeleteContact = (id: string) => {
    if (window.confirm('آیا از حذف این مخاطب اطمینان دارید؟')) {
      setContacts(prev => prev.filter(c => c.id !== id))
    }
  }

  const handleCallContact = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-10 backdrop-blur-xl bg-white/80 border-b border-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              شماره‌گیر تصویری
            </h1>
            
            <div className="flex-1 w-full sm:w-auto">
              <input
                type="search"
                placeholder="جستجوی نام یا شماره..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 text-base text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all placeholder:text-gray-400"
              />
            </div>

            <button
              onClick={() => {
                setEditingContact(null)
                setIsModalOpen(true)
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="font-medium">افزودن مخاطب</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 px-4 pb-6">
        <div className="max-w-6xl mx-auto">
          {contacts.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-6">
                <PlusIcon className="w-10 h-10 text-indigo-600" />
              </div>
              <p className="text-xl text-gray-600 mb-6">هنوز هیچ مخاطبی اضافه نشده است</p>
              <button
                onClick={() => {
                  setEditingContact(null)
                  setIsModalOpen(true)
                }}
                className="inline-flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <PlusIcon className="w-5 h-5" />
                افزودن اولین مخاطب
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map(contact => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onCall={handleCallContact}
                  onDelete={handleDeleteContact}
                  onEdit={handleEditContact}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddContactModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingContact(null)
        }}
        onAdd={handleAddContact}
        editContact={editingContact}
      />
    </main>
  )
}
