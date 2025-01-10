import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'

interface UserData {
  email: string;
  name: string;
}

interface EmailValidationDialogProps {
  isOpen: boolean;
  onValidUser: (userData: UserData) => void;
  onClose: () => void;
}

export function EmailValidationDialog({ isOpen, onValidUser, onClose }: EmailValidationDialogProps) {
  const [formData, setFormData] = useState<UserData>({
    email: '',
    name: ''
  });
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('Por favor, ingresa tu nombre')
      return
    }
    if (!validateEmail(formData.email)) {
      setError('Por favor, ingresa un correo electrónico válido')
      return
    }
    setError('')
    onValidUser(formData)
    onClose()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg p-6 w-[90vw] max-w-md">
          <Dialog.Title className="text-xl text-white mb-4">Bienvenido al Chat de Promtior</Dialog.Title>
          <Dialog.Description className="text-gray-300 mb-4">
            Por favor, ingresa tus datos para comenzar
          </Dialog.Description>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Tu nombre"
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="tu@email.com"
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Comenzar Chat
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}