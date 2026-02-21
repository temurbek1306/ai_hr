import { useState, useEffect } from 'react'
import { X, Calendar as CalendarIcon, Type, AlignLeft } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Button from './Button'
import Input from './Input'
import Select from './Select'
import type { EventDto } from '../types/api.types'

interface EventModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (event: Omit<EventDto, 'id'>) => void
    initialDate?: string
}

export default function EventModal({ isOpen, onClose, onSave, initialDate }: EventModalProps) {
    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [type, setType] = useState('event')
    const [description, setDescription] = useState('')

    useEffect(() => {
        if (isOpen) {
            setDate(initialDate || new Date().toISOString().split('T')[0])
            setTitle('')
            setType('event')
            setDescription('')
        }
    }, [isOpen, initialDate])

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !date) return toast.error('Iltimos, barcha maydonlarni to\'ldiring')

        onSave({
            title,
            date,
            type: type as 'holiday' | 'birthday' | 'deadline' | 'event',
            description,
            createdBy: 'current-user' // Will be set by backend
        })
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-lg text-gray-900">Yangi Tadbir</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <Input
                        label="Nomi"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Tadbir nomini kiriting"
                        icon={<Type size={20} />}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sanasi</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-3 pl-10 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                    </div>

                    <Select
                        label="Turi"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        options={[
                            { value: 'event', label: 'Tadbir' },
                            { value: 'holiday', label: 'Bayram' },
                            { value: 'birthday', label: 'Tug\'ilgan kun' },
                            { value: 'deadline', label: 'Muddat (Deadline)' }
                        ]}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Izoh</label>
                        <div className="relative">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 pl-10 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all min-h-[100px]"
                                placeholder="Qo'shimcha ma'lumot..."
                            />
                            <AlignLeft className="absolute left-3 top-4 text-gray-400" size={20} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>Bekor qilish</Button>
                        <Button type="submit">Saqlash</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
