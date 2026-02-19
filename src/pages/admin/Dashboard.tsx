import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Users, UserPlus, Clock, TrendingUp, BarChart3, Calendar, Bell, Search } from 'lucide-react'
import Layout from '../../components/Layout'
import StatCard from '../../components/StatCard'
import RecentActivity from '../../components/RecentActivity'
import FilterBar from '../../components/FilterBar'
import { dashboardService } from '../../services/dashboard.service'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function AdminDashboard() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState<any>(null)
    const [extendedStats, setExtendedStats] = useState<any>(null)
    const [activities, setActivities] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    // Filter states
    const [period, setPeriod] = useState('week')
    const [department, setDepartment] = useState('all')
    const [status, setStatus] = useState('all')

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                // Fetch dashboard data, summary, extended stats, and activities
                const [dashData, summaryData, extended, activityData] = await Promise.all([
                    dashboardService.getDashboard(),
                    dashboardService.getSummary(period, department, status),
                    dashboardService.getExtendedStats(),
                    dashboardService.getActivities()
                ]);
                setDashboardData({ ...dashData, ...summaryData });
                setExtendedStats(extended);
                setActivities(activityData);
                setError(null);
            } catch (error: any) {
                console.error('Failed to fetch dashboard data:', error);
                if (error.response?.status === 403) {
                    setError('Ruxsat yo\'q: 403 Forbidden. Iltimos, administrator huquqlarini tekshiring.');
                } else if (error.response?.status === 401) {
                    setError('Autentifikatsiya xatosi. Iltimos, qayta login qiling.');
                } else {
                    setError('Ma\'lumotlarni yuklashda xatolik yuz berdi.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, [period, department, status]);

    const stats = [
        {
            title: t('dashboard.stats.totalEmployees'),
            value: dashboardData?.totalEmployees?.toString() || '0',
            change: '+2',
            trend: 'up' as const,
            icon: Users,
            color: 'primary' as const,
        },
        {
            title: t('dashboard.stats.successfulPreTests'),
            value: extendedStats?.successfulPreTests?.toString() || '0',
            change: '+5%',
            trend: 'up' as const,
            icon: BarChart3,
            color: 'primary' as const,
        },
        {
            title: t('dashboard.stats.successfulPostTests'),
            value: extendedStats?.successfulPostTests?.toString() || '0',
            change: '+12%',
            trend: 'up' as const,
            icon: TrendingUp,
            color: 'green' as const,
        },
        {
            title: t('dashboard.stats.completedOnboarding'),
            value: extendedStats?.completedOnboardings?.toString() || '0',
            change: '+3',
            trend: 'up' as const,
            icon: Clock,
            color: 'yellow' as const,
        },
        {
            title: t('dashboard.stats.qualification'),
            value: extendedStats?.qualificationImprovements?.toString() || '0',
            change: '+2',
            trend: 'up' as const,
            icon: UserPlus,
            color: 'purple' as const,
        },
        {
            title: t('dashboard.stats.completedSurveys'),
            value: extendedStats?.completedSurveys?.toString() || '0',
            change: '+15',
            trend: 'up' as const,
            icon: Calendar,
            color: 'orange' as const,
        },
        {
            title: "Ta'tildagi xodimlar",
            value: dashboardData?.onLeave?.toString() || '0',
            change: '0',
            trend: 'up' as const,
            icon: Clock,
            color: 'secondary' as const,
        },
        {
            title: "Shu oyda qo'shilganlar",
            value: dashboardData?.newThisMonth?.toString() || '0',
            change: '+2',
            trend: 'up' as const,
            icon: UserPlus,
            color: 'primary' as const,
        },
    ]

    const quickActions = [
        { icon: UserPlus, label: t('dashboard.quickActions.addEmployee'), color: 'primary', path: '/admin/employees/new' },
        { icon: Search, label: t('dashboard.quickActions.search'), color: 'secondary', path: '/admin/employees' },
        { icon: BarChart3, label: t('dashboard.quickActions.reports'), color: 'yellow', path: '/admin/reports' },
        { icon: Calendar, label: t('dashboard.quickActions.calendar'), color: 'green', path: '/admin/calendar' },
    ]

    return (
        <Layout role="admin">
            <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold mb-1 text-gray-900">
                            {t('dashboard.title')}
                        </h1>
                        <p className="text-gray-600">
                            {t('dashboard.subtitle')}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="btn btn-ghost text-gray-600 hover:bg-gray-100">
                            <Bell className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/admin/employees/new')}
                            className="btn btn-primary"
                        >
                            <UserPlus className="w-5 h-5" />
                            {t('dashboard.quickActions.addEmployee')}
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <FilterBar
                    period={period}
                    department={department}
                    status={status}
                    onPeriodChange={setPeriod}
                    onDepartmentChange={setDepartment}
                    onStatusChange={setStatus}
                />

                {/* Stats Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                        <p className="font-medium text-sm">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <StatCard {...stat} />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Charts & Activity */}
                <div className="grid lg:grid-cols-3 gap-4">
                    {/* Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 card bg-white border border-gray-200 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-display font-semibold text-gray-900">
                                {t('dashboard.chart.title')}
                            </h3>
                        </div>
                        {/* Simple bar chart visualization */}
                        <div className="h-64 flex items-end justify-between gap-2">
                            {[65, 45, 78, 52, 88, 72, 95].map((height, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                        className="w-full bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-lg relative group cursor-pointer"
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                                            {height}%
                                        </div>
                                    </motion.div>
                                    <span className="text-xs text-gray-500">
                                        {['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'][index]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="card bg-white border border-gray-200 shadow-sm"
                    >
                        <h3 className="text-lg font-display font-semibold mb-6 text-gray-900">
                            {t('dashboard.activity.title')}
                        </h3>
                        <RecentActivity activities={activities} />
                        <button className="w-full mt-4 btn btn-ghost text-sm text-gray-600 hover:bg-gray-50">
                            {t('dashboard.activity.viewAll')}
                        </button>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="card bg-white border border-gray-200 shadow-sm"
                >
                    <h3 className="text-lg font-display font-semibold mb-6 text-gray-900">
                        {t('dashboard.quickActions.title')}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(action.path)}
                                className="card-hover text-center p-6 border border-gray-100 rounded-xl hover:border-primary-100 hover:bg-primary-50/30 transition-all"
                            >
                                <action.icon className={`w-8 h-8 mx-auto mb-3 text-${action.color}-500`} />
                                <p className="text-sm font-medium text-gray-700">{action.label}</p>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </Layout >
    )
}
