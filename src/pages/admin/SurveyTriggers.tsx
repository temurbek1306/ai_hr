import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Zap, Clock, Calendar } from 'lucide-react'
import Layout from '../../components/Layout'
import Button from '../../components/Button'

export default function SurveyTriggers() {
    const navigate = useNavigate()

    const triggers = [
        { id: 1, name: 'Onboarding 1-hafta', event: 'Xodim ishga kirgandan 7 kun o\'tib', survey: 'Onboarding Feedback', status: 'active' },
        { id: 2, name: 'Sinov muddati yakuni', event: 'Xodim ishga kirgandan 85 kun o\'tib', survey: 'Performance Review', status: 'active' },
        { id: 3, name: 'Tug\'ilgan kun tabrigi', event: 'Tug\'ilgan kun sanasida', survey: 'Wishes Survey', status: 'paused' },
    ]

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
                    <Button icon={<Plus size={20} />} onClick={() => alert('Yangi trigger qo\'shish (Mock)')}>
                        Yangi Trigger
                    </Button>
                </div>

                <div className="grid gap-4">
                    {triggers.map((trigger) => (
                        <div key={trigger.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${trigger.status === 'active' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{trigger.name}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {trigger.event}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            Target: {trigger.survey}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${trigger.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {trigger.status === 'active' ? 'Faol' : 'To\'xtatilgan'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}
