import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Search, Filter } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Layout from '../../components/Layout'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { testService } from '../../services/test.service'

export default function TestResults() {
    const navigate = useNavigate()
    const { testId } = useParams()
    const [searchQuery, setSearchQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [testTitle, setTestTitle] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchResults = async () => {
            if (!testId) {
                setIsLoading(false)
                return
            }

            try {
                const data = await testService.getResults(testId)
                setTestTitle(data.testTitle)
                setResults(data.results)
            } catch (error) {
                console.error('Failed to fetch test results:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchResults()
    }, [testId])

    const filteredResults = results.filter(r =>
        !searchQuery || (r.employeeName || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/testing')}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-gray-900">
                                {testTitle || 'Test Natijalari'}
                            </h1>
                            <p className="text-gray-500 text-sm">Xodimlarning o'zlashtirish ko'rsatkichlari</p>
                        </div>
                    </div>
                    <Button variant="secondary" icon={<Download size={20} />} onClick={() => toast.success('Hisobot yuklanmoqda...')}>
                        Yuklab olish
                    </Button>
                </div>

                {/* Real computed stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 border-t-2 border-t-emerald-400">
                        <p className="text-gray-500 text-sm font-medium">O'rtacha Ball</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {results.length > 0
                                ? Math.round(results.reduce((sum: number, r: any) => sum + (r.score || 0), 0) / results.length)
                                : 0}%
                        </p>
                        <p className="text-green-600 text-sm mt-1">{results.length} ta natija</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 border-t-2 border-t-green-400">
                        <p className="text-gray-500 text-sm font-medium">O'tganlar / Yiqilganlar</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {results.filter((r: any) => r.passed).length}
                            <span className="text-gray-400 text-xl"> / {results.filter((r: any) => !r.passed).length}</span>
                        </p>
                        <p className="text-gray-400 text-sm mt-1">Jami {results.length} ta</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 border-t-2 border-t-blue-400">
                        <p className="text-gray-500 text-sm font-medium">O'tish darajasi</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {results.length > 0
                                ? Math.round((results.filter((r: any) => r.passed).length / results.length) * 100)
                                : 0}%
                        </p>
                        <p className="text-gray-400 text-sm mt-1">70% dan yuqori = o'tgan</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Xodim yoki test nomi bo'yicha qidirish..."
                                icon={<Search size={20} />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="secondary" icon={<Filter size={20} />}>
                            Filtrlar
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
                                <tr>
                                    <th className="px-6 py-4">Xodim</th>
                                    <th className="px-6 py-4">Topshirilgan Sana</th>
                                    <th className="px-6 py-4">Sarlavha</th>
                                    <th className="px-6 py-4">Natija</th>
                                    <th className="px-6 py-4">To'g'ri javoblar</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Yuklanmoqda...
                                        </td>
                                    </tr>
                                ) : filteredResults.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            {results.length === 0 ? 'Hali natijalar yo\'q' : 'Qidiruv bo\'yicha natija topilmadi'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredResults.map((res: any, index: number) => (
                                        <tr key={res.id || index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{res.employeeName}</td>
                                            <td className="px-6 py-4 text-gray-600">{res.completedAt}</td>
                                            <td className="px-6 py-4 text-gray-600">{res.testTitle}</td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">{res.score}%</td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {res.correctAnswers !== undefined && res.totalQuestions !== undefined
                                                    ? `${res.correctAnswers} / ${res.totalQuestions}`
                                                    : '-'
                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${res.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {res.passed ? 'O\'tdi' : 'Yiqildi'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
