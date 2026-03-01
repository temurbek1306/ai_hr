import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { surveyTriggerService } from '../services/survey-trigger.service'

interface SurveyTriggerModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function SurveyTriggerModal({ isOpen, onClose, onSuccess }: SurveyTriggerModalProps) {
    const [name, setName] = useState('')
    const [event, setEvent] = useState('')
    const [surveyName, setSurveyName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim() || !event.trim() || !surveyName.trim()) {
            toast.error("Barcha maydonlarni to'ldiring")
            return
        }

        try {
            setIsLoading(true)
            await surveyTriggerService.create({
                name,
                event,
                surveyName
            })
            toast.success("Yangi trigger qo'shildi")
            onSuccess()
            onClose()
            // Reset form
            setName('')
            setEvent('')
            setSurveyName('')
        } catch (error: any) {
            toast.error(error.message || "Xatolik yuz berdi")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-display font-bold text-gray-900">Yangi Trigger Qo'shish</h2>
                        <p className="text-sm text-gray-500 mt-1">Yangi avtomatik qoida yarating</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Trigger nomi</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Masalan: Onboarding tugashi"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Hodisa (Event)</label>
                        <input
                            type="text"
                            value={event}
                            onChange={(e) => setEvent(e.target.value)}
                            placeholder="Masalan: Ishga kirgandan 30 kun o'tib"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Target So'rovnoma</label>
                        <input
                            type="text"
                            value={surveyName}
                            onChange={(e) => setSurveyName(e.target.value)}
                            placeholder="Qaysi so'rovnoma yuborilsin?"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Footer / Actions */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            disabled={isLoading}
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Saqlash"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
