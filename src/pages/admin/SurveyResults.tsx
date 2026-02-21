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
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <PieChart size={20} className="text-primary-500" />
                                Ishtirokchi javoblari
                            </h3>
                            <div className="space-y-4">
                                {results.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">Hozircha javoblar yo'q</p>
                                ) : (
                                    results.slice(0, 5).map((resp, i) => (
                                        <div key={i} className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm font-medium text-gray-800">Xodim ID: {resp.employeeId}</p>
                                            <p className="text-xs text-gray-500 mt-1">Javob: {resp.answer}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-lg mb-4">Ishtirok Etish Ko'rsatkichi</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">IT Bo'limi</span>
                                        <span className="font-medium">95%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Sotuv Bo'limi</span>
                                        <span className="font-medium">82%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">HR Bo'limi</span>
                                        <span className="font-medium">100%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
