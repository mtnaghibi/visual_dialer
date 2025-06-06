import { TrashIcon, PhoneIcon, PencilIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import type { Contact } from '@/types'

interface ContactCardProps {
  contact: Contact
  onCall: (phone: string) => void
  onDelete: (id: string) => void
  onEdit: (contact: Contact) => void
}

export default function ContactCard({ contact, onCall, onDelete, onEdit }: ContactCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Contact Image */}
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={contact.imageUrl}
          alt={contact.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      {/* Contact Info */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 truncate">{contact.name}</h3>
        <p className="mt-1 text-gray-900 dir-ltr">{contact.phone}</p>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 flex items-center justify-between gap-2">
        <button
          onClick={() => onCall(contact.phone)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 active:scale-[0.98] transition-all"
          aria-label="تماس با مخاطب"
        >
          <PhoneIcon className="w-5 h-5" />
          <span>تماس</span>
        </button>
        <button
          onClick={() => onEdit(contact)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 active:scale-[0.98] transition-all"
          aria-label="ویرایش مخاطب"
        >
          <PencilIcon className="w-5 h-5" />
          <span>ویرایش</span>
        </button>
        <button
          onClick={() => onDelete(contact.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 active:scale-[0.98] transition-all"
          aria-label="حذف مخاطب"
        >
          <TrashIcon className="w-5 h-5" />
          <span>حذف</span>
        </button>
      </div>
    </div>
  )
} 