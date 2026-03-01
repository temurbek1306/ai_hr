import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Zap, Clock, Calendar, Power, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Layout from '../../components/Layout'
import Button from '../../components/Button'
import { surveyTriggerService, SurveyTriggerDto } from '../../services/survey-trigger.service'
import SurveyTriggerModal from '../../components/SurveyTriggerModal'

export default function SurveyTriggers() {
    const navigate = useNavigate()
    const [triggers, setTriggers] = useState<SurveyTriggerDto[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchTriggers = async () => {
        try {
            setIsLoading(true)
            const data = await surveyTriggerService.getAll()
            setTriggers(data)
        } catch (error: any) {
            toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTriggers()
    }, [])

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        try {
            await surveyTriggerService.toggleStatus(id)
            setTriggers(triggers.map(t =>
                t.id === id ? { ...t, status: t.status === 'active' ? 'paused' : 'active' } : t
            ))
            toast.success(`Trigger ${currentStatus === 'active' ? "to'xtatildi" : "faollashtirildi"}`)
        } catch (error) {
            toast.error("Statusni o'zgartirishda xatolik")
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm("Rostdan ham ushbu triggerni o'chirmoqchimisiz?")) return
        try {
            await surveyTriggerService.delete(id)
            setTriggers(triggers.filter(t => t.id !== id))
            toast.success("Trigger o'chirildi")
        } catch (error) {
            toast.error("O'chirishda xatolik yuz berdi")
        }
    }

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/surveys')}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-gray-900">Triggerlar</h1>
                            <p className="text-gray-500 text-sm">Avtomatik so'rovnoma yuborish qoidalari</p>
                        </div>
                    </div>
                    <Button icon={<Plus size={20} />} onClick={() => setIsModalOpen(true)}>
                        Yangi Trigger
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    </div>
                ) : triggers.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-500">Hali hech qanday trigger qo'shilmagan.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {triggers.map((trigger) => (
                            <div key={trigger.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${trigger.status === 'active' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{trigger.name}</h3>
                                        <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-1.5 inline-flex">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-gray-400" />
                                                <span>{trigger.event}</span>
                                            </div>
                                            <div className="w-px h-4 bg-gray-300"></div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-gray-400" />
                                                Target: <span className="font-medium text-gray-700">{trigger.surveyName || (trigger as any).survey}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Action Buttons (visible on hover) */}
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleToggleStatus(trigger.id, trigger.status)}
                                            className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${trigger.status === 'active' ? 'text-amber-500' : 'text-emerald-500'}`}
                                            title={trigger.status === 'active' ? "To'xtatish" : "Faollashtirish"}
                                        >
                                            <Power size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(trigger.id)}
                                            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                            title="O'chirish"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trigger.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                        {trigger.status === 'active' ? 'Faol' : "To'xtatilgan"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <SurveyTriggerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchTriggers}
            />
        </Layout>
    )
}
