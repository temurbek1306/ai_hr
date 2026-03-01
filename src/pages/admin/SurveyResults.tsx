import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download, PieChart, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Layout from '../../components/Layout'
import Button from '../../components/Button'
import { surveyService } from '../../services/survey.service'

export default function SurveyResults() {
    const navigate = useNavigate()
    const { surveyId } = useParams()
    const [results, setResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchResults = async () => {
            if (!surveyId) {
                setIsLoading(false)
                return
            }
            try {
                const data = await surveyService.getResponses(surveyId)
                setResults(data)
            } catch (error) {
                console.error('Failed to fetch survey results:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchResults()
    }, [surveyId])

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
                            <h1 className="text-2xl font-display font-bold text-gray-900">So'rovnoma Natijalari</h1>
                            <p className="text-gray-500 text-sm">Xodimlar qoniqishi va fikrlari tahlili</p>
                        </div>
                    </div>
                    <Button variant="secondary" icon={<Download size={20} />} onClick={() => toast.success('Hisobot yuklanmoqda...')}>
                        Yuklab olish
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Natijalar yuklanmoqda...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 border-t-2 border-t-emerald-400">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <PieChart size={20} className="text-emerald-500" />
                                Ishtirokchi javoblari
                            </h3>
                            <div className="space-y-3">
                                {results.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">Hozircha javoblar yo'q</p>
                                ) : (
                                    results.slice(0, 6).map((resp: any, i: number) => (
                                        <div key={i} className="p-3 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-colors">
                                            <p className="text-sm font-medium text-gray-800">
                                                {resp.employeeName || resp.employee?.fullName || resp.employee?.username || `Xodim #${resp.employeeId}`}
                                            </p>
                                            {resp.answer && (
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">Javob: {resp.answer}</p>
                                            )}
                                            {resp.submittedAt && (
                                                <p className="text-xs text-gray-400 mt-0.5">{new Date(resp.submittedAt).toLocaleDateString('uz-UZ')}</p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 border-t-2 border-t-blue-400">
                            <h3 className="font-semibold text-lg mb-4">Umumiy Ko'rsatkichlar</h3>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-gray-500">Jami javoblar</span>
                                    <span className="text-3xl font-bold text-gray-900">{results.length}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-gray-500">Noyob ishtirokchilar</span>
                                    <span className="text-2xl font-bold text-emerald-600">
                                        {new Set(results.map((r: any) => r.employeeId)).size}
                                    </span>
                                </div>
                                {results.length > 0 && (
                                    <div className="pt-2 border-t border-gray-100">
                                        <p className="text-xs text-gray-400">
                                            So'nggi javob: {(() => {
                                                const dates = results
                                                    .map((r: any) => r.submittedAt)
                                                    .filter(Boolean)
                                                    .map((d: string) => new Date(d))
                                                if (!dates.length) return '—'
                                                return new Date(Math.max(...dates.map((d: Date) => d.getTime()))).toLocaleDateString('uz-UZ')
                                            })()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
