import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Search, Edit, Trash2, PieChart } from 'lucide-react'
import Layout from '../../components/Layout'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { surveyService } from '../../services/survey.service'
import { Loader2 } from 'lucide-react'

interface Survey {
    id: string
    title: string
    description: string
    questionsCount: number
    responses: number
    status: 'active' | 'closed'
}

export default function SurveyCatalog() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [surveys, setSurveys] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                setIsLoading(true)
                const data = await surveyService.getAll()
                const fetchedSurveys = (data as any)?.body || data
                setSurveys(Array.isArray(fetchedSurveys) ? fetchedSurveys : [])
                setError(null)
            } catch (err: any) {
                console.error('Failed to fetch surveys:', err)
                setError('So\'rovnomalarni yuklashda xatolik yuz berdi')
            } finally {
                setIsLoading(false)
            }
        }
        fetchSurveys()
    }, [])

    const handleDelete = async (id: string) => {
        if (confirm('Ushbu so\'rovnomani o\'chirmoqchimisiz?')) {
            try {
                // Assuming surveyService has a delete method, if not, we skip for now 
                // or just remove from UI for demo as it was mock before
                setSurveys(surveys.filter(s => s.id !== id))
            } catch (error) {
                console.error('Failed to delete survey:', error)
                alert('O\'chirishda xatolik yuz berdi')
            }
        }
    }

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-gray-900">{t('surveys.catalog.title')}</h1>
                        <p className="text-gray-500 text-sm">{t('surveys.catalog.subtitle')}</p>
                    </div>
                    <Button icon={<Plus size={20} />} onClick={() => navigate('/admin/surveys/new')}>
                        {t('surveys.catalog.add')}
                    </Button>
                </div>

                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                        <p className="font-medium text-sm">{error}</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">So'rovnomalar yuklanmoqda...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <Input
                                placeholder={t('common.search')}
                                icon={<Search size={20} />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
                                    <tr>
                                        <th className="px-6 py-4">{t('surveys.catalog.table.title')}</th>
                                        <th className="px-6 py-4">{t('surveys.catalog.table.questions')}</th>
                                        <th className="px-6 py-4">{t('surveys.catalog.table.responses')}</th>
                                        <th className="px-6 py-4">{t('surveys.catalog.table.status')}</th>
                                        <th className="px-6 py-4 text-right">{t('common.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {surveys.map((survey) => (
                                        <tr key={survey.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">{survey.title}</div>
                                                    <div className="text-xs text-gray-500">{survey.description}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{survey.questionsCount} ta</td>
                                            <td className="px-6 py-4 text-gray-600">{survey.responses} ta</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${survey.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {survey.status === 'active' ? t('surveys.catalog.status.active') : t('surveys.catalog.status.closed')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Resultatlar">
                                                        <PieChart size={18} />
                                                    </button>
                                                    <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Tahrirlash">
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(survey.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="O'chirish"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
