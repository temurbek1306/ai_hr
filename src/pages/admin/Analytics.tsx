import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Users, Activity, Target, PieChart, Loader2, ArrowLeft } from 'lucide-react'
import Layout from '../../components/Layout'
import { analyticsService } from '../../services/analytics.service'
import StatCard from '../../components/StatCard'
import { useNavigate } from 'react-router-dom'

export default function Analytics() {
    const navigate = useNavigate()
    const [stats, setStats] = useState<any>(null)
    const [extended, setExtended] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const [overview, ext] = await Promise.all([
                    analyticsService.getOverview(),
                    analyticsService.getExtended().catch(() => null)
                ]);
                setStats(overview || {});
                setExtended(ext || null);
                setError(null);
            } catch (error: any) {
                console.error('Failed to fetch analytics:', error);
                setError('Analitika ma\'lumotlarini yuklashda xatolik yuz berdi.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <Layout>
            <div className="p-6 space-y-8">
                <header className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Analitika va ROI</h1>
                        <p className="text-gray-600">Onboarding samaradorligi va xodimlar rivojlanishi tahlili.</p>
                    </div>
                </header>

                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                        <p className="font-medium text-sm">{error}</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium font-display">Ma'lumotlar yuklanmoqda...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Summary Stats from real API */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                title="Jami xodimlar"
                                value={`${stats?.totalEmployees || 0}`}
                                change={stats?.totalEmployees > 0 ? `${stats.totalEmployees} ta xodim` : 'Ma\'lumot yo\'q'}
                                trend="up"
                                icon={Users}
                                color="primary"
                            />
                            <StatCard
                                title="Faol xodimlar"
                                value={`${stats?.activeEmployees || 0}`}
                                change={stats?.totalEmployees > 0
                                    ? `${Math.round(((stats.activeEmployees || 0) / stats.totalEmployees) * 100)}% faol`
                                    : 'Ma\'lumot yo\'q'}
                                trend="up"
                                icon={Activity}
                                color="green"
                            />
                            <StatCard
                                title="O'rtacha ball"
                                value={`${stats?.averageScore || 0}`}
                                change={
                                    !stats?.averageScore
                                        ? 'Hali test yo\'q'
                                        : stats.averageScore >= 70
                                            ? 'Yaxshi daraja'
                                            : 'O\'rtacha daraja'
                                }
                                trend={stats?.averageScore >= 70 ? 'up' : 'up'}
                                icon={Target}
                                color="orange"
                            />
                            <StatCard
                                title="Tugallangan testlar"
                                value={`${stats?.completedTestsCount || 0}`}
                                change={stats?.completedTestsCount > 0 ? `${stats.completedTestsCount} ta test` : 'Hali test yo\'q'}
                                trend="up"
                                icon={BarChart3}
                                color="purple"
                            />
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="grid lg:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card bg-white p-6 shadow-sm border border-gray-100"
                            >
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <Users className="text-indigo-500 w-5 h-5" />
                                    Bo'limlar bo'yicha samaradorlik
                                </h3>
                                <div className="space-y-4">
                                    {extended?.testPerformance?.length > 0 ? (
                                        extended.testPerformance.map((dept: any, i: number) => {
                                            const barColors = ['bg-green-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500']
                                            return (
                                                <div key={i} className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">{dept.department || 'Boshqa'}</span>
                                                        <span className="font-bold">{dept.avgScore}%</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${dept.avgScore}%` }}
                                                            transition={{ duration: 1, delay: i * 0.1 }}
                                                            className={`h-full ${barColors[i % barColors.length]}`}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : extended?.departments?.length > 0 ? (
                                        extended.departments.map((dept: any, i: number) => {
                                            const barColors = ['bg-green-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500']
                                            const pct = stats?.totalEmployees > 0 ? Math.round((dept.count / stats.totalEmployees) * 100) : 0
                                            return (
                                                <div key={i} className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">{dept.name}</span>
                                                        <span className="font-bold">{dept.count} ta</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${pct}%` }}
                                                            transition={{ duration: 1, delay: i * 0.1 }}
                                                            className={`h-full ${barColors[i % barColors.length]}`}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="py-8 text-center text-gray-400 text-sm">
                                            Bo'limlar bo'yicha ma'lumot yo'q
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="card bg-white p-6 shadow-sm border border-gray-100"
                            >
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <PieChart className="text-pink-500 w-5 h-5" />
                                    Xodimlar holati tahlili
                                </h3>
                                {(() => {
                                    const total = (extended?.onboardingStatus?.completed || 0) +
                                        (extended?.onboardingStatus?.inProgress || 0) +
                                        (extended?.onboardingStatus?.pending || 0)
                                    const completedPct = total > 0 ? Math.round((extended.onboardingStatus.completed / total) * 100) : 0
                                    const pendingPct = total > 0 ? Math.round((extended.onboardingStatus.pending / total) * 100) : 0
                                    return total > 0 ? (
                                        <>
                                            <div className="flex items-center justify-around h-36">
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-green-600">{completedPct}%</div>
                                                    <div className="text-xs text-gray-500 mt-1">Faol ({extended.onboardingStatus.completed} ta)</div>
                                                </div>
                                                <div className="w-28 h-28 rounded-full border-[10px] border-gray-100 border-t-green-500 border-r-indigo-500 border-b-yellow-400 border-l-red-400 rotate-45" />
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-gray-400">{pendingPct}%</div>
                                                    <div className="text-xs text-gray-500 mt-1">Nofaol ({extended.onboardingStatus.pending} ta)</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                                    Faol xodimlar
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                                    Nofaol xodimlar
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-8 text-center text-gray-400 text-sm">
                                            Xodimlar holati ma'lumoti yo'q
                                        </div>
                                    )
                                })()}
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
