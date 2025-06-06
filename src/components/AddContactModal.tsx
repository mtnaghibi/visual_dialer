import { useState, useRef, useEffect } from 'react'
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/solid'
import type { Contact } from '@/types'

interface AddContactModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (contact: Contact) => void
  editContact: Contact | null
}

interface FormErrors {
  name?: string
  phone?: string
  image?: string
}

export default function AddContactModal({ isOpen, onClose, onAdd, editContact }: AddContactModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editContact) {
      setName(editContact.name)
      setPhone(editContact.phone)
      setImageUrl(editContact.imageUrl)
    } else {
      setName('')
      setPhone('')
      setImageUrl('')
    }
    setErrors({})
    setTouched({})
  }, [editContact])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const validateField = (field: string, value: string) => {
    const newErrors: FormErrors = { ...errors }
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'نام مخاطب الزامی است'
        } else {
          delete newErrors.name
        }
        break
      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'شماره تلفن الزامی است'
        } else if (!/^[0-9]+$/.test(value)) {
          newErrors.phone = 'لطفاً فقط از اعداد انگلیسی استفاده کنید'
        } else {
          delete newErrors.phone
        }
        break
      case 'image':
        if (!editContact && !value) {
          newErrors.image = 'انتخاب تصویر الزامی است'
        } else {
          delete newErrors.image
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateForm = () => {
    // Set all fields as touched first
    setTouched({
      name: true,
      phone: true,
      image: true
    })

    // Validate all fields and update errors
    const newErrors: FormErrors = {}
    
    if (!name.trim()) {
      newErrors.name = 'نام مخاطب الزامی است'
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'شماره تلفن الزامی است'
    } else if (!/^[0-9]+$/.test(phone)) {
      newErrors.phone = 'لطفاً فقط از اعداد انگلیسی استفاده کنید'
    }
    
    if (!editContact && !imageUrl) {
      newErrors.image = 'انتخاب تصویر الزامی است'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    if (field === 'name') validateField('name', name)
    if (field === 'phone') validateField('phone', phone)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow English numbers (0-9)
    if (value === '' || /^[0-9]+$/.test(value)) {
      setPhone(value)
      if (touched.phone) validateField('phone', value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onAdd({
      id: editContact?.id || Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
      imageUrl: imageUrl || editContact?.imageUrl || '',
    })

    setName('')
    setPhone('')
    setImageUrl('')
    setErrors({})
    setTouched({})
    onClose()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setTouched(prev => ({ ...prev, image: true }))
    
    if (!file) {
      setImageUrl('')
      validateField('image', '')
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم تصویر نباید بیشتر از ۵ مگابایت باشد')
      setImageUrl('')
      validateField('image', '')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        const MAX_WIDTH = 1024
        const MAX_HEIGHT = 1024

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        const compressedImage = canvas.toDataURL('image/jpeg', 0.8)
        setImageUrl(compressedImage)
        validateField('image', compressedImage)
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overscroll-none"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {editContact ? 'ویرایش مخاطب' : 'افزودن مخاطب جدید'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -m-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="بستن"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col items-center">
            <div 
              className={`relative w-32 h-32 mb-2 rounded-2xl overflow-hidden cursor-pointer group touch-manipulation border-2 transition-colors
                ${touched.image && errors.image 
                  ? 'border-red-500 bg-red-50' 
                  : imageUrl 
                    ? 'border-indigo-500 bg-white' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
              onClick={() => {
                fileInputRef.current?.click()
                setTouched(prev => ({ ...prev, image: true }))
                validateField('image', imageUrl)
              }}
            >
              {imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="تصویر مخاطب"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PhotoIcon className="w-8 h-8 text-white" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <PhotoIcon className={`w-12 h-12 ${touched.image && errors.image ? 'text-red-400' : 'text-gray-400'}`} />
                  <span className={`text-xs ${touched.image && errors.image ? 'text-red-600' : 'text-gray-500'}`}>
                    انتخاب تصویر
                  </span>
                </div>
              )}
            </div>

            <input
              type="file"
              name="image"
              id="image"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              aria-label="انتخاب تصویر مخاطب"
            />

            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  fileInputRef.current?.click()
                  setTouched(prev => ({ ...prev, image: true }))
                  validateField('image', imageUrl)
                }}
                className={`text-sm font-medium hover:opacity-80 active:scale-95 transition-all
                  ${touched.image && errors.image ? 'text-red-600' : 'text-indigo-600'}`}
              >
                {imageUrl ? 'تغییر تصویر' : 'انتخاب تصویر'}
              </button>
              {touched.image && errors.image && (
                <p className="text-sm text-red-600 text-center">{errors.image}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                نام
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (touched.name) validateField('name', e.target.value)
                }}
                onBlur={() => handleBlur('name')}
                className={`w-full px-4 py-3 text-base sm:text-lg text-gray-900 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400
                  ${touched.name && errors.name 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'}`}
                placeholder="نام مخاطب را وارد کنید"
              />
              {touched.name && errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                شماره تلفن
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={phone}
                onChange={handlePhoneChange}
                onBlur={() => handleBlur('phone')}
                className={`w-full px-4 py-3 text-base sm:text-lg text-gray-900 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 dir-ltr
                  ${touched.phone && errors.phone 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'}`}
                placeholder="09123456789"
                dir="ltr"
              />
              {touched.phone && errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-indigo-600 text-white text-base sm:text-lg font-medium rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={Object.keys(errors).length > 0}
            >
              {editContact ? 'ویرایش' : 'افزودن'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 text-base sm:text-lg font-medium rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 