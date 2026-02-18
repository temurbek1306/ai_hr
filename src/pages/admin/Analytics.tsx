import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, Activity, Target, PieChart, Loader2 } from 'lucide-react'
import Layout from '../../components/Layout'
import { analyticsService } from '../../services/analytics.service'
import StatCard from '../../components/StatCard'

export default function Analytics() {
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const response = await analyticsService.getOverview();
                setStats(response || {});
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
                <header>
                    <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Analitika va ROI</h1>
                    <p className="text-gray-600">Onboarding samaradorligi va xodimlar rivojlanishi tahlili.</p>
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
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                title="Onboarding ROI"
                                value="2.4x"
                                change="+15%"
                                trend="up"
                                icon={TrendingUp}
                                color="green"
                            />
                            <StatCard
                                title="Xodimlar faolligi"
                                value={`${stats?.engagementRate || 84}%`}
                                change="+5%"
                                trend="up"
                                icon={Activity}
                                color="primary"
                            />
                            <StatCard
                                title="O'rtacha ball"
                                value={`${stats?.averageScore || 72}`}
                                change="-2%"
                                trend="down"
                                icon={Target}
                                color="orange"
                            />
                            <StatCard
                                title="Tugallangan testlar"
                                value={stats?.completedTestsCount || 156}
                                change="+24"
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
                                    {[
                                        { name: 'Texnik bo\'lim', score: 85, color: 'bg-green-500' },
                                        { name: 'Sotuv bo\'limi', score: 72, color: 'bg-blue-500' },
                                        { name: 'Marketing', score: 64, color: 'bg-indigo-500' },
                                        { name: 'Moliya', score: 91, color: 'bg-purple-500' }
                                    ].map((dept, i) => (
                                        <div key={i} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">{dept.name}</span>
                                                <span className="font-bold">{dept.score}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${dept.score}%` }}
                                                    transition={{ duration: 1, delay: i * 0.1 }}
                                                    className={`h-full ${dept.color}`}
                                                ></motion.div>
                                            </div>
                                        </div>
                                    ))}
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
                                    Onboarding statusi tahlili
                                </h3>
                                <div className="flex items-center justify-around h-48">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600">42%</div>
                                        <div className="text-xs text-gray-500">Muvaffaqiyatli</div>
                                    </div>
                                    <div className="w-32 h-32 rounded-full border-[12px] border-gray-100 border-t-green-500 border-r-indigo-500 border-b-yellow-500 border-l-red-500 rotate-45"></div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-gray-400">18%</div>
                                        <div className="text-xs text-gray-500">Kutilmoqda</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        Tugallangan
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                        Jarayonda
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
