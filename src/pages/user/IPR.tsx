import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, TrendingUp, Award, BookOpen, Loader2, Calendar, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { analyticsService } from '../../services/analytics.service'

export default function IPR() {
    const navigate = useNavigate()
    const [summary, setSummary] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await analyticsService.getEmployeeSummary('me')
                setSummary(data)
            } catch (error) {
                console.error('Failed to fetch IPR summary:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchSummary()
    }, [])

    return (
        <Layout role="user">
            <div className="p-4 md:p-8 space-y-8">
                <header className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/user/dashboard')}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Shaxsiy Rivojlanish Rejasi (IPR)</h1>
                        <p className="text-gray-600">Sizning joriy kvartal uchun belgilangan maqsadlaringiz va o'sish ko'rsatkichlaringiz.</p>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Ma'lumotlar yuklanmoqda...</p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Summary Card */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="card bg-gradient-to-br from-indigo-600 to-primary-700 text-white p-6 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold">Joriy Holat</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-indigo-100 text-sm">Umumiy Ball</p>
                                        <p className="text-3xl font-bold">{summary?.totalPoints || 0} / 100</p>
                                    </div>
                                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white transition-all duration-1000"
                                            style={{ width: `${summary?.totalPoints || 0}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-indigo-100 italic">
                                        "{summary?.statusComment || "Siz o'z maqsadlaringiz sari yaxshi harakat qilyapsiz!"}"
                                    </p>
                                </div>
                            </div>

                            <div className="card p-6 space-y-4">
                                <h3 className="font-display font-bold text-gray-900 flex items-center gap-2">
                                    <TrendingUp className="text-green-500 w-5 h-5" />
                                    O'sish dinamikasi
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm text-gray-600">O'tgan oydan o'sish</span>
                                        <span className="text-green-600 font-bold">+12%</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm text-gray-600">Tugallangan kurslar</span>
                                        <span className="text-primary-600 font-bold">{summary?.completedCourses || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Goals/Tasks Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <h3 className="text-xl font-display font-bold text-gray-900">Belgilangan Maqsadlar</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {summary?.goals?.length > 0 ? summary.goals.map((goal: any, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="card p-5 border-l-4 border-l-primary-500"
                                    >
                                        <h4 className="font-bold text-gray-900 mb-1">{goal.title}</h4>
                                        <p className="text-sm text-gray-500 mb-4">{goal.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold px-2 py-1 bg-primary-50 text-primary-600 rounded">
                                                {goal.deadline}
                                            </span>
                                            <span className="text-sm font-bold text-gray-700">{goal.progress}%</span>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="sm:col-span-2 py-12 text-center bg-white/50 rounded-2xl border border-dashed border-gray-200">
                                        <Target className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-400">Hozircha maqsadlar belgilanmagan</p>
                                    </div>
                                )}
                            </div>

                            <div className="card p-6">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Calendar className="text-primary-500 w-5 h-5" />
                                    Yaqin haftadagi vazifalar
                                </h3>
                                <div className="space-y-3">
                                    {summary?.tasks?.length > 0 ? summary.tasks.map((task: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{task.title}</p>
                                                <p className="text-xs text-gray-500">{task.description}</p>
                                            </div>
                                            {task.completed ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Calendar className="w-5 h-5 text-gray-300" />}
                                        </div>
                                    )) : (
                                        <div className="py-6 text-center text-gray-400 text-sm">
                                            Vazifalar mavjud emas
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
